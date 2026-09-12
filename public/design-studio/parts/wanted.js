/* ------------------------------------------------------------------ *
 *  Wanted Poster — was /wanted-poster/.
 *
 *  Moved across rather than rewritten: the word lists, the assembly and
 *  the room are the originals. The content is the toy, and retyping it
 *  is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCPart("wanted", "Wanted Poster", "Reward offered. Likeness approximate.", {
  "--shell-bg": "#E8DBBA",
  "--shell-ink": "#3A2A14",
  "--shell-body": "ui-sans-serif, system-ui, \"Helvetica Neue\", Arial, sans-serif",
  "--shell-bar": "rgba(0,0,0,.24)",
  "--shell-rule": "rgba(128,128,128,.34)",
  "--shell-field": "rgba(127,127,127,.14)"
},
`

:root{
  --wall:#7A6448;
  --paper:#E8DBBA;
  --paper-2:#D8C79E;
  --ink:#3A2A14;
  --ink-2:#5E4726;
  --dim:#8A7350;
  --rule:#B9A276;
  --sans:ui-sans-serif,system-ui,"Helvetica Neue",Arial,sans-serif;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --slab:"Rockwell","Courier New",Georgia,serif;
  --display:"Playbill","Rockwell","Bodoni 72","Didot",Georgia,serif;
}
.room{
  background:
    repeating-linear-gradient(91deg, rgba(0,0,0,.05) 0 3px, transparent 3px 9px),
    linear-gradient(160deg, #86704F, var(--wall));
  color:var(--paper);font-family:var(--sans);padding:26px 18px 64px;
}
.wrap{ max-width:760px;margin:0 auto }
h1{ font-family:var(--display);font-size:clamp(26px,5.6vw,40px);margin:0;letter-spacing:.06em;text-transform:uppercase;font-weight:700 }
.sub{ font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;opacity:.75;margin-top:8px }

.controls{
  background:rgba(30,22,10,.35);border:1px solid rgba(232,219,186,.22);border-radius:3px;
  padding:16px 18px;margin:18px 0 22px;display:grid;gap:12px;
  grid-template-columns:repeat(auto-fit,minmax(190px,1fr));
}
.controls label{ display:block;font-family:var(--mono);font-size:9.5px;letter-spacing:.15em;text-transform:uppercase;opacity:.7;margin-bottom:6px }
.controls input[type=text], .controls select{
  width:100%;background:rgba(0,0,0,.25);border:1px solid rgba(232,219,186,.28);color:var(--paper);
  font-family:var(--sans);font-size:15px;padding:10px 12px;border-radius:2px;
}
.controls input:focus, .controls select:focus{ outline:2px solid var(--paper);outline-offset:-1px }
.file{
  grid-column:1/-1;display:flex;gap:10px;align-items:center;flex-wrap:wrap;
}
.file input[type=file]{ font-family:var(--mono);font-size:11px;color:var(--paper) }
.file .hint{ font-family:var(--mono);font-size:10px;opacity:.6;letter-spacing:.06em }

.deck{ display:flex;gap:9px;flex-wrap:wrap;margin-bottom:20px }
.btn{
  font-family:var(--mono);font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;
  background:var(--paper);color:var(--ink);border:0;padding:12px 18px;cursor:pointer;font-weight:700;border-radius:2px;
}
.btn:hover{ background:#F2E8CC }
.btn.sec{ background:transparent;color:var(--paper);border:1px solid rgba(232,219,186,.3);font-weight:400 }
.btn.sec:hover{ border-color:var(--paper) }
.btn:focus-visible{ outline:2px solid var(--paper);outline-offset:3px }

.poster{ background:transparent;display:flex;justify-content:center }
canvas{
  max-width:100%;height:auto;box-shadow:0 20px 50px rgba(0,0,0,.5);
  border-radius:2px;display:block;
}

footer{
  max-width:760px;margin:26px auto 0;padding-top:14px;border-top:1px solid rgba(232,219,186,.22);
  font-family:var(--mono);font-size:10.5px;line-height:1.8;opacity:.75;
}
footer a{ color:#F2E8CC }

/* --- touch targets (sweep) --- */
@media (pointer:coarse){
  .btn{ min-height:44px }
}

