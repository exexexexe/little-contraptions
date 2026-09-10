/* ------------------------------------------------------------------ *
 *  Voice: The Ship's Log.
 *
 *  Was /ships-log/. Moved across rather than rewritten: the word lists, the
 *  assembly and the room are the originals. The prose is the toy, and
 *  retyping it is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCGen.voice({
  id: "shipslog",
  name: "The Ship's Log",
  blurb: "A day at sea, recorded by somebody who is not enjoying it.",
  page: {
      "--gen-bg": "rgb(228, 213, 183)",
      "--gen-ink": "#2B2114",
      "--gen-body": "\"Iowan Old Style\", \"Palatino Linotype\", \"Book Antiqua\", Palatino, Georgia, \"Times New Roman\", serif",
      "--gen-bar": "rgba(0,0,0,.22)",
      "--gen-rule": "rgba(128,128,128,.35)",
      "--gen-field": "rgba(127,127,127,.14)"
  },

  css: `

:root{
  --paper:#E4D5B7;
  --paper-2:#D6C39F;
  --page:#F1E6CC;
  --ink:#2B2114;
  --ink-2:#5A4728;
  --dim:#8A7550;
  --rule:#B9A177;
  --brass:#B08A3C;
  --brass-2:#7E6024;
  --rope:#9C7C4A;
  --sea:#2E4A52;
  --serif:"Iowan Old Style","Palatino Linotype","Book Antiqua",Palatino,Georgia,"Times New Roman",serif;
  --hand:"Bradley Hand","Segoe Script","Brush Script MT",var(--serif);
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
}
.room{
  background:var(--paper);
  background-image:
    radial-gradient(60% 40% at 12% 0%, rgba(176,138,60,.14), transparent 62%),
    radial-gradient(55% 40% at 92% 88%, rgba(46,74,82,.12), transparent 62%),
    repeating-linear-gradient(0deg, rgba(90,71,40,.035) 0 1px, transparent 1px 4px),
    linear-gradient(180deg, var(--paper), var(--paper-2));
  background-attachment:fixed;
  color:var(--ink);font-family:var(--serif);font-size:16px;
  padding:24px 16px 84px;
  display:flex;flex-direction:column;align-items:center;
}
.wrap{ max-width:740px;width:100% }

/* the rope rule under the title */
header{ text-align:center }
h1{ margin:0;font-size:clamp(27px,6.4vw,42px);font-weight:400;color:var(--brass-2);letter-spacing:.02em }
.sub{ margin-top:8px;font-family:var(--mono);font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--dim) }
.rope{
  height:9px;margin:14px 0 0;
  background:
    repeating-linear-gradient(58deg, var(--rope) 0 5px, #B99A64 5px 10px, #7E6136 10px 15px);
  border-top:1px solid rgba(0,0,0,.18);border-bottom:1px solid rgba(0,0,0,.22);
  border-radius:5px;
}

/* ---------- the desk ---------- */
.desk{
  background:var(--page);border:1px solid var(--rule);margin-top:18px;
  box-shadow:0 12px 30px rgba(70,55,25,.16), 0 1px 0 rgba(255,255,255,.6) inset;
  padding:18px 20px;
}
.desk h2{
  margin:0 0 13px;font-family:var(--mono);font-size:10px;letter-spacing:.2em;
  text-transform:uppercase;color:var(--brass-2);font-weight:700;
}
.fields{ display:grid;grid-template-columns:repeat(auto-fit,minmax(158px,1fr));gap:11px }
label span{ display:block;font-family:var(--mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);margin-bottom:4px }
input, select{
  width:100%;font:inherit;font-size:15px;color:var(--ink);
  background:#FBF4E3;border:1px solid var(--rule);border-radius:2px;padding:9px 10px;
}
input:focus, select:focus{ outline:2px solid var(--brass);outline-offset:1px }

.deck{ display:flex;gap:9px;flex-wrap:wrap;margin-top:14px;align-items:center }
button{
  font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;
  background:var(--brass-2);color:#F7EEDA;border:1px solid var(--brass);
  padding:12px 20px;cursor:pointer;font-weight:700;
}
button:hover{ background:#96742D }
button.sec{ background:transparent;color:var(--ink-2);border-color:var(--rule);font-weight:400 }
button.sec:hover{ border-color:var(--brass-2);color:var(--brass-2) }
button:focus-visible{ outline:2px solid var(--ink);outline-offset:2px }
.sound{
  margin-left:auto;display:flex;align-items:center;gap:7px;
  font-family:var(--mono);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);
}
.sound input{ width:15px;height:15px;accent-color:var(--brass-2) }

/* ---------- an entry ---------- */
.entry{
  background:var(--page);border:1px solid var(--rule);border-left:6px solid var(--brass);
  margin-top:12px;padding:17px 20px;position:relative;
  box-shadow:0 6px 18px rgba(70,55,25,.1);
}
.entry .head{
  display:flex;gap:14px;flex-wrap:wrap;align-items:baseline;
  font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);
  border-bottom:1px solid var(--rule);padding-bottom:9px;margin-bottom:12px;
}
.entry .head b{ color:var(--brass-2);letter-spacing:.2em }
.entry .head .pos{ margin-left:auto;font-variant-numeric:tabular-nums }
.entry .body{ font-size:17px;line-height:1.72 }
.entry .body p{ margin:0 0 11px }
.entry .body p:last-child{ margin-bottom:0 }
.entry .sign{
  margin-top:14px;text-align:right;font-family:var(--hand);font-size:21px;color:var(--sea);
  transform:rotate(-1.2deg);
}

