/* ------------------------------------------------------------------ *
 *  Voice: The Department of Redundancy Department.
 *
 *  Was /redundancy-dept/. Moved across rather than rewritten: the word lists, the
 *  assembly and the room are the originals. The prose is the toy, and
 *  retyping it is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCGen.voice({
  id: "memo",
  name: "The Department of Redundancy Department",
  blurb: "Issued in triplicate, as is the custom of this department.",
  page: {
      "--gen-bg": "rgb(42, 37, 28)",
      "--gen-ink": "#2A251C",
      "--gen-body": "\"Courier New\", Courier, ui-monospace, \"SF Mono\", Menlo, Consolas, monospace",
      "--gen-bar": "rgba(0,0,0,.22)",
      "--gen-rule": "rgba(128,128,128,.35)",
      "--gen-field": "rgba(127,127,127,.14)"
  },

  css: `

:root{
  --paper:#F7F2E4;
  --paper-2:#EDE6D2;
  --copy2:#E4EDE6;      /* the second copy, on green */
  --copy3:#F2E2E4;      /* and the third, on pink, for the file */
  --ink:#2A251C;
  --ink-2:#5E5647;
  --rule:#C5B99C;
  --red:#A63A2C;
  --stamp:#3A5A78;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --type:"Courier New",Courier,var(--mono);
  --serif:"Iowan Old Style","Palatino Linotype","Book Antiqua",Palatino,Georgia,serif;
}
.room{
  background:#2A251C;color:var(--ink);font-family:var(--type);
  padding:26px 14px 80px;display:flex;flex-direction:column;align-items:center;
}
.wrap{ max-width:660px;width:100% }

.memo-stack{ position:relative;padding-bottom:14px }
/* Two carbon copies, offset behind the top sheet — the green one for the
   file and the pink one for the department that requested it, which is
   this department. You can see their edges and that is the joke. */
.memo-stack::before, .memo-stack::after{
  content:"";position:absolute;left:0;right:0;top:0;bottom:0;border-top:6px double var(--ink);
  box-shadow:0 10px 26px rgba(0,0,0,.4);
}
.memo-stack::before{ background:var(--copy3);transform:rotate(.75deg) translate(7px,7px);z-index:0 }
.memo-stack::after{ background:var(--copy2);transform:rotate(-.45deg) translate(3px,3px);z-index:1 }
.memo{
  background:var(--paper);padding:32px 30px 34px;position:relative;z-index:2;
  box-shadow:0 18px 46px rgba(0,0,0,.5);
  border-top:6px double var(--ink);
}
/* the stamp lands on the top copy and the whole stack takes it */
.memo-stack.stamped{ animation:thunk .3s ease }
@keyframes thunk{
  0%,100%{ transform:none }
  22%{ transform:translateY(4px) }
  60%{ transform:translateY(-1px) }
}
#f-stamp{ display:inline-block }
.memo-stack.stamped #f-stamp{ animation:slam .34s cubic-bezier(.2,.8,.25,1) }
@keyframes slam{
  0%{ transform:scale(2.6) rotate(-18deg);opacity:0;filter:blur(5px) }
  70%{ transform:scale(.95) rotate(-3deg);opacity:1;filter:blur(0) }
  100%{ transform:none }
}
@media (prefers-reduced-motion: reduce){
  .memo-stack.stamped, .memo-stack.stamped #f-stamp{ animation:none }
}
.memo::after{
  content:"";position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(120% 100% at 50% 0%, transparent 60%, rgba(90,72,40,.12) 100%);
}
.letterhead{ text-align:center;border-bottom:2px solid var(--ink);padding-bottom:14px }
.letterhead h1{
  font-family:var(--type);font-size:clamp(13px,3vw,17px);margin:0;font-weight:700;
  letter-spacing:.14em;text-transform:uppercase;line-height:1.5;
}
.letterhead p{
  font-family:var(--type);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--ink-2);margin:9px 0 0;
}
.fields{
  font-family:var(--type);font-size:12px;line-height:2;margin:18px 0 0;
  border-bottom:1px solid var(--rule);padding-bottom:12px;
}
.fields b{ display:inline-block;width:74px;color:var(--ink-2);font-weight:400 }
.body-text{ margin-top:20px;font-size:16px;line-height:1.75 }
.body-text p{ margin:0 0 14px }
.sign{ margin-top:26px;font-family:var(--type);font-size:12.5px;line-height:1.8 }
.sign b{ display:block;font-weight:700 }
.stamp{
  position:absolute;right:22px;bottom:26px;transform:rotate(-9deg);
  border:3px double var(--stamp);color:var(--stamp);
  font-family:var(--type);font-size:10px;font-weight:700;letter-spacing:.14em;
  text-transform:uppercase;padding:7px 11px;opacity:.72;text-align:center;line-height:1.4;
}

