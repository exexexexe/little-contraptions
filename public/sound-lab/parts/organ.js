/* ------------------------------------------------------------------ *
 *  The Colour Organ — was /color-organ/.
 *
 *  Moved across rather than rewritten: the word lists, the assembly and
 *  the room are the originals. The content is the toy, and retyping it
 *  is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCPart("organ", "The Colour Organ", "A note is a colour. A chord is a room.", {
  "--shell-bg": "#08080A",
  "--shell-ink": "rgb(240, 237, 230)",
  "--shell-body": "\"Iowan Old Style\", \"Palatino Linotype\", \"Book Antiqua\", Palatino, Georgia, serif",
  "--shell-bar": "rgba(0,0,0,.24)",
  "--shell-rule": "rgba(128,128,128,.34)",
  "--shell-field": "rgba(127,127,127,.14)"
},
`

:root{
  --void:#08080A;
  --pale:#F0EDE6;
  --dim:#7E7A74;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --serif:"Iowan Old Style","Palatino Linotype","Book Antiqua",Palatino,Georgia,serif;
}
.room{
  background:var(--void);color:var(--pale);font-family:var(--serif);
  height:100%;overflow:hidden;
}
#bloom{ position:fixed;inset:0;display:block;width:100%;height:100% }

.hud{
  position:fixed;left:0;right:0;top:0;z-index:5;padding:20px 16px 0;text-align:center;
  pointer-events:none;
}
h1{
  font-family:var(--mono);font-size:clamp(14px,3.4vw,19px);margin:0;
  letter-spacing:.3em;text-transform:uppercase;font-weight:500;
  color:var(--pale);mix-blend-mode:difference;
}
.sub{
  font-family:var(--mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--dim);margin-top:10px;transition:opacity .8s;
}
.sub.gone{ opacity:0 }
.now{
  position:fixed;left:0;right:0;top:44%;text-align:center;z-index:5;pointer-events:none;
  font-family:var(--mono);font-size:clamp(40px,13vw,96px);font-weight:200;letter-spacing:.05em;
  mix-blend-mode:difference;color:#fff;opacity:0;transition:opacity .4s;
}
.now.on{ opacity:.92 }

/* the on-screen keyboard, so it is playable without a keyboard */
.keys{
  position:fixed;left:0;right:0;bottom:0;z-index:6;
  display:flex;gap:2px;padding:8px;justify-content:center;flex-wrap:wrap;
  background:linear-gradient(180deg,rgba(8,8,10,0),rgba(8,8,10,.9) 40%);
}
.key{
  flex:0 0 auto;width:38px;height:52px;border-radius:0 0 3px 3px;
  background:rgba(240,237,230,.09);border:1px solid rgba(240,237,230,.18);
  color:var(--pale);font-family:var(--mono);font-size:10px;
  display:flex;flex-direction:column;align-items:center;justify-content:flex-end;
  padding-bottom:7px;gap:3px;cursor:pointer;touch-action:manipulation;
  transition:background .1s, transform .1s;
}
.key b{ font-size:11px;font-weight:600;letter-spacing:.04em }
.key i{ font-style:normal;font-size:8.5px;color:var(--dim);letter-spacing:.06em }
.key.down{ transform:translateY(2px) }
.key:focus-visible{ outline:2px solid #fff;outline-offset:2px }
@media (max-width:640px){ .key{ width:30px;height:44px } }

/* The back pill lives top-left in this one, and on a narrow screen the
   centred title ran straight under it. */
@media (max-width:560px){ .hud{ padding-top:68px } }

/* A 38px pill is under the 44px a fingertip needs. */
@media (pointer:coarse){ #lc-back{ width:44px;height:44px } }
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

    root.innerHTML = "<canvas id=\"bloom\" aria-hidden=\"true\"></canvas>\n\n<div class=\"hud\">\n  <h1>The Colour Organ</h1>\n  <p class=\"sub\" id=\"sub\">Press any letter \u2014 or tap below</p>\n</div>\n<div class=\"now\" id=\"now\" aria-live=\"off\"></div>\n\n<div class=\"keys\" id=\"keys\"></div>";

    
    (function(){
      'use strict';
    
      var cv = document.getElementById('bloom');
      var ctx = cv.getContext('2d');
      var nowEl = document.getElementById('now');
      var subEl = document.getElementById('sub');
      var keysEl = document.getElementById('keys');
      var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    
      /* ---- the layout ---------------------------------------------------- *
       * Two rows of a chromatic scale, low on the left. Colour comes from the
       * pitch class, so the same note is always the same colour whichever
       * octave you play it in — which is the whole conceit of a colour organ,
       * and it goes back to Castel's ocular harpsichord in the 1730s.       */
      var ROWS = ['zxcvbnm,./', 'asdfghjkl;', 'qwertyuiop'];
      var NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
      var keys = {};
      ROWS.forEach(function(row, r){
        for (var i = 0; i < row.length; i++){
          var semi = r * 10 + i;                       // ten semitones per row, so rows overlap
          keys[row[i]] = { semi: semi, key: row[i] };
        }
      });
    
      function freqOf(semi){ return 130.81 * Math.pow(2, semi / 12); }   // from C3
      function hueOf(semi){ return ((semi % 12) + 12) % 12 * 30; }
      function nameOf(semi){
        var pc = ((semi % 12) + 12) % 12;
        return NAMES[pc] + (3 + Math.floor(semi / 12));
      }
    
      // build the on-screen keyboard
      ROWS.forEach(function(row){
        var wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;gap:2px;flex:1 0 100%;justify-content:center';
        for (var i = 0; i < row.length; i++){
          (function(ch){
            var k = document.createElement('button');
            k.className = 'key';
            k.type = 'button';
            k.dataset.k = ch;
            var semi = keys[ch].semi;
            k.innerHTML = '<b>' + nameOf(semi) + '</b><i>' + ch.toUpperCase() + '</i>';
            k.style.borderBottomColor = 'hsl(' + hueOf(semi) + ',72%,58%)';
            k.addEventListener('pointerdown', function(e){ e.preventDefault(); hit(ch); });
            wrap.appendChild(k);
          })(row[i]);
        }
        keysEl.appendChild(wrap);
      });
    
      /* ---- sound ---------------------------------------------------------- */
      var ac = null, out = null;
      function ensureAudio(){
        if (ac) return true;
        try {
          ac = new (window.AudioContext || window.webkitAudioContext)();
          var comp = ac.createDynamicsCompressor();
          comp.threshold.value = -16; comp.ratio.value = 6;
          out = ac.createGain(); out.gain.value = 0.42;
          out.connect(comp); comp.connect(ac.destination);
          return true;
        } catch (e){ return false; }
      }
      function play(semi){
        if (!ensureAudio()) return;
        if (ac.state === 'suspended') ac.resume();
        var f = freqOf(semi), t = ac.currentTime;
        var o = ac.createOscillator(); o.type = 'triangle'; o.frequency.value = f;
        var o2 = ac.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 2; 
        var g2 = ac.createGain(); g2.gain.value = 0.3;
        var g = ac.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.42, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.9);
        var f1 = ac.createBiquadFilter(); f1.type = 'lowpass';
        f1.frequency.setValueAtTime(f * 7, t);
        f1.frequency.exponentialRampToValueAtTime(Math.max(200, f * 1.6), t + 1.2);
        o.connect(f1); o2.connect(g2); g2.connect(f1);
        f1.connect(g); g.connect(out);
        o.start(t); o2.start(t);
        o.stop(t + 2); o2.stop(t + 2);
      }
    
      /* ---- the colour ------------------------------------------------------ */
      var blooms = [];
      var TOTAL = ROWS[0].length * 3;
      function hit(ch){
        var k = keys[ch];
        if (!k) return;
        play(k.semi);
        var span = 30;                                     // widest semitone in the layout
        blooms.push({
          x: (k.semi / span) * 0.8 + 0.1,
          y: 0.28 + (((k.semi % 12) / 12) * 0.42),
          hue: hueOf(k.semi), born: performance.now(),
          life: calm ? 900 : 1800
        });
        if (blooms.length > 40) blooms.shift();
        nowEl.textContent = nameOf(k.semi);
        nowEl.classList.add('on');
        clearTimeout(hit._t);
        hit._t = setTimeout(function(){ nowEl.classList.remove('on'); }, 700);
        subEl.classList.add('gone');
        var btn = keysEl.querySelector('[data-k="' + ch.replace(/["\\]/g, '\\$&') + '"]');
        if (btn){
          btn.classList.add('down');
          setTimeout(function(){ btn.classList.remove('down'); }, 130);
        }
      }
    
      var held = {};
      __add(window, 'keydown', function(e){
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        var ch = e.key.toLowerCase();
        if (!keys[ch]) return;
        e.preventDefault();
        if (held[ch]) return;                              // ignore auto-repeat
        held[ch] = true;
        hit(ch);
      });
      __add(window, 'keyup', function(e){ held[e.key.toLowerCase()] = false; });
    
      /* ---- drawing ---------------------------------------------------------- */
      var W = 0, H = 0, DPR = 1;
      function resize(){
        DPR = Math.min(2, window.devicePixelRatio || 1);
        W = cv.clientWidth; H = cv.clientHeight;
        cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      }
      __add(window, 'resize', resize);
      resize();
    
      function frame(now){
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#08080A';
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'lighter';
        for (var i = blooms.length - 1; i >= 0; i--){
          var b = blooms[i];
          var age = (now - b.born) / b.life;
          if (age >= 1){ blooms.splice(i, 1); continue; }
          var r = (0.1 + age * 0.5) * Math.max(W, H);
          var a = (1 - age) * (1 - age) * 0.55;
          var g = ctx.createRadialGradient(b.x * W, b.y * H, 0, b.x * W, b.y * H, r);
          g.addColorStop(0, 'hsla(' + b.hue + ',82%,60%,' + a.toFixed(3) + ')');
          g.addColorStop(0.5, 'hsla(' + b.hue + ',82%,52%,' + (a * 0.35).toFixed(3) + ')');
          g.addColorStop(1, 'hsla(' + b.hue + ',82%,48%,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(b.x * W, b.y * H, r, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    
      window.__organ = function(){
        return { blooms: blooms.length, keys: Object.keys(keys).length,
                 now: nowEl.textContent, audio: ac && ac.state };
      };
      window.__press = function(ch){ hit(ch); };
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
