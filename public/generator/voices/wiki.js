/* ------------------------------------------------------------------ *
 *  Voice: Rick's Wiki.
 *
 *  Was /ricks-wiki/. Moved across rather than rewritten: the word lists, the
 *  assembly and the room are the originals. The prose is the toy, and
 *  retyping it is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCGen.voice({
  id: "wiki",
  name: "Rick's Wiki",
  blurb: "A filing on a pegboard workbench, with something green at the bottom.",
  page: {
      "--gen-bg": "rgb(20, 23, 15)",
      "--gen-ink": "#E4E2D2",
      "--gen-body": "\"Avenir Next Condensed\", \"Roboto Condensed\", \"Arial Narrow\", ui-sans-serif, sans-serif",
      "--gen-bar": "rgba(0,0,0,.22)",
      "--gen-rule": "rgba(128,128,128,.35)",
      "--gen-field": "rgba(127,127,127,.14)"
  },

  css: `

/* Declare the scheme this toy is actually drawn in. Without it a browser
   running forced dark mode will invert the whole page — the cream card
   comes back dark brown, the ink comes back pale, and the illustrated
   background is flattened to black. */
:root{
  /* The filing is still a filing, but it is being written on a bench in a
     garage at three in the morning under one fluorescent tube that has
     never been changed. Everything is grease-grey; the only bright thing
     is the stuff in the jar, and it is the wrong green. */
  --paper:#1A1D18;
  --paper-2:#23271F;
  --sheet:#E8E4D2;
  --blue:#8ADB4E;
  --blue-2:#B6F27A;
  --ink:#E4E2D2;
  --ink-2:#A8A896;
  --dim:#71755F;
  --stamp:#C24A2A;
  --line:#3A3E30;
  --ooze:#9BE03C;
  --sans:"Avenir Next Condensed","Roboto Condensed","Arial Narrow",ui-sans-serif,sans-serif;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
}
/* the tube overhead, and the jar of something on the shelf */
body::before{
  content:"";position:fixed;inset:0;z-index:0;pointer-events:none;
  background:
    radial-gradient(680px 300px at 50% -12%, rgba(220,240,180,.07), transparent 70%),
    radial-gradient(320px 320px at 88% 78%, rgba(155,224,60,.075), transparent 68%);
}
/* a pegboard, because that is what the wall behind a bench is */
body::after{
  content:"";position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.5;
  background-image:radial-gradient(circle at 10px 10px, rgba(0,0,0,.35) 1.6px, transparent 2px);
  background-size:26px 26px;
}
.wrap, footer{ position:relative;z-index:1 }
/* the filing arrives crooked, as though slapped down on the bench */
.filing.slap{ animation:slap .3s cubic-bezier(.2,.9,.3,1.2) }
@keyframes slap{
  0%{ transform:rotate(-2.4deg) translateY(-12px) scale(1.02) }
  60%{ transform:rotate(.5deg) translateY(2px) }
  100%{ transform:none }
}
/* and something in the margin bubbles, slowly and unpleasantly */
.ooze{
  position:fixed;left:0;bottom:0;width:100%;height:5px;z-index:2;pointer-events:none;
  background:linear-gradient(90deg, transparent, var(--ooze), transparent);
  opacity:.34;filter:blur(1px);animation:ooze 7s ease-in-out infinite alternate;
}
@keyframes ooze{ from{ transform:translateX(-24%) } to{ transform:translateX(24%) } }
@media (prefers-reduced-motion: reduce){ .filing.slap,.ooze{ animation:none } }
.room{
  background:#14170F;
  background-image:repeating-linear-gradient(0deg, rgba(255,255,255,.014) 0 1px, transparent 1px 4px);
  color:var(--ink);font-family:var(--sans);padding:28px 16px 60px;
}
.wrap{ max-width:780px;margin:0 auto }

.filing{
  background:var(--paper);border:1px solid var(--line);
  box-shadow:0 14px 40px rgba(30,36,28,.22);
  padding:0 0 24px;position:relative;overflow:hidden;
}
.filing::after{
  content:"";position:absolute;inset:0;pointer-events:none;
  background:repeating-linear-gradient(0deg, transparent 0 27px, rgba(42,91,158,.05) 27px 28px);
}

