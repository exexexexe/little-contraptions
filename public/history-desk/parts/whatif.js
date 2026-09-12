/* ------------------------------------------------------------------ *
 *  What If — was /what-if-history/.
 *
 *  Moved across rather than rewritten: the word lists, the assembly and
 *  the room are the originals. The content is the toy, and retyping it
 *  is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCPart("whatif", "What If", "One thing goes differently and the rest follows.", {
  "--shell-bg": "#F2EDE0",
  "--shell-ink": "#2B2519",
  "--shell-body": "\"Iowan Old Style\", \"Palatino Linotype\", \"Book Antiqua\", Palatino, Georgia, \"Times New Roman\", serif",
  "--shell-bar": "rgba(0,0,0,.24)",
  "--shell-rule": "rgba(128,128,128,.34)",
  "--shell-field": "rgba(127,127,127,.14)"
},
`

:root{
  --paper:#F2EDE0;
  --paper-2:#E6DECB;
  --card:#FBF8EF;
  --ink:#2B2519;
  --ink-2:#5C513B;
  --dim:#93866B;
  --rule:#C9BEA3;
  --red:#B4432E;
  --blue:#3A5C7A;
  --serif:"Iowan Old Style","Palatino Linotype","Book Antiqua",Palatino,Georgia,"Times New Roman",serif;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
}
.room{
  background:var(--paper);
  background-image:
    radial-gradient(60% 40% at 12% 0%, rgba(180,67,46,.07), transparent 62%),
    repeating-linear-gradient(0deg, rgba(90,75,45,.03) 0 1px, transparent 1px 5px);
  background-attachment:fixed;
  color:var(--ink);font-family:var(--serif);font-size:16px;
  padding:26px 16px 84px;
  display:flex;flex-direction:column;align-items:center;
}
.wrap{ max-width:740px;width:100% }

header{ text-align:center;border-bottom:3px double var(--rule);padding-bottom:14px }
h1{ margin:0;font-size:clamp(25px,5.6vw,38px);font-weight:400;color:var(--red);letter-spacing:.01em }
.sub{ margin-top:9px;font-family:var(--mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim) }

.pick{ margin-top:18px;background:var(--card);border:1px solid var(--rule);padding:15px 17px }
.pick label{ display:block;font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim);margin-bottom:8px }
select, input[type=text]{
  width:100%;font:inherit;font-size:16px;color:var(--ink);
  background:#FFFDF7;border:1px solid var(--rule);padding:10px 11px;
}
select:focus, input:focus{ outline:2px solid var(--red);outline-offset:1px }
.or{ text-align:center;font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim);margin:11px 0 9px }
.row{ display:flex;gap:9px;flex-wrap:wrap;margin-top:12px;align-items:center }
button{
  font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;
  background:var(--red);color:#FDF7EE;border:1px solid var(--red);
  padding:12px 20px;cursor:pointer;font-weight:700;
}
button:hover{ background:#C9563E }
button.sec{ background:transparent;color:var(--ink-2);border-color:var(--rule);font-weight:400 }
button.sec:hover{ border-color:var(--red);color:var(--red) }
button:focus-visible{ outline:2px solid var(--blue);outline-offset:2px }

/* ---------- the divergence ---------- */
.out{ margin-top:18px }
.real{
  background:var(--card);border:1px solid var(--rule);border-left:5px solid var(--blue);
  padding:15px 18px;
}
.real .k{ font-family:var(--mono);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--blue);font-weight:700 }
.real .t{ font-size:18px;margin-top:6px;line-height:1.45 }
.real .d{ font-family:var(--mono);font-size:11px;color:var(--dim);margin-top:5px }

.fork{
  text-align:center;font-family:var(--mono);font-size:9.5px;letter-spacing:.24em;
  text-transform:uppercase;color:var(--dim);padding:14px 0 12px;position:relative;
}
.fork::before{
  content:'';position:absolute;left:50%;top:0;width:2px;height:12px;background:var(--rule);
}
.fork::after{
  content:'';position:absolute;left:calc(50% - 60px);right:calc(50% - 60px);bottom:0;
  height:2px;background:var(--rule);
}

.alt{
  background:var(--card);border:1px solid var(--rule);border-left:5px solid var(--red);
  padding:18px 20px;
}
.alt .k{ font-family:var(--mono);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--red);font-weight:700;margin-bottom:9px }
.alt p{ margin:0 0 12px;font-size:17.5px;line-height:1.66 }
.alt p:last-child{ margin:0 }
.alt .small{ font-size:15px;color:var(--ink-2);font-style:italic }

.dis{
  margin-top:12px;font-family:var(--mono);font-size:10.5px;line-height:1.8;color:var(--dim);
  border-left:2px solid var(--rule);padding-left:11px;
}

