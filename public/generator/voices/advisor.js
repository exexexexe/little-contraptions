/* ------------------------------------------------------------------ *
 *  Voice: The Advisors.
 *
 *  Was /ancient-advisor/. Moved across rather than rewritten: the word lists, the
 *  assembly and the room are the originals. The prose is the toy, and
 *  retyping it is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCGen.voice({
  id: "advisor",
  name: "The Advisors",
  blurb: "Counsel from people who have been dead a very long time.",
  page: {
      "--gen-bg": "rgb(233, 220, 187)",
      "--gen-ink": "#2E2415",
      "--gen-body": "\"Iowan Old Style\", \"Palatino Linotype\", \"Book Antiqua\", Palatino, Georgia, \"Times New Roman\", serif",
      "--gen-bar": "rgba(0,0,0,.22)",
      "--gen-rule": "rgba(128,128,128,.35)",
      "--gen-field": "rgba(127,127,127,.14)"
  },

  css: `

:root{
  --vellum:#E9DCBB;
  --vellum-2:#DCCB9F;
  --page:#F3E9CE;
  --ink:#2E2415;
  --ink-2:#5A4728;
  --dim:#8A7448;
  --rule:#B9A272;
  --gold:#B8912F;
  --gold-2:#8A6A34;
  --blood:#8E3B2A;
  --serif:"Iowan Old Style","Palatino Linotype","Book Antiqua",Palatino,Georgia,"Times New Roman",serif;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
}
.room{
  background:var(--vellum);
  /* old map: a stained ground, faint graticule, and a compass wash */
  background-image:
    radial-gradient(58% 44% at 14% 8%, rgba(184,145,47,.16), transparent 62%),
    radial-gradient(52% 40% at 88% 78%, rgba(142,59,42,.10), transparent 62%),
    repeating-linear-gradient(0deg, rgba(120,95,50,.055) 0 1px, transparent 1px 46px),
    repeating-linear-gradient(90deg, rgba(120,95,50,.055) 0 1px, transparent 1px 46px),
    linear-gradient(180deg, var(--vellum), var(--vellum-2));
  background-attachment:fixed;
  color:var(--ink);font-family:var(--serif);font-size:16px;
  padding:26px 16px 84px;
  display:flex;flex-direction:column;align-items:center;
}
.wrap{ max-width:760px;width:100% }

header{ text-align:center;border-bottom:3px double var(--rule);padding-bottom:14px }
h1{
  margin:0;font-size:clamp(28px,6.6vw,44px);font-weight:400;letter-spacing:.03em;
  color:var(--gold-2);
}
.sub{
  margin-top:9px;font-family:var(--mono);font-size:10px;letter-spacing:.24em;
  text-transform:uppercase;color:var(--dim);
}

/* ---------- the realm ---------- */
.realm{
  background:var(--page);border:1px solid var(--rule);
  box-shadow:0 2px 0 rgba(255,255,255,.5) inset, 0 12px 30px rgba(90,70,35,.14);
  padding:20px 22px;margin-top:20px;position:relative;
}
.realm::after{
  content:'';position:absolute;inset:5px;border:1px solid rgba(185,162,114,.5);pointer-events:none;
}
.realm h2{ margin:0;font-size:clamp(22px,4.8vw,31px);font-weight:400;color:var(--ink);line-height:1.2 }
.realm .of{ font-family:var(--mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim);margin-top:7px }
.facts{ display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-top:16px }
.fact .k{ font-family:var(--mono);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim) }
.fact .v{ font-size:17px;margin-top:3px;color:var(--ink-2) }
.motto{
  margin-top:16px;padding-top:13px;border-top:1px solid var(--rule);
  font-style:italic;font-size:17.5px;line-height:1.55;color:var(--gold-2);
}