/* A 38px pill is under the 44px a fingertip needs. */
@media (pointer:coarse){ #lc-back{ width:44px;height:44px } }
.room{ padding-bottom:64px }
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

    root.innerHTML = "<div class=\"wrap\">\n  <h1>Wanted</h1>\n  <div class=\"sub\">dead or alive \u00b7 mostly alive \u00b7 the photo never leaves this page</div>\n\n  <div class=\"controls\">\n    <div class=\"file\">\n      <input type=\"file\" id=\"file\" accept=\"image/*\" aria-label=\"Choose a photograph\">\n      <span class=\"hint\">stays in your browser \u2014 never uploaded</span>\n    </div>\n    <div>\n      <label for=\"name\">name on the poster</label>\n      <input type=\"text\" id=\"name\" maxlength=\"24\" value=\"BLACKWATER PETE\">\n    </div>\n    <div>\n      <label for=\"crime\">crime</label>\n      <select id=\"crime\"><option value=\"\">\u2014 pick one for me \u2014</option></select>\n    </div>\n    <div>\n      <label for=\"grade\">wear on the paper</label>\n      <select id=\"grade\">\n        <option value=\"0.35\">lightly aged</option>\n        <option value=\"0.6\" selected>well handled</option>\n        <option value=\"0.85\">nailed up since 1881</option>\n      </select>\n    </div>\n  </div>\n\n  <div class=\"deck\">\n    <button class=\"btn\" id=\"draw\">Redraw</button>\n    <button class=\"btn sec\" id=\"crimeBtn\">New crime</button>\n    <button class=\"btn sec\" id=\"save\">Download poster</button>\n  </div>\n\n  <div class=\"poster\"><canvas id=\"cv\" width=\"760\" height=\"1060\"></canvas></div>\n</div>";

    
    'use strict';
    
    const $ = (id) => document.getElementById(id);
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    const rr = (a, b) => a + Math.random() * (b - a);
    
    const CRIMES = [
      'PERSISTENT AND WILFUL OPTIMISM',
      'THEFT OF ONE (1) GOOD MOOD',
      'LEAVING THE GROUP CHAT WITHOUT EXPLANATION',
      'IMPERSONATING A MORNING PERSON',
      'REHEATING FISH IN A SHARED KITCHEN',
      'HOLDING THE LIFT AND THEN TALKING',
      'REPLYING "ALL" ON PURPOSE',
      'RETURNING A BOOK IN WORSE CONDITION',
      'UNLICENSED USE OF THE GOOD SCISSORS',
      'PARKING ACROSS TWO BAYS, TWICE',
      'SAYING "PER MY LAST EMAIL" IN A ROOM',
      'FINISHING THE MILK AND REPLACING THE CARTON',
      'BOOKING A MEETING AT 16:45 ON A FRIDAY',
      'SUSTAINED WHISTLING IN AN OPEN-PLAN OFFICE',
      'DESCRIBING A FILM SHOT BY SHOT, UNASKED',
      'TAKING THE AISLE AND THE WINDOW',
      'ARRIVING EARLY AND MENTIONING IT',
      'CLAIMING THE LAST BISCUIT UNDER FALSE PRETENCES',
      'OPERATING A LEAF BLOWER BEFORE EIGHT',
      'CONTINUED USE OF THE PHRASE "CIRCLE BACK"',
    ];
    
    const NOTES = [
      'Last seen heading west in a coat too light for the weather.',
      'Known to frequent car parks, quietly, for reasons unestablished.',
      'Answers to several names, none of them convincingly.',
      'Considered mildly dangerous and extremely certain.',
      'Approach with caution. Approach anyway.',
      'Travels alone but leaves the impression of a crowd.',
      'Has been asked to stop. Has acknowledged being asked.',
    ];
    
    let img = null;
    
    function crimeList(){
      $('crime').innerHTML = '<option value="">— pick one for me —</option>' +
        CRIMES.map(c => '<option>' + c + '</option>').join('');
    }
    
    /* ---------- paper ---------- */
    function drawPaper(x, W, H, wear){
      // base tone
      const g = x.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#EFE3C4'); g.addColorStop(0.5, '#E4D5B0'); g.addColorStop(1, '#D6C295');
      x.fillStyle = g; x.fillRect(0, 0, W, H);
    
      // fibre grain — the paper needs texture or it reads as a screenshot
      const n = Math.round(26000 * wear);
      for (let i = 0; i < n; i++){
        const px = Math.random() * W, py = Math.random() * H;
        const a = Math.random() * 0.09 * wear;
        x.fillStyle = Math.random() < 0.5 ? 'rgba(90,66,32,' + a + ')' : 'rgba(255,246,220,' + a + ')';
        x.fillRect(px, py, Math.random() < 0.85 ? 1 : 2, 1);
      }
      // blotches
      for (let i = 0; i < Math.round(14 * wear); i++){
        const cx = Math.random() * W, cy = Math.random() * H, r = rr(30, 140);
        const rg = x.createRadialGradient(cx, cy, 0, cx, cy, r);
        rg.addColorStop(0, 'rgba(120,92,44,' + (0.05 * wear).toFixed(3) + ')');
        rg.addColorStop(1, 'rgba(120,92,44,0)');
        x.fillStyle = rg; x.fillRect(cx - r, cy - r, r * 2, r * 2);
      }
      // edge darkening
      const v = x.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.34, W / 2, H / 2, Math.max(W, H) * 0.78);
      v.addColorStop(0, 'rgba(60,40,14,0)');
      v.addColorStop(1, 'rgba(60,40,14,' + (0.42 * wear).toFixed(3) + ')');
      x.fillStyle = v; x.fillRect(0, 0, W, H);
    }
    
    /* ---------- the photograph ---------- */
    function drawPhoto(x, box, wear){
      const { px, py, pw, ph } = box;
      x.save();
      x.beginPath(); x.rect(px, py, pw, ph); x.clip();
    
      if (img){
        // cover-fit
        const s = Math.max(pw / img.width, ph / img.height);
        const dw = img.width * s, dh = img.height * s;
        x.drawImage(img, px + (pw - dw) / 2, py + (ph - dh) / 2, dw, dh);
    
        // sepia: desaturate then tint, done on pixels so it bakes into the download
        const d = x.getImageData(px, py, pw, ph);
        const a = d.data;
        for (let i = 0; i < a.length; i += 4){
          const lum = a[i] * 0.299 + a[i+1] * 0.587 + a[i+2] * 0.114;
          // raise contrast a little, then push toward a print tone
          const c = Math.max(0, Math.min(255, (lum - 128) * 1.18 + 128));
          a[i]   = Math.min(255, c * 1.07 + 18);
          a[i+1] = Math.min(255, c * 0.94 + 10);
          a[i+2] = Math.min(255, c * 0.72 + 4);
        }
        x.putImageData(d, px, py);
    
        // halftone-ish print texture over the photo
        for (let yy = py; yy < py + ph; yy += 3){
          x.fillStyle = 'rgba(60,40,14,' + (0.05 * wear).toFixed(3) + ')';
          x.fillRect(px, yy, pw, 1);
        }
      } else {
        x.fillStyle = 'rgba(90,70,40,.16)'; x.fillRect(px, py, pw, ph);
        x.fillStyle = 'rgba(58,42,20,.55)';
        x.font = '600 20px ui-sans-serif, system-ui, sans-serif';
        x.textAlign = 'center';
        x.fillText('choose a photograph', px + pw / 2, py + ph / 2 - 6);
        x.font = '400 14px ui-monospace, monospace';
        x.fillText('it stays in your browser', px + pw / 2, py + ph / 2 + 20);
      }
      // grain over the photo box
      for (let i = 0; i < 5200; i++){
        const gx = px + Math.random() * pw, gy = py + Math.random() * ph;
        x.fillStyle = 'rgba(40,26,8,' + (Math.random() * 0.1 * wear).toFixed(3) + ')';
        x.fillRect(gx, gy, 1, 1);
      }
      x.restore();
    
      x.strokeStyle = 'rgba(58,42,20,.75)'; x.lineWidth = 3;
      x.strokeRect(px, py, pw, ph);
    }
    
    function fitText(x, text, maxW, start, font){
      let size = start;
      do {
        x.font = font.replace('{s}', size);
        if (x.measureText(text).width <= maxW) break;
        size -= 2;
      } while (size > 12);
      return size;
    }
    
    function draw(){
      const cv = $('cv'), x = cv.getContext('2d');
      const W = cv.width, H = cv.height;
      const wear = Number($('grade').value);
      x.clearRect(0, 0, W, H);
      drawPaper(x, W, H, wear);
    
      x.textAlign = 'center';
      x.fillStyle = '#3A2A14';
    
      // WANTED
      const wantedSize = fitText(x, 'WANTED', W - 90, 118, '700 {s}px Playbill, Rockwell, Bodoni 72, Didot, Georgia, serif');
      x.font = '700 ' + wantedSize + 'px Playbill, Rockwell, "Bodoni 72", Didot, Georgia, serif';
      x.fillText('WANTED', W / 2, 148);
    
      // rules
      x.fillStyle = 'rgba(58,42,20,.8)';
      x.fillRect(56, 170, W - 112, 5);
      x.fillRect(56, 182, W - 112, 2);
    
      x.font = '600 25px Rockwell, Georgia, serif';
      x.fillStyle = '#5E4726';
      x.fillText('DEAD OR ALIVE', W / 2, 216);
    
      // photograph
      const pw = 420, ph = 400;
      drawPhoto(x, { px: (W - pw) / 2, py: 240, pw, ph }, wear);
    
      // name
      const name = ($('name').value || 'UNKNOWN').toUpperCase();
      const nameSize = fitText(x, name, W - 110, 62, '700 {s}px Rockwell, Georgia, serif');
      x.font = '700 ' + nameSize + 'px Rockwell, Georgia, serif';
      x.fillStyle = '#3A2A14';
      x.fillText(name, W / 2, 700);
    
      // crime
      x.fillStyle = 'rgba(58,42,20,.7)';
      x.fillRect(96, 724, W - 192, 2);
      x.font = '600 17px Rockwell, Georgia, serif';
      x.fillStyle = '#5E4726';
      x.fillText('FOR THE CRIME OF', W / 2, 756);
    
      const crime = $('crime').value || CRIMES[0];
      const crimeSize = fitText(x, crime, W - 120, 30, '700 {s}px Rockwell, Georgia, serif');
      x.font = '700 ' + crimeSize + 'px Rockwell, Georgia, serif';
      x.fillStyle = '#3A2A14';
      // wrap if it is still long
      const words = crime.split(' ');
      const lines = [];
      let line = '';
      words.forEach(w => {
        const t = line ? line + ' ' + w : w;
        if (x.measureText(t).width > W - 120 && line){ lines.push(line); line = w; }
        else line = t;
      });
      if (line) lines.push(line);
      lines.slice(0, 3).forEach((l, i) => x.fillText(l, W / 2, 794 + i * (crimeSize + 6)));
    
      const afterCrime = 794 + Math.min(lines.length, 3) * (crimeSize + 6);
    
      // reward
      x.font = '600 19px Rockwell, Georgia, serif';
      x.fillStyle = '#5E4726';
      x.fillText('REWARD', W / 2, afterCrime + 22);
      const reward = '$' + (ri(1, 40) * 25).toLocaleString('en-GB');
      x.font = '700 54px Rockwell, Georgia, serif';
      x.fillStyle = '#3A2A14';
      x.fillText(reward, W / 2, afterCrime + 78);
    
      // note
      x.font = '400 15px Rockwell, Georgia, serif';
      x.fillStyle = 'rgba(58,42,20,.78)';
      x.fillText(currentNote, W / 2, afterCrime + 112);
    
      // footer line
      x.font = '400 12px ui-monospace, monospace';
      x.fillStyle = 'rgba(58,42,20,.6)';
      x.fillText('BY ORDER OF THE TERRITORIAL OFFICE · NO. ' + ri(1000, 9999), W / 2, H - 40);
    
      // torn top edge and pin holes
      x.fillStyle = 'rgba(122,100,72,.5)';
      for (let i = 0; i < W; i += 6){
        x.fillRect(i, 0, 6, Math.random() * 5 * wear);
        x.fillRect(i, H - Math.random() * 5 * wear, 6, 5);
      }
      [[46, 40], [W - 46, 40]].forEach(([hx, hy]) => {
        const rg = x.createRadialGradient(hx, hy, 0, hx, hy, 11);
        rg.addColorStop(0, 'rgba(50,34,12,.75)'); rg.addColorStop(1, 'rgba(50,34,12,0)');
        x.fillStyle = rg; x.beginPath(); x.arc(hx, hy, 11, 0, 6.2832); x.fill();
      });
    }
    
    let currentNote = pick(NOTES);
    
    $('file').addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      // FileReader keeps this entirely local — no network involved at any point
      const r = new FileReader();
      r.onload = () => {
        const i = new Image();
        i.onload = () => { img = i; draw(); };
        i.src = r.result;
      };
      r.readAsDataURL(f);
    });
    $('draw').addEventListener('click', () => { currentNote = pick(NOTES); draw(); });
    $('crimeBtn').addEventListener('click', () => { $('crime').value = pick(CRIMES); draw(); });
    ['name','crime','grade'].forEach(id => $(id).addEventListener('input', draw));
    $('grade').addEventListener('change', draw);
    $('save').addEventListener('click', () => {
      const a = document.createElement('a');
      a.download = 'wanted.png';
      a.href = $('cv').toDataURL('image/png');
      a.click();
    });
    
    crimeList();
    $('crime').value = pick(CRIMES);
    draw();
    

    return function () {
      __dead = true;
      __off.forEach(function (r) { try { r[0].removeEventListener(r[1], r[2], r[3]); } catch (e) {} });
      __timers.forEach(function (id) { try { window.clearTimeout(id); window.clearInterval(id); } catch (e) {} });
      __off = []; __timers = [];
    };
  });
