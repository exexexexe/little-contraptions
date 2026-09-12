/* ------------------------------------------------------------------ *
 *  Closer Than You'd Think — was /closer-than-you-think/.
 *
 *  Moved across rather than rewritten: the word lists, the assembly and
 *  the room are the originals. The content is the toy, and retyping it
 *  is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCPart("closer", "Closer Than You'd Think", "Two things you assumed were far apart.", {
  "--shell-bg": "#151318",
  "--shell-ink": "#E8E2EE",
  "--shell-body": "\"Iowan Old Style\", \"Palatino Linotype\", Georgia, serif",
  "--shell-bar": "rgba(0,0,0,.24)",
  "--shell-rule": "rgba(128,128,128,.34)",
  "--shell-field": "rgba(127,127,127,.14)"
},
`

:root{
  --bg:#151318;
  --panel:#1E1B23;
  --edge:#332E3C;
  --ink:#E8E2EE;
  --dim:#948CA2;
  --old:#D98F5A;
  --mid:#5AB8D9;
  --now:#E4DCC8;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --serif:"Iowan Old Style","Palatino Linotype",Georgia,serif;
}
.room{
  background:var(--bg);
  background-image:radial-gradient(72% 40% at 50% 0%, rgba(217,143,90,.09), transparent 64%);
  color:var(--ink);font-family:var(--serif);font-size:16px;
  padding:24px 16px 84px;
  display:flex;flex-direction:column;align-items:center;
}
.wrap{ max-width:740px;width:100% }

header{ text-align:center }
h1{ margin:0;font-family:var(--mono);font-size:clamp(16px,4vw,23px);letter-spacing:.24em;text-transform:uppercase;color:var(--old);font-weight:700 }
.sub{ margin-top:9px;font-family:var(--mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim) }

.card{ margin-top:20px;background:var(--panel);border:1px solid var(--edge);padding:22px 22px 20px }
.claim{ font-size:clamp(19px,4.4vw,26px);line-height:1.4;margin:0 0 20px }

/* the line */
.line{ position:relative;margin:26px 0 8px;height:76px }
.line .rail{ position:absolute;left:0;right:0;top:26px;height:2px;background:var(--edge) }
.line .pt{ position:absolute;top:20px;transform:translateX(-50%);text-align:center;width:0 }
.line .pt i{ display:block;width:14px;height:14px;border-radius:50%;margin:0 auto;border:2px solid var(--bg) }
.line .pt.a i{ background:var(--old) } .line .pt.b i{ background:var(--mid) } .line .pt.c i{ background:var(--now) }
.line .pt span{
  display:block;font-family:var(--mono);font-size:9px;letter-spacing:.08em;color:var(--dim);
  white-space:nowrap;margin-top:6px;transform:translateX(-50%);position:absolute;left:50%;
}
.line .pt.a span{ color:var(--old) } .line .pt.b span{ color:var(--mid) } .line .pt.c span{ color:var(--now) }
.line .gap{
  position:absolute;top:0;font-family:var(--mono);font-size:10px;letter-spacing:.1em;
  color:var(--dim);text-align:center;transform:translateX(-50%);white-space:nowrap;
}

