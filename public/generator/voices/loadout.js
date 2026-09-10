/* ------------------------------------------------------------------ *
 *  Voice: Loadout Card.
 *
 *  Was /tactical-loadout/. Moved across rather than rewritten: the word lists, the
 *  assembly and the room are the originals. The prose is the toy, and
 *  retyping it is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCGen.voice({
  id: "loadout",
  name: "Loadout Card",
  blurb: "What you are carrying, and what it says about you.",
  page: {
      "--gen-bg": "rgb(22, 26, 17)",
      "--gen-ink": "#DDE2CE",
      "--gen-body": "ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      "--gen-bar": "rgba(0,0,0,.22)",
      "--gen-rule": "rgba(128,128,128,.35)",
      "--gen-field": "rgba(127,127,127,.14)"
  },

  css: `

:root{
  --field:#161A11;
  --drab:#2A3020;
  --drab-2:#353D28;
  --edge:#4A553A;
  --olive:#6B7A3A;
  --lime:#A8B84A;
  --sand:#C9BE94;
  --ink:#DDE2CE;
  --dim:#8A9375;
  --warn:#C4622E;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --stencil:"Stardos Stencil","Big Shoulders Stencil Text","Impact","Haettenschweiler",
            "Arial Narrow Bold","Arial Narrow",var(--mono);
}
.room{
  background:var(--field);
  background-image:
    repeating-linear-gradient(0deg, rgba(255,255,255,.014) 0 1px, transparent 1px 3px),
    radial-gradient(120% 70% at 50% 0%, rgba(107,122,58,.13), transparent 62%);
  color:var(--ink);font-family:var(--mono);font-size:12px;
  padding:22px 14px 84px;
  display:flex;flex-direction:column;align-items:center;
}
.wrap{ max-width:780px;width:100% }

header{ border-bottom:2px solid var(--olive);padding-bottom:11px;margin-bottom:16px }
h1{
  margin:0;font-family:var(--stencil);font-size:clamp(26px,6.4vw,42px);
  letter-spacing:.14em;text-transform:uppercase;color:var(--lime);font-weight:700;
  /* the stencil bridges, drawn rather than fonted, so the look does not
     depend on a webfont that is not allowed to load here */
  position:relative;
}
h1::after{
  content:'';position:absolute;left:0;right:0;top:32%;height:9%;
  background:var(--field);
}
.sub{
  margin-top:9px;font-size:9.5px;letter-spacing:.28em;text-transform:uppercase;color:var(--dim);
  display:flex;gap:14px;flex-wrap:wrap;
}

/* ---------- the card ---------- */
.card{ background:var(--drab);border:1px solid var(--edge);position:relative }
.card::before{
  content:'';position:absolute;left:0;top:0;bottom:0;width:4px;
  background:repeating-linear-gradient(180deg,var(--lime) 0 8px,transparent 8px 16px);
}
.card .head{
  display:flex;gap:12px;align-items:baseline;flex-wrap:wrap;
  padding:13px 16px 11px 20px;border-bottom:1px solid var(--edge);background:var(--drab-2);
}
.card .call{
  font-family:var(--stencil);font-size:26px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--lime);font-weight:700;
}
.card .role{ font-size:9.5px;letter-spacing:.24em;text-transform:uppercase;color:var(--sand) }
.card .num{ margin-left:auto;font-size:10px;letter-spacing:.14em;color:var(--dim) }

.grid{ display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--edge) }
@media (max-width:600px){ .grid{ grid-template-columns:1fr } }
.cell{ background:var(--drab);padding:13px 16px 13px 20px }
.cell h3{
  margin:0 0 7px;font-size:9px;letter-spacing:.24em;text-transform:uppercase;
  color:var(--olive);font-weight:700;
}
.cell .v{ font-size:14.5px;line-height:1.4;color:var(--ink) }
.cell .n{ font-size:11px;line-height:1.65;color:var(--dim);margin-top:5px }
.cell.wide{ grid-column:1 / -1 }

.chips{ display:flex;gap:5px;flex-wrap:wrap;margin-top:7px }
.chip{
  font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;
  border:1px solid var(--edge);color:var(--sand);padding:3px 8px;
}
.chip.hot{ border-color:var(--warn);color:var(--warn) }

