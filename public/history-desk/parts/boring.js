/* ------------------------------------------------------------------ *
 *  The Most Boring Day — was /boring-day/.
 *
 *  Moved across rather than rewritten: the word lists, the assembly and
 *  the room are the originals. The content is the toy, and retyping it
 *  is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCPart("boring", "The Most Boring Day", "The day on which the least is recorded as having happened.", {
  "--shell-bg": "#F2F0EA",
  "--shell-ink": "#211F1A",
  "--shell-body": "ui-sans-serif, system-ui, \"Helvetica Neue\", Arial, sans-serif",
  "--shell-bar": "rgba(0,0,0,.24)",
  "--shell-rule": "rgba(128,128,128,.34)",
  "--shell-field": "rgba(127,127,127,.14)"
},
`

:root{
  --paper:#F2F0EA;
  --card:#FFFFFF;
  --ink:#211F1A;
  --ink-2:#54514A;
  --dim:#8B887F;
  --quiet:#4E7C5C;
  --rule:#DAD6CA;
  --sans:ui-sans-serif,system-ui,"Helvetica Neue",Arial,sans-serif;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --serif:"Iowan Old Style","Palatino Linotype",Georgia,serif;
  --display:"Avenir Next Condensed","Roboto Condensed","Arial Narrow",var(--sans);
}
.room{ background:var(--paper);color:var(--ink);font-family:var(--sans);padding:26px 18px 70px }
.wrap{ max-width:860px;margin:0 auto }
h1{ font-family:var(--display);font-size:clamp(26px,5.6vw,42px);margin:0;letter-spacing:.03em;text-transform:uppercase;font-weight:700 }
.sub{ font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);margin-top:8px }

/* ---- the year ---- */
.year{ margin-top:22px;overflow-x:auto;padding-bottom:4px }
table{ border-collapse:collapse;font-family:var(--mono);font-size:10px }
th{ font-weight:400;color:var(--dim);letter-spacing:.09em;text-transform:uppercase;padding:0 5px 6px;text-align:left }
th.n{ text-align:center;padding:0 0 6px;width:20px }
td.m{ color:var(--ink-2);padding-right:8px;white-space:nowrap;letter-spacing:.07em }
td.c{ padding:1px }
.cell{
  width:20px;height:20px;border-radius:2px;cursor:pointer;position:relative;
  display:flex;align-items:center;justify-content:center;
}
.cell.blank{ background:none;cursor:default }
.cell:hover{ outline:2px solid var(--ink);outline-offset:-1px }
.cell.min{ outline:2px solid var(--quiet);outline-offset:-1px }
.cell.on{ outline:2px solid var(--ink);outline-offset:-1px }
.cell:focus-visible{ outline:2px solid var(--ink);outline-offset:1px }

.key{ display:flex;align-items:center;gap:7px;margin-top:12px;font-family:var(--mono);font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--dim);flex-wrap:wrap }
.key i{ width:18px;height:12px;border-radius:2px;display:inline-block }

/* ---- the day ---- */
.result{ margin-top:22px;background:var(--card);border:1px solid var(--rule);border-radius:4px;padding:22px 24px;min-height:120px }
.result .lbl{ font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--quiet);margin-bottom:9px }
.result h2{ font-family:var(--serif);font-size:clamp(23px,5vw,34px);margin:0 0 6px }
.result .cnt{ font-family:var(--mono);font-size:11.5px;color:var(--dim);letter-spacing:.07em;margin-bottom:16px;line-height:1.7 }
.result .cnt b{ color:var(--ink) }
.result h3{ font-family:var(--mono);font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);font-weight:400;margin:0 0 11px;border-top:1px solid var(--rule);padding-top:15px }
.result ul{ margin:0;padding-left:19px }
.result li{ font-family:var(--serif);font-size:15.5px;line-height:1.68;color:var(--ink-2);margin-bottom:9px }
.result li b{ color:var(--ink);font-family:var(--mono);font-size:12px;margin-right:7px }
.result .loading{ font-family:var(--mono);font-size:11px;color:var(--dim);letter-spacing:.1em }

.caveat{
  margin-top:18px;border-left:3px solid var(--rule);padding:13px 16px;background:#EDEBE4;
  font-size:13.5px;line-height:1.75;color:var(--ink-2);
}
.caveat b{ color:var(--ink) }

