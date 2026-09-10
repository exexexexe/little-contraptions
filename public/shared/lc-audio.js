/* ------------------------------------------------------------------ *
 *  The Web Audio bench.
 *
 *  Lifted out of Room Tone, which is where all of it was written and
 *  where the six ambient beds still live. It is here because several
 *  other things now want the same primitives — the snow globe wants a
 *  real ambient bed, and half a dozen generators want a one-shot sting
 *  on the button — and none of them should be carrying their own copy
 *  of a pink-noise generator.
 *
 *  Nothing in the cabinet is sampled. Every sound any of these toys make
 *  is an oscillator or a noise buffer generated here, in the browser, at
 *  the moment it is heard. There is no audio file anywhere in this repo
 *  and nothing is fetched to make a sound.
 *
 *  The context is created lazily and only ever on a real gesture, which
 *  is both the browser's rule and the polite one: opening a page in a
 *  background tab must not start an audio context.
 *
 *  Usage:
 *      var A = LCAudio.get();      // creates on first call
 *      A.resume();                 // from inside a click handler
 *      A.blip(880, { dur:.2 });
 *      var bed = A.bus();          // a gain node you can stop later
 *      A.chain(A.noise('pink'), A.filt('lowpass', 700), A.gain(.05), bed);
 *      bed.stopAll();
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var instance = null;

  function build() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;

    var ctx = new AC();
    var master = ctx.createGain();
    master.gain.value = 0.9;

    var conv = ctx.createConvolver();
    var wet = ctx.createGain();
    wet.gain.value = 0.25;
    wet.connect(conv);
    conv.connect(master);

    /* ---- the mute, where every toy passes through ---------------------- *
     *  The shared switch used to live only in LCSound.play(), so it only
     *  ever muted toys that asked their cues through it. Twenty-one toys
     *  build their noises straight off this bench — the aquarium's
     *  bubbles, the dominoes, the marble run, the reaction bench — and
     *  went on making them with the switch off, which is worse than not
     *  having a switch.
     *
     *  So the gate is here, between the bench master and the speakers,
     *  and it costs those toys nothing: they are already connected to it.
     *
     *  The preference is read from storage rather than from LCSound,
     *  because lc-sound.js loads after this file and calls into it —
     *  the dependency only runs one way. LCSound.set() pushes changes
     *  back through LCAudio.setMuted().
     *
     *  Note what this does NOT reach: anything hung directly off
     *  ctx.destination rather than off master. Room Tone's engine does
     *  exactly that, deliberately. An instrument you started yourself,
     *  with its own stop button and its own level, is not a cue being
     *  played at you, and silencing it from a switch on another page
     *  would read as a broken toy rather than a respected preference.
     * ------------------------------------------------------------------ */
    var gate = ctx.createGain();
    var muted = false;
    try { muted = localStorage.getItem('lc-sound') === 'off'; }
    catch (e) { /* private mode: sound stays on */ }
    gate.gain.value = muted ? 0 : 1;
    master.connect(gate);
    gate.connect(ctx.destination);

    var NOISE = {};

    /* Three noise colours, generated once and looped. Voss-McCartney-ish
       for pink: cheap, and the tilt is what matters, not the exactness. */
    function makeNoise(kind, seconds) {
      var len = Math.floor(ctx.sampleRate * seconds);
      var buf = ctx.createBuffer(1, len, ctx.sampleRate);
      var d = buf.getChannelData(0);
      if (kind === 'white') {
        for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      } else if (kind === 'pink') {
        var b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
        for (var j = 0; j < len; j++) {
          var w = Math.random() * 2 - 1;
          b0 = 0.99886*b0 + w*0.0555179; b1 = 0.99332*b1 + w*0.0750759;
          b2 = 0.96900*b2 + w*0.1538520; b3 = 0.86650*b3 + w*0.3104856;
          b4 = 0.55000*b4 + w*0.5329522; b5 = -0.7616*b5 - w*0.0168980;
          d[j] = (b0+b1+b2+b3+b4+b5+b6 + w*0.5362) * 0.11;
          b6 = w * 0.115926;
        }
      } else {                                   // brown
        var last = 0;
        for (var k = 0; k < len; k++) {
          var wn = Math.random() * 2 - 1;
          last = (last + 0.02 * wn) / 1.02;
          d[k] = last * 3.5;
        }
      }
      return buf;
    }

    /* A reverb impulse, also generated: decaying noise, two channels. */
    function makeIR(seconds, decay) {
      var len = Math.floor(ctx.sampleRate * seconds);
      var buf = ctx.createBuffer(2, len, ctx.sampleRate);
      for (var c = 0; c < 2; c++) {
        var d = buf.getChannelData(c);
        for (var i = 0; i < len; i++) {
          d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
        }
      }
      return buf;
    }

    NOISE.white = makeNoise('white', 3);
    NOISE.pink  = makeNoise('pink', 3);
    NOISE.brown = makeNoise('brown', 3);
    conv.buffer = makeIR(2.6, 2.4);

    /* ---- graph helpers ------------------------------------------- */

    function gain(v) { var g = ctx.createGain(); g.gain.value = v; return g; }
    function filt(type, freq, q) {
      var f = ctx.createBiquadFilter();
      f.type = type; f.frequency.value = freq;
      if (q != null) f.Q.value = q;
      return f;
    }
    function chain() {
      var ns = [].slice.call(arguments);
      for (var i = 0; i < ns.length - 1; i++) ns[i].connect(ns[i + 1]);
      return ns[ns.length - 1];
    }

    /* A bus: a gain node with a register of the long-lived sources feeding
       it. Disconnecting a bus silences it but leaves its oscillators and
       looping buffers running for the life of the page, which is a leak
       you cannot hear and therefore never notice. `stopAll()` is the fix,
       and it is why sources are made through a bus rather than loose. */
    function bus(level) {
      var out = gain(level == null ? 1 : level);
      out.connect(master);
      var sources = [];
      out.reg = function (n) { sources.push(n); return n; };
      out.noise = function (kind) {
        var s = ctx.createBufferSource();
        s.buffer = NOISE[kind] || NOISE.pink;
        s.loop = true; s.start();
        return out.reg(s);
      };
      out.osc = function (type, freq) {
        var o = ctx.createOscillator();
        o.type = type; o.frequency.value = freq;
        o.start();
        return out.reg(o);
      };
      out.send = wet;
      out.stopAll = function () {
        sources.forEach(function (n) { try { n.stop(); } catch (e) {} try { n.disconnect(); } catch (e) {} });
        sources.length = 0;
        try { out.disconnect(); } catch (e) {}
      };
      return out;
    }

    /* ---- one-shots ------------------------------------------------ */

    /* A filtered burst of noise with an envelope: the workhorse for a
       click, a crackle, a radio squelch, a footstep. */
    function burst(kind, o) {
      o = o || {};
      var dest = o.to || master;
      var src = ctx.createBufferSource();
      src.buffer = NOISE[kind] || NOISE.white;
      src.loop = true;
      var off = Math.random() * (src.buffer.duration - 0.2);
      var f = filt(o.type || 'bandpass', o.freq || 1200, o.q == null ? 1 : o.q);
      var g = gain(0);
      var now = ctx.currentTime + (o.at || 0);
      var atk = o.attack == null ? 0.004 : o.attack;
      var dur = o.dur || 0.09;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(o.level == null ? 0.2 : o.level, now + atk);
      g.gain.exponentialRampToValueAtTime(0.0001, now + atk + dur);
      chain(src, f, g, dest);
      if (o.reverb) g.connect(wet);
      src.start(now, off);
      src.stop(now + atk + dur + 0.05);
    }

    /* A pitched blip, optionally gliding. Everything with a note in it —
       a fanfare, a boop, a foghorn — is built out of these. */
    function blip(freq, o) {
      o = o || {};
      var dest = o.to || master;
      var osc = ctx.createOscillator();
      osc.type = o.type || 'sine';
      var now = ctx.currentTime + (o.at || 0);
      var dur = o.dur || 0.3;
      osc.frequency.setValueAtTime(freq, now);
      if (o.glide) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.glide), now + dur);
      var g = gain(0);
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(o.level == null ? 0.12 : o.level, now + (o.attack || 0.01));
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      var nodes = [osc];
      if (o.filter) nodes.push(filt(o.filter, o.filterFreq || 1200, o.q));
      nodes.push(g, dest);
      chain.apply(null, nodes);
      if (o.reverb !== false) g.connect(wet);
      osc.start(now);
      osc.stop(now + dur + 0.05);
    }

    /* A chord: several blips at once, given as frequencies or as
       semitone offsets from a root. */
    function chord(freqs, o) {
      o = o || {};
      freqs.forEach(function (f, i) {
        blip(f, Object.assign({}, o, {
          at: (o.at || 0) + i * (o.spread || 0),
          level: (o.level == null ? 0.09 : o.level) / Math.sqrt(freqs.length)
        }));
      });
    }

    /* Equal temperament from A440, so melodies can be written in
       semitones rather than in numbers nobody can read. */
    function note(semitonesFromA4) { return 440 * Math.pow(2, semitonesFromA4 / 12); }

    /* Play a little melody: [semitone, beats] pairs. Used by the snow
       globe for a public-domain carol, and by anything that wants a
       fanfare. */
    function melody(pairs, o) {
      o = o || {};
      var bpm = o.bpm || 100;
      var beat = 60 / bpm;
      var t = 0;
      pairs.forEach(function (p) {
        if (p[0] != null) {
          blip(note(p[0]), Object.assign({}, o, {
            at: t, dur: beat * p[1] * (o.legato == null ? 0.92 : o.legato)
          }));
        }
        t += beat * p[1];
      });
      return t;
    }

    return {
      ctx: ctx,
      master: master,
      gate: gate,
      wet: wet,
      NOISE: NOISE,
      resume: function () { if (ctx.state === 'suspended') ctx.resume(); return ctx.state; },
      gain: gain, filt: filt, chain: chain, bus: bus,
      burst: burst, blip: blip, chord: chord, note: note, melody: melody,
      makeNoise: makeNoise, makeIR: makeIR,
      rnd: function (a, b) { return a + Math.random() * (b - a); }
    };
  }

  /* One context per page, created on first ask. A page with sound off
     never creates one at all. */
  function get() {
    if (instance === null) {
      try { instance = build(); } catch (e) { instance = false; }
    }
    return instance || null;
  }

  /* The common case: a one-shot on a click, with the resume built in and
     the whole thing wrapped so no toy can be broken by an audio failure. */
  function sting(fn) {
    try {
      var A = get();
      if (!A) return;
      A.resume();
      fn(A);
    } catch (e) { /* no audio here; the rest of the page is unaffected */ }
  }

  /* Flip the gate. Called by LCSound.set(); a no-op when no context has
     been built yet, which is the common case — a page whose visitor has
     never made a sound has nothing to mute, and building a context here
     just to silence it would be the one thing the mute is meant to avoid. */
  function setMuted(on) {
    if (!instance) return;
    try {
      var g = instance.gate;
      var t = instance.ctx.currentTime;
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(g.gain.value, t);
      // a short ramp rather than a step: cutting a running voice to zero
      // instantly is a click, which is a noise made by the mute button
      g.gain.linearRampToValueAtTime(on ? 0 : 1, t + 0.04);
    } catch (e) { /* nothing to do about it, and nothing depends on it */ }
  }

  window.LCAudio = { get: get, sting: sting, setMuted: setMuted,
                     available: function () { return !!get(); } };
})();
