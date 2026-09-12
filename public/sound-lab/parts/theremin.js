/* ------------------------------------------------------------------ *
 *  The Theremin — was /theremin/.
 *
 *  Moved across rather than rewritten: the word lists, the assembly and
 *  the room are the originals. The content is the toy, and retyping it
 *  is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCPart("theremin", "The Theremin", "Pitch on one axis, volume on the other, and nothing to touch.", {
  "--shell-bg": "#0B0D12",
  "--shell-ink": "rgb(240, 232, 218)",
  "--shell-body": "\"Iowan Old Style\", \"Palatino Linotype\", \"Book Antiqua\", Palatino, Georgia, serif",
  "--shell-bar": "rgba(0,0,0,.24)",
  "--shell-rule": "rgba(128,128,128,.34)",
  "--shell-field": "rgba(127,127,127,.14)"
},
`

:root{
  --room:#0D0A08;
  --room-2:#181109;
  --wood:#6B4A24;
  --wood-2:#4A3116;
  --mint:#78E0C8;
  --brass:#D8B44A;
  --pale:#F0E8DA;
  --dim:#8A8074;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --serif:"Iowan Old Style","Palatino Linotype","Book Antiqua",Palatino,Georgia,serif;
}
.room{
  background:radial-gradient(800px 640px at 50% 30%, var(--room-2) 0%, var(--room) 70%);
  color:var(--pale);font-family:var(--serif);min-height:100%;
  display:flex;flex-direction:column;align-items:center;
  padding:26px 16px 80px;overflow-x:hidden;
}
.wrap{ max-width:720px;width:100% }
header{ text-align:center;margin-bottom:16px }
h1{
  font-family:var(--mono);font-size:clamp(16px,3.8vw,22px);margin:0;
  letter-spacing:.28em;text-transform:uppercase;color:var(--brass);font-weight:500;
}
.sub{ font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);margin-top:10px }

/* the field you play in */
.field{
  position:relative;width:100%;aspect-ratio:16/10;margin-top:16px;
  background:linear-gradient(180deg,#100C14,#080609);
  border:1px solid rgba(216,180,74,.22);
  cursor:crosshair;touch-action:none;overflow:hidden;
}
.field canvas{ position:absolute;inset:0;width:100%;height:100% }
.field .hint{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  font-family:var(--mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;
  color:var(--dim);pointer-events:none;transition:opacity .5s;text-align:center;padding:0 20px;
}
.field .hint.gone{ opacity:0 }
.axis{
  position:absolute;font-family:var(--mono);font-size:9px;letter-spacing:.16em;
  text-transform:uppercase;color:#5E574E;pointer-events:none;
}
.axis.x{ left:10px;bottom:8px } .axis.x2{ right:10px;bottom:8px }
.axis.y{ left:10px;top:8px } .axis.y2{ left:10px;bottom:24px }

/* the instrument */
.body{
  margin-top:0;height:64px;position:relative;
  background:linear-gradient(180deg,var(--wood),var(--wood-2));
  border:1px solid rgba(0,0,0,.5);border-top:0;
  display:flex;align-items:center;justify-content:space-between;padding:0 18px;
}
.readout{
  font-family:var(--mono);font-size:15px;letter-spacing:.1em;color:var(--mint);
  font-variant-numeric:tabular-nums;text-shadow:0 0 14px rgba(120,224,200,.4);
}
.readout small{ display:block;font-size:9px;letter-spacing:.2em;color:#B49A70;margin-top:4px;text-transform:uppercase }
.knobs{ display:flex;gap:9px;align-items:center;flex-wrap:wrap;justify-content:flex-end }
button, select{
  font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;
  background:rgba(0,0,0,.32);color:var(--brass);border:1px solid rgba(216,180,74,.45);
  padding:8px 11px;cursor:pointer;
}
button:hover, select:hover{ background:rgba(216,180,74,.16) }
button:focus-visible, select:focus-visible{ outline:2px solid var(--pale);outline-offset:2px }
button[aria-pressed=true]{ background:var(--brass);color:#20180A }

.note{ margin-top:24px;font-size:13.5px;line-height:1.7;color:var(--dim) }

/* --- touch targets (sweep) --- */
@media (pointer:coarse){
  #power, #snap, #wave{ min-height:44px }
}

/* A 38px pill is under the 44px a fingertip needs. */
@media (pointer:coarse){ #lc-back{ width:44px;height:44px } }
@media (max-width:560px){
  .body{ height:auto;padding:12px 14px;flex-direction:column;gap:11px;align-items:stretch }
  .knobs{ justify-content:center }
  .readout{ text-align:center }
}
@media print{ #lc-back{ display:none } }
@media (prefers-reduced-motion: reduce){ #lc-back{ transition:none } }

`,
  function (root) {
    var __off = [], __timers = [], __dead = false;
    function __add(t, ty, fn, o){ t.addEventListener(ty, fn, o); __off.push([t, ty, fn, o]); }
    function setTimeout(fn, ms){
      var id = window.setTimeout(function(){ if (!__dead) fn(); }, ms);
      __timers.push(id); return id;
    }
    function setInterval(fn, ms){
      var id = window.setInterval(function(){ if (!__dead) fn(); }, ms);
      __timers.push(id); return id;
    }
    function requestAnimationFrame(fn){
      return window.requestAnimationFrame(function(t){ if (!__dead) fn(t); });
    }

    /* These four own their AudioContext outright and run continuously —
       an oscillator left going when you switch instrument would follow
       you to the next one. window.AudioContext is patched for the life
       of this part so every context it opens is known, and closed on the
       way out. Restored on teardown, so nothing else is affected. */
    var __ctxs = [], __AC = window.AudioContext, __WAC = window.webkitAudioContext;
    function __track(C){ return function(){ var c = new C(); __ctxs.push(c); return c; }; }
    if (__AC) window.AudioContext = __track(__AC);
    if (__WAC) window.webkitAudioContext = __track(__WAC);

    root.innerHTML = "<div class=\"wrap\">\n  <header>\n    <h1>The Theremin</h1>\n    <p class=\"sub\">Played by not touching it</p>\n  </header>\n\n  <div class=\"field\" id=\"field\">\n    <canvas id=\"scope\"></canvas>\n    <span class=\"axis x\">low</span><span class=\"axis x2\">high</span>\n    <span class=\"axis y\">loud</span><span class=\"axis y2\">quiet</span>\n    <div class=\"hint\" id=\"hint\">Click, then move across \u2014 left to right for pitch, up and down for volume</div>\n  </div>\n\n  <div class=\"body\">\n    <div class=\"readout\" id=\"read\">\u2014<small id=\"hz\">silent</small></div>\n    <div class=\"knobs\">\n      <button id=\"snap\" type=\"button\" aria-pressed=\"false\">Snap to scale</button>\n      <select id=\"wave\" aria-label=\"Waveform\">\n        <option value=\"sine\">Sine</option>\n        <option value=\"triangle\">Triangle</option>\n        <option value=\"sawtooth\">Saw</option>\n        <option value=\"square\">Square</option>\n      </select>\n      <button id=\"power\" type=\"button\">Power</button>\n    </div>\n  </div>\n\n  <p class=\"note\">\n    A real theremin works by detuning: your hand is one plate of a capacitor, and moving it shifts an\n    oscillator against a fixed one. What you hear is the difference between the two. This one has no\n    antennae and no capacitance \u2014 the pointer does the job of both hands \u2014 but the awkward part is\n    faithful enough, which is that there are no frets, keys or stops anywhere, and every note in\n    between is available whether you wanted it or not.\n  </p>\n</div>";

    
    (function(){
      'use strict';
    
      var field = document.getElementById('field');
      var cv = document.getElementById('scope');
      var ctx = cv.getContext('2d');
      var readEl = document.getElementById('read');
      var hzEl = document.getElementById('hz');
      var hintEl = document.getElementById('hint');
      var powerBtn = document.getElementById('power');
      var snapBtn = document.getElementById('snap');
      var waveSel = document.getElementById('wave');
    
      var LOW = 98, HIGH = 1568;              // G2 to G6, a usable theremin range
      var NAMES = ['A','A#','B','C','C#','D','D#','E','F','F#','G','G#'];
    
      function noteOf(f){
        var n = Math.round(12 * Math.log2(f / 440));
        var name = NAMES[((n % 12) + 12) % 12];
        var octave = Math.floor((n + 9) / 12) + 4;
        return { name: name, octave: octave, exact: 440 * Math.pow(2, n / 12), n: n };
      }
    
      var W = 0, H = 0, DPR = 1;
      function resize(){
        DPR = Math.min(2, window.devicePixelRatio || 1);
        W = cv.clientWidth; H = cv.clientHeight;
        cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      }
      __add(window, 'resize', resize);
      resize();
    
      /* ---- the instrument ---------------------------------------------- */
      var ac = null, osc = null, osc2 = null, gain = null, filt = null, analyser = null,
          vib = null, vibGain = null, on = false, data = null;
    
      function build(){
        ac = new (window.AudioContext || window.webkitAudioContext)();
        osc = ac.createOscillator(); osc.type = waveSel.value;
        osc2 = ac.createOscillator(); osc2.type = 'sine'; osc2.detune.value = -6;
        gain = ac.createGain(); gain.gain.value = 0.0001;
        filt = ac.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 2600; filt.Q.value = 0.6;
        analyser = ac.createAnalyser(); analyser.fftSize = 2048;
        data = new Uint8Array(analyser.fftSize);
    
        // the wobble that makes a theremin sound like a theremin
        vib = ac.createOscillator(); vib.frequency.value = 5.2;
        vibGain = ac.createGain(); vibGain.gain.value = 4.5;
        vib.connect(vibGain); vibGain.connect(osc.detune); vibGain.connect(osc2.detune);
    
        var mix = ac.createGain(); mix.gain.value = 0.55;
        osc.connect(mix); osc2.connect(mix);
        mix.connect(filt); filt.connect(gain);
        gain.connect(analyser); analyser.connect(ac.destination);
        osc.start(); osc2.start(); vib.start();
      }
    
      var freq = 220, vol = 0, playing = false;
    
      function power(){
        if (!ac){
          try { build(); } catch (e){
            hintEl.textContent = 'This browser will not give the page an audio engine.';
            return;
          }
        }
        on = !on;
        powerBtn.setAttribute('aria-pressed', String(on));
        if (on){
          if (ac.state === 'suspended') ac.resume();
          hintEl.classList.add('gone');
        } else {
          gain.gain.setTargetAtTime(0.0001, ac.currentTime, 0.05);
          hzEl.textContent = 'silent';
        }
      }
      powerBtn.addEventListener('click', power);
    
      snapBtn.addEventListener('click', function(){
        snapBtn.setAttribute('aria-pressed', snapBtn.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      });
      waveSel.addEventListener('change', function(){ if (osc) osc.type = waveSel.value; });
    
      function play(e){
        var r = field.getBoundingClientRect();
        var x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        var y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    
        // pitch is logarithmic across the width, which is what makes the middle
        // of the field musically useful rather than crammed into one end
        freq = LOW * Math.pow(HIGH / LOW, x);
        if (snapBtn.getAttribute('aria-pressed') === 'true') freq = noteOf(freq).exact;
        vol = (1 - y) * 0.34;
        playing = true;
    
        if (!on || !ac) return;
        osc.frequency.setTargetAtTime(freq, ac.currentTime, 0.012);
        osc2.frequency.setTargetAtTime(freq * 2.0, ac.currentTime, 0.012);
        filt.frequency.setTargetAtTime(900 + freq * 2.4, ac.currentTime, 0.03);
        gain.gain.setTargetAtTime(vol, ac.currentTime, 0.02);
    
        var nt = noteOf(freq);
        readEl.childNodes[0].nodeValue = nt.name + nt.octave;
        hzEl.textContent = Math.round(freq) + ' Hz';
      }
    
      field.addEventListener('pointermove', play);
      field.addEventListener('pointerdown', function(e){
        field.setPointerCapture(e.pointerId);
        if (!on) power();
        play(e);
      });
      field.addEventListener('pointerleave', function(){
        playing = false;
        if (on && ac) gain.gain.setTargetAtTime(0.0001, ac.currentTime, 0.09);
        hzEl.textContent = on ? 'waiting' : 'silent';
      });
    
      /* ---- the scope ---------------------------------------------------- */
      var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
      function frame(){
        ctx.clearRect(0, 0, W, H);
    
        // the field's own faint grid, so there is something to aim at
        ctx.strokeStyle = 'rgba(216,180,74,.07)';
        ctx.lineWidth = 1;
        for (var i = 1; i < 8; i++){
          ctx.beginPath(); ctx.moveTo(W * i / 8, 0); ctx.lineTo(W * i / 8, H); ctx.stroke();
        }
        for (var j = 1; j < 5; j++){
          ctx.beginPath(); ctx.moveTo(0, H * j / 5); ctx.lineTo(W, H * j / 5); ctx.stroke();
        }
    
        if (analyser && on){
          analyser.getByteTimeDomainData(data);
          ctx.strokeStyle = 'rgba(120,224,200,' + (0.35 + vol * 1.6).toFixed(2) + ')';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (var k = 0; k < data.length; k += 2){
            var v = (data[k] - 128) / 128;
            var px = k / data.length * W;
            var py = H / 2 + v * H * 0.42;
            k ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
          }
          ctx.stroke();
        }
        requestAnimationFrame(frame);
      }
      if (!calm) requestAnimationFrame(frame);
      else frame();
    
      window.__theremin = function(){
        return { on: on, freq: Math.round(freq), note: noteOf(freq).name + noteOf(freq).octave,
                 vol: +vol.toFixed(3), state: ac && ac.state,
                 snap: snapBtn.getAttribute('aria-pressed') === 'true', wave: waveSel.value };
      };
      window.__move = function(fx, fy){
        var r = field.getBoundingClientRect();
        play({ clientX: r.left + r.width * fx, clientY: r.top + r.height * fy });
      };
    })();
    

    return function () {
      __dead = true;
      __off.forEach(function (r) { try { r[0].removeEventListener(r[1], r[2], r[3]); } catch (e) {} });
      __timers.forEach(function (id) { try { window.clearTimeout(id); window.clearInterval(id); } catch (e) {} });
      __off = []; __timers = [];
      if (__AC) window.AudioContext = __AC;
      if (__WAC) window.webkitAudioContext = __WAC;
      __ctxs.forEach(function (c) { try { c.close(); } catch (e) {} });
      __ctxs = [];

    };
  });
