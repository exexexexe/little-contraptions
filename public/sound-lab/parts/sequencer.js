/* ------------------------------------------------------------------ *
 *  The Bouncing Sequencer — was /rhythm-sequencer/.
 *
 *  Moved across rather than rewritten: the word lists, the assembly and
 *  the room are the originals. The content is the toy, and retyping it
 *  is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCPart("sequencer", "The Bouncing Sequencer", "Balls, pegs, and whatever rhythm falls out.", {
  "--shell-bg": "#0A0D13",
  "--shell-ink": "rgb(232, 228, 218)",
  "--shell-body": "\"Iowan Old Style\", \"Palatino Linotype\", \"Book Antiqua\", Palatino, Georgia, serif",
  "--shell-bar": "rgba(0,0,0,.24)",
  "--shell-rule": "rgba(128,128,128,.34)",
  "--shell-field": "rgba(127,127,127,.14)"
},
`

:root{
  --bg:#0A0D13;
  --bg-2:#121722;
  --line:#2A3242;
  --pale:#E8E4DA;
  --dim:#7E8798;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --serif:"Iowan Old Style","Palatino Linotype","Book Antiqua",Palatino,Georgia,serif;
}
.room{
  background:radial-gradient(820px 660px at 50% 6%, var(--bg-2) 0%, var(--bg) 68%);
  color:var(--pale);font-family:var(--serif);
  padding:26px 16px 80px;display:flex;flex-direction:column;align-items:center;
}
.wrap{ max-width:660px;width:100% }
header{ text-align:center;margin-bottom:16px }
h1{
  font-family:var(--mono);font-size:clamp(16px,3.8vw,22px);margin:0;
  letter-spacing:.24em;text-transform:uppercase;color:#8FD8E8;font-weight:500;
}
.sub{ font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);margin-top:10px }

.box{
  position:relative;width:100%;aspect-ratio:3/4;margin-top:14px;
  background:linear-gradient(180deg,#0E131C,#080A0F);
  border:1px solid var(--line);cursor:crosshair;touch-action:none;overflow:hidden;
}
.box canvas{ position:absolute;inset:0;width:100%;height:100% }
.box .hint{
  position:absolute;left:0;right:0;top:44%;text-align:center;padding:0 24px;
  font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--dim);pointer-events:none;transition:opacity .6s;line-height:2;
}
.box .hint.gone{ opacity:0 }
.fail{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  padding:28px;text-align:center;font-size:14px;line-height:1.7;color:var(--dim);
  background:rgba(10,13,19,.94);
}
.fail[hidden]{ display:none }

.controls{ display:flex;gap:9px;margin-top:14px;flex-wrap:wrap;justify-content:center }
button{
  font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;
  background:transparent;color:#8FD8E8;border:1px solid rgba(143,216,232,.45);
  padding:10px 14px;cursor:pointer;
}
button:hover{ background:rgba(143,216,232,.14) }
button:focus-visible{ outline:2px solid var(--pale);outline-offset:3px }
button[aria-pressed=true]{ background:#8FD8E8;color:#0A1015 }
.stat{ font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);text-align:center;margin-top:14px }
.note{ margin-top:22px;font-size:13.5px;line-height:1.7;color:var(--dim) }

/* --- touch targets (sweep) --- */
@media (pointer:coarse){
  #auto, #clear, #drop, #sound{ min-height:44px }
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

    root.innerHTML = "<div class=\"wrap\">\n  <header>\n    <h1>The Bouncing Sequencer</h1>\n    <p class=\"sub\">Put a peg where you want a note</p>\n  </header>\n\n  <div class=\"box\" id=\"box\">\n    <canvas id=\"stage\"></canvas>\n    <div class=\"hint\" id=\"hint\">Tap anywhere to drop a peg<br>Balls fall on their own</div>\n    <div class=\"fail\" id=\"fail\" hidden></div>\n  </div>\n\n  <div class=\"controls\">\n    <button id=\"drop\" type=\"button\">Drop a ball</button>\n    <button id=\"auto\" type=\"button\" aria-pressed=\"true\">Auto</button>\n    <button id=\"clear\" type=\"button\">Clear pegs</button>\n    <button id=\"sound\" type=\"button\" aria-pressed=\"false\">Sound on</button>\n  </div>\n  <p class=\"stat\" id=\"stat\"></p>\n\n  <p class=\"note\">\n    Every peg is tuned by height \u2014 near the top it rings high, near the floor it is low \u2014 and all of\n    them are on the same pentatonic scale, which is why a mess of pegs still comes out sounding like\n    something rather than nothing. The rhythm is not sequenced anywhere. It is whatever falls out of\n    where you put them.\n  </p>\n</div>";

    
    (function(){
      'use strict';
    
      var box = document.getElementById('box');
      var cv = document.getElementById('stage');
      var ctx = cv.getContext('2d');
      var hint = document.getElementById('hint');
      var failEl = document.getElementById('fail');
      var statEl = document.getElementById('stat');
    
      if (!window.Matter){
        failEl.hidden = false;
        failEl.textContent = 'This one needs the physics library, and it did not load — it comes from a ' +
          'CDN and something in between blocked it. Nothing else in the cabinet depends on it.';
        hint.hidden = true;
        return;
      }
    
      var M = window.Matter;
      var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    
      /* ---- the world ---------------------------------------------------- *
       * Simulation runs in a fixed 300 x 400 space and is drawn scaled, so a
       * peg lands in the same place whatever size the window is.           */
      var SW = 300, SH = 400;
      var engine = M.Engine.create();
      engine.gravity.y = 0.85;
      var world = engine.world;
    
      var wallOpts = { isStatic: true, restitution: 0.5, friction: 0.02, render: { visible: false } };
      M.Composite.add(world, [
        M.Bodies.rectangle(SW / 2, -30, SW + 80, 40, wallOpts),
        M.Bodies.rectangle(-20, SH / 2, 40, SH * 2, wallOpts),
        M.Bodies.rectangle(SW + 20, SH / 2, 40, SH * 2, wallOpts)
      ]);
    
      var pegs = [], balls = [], hits = 0;
    
      /* ---- sound --------------------------------------------------------- */
      var ac = null, out = null, soundOn = false;
      var PENT = [0, 2, 4, 7, 9];                 // major pentatonic: no wrong notes
      function noteFor(y){
        // top of the box is high, floor is low
        var t = 1 - Math.min(1, Math.max(0, y / SH));
        var step = Math.round(t * 14);
        return 220 * Math.pow(2, (PENT[step % 5] + 12 * Math.floor(step / 5)) / 12);
      }
      function ensureAudio(){
        if (ac) return true;
        try {
          ac = new (window.AudioContext || window.webkitAudioContext)();
          var comp = ac.createDynamicsCompressor();
          out = ac.createGain(); out.gain.value = 0.5;
          out.connect(comp); comp.connect(ac.destination);
          return true;
        } catch (e){ return false; }
      }
      function ping(freq, vel){
        if (!soundOn || !ac) return;
        var o = ac.createOscillator(); o.type = 'triangle'; o.frequency.value = freq;
        var o2 = ac.createOscillator(); o2.type = 'sine'; o2.frequency.value = freq * 2.01;
        var g = ac.createGain();
        var level = Math.min(0.5, 0.08 + vel * 0.045);
        g.gain.setValueAtTime(0.0001, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(level, ac.currentTime + 0.006);
        g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 1.5);
        var g2 = ac.createGain(); g2.gain.value = 0.25;
        o.connect(g); o2.connect(g2); g2.connect(g); g.connect(out);
        o.start(); o2.start();
        o.stop(ac.currentTime + 1.6); o2.stop(ac.currentTime + 1.6);
      }
    
      /* ---- pegs and balls ------------------------------------------------ */
      var HUES = [188, 320, 42, 140, 265];
      function addPeg(x, y){
        if (pegs.length >= 60) return;
        var b = M.Bodies.circle(x, y, 7, { isStatic: true, restitution: 0.92, friction: 0.001 });
        b.plugin = { peg: true, freq: noteFor(y), hue: HUES[pegs.length % HUES.length], lit: 0 };
        pegs.push(b);
        M.Composite.add(world, b);
        hint.classList.add('gone');
      }
      function clearPegs(){
        pegs.forEach(function(p){ M.Composite.remove(world, p); });
        pegs = [];
      }
      function dropBall(){
        if (balls.length >= 26) return;
        var b = M.Bodies.circle(SW * (0.25 + Math.random() * 0.5), -12, 5.5,
          { restitution: 0.72, friction: 0.002, frictionAir: 0.004, density: 0.0016 });
        b.plugin = { ball: true, born: performance.now() };
        balls.push(b);
        M.Composite.add(world, b);
      }
    
      M.Events.on(engine, 'collisionStart', function(ev){
        for (var i = 0; i < ev.pairs.length; i++){
          var a = ev.pairs[i].bodyA, c = ev.pairs[i].bodyB;
          var peg = (a.plugin && a.plugin.peg) ? a : (c.plugin && c.plugin.peg) ? c : null;
          var ball = (a.plugin && a.plugin.ball) ? a : (c.plugin && c.plugin.ball) ? c : null;
          if (!peg || !ball) continue;
          var v = Math.hypot(ball.velocity.x, ball.velocity.y);
          peg.plugin.lit = 1;
          hits++;
          ping(peg.plugin.freq, v);
        }
      });
    
      /* ---- input --------------------------------------------------------- */
      function toWorld(e){
        var r = box.getBoundingClientRect();
        return { x: (e.clientX - r.left) / r.width * SW, y: (e.clientY - r.top) / r.height * SH };
      }
      box.addEventListener('pointerdown', function(e){
        var p = toWorld(e);
        // tapping an existing peg takes it out again
        for (var i = 0; i < pegs.length; i++){
          if (Math.hypot(pegs[i].position.x - p.x, pegs[i].position.y - p.y) < 12){
            M.Composite.remove(world, pegs[i]);
            pegs.splice(i, 1);
            return;
          }
        }
        if (!soundOn) toggleSound();
        addPeg(p.x, p.y);
      });
    
      function toggleSound(){
        if (!soundOn){
          if (!ensureAudio()){
            document.getElementById('sound').textContent = 'no audio';
            document.getElementById('sound').disabled = true;
            return;
          }
          if (ac.state === 'suspended') ac.resume();
          soundOn = true;
        } else soundOn = false;
        var b = document.getElementById('sound');
        b.setAttribute('aria-pressed', String(soundOn));
        b.textContent = soundOn ? 'Sound off' : 'Sound on';
      }
      document.getElementById('sound').addEventListener('click', toggleSound);
      document.getElementById('drop').addEventListener('click', function(){ if (!soundOn) toggleSound(); dropBall(); });
      document.getElementById('clear').addEventListener('click', clearPegs);
      var autoBtn = document.getElementById('auto');
      autoBtn.addEventListener('click', function(){
        var on = autoBtn.getAttribute('aria-pressed') !== 'true';
        autoBtn.setAttribute('aria-pressed', String(on));
      });
    
      /* ---- a starting arrangement, so it is never a blank box ------------ */
      [[80, 110], [150, 150], [220, 110], [110, 200], [190, 200], [150, 270], [70, 300], [230, 300]]
        .forEach(function(p){ addPeg(p[0], p[1]); });
      hint.classList.remove('gone');
    
      /* ---- loop ----------------------------------------------------------- */
      var W = 0, H = 0, DPR = 1;
      function resize(){
        DPR = Math.min(2, window.devicePixelRatio || 1);
        W = cv.clientWidth; H = cv.clientHeight;
        cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      }
      __add(window, 'resize', resize);
      resize();
    
      var lastDrop = 0, last = performance.now();
      function frame(now){
        var dt = Math.min(34, now - last); last = now;
        M.Engine.update(engine, dt);
    
        if (autoBtn.getAttribute('aria-pressed') === 'true' && now - lastDrop > 1150){
          lastDrop = now; dropBall();
        }
        // clear out anything that has left the box or overstayed
        for (var i = balls.length - 1; i >= 0; i--){
          if (balls[i].position.y > SH + 40 || now - balls[i].plugin.born > 26000){
            M.Composite.remove(world, balls[i]);
            balls.splice(i, 1);
          }
        }
    
        var sx = W / SW, sy = H / SH;
        ctx.clearRect(0, 0, W, H);
    
        pegs.forEach(function(p){
          var x = p.position.x * sx, y = p.position.y * sy, r = 7 * sx;
          if (p.plugin.lit > 0.01){
            var g = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
            g.addColorStop(0, 'hsla(' + p.plugin.hue + ',80%,64%,' + (p.plugin.lit * 0.55).toFixed(3) + ')');
            g.addColorStop(1, 'hsla(' + p.plugin.hue + ',80%,60%,0)');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(x, y, r * 5, 0, Math.PI * 2); ctx.fill();
          }
          ctx.fillStyle = 'hsl(' + p.plugin.hue + ',' + (34 + p.plugin.lit * 46) + '%,' +
                          (52 + p.plugin.lit * 30) + '%)';
          ctx.beginPath(); ctx.arc(x, y, r * (1 + p.plugin.lit * 0.28), 0, Math.PI * 2); ctx.fill();
          p.plugin.lit *= calm ? 0.6 : 0.9;
        });
    
        balls.forEach(function(b){
          var x = b.position.x * sx, y = b.position.y * sy;
          ctx.fillStyle = '#F2ECDC';
          ctx.beginPath(); ctx.arc(x, y, 5.5 * sx, 0, Math.PI * 2); ctx.fill();
        });
    
        statEl.textContent = pegs.length + ' pegs · ' + balls.length + ' balls · ' + hits + ' strikes';
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    
      window.__seq = function(){
        return { pegs: pegs.length, balls: balls.length, hits: hits, sound: soundOn,
                 matter: !!window.Matter };
      };
      window.__tap = function(fx, fy){
        var r = box.getBoundingClientRect();
        box.dispatchEvent(new PointerEvent('pointerdown', {
          clientX: r.left + r.width * fx, clientY: r.top + r.height * fy, bubbles: true }));
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