footer{
  max-width:860px;margin:22px auto 0;padding-top:14px;border-top:1px solid var(--rule);
  font-family:var(--mono);font-size:10.5px;line-height:1.9;color:var(--dim);
}
footer a{ color:var(--ink-2) }

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

    root.innerHTML = "<div class=\"wrap\">\n  <h1>The Quietest Day</h1>\n  <div class=\"sub\">the opposite of on this day</div>\n\n  <div class=\"year\" id=\"year\"></div>\n  <div class=\"key\">\n    <span>fewest entries</span>\n    <i style=\"background:#EDEAE1\"></i><i style=\"background:#D6DCCF\"></i><i style=\"background:#B2C4AE\"></i>\n    <i style=\"background:#85A388\"></i><i style=\"background:#5A8064\"></i><i style=\"background:#33553F\"></i>\n    <span>most</span>\n    <span style=\"margin-left:8px\">\u00b7 click any day to read what is on it</span>\n  </div>\n\n  <div class=\"result\" id=\"result\"></div>\n\n  <div class=\"caveat\">\n    <b>What this actually measures.</b> The colours count how many entries Wikipedia's editors have\n    written for each date \u2014 not how much happened on it. A quiet day here is a day that was\n    <em>recorded</em> less, which is a fact about the encyclopedia rather than a fact about history.\n    Coverage leans heavily towards the last few centuries and the English-speaking world, and the lean\n    is visible in the grid: the first of January is the darkest square of the year, which tells you\n    something about record-keeping and nothing at all about the first of January.\n  </div>\n</div>";

    
    'use strict';
    
    const $ = (id) => document.getElementById(id);
    const esc = (s) => String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const pad = (n) => String(n).padStart(2, '0');
    
    const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const SHORT  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const DAYS_IN = [31,29,31,30,31,30,31,31,30,31,30,31];   // the feed carries a 29 February
    
    // Six steps, dark for busy. Counting entries is a rough measure and six
    // buckets is about as fine as it deserves to be read.
    const SCALE = ['#EDEAE1','#D6DCCF','#B2C4AE','#85A388','#5A8064','#33553F'];
    
    let counts = {};
    
    fetch('/history-desk/counts.json')
      .then(r => r.json())
      .then(j => { counts = j; render(); showQuietest(); })
      .catch(() => {
        $('year').innerHTML = '<p style="font-family:var(--mono);font-size:12px;color:var(--dim)">' +
          'could not load the year</p>';
      });
    
    const values = () => Object.values(counts).filter(v => typeof v === 'number');
    
    function colourFor(v, lo, hi){
      const t = (v - lo) / Math.max(1, hi - lo);
      return SCALE[Math.min(SCALE.length - 1, Math.floor(t * SCALE.length))];
    }
    
    function render(){
      const vals = values();
      const lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
      const minKeys = Object.keys(counts).filter(k => counts[k] === lo);
    
      let html = '<table><thead><tr><th></th>';
      for (let d = 1; d <= 31; d++) html += '<th class="n">' + (d === 1 || d % 5 === 0 ? d : '') + '</th>';
      html += '</tr></thead><tbody>';
      for (let m = 1; m <= 12; m++){
        html += '<tr><td class="m">' + SHORT[m - 1] + '</td>';
        for (let d = 1; d <= 31; d++){
          if (d > DAYS_IN[m - 1]){ html += '<td class="c"><div class="cell blank"></div></td>'; continue; }
          const key = pad(m) + '-' + pad(d);
          const v = counts[key];
          html += '<td class="c"><div class="cell' + (minKeys.indexOf(key) >= 0 ? ' min' : '') +
            '" data-k="' + key + '" title="' + MONTHS[m - 1] + ' ' + d + ' · ' + v + ' entries"' +
            ' tabindex="0" role="button" aria-label="' + MONTHS[m - 1] + ' ' + d + ', ' + v + ' entries"' +
            ' style="background:' + colourFor(v, lo, hi) + '"></div></td>';
        }
        html += '</tr>';
      }
      html += '</tbody></table>';
      $('year').innerHTML = html;
    }
    
    $('year').addEventListener('click', (e) => {
      const c = e.target.closest('.cell[data-k]');
      if (c) openDay(c.dataset.k);
    });
    $('year').addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const c = e.target.closest('.cell[data-k]');
      if (c){ e.preventDefault(); openDay(c.dataset.k); }
    });
    
    function showQuietest(){
      const vals = values();
      const lo = Math.min.apply(null, vals);
      const ties = Object.keys(counts).filter(k => counts[k] === lo).sort();
      openDay(ties[0], {
        lead: ties.length > 1
          ? 'joint quietest day of the year'
          : 'the quietest day of the year',
        also: ties.slice(1),
      });
    }
    
    // The feed gives years before the common era as negative numbers.
    const year = (y) => (y == null ? '—' : y < 0 ? (-y) + ' BC' : String(y));
    
    const pretty = (k) => {
      const [m, d] = k.split('-').map(Number);
      return MONTHS[m - 1] + ' ' + d;
    };
    
    async function openDay(key, opts){
      opts = opts || {};
      const [m, d] = key.split('-').map(Number);
      const v = counts[key];
      const vals = values();
      const hi = Math.max.apply(null, vals);
      const busiest = Object.keys(counts).filter(k => counts[k] === hi).sort()[0];
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    
      document.querySelectorAll('.cell.on').forEach(c => c.classList.remove('on'));
      const cell = document.querySelector('.cell[data-k="' + key + '"]');
      if (cell) cell.classList.add('on');
    
      $('result').innerHTML =
        '<div class="lbl">' + esc(opts.lead || 'one day of the year') + '</div>' +
        '<h2>' + pretty(key) + '</h2>' +
        '<div class="cnt"><b>' + v + '</b> recorded events' +
          (opts.also && opts.also.length
            ? ' &nbsp;·&nbsp; tied with ' + opts.also.map(pretty).join(', ')
            : '') +
          ' &nbsp;·&nbsp; the year averages ' + mean.toFixed(0) +
          ' &nbsp;·&nbsp; the busiest day is ' + pretty(busiest) + ', with ' + hi +
        '</div>' +
        '<h3>everything the encyclopedia has for that date</h3>' +
        '<div class="loading" id="ev">reading the entries…</div>';
    
      try {
        const r = await fetch('/api/onthisday?month=' + m + '&day=' + d);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const j = await r.json();
        const items = j.items || [];
        $('ev').outerHTML = '<ul>' + items.map(it =>
          '<li><b>' + esc(year(it.year)) + '</b>' +
          esc(it.text || '') + '</li>').join('') + '</ul>';
      } catch (e) {
        $('ev').textContent = 'could not reach the feed just now — the count above is from the snapshot';
      }
    }
    

    return function () {
      __dead = true;
      __off.forEach(function (r) { try { r[0].removeEventListener(r[1], r[2], r[3]); } catch (e) {} });
      __timers.forEach(function (id) { try { window.clearTimeout(id); window.clearInterval(id); } catch (e) {} });
      __off = []; __timers = [];
    };
  });