/* egg #9 */
.void{
  margin-top:18px;background:#1A1712;color:#E6DECB;border:2px solid var(--red);padding:22px 24px;
}
.void .k{ font-family:var(--mono);font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--red);margin-bottom:12px }
.void p{ margin:0 0 12px;font-size:17px;line-height:1.68 } .void p:last-child{ margin:0 }
.void b{ color:#E8A24A }

footer{
  max-width:740px;width:100%;margin:24px auto 0;padding-top:14px;border-top:1px solid var(--rule);
  font-family:var(--mono);font-size:10.5px;line-height:1.85;color:var(--dim);
}
footer a{ color:var(--red) }

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

    root.innerHTML = "<div class=\"wrap\">\n  <header>\n    <h1>What If It Had Gone Differently</h1>\n    <div class=\"sub\">real event in &middot; nonsense out</div>\n  </header>\n\n  <div class=\"pick\">\n    <label for=\"ev\">Pick something that really happened</label>\n    <select id=\"ev\"></select>\n    <div class=\"or\">or</div>\n    <label for=\"own\">Type your own \u201cwhat if\u201d</label>\n    <input type=\"text\" id=\"own\" maxlength=\"120\" placeholder=\"what if ...\" autocomplete=\"off\">\n    <div class=\"row\">\n      <button id=\"go\" type=\"button\">Diverge</button>\n      <button id=\"rand\" class=\"sec\" type=\"button\">Surprise me</button>\n    </div>\n  </div>\n\n  <div class=\"out\" id=\"out\"></div>\n</div>";

    
    'use strict';
    const $ = (id) => document.getElementById(id);
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    const esc = (s) => String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    
    /* ------------------------------------------------------------------ *
     *  Real events, with real dates. The fork is invented; the thing being
     *  forked from is not.
     * ------------------------------------------------------------------ */
    const EVENTS = [
      { t:'The Wright brothers fly at Kitty Hawk', d:'17 December 1903', what:'the first powered flight' },
      { t:'Apollo 11 lands on the Moon', d:'20 July 1969', what:'the Moon landing' },
      { t:'The Berlin Wall opens', d:'9 November 1989', what:'the fall of the Wall' },
      { t:'Krakatoa erupts', d:'27 August 1883', what:'the eruption' },
      { t:'The Titanic sinks', d:'15 April 1912', what:'the sinking' },
      { t:'The Rosetta Stone is found', d:'July 1799', what:'the discovery' },
      { t:'Gutenberg prints the Bible', d:'about 1455', what:'movable type reaching Europe' },
      { t:'The Great Fire of London begins', d:'2 September 1666', what:'the fire' },
      { t:'Vesuvius buries Pompeii', d:'AD 79', what:'the eruption' },
      { t:'The transatlantic telegraph cable is completed', d:'27 July 1866', what:'the cable' },
      { t:'Fleming notices the mould on his petri dish', d:'September 1928', what:'penicillin' },
      { t:'The first transatlantic radio signal is received', d:'12 December 1901', what:'the signal' },
      { t:'The Suez Canal opens', d:'17 November 1869', what:'the canal' },
      { t:'The Tunguska event flattens the Siberian forest', d:'30 June 1908', what:'the airburst' },
      { t:'The Chicxulub asteroid strikes', d:'about 66 million years ago', what:'the impact' },
      { t:'Halley’s Comet returns, as predicted', d:'1758', what:'the prediction coming true' },
      { t:'The first message is sent over ARPANET', d:'29 October 1969', what:'the first packet' },
      { t:'The Antikythera mechanism is recovered from a shipwreck', d:'1901', what:'the discovery' },
      { t:'Vasco da Gama reaches India by sea', d:'May 1498', what:'the sea route' },
      { t:'The Domesday Book is completed', d:'1086', what:'the survey' }
    ];
    
    /* the machinery of a bad alternate history */
    const OPENERS = [
      'It does not happen. Nothing much changes for about eleven years, and then everything does.',
      'It happens, but four days later, and to somebody else, which turns out to matter enormously.',
      'It very nearly happens, is called off over a technicality, and is quietly attempted again by a rival.',
      'It happens exactly as it did, except that nobody writes it down, and so it has to happen twice more.',
      'It happens early. Nothing was ready for it, least of all the people it happened to.',
      'It happens, and is immediately classified, which delays absolutely everything by two generations.'
    ];
    const KNOCK = [
      'Within a decade, {THING} is the most important industry in Europe and nobody can explain how.',
      'Shipping insurance becomes, briefly, the most powerful profession on earth.',
      'The calendar is reformed twice more, badly, and three countries never quite agree to it.',
      'An entire branch of mathematics is invented forty years early by someone trying to settle a bet.',
      'The word for “Tuesday” changes in six languages and nobody notices until 1912.',
      '{THING} is banned in four cities, subsidised in two, and made compulsory in one.',
      'A minor clerk in {PLACE} files the paperwork wrongly, and the error survives into international law.',
      'The centre of gravity of the whole business moves to {PLACE} and stays there.',
      'Somebody patents the wrong half of it and becomes very rich for entirely the wrong reasons.',
      'Two rival standards emerge, both terrible, and we are still using the worse one.'
    ];
    // all mass or singular, because the templates say "{THING} is"
    const THINGS = ['the postal service','wool','tinned food','glassmaking','the coffee trade','rope',
      'cartography','clockmaking','the dye trade','shipbuilding','sugar','ice','the telegraph','paper'];
    const PLACES = ['Bruges','Lisbon','Riga','Valparaíso','Gothenburg','Trieste','Bristol','Odessa',
      'Nagasaki','Hull','Genoa','Malmö','Aberdeen'];
    const NOWS = [
      'Today, the whole thing is a footnote and a very good pub quiz question.',
      'By now, the difference is invisible except in the shape of the roads.',
      'A hundred years on, the only surviving trace is a peculiar convention in banking.',
      'Today it is taught as inevitable, which is what we say about everything that happened.',
      'The world ends up in almost exactly the same place, by a route nobody would have chosen.',
      'We would be roughly here, but four years behind and with much better hats.',
      'You would still be reading something like this, on something slightly worse.'
    ];
    const CAVEATS = [
      'Historians would like it noted that none of this follows from anything.',
      'This is a parlour game and is not an argument about causation.',
      'Every sentence after the fork was assembled from a list on this page.',
      'The date above is real. Nothing below it is.',
      'Counterfactuals are entertainment. This one is not even good entertainment.'
    ];
    
    function fill(t){
      return t.replace('{THING}', pick(THINGS)).replace('{PLACE}', pick(PLACES));
    }
    
    /* ---- egg #9 -------------------------------------------------------- *
     *  Ask for the premise that removes the thing you are standing on and
     *  the toy stops being able to answer, in the only honest way available
     *  to it. It has to be triggered by the shape of the question rather
     *  than by one exact string, because there are several ways to ask it.
     * ------------------------------------------------------------------ */
    const NO_INTERNET = /\b(internet|world wide web|the web|computers?|electricity|websites?)\b/i;
    const NEVER = /\b(never|no|without|didn'?t|did not|hadn'?t|had not|wasn'?t|was not)\b/i;
    
    function isSelfErasing(text){
      return NO_INTERNET.test(text) && NEVER.test(text);
    }
    
    function selfErase(text){
    if (window.LCAch) LCAch.fire('whatif.nointernet');
      $('out').innerHTML =
        '<div class="void"><div class="k">the machine declines</div>' +
        '<p>Right. Let us follow that one properly.</p>' +
        '<p>No internet means no browser. No browser means no page. No page means no list of ' +
        'clauses, no fork diagram, and no small red heading saying <b>the machine declines</b>. ' +
        'It means this toy was never written, which means <b>I am not here to tell you about it</b>.</p>' +
        '<p>So the honest output for that premise is a blank screen, and the fact that you are ' +
        'looking at words instead is the strongest available evidence that the premise is false.</p>' +
        '<p class="small" style="color:#B49A78">Ask for something that leaves the electricity on.</p></div>';
    }
    
    function diverge(){
      const own = $('own').value.trim();
    
      if (own && isSelfErasing(own)){ selfErase(own); return; }
    
      const ev = own ? null : EVENTS[Number($('ev').value)];
      const title = own || ev.t;
      const date = own ? 'your premise' : ev.d;
      const what = own ? 'it' : ev.what;
    
      const knocks = [];
      const pool = KNOCK.slice();
      for (let i = 0; i < 3; i++) knocks.push(fill(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]));
    
      $('out').innerHTML =
        '<div class="real"><div class="k">what actually happened</div>' +
        '<div class="t">' + esc(title) + '</div>' +
        '<div class="d">' + esc(date) + '</div></div>' +
        '<div class="fork">the fork</div>' +
        '<div class="alt"><div class="k">and if it had not</div>' +
        '<p>' + esc(pick(OPENERS)) + '</p>' +
        '<p>' + esc(knocks[0]) + ' ' + esc(knocks[1]) + '</p>' +
        '<p>' + esc(knocks[2]) + '</p>' +
        '<p class="small">' + esc(pick(NOWS)) + '</p></div>' +
        '<div class="dis">' + esc(pick(CAVEATS)) + '</div>';
    }
    
    $('ev').innerHTML = EVENTS.map((e, i) =>
      '<option value="' + i + '">' + esc(e.t) + ' — ' + esc(e.d) + '</option>').join('');
    
    $('go').addEventListener('click', diverge);
    $('own').addEventListener('keydown', (e) => { if (e.key === 'Enter') diverge(); });
    $('ev').addEventListener('change', () => { $('own').value = ''; diverge(); });
    $('rand').addEventListener('click', () => {
      $('own').value = '';
      $('ev').value = String(Math.floor(Math.random() * EVENTS.length));
      diverge();
    });
    
    diverge();
    
    window.__whatif = { diverge, isSelfErasing, events: EVENTS };
    

    return function () {
      __dead = true;
      __off.forEach(function (r) { try { r[0].removeEventListener(r[1], r[2], r[3]); } catch (e) {} });
      __timers.forEach(function (id) { try { window.clearTimeout(id); window.clearInterval(id); } catch (e) {} });
      __off = []; __timers = [];
    };
  });
