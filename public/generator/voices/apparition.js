/* ------------------------------------------------------------------ *
 *  Voice: Your Apparition.
 *
 *  Was /generate-a-stand/. Moved across rather than rewritten: the word lists, the
 *  assembly and the room are the originals. The prose is the toy, and
 *  retyping it is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCGen.voice({
  id: "apparition",
  name: "Your Apparition",
  blurb: "A power, a drawback, and a name it insists on.",
  page: {
      "--gen-bg": "rgb(16, 14, 20)",
      "--gen-ink": "#100E14",
      "--gen-body": "ui-sans-serif, system-ui, \"Helvetica Neue\", Arial, sans-serif",
      "--gen-bar": "rgba(0,0,0,.22)",
      "--gen-rule": "rgba(128,128,128,.35)",
      "--gen-field": "rgba(127,127,127,.14)"
  },

  css: `

:root{
  --void:#100E14;
  --panel:#171520;
  --paper:#EFE8DA;
  --ink:#100E14;
  --line:#000;
  --yellow:#FFD400;
  --red:#E02020;
  --cyan:#00D6D6;
  --magenta:#E040A0;
  --dim:#8A8496;
  --display:"Impact","Haettenschweiler","Arial Narrow Bold","Arial Narrow",
            ui-sans-serif,system-ui,sans-serif;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --sans:ui-sans-serif,system-ui,"Helvetica Neue",Arial,sans-serif;
}
.room{
  background:var(--void);
  color:#EDE9F2;font-family:var(--sans);font-size:15px;
  padding:22px 14px 84px;
  display:flex;flex-direction:column;align-items:center;
  overflow-x:hidden;
}
.wrap{ max-width:780px;width:100% }

header{ text-align:center }
h1{
  margin:0;font-family:var(--display);font-size:clamp(30px,8vw,58px);
  letter-spacing:.05em;text-transform:uppercase;color:var(--paper);
  -webkit-text-stroke:2px var(--line);
  text-shadow:4px 4px 0 var(--red), 8px 8px 0 var(--yellow);
  transform:skewX(-5deg);
}
.sub{ margin-top:12px;font-family:var(--mono);font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--dim) }

/* ---------- the panel ---------- */
.panel{
  margin-top:22px;position:relative;background:var(--paper);color:var(--ink);
  border:5px solid var(--line);
  box-shadow:12px 12px 0 var(--line);
  padding:0;overflow:hidden;
  transform:rotate(-.6deg);
}
/* the speed lines behind everything */
.panel .rays{
  position:absolute;inset:0;pointer-events:none;opacity:.16;
  background:repeating-conic-gradient(from 0deg at 50% 42%,
    var(--line) 0deg 2.2deg, transparent 2.2deg 7deg);
}
.panel .burst{
  position:absolute;left:50%;top:42%;width:0;height:0;pointer-events:none;
  box-shadow:0 0 0 0 rgba(255,212,0,0);
}
.panel.reveal .burst{ animation:burst .5s ease-out 1 }
@keyframes burst{
  from{ box-shadow:0 0 0 0 rgba(255,212,0,.85) }
  to{ box-shadow:0 0 0 900px rgba(255,212,0,0) }
}
.panel.reveal{ animation:shake .34s cubic-bezier(.36,.07,.19,.97) 1 }
@keyframes shake{
  10%,90%{ transform:translate(-3px,1px) rotate(-.6deg) }
  20%,80%{ transform:translate(5px,-2px) rotate(.4deg) }
  30%,50%,70%{ transform:translate(-8px,2px) rotate(-1deg) }
  40%,60%{ transform:translate(8px,-1px) rotate(.8deg) }
  100%{ transform:rotate(-.6deg) }
}

.inner{ position:relative;padding:26px 24px 22px }