.bars{ margin-top:8px }
.bar{ display:flex;align-items:center;gap:9px;margin-bottom:4px;font-size:10px;letter-spacing:.1em }
.bar .k{ width:88px;color:var(--dim);text-transform:uppercase;flex:0 0 auto }
.bar .t{ flex:1;height:9px;background:#1D2216;border:1px solid var(--edge);position:relative }
.bar .t i{ position:absolute;left:0;top:0;bottom:0;background:var(--olive) }
.bar .t i.hi{ background:var(--lime) }
.bar .d{ width:26px;text-align:right;color:var(--sand);flex:0 0 auto }

.brief{
  margin-top:1px;background:var(--drab);border-top:1px solid var(--edge);
  padding:14px 16px 14px 20px;font-size:13px;line-height:1.7;color:#C8CFB6;
}
.brief b{ color:var(--lime);font-weight:700 }

/* ---------- controls ---------- */
.deck{ display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;align-items:center }
button{
  font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;
  background:var(--olive);color:#111409;border:1px solid var(--lime);
  padding:12px 20px;cursor:pointer;font-weight:700;
}
button:hover{ background:var(--lime) }
button.sec{ background:transparent;color:var(--ink);border-color:var(--edge);font-weight:400 }
button.sec:hover{ border-color:var(--lime);color:var(--lime) }
button:focus-visible{ outline:2px solid var(--sand);outline-offset:2px }
.sound{
  margin-left:auto;display:flex;align-items:center;gap:7px;
  font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);
}
.sound input{ width:15px;height:15px;accent-color:var(--lime) }

footer{
  max-width:780px;width:100%;margin:24px auto 0;padding-top:14px;border-top:1px solid var(--edge);
  font-size:10.5px;line-height:1.85;color:var(--dim);
}
footer a{ color:var(--lime) }

/* ---------- shared: back to the cabinet ---------- */
/* --- touch targets (sweep) --- */
@media (pointer:coarse){
  #go, #snd, .sec{ min-height:44px }
  #snd{ min-width:44px }
}

