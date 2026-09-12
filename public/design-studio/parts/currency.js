/* ------------------------------------------------------------------ *
 *  The Mint — was /design-currency/.
 *
 *  Moved across rather than rewritten: the word lists, the assembly and
 *  the room are the originals. The content is the toy, and retyping it
 *  is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCPart("currency", "The Mint", "An engraver's bench and a note that tilts in the light.", {
  "--shell-bg": "#0B1512",
  "--shell-ink": "rgb(234, 242, 237)",
  "--shell-body": "Didot, \"Bodoni 72\", \"Bodoni MT\", \"Playfair Display\", Georgia, serif",
  "--shell-bar": "rgba(0,0,0,.24)",
  "--shell-rule": "rgba(128,128,128,.34)",
  "--shell-field": "rgba(127,127,127,.14)"
},
`

:root{
  --bg:#0B1512;
  --bg-2:#132420;
  --mint:#6FD8A8;
  --pale:#EAF2ED;
  --dim:#88A096;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --serif:Didot,"Bodoni 72","Bodoni MT","Playfair Display",Georgia,serif;
}
/* the security thread: a band of light travelling across the note, which
   is the thing everybody does when handed an unfamiliar banknote */
.note-wrap{ position:relative;overflow:hidden }
.note-wrap.tilt::after{
  content:"";position:absolute;inset:0;pointer-events:none;z-index:3;
  background:linear-gradient(102deg, transparent 38%, rgba(255,255,255,.32) 48%,
             rgba(190,225,255,.22) 53%, transparent 62%);
  animation:tilt .8s ease-out;
}
@keyframes tilt{ from{ transform:translateX(-110%) } to{ transform:translateX(110%) } }
@media (prefers-reduced-motion: reduce){ .note-wrap.tilt::after{ animation:none } }
/* An engraver's bench at the mint: cold rolled steel, a guilloche rosette
   turned into the surface, and the blue-white light people who cut dies
   insist on working under. */
