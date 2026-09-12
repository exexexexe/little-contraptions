/* ------------------------------------------------------------------ *
 *  Gaming, On This Day — was /gaming-history/.
 *
 *  Moved across rather than rewritten: the word lists, the assembly and
 *  the room are the originals. The content is the toy, and retyping it
 *  is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCPart("gaming", "Gaming, On This Day", "The same trick, played on a smaller and louder history.", {
  "--shell-bg": "#0E1220",
  "--shell-ink": "#E4E9F5",
  "--shell-body": "ui-sans-serif, system-ui, \"Helvetica Neue\", Arial, sans-serif",
  "--shell-bar": "rgba(0,0,0,.24)",
  "--shell-rule": "rgba(128,128,128,.34)",
  "--shell-field": "rgba(127,127,127,.14)"
},
`

:root{
  --bg:#0E1220;
  --panel:#171D31;
  --panel-2:#1F2740;
  --edge:#2C3654;
  --ink:#E4E9F5;
  --dim:#8E99B8;
  --gold:#F5D06B;
  --blue:#4E9BE0;
  --red:#E2647A;
  --green:#6FCF97;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --sans:ui-sans-serif,system-ui,"Helvetica Neue",Arial,sans-serif;
}
.room{
  background:var(--bg);
  background-image:
    radial-gradient(80% 50% at 50% 0%, rgba(78,155,224,.12), transparent 62%),
    repeating-linear-gradient(0deg, rgba(255,255,255,.012) 0 1px, transparent 1px 3px);
  color:var(--ink);font-family:var(--sans);font-size:15px;
  padding:24px 16px 84px;
  display:flex;flex-direction:column;align-items:center;
}
.wrap{ max-width:760px;width:100% }

header{ text-align:center }
h1{
  margin:0;font-family:var(--mono);font-size:clamp(17px,4.2vw,25px);
  letter-spacing:.24em;text-transform:uppercase;color:var(--gold);font-weight:700;
}
.sub{ margin-top:9px;font-family:var(--mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim) }

.picker{
  display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin-top:20px;
  background:var(--panel);border:1px solid var(--edge);padding:13px 15px;
}
.picker label{ font-family:var(--mono);font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--dim) }
input[type=date]{
  font-family:var(--mono);font-size:13px;color:var(--ink);
  background:#101526;border:1px solid var(--edge);padding:9px 11px;
}
input[type=date]:focus{ outline:2px solid var(--blue);outline-offset:1px }
button{
  font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;
  background:var(--panel-2);color:var(--ink);border:1px solid var(--edge);
  padding:10px 15px;cursor:pointer;
}
button:hover{ border-color:var(--blue);color:var(--blue) }
button.go{ background:var(--blue);border-color:var(--blue);color:#08101C;font-weight:700 }
button.go:hover{ background:#6FB0EA;color:#08101C }
button:focus-visible{ outline:2px solid var(--gold);outline-offset:2px }
.picker .n{ margin-left:auto;font-family:var(--mono);font-size:10px;color:var(--dim) }

.day{
  margin-top:16px;font-family:var(--mono);font-size:11px;letter-spacing:.2em;
  text-transform:uppercase;color:var(--dim);
}

.ev{
  background:var(--panel);border:1px solid var(--edge);border-left:5px solid var(--blue);
  padding:16px 18px;margin-top:11px;
}
.ev.release{ border-left-color:var(--green) }
.ev.hardware{ border-left-color:var(--blue) }
.ev.company{ border-left-color:var(--gold) }
.ev.landmark{ border-left-color:var(--red) }
.ev .yr{
  font-family:var(--mono);font-size:26px;font-weight:700;color:var(--gold);line-height:1;
  letter-spacing:.02em;
}
.ev.release .yr{ color:var(--green) }
.ev.hardware .yr{ color:var(--blue) }
.ev.landmark .yr{ color:var(--red) }
.ev .top{ display:flex;gap:14px;align-items:baseline;flex-wrap:wrap }
.ev .ago{ font-family:var(--mono);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);margin-left:auto }
.ev h2{ margin:9px 0 0;font-size:18.5px;line-height:1.32;font-weight:700 }
.ev p{ margin:8px 0 0;font-size:15px;line-height:1.66;color:#C6CEE2 }
.ev .note{
  margin-top:10px;font-family:var(--mono);font-size:11px;line-height:1.7;color:var(--dim);
  border-left:2px solid var(--edge);padding-left:10px;
}
.ev .kind{
  font-family:var(--mono);font-size:8.5px;letter-spacing:.2em;text-transform:uppercase;
  color:var(--dim);border:1px solid var(--edge);padding:3px 8px;
}

.none{
  background:var(--panel);border:1px dashed var(--edge);padding:20px;margin-top:12px;
  font-family:var(--mono);font-size:12px;line-height:1.85;color:var(--dim);
}
.none b{ display:block;color:var(--gold);margin-bottom:7px;letter-spacing:.06em }

.nearby{ margin-top:18px }
.nearby h3{
  font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;
  color:var(--dim);margin:0 0 9px;font-weight:400;
}

footer{
  max-width:760px;width:100%;margin:26px auto 0;padding-top:14px;border-top:1px solid var(--edge);
  font-family:var(--mono);font-size:10.5px;line-height:1.85;color:var(--dim);
}
footer a{ color:var(--blue) }
footer b{ color:var(--ink) }

/* ---------- shared: back to the cabinet ---------- */
/* --- touch targets (sweep) --- */
@media (pointer:coarse){
  #next, #prev, #today, .go{ min-height:44px }
}