/* egg #12 — the memorial note. Deliberately not styled like everything
   else on the page: no brass, no rope, no flourish. */
.memorial{
  margin-top:12px;background:#F4F1EA;border:1px solid #B9B4A8;border-left:6px solid #6E7A80;
  padding:17px 20px;
}
.memorial .k{
  font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;
  color:#5C666B;margin-bottom:8px;
}
.memorial p{ margin:0;font-size:15.5px;line-height:1.75;color:#37403F }
.memorial[hidden]{ display:none }

footer{
  max-width:740px;width:100%;margin:24px auto 0;padding-top:14px;border-top:1px solid var(--rule);
  font-family:var(--mono);font-size:10.5px;line-height:1.85;color:var(--dim);
}
footer a{ color:var(--brass-2) }

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

    root.innerHTML = "<div class=\"wrap\">\n  <header>\n    <h1>The Ship&rsquo;s Log</h1>\n    <div class=\"sub\">weather &middot; morale &middot; whatever that was off the starboard bow</div>\n    <div class=\"rope\" aria-hidden=\"true\"></div>\n  </header>\n\n  <div class=\"desk\">\n    <h2>Make an entry</h2>\n    <div class=\"fields\">\n      <label><span>Vessel</span><input id=\"ship\" maxlength=\"34\" placeholder=\"leave blank and one is chosen\"></label>\n      <label><span>Master</span><input id=\"master\" maxlength=\"28\" placeholder=\"likewise\"></label>\n      <label><span>Date of entry</span><input id=\"date\" type=\"date\"></label>\n      <label><span>Weather</span>\n        <select id=\"wx\">\n          <option value=\"\">as it comes</option>\n          <option value=\"fair\">fair</option>\n          <option value=\"fog\">fog</option>\n          <option value=\"gale\">gale</option>\n          <option value=\"ice\">ice</option>\n          <option value=\"calm\">flat calm</option>\n        </select>\n      </label>\n    </div>\n    <div class=\"deck\">\n      <button id=\"go\" type=\"button\">Write the entry</button>\n      <button id=\"clear\" class=\"sec\" type=\"button\">Clear the book</button>\n      <label class=\"sound\"><input type=\"checkbox\" id=\"snd\" checked> foghorn</label>\n    </div>\n  </div>\n\n  <div id=\"log\"></div>\n</div>";

    
    'use strict';
    const $ = (id) => document.getElementById(id);
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    const esc = (s) => String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    
    /* ------------------------------------------------------------------ *
     *  Invented ships, invented voyages.
     * ------------------------------------------------------------------ */
    const SHIP_A = ['Marigold','Kestrel','Long Patience','Ninth Sister','Corvid','Saltwife','Bellwether',
      'Grey Errand','Osprey','Cold Comfort','Thistledown','Gannet','Merry Debt','Wandering Clerk',
      'Prudence','Handsome Loss','Petrel','Old Argument'];
    const RIG = ['brig','barque','schooner','cutter','ketch','snow','lugger','trawler'];
    const MASTERS = ['Halloway','Ormond','Beattie','Ferreira','Nkemelu','Vasa','Lindqvist','Rahmani',
      'Duquesne','Okoro','Marsh','Trelawney','Bergström','Ivanković'];
    const RANKS = ['Master','Captain','Acting Master','Master and Owner'];
    
    const SEAS = ['the Western Approaches','a coast we have not named','the shipping lane, notionally',
      'open water','the shoal ground','the strait','the northern reach','the bank'];
    
    const WX = {
      fair: ['Wind steady from the south-west. Sun on the water and everybody behaving suspiciously well.',
             'A clean day. Blue above, blue below, and nothing at all to write down.',
             'Fair, warm, and the sort of weather that makes the crew ambitious.'],
      fog:  ['Fog since before first light. We are sounding every four minutes and hearing only ourselves.',
             'Thick fog. Visibility perhaps a cable. Two lookouts forward and neither of them blinking.',
             'The fog came down between one watch and the next and has not lifted since.'],
      gale: ['Blowing hard from the north. Two reefs in and considering a third.',
             'A full gale. Green water over the bow twice in the forenoon watch.',
             'The glass has been falling since midnight and it is not finished.'],
      ice:  ['Cold enough that the rigging is white. Ice reported to the north and we are giving it room.',
             'Growlers sighted at intervals. Speed reduced and every lamp lit.',
             'A hard frost and a flat sea, which is a combination I do not care for.'],
      calm: ['Flat calm. Not a breath since dawn. The sea looks like a floor.',
             'Becalmed. The crew have run out of jobs and started inventing them.',
             'No wind at all. We have moved eleven miles today and nine of those were the current.']
    };
    const WXKEYS = Object.keys(WX);
    
    const MORALE = [
      'Morale good. The cook has done something remarkable with very little.',
      'Morale fair. There is an argument about the rota that has now outlasted two ports.',
      'Morale poor and I do not entirely blame them.',
      'Morale improved considerably when the wind did.',
      'Crew quiet. Not unhappy — quiet, which is different and I am watching it.',
      'One man has taught the others a card game and I may have to ban it.',
      'Everybody is being extremely polite, which on a small ship is a warning sign.',
      'Morale excellent. Nobody can say why. I am not going to interrogate it.'
    ];
    const ODD = [
      'Something followed us for an hour on the starboard beam, at exactly our speed, and then did not.',
      'Lights on the water to the north where the chart says there is nothing but water.',
      'The dog will not go forward of the mast and has not since Tuesday.',
      'A bird landed on the rail that none of us can name, sat for two hours, and left inland — inland, from here.',
      'Heard bells at three in the morning. We carry one bell and it was not rung.',
      'The compass wandered four points and came back. It has not done it since.',
      'Found the forehatch open and properly latched from the inside, which is not a thing a hatch can be.',
      'A smell of cut grass, two hundred miles out, for about a minute.',
      'The sea went briefly and completely silent. Even the hull. Nobody has mentioned it since.',
      'Passed a boat, upturned, painted a colour I have not seen on a boat.',
      'The lookout swears he saw the same wave twice. He is a sensible man and he will not repeat it.',
      'Nothing at all happened today, which after this week I am recording as remarkable.'
    ];
    const ROUTINE = [
      'Hands employed setting up rigging and picking oakum.',
      'Pumps sounded: eleven inches, which is a good deal better than yesterday.',
      'Took an observation at noon. Position below, and I stand by it.',
      'Water rationed as a precaution rather than a necessity.',
      'Repaired the forestay. Repaired the repair.',
      'Two hands sick, neither seriously. Cook confined to his own opinion.'
    ];
    
    /* ---- egg #12 -------------------------------------------------------
     *  Real maritime disasters have real dead, and one of them is the most
     *  famous date at sea there is. If somebody dates an entry to it, the
     *  page steps out of the joke entirely and says so plainly — no flourish,
     *  no invented detail, no styling from the rest of the toy. It is a
     *  footnote, briefly, and then the log carries on.
     *
     *  Facts here are the uncontroversial ones and are stated flatly: struck
     *  an iceberg late on 14 April 1912, foundered in the early hours of the
     *  15th, and around 1,500 of the roughly 2,200 aboard died.
     * ------------------------------------------------------------------ */
    const SOLEMN = {
      '04-15': {
        what: 'On this date in 1912, in the early hours of the morning, the Titanic foundered in the ' +
              'North Atlantic after striking ice the previous night. Around 1,500 of the roughly 2,200 ' +
              'people aboard died.',
        note: 'The log above is a game. That was not. There is no joke on this page about the 15th of April, ' +
              'and there is not going to be one.'
      }
    };
    
    function solemnFor(dateStr){
      if (!dateStr || dateStr.length < 10) return null;
      var s = SOLEMN[dateStr.slice(5)] || null;
      if (s && window.LCAch) LCAch.fire('shipslog.april');
      return s;
    }
    
    /* ---- writing one --------------------------------------------------- */
    
    function position(){
      const lat = ri(28, 62) + ri(0, 59) / 60;
      const lon = ri(4, 48) + ri(0, 59) / 60;
      const ns = Math.random() < .8 ? 'N' : 'S';
      const ew = Math.random() < .7 ? 'W' : 'E';
      return lat.toFixed(2) + '° ' + ns + '  ' + lon.toFixed(2) + '° ' + ew;
    }
    
    function longDate(s){
      if (!s) return '';
      const d = new Date(s + 'T12:00:00Z');
      if (isNaN(d)) return s;
      return d.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric', timeZone:'UTC' });
    }
    
    let count = 0;
    
    function write(){
      const shipName = ($('ship').value || '').trim() ||
        'the ' + pick(RIG) + ' ' + pick(SHIP_A);
      const master = ($('master').value || '').trim() ||
        (pick(RANKS) + ' ' + pick(MASTERS));
      const dateStr = $('date').value || new Date().toISOString().slice(0, 10);
      const wxKey = $('wx').value || pick(WXKEYS);
    
      const solemn = solemnFor(dateStr);
    
      /* On a solemn date the invented entry is kept deliberately plain: no
         ice, no gale, and no strange-sighting line. An imaginary log about
         something following the ship, printed directly under a note about
         1,500 real dead, would be exactly the joke this page has just said
         it is not going to make. */
      const body = solemn
        ? [ pick(WX[wxKey === 'ice' || wxKey === 'gale' || wxKey === 'fog' ? 'fair' : wxKey]),
            pick(ROUTINE),
            pick(MORALE) ]
        : [ pick(WX[wxKey]),
            pick(ROUTINE),
            pick(MORALE),
            pick(ODD) ];
    
      count++;
      const entry = document.createElement('div');
      entry.className = 'entry';
      entry.innerHTML =
        '<div class="head"><b>' + esc(shipName) + '</b>' +
          '<span>' + esc(longDate(dateStr)) + '</span>' +
          '<span>' + esc(pick(SEAS)) + '</span>' +
          '<span class="pos">' + position() + '</span></div>' +
        '<div class="body">' + body.map((p) => '<p>' + esc(p) + '</p>').join('') + '</div>' +
        '<div class="sign">' + esc(master) + '</div>';
    
      const log = $('log');
      log.insertBefore(entry, log.firstChild);
    
      // the memorial note sits ABOVE the invented entry, so it is read first
      if (solemn){
        const m = document.createElement('div');
        m.className = 'memorial';
        m.innerHTML = '<div class="k">a note before that entry</div>' +
          '<p>' + esc(solemn.what) + '</p><p style="margin-top:10px">' + esc(solemn.note) + '</p>';
        log.insertBefore(m, log.firstChild);
      }
    
      if ($('snd').checked) foghorn(!!solemn);
      while (log.children.length > 24) log.removeChild(log.lastChild);
    }
    
    /* ---- the horn and the timbers -------------------------------------- *
     *  The horn is two low sawtooths a whole tone apart through a lowpass,
     *  which is what gives a real one its beat. The timbers are a slow
     *  brown-noise creak. On the 15th of April neither of them plays.
     * ------------------------------------------------------------------ */
    function foghorn(silent){
      if (silent) return;
      LCAudio.sting((A) => {
        const o = { type:'sawtooth', filter:'lowpass', filterFreq:280, level:.08, reverb:true };
        A.blip(72, Object.assign({}, o, { dur:1.5, attack:.18 }));
        A.blip(80, Object.assign({}, o, { dur:1.5, attack:.2, level:.055 }));
        // the working of the hull under it
        A.burst('brown', { type:'lowpass', freq:220, attack:.35, dur:1.3, level:.09, reverb:true });
      });
    }
    
    $('go').addEventListener('click', write);
    $('clear').addEventListener('click', () => { $('log').innerHTML = ''; count = 0; });
    $('date').value = new Date().toISOString().slice(0, 10);
    write();
    
    window.__log = { write: write, solemnFor: solemnFor,
                     setDate: (d) => { $('date').value = d; },
                     memorials: () => document.querySelectorAll('.memorial').length };
    
    
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