.cry{
  font-family:var(--display);font-size:clamp(15px,3.4vw,21px);letter-spacing:.14em;
  text-transform:uppercase;color:var(--red);-webkit-text-stroke:.6px var(--line);
  transform:skewX(-6deg);margin-bottom:6px;
}
.name{
  /* the brackets are part of the name, so the size is set from the whole
     string rather than from the words: a long one wrapping mid-bracket
     looked like a mistake rather than a flourish */
  font-family:var(--display);font-size:clamp(30px,7.6vw,58px);line-height:1.0;
  letter-spacing:.01em;text-transform:uppercase;
  color:var(--yellow);-webkit-text-stroke:3px var(--line);
  text-shadow:5px 5px 0 var(--line);
  transform:skewX(-6deg);margin:0 0 6px;overflow-wrap:break-word;text-wrap:balance;
}
.namesub{
  font-family:var(--display);font-size:clamp(15px,3.6vw,24px);letter-spacing:.1em;
  text-transform:uppercase;color:var(--ink);transform:skewX(-6deg);margin-bottom:18px;
}

.stats{
  display:grid;grid-template-columns:repeat(auto-fit,minmax(112px,1fr));gap:0;
  border:3px solid var(--line);background:#fff;margin-bottom:18px;
}
.stat{ border-right:3px solid var(--line);padding:9px 10px }
.stat:last-child{ border-right:0 }
@media (max-width:560px){ .stat{ border-right:0;border-bottom:3px solid var(--line) } .stat:last-child{ border-bottom:0 } }
.stat .k{ font-family:var(--mono);font-size:8.5px;letter-spacing:.18em;text-transform:uppercase;color:#6B6478 }
.stat .g{ font-family:var(--display);font-size:32px;line-height:1;margin-top:2px;letter-spacing:.04em }
.stat .g.A{ color:var(--red) } .stat .g.B{ color:#C06000 } .stat .g.C{ color:#3A6E2E }
.stat .g.D{ color:#3A5A8A } .stat .g.E{ color:#6B6478 }

.block{ border-left:6px solid var(--line);padding-left:14px;margin-bottom:16px }
.block h3{
  font-family:var(--mono);font-size:9px;letter-spacing:.22em;text-transform:uppercase;
  color:#6B6478;margin:0 0 5px;font-weight:700;
}
.block p{ margin:0;font-size:17px;line-height:1.55 }
.block .power{ font-weight:700;font-size:18.5px }

.catch{
  background:var(--line);color:var(--paper);padding:14px 16px;margin-top:4px;
  font-family:var(--display);font-size:clamp(17px,4.2vw,26px);letter-spacing:.03em;
  line-height:1.28;transform:skewX(-3deg);
}
.catch em{ color:var(--yellow);font-style:normal }

/* the sound word */
.sfx{
  position:absolute;right:-6px;top:14px;z-index:3;pointer-events:none;
  font-family:var(--display);font-size:clamp(26px,7vw,54px);letter-spacing:.04em;
  color:var(--cyan);-webkit-text-stroke:3px var(--line);
  text-shadow:5px 5px 0 var(--line);transform:rotate(9deg) skewX(-6deg);
  opacity:0;
}
.panel.reveal .sfx{ animation:sfx 1.5s ease-out 1 }
@keyframes sfx{
  0%{ opacity:0;transform:rotate(9deg) skewX(-6deg) scale(.4) }
  18%{ opacity:1;transform:rotate(9deg) skewX(-6deg) scale(1.16) }
  30%{ transform:rotate(9deg) skewX(-6deg) scale(1) }
  85%{ opacity:1 }
  100%{ opacity:0 }
}

/* ---------- controls ---------- */
.deck{ display:flex;gap:10px;flex-wrap:wrap;margin-top:22px;align-items:center }
input[type=text]{
  flex:1;min-width:180px;font-family:var(--sans);font-size:15px;
  background:#1D1A26;border:3px solid var(--line);color:#EDE9F2;padding:12px 14px;
  box-shadow:4px 4px 0 var(--line);
}
input[type=text]:focus{ outline:none;border-color:var(--yellow) }
input::placeholder{ color:#6B6478 }
button{
  font-family:var(--display);font-size:19px;letter-spacing:.09em;text-transform:uppercase;
  background:var(--yellow);color:var(--ink);border:3px solid var(--line);
  padding:11px 24px;cursor:pointer;box-shadow:5px 5px 0 var(--line);
  transform:skewX(-5deg);
}
button:hover{ background:#FFE24D }
button:active{ transform:skewX(-5deg) translate(4px,4px);box-shadow:1px 1px 0 var(--line) }
button.sec{ background:var(--panel);color:#EDE9F2 }
button.sec:hover{ background:#221E2E }
button:focus-visible{ outline:3px solid var(--cyan);outline-offset:3px }
.sound{
  display:flex;align-items:center;gap:7px;
  font-family:var(--mono);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);
}
.sound input{ width:15px;height:15px;accent-color:var(--yellow) }

footer{
  max-width:780px;width:100%;margin:26px auto 0;padding-top:14px;border-top:2px solid #262133;
  font-family:var(--mono);font-size:10.5px;line-height:1.85;color:var(--dim);
}
footer a{ color:var(--yellow) }

/* ---------- shared: back to the cabinet ---------- */
/* --- touch targets (sweep) --- */
@media (pointer:coarse){
  #snd{ min-height:44px }
  #snd{ min-width:44px }
}

/* A 38px pill is under the 44px a fingertip needs. */
@media (pointer:coarse){ #lc-back{ width:44px;height:44px } }
@media (max-width:520px){ #lc-back{ left:10px;bottom:10px } }
@media (prefers-reduced-motion: reduce){
  .panel.reveal, .panel.reveal .sfx, .panel.reveal .burst{ animation:none }
  .panel.reveal .sfx{ opacity:1 }
}

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

    root.innerHTML = "<div class=\"wrap\">\n  <header>\n    <h1>Your Apparition</h1>\n    <div class=\"sub\">it has been standing behind you this whole time</div>\n  </header>\n\n  <div class=\"panel\" id=\"panel\">\n    <div class=\"rays\" aria-hidden=\"true\"></div>\n    <div class=\"burst\" aria-hidden=\"true\"></div>\n    <div class=\"sfx\" id=\"sfx\" aria-hidden=\"true\">GOOON</div>\n    <div class=\"inner\">\n      <div class=\"cry\" id=\"cry\"></div>\n      <div class=\"name\" id=\"name\">\u2014</div>\n      <div class=\"namesub\" id=\"namesub\"></div>\n\n      <div class=\"stats\" id=\"stats\"></div>\n\n      <div class=\"block\"><h3>What it does</h3><p class=\"power\" id=\"power\"></p></div>\n      <div class=\"block\"><h3>The catch</h3><p id=\"cost\"></p></div>\n      <div class=\"block\"><h3>How it looks</h3><p id=\"look\"></p></div>\n\n      <div class=\"catch\" id=\"line\"></div>\n    </div>\n  </div>\n\n  <div class=\"deck\">\n    <input type=\"text\" id=\"who\" maxlength=\"26\" placeholder=\"a name, if you have one\"\n           autocomplete=\"off\" aria-label=\"A name to bind the apparition to\">\n    <button id=\"go\" type=\"button\">Awaken</button>\n    <button id=\"copy\" class=\"sec\" type=\"button\">Copy</button>\n    <label class=\"sound\"><input type=\"checkbox\" id=\"snd\" checked> sting</label>\n  </div>\n</div>";

    
    'use strict';
    const $ = (id) => document.getElementById(id);
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    
    /* ------------------------------------------------------------------ *
     *  Invented apparitions. Names are built from three lists so no single
     *  one of them is a title of anything.
     * ------------------------------------------------------------------ */
    const N1 = ['IRON','VELVET','HOLLOW','GLASS','SEVEN','CRIMSON','QUIET','LAST','BITTER','GOLDEN',
      'PAPER','MIDNIGHT','SALT','THIRTEEN','WHITE','BROKEN','ELECTRIC','SLOW','FIRST','COLD'];
    const N2 = ['ORCHID','LANTERN','CATHEDRAL','MACHINE','SPARROW','AVALANCHE','CAROUSEL','TELEGRAM',
      'MERIDIAN','LULLABY','WOLFHOUND','APERTURE','MONUMENT','SEAMSTRESS','TIDEWATER','CHANDELIER',
      'BAROMETER','HALLOWAY','MASQUERADE','FILAMENT'];
    const N3 = ['', '', '', ' II', ' (REQUIEM)', ' ACT 2', ' OVERTURE', ' NO. 9', ' REPRISE', ' UNBOUND'];
    
    const CRIES = [
      'IT IS ALREADY BEHIND YOU —',
      'YOU HAVE ALREADY MADE THE MISTAKE —',
      'THIS IS NOT A THREAT. IT IS A DESCRIPTION —',
      'YOU CANNOT BE SURPRISED BY THIS TWICE —',
      'THE MOMENT YOU UNDERSTAND IT, IT WILL BE OVER —',
      'I DID NOT CHOOSE THIS. IT CHOSE THE ROOM —',
      'DO NOT COUNT. THE COUNTING IS THE TRAP —',
      'YOUR NEXT MOVE HAS ALREADY BEEN ANSWERED —'
    ];
    
    /* The ability. Each is a rule about the world rather than a laser beam,
       which is the whole trick of the genre. */
    const POWERS = [
      'Anything it touches becomes the second-most-important thing in the room, permanently.',
      'It can move any object one metre, but only to where that object was ninety seconds ago.',
      'Everyone who hears its name forgets the last question they were asked.',
      'It reverses the order of any two events, provided nobody watched the first one.',
      'Distances it has walked stop being distances. It arrives before it sets off, and remembers both.',
      'It can put one thing back the way it was, once per day, including a decision.',
      'Anything written down in its presence becomes true for eleven minutes.',
      'It borrows one of your senses and lends it to whoever you are looking at.',
      'It stops a single moving object dead. The momentum has to go somewhere and it goes into the nearest promise.',
      'Sound in its range travels backwards. You hear the reply before the question.',
      'It can make any two things the same size. It cannot make them different sizes again.',
      'Everyone within thirty metres becomes exactly as tired as its user is.',
      'It converts one emotion into weather, at the scale that emotion actually deserved.',
      'Anything it has already destroyed cannot be destroyed again, by anyone, ever.',
      'It divides one person’s attention into four and gives three of them to somebody else.',
      'It knows the shortest true sentence that would end any argument, and is physically unable to say it.'
    ];
    const COSTS = [
      'It only works while its user is telling the truth, and it knows what the truth is better than they do.',
      'Every use ages the nearest clock by one year. Clocks in the building are already suspicious.',
      'It will not act while it is being watched by anyone who understands it.',
      'It cannot be used twice in the same room, and it remembers every room.',
      'Each activation costs one small good memory, chosen by the apparition and not by its user.',
      'It stops entirely if its user says its name out loud, which is a genuine problem in this genre.',
      'It works perfectly, and afterwards its user must explain what happened to a stranger, accurately.',
      'It is enormously powerful within four metres and completely inert at four metres and one centimetre.',
      'It requires the user to be losing at the time, and it can tell.',
      'It grants what was asked for, in the exact words used, and it is a very careful listener.'
    ];
    const LOOKS = [
      'A figure in a long coat made entirely of hinges, with a face like a window at night.',
      'Six identical hands, each holding a different object, and nothing above the wrists.',
      'A tall shape wrapped in what appears to be a bandstand, or a bell, or a wave, depending on the minute.',
      'Something knitted out of telephone wire, standing slightly wrong on the floor.',
      'A jockey the size of a lamppost, with a mask of frosted glass and no legs below the knee.',
      'A shape like a coat left on a chair, if the coat were paying attention.',
      'A statue in mid-argument, cast in something warmer than bronze.',
      'A shoal of small brass mechanisms holding the outline of a person and not agreeing about it.',
      'Nine feet of drapery with one very calm eye at chest height.',
      'A figure the exact colour of the wall it is in front of, always.',
      'Something wearing a diving helmet full of moths and standing very politely.',
      'A shape made of the space where a shape is not, and it is wearing gloves.'
    ];
    const LINES = [
      'You believed you were the one who moved first. That belief was the attack.',
      'I am not going to explain this. Explaining it is what it eats.',
      'There is nothing behind me. There is nothing behind you either, now.',
      'You have four seconds and I have already spent them.',
      'This ability is very simple. That is why nobody survives it.',
      'You are welcome to run. The running is included.',
      'The mistake was walking into a room I had already left.',
      'It does not matter what you do next. It matters what you did.',
      'I did not want it to be like this. I did not want it to be anything.',
      'Look at your hands. No — look at them again.'
    ];
    const SFX = ['GOOON','DODODODO','ZUUUN','MENACING','THUMP','KRRSH','DOOOM','GOGOGO','WRYYY','BAM'];
    const GRADES = ['A','B','C','D','E'];
    const STAT_KEYS = ['power','speed','range','staying','precision','potential'];
    
    let stand = null;
    
    function grade(){
      // weighted so a card is usually interesting: a couple of highs, a dud
      const r = Math.random();
      return r < .18 ? 'A' : r < .45 ? 'B' : r < .7 ? 'C' : r < .9 ? 'D' : 'E';
    }
    
    function awaken(){
      const bound = $('who').value.trim();
      const name = pick(N1) + ' ' + pick(N2) + pick(N3);
      const stats = {};
      STAT_KEYS.forEach((k) => { stats[k] = grade(); });
    
      stand = { name, bound, stats,
                cry: pick(CRIES), power: pick(POWERS), cost: pick(COSTS),
                look: pick(LOOKS), line: pick(LINES), sfx: pick(SFX) };
    
      $('cry').textContent = stand.cry;
      $('name').textContent = '「' + name + '」';
      $('namesub').textContent = bound
        ? 'bound to ' + bound.toUpperCase() + ' · range ' + ri(2, 60) + ' m'
        : 'unbound · range ' + ri(2, 60) + ' m';
      $('stats').innerHTML = STAT_KEYS.map((k) =>
        '<div class="stat"><div class="k">' + k + '</div>' +
        '<div class="g ' + stats[k] + '">' + stats[k] + '</div></div>').join('');
      $('power').textContent = stand.power;
      $('cost').textContent = stand.cost;
      $('look').textContent = stand.look;
      $('line').innerHTML = '&ldquo;' + stand.line.replace(/&/g,'&amp;').replace(/</g,'&lt;') + '&rdquo;';
      $('sfx').textContent = stand.sfx;
    
      // the reveal has to be an event, not a text box updating
      const p = $('panel');
      p.classList.remove('reveal');
      void p.offsetWidth;                 // restart the animations
      p.classList.add('reveal');
      if ($('snd').checked) sting();
    }
    
    /* ---- the sting ----------------------------------------------------- *
     *  Three things at once, because one sound is not an event: a low hit
     *  (a filtered noise thump plus a dropping sine), a bright metallic
     *  chord a beat later, and a long swell underneath the whole thing.
     * ------------------------------------------------------------------ */
    function sting(){
      LCAudio.sting((A) => {
        // the hit
        A.burst('brown', { type:'lowpass', freq:170, attack:.002, dur:.5, level:.5, reverb:true });
        A.blip(150, { type:'sine', dur:.5, level:.22, glide:44, reverb:true });
    
        // the metallic chord — a minor second in there so it is not pretty
        const r = A.note(4);
        A.chord([r, r * 1.19, r * 1.5, r * 2.02],
                { type:'sawtooth', at:.1, dur:1.5, level:.06,
                  filter:'bandpass', filterFreq:1900, q:1.1, reverb:true });
    
        // the swell under it
        A.burst('pink', { type:'bandpass', freq:420, q:.6,
                          at:.06, attack:.5, dur:1.5, level:.14, reverb:true });
    
        // and a rattle on the tail, so it does not just stop
        for (let i = 0; i < 5; i++){
          A.burst('white', { type:'bandpass', freq:3200 + Math.random() * 2200, q:6,
                             at:.55 + i * .07, attack:.002, dur:.05, level:.035 });
        }
      });
    }
    
    $('go').addEventListener('click', awaken);
    $('who').addEventListener('keydown', (e) => { if (e.key === 'Enter') awaken(); });
    $('copy').addEventListener('click', () => {
      if (!stand) return;
      const t = '「' + stand.name + '」\n' +
        STAT_KEYS.map((k) => k + ': ' + stand.stats[k]).join('  ') + '\n\n' +
        'What it does: ' + stand.power + '\n' +
        'The catch: ' + stand.cost + '\n' +
        'How it looks: ' + stand.look + '\n\n' +
        '"' + stand.line + '"';
      navigator.clipboard.writeText(t).then(
        () => { $('copy').textContent = 'Copied'; setTimeout(() => $('copy').textContent = 'Copy', 1400); },
        () => { $('copy').textContent = 'No'; setTimeout(() => $('copy').textContent = 'Copy', 1600); }
      );
    });
    
    awaken();
    $('panel').classList.remove('reveal');   // no bang before anybody pressed anything
    
    window.__stand = { awaken: awaken, get stand(){ return stand; } };
    
    
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