.room{
  background:
    radial-gradient(600px 420px at 50% -6%, rgba(200,225,255,.10), transparent 64%),
    repeating-conic-gradient(from 0deg at 50% 42%,
      rgba(190,205,220,.028) 0deg 2deg, transparent 2deg 4deg),
    repeating-linear-gradient(22deg, rgba(255,255,255,.018) 0 1px, transparent 1px 7px),
    linear-gradient(180deg,#252A31 0%,#1A1E24 62%,#12151A 100%);
  color:var(--pale);font-family:var(--serif);
  padding:30px 16px 80px;display:flex;flex-direction:column;align-items:center;
}
/* the rosette the plate is being cut from, ghosted behind everything */
body::before{
  content:"";position:fixed;left:50%;top:34%;width:min(620px,90vw);aspect-ratio:1;
  transform:translate(-50%,-50%);z-index:0;pointer-events:none;opacity:.10;
  background:
    repeating-conic-gradient(from 0deg at 50% 50%,
      rgba(200,220,240,.9) 0deg .35deg, transparent .35deg 3deg),
    repeating-radial-gradient(circle at 50% 50%,
      rgba(200,220,240,.7) 0 1px, transparent 1px 13px);
  border-radius:50%;
  -webkit-mask-image:radial-gradient(circle, #000 38%, transparent 72%);
          mask-image:radial-gradient(circle, #000 38%, transparent 72%);
}
.wrap, footer{ position:relative;z-index:1 }
.wrap{ max-width:720px;width:100% }
header{ text-align:center;margin-bottom:20px }
h1{
  font-family:var(--mono);font-size:clamp(15px,3.6vw,21px);margin:0;
  letter-spacing:.26em;text-transform:uppercase;color:var(--mint);font-weight:500;
}
.sub{ font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);margin-top:10px }

.fields{ display:grid;grid-template-columns:2fr 1fr;gap:8px;margin-bottom:8px }
input{
  font-family:var(--serif);font-size:16px;min-width:0;
  background:rgba(234,242,237,.06);color:var(--pale);
  border:1px solid rgba(111,216,168,.32);padding:13px 14px;border-radius:2px;
}
input::placeholder{ color:#6E8279 }
input:focus{ outline:none;border-color:var(--mint) }
.row{ display:flex;gap:8px;flex-wrap:wrap;margin-top:8px }
button{
  font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;
  background:transparent;color:var(--mint);border:1px solid var(--mint);
  padding:13px 16px;cursor:pointer;flex:1 1 auto;
}
button:hover{ background:var(--mint);color:#0B1512 }
button:focus-visible{ outline:2px solid var(--pale);outline-offset:3px }
button.sec{ color:var(--dim);border-color:rgba(234,242,237,.25) }
button.sec:hover{ background:rgba(234,242,237,.12);color:var(--pale) }

.note-wrap{ display:flex;justify-content:center;padding:24px 0 6px }
canvas{ display:block;width:100%;max-width:660px;height:auto;
  box-shadow:0 16px 40px rgba(0,0,0,.6);border-radius:3px }
.note{ margin-top:22px;font-size:13.5px;line-height:1.7;color:var(--dim) }

/* A 38px pill is under the 44px a fingertip needs. */
@media (pointer:coarse){ #lc-back{ width:44px;height:44px } }
@media (max-width:560px){ #lc-back{ left:10px;bottom:10px } .fields{ grid-template-columns:1fr } }
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

    root.innerHTML = "<div class=\"wrap\">\n  <header>\n    <h1>The Mint</h1>\n    <p class=\"sub\">Legal tender nowhere at all</p>\n  </header>\n\n  <div class=\"fields\">\n    <input id=\"country\" type=\"text\" maxlength=\"26\" autocomplete=\"off\"\n           placeholder=\"Name of the state\" aria-label=\"Name of the state\">\n    <input id=\"denom\" type=\"text\" maxlength=\"7\" autocomplete=\"off\"\n           placeholder=\"Denomination\" aria-label=\"Denomination\" inputmode=\"numeric\">\n  </div>\n  <div class=\"row\">\n    <button id=\"print\" type=\"button\">Strike the note</button>\n    <button class=\"sec\" id=\"reroll\" type=\"button\">New engraving</button>\n    <button class=\"sec\" id=\"save\" type=\"button\">Save</button>\n  </div>\n\n  <div class=\"note-wrap\">\n    <canvas id=\"note\" width=\"1320\" height=\"620\" role=\"img\"\n            aria-label=\"A fictional banknote with an invented portrait.\"></canvas>\n  </div>\n\n  <p class=\"note\" id=\"msg\">\n    The portrait is assembled here from a handful of shapes and a seeded random number \u2014 it is not a\n    photograph, not traced from one, and not anybody. The guilloch\u00e9 is the real technique: those\n    rosettes are parametric curves, which is exactly how the patterns on actual banknotes are\n    generated, and why they are hard to redraw by hand.\n  </p>\n</div>";

    
    (function(){
      'use strict';
      var cv = document.getElementById('note');
      var ctx = cv.getContext('2d');
      var W = cv.width, H = cv.height;
    
      function hash(s){
        var h = 2166136261 >>> 0;
        for (var i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
        return h;
      }
      function prng(seed){
        var s = seed >>> 0;
        return function(){ s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
      }
    
      var PALETTES = [
        { ink:'#2E6B4E', pap:'#E8EFE2', acc:'#8A5A2E' },
        { ink:'#3A4E8C', pap:'#E6E9F2', acc:'#8C3A5E' },
        { ink:'#7A3A2E', pap:'#F2E9DE', acc:'#3A6B6B' },
        { ink:'#5A3A78', pap:'#EDE7F2', acc:'#7A6A2E' },
        { ink:'#1E5A6B', pap:'#E2EEF0', acc:'#8A4A2E' },
        { ink:'#6B2E4A', pap:'#F2E6EA', acc:'#3A5E3A' }
      ];
      var BANKS = ['CENTRAL BANK','STATE TREASURY','BANK OF ISSUE','NATIONAL RESERVE',
                   'THE MINT AND TREASURY','MONETARY AUTHORITY'];
      var UNITS = ['CROWNS','FLORINS','MARKS','DINARS','LIVRES','GUILDERS','THALERS','SHILLINGS','ESCUDOS'];
      var PROMISE = ['PROMISES TO PAY THE BEARER ON DEMAND',
                     'LEGAL TENDER FOR ALL DEBTS WITHIN THE REALM',
                     'PAYABLE AT ANY OFFICE OF ISSUE',
                     'THIS NOTE IS ISSUED UNDER STATUTE'];
    
      var country = 'The Free State', denom = '20', bump = 0;
    
      /* ---- guilloché: the actual technique, not a picture of it -------- *
       * A point running round a circle whose radius is itself wobbling.
       * Overlay a few with different wobbles and the moiré does the rest. */
      function rosette(cx, cy, R, r, k, turns, colour, alpha, lw){
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = colour;
        ctx.lineWidth = lw || 1;
        ctx.beginPath();
        var steps = 1400;
        for (var i = 0; i <= steps; i++){
          var t = (i / steps) * Math.PI * 2 * turns;
          var rad = R + r * Math.cos(k * t);
          var x = cx + rad * Math.cos(t);
          var y = cy + rad * Math.sin(t) * 0.72;
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      }
    
      function guillocheBand(x, y, w, h, colour, R){
        ctx.save();
        ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = colour;
        ctx.lineWidth = 1;
        for (var p = 0; p < 3; p++){
          ctx.beginPath();
          var amp = h * (0.16 + p * 0.07), freq = 0.014 + p * 0.005, ph = R() * 6;
          for (var i = 0; i <= w; i += 2){
            var yy = y + h / 2 + Math.sin(i * freq + ph) * amp + Math.sin(i * freq * 2.7 + ph) * amp * 0.4;
            i ? ctx.lineTo(x + i, yy) : ctx.moveTo(x + i, yy);
          }
          ctx.stroke();
        }
        ctx.restore();
      }
    
      /* ---- an invented face ------------------------------------------- *
       * A coin-style profile: one silhouette, then two or three thin lines
       * in the paper colour for the eye and the ear. Built from a fixed set
       * of landmarks in a unit space and scaled, which is what stops it
       * collapsing into a blob. Seeded variation moves the landmarks; it
       * never traces anything, and it is nobody.                         */
      function portrait(cx, cy, w, h, ink, pap, R){
        ctx.save();
        ctx.beginPath(); ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, 7); ctx.clip();
        ctx.fillStyle = pap; ctx.fillRect(cx - w, cy - h, w * 2, h * 2);
    
        // engraved hatching behind the head
        ctx.strokeStyle = ink; ctx.globalAlpha = .14; ctx.lineWidth = 1.4;
        for (var i = 0; i < 52; i++){
          ctx.beginPath();
          ctx.moveTo(cx - w, cy - h / 2 + i * 6);
          ctx.lineTo(cx + w, cy - h / 2 + i * 6 - 18);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
    
        var u = h * 0.21;                       // one skull radius
        var ox = cx + w * 0.10, oy = cy - h * 0.10;
        var nose = 1 + (R() - 0.5) * 0.34;      // how far the nose juts
        var chin = 1 + (R() - 0.5) * 0.30;      // how far the chin comes forward
        var brow = 1 + (R() - 0.5) * 0.22;
        var crown = 1 + (R() - 0.5) * 0.18;
    
        function P(x, y){ return [ox + x * u, oy + y * u]; }
        function moveTo(x, y){ var p = P(x, y); ctx.moveTo(p[0], p[1]); }
        function lineTo(x, y){ var p = P(x, y); ctx.lineTo(p[0], p[1]); }
        function q(cx1, cy1, x, y){ var a = P(cx1, cy1), b = P(x, y); ctx.quadraticCurveTo(a[0], a[1], b[0], b[1]); }
    
        // neck and shoulders, behind
        ctx.fillStyle = ink;
        ctx.beginPath();
        moveTo(-0.30, 0.80); lineTo(0.30, 0.80);
        q(0.60, 1.40, 1.70, 1.90);
        lineTo(1.70, 3.20); lineTo(-1.90, 3.20);
        q(-1.30, 1.60, -0.30, 0.80);
        ctx.closePath(); ctx.fill();
    
        // the head, facing left
        ctx.beginPath();
        moveTo(0.95, -0.50);
        q(0.60 * crown, -1.30 * crown, -0.40, -0.92 * crown);   // crown
        q(-1.00, -0.62, -0.94 * brow, -0.14);                   // forehead
        lineTo(-0.80 * brow, 0.02);                             // brow
        lineTo(-1.16 * nose, 0.30);                             // nose
        lineTo(-0.82, 0.40);                                    // under the nose
        q(-0.96, 0.48, -0.80, 0.55);                            // lips
        q(-0.98 * chin, 0.76, -0.60 * chin, 0.88);              // chin
        q(-0.16, 1.04, 0.48, 0.72);                             // jaw
        q(0.94, 0.48, 0.95, -0.50);                             // back of the skull
        ctx.closePath(); ctx.fill();
    
        // hair mass on the crown and nape, same ink, slightly proud of the skull
        ctx.beginPath();
        moveTo(0.98, -0.42);
        q(0.60, -1.50 * crown, -0.44, -1.02 * crown);
        q(-0.10, -1.16, 0.30, -1.02);
        q(1.16, -0.92, 1.22, 0.10);
        q(1.24, 0.66, 0.92, 0.80);
        q(1.06, 0.20, 0.98, -0.42);
        ctx.closePath(); ctx.fill();
    
        // the features, cut back in the paper colour
        ctx.strokeStyle = pap;
        ctx.lineCap = 'round';
        ctx.lineWidth = Math.max(2, u * 0.075);
        ctx.beginPath(); moveTo(-0.66, 0.06); lineTo(-0.40, 0.02); ctx.stroke();   // brow
        ctx.lineWidth = Math.max(2, u * 0.055);
        ctx.beginPath(); moveTo(-0.60, 0.20); lineTo(-0.44, 0.19); ctx.stroke();   // eye
        ctx.beginPath();                                                            // ear
        var e = P(0.34, 0.30);
        ctx.arc(e[0], e[1], u * 0.17, Math.PI * 0.65, Math.PI * 1.85);
        ctx.stroke();
        ctx.beginPath(); moveTo(-0.78, 0.52); lineTo(-0.60, 0.51); ctx.stroke();   // mouth
    
        ctx.restore();
        ctx.strokeStyle = ink; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, 7); ctx.stroke();
      }
    
      function draw(){
        var key = (country + '|' + denom).toLowerCase();
        var R = prng(hash(key) + bump * 104729);
        var pal = PALETTES[(R() * PALETTES.length) | 0];
        var bank = BANKS[(R() * BANKS.length) | 0];
        var unit = UNITS[(R() * UNITS.length) | 0];
        var promise = PROMISE[(R() * PROMISE.length) | 0];
        var serial = String.fromCharCode(65 + ((R() * 26) | 0)) +
                     String.fromCharCode(65 + ((R() * 26) | 0)) + ' ' +
                     String(100000 + ((R() * 899999) | 0));
        var year = 1920 + ((R() * 104) | 0);
    
        ctx.fillStyle = pal.pap;
        ctx.fillRect(0, 0, W, H);
    
        // background guilloché across the whole note
        guillocheBand(0, 0, W, H, pal.ink, R);
        rosette(W * 0.74, H * 0.5, 168, 52, 7, 1, pal.ink, .55, 1.2);
        rosette(W * 0.74, H * 0.5, 132, 38, 11, 1, pal.acc, .48, 1.1);
        rosette(W * 0.74, H * 0.5, 96, 26, 5, 1, pal.ink, .38, 1);
        rosette(W * 0.245, H * 0.52, 210, 58, 9, 1, pal.acc, .3, 1);
    
        // border
        ctx.strokeStyle = pal.ink; ctx.lineWidth = 10;
        ctx.strokeRect(20, 20, W - 40, H - 40);
        ctx.lineWidth = 2;
        ctx.strokeRect(38, 38, W - 76, H - 76);
    
        // portrait
        portrait(W * 0.245, H * 0.52, 300, 380, pal.ink, pal.pap, R);
    
        // lettering
        ctx.fillStyle = pal.ink;
        ctx.textAlign = 'center';
        ctx.font = '700 44px Georgia, "Times New Roman", serif';
        var name = (country || 'The Free State').toUpperCase();
        var size = 44;
        ctx.font = '700 ' + size + 'px Georgia, serif';
        while (ctx.measureText(name).width > W * 0.52 && size > 20){
          size -= 2; ctx.font = '700 ' + size + 'px Georgia, serif';
        }
        ctx.fillText(name, W * 0.60, 116);
    
        ctx.font = '400 21px Georgia, serif';
        ctx.fillText(bank, W * 0.60, 152);
        ctx.font = '400 16px Georgia, serif';
        ctx.fillText(promise, W * 0.60, 470);
    
        // the number, large, on the rosette
        ctx.font = '700 132px Georgia, serif';
        ctx.fillStyle = pal.ink;
        ctx.fillText(denom || '20', W * 0.74, H * 0.55);
        ctx.font = '600 26px Georgia, serif';
        ctx.fillText(unit, W * 0.74, H * 0.55 + 44);
    
        // corners
        ctx.font = '700 40px Georgia, serif';
        ctx.textAlign = 'left';  ctx.fillText(denom || '20', 62, 92);
        ctx.textAlign = 'right'; ctx.fillText(denom || '20', W - 62, H - 56);
    
        // serial and date
        ctx.fillStyle = pal.acc;
        ctx.font = '600 24px ui-monospace, Menlo, monospace';
        ctx.textAlign = 'left';  ctx.fillText(serial, 62, H - 56);
        ctx.textAlign = 'right'; ctx.fillText(String(year), W - 62, 92);
    
        // microtext line: real banknotes use it, and at this size it is a line
        ctx.fillStyle = pal.ink;
        ctx.globalAlpha = .5;
        ctx.font = '9px Georgia, serif';
        ctx.textAlign = 'left';
        var micro = ('' + name + ' · ' + unit + ' · ').repeat(14);
        ctx.fillText(micro, 62, H - 92);
        ctx.globalAlpha = 1;
      }
    
      function refresh(){
        country = document.getElementById('country').value.trim() || 'The Free State';
        var d = document.getElementById('denom').value.replace(/[^0-9]/g, '').slice(0, 6);
        denom = d || '20';
        draw();
      }
      /* ---- the sound: a press, and then the note ringing ---------------- *
       * The heavy short thud of a plate coming down, then a struck-metal tail
       * that keeps ringing after it — which is the sound a mint makes and is
       * quite unlike the paper noises next door in the stamp press.
       * ------------------------------------------------------------------ */
      function press(){
        LCSound.play(function(A){
          A.burst('brown', { freq: 110, q: 1.2, dur: .12, level: A.cap(.13), reverb: false });
          A.blip(62, { type:'sine', dur:.2, glide:44, level:A.cap(.09), reverb:false });
          /* the ring */
          A.blip(A.note(22), { at: .06, dur: 1.3, level: A.cap(.035), type: 'sine', reverb: true });
          A.blip(A.note(29), { at: .06, dur: .9,  level: A.cap(.02),  type: 'sine', reverb: true });
          A.burst('white', { at: .06, freq: 6400, q: 2, dur: .3, level: A.cap(.014), reverb: true });
        });
      }
    
      function catchLight(){
        var c = document.getElementById('note');
        var w = c && c.parentNode;
        if (!w) return;
        w.classList.add('note-wrap');
        w.classList.remove('tilt'); void w.offsetWidth; w.classList.add('tilt');
      }
    
      document.getElementById('print').addEventListener('click', function(){ bump = 0; refresh(); press(); catchLight(); });
      document.getElementById('reroll').addEventListener('click', function(){ bump++; refresh(); press(); });
      document.getElementById('country').addEventListener('keydown', function(e){ if (e.key === 'Enter'){ bump = 0; refresh(); } });
      document.getElementById('denom').addEventListener('keydown', function(e){ if (e.key === 'Enter'){ bump = 0; refresh(); } });
      document.getElementById('save').addEventListener('click', function(){
        try {
          var a = document.createElement('a');
          a.download = 'note-' + country.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + denom + '.png';
          a.href = cv.toDataURL('image/png');
          a.click();
        } catch (e){
          document.getElementById('msg').textContent =
            'This browser would not hand the page a file. The note is still on screen and can be saved ' +
            'with a right-click.';
        }
      });
    
      draw();
    
      window.__mint = {
        set: function(c, d){
          document.getElementById('country').value = c;
          document.getElementById('denom').value = d;
          bump = 0; refresh();
        },
        reroll: function(){ document.getElementById('reroll').click(); },
        fingerprint: function(){
          var d = ctx.getImageData(0, 0, W, H).data, n = 0;
          for (var i = 0; i < d.length; i += 1013) n = (n * 31 + d[i]) >>> 0;
          return n;
        },
        state: function(){ return country + '|' + denom; }
      };
    })();
    

    return function () {
      __dead = true;
      __off.forEach(function (r) { try { r[0].removeEventListener(r[1], r[2], r[3]); } catch (e) {} });
      __timers.forEach(function (id) { try { window.clearTimeout(id); window.clearInterval(id); } catch (e) {} });
      __off = []; __timers = [];
    };
  });