.controls{ display:flex;gap:8px;margin-top:18px;flex-wrap:wrap }
button{
  font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;
  background:transparent;color:var(--paper);border:1px solid rgba(247,242,228,.45);
  padding:14px 18px;cursor:pointer;flex:1 1 auto;
}
button:hover{ background:var(--paper);color:#2A251C }
button:focus-visible{ outline:2px solid var(--paper);outline-offset:3px }

.real{ margin-top:34px;color:var(--paper) }
.real h2{ font-family:var(--mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#B4A98E;margin:0 0 6px }
.real .lead{ font-size:14px;line-height:1.7;color:#C9BFA6;margin:0 0 16px;max-width:60ch }
.real ul{ list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1px;background:rgba(247,242,228,.16);border:1px solid rgba(247,242,228,.16) }
.real li{ background:#332D22;padding:12px 13px }
.real li b{ display:block;font-family:var(--type);font-size:14px;color:var(--paper);margin-bottom:5px }
.real li span{ font-size:12.5px;line-height:1.55;color:#B4A98E }

/* A 38px pill is under the 44px a fingertip needs. */
@media (pointer:coarse){ #lc-back{ width:44px;height:44px } }
@media (max-width:520px){ #lc-back{ left:10px;bottom:10px } .memo{ padding:24px 18px 28px } }
@media print{ #lc-back{ display:none } }
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

    root.innerHTML = "<div class=\"wrap\">\n  <div class=\"memo-stack\" id=\"stack\">\n  <div class=\"memo\">\n    <div class=\"letterhead\">\n      <h1>The Department of<br>Redundancy Department</h1>\n      <p>Office of the Office &middot; Division of Divisions</p>\n    </div>\n    <div class=\"fields\">\n      <div><b>To:</b> <span id=\"f-to\">\u2014</span></div>\n      <div><b>From:</b> <span id=\"f-from\">\u2014</span></div>\n      <div><b>Ref:</b> <span id=\"f-ref\">\u2014</span></div>\n      <div><b>Subject:</b> <span id=\"f-sub\">\u2014</span></div>\n    </div>\n    <div class=\"body-text\" id=\"f-body\"></div>\n    <div class=\"sign\">\n      <b id=\"f-name\">\u2014</b>\n      <span id=\"f-title\">\u2014</span>\n    </div>\n    <div class=\"stamp\" id=\"f-stamp\">Duplicate<br>Copy</div>\n  </div>\n  </div>\n\n  <div class=\"controls\">\n    <button id=\"again\" type=\"button\">Issue another memorandum</button>\n  </div>\n\n  <div class=\"real\">\n    <h2>Genuine articles</h2>\n    <p class=\"lead\">\n      The memo above is invented. These are not: every one is a phrase people actually say, in which\n      a word has been repeated without anybody noticing, usually because it is hiding inside an\n      abbreviation or a language nobody checked.\n    </p>\n    <ul id=\"reals\"></ul>\n  </div>\n</div>";

    
    (function(){
      'use strict';
    
      var TO = ['All Staff and Personnel','Everyone (Each and Every One)','The Team and the Group',
        'Distribution List (Circulated Widely)','Internal Staff, Internally','All Recipients Receiving This'];
      var DEPTS = ['Duplication and Repetition','Repetition and Duplication','Tautology Oversight',
        'the Office of Offices','Redundancy Reduction Reduction','Pleonasm and Surplus Wording',
        'Advance Forward Planning','Past History and Prior Precedent'];
      var TITLES = ['Deputy Assistant Under-Secretary','Acting Interim Temporary Director',
        'Joint Co-Chair','Senior Principal Lead','Assistant to the Assistant',
        'Head of the Department Head','Chief Executive Officer of the Executive'];
      var NAMES = ['M. Mallory Mallory','P. Pettigrew-Pettigrew','A. A. Aldous','R. Rowntree Jr. Jr.',
        'D. Delacroix-Delacroix','H. Hollis Hollis','V. Vance Vance-Vance'];
      var SUBJ = ['Forward Planning Going Forward','Advance Warning in Advance',
        'Future Plans for the Future','Revert Back to Previous Prior Practice',
        'Repeat the Repetition Again','Close Proximity Nearby','Unexpected Surprise Announcement',
        'Basic Fundamentals (Essential Basics)','Added Bonus Supplement Addendum',
        'End Result of the Final Outcome'];
      var OPEN = [
        'Please be advised and informed that the following notice is hereby being brought to your attention, in advance and beforehand.',
        'It has come to our attention that attention has been drawn to a matter requiring attention.',
        'Following on from the follow-up, we are writing to write to you regarding the matter in question.',
        'This memorandum is a memo issued for the purpose of the purpose stated below.'
      ];
      var MID = [
        'All staff are asked to plan ahead in advance, and to collaborate together jointly with one another.',
        'Kindly repeat the process again, a second time, from the original beginning.',
        'The end result of the final outcome will be summarised in a brief summary, briefly.',
        'Each and every individual person must personally confirm receipt of what they have received.',
        'Please revert back to the previous prior version, which preceded the one before it.',
        'Any unexpected surprises should be reported immediately, without delay, straight away.'
      ];
      var CLOSE = [
        'This is a mandatory requirement and is compulsory. Attendance is required and expected.',
        'No further additional information is available at this time, currently.',
        'Thank you in advance beforehand for your anticipated cooperation to come.',
        'Failure to comply will result in this memorandum being reissued and sent again.'
      ];
      var STAMPS = ['Duplicate<br>Copy','Copy of<br>the Copy','File<br>and Refile','Received<br>and Got',
        'Read and<br>Read Again','Approved<br>and OK’d'];
    
      /* Every one of these is real, and the note says exactly which word has
         been doubled and where it was hiding. Nothing invented in this list. */
      var REAL = [
        ['PIN number', 'Personal Identification <b>Number</b> number.'],
        ['ATM machine', 'Automated Teller <b>Machine</b> machine.'],
        ['LCD display', 'Liquid Crystal <b>Display</b> display.'],
        ['HIV virus', 'Human Immunodeficiency <b>Virus</b> virus.'],
        ['RAM memory', 'Random Access <b>Memory</b> memory.'],
        ['GPS system', 'Global Positioning <b>System</b> system.'],
        ['ISBN number', 'International Standard Book <b>Number</b> number.'],
        ['HTTP protocol', 'HyperText Transfer <b>Protocol</b> protocol.'],
        ['DC Comics', 'Detective <b>Comics</b> Comics.'],
        ['The Sahara Desert', '<i>Ṣaḥrāʾ</i> is Arabic for <b>desert</b>. The desert desert.'],
        ['Chai tea', '<i>Chai</i> is <b>tea</b>, in Hindi and a dozen other languages.'],
        ['Naan bread', '<i>Naan</i> is <b>bread</b>, in Persian and Urdu.'],
        ['The La Brea Tar Pits', 'Spanish <i>la brea</i> is <b>the tar</b>. The the tar tar pits.'],
        ['The Los Angeles Angels', 'The The <b>Angels</b> Angels, once you translate the city.'],
        ['Rio Grande River', '<i>Río</i> is <b>river</b>. The big river river.'],
        ['Shiba Inu dog', '<i>Inu</i> is <b>dog</b> in Japanese.'],
        ['Queso cheese', '<i>Queso</i> is <b>cheese</b> in Spanish.'],
        ['Please RSVP', '<i>Répondez s’il vous plaît</i> already contains the <b>please</b>.']
      ];
    
      function pick(a){ return a[(Math.random() * a.length) | 0]; }
      function $(id){ return document.getElementById(id); }
    
      var lastSub = '';
      function issue(){
        var sub = pick(SUBJ);
        for (var i = 0; i < 8 && sub === lastSub; i++) sub = pick(SUBJ);
        lastSub = sub;
    
        $('f-to').textContent = pick(TO);
        $('f-from').textContent = 'The Department of ' + pick(DEPTS);
        $('f-ref').textContent = 'REF/' + (100 + ((Math.random() * 899) | 0)) + '/' +
          (100 + ((Math.random() * 899) | 0)) + ' (dup.)';
        $('f-sub').textContent = sub;
        $('f-body').innerHTML =
          '<p>' + pick(OPEN) + '</p><p>' + pick(MID) + '</p><p>' + pick(CLOSE) + '</p>';
        $('f-name').textContent = pick(NAMES);
        $('f-title').textContent = pick(TITLES) + ', Department of ' + pick(DEPTS);
        $('f-stamp').innerHTML = pick(STAMPS);
      }
    
      $('reals').innerHTML = REAL.map(function(r){
        return '<li><b>' + r[0] + '</b><span>' + r[1] + '</span></li>';
      }).join('');
    
      /* ---- the sound: a rubber stamp ------------------------------------- *
       * Wood on a desk through three sheets of paper and a carbon: a short
       * low thud with a hard click on top of it, and then the smaller sound
       * of the stamp being lifted off again.
       * ------------------------------------------------------------------- */
      function thunk(){
        LCSound.play(function(A){
          A.burst('brown', { freq: 132, q: 1.4, dur: .1, level: A.cap(.13), reverb: false });
          A.burst('white', { freq: 1500, q: 2.2, dur: .03, level: A.cap(.055), reverb: false });
          A.blip(72, { type:'sine', dur:.15, glide:48, level:A.cap(.07), reverb:false });
          /* lifted off */
          A.burst('white', { at:.17, freq: 2600, q: 1.6, dur: .04, level: A.cap(.03), reverb: false });
        });
      }
    
      function issueStamped(){
        issue();
        var st = $('stack');
        st.classList.remove('stamped'); void st.offsetWidth; st.classList.add('stamped');
        thunk();
      }
    
      $('again').addEventListener('click', issueStamped);
      issue();
    
      window.__memo = {
        issue: issue,
        subject: function(){ return $('f-sub').textContent; },
        from: function(){ return $('f-from').textContent; },
        body: function(){ return $('f-body').textContent; },
        reals: REAL.length,
        sample: function(n){ var o = []; for (var i = 0; i < n; i++){ issue(); o.push($('f-sub').textContent); } return o; }
      };
    })();
    

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