.head{
  border-bottom:2px solid var(--ink);padding:18px 24px 13px;
  display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;align-items:flex-end;
}
.head .office{
  font-family:var(--mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-2);
}
.head h1{ margin:5px 0 0;font-size:19px;font-weight:800;letter-spacing:-.01em }
.head .no{ font-family:var(--mono);font-size:10.5px;color:var(--dim);text-align:right;line-height:1.7 }

.body{ padding:20px 24px 0;position:relative;z-index:1 }
.title-row{ display:grid;grid-template-columns:1fr 168px;gap:20px;align-items:start }
@media (max-width:620px){ .title-row{ grid-template-columns:1fr } }
h2.device{
  margin:0 0 4px;font-size:clamp(21px,4.4vw,31px);font-weight:800;
  letter-spacing:-.025em;line-height:1.12;text-transform:uppercase;
}
.classif{ font-family:var(--mono);font-size:10.5px;color:var(--blue);letter-spacing:.09em;margin-bottom:14px }
svg.schema{ width:100%;height:auto;border:1px solid var(--line);background:#12150E;opacity:.72 }

.sec{ margin-top:18px }
.sec h3{
  margin:0 0 7px;font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;
  text-transform:uppercase;color:var(--ink-2);font-weight:400;
  border-bottom:1px solid var(--line);padding-bottom:5px;
}
.sec p{ margin:0;font-size:15px;line-height:1.68 }
.sec p em{ font-style:italic;color:var(--ink-2) }
ol.claims{ margin:0;padding-left:22px;font-size:14.5px;line-height:1.62 }
ol.claims li{ margin-bottom:7px }

.warn{
  margin-top:18px;border:2px solid var(--stamp);background:rgba(194,74,42,.12);
  padding:14px 16px;
}
.warn h3{
  margin:0 0 6px;font-family:var(--mono);font-size:9.5px;letter-spacing:.18em;
  text-transform:uppercase;color:#E07A54;
}
.warn p{ margin:0;font-size:15px;line-height:1.6;color:#F0B49A }

.stamp{
  position:absolute;right:22px;top:120px;
  border:3px solid var(--stamp);color:var(--stamp);
  font-family:var(--mono);font-size:12px;letter-spacing:.16em;font-weight:700;
  padding:7px 12px;transform:rotate(-11deg);opacity:.78;text-transform:uppercase;
  z-index:2;pointer-events:none;background:rgba(26,29,24,.6);
}

.deck{ display:flex;gap:9px;flex-wrap:wrap;margin-top:20px;padding:0 24px }
.btn{
  font-family:var(--mono);font-size:10.5px;letter-spacing:.11em;text-transform:uppercase;
  background:var(--ink);color:var(--paper);border:0;padding:12px 18px;cursor:pointer;font-weight:700;
}
.btn:hover{ background:#000 }
.btn.sec2{ background:transparent;color:var(--ink);border:1px solid var(--line);font-weight:400 }
.btn.sec2:hover{ border-color:var(--blue);color:var(--blue) }
.btn:focus-visible{ outline:2px solid var(--blue);outline-offset:2px }

footer{
  margin-top:24px;font-family:var(--mono);font-size:10.5px;color:#5F6660;line-height:1.8;text-align:center;
}
footer a{ color:var(--ink-2) }
.prior{ margin:0;padding-left:18px;list-style:square }
.prior li{ margin:0 0 6px;font-size:13.5px;line-height:1.6 }
.offsite{
  display:flex;align-items:center;gap:12px;margin-top:22px;padding:14px 16px;
  text-decoration:none;border:1px solid rgba(255,255,255,.22);border-radius:3px;
  background:rgba(255,255,255,.05);transition:background .18s, border-color .18s, transform .18s;
}
.offsite:hover{ background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.42);transform:translateY(-1px) }
.offsite-k{ font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;opacity:.65 }
.offsite-v{ font-size:14px;font-weight:600;flex:1 }
.offsite-arrow{ font-size:16px;opacity:.6 }
@media (max-width:520px){ .offsite{ flex-wrap:wrap;gap:4px 10px } .offsite-v{ flex:1 0 100% } }

/* ---------- shared: back to the cabinet ----------
   Every toy carries the same control in the same place, so there is always
   one way out that does not depend on scrolling to a footer. It sits as a
   compact disc and opens to the word on hover or focus, because a wide
   permanent chip covers whatever is in the corner of a scrolling page. */
/* --- touch targets (sweep) --- */
@media (pointer:coarse){
  .btn{ min-height:44px }
}

/* A 38px pill is under the 44px a fingertip needs. */
@media (pointer:coarse){ #lc-back{ width:44px;height:44px } }
/* so the foot of a page can always scroll clear of it */
.room{ padding-bottom:64px }
@media (max-width:520px){ #lc-back{ left:10px;bottom:10px } }
@media print{ #lc-back{ display:none } }
@media (prefers-reduced-motion: reduce){ #lc-back{ transition:none } }

/* a display face for this toy, against the body text it already had */
:root{ --display:"Hoefler Text",Baskerville,"Palatino Linotype",Georgia,serif; }
h1{ font-family:var(--display) }

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

    root.innerHTML = "<div class=\"ooze\" aria-hidden=\"true\"></div>\n<div class=\"wrap\">\n  <div class=\"filing\" id=\"filing\"></div>\n  <div class=\"deck\">\n    <button class=\"btn\" id=\"next\">File another</button>\n    <button class=\"btn sec2\" id=\"copy\">Copy the abstract</button>\n  </div>\n  <!-- One link out, and only one. Everything on this page is invented; anyone who\n       actually wants the show's canon should go to the fan wiki that documents it,\n       rather than have anear-canon episode guide reassembled here. -->\n  <a class=\"offsite\" href=\"https://rickandmorty.fandom.com/wiki/Rick_and_Morty_Wiki\"\n     target=\"_blank\" rel=\"noopener noreferrer\">\n    <span class=\"offsite-k\">Looking for the real thing?</span>\n    <span class=\"offsite-v\">The Rick and Morty Wiki \u2014 fan-run, on Fandom</span>\n    <span class=\"offsite-arrow\" aria-hidden=\"true\">\u2197</span>\n  </a>\n  \n</div>";

    
    'use strict';
    
    const $ = (id) => document.getElementById(id);
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const ri = (a,b) => a + Math.floor(Math.random() * (b - a + 1));
    const esc = (s) => String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    
    /* Everything below is original writing in the shape of a patent filing.
       Nothing here is quoted, paraphrased or lifted from the show — the joke is
       the bureaucracy, not the canon. Deliberately no device from the series is
       described; if you want the real thing there is one link out, at the foot. */
    const PREFIX = ['Portable','Handheld','Pocket','Field','Modular','Recursive','Disposable','Industrial',
      'Domestic','Provisional','Reinforced','Self-Cleaning','Unlicensed','Load-Bearing','Ambient',
      'Collapsible','Wall-Mounted','Fun-Size','Third-Party','Reconditioned','Non-Consensual','Family-Sized',
      'Weatherproof','Single-Occupancy','Off-Brand','Semi-Autonomous','Court-Ordered','Kitchen-Counter',
      'Wearable','Ruggedised','Entry-Level','Extremely Loud','Bargain-Bin','Two-Person','Overclocked',
      'Ceremonial','Refurbished','Under-Sink','Regulation','Unattended'];
    const SUBJ = ['Consequence','Timeline','Regret','Adjacency','Momentum','Probability','Grievance','Continuity',
      'Causality','Sincerity','Hindsight','Obligation','Proximity','Grief','Enthusiasm','Reputation','Consent',
      'Boredom','Loyalty','Coincidence','Empathy','Debt','Nostalgia','Consensus','Patience','Ownership',
      'Blame','Certainty','Appetite','Silence','Politeness','Inheritance','Attention','Guilt','Resentment',
      'Coherence','Discretion','Gravity','Volume','Tuesday','Doubt','Applause','Distance','Apology','Novelty','Symmetry'];
    const DEVICE = ['Deferrer','Splitter','Compressor','Rerouter','Nullifier','Decanter','Manifold','Winder',
      'Bisector','Attenuator','Distributor','Percolator','Untangler','Redactor','Governor','Escrow Unit',
      'Substitutor','Ratchet','Sieve','Bellows','Transposer','Dampener','Flywheel','Clarifier','Injector',
      'Bracket','Reconciler','Aperture','Ballast','Trellis','Aggregator','Spool','Gasket','Lathe','Regulator',
      'Baffle','Turnstile','Condenser','Hopper','Reservoir'];
    const ABSTRACT = [
      'A device for {verb} {object} without the user being present at the time.',
      'An apparatus that identifies {object} and handles it by {verb} it into somewhere the user does not have to look.',
      'A method of {verb} {object}, then presenting the result as though it had always been that way.',
      'A portable unit which takes {object} as its input and returns roughly the same thing with the difficult part removed.',
      'An arrangement for {verb} {object} at a rate the user selects with a dial they will immediately turn too far.',
      'A self-contained system for {verb} {object} on behalf of a user who has explicitly declined to discuss it.',
      'An instrument that locates {object} within a household and begins {verb} it before anybody has agreed to this.',
      'A means of {verb} {object} such that the user can honestly claim not to remember it.',
      'A compact appliance which, on being shown {object}, responds by {verb} it and then refusing further input.',
      'A device that accepts {object} and holds it indefinitely, on the understanding that nobody will ask for it back.',
      'A domestic unit for {verb} {object} in the background, at a volume just above the threshold of notice.',
      'An apparatus for {verb} {object} and depositing the residue in a timeline where it is somebody else\'s problem.',
      'A machine which converts {object} into a smaller and more portable version of {object}.',
      'A method for {verb} {object} that works flawlessly on the first attempt and never again.',
      'A device which asks the user to confirm they wish to proceed with {verb} {object}, and then proceeds regardless.',
      'An enclosure in which {object} may be left while the user decides whether {verb} it was a good idea.',
      'A handheld unit that begins {verb} {object} the moment it is switched on and cannot be switched off.',
      'An apparatus for {verb} {object} which produces, as a by-product, a second and slightly worse {object}.',
      'A system for {verb} {object} in instalments, so that no single instalment feels like a decision.',
      'A device for {verb} {object} on a schedule, chosen by the device.',
      'An appliance which takes {object} and returns a receipt, the terms of which are not disclosed.',
      'A method of {verb} {object} that is reversible in principle and has never been reversed in practice.',
      'A unit for {verb} {object} while maintaining the outward appearance of a normal and well-adjusted household.',
      'A device that surveys the room, selects {object} without consultation, and gets on with {verb} it.',
    ];
    const ELABORATION = [
      'The applicant stresses that the device does not create the problem; it merely arrives first.',
      'Operation requires no training, no supervision, and, in the applicant\'s words, no witnesses.',
      'A second unit may be purchased to deal with the output of the first, and a third is available.',
      'The device is fitted with a handle, which the applicant concedes is the most considered part of the design.',
      'It runs on household current and on a second supply the applicant has declined to describe.',
      'The manual consists of one page, most of which is a diagram of the handle.',
      'A warranty is offered, voided by use.',
      'The unit is quiet in operation except for a sound the applicant describes as "structural sighing".',
      'Cleaning instructions are provided and are, in the examiner\'s view, wildly optimistic.',
      'The device ships with two spare parts, neither of which corresponds to any part of the device.',
      'It is designed to sit on a shelf and be seen, which the applicant lists as a primary function.',
      'The applicant notes that the device has never failed a test it was told about in advance.',
      'Long-term storage is not recommended, and neither is short-term storage.',
      'The casing is rated for domestic use and has, on one occasion, been rated for something else entirely.',
      'An optional carry case is available and is slightly too small.',
      'The device improves with use, up to the fourth use.',
    ];
    const VERB = ['deferring','decanting','flattening','rerouting','compressing','duplicating','nullifying',
      'itemising','laminating','filing','reconciling','withdrawing','ventilating','sub-letting','annotating',
      'discounting','bracketing','outsourcing','distilling','dismantling','pre-approving','reupholstering',
      'archiving','postponing','subdividing','normalising','rehousing','depreciating','de-escalating',
      'aerating','collateralising','abbreviating'];
    const OBJECT = ['a household argument','a Sunday afternoon','one specific regret','an inconvenient cousin',
      'the last four minutes of a conversation','a promise made at a wedding','somebody else\'s certainty',
      'an unopened letter','the version of you that agreed to this','a shared memory of a holiday',
      'a debt nobody has mentioned in years','the silence after a question','an inherited piece of furniture',
      'a running joke that stopped being funny','the middle of a long car journey','a name you cannot place',
      'an apology drafted but never sent','a birthday','the moment before somebody answers','a family recipe',
      'an unfinished sentence','a grudge with no remaining participants','the smell of a house you grew up in',
      'a decision made on a Tuesday','somebody\'s enthusiasm for a hobby','an appointment you intend to miss',
      'the second half of an anecdote','a photograph nobody wants','an obligation acquired by standing nearby',
      'the good chair','a conversation had entirely by text','a sum of money mentioned once'];
    const ASIDES = [
      'the applicant would prefer this were not read aloud',
      'this claim has been amended four times and gets worse each time',
      'a footnote here has been redacted by the applicant themselves',
      'the examiner notes the word "safely" was inserted in a different pen',
      'the applicant was reminded this is a legal document',
      'this section was submitted on the back of a receipt',
      'the applicant has since disputed writing this',
      'a diagram was attached here and has been removed by the office',
      'the applicant asks that this not be shown to their family',
      'this passage is identical to a filing rejected in 2011',
      'the applicant offered to withdraw this line in exchange for the patent',
      'the office notes the handwriting changes at this point',
      'a smell was reported by the clerk who processed this page',
      'the applicant has asked that the word "mostly" be treated as load-bearing',
      'this was filed twice, with the second copy slightly different',
      'the applicant read this aloud and then asked for it back',
      'the margin here contains a drawing of the device winning an award',
      'the office declines to reproduce the applicant\'s underlining',
      'the applicant\'s attorney has asked to be removed from the record',
      'this line was added after the interview and before the deposit cleared',
      'the applicant describes this as the boring part',
      'the office observes this is the only page with a page number',
    ];
    const CLAIMS = [
      'The device as described, operating on household current and on the user\'s reluctance.',
      'A method according to claim 1, in which the user is not informed which of the two settings is running.',
      'The device of claim 1, further comprising a lid, which the applicant considers the innovative element.',
      'A method by which the result is presented as inevitable rather than as a choice made by the user.',
      'The device of claim 1, in which the warning label is applied after the first use.',
      'An arrangement whereby the second-worst outcome is selected automatically to save time.',
      'A configuration in which the device declines to explain what it is doing while it is doing it.',
      'The device of claim 1, wherein the off switch is present, labelled, and connected to nothing.',
      'A method of operation in which the device records what it did but not why.',
      'The device of claim 1, further comprising a chime, which sounds at completion and at other times.',
      'A variant in which two users may operate the device simultaneously and disagree about the result.',
      'The device of claim 1, in which any error is displayed in a font too small to read from standing.',
      'A configuration wherein the device may be operated by a child, and works better when it is.',
      'A method whereby the device pauses before finishing, for effect.',
      'The device of claim 1, adapted so that removing the battery does not stop it.',
      'An arrangement in which the device asks a clarifying question and does not wait for the answer.',
      'The device of claim 1, wherein a copy of the input is retained for reasons that are not disclosed.',
      'A method in which the device selects the setting the user would have chosen an hour ago.',
      'The device of claim 1, further comprising a second dial which is decorative.',
      'A configuration in which the device works only when it believes it is being watched.',
      'The device of claim 1, in which the output is delivered to the room next door.',
      'A method whereby the device completes the task and then denies having been switched on.',
      'The device of claim 1, wherein the serial number changes between inspections.',
      'An arrangement in which the device may be returned, though not to the address supplied.',
      'The device of claim 1, further comprising a strap, for carrying it away quickly.',
      'A method in which the device rounds the result to the nearest convenient figure.',
      'The device of claim 1, wherein a third party is billed.',
      'A configuration whereby the device improves the user\'s account of events retrospectively.',
      'The device of claim 1, in which the instructions are printed on the inside of the casing.',
      'A method whereby the device produces a noise instead of an error.',
      'The device of claim 1, adapted to be mistaken for a kettle.',
      'An arrangement in which the device requires two hands, both of them the user\'s.',
      'The device of claim 1, in which the maintenance interval is stated as "you will know".',
      'A method by which the device apologises, briefly, in text, at the end.',
      'The device of claim 1, wherein a cooling period is enforced between uses and is not enforced.',
      'A configuration in which the device is bolted down, for reasons given only verbally.',
    ];
    const SIDE_EFFECTS = [
      'Users report a faint conviction that they have already had this conversation.',
      'Adjacent rooms become approximately four minutes out of step with the room containing the device.',
      'Small objects on the same shelf are found, later, in a slightly better arrangement.',
      'The user retains the memory of the decision but not of making it.',
      'Anyone within two metres becomes briefly and unusually agreeable.',
      'A second copy of the user\'s handwriting appears in the household, subtly neater.',
      'Pets refuse to enter the room and will not be discussed on the matter.',
      'The user\'s account of the week gains a Thursday it did not previously have.',
      'Cutlery in the drawer sorts itself by an unfamiliar principle.',
      'Photographs in the house develop one extra person at the edge of frame, out of focus.',
      'The user finds themselves apologising to appliances, and meaning it.',
      'Any argument begun in the room concludes forty per cent faster and satisfies nobody.',
      'The device\'s own instruction manual acquires a chapter overnight.',
      'Bread goes stale in the room at roughly double the usual rate.',
      'Two people asked to describe the device separately will describe two devices.',
      'The user\'s phone begins autocorrecting to a word they do not use.',
      'Doors in the house close a half-second after being released.',
      'The user reports dreaming, repeatedly, of a corridor with the right carpet.',
      'Guests leave earlier than intended and cannot say why when asked later.',
      'A low hum is audible only to whoever paid for the device.',
      'Post arrives addressed to a version of the user with a middle initial.',
      'The user becomes unwilling, over several weeks, to sit with their back to it.',
      'Clocks in the room agree with each other and with nothing else in the building.',
      'A houseplant near the device grows toward it rather than toward the window.',
      'The user\'s handwriting slants two degrees further right and stays there.',
      'Leftovers keep better. Considerably better. Indefinitely, in one reported case.',
      'The user acquires a firm opinion about a country they have never visited.',
      'One stair in the house begins to creak in a different key.',
      'Anyone who reads the serial number aloud forgets it within the hour.',
      'The room smells faintly of a place the user has not thought about in years.',
      'The user\'s reflection is punctual but not enthusiastic.',
      'A drawer in the kitchen will no longer fully close, and the drawer is fine.',
    ];
    const OFFICE_NOTES = [
      'Application returned once for missing pages; resubmitted with more pages than before.',
      'Examiner requested a demonstration. Examiner has requested no further demonstrations.',
      'Prior art identified in three other timelines. Applicant asserts they are the prior art.',
      'Approved on the condition it is never manufactured. Applicant agreed enthusiastically.',
      'The office has received a complaint about this device from an address that does not exist.',
      'Applicant declined to leave a contact number, citing "the obvious reason".',
      'Filed under Unwise Devices rather than Household Goods, over the applicant\'s objection.',
      'Examiner notes the device was already in the room when the interview began.',
      'The applicant has filed eleven variations of this device. This is the least alarming.',
      'A duplicate of this filing arrived yesterday, dated next month.',
      'The office is satisfied the device works. The office is not satisfied it should.',
      'Provisionally rejected. The rejection has been mislaid twice.',
      'Applicant paid the fee in a currency the office has agreed not to name.',
      'Examiner requested safety data. Applicant supplied a photograph of the handle.',
      'Granted, then ungranted, then granted again on appeal by the device.',
      'The office notes that this is the applicant\'s first filing not to mention their family.',
      'Held pending clarification of what happens to the second copy.',
      'The applicant\'s previous device is still in the building and has been given a desk.',
      'Examiner recused themselves after the third interview and would not elaborate.',
      'The file is heavier than the number of pages accounts for.',
      'Applicant asked whether the patent could be granted retroactively. It has been.',
      'Approved for domestic use only. The office declines to define "domestic".',
      'A clerk has requested a transfer, and the request cites this application by number.',
      'The office would like it noted that the applicant was warned.',
    ];
    const PRIOR_ART = [
      'Application {no}, withdrawn after the examiner asked what the second dial did.',
      'Application {no}, rejected for describing the same device twice under different names.',
      'Application {no}, granted and then quietly reclassified as a hazard.',
      'Application {no}, abandoned when the applicant could not locate the prototype.',
      'Application {no}, refused; the drawings depicted a device holding its own patent.',
      'Application {no}, allowed to lapse after the fee was paid by the device itself.',
      'Application {no}, rejected as insufficiently distinct from a chair.',
      'Application {no}, still pending; the file has been open for nineteen years.',
      'Application {no}, withdrawn on the day of the interview and refiled that evening.',
      'Application {no}, granted in one timeline and cited as a warning in the rest.',
      'Application {no}, rejected because the claims described what the device would like to do.',
      'Application {no}, sealed at the applicant\'s request and reopened by the office.',
    ];
    const REBUTTALS = [
      'The applicant submits that every objection raised is, correctly understood, a feature.',
      'The applicant contends that the office has misunderstood the device, the field, and the applicant.',
      'The applicant declines to answer the objection and refers the office to the device.',
      'The applicant argues that the risk is theoretical, and that theory is where risk belongs.',
      'The applicant proposes resolving the objection by removing the page it appears on.',
      'The applicant maintains the device is safe when operated correctly, and that nobody has yet done so.',
      'The applicant notes the office has approved worse and offers to name it.',
      'The applicant suggests that the examiner\'s concerns be filed as a separate application.',
      'The applicant observes that the objection would not have arisen had the demonstration finished.',
      'The applicant has responded with a diagram. The diagram is of the office.',
      'The applicant insists the device cannot be dangerous, as it has not been switched on in this building.',
      'The applicant requests that the objection be reconsidered by a different version of the examiner.',
    ];
    
    function schematic(seed){
      // A plausible-looking blueprint, drawn from the filing number so each
      // invention gets its own consistent diagram.
      let s = seed;
      const r = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
      const W = 168, H = 132;
      let g = '';
      g += '<rect x="0.5" y="0.5" width="' + (W-1) + '" height="' + (H-1) + '" fill="none" stroke="#7FA3CE" stroke-width="1"/>';
      // grid
      for (let x = 12; x < W; x += 12) g += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + H + '" stroke="#E3EAF3" stroke-width="1"/>';
      for (let y = 12; y < H; y += 12) g += '<line x1="0" y1="' + y + '" x2="' + W + '" y2="' + y + '" stroke="#E3EAF3" stroke-width="1"/>';
      // body
      const bw = 46 + r()*40, bh = 34 + r()*34;
      const bx = (W - bw)/2, by = (H - bh)/2;
      g += '<rect x="' + bx.toFixed(1) + '" y="' + by.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + bh.toFixed(1) +
           '" fill="none" stroke="#2A5B9E" stroke-width="1.6"/>';
      // internals
      const n = 2 + Math.floor(r()*3);
      for (let i = 0; i < n; i++){
        const cx = bx + 8 + r()*(bw-16), cy = by + 8 + r()*(bh-16), rad = 3 + r()*7;
        g += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + rad.toFixed(1) +
             '" fill="none" stroke="#2A5B9E" stroke-width="1.2"/>';
      }
      // protrusions
      for (let i = 0; i < 3; i++){
        const side = Math.floor(r()*4);
        const len = 10 + r()*18;
        let x1,y1,x2,y2;
        if (side === 0){ x1 = bx + r()*bw; y1 = by; x2 = x1; y2 = by - len; }
        else if (side === 1){ x1 = bx + bw; y1 = by + r()*bh; x2 = bx + bw + len; y2 = y1; }
        else if (side === 2){ x1 = bx + r()*bw; y1 = by + bh; x2 = x1; y2 = by + bh + len; }
        else { x1 = bx; y1 = by + r()*bh; x2 = bx - len; y2 = y1; }
        g += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) +
             '" stroke="#2A5B9E" stroke-width="1.3"/>';
        g += '<circle cx="' + x2.toFixed(1) + '" cy="' + y2.toFixed(1) + '" r="2.4" fill="#2A5B9E"/>';
      }
      // callouts
      g += '<text x="6" y="' + (H-6) + '" font-family="ui-monospace,monospace" font-size="7" fill="#7FA3CE">FIG. 1 — not to scale</text>';
      return '<svg class="schema" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="schematic diagram">' + g + '</svg>';
    }
    
    let current = null;
    
    
    function makeFiling(){
      const name = pick(PREFIX) + ' ' + pick(SUBJ) + ' ' + pick(DEVICE);
      const no = ri(2,9) + ',' + ri(100,999) + ',' + ri(100,999);
      const seed = parseInt(no.replace(/,/g,''), 10);
      const abstractTpl = pick(ABSTRACT);
      // The aside is spliced into the first sentence only. Appending the
      // elaboration before splicing put the parenthetical inside it, which read
      // as though the clerk had interrupted mid-clause.
      const abstract = abstractTpl
        .replace('{verb}', pick(VERB))
        .replace('{object}', pick(OBJECT));
      const elab = pick(ELABORATION);
      // the mid-sentence aside, spliced into the abstract rather than appended
      const aside = pick(ASIDES);
      const parts = abstract.split(/(?<=,)\s/);
      let withAside;
      if (parts.length > 1){
        withAside = parts[0] + ' <em>(' + aside + ')</em> ' + parts.slice(1).join(' ');
      } else {
        const dot = abstract.indexOf('. ');
        withAside = dot > -1
          ? abstract.slice(0, dot + 1) + ' <em>(' + aside + ')</em>' + abstract.slice(dot + 1)
          : abstract + ' <em>(' + aside + ')</em>';
      }
    
      const claims = [];
      const pool = CLAIMS.slice();
      const want = ri(4,6);
      while (claims.length < want && pool.length){
        claims.push(pool.splice(Math.floor(Math.random()*pool.length), 1)[0]);
      }
    
      // two prior filings, numbered near this one so the office looks like it has a memory
      const priorPool = PRIOR_ART.slice();
      const prior = [];
      for (let i = 0; i < 2 && priorPool.length; i++){
        const tpl = priorPool.splice(Math.floor(Math.random() * priorPool.length), 1)[0];
        prior.push(tpl.replace('{no}', ri(1,9) + ',' + ri(100,999) + ',' + ri(100,999)));
      }
    
      withAside += ' ' + elab;
    
      return {
        name, no, seed,
        prior,
        rebuttal: pick(REBUTTALS),
        classif: 'Class ' + String.fromCharCode(65 + ri(0,25)) + ri(10,99) + '/' + ri(100,999) +
                 ' · unclassifiable subgroup ' + ri(2,88),
        abstractHtml: withAside,
        abstractText: abstract + ' (' + aside + ') ' + elab,
        claims,
        side: pick(SIDE_EFFECTS),
        note: pick(OFFICE_NOTES),
        filed: ri(1,28) + ' ' + pick(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']) +
               ' ' + ri(1994, 2026),
      };
    }
    
    function render(){
      const f = current;
      $('filing').innerHTML =
        '<div class="stamp">Filed</div>' +
        '<div class="head">' +
          '<div><div class="office">Interdimensional Patent Office · Division of Unwise Devices</div>' +
          '<h1>Application for Letters Patent</h1></div>' +
          '<div class="no">No. ' + esc(f.no) + '<br>filed ' + esc(f.filed) + '</div>' +
        '</div>' +
        '<div class="body">' +
          '<div class="title-row">' +
            '<div><h2 class="device">' + esc(f.name) + '</h2>' +
            '<div class="classif">' + esc(f.classif) + '</div></div>' +
            schematic(f.seed) +
          '</div>' +
          '<div class="sec"><h3>Abstract</h3><p>' + f.abstractHtml + '</p></div>' +
          '<div class="sec"><h3>Claims</h3><ol class="claims">' +
            f.claims.map(c => '<li>' + esc(c) + '</li>').join('') + '</ol></div>' +
          '<div class="warn"><h3>Side effect · not listed by the applicant</h3><p>' + esc(f.side) + '</p></div>' +
          '<div class="sec"><h3>Prior art cited</h3><ul class="prior">' +
            f.prior.map(c => '<li>' + esc(c) + '</li>').join('') + '</ul></div>' +
          '<div class="sec"><h3>Applicant\'s response to objections</h3><p>' + esc(f.rebuttal) + '</p></div>' +
          '<div class="sec"><h3>Examiner\'s note</h3><p>' + esc(f.note) + '</p></div>' +
        '</div>';
    }
    
    /* ---- the sound ------------------------------------------------------- *
     * A burp, which is a sawtooth dragged downwards through a lowpass with the
     * filter itself wobbling — that wobble is the whole thing, and without it
     * you have a car horn. Short, and quiet enough to be funny once rather
     * than a problem.
     * -------------------------------------------------------------------- */
    function burp(){
      LCSound.play((A) => {
        const dur = .34;
        A.blip(132, { dur, glide: 62, level: A.cap(.075), type: 'sawtooth',
                      filter: 'lowpass', filterFreq: 420, q: 7, reverb: false });
        /* the flutter: three short overlapping copies, detuned */
        [0, .07, .15, .23].forEach((at, i) => {
          A.blip(118 - i * 9, { at, dur: .09, glide: 70, level: A.cap(.045), type: 'square',
                                filter: 'lowpass', filterFreq: 300 + i * 60, q: 5, reverb: false });
        });
        A.burst('brown', { at: .02, freq: 190, q: 1.6, dur: .26, level: A.cap(.03), reverb: false });
      });
    }
    
    $('next').addEventListener('click', () => {
      current = makeFiling(); render();
      const el = $('filing');
      el.classList.remove('slap'); void el.offsetWidth; el.classList.add('slap');
      burp();
    });
    
    $('copy').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(current.name + ' — ' + current.abstractText); }
      catch (e) { window.prompt('Copy:', current.name + ' — ' + current.abstractText); }
    });
    
    current = makeFiling();
    render();
    

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
