/* ------------------------------------------------------------------ *
 *  The Stamp Press — was /vintage-stamp/.
 *
 *  Moved across rather than rewritten: the word lists, the assembly and
 *  the room are the originals. The content is the toy, and retyping it
 *  is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCPart("stamp", "The Stamp Press", "A collector's desk, tweezers and a perforation gauge.", {
  "--shell-bg": "#221D14",
  "--shell-ink": "rgb(240, 233, 216)",
  "--shell-body": "Copperplate, \"Copperplate Gothic Light\", Optima, Georgia, serif",
  "--shell-bar": "rgba(0,0,0,.24)",
  "--shell-rule": "rgba(128,128,128,.34)",
  "--shell-field": "rgba(127,127,127,.14)"
},
`

:root{
  --bg:#221D14;
  --bg-2:#2E2719;
  --gold:#D8B45C;
  --pale:#F0E9D8;
  --dim:#9C917C;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --serif:"Copperplate","Copperplate Gothic Light","Optima",Georgia,serif;
}
/* the press coming down: the stamp arrives slightly too big and slightly
   crooked, then settles, the way a hand-struck impression does */
#stamp.pressed{ animation:press .34s cubic-bezier(.2,.85,.25,1) }
@keyframes press{
  0%{ transform:scale(1.06) rotate(-1.6deg);filter:brightness(1.25) }
  55%{ transform:scale(.985) rotate(.5deg);filter:brightness(1) }
  100%{ transform:none }
}
@media (prefers-reduced-motion: reduce){ #stamp.pressed{ animation:none } }
/* A collector's desk: green baize, the pool of a work lamp, and the faint
   grid of an album page underneath everything. */
.room{
  background:
    radial-gradient(560px 380px at 50% -4%, rgba(255,240,200,.13), transparent 62%),
    repeating-linear-gradient(0deg, rgba(0,0,0,.05) 0 2px, transparent 2px 5px),
    repeating-linear-gradient(90deg, rgba(0,0,0,.05) 0 2px, transparent 2px 5px),
    linear-gradient(180deg,#26402F 0%,#1B3023 60%,#152618 100%);
  color:var(--pale);font-family:var(--serif);
  padding:30px 16px 80px;display:flex;flex-direction:column;align-items:center;
}
/* the tweezers and the perforation gauge, lying on the baize */
body::before{
  content:"";position:fixed;right:-30px;top:16%;width:190px;height:16px;z-index:0;
  background:linear-gradient(90deg, transparent, #9AA4A8 18%, #C4CED2 45%, #8A949A 78%, transparent);
  transform:rotate(-24deg);opacity:.28;border-radius:8px;
  box-shadow:0 6px 14px rgba(0,0,0,.4);
}
body::after{
  content:"";position:fixed;left:-40px;bottom:12%;width:150px;height:52px;z-index:0;
  background:
    repeating-linear-gradient(90deg, rgba(240,232,210,.5) 0 3px, transparent 3px 9px),
    rgba(240,232,210,.10);
  transform:rotate(9deg);opacity:.22;border-radius:3px;
}
.wrap, footer, .sheet, .deck{ position:relative;z-index:1 }
.wrap{ max-width:520px;width:100% }
header{ text-align:center;margin-bottom:20px }
h1{
  font-family:var(--mono);font-size:clamp(15px,3.6vw,21px);margin:0;
  letter-spacing:.26em;text-transform:uppercase;color:var(--gold);font-weight:500;
}
.sub{ font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);margin-top:10px }

form{ display:flex;gap:8px;margin-bottom:22px }
input[type=text]{
  flex:1 1 auto;min-width:0;font-family:var(--serif);font-size:16px;
  background:rgba(240,233,216,.06);color:var(--pale);
  border:1px solid rgba(216,180,92,.35);padding:14px 15px;border-radius:2px;
}
input[type=text]::placeholder{ color:#7E7460 }
input[type=text]:focus{ outline:none;border-color:var(--gold) }
button{
  font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;
  background:transparent;color:var(--gold);border:1px solid var(--gold);
  padding:0 18px;cursor:pointer;flex:0 0 auto;
}
button:hover{ background:var(--gold);color:#221D14 }
button:focus-visible{ outline:2px solid var(--pale);outline-offset:3px }

.sheet{ display:flex;justify-content:center;padding:22px 0 }
canvas{
  display:block;width:min(340px,84vw);height:auto;
  filter:drop-shadow(0 14px 28px rgba(0,0,0,.55));
}
.row{ display:flex;gap:8px;flex-wrap:wrap }
.row button{ flex:1 1 auto;padding:13px 16px }
.row button.sec{ color:var(--dim);border-color:rgba(240,233,216,.25) }
.row button.sec:hover{ background:rgba(240,233,216,.12);color:var(--pale) }
.note{ margin-top:24px;font-size:13.5px;line-height:1.7;color:var(--dim) }

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

    root.innerHTML = "<div class=\"wrap\">\n  <header>\n    <h1>The Stamp Press</h1>\n    <p class=\"sub\">One issue, one subject, no such country</p>\n  </header>\n\n  <form id=\"form\">\n    <input id=\"q\" type=\"text\" autocomplete=\"off\" maxlength=\"42\"\n           placeholder=\"A place, or an idea\" aria-label=\"Subject of the stamp\">\n    <button type=\"submit\">Print</button>\n  </form>\n\n  <div class=\"sheet\">\n    <canvas id=\"stamp\" width=\"620\" height=\"760\" role=\"img\"\n            aria-label=\"A fictional vintage postage stamp.\"></canvas>\n  </div>\n\n  <div class=\"row\">\n    <button class=\"sec\" id=\"reissue\" type=\"button\">Another engraving</button>\n    <button class=\"sec\" id=\"save\" type=\"button\">Save the stamp</button>\n  </div>\n\n  <p class=\"note\" id=\"note\">\n    Everything on it is drawn here, on a canvas, from the letters you type: the same subject gives you\n    the same stamp every time, and a different one gives a different engraving, denomination, ink and\n    postal authority. No country on it exists, and neither does the currency.\n  </p>\n</div>";

    
    (function(){
      'use strict';
    
      var cv = document.getElementById('stamp');
      var ctx = cv.getContext('2d');
      var W = cv.width, H = cv.height;
    
      /* ---- deterministic from the text ---------------------------------- */
      function hash(s){
        var h = 2166136261 >>> 0;
        for (var i = 0; i < s.length; i++){
          h ^= s.charCodeAt(i);
          h = Math.imul(h, 16777619) >>> 0;
        }
        return h;
      }
      function prng(seed){
        var s = seed >>> 0;
        return function(){ s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
      }
    
      var INKS = [
        ['#7A2E22','#F2E8D2'], ['#1E4A6B','#EFE9DA'], ['#2C5138','#F0EBD6'],
        ['#5B2E64','#F2EADC'], ['#6B4A16','#F4EDD8'], ['#8A3350','#F3E9DD'],
        ['#243B5E','#EDE7D6'], ['#4A4A3C','#F1ECDC']
      ];
      var UNITS = ['c','d','p','ø','pf','k','sen','r'];
      var AUTH = ['POSTES','POST &amp; TELEGRAPH','ROYAL MAIL SERVICE','CORREOS','POSTA',
                  'GENERAL POST OFFICE','POSTAL UNION','DEPARTMENT OF POSTS'];
      var SCENES = ['mountain','ship','tower','bird','bust','bridge','rocket','flora'];
    
      var subject = 'Elsewhere', seedBump = 0;
    
      function draw(){
        var seed = hash(subject.toLowerCase().trim() || 'elsewhere') + seedBump * 7919;
        var R = prng(seed);
        var ink = INKS[(R() * INKS.length) | 0];
        var dark = ink[0], paper = ink[1];
        var scene = SCENES[(R() * SCENES.length) | 0];
        var denom = [1,2,3,4,5,6,8,10,12,15,20,25,30,45,50,75][(R() * 16) | 0];
        var unit = UNITS[(R() * UNITS.length) | 0];
        var auth = AUTH[(R() * AUTH.length) | 0];
        var year = 1890 + ((R() * 84) | 0);
    
        var M = 34;                                   // margin to the perforated edge
        ctx.clearRect(0, 0, W, H);
    
        // the paper
        ctx.fillStyle = paper;
        ctx.fillRect(M, M, W - M * 2, H - M * 2);
    
        // the printed frame
        ctx.strokeStyle = dark;
        ctx.lineWidth = 6;
        ctx.strokeRect(M + 22, M + 22, W - M * 2 - 44, H - M * 2 - 44);
        ctx.lineWidth = 2;
        ctx.strokeRect(M + 34, M + 34, W - M * 2 - 68, H - M * 2 - 68);
    
        // the picture panel
        var px = M + 56, py = M + 92, pw = W - M * 2 - 112, ph = 380;
        ctx.save();
        ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip();
        drawScene(scene, px, py, pw, ph, dark, paper, R);
        ctx.restore();
        ctx.strokeStyle = dark; ctx.lineWidth = 3;
        ctx.strokeRect(px, py, pw, ph);
    
        // lettering
        ctx.fillStyle = dark;
        ctx.textAlign = 'center';
        ctx.font = '600 30px Georgia, "Times New Roman", serif';
        ctx.fillText(auth.replace('&amp;', '&'), W / 2, M + 70);
    
        var label = (subject || 'Elsewhere').toUpperCase();
        var size = 46;
        ctx.font = '700 ' + size + 'px Georgia, "Times New Roman", serif';
        while (ctx.measureText(label).width > pw - 10 && size > 18){
          size -= 2;
          ctx.font = '700 ' + size + 'px Georgia, "Times New Roman", serif';
        }
        ctx.fillText(label, W / 2, py + ph + 62);
    
        ctx.font = '400 22px Georgia, serif';
        ctx.fillText('ANNO ' + year, W / 2, py + ph + 96);
    
        // denomination, in both bottom corners the way engraved issues did it
        ctx.font = '700 40px Georgia, serif';
        ctx.textAlign = 'left';
        ctx.fillText(denom + unit, M + 48, H - M - 54);
        ctx.textAlign = 'right';
        ctx.fillText(denom + unit, W - M - 48, H - M - 54);
    
        grain(R, dark);
        postmark(R, dark);
        perforate(M);
      }
    
      /* ---- the engravings ---- */
      function drawScene(kind, x, y, w, h, dark, paper, R){
        ctx.fillStyle = paper; ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = dark; ctx.fillStyle = dark;
        var cx = x + w / 2, base = y + h;
    
        // engraved sky: fine horizontal ruling, denser at the top
        ctx.lineWidth = 1.4;
        for (var i = 0; i < 34; i++){
          var yy = y + 6 + i * (h / 46);
          ctx.globalAlpha = 0.30 - i * 0.008;
          ctx.beginPath(); ctx.moveTo(x + 4, yy); ctx.lineTo(x + w - 4, yy); ctx.stroke();
        }
        ctx.globalAlpha = 1;
    
        if (kind === 'mountain'){
          ctx.globalAlpha = .3;
          ctx.beginPath(); ctx.arc(cx + w * .22, y + h * .26, w * .1, 0, 7); ctx.fill();
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.moveTo(x, base);
          ctx.lineTo(x + w * .3, y + h * .34);
          ctx.lineTo(x + w * .46, y + h * .58);
          ctx.lineTo(x + w * .62, y + h * .22);
          ctx.lineTo(x + w, base);
          ctx.closePath(); ctx.fill();
          ctx.fillStyle = paper;
          ctx.beginPath();
          ctx.moveTo(x + w * .62, y + h * .22);
          ctx.lineTo(x + w * .68, y + h * .34);
          ctx.lineTo(x + w * .56, y + h * .34);
          ctx.closePath(); ctx.fill();
        } else if (kind === 'ship'){
          ctx.fillRect(x, base - h * .18, w, h * .18);
          ctx.fillStyle = paper;
          for (var s = 0; s < 5; s++){
            ctx.globalAlpha = .5;
            ctx.beginPath();
            ctx.moveTo(x, base - h * .16 + s * 9);
            ctx.lineTo(x + w, base - h * .16 + s * 9);
            ctx.lineWidth = 2; ctx.strokeStyle = paper; ctx.stroke();
          }
          ctx.globalAlpha = 1; ctx.fillStyle = dark; ctx.strokeStyle = dark;
          ctx.beginPath();
          ctx.moveTo(cx - w * .3, base - h * .2);
          ctx.lineTo(cx + w * .3, base - h * .2);
          ctx.lineTo(cx + w * .2, base - h * .1);
          ctx.lineTo(cx - w * .22, base - h * .1);
          ctx.closePath(); ctx.fill();
          ctx.lineWidth = 5;
          ctx.beginPath(); ctx.moveTo(cx, base - h * .2); ctx.lineTo(cx, y + h * .18); ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(cx + 6, y + h * .2); ctx.lineTo(cx + w * .22, base - h * .24);
          ctx.lineTo(cx + 6, base - h * .24); ctx.closePath(); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(cx - 6, y + h * .24); ctx.lineTo(cx - w * .2, base - h * .24);
          ctx.lineTo(cx - 6, base - h * .24); ctx.closePath(); ctx.fill();
        } else if (kind === 'tower'){
          ctx.fillRect(x, base - h * .1, w, h * .1);
          ctx.beginPath();
          ctx.moveTo(cx - w * .13, base - h * .1);
          ctx.lineTo(cx - w * .05, y + h * .2);
          ctx.lineTo(cx + w * .05, y + h * .2);
          ctx.lineTo(cx + w * .13, base - h * .1);
          ctx.closePath(); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(cx - w * .08, y + h * .2);
          ctx.lineTo(cx, y + h * .06);
          ctx.lineTo(cx + w * .08, y + h * .2);
          ctx.closePath(); ctx.fill();
          ctx.fillStyle = paper;
          for (var t = 0; t < 3; t++) ctx.fillRect(cx - 7, y + h * (.3 + t * .16), 14, h * .08);
        } else if (kind === 'bird'){
          ctx.lineWidth = 8; ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(cx - w * .3, y + h * .5);
          ctx.quadraticCurveTo(cx - w * .1, y + h * .2, cx, y + h * .46);
          ctx.quadraticCurveTo(cx + w * .1, y + h * .2, cx + w * .3, y + h * .5);
          ctx.stroke();
          ctx.beginPath(); ctx.ellipse(cx, y + h * .5, w * .05, h * .07, 0, 0, 7); ctx.fill();
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(cx - w * .16, y + h * .72);
          ctx.quadraticCurveTo(cx, y + h * .62, cx + w * .16, y + h * .72);
          ctx.stroke();
        } else if (kind === 'bust'){
          ctx.save();
          ctx.beginPath(); ctx.ellipse(cx, y + h * .5, w * .28, h * .38, 0, 0, 7); ctx.clip();
          ctx.fillStyle = paper; ctx.fillRect(x, y, w, h);
          ctx.fillStyle = dark;
          ctx.beginPath();
          ctx.arc(cx, y + h * .44, w * .16, 0, 7); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(cx - w * .26, base);
          ctx.quadraticCurveTo(cx, y + h * .56, cx + w * .26, base);
          ctx.closePath(); ctx.fill();
          ctx.restore();
          ctx.lineWidth = 5;
          ctx.beginPath(); ctx.ellipse(cx, y + h * .5, w * .28, h * .38, 0, 0, 7); ctx.stroke();
        } else if (kind === 'bridge'){
          ctx.fillRect(x, base - h * .12, w, h * .12);
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(x + 6, y + h * .42);
          ctx.quadraticCurveTo(cx, y + h * .78, x + w - 6, y + h * .42);
          ctx.stroke();
          ctx.lineWidth = 5;
          ctx.beginPath(); ctx.moveTo(x + 6, y + h * .18); ctx.lineTo(x + 6, base - h * .12); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x + w - 6, y + h * .18); ctx.lineTo(x + w - 6, base - h * .12); ctx.stroke();
          ctx.lineWidth = 3;
          for (var b = 1; b < 9; b++){
            var bx = x + w * b / 9;
            var by = y + h * .42 + Math.sin(b / 9 * Math.PI) * h * .27;
            ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, base - h * .12); ctx.stroke();
          }
        } else if (kind === 'rocket'){
          ctx.beginPath();
          ctx.moveTo(cx, y + h * .08);
          ctx.quadraticCurveTo(cx + w * .12, y + h * .4, cx + w * .1, y + h * .68);
          ctx.lineTo(cx - w * .1, y + h * .68);
          ctx.quadraticCurveTo(cx - w * .12, y + h * .4, cx, y + h * .08);
          ctx.closePath(); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(cx - w * .1, y + h * .56); ctx.lineTo(cx - w * .22, y + h * .74);
          ctx.lineTo(cx - w * .1, y + h * .72); ctx.closePath(); ctx.fill();
          ctx.beginPath();
          ctx.moveTo(cx + w * .1, y + h * .56); ctx.lineTo(cx + w * .22, y + h * .74);
          ctx.lineTo(cx + w * .1, y + h * .72); ctx.closePath(); ctx.fill();
          ctx.fillStyle = paper;
          ctx.beginPath(); ctx.arc(cx, y + h * .36, w * .05, 0, 7); ctx.fill();
          ctx.fillStyle = dark;
          ctx.globalAlpha = .55;
          for (var f = 0; f < 4; f++){
            ctx.beginPath();
            ctx.ellipse(cx, y + h * (.76 + f * .05), w * (.07 - f * .012), h * .03, 0, 0, 7);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        } else {
          ctx.lineWidth = 6; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(cx, base); ctx.lineTo(cx, y + h * .42); ctx.stroke();
          for (var pdx = 0; pdx < 6; pdx++){
            var ang = (pdx / 6) * Math.PI * 2;
            ctx.beginPath();
            ctx.ellipse(cx + Math.cos(ang) * w * .12, y + h * .34 + Math.sin(ang) * h * .11,
                        w * .07, h * .05, ang, 0, 7);
            ctx.fill();
          }
          ctx.fillStyle = paper;
          ctx.beginPath(); ctx.arc(cx, y + h * .34, w * .05, 0, 7); ctx.fill();
          ctx.fillStyle = dark;
          ctx.lineWidth = 5;
          ctx.beginPath(); ctx.moveTo(cx, y + h * .68); ctx.quadraticCurveTo(cx - w * .16, y + h * .68, cx - w * .18, y + h * .58); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(cx, y + h * .78); ctx.quadraticCurveTo(cx + w * .16, y + h * .78, cx + w * .18, y + h * .68); ctx.stroke();
        }
      }
    
      /* ---- age ---- */
      function grain(R, dark){
        for (var i = 0; i < 2600; i++){
          var x = 34 + R() * (W - 68), y = 34 + R() * (H - 68);
          ctx.fillStyle = 'rgba(90,70,40,' + (0.02 + R() * 0.06).toFixed(3) + ')';
          ctx.fillRect(x, y, 1 + R() * 2, 1 + R() * 2);
        }
      }
    
      function postmark(R, dark){
        var cx = W * (0.24 + R() * 0.14), cy = H * (0.2 + R() * 0.12);
        var r = 96;
        ctx.save();
        ctx.globalAlpha = 0.34;
        ctx.strokeStyle = '#241C10';
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, cy, r - 13, 0, 7); ctx.stroke();
        ctx.lineWidth = 6;
        for (var i = 0; i < 4; i++){
          ctx.beginPath();
          ctx.moveTo(cx + r - 6, cy - 22 + i * 15);
          ctx.quadraticCurveTo(cx + r + 90, cy - 34 + i * 15, cx + r + 190, cy - 22 + i * 15);
          ctx.stroke();
        }
        ctx.fillStyle = '#241C10';
        ctx.textAlign = 'center';
        ctx.font = '700 21px Georgia, serif';
        ctx.fillText(((R() * 28) | 0) + 1 + ' ' +
          ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][(R() * 12) | 0],
          cx, cy + 8);
        ctx.restore();
      }
    
      /* ---- the perforated edge, cut out of everything above ---- */
      function perforate(M){
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = '#000';
        var stepX = (W - M * 2) / 13, stepY = (H - M * 2) / 16, r = 13;
        var i;
        for (i = 0; i <= 13; i++){
          var x = M + i * stepX;
          ctx.beginPath(); ctx.arc(x, M, r, 0, 7); ctx.fill();
          ctx.beginPath(); ctx.arc(x, H - M, r, 0, 7); ctx.fill();
        }
        for (i = 0; i <= 16; i++){
          var y = M + i * stepY;
          ctx.beginPath(); ctx.arc(M, y, r, 0, 7); ctx.fill();
          ctx.beginPath(); ctx.arc(W - M, y, r, 0, 7); ctx.fill();
        }
        ctx.fillRect(0, 0, W, M - r + 1);
        ctx.fillRect(0, H - M + r - 1, W, M);
        ctx.fillRect(0, 0, M - r + 1, H);
        ctx.fillRect(W - M + r - 1, 0, M, H);
        ctx.restore();
      }
    
      /* ---- wiring ---- */
      document.getElementById('form').addEventListener('submit', function(e){
        e.preventDefault();
        var v = document.getElementById('q').value.trim();
        subject = v || 'Elsewhere';
        seedBump = 0;
        draw();
      });
      /* ---- the sound: a perforation tearing ----------------------------- *
       * A run of tiny paper snaps, accelerating, then the dull thud of the
       * cancelling hand-stamp. Nothing tonal — tearing paper has no pitch.
       * ------------------------------------------------------------------ */
      function tear(){
        LCSound.play(function(A){
          for (var i = 0; i < 9; i++){
            A.burst('white', { at: i * (0.028 - i * 0.0012),
                               freq: 2800 + Math.random() * 2400, q: 2.2,
                               dur: 0.02, level: A.cap(0.03), reverb: false });
          }
          A.burst('brown', { at: .27, freq: 170, q: 1.6, dur: .09, level: A.cap(.10), reverb: false });
          A.burst('white', { at: .27, freq: 1400, q: 2, dur: .03, level: A.cap(.04), reverb: false });
        });
      }
    
      function pressed(){
        var c = document.getElementById('stamp');
        if (!c) return;
        c.classList.remove('pressed'); void c.offsetWidth; c.classList.add('pressed');
      }
    
      document.getElementById('reissue').addEventListener('click', function(){
        tear(); pressed();
        seedBump++;
        draw();
      });
      document.getElementById('save').addEventListener('click', function(){
        try {
          var a = document.createElement('a');
          a.download = 'stamp-' + subject.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.png';
          a.href = cv.toDataURL('image/png');
          a.click();
        } catch (err) {
          document.getElementById('note').textContent =
            'This browser would not let the page hand you the file. The stamp is still on screen — a ' +
            'right-click and "save image" does the same job.';
        }
      });
    
      draw();
    
      window.__stamp = {
        set: function(v){ document.getElementById('q').value = v;
          document.getElementById('form').dispatchEvent(new Event('submit', { cancelable:true })); },
        reissue: function(){ document.getElementById('reissue').click(); },
        subject: function(){ return subject; },
        fingerprint: function(){
          // a cheap signature of the drawn pixels, for checking two stamps differ
          var d = ctx.getImageData(0, 0, W, H).data, n = 0;
          for (var i = 0; i < d.length; i += 997) n = (n * 31 + d[i]) >>> 0;
          return n;
        }
      };
    })();
    

    return function () {
      __dead = true;
      __off.forEach(function (r) { try { r[0].removeEventListener(r[1], r[2], r[3]); } catch (e) {} });
      __timers.forEach(function (id) { try { window.clearTimeout(id); window.clearInterval(id); } catch (e) {} });
      __off = []; __timers = [];
    };
  });