/* A 38px pill is under the 44px a fingertip needs. */
@media (pointer:coarse){ #lc-back{ width:44px;height:44px } }
@media (max-width:520px){ #lc-back{ left:10px;bottom:10px } }
@media (prefers-reduced-motion: reduce){ #lc-back{ transition:none } }

`,

  mount: function (root) {
    /* Listeners this voice puts on the document or the window outlive
       root.innerHTML = '', so they are tracked and handed back for
       teardown. Otherwise a key pressed three voices later still reaches
       a toy that is no longer on the screen. */
    var __off = [], __timers = [], __dead = false;
    function __add(t, ty, fn, o){ t.addEventListener(ty, fn, o); __off.push([t, ty, fn, o]); }

    /* Timers outlive innerHTML the same way listeners do, and worse: a
       stray setTimeout from a voice you left three minutes ago wakes up,
       looks for an element that belongs to the voice now on screen, and
       throws in a file the visitor is not even looking at. That is
       exactly what happened — a pending timer in the pitch deck threw
       while the TV voice was up.

       These shadow the globals inside this closure, so the ported code
       gets them without being changed, and the dead flag catches work
       that was already in flight when the voice was torn down. */
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

    root.innerHTML = "<div class=\"wrap\">\n  <header>\n    <h1>Loadout Card</h1>\n    <div class=\"sub\"><span>issue &middot; one per operator</span><span id=\"stamp\"></span></div>\n  </header>\n\n  <div class=\"card\" id=\"card\">\n    <div class=\"head\">\n      <span class=\"call\" id=\"call\">\u2014</span>\n      <span class=\"role\" id=\"role\"></span>\n      <span class=\"num\" id=\"num\"></span>\n    </div>\n    <div class=\"grid\">\n      <div class=\"cell\"><h3>Primary</h3><div class=\"v\" id=\"p1\"></div><div class=\"n\" id=\"p1n\"></div></div>\n      <div class=\"cell\"><h3>Sidearm</h3><div class=\"v\" id=\"p2\"></div><div class=\"n\" id=\"p2n\"></div></div>\n      <div class=\"cell\"><h3>Utility</h3><div class=\"v\" id=\"u1\"></div><div class=\"n\" id=\"u1n\"></div></div>\n      <div class=\"cell\"><h3>Second slot</h3><div class=\"v\" id=\"u2\"></div><div class=\"n\" id=\"u2n\"></div></div>\n      <div class=\"cell wide\"><h3>Kit</h3><div class=\"chips\" id=\"kit\"></div></div>\n      <div class=\"cell wide\"><h3>Assessment</h3><div class=\"bars\" id=\"bars\"></div></div>\n    </div>\n    <div class=\"brief\" id=\"brief\"></div>\n  </div>\n\n  <div class=\"deck\">\n    <button id=\"go\" type=\"button\">Issue new card</button>\n    <button id=\"reroll\" class=\"sec\" type=\"button\">Same operator, new kit</button>\n    <label class=\"sound\"><input type=\"checkbox\" id=\"snd\" checked> radio</label>\n  </div>\n</div>";

    
    'use strict';
    const $ = (id) => document.getElementById(id);
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    
    /* ------------------------------------------------------------------ *
     *  Invented kit. The register is the tactical shooter in general —
     *  breach, hold, deny, spot — rather than any one of them.
     * ------------------------------------------------------------------ */
    const CALLS = ['DRYSTONE','KESTREL','HALLOW','OXBOW','TINSMITH','VESPERS','CARRACK','MILLRACE',
      'GANNET','PLUMBLINE','SALTMARSH','HAWTHORN','BELLWEATHER','LONGSHORE','CINDERFALL','ROOKWOOD',
      'PARAPET','TALLOWAY','QUARRYMAN','SEAWALL'];
    const UNITS = ['Coastal Interdiction Wing','the Fourth Sapper Detachment','Mountain Rescue, seconded',
      'Harbour Protection Group','the Long Bridge Detail','Northern Signals Company',
      'Municipal Bomb Disposal','the Tunnel Survey Section','Cold Weather Trials Unit'];
    const ROLES = ['breach','anchor','recon','denial','support','entry','overwatch','disruption','medical'];
    
    const PRIMARY = [
      ['MARLIN 9', 'A short carbine that was never meant to be fired indoors and is only ever fired indoors.'],
      ['BOWLINE SMG', 'Quiet, light, and unconvincing past thirty metres.'],
      ['HARROW 12', 'A pump gun kept for doors rather than for people.'],
      ['SEXTANT DMR', 'One shot, a long wait, and a very loud opinion.'],
      ['COTTER PDW', 'Fits under a coat. Empties in under two seconds.'],
      ['GANTRY LMG', 'Nobody has ever moved quickly while holding one.'],
      ['PIKESTAFF AR', 'The issue rifle. Reliable, heavy, unloved.'],
      ['DRAYMAN 45', 'Slow, enormous, and genuinely effective through a wall.']
    ];
    const SIDEARM = [
      ['TALLOW .38', 'Six rounds and a trigger like a garden gate.'],
      ['WREN COMPACT', 'Small enough to forget you have it. Several people have.'],
      ['PLUMB 9', 'Standard issue. Nobody has an opinion about it, which is the point.'],
      ['ORRERY MACHINE PISTOL', 'Empties itself if you look at it.'],
      ['LODESTONE REVOLVER', 'Older than the unit. Cleaner than the unit.']
    ];
    const UTILITY = [
      ['Wall Listener', 'A pad that reads movement through one layer of masonry and nothing through two.'],
      ['Barbed Line', 'Strung across a doorway. Announces anybody who tries it, loudly.'],
      ['Smoke Bloom', 'Fills a corridor in four seconds and clears in forty.'],
      ['Signal Kite', 'A small drone that marks one room and then falls over.'],
      ['Ram Plate', 'Turns one bad door into one good doorway.'],
      ['Cold Charge', 'Freezes a lock rather than blowing it. Silent, slow, unreliable in the wet.'],
      ['Dazzle Pin', 'Everybody in the room loses ten seconds, including you.'],
      ['Sound Decoy', 'Footsteps from somewhere you are not. Works exactly once per opponent.'],
      ['Field Stitch', 'Gets one person back on their feet and nowhere near back to normal.'],
      ['Mirror Wedge', 'Shows you the room without showing the room you.'],
      ['Jam Box', 'Kills every radio in the building. Including yours. Especially yours.'],
      ['Trip Flare', 'Lights the stairwell and everyone standing in it.']
    ];
    const KIT = ['spare battery','two flares','a length of cord','breaching charge','plate carrier, worn thin',
      'night optics, borrowed','a tourniquet in the wrong pocket','no comms discipline whatsoever',
      'thirty metres of rope','one very sharp tool','a map that is out of date','somebody else’s gloves',
      'chalk','a photograph, folded'];
    const HOT = ['no helmet','half a magazine','one working radio','a knee that will not last the night'];
    
    const STATS = ['speed','armour','noise','reach','patience'];
    
    const BRIEFS = [
      'Goes in first, complains about it afterwards, goes in first again the next night.',
      'Has never once taken the stairs when there was a window available.',
      'Talks the entire way in and is completely silent on the way out.',
      'Trained for cold weather. Has been deployed to a car park nine times.',
      'The only one who reads the building plan before arriving, and the only one who is ever surprised.',
      'Was the loudest person in the unit until the incident nobody talks about.',
      'Will not breach a door without knocking. Has never explained why.',
      'Best under pressure, unbearable at every other time.',
      'Fixed the radio, the van, and one other operator, all in the same week.',
      'Carries too much and has never dropped any of it.',
      'Volunteers for the roof. Always the roof.',
      'Has an excellent record and a very short list of people who will work with them.'
    ];
    
    let card = null;
    
    function stat(k, v){
      const hi = v >= 4;
      return '<div class="bar"><span class="k">' + k + '</span><span class="t">' +
        '<i class="' + (hi ? 'hi' : '') + '" style="width:' + (v * 20) + '%"></i></span>' +
        '<span class="d">' + v + '</span></div>';
    }
    
    function issue(keepOperator){
      const call = keepOperator && card ? card.call : pick(CALLS);
      const unit = keepOperator && card ? card.unit : pick(UNITS);
      const role = keepOperator && card ? card.role : pick(ROLES);
    
      const p1 = pick(PRIMARY), p2 = pick(SIDEARM);
      // two different utilities, always
      const pool = UTILITY.slice();
      const u1 = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      const u2 = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
    
      const kit = [];
      const kpool = KIT.slice();
      for (let i = 0; i < ri(3, 4); i++) kit.push(kpool.splice(Math.floor(Math.random() * kpool.length), 1)[0]);
      const hot = Math.random() < .45 ? pick(HOT) : null;
    
      const stats = {};
      STATS.forEach((k) => { stats[k] = ri(1, 5); });
    
      card = { call, unit, role, p1, p2, u1, u2, kit, hot, stats, brief: pick(BRIEFS),
               num: 'LC-' + ri(10, 99) + '-' + ri(100, 999) };
    
      $('call').textContent = call;
      $('role').textContent = role + ' · ' + unit;
      $('num').textContent = card.num;
      $('p1').textContent = p1[0];  $('p1n').textContent = p1[1];
      $('p2').textContent = p2[0];  $('p2n').textContent = p2[1];
      $('u1').textContent = u1[0];  $('u1n').textContent = u1[1];
      $('u2').textContent = u2[0];  $('u2n').textContent = u2[1];
      $('kit').innerHTML = kit.map((k) => '<span class="chip">' + k + '</span>').join('') +
        (hot ? '<span class="chip hot">' + hot + '</span>' : '');
      $('bars').innerHTML = STATS.map((k) => stat(k, stats[k])).join('');
      $('brief').innerHTML = '<b>Note from the section leader.</b> ' + card.brief;
      $('stamp').textContent = 'issued ' + new Date().toISOString().slice(0, 10);
    
      if ($('snd').checked) squelch();
    }
    
    /* ---- the radio ---------------------------------------------------- *
     *  A press-to-talk on a cheap set: a short crack of bandpassed noise as
     *  the carrier opens, two square-wave tones, and the tail of static as
     *  it closes. Made in the browser out of the shared bench.
     * ------------------------------------------------------------------ */
    function squelch(){
      LCAudio.sting((A) => {
        const out = A.gain(0.6);
        out.connect(A.master);
        // carrier opens
        A.burst('white', { to: out, type: 'bandpass', freq: 1900, q: 1.6,
                           attack: .002, dur: .07, level: .16 });
        // the two beeps, square and narrow like a handset speaker
        A.blip(880,  { to: out, type: 'square', at: .08, dur: .07, level: .05,
                       filter: 'bandpass', filterFreq: 1500, q: 1.4, reverb: false });
        A.blip(1320, { to: out, type: 'square', at: .17, dur: .09, level: .05,
                       filter: 'bandpass', filterFreq: 1500, q: 1.4, reverb: false });
        // and closes
        A.burst('white', { to: out, type: 'bandpass', freq: 2400, q: 1.2,
                           at: .30, attack: .003, dur: .12, level: .09 });
        setTimeout(() => { try { out.disconnect(); } catch (e) {} }, 900);
      });
    }
    
    $('go').addEventListener('click', () => issue(false));
    $('reroll').addEventListener('click', () => issue(true));
    __add(document, 'keydown', (e) => {
      if (e.key === ' ' && e.target === document.body){ e.preventDefault(); issue(false); }
    });
    
    issue(false);
    window.__loadout = { issue: issue, get card(){ return card; } };
    
    
    /* This toy builds its noises straight off the shared bench, so the
       cabinet-wide mute already reaches them through lc-audio's gate.
       What was missing was the switch itself: the preference applied
       here and there was no way to set it from here. */
    

    return function () {
      __dead = true;
      __off.forEach(function (r) {
        try { r[0].removeEventListener(r[1], r[2], r[3]); } catch (e) {}
      });
      __timers.forEach(function (id) {
        try { window.clearTimeout(id); window.clearInterval(id); } catch (e) {}
      });
      __off = []; __timers = [];
    };
  }
});
