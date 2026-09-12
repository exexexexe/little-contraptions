/* ------------------------------------------------------------------ *
 *  The Chladni Plate — was /chladni/.
 *
 *  Moved across rather than rewritten: the word lists, the assembly and
 *  the room are the originals. The content is the toy, and retyping it
 *  is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCPart("chladni", "The Chladni Plate", "Fourteen thousand grains finding the lines that are not moving.", {
  "--shell-bg": "#0E0E10",
  "--shell-ink": "rgb(230, 228, 222)",
  "--shell-body": "\"Iowan Old Style\", \"Palatino Linotype\", \"Book Antiqua\", Palatino, Georgia, serif",
  "--shell-bar": "rgba(0,0,0,.24)",
  "--shell-rule": "rgba(128,128,128,.34)",
  "--shell-field": "rgba(127,127,127,.14)"
},
`

:root{
  --bg:#0E0E10;
  --bg-2:#17171A;
  --brass:#C9A227;
  --sand:#EBDFC2;
  --pale:#E6E4DE;
  --dim:#87847C;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --serif:"Iowan Old Style","Palatino Linotype","Book Antiqua",Palatino,Georgia,serif;
}
.room{
  background:radial-gradient(760px 620px at 50% 8%, var(--bg-2) 0%, var(--bg) 68%);
  color:var(--pale);font-family:var(--serif);
  padding:28px 16px 80px;display:flex;flex-direction:column;align-items:center;
}
.wrap{ max-width:640px;width:100% }
header{ text-align:center;margin-bottom:20px }
h1{
  font-family:var(--mono);font-size:clamp(16px,3.8vw,22px);margin:0;
  letter-spacing:.26em;text-transform:uppercase;color:var(--brass);font-weight:500;
}
.sub{ font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);margin-top:10px }

.plate{
  position:relative;aspect-ratio:1/1;width:100%;
  background:#1C1C1E;
  box-shadow:0 18px 44px rgba(0,0,0,.6), inset 0 0 0 1px rgba(201,162,39,.22);
}
canvas{ display:block;width:100%;height:100% }
.bolt{ position:absolute;width:9px;height:9px;border-radius:50%;background:#3A3A3C;box-shadow:inset 0 1px 0 #5A5A5C }
.bolt.a{ left:9px;top:9px } .bolt.b{ right:9px;top:9px }
.bolt.c{ left:9px;bottom:9px } .bolt.d{ right:9px;bottom:9px }

.controls{ margin-top:22px;display:flex;flex-direction:column;gap:14px }
.row{ display:flex;align-items:center;gap:14px;flex-wrap:wrap }
label{ font-family:var(--mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);flex:0 0 auto }
input[type=range]{ flex:1 1 200px;min-width:150px;accent-color:var(--brass) }
.readout{
  font-family:var(--mono);font-size:12px;letter-spacing:.08em;color:var(--pale);
  min-width:170px;text-align:right;font-variant-numeric:tabular-nums;
}
button{
  font-family:var(--mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;
  background:transparent;color:var(--brass);border:1px solid var(--brass);
  padding:10px 15px;cursor:pointer;
}
button:hover{ background:var(--brass);color:#17140A }
button:focus-visible{ outline:2px solid var(--pale);outline-offset:3px }

.note{
  margin-top:26px;font-size:13.5px;line-height:1.7;color:var(--dim);
}
.note b{ color:var(--pale);font-weight:600 }

/* --- touch targets (sweep) --- */
@media (pointer:coarse){
  #freq, #scatter, #sound{ min-height:44px }
}