/* ---------- the advisors ---------- */
.advisors{ margin-top:18px;display:grid;gap:11px }
.adv{
  background:var(--page);border-left:5px solid var(--gold);
  border-top:1px solid var(--rule);border-right:1px solid var(--rule);border-bottom:1px solid var(--rule);
  padding:14px 17px;
}
.adv .who{
  font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;
  color:var(--gold-2);font-weight:700;
}
.adv .name{ font-size:14px;color:var(--dim);margin-top:2px }
.adv .said{ font-size:17.5px;line-height:1.6;margin-top:9px;font-style:italic }
.adv.war{ border-left-color:var(--blood) } .adv.war .who{ color:var(--blood) }
.adv.faith{ border-left-color:#5A6E3A } .adv.faith .who{ color:#4A5C2E }
.adv.gold{ border-left-color:#B8912F }
.adv.science{ border-left-color:#3A5A7A } .adv.science .who{ color:#2E4A66 }
.adv.people{ border-left-color:#7A4A6E } .adv.people .who{ color:#633A59 }

/* ---------- the dial ---------- */
.dial{
  margin-top:20px;background:var(--page);border:1px solid var(--rule);padding:15px 18px;
}
.dial label{ font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim);display:block }
.dial .row{ display:flex;gap:12px;align-items:center;margin-top:9px;flex-wrap:wrap }
.dial input[type=range]{ flex:1;min-width:180px;accent-color:var(--gold-2) }
.dial .years{ font-size:19px;color:var(--gold-2);min-width:9ch;font-variant-numeric:tabular-nums }
.dial .era{ font-family:var(--mono);font-size:10.5px;color:var(--dim);letter-spacing:.1em }

/* the too-long message */
.toolong{
  margin-top:14px;background:#2A2416;color:#E9DCBB;border:2px solid var(--gold);
  padding:17px 19px;font-family:var(--mono);font-size:12.5px;line-height:1.85;
}
.toolong b{ display:block;color:var(--gold);letter-spacing:.2em;text-transform:uppercase;font-size:10px;margin-bottom:8px }
.toolong[hidden]{ display:none }

/* ---------- controls ---------- */
.deck{ display:flex;gap:9px;flex-wrap:wrap;margin-top:16px;align-items:center }
button{
  font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;
  background:var(--gold-2);color:#F7EFD9;border:1px solid var(--gold);
  padding:12px 20px;cursor:pointer;font-weight:700;
}
button:hover{ background:#A07F3E }
button.sec{ background:transparent;color:var(--ink-2);border-color:var(--rule);font-weight:400 }
button.sec:hover{ border-color:var(--gold-2);color:var(--gold-2) }
button:focus-visible{ outline:2px solid var(--ink);outline-offset:2px }
.sound{
  margin-left:auto;display:flex;align-items:center;gap:7px;
  font-family:var(--mono);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);
}
.sound input{ width:15px;height:15px;accent-color:var(--gold-2) }

footer{
  max-width:760px;width:100%;margin:24px auto 0;padding-top:14px;border-top:1px solid var(--rule);
  font-family:var(--mono);font-size:10.5px;line-height:1.85;color:var(--dim);
}
footer a{ color:var(--gold-2) }

/* ---------- shared: back to the cabinet ---------- */
/* --- touch targets (sweep) --- */
@media (pointer:coarse){
  #go, #snd, #years, .sec{ min-height:44px }
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

    root.innerHTML = "<div class=\"wrap\">\n  <header>\n    <h1>The Advisors</h1>\n    <div class=\"sub\">a realm that never existed &middot; and the five people shouting at you about it</div>\n  </header>\n\n  <div class=\"realm\">\n    <h2 id=\"realm\">\u2014</h2>\n    <div class=\"of\" id=\"of\"></div>\n    <div class=\"facts\" id=\"facts\"></div>\n    <div class=\"motto\" id=\"motto\"></div>\n  </div>\n\n  <div class=\"advisors\" id=\"advisors\"></div>\n\n  <div class=\"dial\">\n    <label for=\"years\">How long this realm has stood</label>\n    <div class=\"row\">\n      <input type=\"range\" id=\"years\" min=\"1\" max=\"1000\" value=\"220\" step=\"1\" aria-describedby=\"era\">\n      <span class=\"years\" id=\"yearsOut\">220</span>\n      <span class=\"era\" id=\"era\"></span>\n    </div>\n  </div>\n\n  <div class=\"toolong\" id=\"toolong\" hidden></div>\n\n  <div class=\"deck\">\n    <button id=\"go\" type=\"button\">Found a new realm</button>\n    <button id=\"again\" class=\"sec\" type=\"button\">Same realm, new counsel</button>\n    <label class=\"sound\"><input type=\"checkbox\" id=\"snd\" checked> horns</label>\n  </div>\n</div>";

    
    'use strict';
    const $ = (id) => document.getElementById(id);
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    
    /* ------------------------------------------------------------------ *
     *  An invented world, assembled from parts. Nothing below names a real
     *  people, place, faith or person.
     * ------------------------------------------------------------------ */
    const REALM_A = ['Ash','Bright','Cold','Deep','Ever','Far','Grey','High','Iron','Long','Mourn',
      'Nine','Old','Pale','Quiet','Red','Salt','Thorn','Under','Wind'];
    const REALM_B = ['march','holt','fell','reach','water','harrow','spire','moor','gate','vale',
      'stead','crest','wold','strand','burh','deep'];
    const PEOPLES = ['the Kethuri','the Sarn','the Vellish','the Odarim','the Braith','the Nimmeri',
      'the Talsmen','the Orrow','the Hessek','the Fen Lords','the Ninefold Houses','the Ashari'];
    const RULERS = ['Vantek','Oreleth','Sarn Dua','Bellamar','Ithric','Nessa the Elder','Corvan',
      'Ashaya','Mordu','Selith','Harrow Vane','Isk the Younger','Tamber','Olune'];
    const TITLES = ['First Speaker','Lord of the Nine Gates','Keeper of the Salt Road','Diarch',
      'the Undisputed','Warden of the Deep Fen','Voice of the Assembly','the Reluctant','High Steward'];
    const CAPITALS = ['Vess','Karrow','Ombrit','Thal','Nine Bridges','Sallowmoor','Iron Landing',
      'Duskwell','Harrowgate','Aldenmere','The Kilns','Saltpoint'];
    const TERRAIN = ['a river delta that floods twice a year','high cold plateau',
      'a chain of harbours and nothing behind them','forest so old it has its own weather',
      'salt flats and three deep wells','a valley with one road in','marshland the maps get wrong',
      'terraced hills above a warm sea'];
    const RESOURCES = ['tin, and opinions about tin','horses','a dye nobody else can make',
      'more grain than they can move','deep coal','shipbuilding timber','salt','a rare blue stone',
      'the only good pass through the mountains'];
    const FAITHS = ['the Quiet Observance','the Nine Names','the Rite of Standing Water',
      'the Ashfather cult, tolerated','the Old Reckoning','no faith worth the word, officially'];
    const MOTTOS = [
      '“We were here before the river, and we will be here after it.”',
      '“Build in stone. Argue in stone. Apologise in stone.”',
      '“Nothing is owed, and everything is remembered.”',
      '“A wall is a promise you can walk along.”',
      '“Let them come. Let them see the granary.”',
      '“We do not conquer. We arrive, and we do not leave.”',
      '“The harvest first. The gods can wait; they have.”',
      '“Better a long road than a short peace.”',
      '“Every treaty is a truce with better handwriting.”',
      '“Count the years. Then count the graves. Then decide.”'
    ];
    
    /* five advisors, each with a fixed obsession and a different failure mode */
    const ADVISORS = [
      { cls:'war', who:'Your military advisor', names:['General Ossuk','Marshal Brend','the Iron Warden','Captain Hale'],
        lines:[
          'Every year we do not build a wall is a year somebody else measures it.',
          'They have more horses. That is the entire briefing. May I go.',
          'I am not asking for a war. I am asking to be ready for the one they are planning.',
          'Peace is what we call the part where both sides are still counting.',
          'Give me the north road and I will give you eleven quiet years.',
          'They will come in spring. They always come in spring. It is not clever of them.',
          'The granary is not a defence. I have said this at every session.'
        ]},
      { cls:'gold', who:'Your treasurer', names:['Merchant-Clerk Ilna','the Keeper of Tallies','Vestor of the Counting House','Deda Marn'],
        lines:[
          'We can afford exactly one of the three things being shouted about in this room.',
          'The road pays for itself in nine years. You have been ruling for four.',
          'Taxes are low and the mood is excellent. These two facts are related.',
          'I have found the money. You will not like where it was.',
          'Every temple is a building we maintain for ever and rent to nobody.',
          'The treasury is full. That is not the same as the realm being rich.',
          'Let them trade with us and they will never need to invade us. It is cheaper for everyone.'
        ]},
      { cls:'faith', who:'Your high celebrant', names:['the Speaker of Standing Water','Elder Faun','Nine-Named Ovess','the Quiet Sister'],
        lines:[
          'The people do not need another festival. The people need last year’s festival explained.',
          'Build the temple. Not for me. For the winter, when there is nothing else to walk to.',
          'A realm with no ceremony is a realm where the calendar is just weather.',
          'They are praying in the old way again. I would rather they prayed in the old way than not at all.',
          'You may do the practical thing. Do it quietly and on a Tuesday.',
          'Faith is the only tax nobody has ever rioted about.',
          'I am told there is a prophecy. I am told this most years.'
        ]},
      { cls:'science', who:'Your keeper of works', names:['Archivist Sull','the Master of Kilns','Nara of the Long Table','Engineer Pol'],
        lines:[
          'Give me twelve years and a quarry and I will change what this realm is for.',
          'Somebody in Vess has worked out how to move water uphill. We should probably know how.',
          'The library is not a luxury. The library is the reason we stopped repeating ourselves.',
          'I can build the bridge or the fleet. Not both, and not by anybody’s wedding.',
          'Everything we know was written down by three people, and two of them are dead.',
          'The mill will feed more mouths than the war will ever take. That is the whole argument.',
          'We have the iron. What we lack is anybody who can read the instructions.'
        ]},
      { cls:'people', who:'Your voice of the assembly', names:['Speaker Weft','the Steward of Wards','Old Kem','the Delegate from the Kilns'],
        lines:[
          'They are not unhappy with you. They are unhappy, and you are in the room.',
          'Three villages have stopped sending their tally. That is how it starts.',
          'The people would like one year in which nothing historic happens to them.',
          'They will forgive a hard winter. They will not forgive being surprised by one.',
          'Everybody I speak to has a different grievance and the same face while saying it.',
          'You could ask them. I appreciate this is an unusual suggestion.',
          'Whatever you decide, decide it before the harvest and not during.'
        ]}
    ];
    
    const ERAS = [
      [0, 60, 'a young thing, still arguing about its own name'],
      [61, 150, 'long enough to have founding myths and people who dispute them'],
      [151, 320, 'old enough that the walls are being rebuilt rather than built'],
      [321, 600, 'ancient by the standards of its neighbours, several of whom it outlived'],
      [601, 900, 'older than the records that describe it'],
      [901, 1e9, 'past the point where anybody is counting honestly']
    ];
    
    let realm = null;
    
    function eraFor(y){
      for (const [lo, hi, txt] of ERAS) if (y >= lo && y <= hi) return txt;
      return ERAS[ERAS.length - 1][2];
    }
    
    function counsel(){
      $('advisors').innerHTML = ADVISORS.map((a) =>
        '<div class="adv ' + a.cls + '">' +
          '<div class="who">' + a.who + '</div>' +
          '<div class="name">' + pick(a.names) + '</div>' +
          '<div class="said">“' + pick(a.lines) + '”</div>' +
        '</div>').join('');
    }
    
    function found(keep){
      if (!keep || !realm){
        realm = {
          name: pick(REALM_A) + pick(REALM_B),
          people: pick(PEOPLES),
          ruler: pick(RULERS),
          title: pick(TITLES),
          capital: pick(CAPITALS),
          terrain: pick(TERRAIN),
          resource: pick(RESOURCES),
          faith: pick(FAITHS),
          motto: pick(MOTTOS)
        };
        $('realm').textContent = 'The Realm of ' + realm.name;
        $('of').textContent = realm.people + ' · ruled from ' + realm.capital;
        $('facts').innerHTML =
          fact('Ruler', realm.ruler + ', ' + realm.title) +
          fact('Land', realm.terrain) +
          fact('They have', realm.resource) +
          fact('They keep', realm.faith);
        $('motto').textContent = realm.motto;
      }
      counsel();
      if ($('snd').checked) fanfare();
    }
    
    function fact(k, v){
      return '<div class="fact"><div class="k">' + k + '</div><div class="v">' + v + '</div></div>';
    }
    
    /* ---- the horns ---------------------------------------------------- *
     *  A short court fanfare: a fifth, then the octave, on sawtooths rolled
     *  off with a lowpass so they read as brass rather than as a synth.
     * ------------------------------------------------------------------ */
    function fanfare(){
      LCAudio.sting((A) => {
        const root = A.note(-9);                 // middle C
        const opts = { type:'sawtooth', filter:'lowpass', filterFreq:1500, level:.05, reverb:true };
        A.blip(root,        Object.assign({}, opts, { at:0,   dur:.26 }));
        A.blip(root * 1.5,  Object.assign({}, opts, { at:.16, dur:.26 }));
        A.chord([root, root * 1.5, root * 2], Object.assign({}, opts, { at:.34, dur:.85, level:.06 }));
      });
    }
    
    /* ---- egg #13: the dial, pushed too far ---------------------------- *
     *  Drag the "how long this realm has stood" slider up to a number that
     *  is no longer a number of years anybody could rule for, and the game
     *  says the thing that game says at the end of a very long session. It
     *  does not stop you. Nothing stops you. That is the joke.
     * ------------------------------------------------------------------ */
    const TOO_LONG = 900;
    function years(){
      const y = Number($('years').value);
      $('yearsOut').textContent = y.toLocaleString();
      $('era').textContent = eraFor(y);
    
      const el = $('toolong');
      if (y >= TOO_LONG){
        if (window.LCAch) LCAch.fire('advisor.900');
        el.hidden = false;
        el.innerHTML = '<b>a word from the archivists</b>' +
          'The Realm of ' + (realm ? realm.name : 'nowhere') + ' has now stood for ' +
          y.toLocaleString() + ' years. Every founder, every rival, every advisor in this room and ' +
          'every grandchild of every advisor in this room has died of old age, twice over.<br><br>' +
          '<i>You have played too long. Go outside. The realm will still be here, which is rather the problem.</i>';
      } else {
        el.hidden = true;
      }
    }
    
    $('years').addEventListener('input', years);
    $('go').addEventListener('click', () => found(false));
    $('again').addEventListener('click', () => found(true));
    
    found(false);
    years();
    
    window.__realm = { found: found, get realm(){ return realm; },
                       setYears: (y) => { $('years').value = y; years(); },
                       tooLongVisible: () => !$('toolong').hidden };
    
    
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
