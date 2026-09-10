/* ------------------------------------------------------------------ *
 *  Room Tone, as an engine.
 *
 *  The six ambient beds used to live inside /room-tone/index.html,
 *  tangled up with that page's buttons, meter and body tint. Two other
 *  things now want them — the desktop's rest mode, and the ambient
 *  soundtrack that follows the colour scheme — so the engine is here
 *  and the page is one of its callers rather than its owner.
 *
 *  What moved: SCENES, the six beds, the crossfade, the master and the
 *  reverb send. What did NOT move: anything that touches the DOM. This
 *  file draws nothing and reads no element. A page that wants chrome
 *  subscribes with on() and updates its own.
 *
 *  Nothing is sampled. Every source is an oscillator or a noise buffer
 *  generated in the browser, exactly as before — there is still no
 *  audio file anywhere in this repo.
 *
 *  Usage:
 *      LCRoomTone.available()        // false where there is no Web Audio
 *      LCRoomTone.scenes             // [{key,name,tint,desc,gear}, ...]
 *      LCRoomTone.play('rain')       // start, or crossfade from another
 *      LCRoomTone.stop()             // fade out and stop the sources
 *      LCRoomTone.setVolume(0.4)     // 0..1
 *      LCRoomTone.on(function(key){}) // key, or null when stopped
 *      LCRoomTone.analyser           // for a meter, once started
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  /* ================================================================== *
   *  Scene definitions.
   *
   *  Each one is a genuinely different graph. The bed is what runs
   *  continuously; the events are one-shot voices scheduled at their own
   *  rates.
   * ================================================================== */
  var SCENES = [
    { key:'library', name:'A Library, Late', tint:'#161320',
      desc:'Air handling, distant paper, the occasional chair. Almost nothing happens, which is the point.',
      gear:'pink noise · 420 Hz–3.4 kHz band · 50 Hz hum · rare transients' },
    { key:'rain', name:'Rain on a Window', tint:'#101821',
      desc:'A steady wash with individual drips on the glass, and thunder far enough away to be pleasant.',
      gear:'white noise · bandpass wash · pitched drips · thunder swells' },
    { key:'bridge', name:"A Ship's Bridge", tint:'#101A1C',
      desc:'A deep drive hum, the recyclers, and something politely reporting itself every few seconds.',
      gear:'detuned saws · 89 Hz drive · 2.4 kHz recyclers · periodic pings' },
    { key:'campfire', name:'A Fire Outside', tint:'#1C1512',
      desc:'Brown noise for the burn and a lot of small sharp things happening at once.',
      gear:'brown noise · crackle bursts · occasional pop' },
    { key:'underwater', name:'Somewhere Warm and Underwater', tint:'#111A22',
      desc:'The dreamy one. A slow detuned pad through a filter that keeps breathing, muffled the way a swimming pool muffles a summer afternoon.',
      gear:'detuned sines · slow filter LFO · long reverb · bubbles' },
    { key:'train', name:'A Night Train', tint:'#171319',
      desc:'Rail joints at a steady clip, a low rumble under it, and a horn now and then from the front of the train.',
      gear:'rhythmic noise bursts · 125 Hz rumble · horn chords' },
  ];

  /* ---- state ---- */
  var ctx = null, master = null, wet = null, analyser = null;
  var current = null, currentKey = null, timers = [], running = false;
  var vol = 0.62;                 // what the room-tone page's slider starts at
  var listeners = [];
  var A = null, NOISE = null;

  function notify(){
    for (var i = 0; i < listeners.length; i++) {
      // one bad listener must not stop the rest, or the audio
      try { listeners[i](currentKey); } catch (e) {}
    }
  }

  function init(){
    /* Not `LCAudio.get()` bare: if lc-audio.js failed to load at all that
       is a ReferenceError, not a falsy value, and this engine is now on
       the hub's desktop where a throw would take the whole shell with
       it. No audio is a state to report, not to crash on. */
    A = (window.LCAudio && LCAudio.get()) || null;
    if (!A) return false;
    ctx = A.ctx;
    NOISE = A.NOISE;

    master = A.gain(0);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.82;

    // this engine owns its own master so its fade in and out are its own,
    // and hangs it off the shared destination rather than the bench's
    // master gain, which other toys on other pages also use
    master.connect(analyser);
    analyser.connect(ctx.destination);

    // the shared reverb send, routed into this engine's master
    wet = A.gain(0.28);
    var conv = ctx.createConvolver();
    conv.buffer = A.makeIR(2.6, 2.4);
    wet.connect(conv); conv.connect(master);

    // the old debugging handle, kept: it is what the scene-difference
    // checks in earlier sessions reached for
    window.RoomTone = { ctx: ctx, analyser: analyser, scenes: SCENES,
                        play: play, stop: stopAll,
                        get current(){ return currentKey; } };
    return true;
  }

  /* ---- helpers ----
     Disconnecting a scene's output silences it but leaves its oscillators
     and looping buffers running for the life of the page. Every long-lived
     source is registered here so switching scenes actually stops the old
     one. */
  function reg(node) { if (current) current.sources.push(node); return node; }

  function noiseSource(kind){
    var s = ctx.createBufferSource();
    s.buffer = NOISE[kind]; s.loop = true; s.start();
    return reg(s);
  }

  /* a registered oscillator, NOT started for you — the beds start their
     own, which is how they were written */
  function osc(type, freq){
    var o = ctx.createOscillator();
    o.type = type; o.frequency.value = freq;
    return reg(o);
  }
  function filt(type, freq, q){ return A.filt(type, freq, q); }
  function gain(v){ return A.gain(v); }
  function chain(){ return A.chain.apply(null, arguments); }

  function every(msMin, msMax, fn){
    function go(){
      var t = setTimeout(function () { if (running) { fn(); go(); } },
                         msMin + Math.random() * (msMax - msMin));
      timers.push(t);
    }
    go();
  }
  function rnd(a, b){ return a + Math.random() * (b - a); }

  /* one-shot noise burst with an envelope — the workhorse for transients.
     Routed into the CURRENT SCENE's output, not the bench master, so a
     scene change takes its transients with it. The bench keeps its own
     reverb send, which is why `send` is not forwarded here. */
  function burst(kind, opts){
    var o = opts || {};
    A.burst(kind, {
      to: current.out, type: o.type, freq: o.freq, q: o.q,
      attack: o.attack, dur: o.dur, level: o.level
    });
  }

  /* one-shot pitched blip */
  function blip(freq, opts){
    var o = opts || {};
    var osc2 = ctx.createOscillator();
    osc2.type = o.type || 'sine';
    var now = ctx.currentTime;
    osc2.frequency.setValueAtTime(freq, now);
    if (o.glide) osc2.frequency.exponentialRampToValueAtTime(o.glide, now + (o.dur || 0.3));
    var g = gain(0);
    var dur = o.dur || 0.3;
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(o.level || 0.12, now + (o.attack || 0.01));
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    chain(osc2, g, current.out);
    if (o.send !== false) g.connect(wet);
    osc2.start(now);
    osc2.stop(now + dur + 0.05);
  }

  /* ================================================================== *
   *  The six beds
   * ================================================================== */
  var BUILD = {

    library: function(out){
      // barely-there air, a mains hum, and long silences
      chain(noiseSource('pink'), filt('highpass', 420), filt('lowpass', 3400), gain(0.032), out);
      var hum = osc('sine', 50);  chain(hum, gain(0.018), out); hum.start();
      var hum2 = osc('sine', 100); chain(hum2, gain(0.007), out); hum2.start();

      every(3200, 9000, function(){          // a page, or a sleeve on a desk
        burst('white', { freq: rnd(1900, 3600), q: 0.8, dur: rnd(0.05, 0.13),
                         level: rnd(0.020, 0.055), send: true });
      });
      every(11000, 26000, function(){        // a chair, a distant door
        burst('brown', { type:'lowpass', freq: rnd(160, 420), dur: rnd(0.18, 0.5),
                         level: rnd(0.05, 0.11), attack: 0.02, send: true });
      });
    },

    rain: function(out){
      // two layers of wash so it does not sit on one band
      chain(noiseSource('white'), filt('bandpass', 1400, 0.55), gain(0.30), out);
      chain(noiseSource('pink'),  filt('highpass', 2600), gain(0.16), out);
      chain(noiseSource('brown'), filt('lowpass', 220), gain(0.10), out);

      every(90, 420, function(){             // individual drips on the glass
        burst('white', { freq: rnd(2400, 6200), q: rnd(4, 12), dur: rnd(0.012, 0.05),
                         level: rnd(0.05, 0.16) });
      });
      every(17000, 44000, function(){        // thunder, a long way off
        var src = noiseSource('brown');
        var f = filt('lowpass', 150);
        var g = gain(0);
        var now = ctx.currentTime, dur = rnd(2.2, 4.4);
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(rnd(0.10, 0.24), now + rnd(0.35, 0.9));
        g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        chain(src, f, g, out); g.connect(wet);
        src.stop(now + dur + 0.1);
      });
    },

    bridge: function(out){
      // the drive: two saws a few cents apart, well below the vocal range
      [89, 89.7, 134].forEach(function(f, i){
        var o = osc(i === 2 ? 'triangle' : 'sawtooth', f);
        chain(o, filt('lowpass', 210), gain(i === 2 ? 0.090 : 0.135), out);
        o.start();
      });
      chain(noiseSource('white'), filt('bandpass', 2400, 1.1), gain(0.028), out); // recyclers

      // a slow breathing on the hiss, so it is not static
      var lfo = osc('sine', 0.06);
      var lg = gain(0.02); chain(lfo, lg); lfo.start();

      every(4200, 9000, function(){          // something reporting itself
        blip(rnd(1180, 1320), { dur: 0.16, level: 0.045, type: 'sine' });
      });
      every(9000, 21000, function(){         // a relay, somewhere behind a panel
        burst('white', { freq: rnd(700, 1500), q: 6, dur: 0.02, level: 0.05 });
      });
    },

    campfire: function(out){
      chain(noiseSource('brown'), filt('lowpass', 320), gain(0.15), out);   // the burn
      chain(noiseSource('pink'),  filt('bandpass', 2100, 0.8), gain(0.06), out);

      every(28, 150, function(){             // small crackles, constantly
        burst('white', { freq: rnd(1600, 5200), q: rnd(3, 10), dur: rnd(0.006, 0.03),
                         level: rnd(0.03, 0.13) });
      });
      every(1400, 5200, function(){          // a proper pop
        burst('white', { freq: rnd(500, 1400), q: 2.5, dur: rnd(0.04, 0.11),
                         level: rnd(0.12, 0.26), send: true });
      });
    },

    /* The nostalgia one. Warm, dreamy, and muffled the way water muffles. */
    underwater: function(out){
      var root = 110;
      [1, 1.005, 1.5, 2.002, 2.997].forEach(function(m, i){
        var o = osc('sine', root * m);
        var g = gain([0.075, 0.070, 0.040, 0.026, 0.016][i]);
        chain(o, g, out);
        g.connect(wet);                       // the pad sits mostly in the reverb
        o.start();
        // each partial drifts at its own rate, so the chord never quite settles
        var d = osc('sine', 0.03 + i * 0.017);
        var dg = gain(root * m * 0.004);
        chain(d, dg, o.frequency); d.start();
      });

      // one lowpass, breathing slowly: this is what makes it dreamy
      var lp = filt('lowpass', 460, 3.2);
      var swell = osc('sine', 0.055);
      var sg = gain(210);
      chain(swell, sg, lp.frequency); swell.start();
      chain(noiseSource('pink'), filt('lowpass', 700), gain(0.05), lp, out);

      every(2600, 8000, function(){          // bubbles, rising
        blip(rnd(320, 620), { glide: rnd(700, 1500), dur: rnd(0.16, 0.36),
                              level: rnd(0.020, 0.05) });
      });
    },

    train: function(out){
      chain(noiseSource('brown'), filt('lowpass', 125), gain(0.26), out);   // rumble
      chain(noiseSource('pink'),  filt('bandpass', 820, 0.9), gain(0.055), out);

      // rail joints: a steady pair-of-pairs, the way bogies actually pass them
      var beat = rnd(0.62, 0.74);
      var step = 0;
      (function clack(){
        if (!running) return;
        var gapAfter = (step % 4 === 1) ? beat * 0.9 : (step % 4 === 3 ? beat * 1.25 : beat * 0.22);
        burst('white', { type:'bandpass', freq: rnd(260, 540), q: 1.7,
                         dur: rnd(0.03, 0.06), level: rnd(0.14, 0.25), send: true });
        step++;
        timers.push(setTimeout(clack, gapAfter * 1000));
      })();

      every(26000, 60000, function(){        // the horn, from up front
        [1, 1.19, 1.5].forEach(function(m){
          var o = ctx.createOscillator(); o.type = 'sawtooth';
          o.frequency.value = 155 * m;
          var g = gain(0);
          var now = ctx.currentTime, dur = rnd(1.4, 2.4);
          g.gain.setValueAtTime(0, now);
          g.gain.linearRampToValueAtTime(0.030, now + 0.22);
          g.gain.setValueAtTime(0.030, now + dur * 0.62);
          g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
          chain(o, filt('lowpass', 900), g, out); g.connect(wet);
          o.start(now); o.stop(now + dur + 0.1);
        });
      });
    },
  };

  /* ---- scene switching, with a crossfade ---- */
  function stopScene(sc){
    if (!sc) return;
    var now = ctx.currentTime;
    sc.out.gain.cancelScheduledValues(now);
    sc.out.gain.setValueAtTime(sc.out.gain.value, now);
    sc.out.gain.linearRampToValueAtTime(0, now + 0.9);
    setTimeout(function(){
      try { sc.out.disconnect(); } catch (e) {}
      // stop the sources too, or every scene you visit keeps running silently
      (sc.sources || []).forEach(function(n){
        try { n.stop(); } catch (e) {}
        try { n.disconnect(); } catch (e) {}
      });
      sc.sources = [];
    }, 1400);
  }

  function play(key){
    if (!BUILD[key]) return false;
    if (!ctx && !init()) return false;        // no Web Audio here
    if (ctx.state === 'suspended') ctx.resume();

    timers.forEach(clearTimeout); timers = [];
    var old = current;
    running = true;

    var out = gain(0);
    out.connect(master);
    current = { out: out, key: key, sources: [] };
    currentKey = key;

    BUILD[key](out);

    var now = ctx.currentTime;
    out.gain.setValueAtTime(0, now);
    out.gain.linearRampToValueAtTime(1, now + 1.1);
    stopScene(old);

    // the fade the page used to do from setPower()
    master.gain.cancelScheduledValues(now);
    master.gain.linearRampToValueAtTime(vol, now + 0.6);

    notify();
    return true;
  }

  function stopAll(){
    running = false;
    timers.forEach(clearTimeout); timers = [];
    if (current) { stopScene(current); current = null; }
    currentKey = null;
    if (master) {
      var now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.linearRampToValueAtTime(0, now + 0.5);
    }
    notify();
  }

  function setVolume(v){
    vol = Math.max(0, Math.min(1, v));
    if (master && running) master.gain.value = vol;
  }

  window.LCRoomTone = {
    scenes: SCENES,
    play: play,
    stop: stopAll,
    setVolume: setVolume,
    on: function(fn){ if (typeof fn === 'function') listeners.push(fn); },
    scene: function(key){
      return SCENES.filter(function(s){ return s.key === key; })[0] || null;
    },
    available: function(){ return !!(window.LCAudio && LCAudio.available()); },
    get volume(){ return vol; },
    get running(){ return running; },
    get current(){ return currentKey; },
    get analyser(){ return analyser; },
  };
})();