.gaps{ display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:26px }
@media (max-width:520px){ .gaps{ grid-template-columns:1fr } }
.g{ background:#191620;border:1px solid var(--edge);padding:12px 14px }
.g .k{ font-family:var(--mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--dim) }
.g .v{ font-family:var(--mono);font-size:21px;margin-top:4px;font-variant-numeric:tabular-nums }
.g.short .v{ color:var(--mid) } .g.long .v{ color:var(--old) }
.g .m{ font-size:12.5px;color:var(--dim);margin-top:5px;line-height:1.55;font-family:var(--serif) }

.check{
  margin-top:16px;border-left:3px solid var(--edge);padding:2px 0 2px 14px;
  font-family:var(--mono);font-size:11.5px;line-height:1.8;color:var(--dim);
}
.check b{ color:var(--ink);font-weight:400 }

.deck{ display:flex;gap:9px;flex-wrap:wrap;margin-top:16px;align-items:center }
button{
  font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;
  background:var(--old);color:#1A120C;border:1px solid var(--old);
  padding:12px 20px;cursor:pointer;font-weight:700;
}
button:hover{ background:#E9A472 }
button.sec{ background:transparent;color:var(--ink);border-color:var(--edge);font-weight:400 }
button.sec:hover{ border-color:var(--old);color:var(--old) }
button:focus-visible{ outline:2px solid var(--mid);outline-offset:2px }
.count{ margin-left:auto;font-family:var(--mono);font-size:10px;letter-spacing:.14em;color:var(--dim) }

/* egg #6 */
.unlocked{
  margin-top:16px;background:#191620;border:2px solid var(--mid);padding:20px 22px;
}
.unlocked .k{
  font-family:var(--mono);font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;
  color:var(--mid);margin-bottom:11px;
}
.unlocked p{ margin:0 0 11px;font-size:17px;line-height:1.6 } .unlocked p:last-child{ margin:0 }
.unlocked b{ color:var(--mid) }
.unlocked[hidden]{ display:none }

footer{
  max-width:740px;width:100%;margin:24px auto 0;padding-top:14px;border-top:1px solid var(--edge);
  font-family:var(--mono);font-size:10.5px;line-height:1.85;color:var(--dim);
}
footer a{ color:var(--old) }

/* ---------- shared: back to the cabinet ---------- */
/* --- touch targets (sweep) --- */
@media (pointer:coarse){
  #go, .sec{ min-height:44px }
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

    root.innerHTML = "<div class=\"wrap\">\n  <header>\n    <h1>Closer Than You&rsquo;d Think</h1>\n    <div class=\"sub\">real dates &middot; badly behaved intuitions</div>\n  </header>\n\n  <div class=\"card\">\n    <p class=\"claim\" id=\"claim\">\u2014</p>\n    <div class=\"line\" id=\"line\"></div>\n    <div class=\"gaps\" id=\"gaps\"></div>\n    <div class=\"check\" id=\"check\"></div>\n  </div>\n\n  <div class=\"deck\">\n    <button id=\"go\" type=\"button\">Another</button>\n    <button id=\"back\" class=\"sec\" type=\"button\">Previous</button>\n    <span class=\"count\" id=\"count\"></span>\n  </div>\n\n  <div class=\"unlocked\" id=\"unlocked\" hidden></div>\n</div>";

    
    'use strict';
    const $ = (id) => document.getElementById(id);
    const esc = (s) => String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    
    const C = window.CLOSER || [];
    const SEEN_KEY = 'lc-closer-seen';
    const ARRIVED_KEY = 'lc-arrived';
    
    /* Big spans are unreadable as digits, so they are said the way a person
       would say them, and the exact number is still in the check line. */
    function span(years){
      const y = Math.abs(years);
      if (y >= 1e6) return (y / 1e6).toFixed(y >= 1e7 ? 0 : 1).replace(/\.0$/, '') + ' million years';
      if (y >= 1000) return Math.round(y).toLocaleString() + ' years';
      return Math.round(y) + (Math.round(y) === 1 ? ' year' : ' years');
    }
    function yearLabel(y){
      if (y <= -1e6) return (Math.abs(y) / 1e6).toFixed(0) + ' Mya';
      if (y < 0) return Math.abs(y).toLocaleString() + ' BC';
      return String(y);
    }
    
    let at = 0;
    let order = C.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    
    function seen(){
      try { const a = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); return Array.isArray(a) ? a : []; }
      catch (e){ return []; }
    }
    function markSeen(i){
      const s = new Set(seen());
      s.add(i);
      try { localStorage.setItem(SEEN_KEY, JSON.stringify([...s])); } catch (e){}
      return s.size;
    }
    
    function show(){
      const e = C[order[at]];
      if (!e) return;
    
      $('claim').textContent = e.t;
    
      // lay the three points out on a log scale of distance from now, so a
      // 66-million-year gap and a 13-month one both fit on the same rail
      const now = e.c.year;
      const dist = (p) => Math.max(1, Math.abs(now - p.year));
      const pts = [e.a, e.b, e.c];
      const maxD = Math.max(dist(e.a), dist(e.b), 1);
      const pos = (p) => {
        const d = Math.abs(now - p.year);
        if (d === 0) return 100;
        return 4 + 92 * (1 - Math.log10(d + 1) / Math.log10(maxD + 1));
      };
    
      $('line').innerHTML = '<div class="rail"></div>' +
        ['a','b','c'].map((cls, i) => {
          const p = pts[i];
          return '<div class="pt ' + cls + '" style="left:' + pos(p).toFixed(1) + '%">' +
            '<i></i><span>' + esc(yearLabel(p.year)) + (p.est ? '~' : '') + '</span></div>';
        }).join('');
    
      const gapAB = Math.abs(e.b.year - e.a.year);
      const gapBC = Math.abs(e.c.year - e.b.year);
      const shorter = gapBC < gapAB ? 'bc' : 'ab';
    
      $('gaps').innerHTML =
        '<div class="g ' + (shorter === 'ab' ? 'short' : 'long') + '">' +
          '<div class="k">' + esc(e.a.what) + ' → ' + esc(e.b.what) + '</div>' +
          '<div class="v">' + span(gapAB) + '</div>' +
          '<div class="m">' + esc(e.a.what) + (e.a.est ? ' (estimated)' : '') + '</div></div>' +
        '<div class="g ' + (shorter === 'bc' ? 'short' : 'long') + '">' +
          '<div class="k">' + esc(e.b.what) + ' → ' + esc(e.c.what) + '</div>' +
          '<div class="v">' + span(gapBC) + '</div>' +
          '<div class="m">' + esc(e.c.what) + '</div></div>';
    
      $('check').innerHTML = '<b>How to check it.</b> ' + esc(e.check);
    
      const n = markSeen(order[at]);
      $('count').textContent = n + ' of ' + C.length + ' seen';
      if (n >= 20) unlock(n);
    }
    
    /* ---- egg #6 -------------------------------------------------------- *
     *  Twenty different comparisons in, the page turns the trick round and
     *  points it at you. The stretch it compares your visit to is a real
     *  one with a real date, and the arithmetic is done live rather than
     *  written out, so it is true whenever you read it.
     * ------------------------------------------------------------------ */
    function arrived(){
      try {
        const t = Number(localStorage.getItem(ARRIVED_KEY));
        if (Number.isFinite(t) && t > 0) return t;
      } catch (e){}
      const now = Date.now();
      try { localStorage.setItem(ARRIVED_KEY, String(now)); } catch (e){}
      return now;
    }
    
    /* Real, dated, short stretches of history, smallest first. Each is a
       thing that actually took this long. */
    const SHORT = [
      { s: 38 * 60,        w: 'the Anglo-Zanzibar War of 1896, the shortest war on record, which lasted about thirty-eight minutes' },
      { s: 2.5 * 3600,     w: 'the whole of Apollo 11’s first Moon walk, which was two and a half hours' },
      { s: 12.5 * 3600,    w: 'the entire flight of the first non-stop Atlantic crossing by aeroplane, in 1919 — a little over sixteen hours' },
      { s: 3 * 86400,      w: 'the Apollo 11 outbound journey to the Moon, which took three days' },
      { s: 12 * 86400,     w: 'the Cuban Missile Crisis, which ran thirteen days' },
      { s: 40 * 86400,     w: 'the Siege of the Alamo — thirteen days — several times over' }
    ];
    
    function unlock(n){
      const el = $('unlocked');
      const secs = Math.max(1, Math.round((Date.now() - arrived()) / 1000));
      const mins = secs / 60;
    
      // the largest real stretch this visit has now outlasted
      let beat = null;
      for (const s of SHORT) if (secs >= s.s) beat = s;
    
      const human = secs < 90 ? secs + ' seconds'
        : mins < 90 ? Math.round(mins) + ' minutes'
        : (mins / 60).toFixed(1) + ' hours';
    
      el.hidden = false;
      if (window.LCAch) LCAch.fire('closer.zanzibar');
      el.innerHTML = '<div class="k">twenty comparisons in</div>' +
        '<p>You have looked at <b>' + n + '</b> of these now, which means it is only fair to point ' +
        'the same trick at you.</p>' +
        '<p>You first opened something in this cabinet <b>' + human + '</b> ago.' +
        (beat ? ' That is already longer than ' + beat.w + '.' : '') + '</p>' +
        '<p>The Anglo-Zanzibar War, on 27 August 1896, is the shortest war anybody has a date for: ' +
        'about <b>thirty-eight minutes</b>. Whether you have beaten it yet is a question about ' +
        'this afternoon, and the page is not going to answer it for you.</p>';
    }
    
    $('go').addEventListener('click', () => { at = (at + 1) % C.length; show(); });
    $('back').addEventListener('click', () => { at = (at + C.length - 1) % C.length; show(); });
    __add(document, 'keydown', (e) => {
      if (e.target !== document.body) return;
      if (e.key === 'ArrowRight' || e.key === ' '){ e.preventDefault(); at = (at + 1) % C.length; show(); }
      if (e.key === 'ArrowLeft'){ e.preventDefault(); at = (at + C.length - 1) % C.length; show(); }
    });
    
    arrived();
    show();
    
    window.__closer = { all: C, show, seen, span,
                        forceUnlock: () => { for (let i = 0; i < C.length; i++) markSeen(i); unlock(C.length); },
                        reset: () => { try { localStorage.removeItem(SEEN_KEY); } catch (e){} } };
    

    return function () {
      __dead = true;
      __off.forEach(function (r) { try { r[0].removeEventListener(r[1], r[2], r[3]); } catch (e) {} });
      __timers.forEach(function (id) { try { window.clearTimeout(id); window.clearInterval(id); } catch (e) {} });
      __off = []; __timers = [];
    };
  });