/* A 38px pill is under the 44px a fingertip needs. */
@media (pointer:coarse){ #lc-back{ width:44px;height:44px } }
@media (max-width:520px){ #lc-back{ left:10px;bottom:10px } }
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

    root.innerHTML = "<div class=\"wrap\">\n  <header>\n    <h1>The Chladni Plate</h1>\n    <p class=\"sub\">Sand finds the parts that are not moving</p>\n  </header>\n\n  <div class=\"plate\">\n    <canvas id=\"plate\" width=\"620\" height=\"620\" role=\"img\"\n            aria-label=\"A square plate scattered with sand. As the frequency changes the sand collects along the lines that are not vibrating.\"></canvas>\n    <span class=\"bolt a\"></span><span class=\"bolt b\"></span>\n    <span class=\"bolt c\"></span><span class=\"bolt d\"></span>\n  </div>\n\n  <div class=\"controls\">\n    <div class=\"row\">\n      <label for=\"freq\">Frequency</label>\n      <input id=\"freq\" type=\"range\" min=\"0\" max=\"100\" value=\"18\" step=\"1\" aria-describedby=\"read\">\n      <span class=\"readout\" id=\"read\">\u2014</span>\n    </div>\n    <div class=\"row\">\n      <button id=\"scatter\" type=\"button\">Scatter the sand</button>\n      <button id=\"sound\" type=\"button\">Sound on</button>\n    </div>\n  </div>\n\n  <p class=\"note\">\n    The pattern is not decoration. Drive a plate at one of its resonant frequencies and parts of it\n    stand still while everything around them moves; sand skitters off the moving parts and piles up\n    along the still ones, so the <b>nodal lines</b> draw themselves. Ernst Chladni was doing this\n    with a violin bow in the 1780s.\n  </p>\n  <p class=\"note\">\n    These are the nodal lines of an <b>ideal square plate</b>, from the standard model\n    <span style=\"font-family:var(--mono);font-size:12.5px\">cos&#8202;n&pi;x&#8202;cos&#8202;m&pi;y &minus; cos&#8202;m&pi;x&#8202;cos&#8202;n&pi;y</span>,\n    and the frequency is scaled from the mode numbers so the slider covers an audible range.\n    A real plate of a particular size, thickness and metal has its own set of frequencies, and\n    they are not these \u2014 the shapes are the honest part, the numbers are a stand-in.\n  </p>\n</div>";

    
    (function(){
      'use strict';
    
      var cv = document.getElementById('plate');
      var ctx = cv.getContext('2d', { alpha: false });
      var W = cv.width, H = cv.height;
      var img = ctx.createImageData(W, H);
      var freqEl = document.getElementById('freq');
      var readEl = document.getElementById('read');
      var scatterBtn = document.getElementById('scatter');
      var soundBtn = document.getElementById('sound');
      var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    
      /* ---- the modes ---------------------------------------------------- *
       * A square plate's nodal figure needs two different mode numbers: with
       * m === n the expression is identically zero and there is no figure.
       * Ordered by m^2 + n^2, which is what sets the pitch on the ideal
       * plate, so sliding right really does mean "higher".                 */
      var MODES = [];
      for (var m = 1; m <= 8; m++){
        for (var n = m + 1; n <= 9; n++) MODES.push({ m: m, n: n, k: m * m + n * n });
      }
      MODES.sort(function(a, b){ return a.k - b.k; });
    
      var mode = MODES[0];
      function pickMode(v){
        var i = Math.min(MODES.length - 1, Math.round(v / 100 * (MODES.length - 1)));
        return MODES[i];
      }
      // scaled from the mode number into something a speaker can actually play
      function hzOf(md){ return Math.round(110 + md.k * 15.5); }
    
      /* ---- the sand ------------------------------------------------------ */
      var N = 14000;
      var px = new Float32Array(N), py = new Float32Array(N);
      function scatter(){
        for (var i = 0; i < N; i++){ px[i] = Math.random(); py[i] = Math.random(); }
      }
      scatter();
    
      // displacement of the plate at (x, y), both in 0..1
      function amp(x, y){
        var pm = Math.PI * mode.m, pn = Math.PI * mode.n;
        return Math.cos(pn * x) * Math.cos(pm * y) - Math.cos(pm * x) * Math.cos(pn * y);
      }
    
      /* Grains are thrown about in proportion to how hard the plate is moving
         under them, so they random-walk away from the antinodes and come to
         rest wherever the movement is nearly nothing. That is the whole
         mechanism — there is no attraction toward the lines. */
      function settle(steps){
        for (var s = 0; s < steps; s++){
          for (var i = 0; i < N; i++){
            var a = Math.abs(amp(px[i], py[i]));
            var kick = a * 0.019 + 0.0004;
            px[i] += (Math.random() - 0.5) * kick;
            py[i] += (Math.random() - 0.5) * kick;
            if (px[i] < 0.004) px[i] = 0.004; else if (px[i] > 0.996) px[i] = 0.996;
            if (py[i] < 0.004) py[i] = 0.004; else if (py[i] > 0.996) py[i] = 0.996;
          }
        }
      }
    
      var PLATE = [28, 28, 30], GRAIN = [235, 223, 194];
      function draw(){
        var d = img.data;
        for (var p = 0; p < d.length; p += 4){
          d[p] = PLATE[0]; d[p + 1] = PLATE[1]; d[p + 2] = PLATE[2]; d[p + 3] = 255;
        }
        for (var i = 0; i < N; i++){
          var x = (px[i] * W) | 0, y = (py[i] * H) | 0;
          var o = (y * W + x) * 4;
          // grains stack, so a pile reads brighter than a stray grain
          d[o]     = Math.min(255, d[o] + 78);
          d[o + 1] = Math.min(255, d[o + 1] + 74);
          d[o + 2] = Math.min(255, d[o + 2] + 62);
        }
        ctx.putImageData(img, 0, 0);
      }
    
      /* ---- sound --------------------------------------------------------- */
      var ac = null, osc = null, gain = null, soundOn = false;
      function ensureAudio(){
        if (ac) return true;
        try {
          ac = new (window.AudioContext || window.webkitAudioContext)();
          osc = ac.createOscillator(); osc.type = 'sine';
          gain = ac.createGain(); gain.gain.value = 0.0001;
          osc.connect(gain); gain.connect(ac.destination);
          osc.start();
          return true;
        } catch (e){ return false; }
      }
      function tune(){
        if (!ac) return;
        osc.frequency.setTargetAtTime(hzOf(mode), ac.currentTime, 0.04);
      }
      soundBtn.addEventListener('click', function(){
        if (!soundOn){
          if (!ensureAudio()){ soundBtn.textContent = 'no audio here'; soundBtn.disabled = true; return; }
          if (ac.state === 'suspended') ac.resume();
          soundOn = true;
          tune();
          gain.gain.setTargetAtTime(0.055, ac.currentTime, 0.06);
          soundBtn.textContent = 'Sound off';
        } else {
          soundOn = false;
          gain.gain.setTargetAtTime(0.0001, ac.currentTime, 0.06);
          soundBtn.textContent = 'Sound on';
        }
      });
    
      /* ---- wiring -------------------------------------------------------- */
      function setMode(md){
        mode = md;
        readEl.textContent = hzOf(md) + ' Hz  ·  mode ' + md.m + ',' + md.n;
        tune();
      }
    
      freqEl.addEventListener('input', function(){
        var next = pickMode(+freqEl.value);
        if (next !== mode){
          setMode(next);
          // a change of note throws everything loose again, as it does on a real plate
          for (var i = 0; i < N; i++){
            px[i] += (Math.random() - 0.5) * 0.09;
            py[i] += (Math.random() - 0.5) * 0.09;
          }
        }
      });
      scatterBtn.addEventListener('click', function(){ scatter(); });
    
      setMode(pickMode(+freqEl.value));
    
      var running = true;
      __add(document, 'visibilitychange', function(){
        var was = !running;
        running = !document.hidden;
        if (running && was) requestAnimationFrame(loop);
      });
      function loop(){
        if (!running) return;
        settle(calm ? 1 : 2);
        draw();
        requestAnimationFrame(loop);
      }
      settle(60);
      draw();
      requestAnimationFrame(loop);
    
      window.__chladni = function(){
        // how tightly the sand has gathered on the still parts
        var tot = 0;
        for (var i = 0; i < N; i++) tot += Math.abs(amp(px[i], py[i]));
        return { mode: mode.m + ',' + mode.n, hz: hzOf(mode), grains: N,
                 meanAmplitudeUnderSand: +(tot / N).toFixed(4), sound: soundOn };
      };
      window.__setFreq = function(v){ freqEl.value = v; freqEl.dispatchEvent(new Event('input')); };
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
