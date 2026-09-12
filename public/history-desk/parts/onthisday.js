/* ------------------------------------------------------------------ *
 *  On This Day — was /on-this-day/.
 *
 *  Moved across rather than rewritten: the word lists, the assembly and
 *  the room are the originals. The content is the toy, and retyping it
 *  is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCPart("onthisday", "On This Day", "What happened, read as though it were breaking.", {
  "--shell-bg": "#0B0B0D",
  "--shell-ink": "rgb(245, 245, 247)",
  "--shell-body": "ui-sans-serif, system-ui, \"Helvetica Neue\", Arial, sans-serif",
  "--shell-bar": "rgba(0,0,0,.24)",
  "--shell-rule": "rgba(128,128,128,.34)",
  "--shell-field": "rgba(127,127,127,.14)"
},
`

:root{
  --black:#0B0B0D;
  --panel:#141418;
  --panel-2:#1D1D23;
  --red:#E4141B;
  --red-dk:#8E0A0F;
  --white:#F5F5F7;
  --grey:#9A9AA6;
  --amber:#F0B429;
  --cond:"Haettenschweiler","Arial Narrow","Oswald",system-ui,sans-serif;
  --sans:ui-sans-serif,system-ui,"Helvetica Neue",Arial,sans-serif;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
}
.room{
  background:var(--black);
  color:var(--white);
  font-family:var(--sans);
  
  display:flex;flex-direction:column;
  padding:20px 16px 0;
}
.shell{ width:100%;max-width:900px;margin:0 auto;flex:1;display:flex;flex-direction:column }

/* ---------- channel bar ---------- */
.chrome{
  display:flex;align-items:center;gap:12px;
  border-bottom:2px solid var(--red);
  padding-bottom:9px;margin-bottom:0;
}
.logo{
  font-family:var(--cond);
  font-size:26px;letter-spacing:.02em;text-transform:uppercase;
  line-height:1;
  background:var(--red);color:#fff;padding:7px 10px 5px;
}
.live{
  display:flex;align-items:center;gap:6px;
  font-family:var(--mono);font-size:11px;letter-spacing:.14em;
  color:var(--red);text-transform:uppercase;
}
.live i{
  width:8px;height:8px;border-radius:50%;background:var(--red);display:block;
  animation:pulse 1.4s infinite;
}
@keyframes pulse{ 0%,100%{opacity:1} 50%{opacity:.25} }
.clock{
  margin-left:auto;font-family:var(--mono);font-size:11.5px;color:var(--grey);
  letter-spacing:.06em;text-align:right;line-height:1.5;
}