/* A 38px pill is under the 44px a fingertip needs. */
@media (pointer:coarse){ #lc-back{ width:44px;height:44px } }
@media (max-width:520px){ #lc-back{ left:10px;bottom:10px } }
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

    root.innerHTML = "<div class=\"wrap\">\n  <header>\n    <h1>Gaming, On This Day</h1>\n    <div class=\"sub\">real dates &middot; nothing invented</div>\n  </header>\n\n  <div class=\"picker\">\n    <label for=\"d\">Date</label>\n    <input type=\"date\" id=\"d\">\n    <button id=\"today\" type=\"button\">Today</button>\n    <button id=\"prev\" type=\"button\">&larr;</button>\n    <button id=\"next\" type=\"button\">&rarr;</button>\n    <button id=\"rand\" class=\"go\" type=\"button\">A day with something on it</button>\n    <span class=\"n\" id=\"n\"></span>\n  </div>\n\n  <div class=\"day\" id=\"day\"></div>\n  <div id=\"out\"></div>\n  <div class=\"nearby\" id=\"nearby\"></div>\n</div>";

    
    'use strict';
    const $ = (id) => document.getElementById(id);
    const esc = (s) => String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    
    const H = (window.GAMING_HISTORY || []).slice()
      .sort((a, b) => a.d === b.d ? a.y - b.y : a.d.localeCompare(b.d));
    
    const MONTHS = ['January','February','March','April','May','June','July',
                    'August','September','October','November','December'];
    
    function key(dateStr){ return dateStr.slice(5); }         // MM-DD
    function label(dateStr){
      const [Y, M, D] = dateStr.split('-').map(Number);
      return Number(D) + ' ' + MONTHS[M - 1];
    }
    
    function card(e, shownYear){
      const ago = shownYear - e.y;
      return '<div class="ev ' + esc(e.tag || '') + '">' +
        '<div class="top"><span class="yr">' + e.y + '</span>' +
        '<span class="kind">' + esc(e.tag || '') + '</span>' +
        '<span class="ago">' + (ago > 0 ? ago + (ago === 1 ? ' year ago' : ' years ago') : '') + '</span></div>' +
        '<h2>' + esc(e.t) + '</h2>' +
        '<p>' + esc(e.b) + '</p>' +
        (e.note ? '<div class="note">' + esc(e.note) + '</div>' : '') +
        '</div>';
    }
    
    /* The days on either side that DO have something, so a blank day is a
       signpost rather than a dead end. */
    function nearest(k, n){
      const days = [...new Set(H.map((e) => e.d))].sort();
      const before = days.filter((d) => d < k).slice(-n);
      const after = days.filter((d) => d > k).slice(0, n);
      // the list wraps: late December is next to early January
      const out = before.concat(after);
      if (out.length < n * 2){
        if (!before.length) out.unshift(days[days.length - 1]);
        if (!after.length) out.push(days[0]);
      }
      return out;
    }
    
    function show(dateStr){
      const k = key(dateStr);
      const year = Number(dateStr.slice(0, 4));
      const hits = H.filter((e) => e.d === k);
    
      $('day').textContent = label(dateStr) + (hits.length ? '' : ' — nothing on the list');
      $('n').textContent = H.length + ' dated events';
    
      if (hits.length){
        $('out').innerHTML = hits.map((e) => card(e, year)).join('');
        $('nearby').innerHTML = '';
        return;
      }
    
      $('out').innerHTML = '<div class="none"><b>Nothing on this date</b>' +
        'Plenty happened on the ' + label(dateStr) + ' — it just does not have a firmly dated entry in ' +
        'this list, and a made-up one would defeat the point of the list. The nearest days that do:</div>';
    
      const near = nearest(k, 3);
      $('nearby').innerHTML = '<h3>nearby</h3>' + near.map((d) => {
        const e = H.find((x) => x.d === d);
        const [M, D] = d.split('-').map(Number);
        return '<div class="ev ' + esc(e.tag || '') + '" style="cursor:pointer" data-jump="' + d + '">' +
          '<div class="top"><span class="yr">' + e.y + '</span>' +
          '<span class="kind">' + Number(D) + ' ' + MONTHS[M - 1] + '</span></div>' +
          '<h2>' + esc(e.t) + '</h2></div>';
      }).join('');
    }
    
    $('nearby').addEventListener('click', (e) => {
      const el = e.target.closest('[data-jump]');
      if (!el) return;
      const y = $('d').value.slice(0, 4) || String(new Date().getFullYear());
      $('d').value = y + '-' + el.dataset.jump;
      show($('d').value);
    });
    
    function shift(days){
      const d = new Date($('d').value + 'T12:00:00Z');
      d.setUTCDate(d.getUTCDate() + days);
      $('d').value = d.toISOString().slice(0, 10);
      show($('d').value);
    }
    
    $('d').addEventListener('change', () => show($('d').value));
    $('today').addEventListener('click', () => {
      $('d').value = new Date().toISOString().slice(0, 10);
      show($('d').value);
    });
    $('prev').addEventListener('click', () => shift(-1));
    $('next').addEventListener('click', () => shift(1));
    $('rand').addEventListener('click', () => {
      const days = [...new Set(H.map((e) => e.d))];
      const d = days[Math.floor(Math.random() * days.length)];
      $('d').value = new Date().getFullYear() + '-' + d;
      show($('d').value);
    });
    
    $('d').value = new Date().toISOString().slice(0, 10);
    show($('d').value);
    
    window.__gaming = { all: H, show: show, key: key };
    

    return function () {
      __dead = true;
      __off.forEach(function (r) { try { r[0].removeEventListener(r[1], r[2], r[3]); } catch (e) {} });
      __timers.forEach(function (id) { try { window.clearTimeout(id); window.clearInterval(id); } catch (e) {} });
      __off = []; __timers = [];
    };
  });