/* ---------- broadcast frame ---------- */
.screen{
  position:relative;background:var(--panel);
  aspect-ratio:16/9;width:100%;
  overflow:hidden;
  border:1px solid #2A2A32;border-top:0;
}
.screen img{
  width:100%;height:100%;object-fit:cover;display:block;
  filter:saturate(.9) contrast(1.03);
}
.noimg{
  position:absolute;inset:0;
  background:
    repeating-linear-gradient(135deg,#17171C 0 22px,#1C1C22 22px 44px);
  display:flex;align-items:center;justify-content:center;
}
.noimg span{
  font-family:var(--cond);font-size:clamp(40px,9vw,86px);
  color:#25252D;text-transform:uppercase;letter-spacing:.03em;
}
.vignette{
  position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(180deg,rgba(0,0,0,.45) 0%,rgba(0,0,0,0) 26%,rgba(0,0,0,0) 40%,rgba(0,0,0,.88) 100%);
}
.yearsago{
  position:absolute;top:14px;right:14px;
  background:rgba(11,11,13,.82);border-left:3px solid var(--amber);
  padding:7px 11px 6px;text-align:right;
}
.yearsago b{ display:block;font-family:var(--cond);font-size:27px;line-height:1;color:var(--amber) }
.yearsago span{ font-family:var(--mono);font-size:9.5px;letter-spacing:.12em;color:var(--grey);text-transform:uppercase }

/* lower third */
.third{ position:absolute;left:0;right:0;bottom:0;padding:0 0 12px }
.kicker{
  display:inline-flex;align-items:center;gap:8px;
  background:var(--red);color:#fff;
  font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;
  text-transform:uppercase;padding:5px 10px;margin-left:14px;
}
.headline{
  margin:7px 14px 0;
  font-family:var(--cond);
  font-size:clamp(21px,3.5vw,33px);
  line-height:1.1;text-transform:uppercase;letter-spacing:.005em;
  text-shadow:0 2px 14px rgba(0,0,0,.9);
  max-width:94%;
}
.dateline{
  margin:7px 14px 0;font-family:var(--mono);font-size:11px;color:#D6D6DE;
  text-shadow:0 1px 8px rgba(0,0,0,.9);
}
.dateline a{ color:var(--amber);text-decoration:none;border-bottom:1px solid rgba(240,180,41,.4) }
.dateline a:hover{ border-bottom-color:var(--amber) }

/* ---------- ticker ---------- */
.crawl{
  background:var(--red-dk);border-top:2px solid var(--red);
  overflow:hidden;white-space:nowrap;position:relative;height:34px;
}
.crawl-label{
  position:absolute;left:0;top:0;bottom:0;z-index:2;
  background:var(--red);color:#fff;display:flex;align-items:center;
  padding:0 11px;font-family:var(--mono);font-size:10px;letter-spacing:.14em;
}
.crawl-track{
  display:inline-flex;align-items:center;height:34px;
  padding-left:100%;
  /* 42s was a headline every couple of seconds, which is a stock ticker
     rather than a news crawl. Slowed to roughly half that pace, which
     is what a real lower-third crawl reads at, and paused on hover so
     an item you want to finish reading will wait for you. */
  animation:crawl 96s linear infinite;
}
.crawl-track span{
  font-family:var(--sans);font-size:12.5px;color:#FFE9EA;padding-right:38px;
}
.crawl-track span::before{ content:"◆";color:var(--amber);margin-right:12px;font-size:8px;vertical-align:middle }
@keyframes crawl{ from{transform:translateX(0)} to{transform:translateX(-100%)} }
.crawl:hover .crawl-track, .crawl:focus-within .crawl-track{ animation-play-state:paused }
/* Hovering is how a mouse holds this still; a phone has no hover at all,
   so on touch a tap holds it and a second tap lets it go. Without this
   the ticker simply cannot be stopped on a phone, which is the one thing
   people want to do to a ticker. */
.crawl.held .crawl-track{ animation-play-state:paused }
@media (hover: none){ .crawl{ cursor:pointer } }

/* ---------- controls ---------- */
.deck{
  display:flex;flex-wrap:wrap;gap:8px;align-items:center;
  padding:14px 0 20px;
}
button, select, input[type=date]{
  font-family:var(--mono);font-size:11.5px;letter-spacing:.05em;
  background:var(--panel-2);color:var(--white);
  border:1px solid #33333D;padding:9px 13px;cursor:pointer;
  text-transform:uppercase;
}
button:hover, select:hover{ background:#2A2A33;border-color:#4A4A57 }
button:focus-visible, select:focus-visible, input:focus-visible{ outline:2px solid var(--amber);outline-offset:2px }
button.primary{ background:var(--red);border-color:var(--red);color:#fff;font-weight:700 }
button.primary:hover{ background:#F42027 }
.seg{ display:flex;border:1px solid #33333D }
.seg button{ border:0;border-right:1px solid #33333D;background:transparent }
.seg button:last-child{ border-right:0 }
.seg button[aria-pressed="true"]{ background:var(--white);color:var(--black);font-weight:700 }
.spacer{ flex:1 }
input[type=date]{ text-transform:none;color-scheme:dark }
.count{ font-family:var(--mono);font-size:11px;color:var(--grey) }

.state{
  padding:30px 16px;text-align:center;font-family:var(--mono);
  font-size:12.5px;color:var(--grey);line-height:1.7;
}
.state b{ color:var(--red);display:block;margin-bottom:6px;letter-spacing:.1em }

footer{
  border-top:1px solid #24242C;padding:14px 0 22px;
  font-family:var(--mono);font-size:10.5px;color:#5C5C68;line-height:1.7;
}
footer a{ color:#7A7A88 }

@media (prefers-reduced-motion:reduce){
  .crawl-track{ animation:none;padding-left:0 }
  .live i{ animation:none }
}
@media (max-width:560px){
  .logo{ font-size:20px }
  .yearsago b{ font-size:20px }
  .crawl-label{ display:none }
  /* The category strip is a segmented control: wrapping it breaks the shared
     borders, so on a narrow deck it scrolls sideways instead. */
  .seg{ min-width:0;max-width:100%;overflow-x:auto;overscroll-behavior-x:contain }
  .seg button{ flex:0 0 auto }
}
@media (pointer:coarse){
  button, select, input[type=date]{ min-height:44px;padding:0 13px }
  .seg button{ min-height:42px }
  /* On a phone the crawl is a tap target (tap to hold it still). */
  .crawl, .crawl-track{ height:44px }
}

/* ---------- shared: back to the cabinet ----------
   Every toy carries the same control in the same place, so there is always
   one way out that does not depend on scrolling to a footer. It sits as a
   compact disc and opens to the word on hover or focus, because a wide
   permanent chip covers whatever is in the corner of a scrolling page. */
/* A 38px pill is under the 44px a fingertip needs. */
@media (pointer:coarse){ #lc-back{ width:44px;height:44px } }
/* so the foot of a page can always scroll clear of it */
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

    root.innerHTML = "<div class=\"shell\">\n\n  <div class=\"chrome\">\n    <div class=\"logo\">On This Day</div>\n    <div class=\"live\"><i></i> Live</div>\n    <div class=\"clock\" id=\"clock\">\u2014</div>\n  </div>\n\n  <div class=\"screen\" id=\"screen\">\n    <div class=\"noimg\"><span>Standby</span></div>\n    <div class=\"vignette\"></div>\n    <div class=\"third\">\n      <div class=\"kicker\" id=\"kicker\">Breaking</div>\n      <div class=\"headline\" id=\"headline\">Tuning the satellite\u2026</div>\n      <div class=\"dateline\" id=\"dateline\"></div>\n    </div>\n  </div>\n\n  <div class=\"crawl\">\n    <div class=\"crawl-label\">Also today</div>\n    <div class=\"crawl-track\" id=\"crawl\"></div>\n  </div>\n\n  <div class=\"deck\">\n    <button class=\"primary\" id=\"next\">Next story \u25b8</button>\n    <div class=\"seg\" id=\"cats\"></div>\n    <div class=\"spacer\"></div>\n    <span class=\"count\" id=\"count\"></span>\n    <input type=\"date\" id=\"date\" aria-label=\"Choose a date\">\n  </div>\n\n  <div id=\"state\"></div>\n\n  \n</div>";

    
    'use strict';
    
    const $ = (id) => document.getElementById(id);
    const CATS = [
      { key: 'selected', label: 'Top', kicker: 'Breaking' },
      { key: 'events',   label: 'Events', kicker: 'Developing' },
      { key: 'births',   label: 'Births', kicker: 'Profile' },
      { key: 'deaths',   label: 'Deaths', kicker: 'Obituary' },
      { key: 'holidays', label: 'Holidays', kicker: 'Observed' },
    ];
    
    let feed = null;      // the whole day's payload
    let cat = 'selected';
    let idx = 0;
    let order = [];       // shuffled indices for the active category
    
    const pad = (n) => String(n).padStart(2, '0');
    const esc = (s) => String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    
    function shuffle(n){
      const a = [...Array(n).keys()];
      for (let i = a.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
    
    function renderCats(){
      $('cats').innerHTML = '';
      CATS.forEach(c => {
        const n = feed && feed[c.key] ? feed[c.key].length : 0;
        const b = document.createElement('button');
        b.textContent = c.label + (n ? ' ' + n : '');
        b.setAttribute('aria-pressed', String(c.key === cat));
        b.disabled = !n;
        b.style.opacity = n ? '' : '.4';
        b.onclick = () => { cat = c.key; reorder(); show(); renderCats(); };
        $('cats').appendChild(b);
      });
    }
    
    function reorder(){
      const list = (feed && feed[cat]) || [];
      order = shuffle(list.length);
      idx = 0;
    }
    
    // Wikimedia hands back a few different image hosts; thumb.wikimedia.org
    // is blocked cross-origin (ERR_BLOCKED_BY_ORB), so normalise onto
    // upload.wikimedia.org and ask for a width the frame can actually use.
    function bestImage(page){
      const src = page && page.thumbnail && page.thumbnail.source;
      if (!src) return null;
      const small = src.replace('//thumb.wikimedia.org/', '//upload.wikimedia.org/');
      return { small, big: small.replace(/\/\d+px-/, '/960px-') };
    }
    
    function placeholder(label){
      const d = document.createElement('div');
      d.className = 'noimg';
      d.innerHTML = '<span>' + esc(label || 'No picture') + '</span>';
      return d;
    }
    
    // Wikipedia's own wording is kept verbatim — the drama is all staging.
    function show(){
      const list = (feed && feed[cat]) || [];
      if (!list.length){ return; }
      const item = list[order[idx % order.length]];
      const meta = CATS.find(c => c.key === cat);
      const page = (item.pages && item.pages[0]) || null;
      const thumb = bestImage(page);
    
      const screen = $('screen');
      const old = screen.querySelector('img, .noimg');
      const holder = document.createElement(thumb ? 'img' : 'div');
      if (thumb){
        holder.src = thumb.big;
        holder.alt = page.normalizedtitle || '';
        // Fall back to the feed's own width, then to the slate, rather than
        // leaving a blank frame if the upscale or the host is unavailable.
        let tried = 0;
        holder.onerror = () => {
          tried++;
          if (tried === 1 && thumb.small !== thumb.big) { holder.src = thumb.small; return; }
          holder.replaceWith(placeholder(meta.label));
        };
      } else {
        holder.className = 'noimg';
        holder.innerHTML = '<span>' + esc(meta.label) + '</span>';
      }
      old.replaceWith(holder);
    
      $('kicker').textContent = meta.kicker;
      $('headline').textContent = item.text || (page && page.normalizedtitle) || '—';
    
      const yr = item.year;
      let ya = screen.querySelector('.yearsago');
      if (yr != null){
        if (!ya){ ya = document.createElement('div'); ya.className = 'yearsago'; screen.appendChild(ya); }
        const now = new Date().getFullYear();
        const ago = now - yr;
        ya.innerHTML = '<b>' + (yr < 0 ? Math.abs(yr) + ' BC' : yr) + '</b><span>' + ago.toLocaleString() + ' years ago</span>';
      } else if (ya){ ya.remove(); }
    
      const link = page ? 'https://en.wikipedia.org/wiki/' + encodeURIComponent(page.title) : null;
      $('dateline').innerHTML =
        (yr != null ? esc(String(yr)) + ' — ' : '') +
        (link ? 'source: <a href="' + link + '" target="_blank" rel="noopener">' + esc(page.normalizedtitle) + '</a>' : 'no linked article');
    
      $('count').textContent = (idx % order.length + 1) + ' / ' + list.length;
    }
    
    function buildCrawl(){
      const pool = [];
      ['events','selected','holidays'].forEach(k => {
        (feed[k] || []).forEach(e => {
          const t = e.text || '';
          if (t) pool.push((e.year != null ? e.year + ': ' : '') + t);
        });
      });
      const picked = shuffle(pool.length).slice(0, 26).map(i => pool[i]);
      // duplicated so the marquee has no visible gap on the wrap
      $('crawl').innerHTML = picked.concat(picked)
        .map(t => '<span>' + esc(t) + '</span>').join('');
    }
    
    function setClock(d){
      const opts = { weekday:'long', day:'numeric', month:'long' };
      $('clock').innerHTML = d.toLocaleDateString('en-GB', opts).toUpperCase() +
        '<br>' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    }
    
    async function load(d){
      $('state').innerHTML = '<div class="state">Contacting the archive…</div>';
      const url = 'https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/' +
                  pad(d.getMonth() + 1) + '/' + pad(d.getDate());
      try {
        const r = await fetch(url, { headers: { 'Api-User-Agent': 'little-contraptions/1.0 (hub toy)' } });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        feed = await r.json();
        if (!CATS.some(c => (feed[c.key] || []).length)) throw new Error('empty feed');
        $('state').innerHTML = '';
        if (!(feed[cat] || []).length) cat = CATS.find(c => (feed[c.key] || []).length).key;
        renderCats();
        reorder();
        show();
        buildCrawl();
      } catch (err) {
        $('state').innerHTML = '<div class="state"><b>Transmission lost</b>' +
          'Could not reach the Wikimedia feed (' + esc(err.message) + ').<br>' +
          'It is a public endpoint with no key, so this is usually a network blip — try again.</div>';
        $('headline').textContent = 'No signal';
        $('dateline').textContent = '';
      }
    }
    
    /* ------------------------------ boot ------------------------------- */
    const today = new Date();
    $('date').value = today.getFullYear() + '-' + pad(today.getMonth()+1) + '-' + pad(today.getDate());
    setClock(today);
    setInterval(() => setClock(new Date()), 1000);
    
    $('next').addEventListener('click', () => { idx++; show(); });
    $('date').addEventListener('change', (e) => {
      const parts = e.target.value.split('-').map(Number);
      if (parts.length === 3 && !parts.some(isNaN)) load(new Date(parts[0], parts[1]-1, parts[2]));
    });
    
    load(today);
    
    /* ---- tap to hold the ticker still (touch only) --------------------- */
    (function(){
      var holder = document.querySelector('.crawl');
      if (!holder) return;
      if (window.matchMedia && !matchMedia('(hover: none)').matches) return;
      holder.setAttribute('role', 'button');
      holder.setAttribute('tabindex', '0');
      holder.setAttribute('aria-label', 'Tap to hold the ticker still');
      holder.addEventListener('click', function(){
        var held = holder.classList.toggle('held');
        holder.setAttribute('aria-pressed', String(held));
      });
    })();
    

    return function () {
      __dead = true;
      __off.forEach(function (r) { try { r[0].removeEventListener(r[1], r[2], r[3]); } catch (e) {} });
      __timers.forEach(function (id) { try { window.clearTimeout(id); window.clearInterval(id); } catch (e) {} });
      __off = []; __timers = [];
    };
  });
