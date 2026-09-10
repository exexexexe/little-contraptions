/* ------------------------------------------------------------------ *
 *  Voice: Seed Round.
 *
 *  Was /bad-ideas/. Moved across rather than rewritten: the word lists, the
 *  assembly and the room are the originals. The prose is the toy, and
 *  retyping it is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCGen.voice({
  id: "seedround",
  name: "Seed Round",
  blurb: "A pitch, a valuation, and an associate's note you were not meant to see.",
  page: {
      "--gen-bg": "#15151b",
      "--gen-ink": "#F2EEFF",
      "--gen-body": "ui-sans-serif, system-ui, \"Helvetica Neue\", Arial, sans-serif",
      "--gen-bar": "rgba(0,0,0,.22)",
      "--gen-rule": "rgba(128,128,128,.35)",
      "--gen-field": "rgba(127,127,127,.14)"
  },

  css: `

:root{
  /* A pitch deck at eleven at night: near-black, one hot gradient, and
     everything important glowing slightly more than it has earned. */
  --bg:#08070E;
  --bg-2:#100C1C;
  --slide:#15111F;
  --ink:#F2EEFF;
  --ink-2:#A79CC4;
  --dim:#6E6490;
  --brand:#FF3D8A;
  --brand-2:#31E0C8;
  --rule:#2A2140;
  --sans:ui-sans-serif,system-ui,"Helvetica Neue",Arial,sans-serif;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --display:"Avenir Next","Helvetica Neue",Helvetica,Arial,sans-serif;
}
@keyframes deckin{
  from{ opacity:0;transform:translateY(20px) scale(.985) }
}
/* the valuation ticks up and then, a beat later, the page admits itself */
.metrics b{ font-variant-numeric:tabular-nums }
.flag{ animation:undercut .5s ease .75s backwards }
@keyframes undercut{
  0%{ opacity:0;transform:translateY(-8px) }
  60%{ opacity:1;transform:translateY(2px) }
  100%{ transform:none }
}
.slide.scratched{ animation:scratch .34s ease }
@keyframes scratch{
  0%,100%{ transform:none;filter:none }
  20%{ transform:translateX(-7px) skewX(-1.6deg);filter:saturate(.3) }
  55%{ transform:translateX(5px) skewX(1deg);filter:saturate(.6) }
}
@media (prefers-reduced-motion: reduce){
  .slide,.flag{ animation:none } .slide.scratched{ animation:none }
}
.room{
  background:
    radial-gradient(760px 420px at 78% -6%, rgba(255,61,138,.20), transparent 62%),
    radial-gradient(620px 400px at 12% 104%, rgba(49,224,200,.14), transparent 60%),
    linear-gradient(180deg, var(--bg-2), var(--bg));
  color:var(--ink);font-family:var(--sans);padding:30px 18px 64px;
}
/* a faint grid, because every deck has one */
body::before{
  content:"";position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.35;
  background-image:
    linear-gradient(rgba(167,156,196,.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(167,156,196,.055) 1px, transparent 1px);
  background-size:44px 44px;
}
.wrap, footer{ position:relative;z-index:1 }
.wrap{ max-width:780px;margin:0 auto }
h1{
  font-family:var(--display);font-size:clamp(28px,6.2vw,46px);margin:0;
  letter-spacing:-.025em;font-weight:800;
  background:linear-gradient(96deg,var(--brand) 0%,#B478FF 46%,var(--brand-2) 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent;
}
.sub{ font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);margin-top:8px }

.deck{ display:flex;gap:9px;flex-wrap:wrap;margin:20px 0 22px }
.btn{
  font-family:var(--mono);font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;
  background:var(--brand);color:#fff;border:0;padding:12px 20px;cursor:pointer;font-weight:700;border-radius:3px;
}
.btn:hover{ background:#FF6E54 }
.btn.sec{ background:transparent;color:var(--ink);border:1px solid var(--rule);font-weight:400 }
.btn.sec:hover{ border-color:var(--brand);color:var(--brand) }
.btn:focus-visible{ outline:2px solid var(--brand);outline-offset:3px }

.slide{
  animation:deckin .42s cubic-bezier(.2,.9,.3,1.1) backwards;
  background:var(--slide);border:1px solid var(--rule);border-radius:6px;padding:34px 32px;
  box-shadow:0 18px 50px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.05);
}
.logo{ display:flex;align-items:center;gap:12px;margin-bottom:22px }
.mark{
  width:40px;height:40px;border-radius:9px;flex:0 0 auto;display:grid;place-items:center;
  color:#fff;font-family:var(--display);font-weight:700;font-size:19px;letter-spacing:.02em;
}
.name{ font-family:var(--display);font-size:clamp(26px,5vw,38px);letter-spacing:-.01em;font-weight:700;line-height:1 }
.name em{ font-style:normal;color:var(--brand) }
.but{
  font-size:clamp(17px,3.4vw,23px);line-height:1.4;margin:0 0 20px;color:var(--ink);font-weight:600;
}
.pitch{ font-size:16px;line-height:1.7;color:var(--ink-2);margin:0 0 22px;max-width:60ch }
.but{ color:var(--ink) }

.metrics{
  display:grid;grid-template-columns:repeat(auto-fit,minmax(132px,1fr));gap:1px;
  background:var(--rule);border:1px solid var(--rule);border-radius:4px;overflow:hidden;margin-bottom:20px;
}
.metrics div{ background:#1B1529;padding:14px 15px }
.metrics span{ font-family:var(--mono);font-size:8.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);display:block }
.metrics b{ display:block;font-size:19px;margin-top:6px;letter-spacing:-.02em;color:var(--brand-2);font-variant-numeric:tabular-nums }

.rows{ border-top:1px solid var(--rule);padding-top:18px }
.row{ display:grid;grid-template-columns:130px 1fr;gap:14px;padding:9px 0;align-items:start }
.row dt{ font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);padding-top:3px }
.row dd{ margin:0;font-size:15px;line-height:1.6;color:var(--ink-2) }

.flag{
  margin-top:20px;background:rgba(255,61,138,.10);border-left:3px solid var(--brand);
  padding:12px 15px;font-size:14px;line-height:1.6;color:#FFC2DA;border-radius:0 3px 3px 0;
}
.flag b{ font-family:var(--mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;display:block;margin-bottom:5px;color:var(--brand) }

footer{
  max-width:780px;margin:26px auto 0;padding-top:14px;border-top:1px solid var(--rule);
  font-family:var(--mono);font-size:10.5px;line-height:1.8;color:var(--dim);
}
footer a{ color:var(--ink-2) }

/* --- touch targets (sweep) --- */
@media (pointer:coarse){
  .btn{ min-height:44px }
}

/* A 38px pill is under the 44px a fingertip needs. */
@media (pointer:coarse){ #lc-back{ width:44px;height:44px } }
.room{ padding-bottom:64px }
@media (max-width:520px){ #lc-back{ left:10px;bottom:10px } .row{ grid-template-columns:1fr;gap:4px } }
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

    root.innerHTML = "<div class=\"wrap\">\n  <h1>Seed Round</h1>\n  <div class=\"sub\">pre-revenue \u00b7 pre-product \u00b7 pre-thinking-about-it</div>\n\n  <div class=\"deck\">\n    <button class=\"btn\" id=\"go\">Pitch me something</button>\n    <button class=\"btn sec\" id=\"copy\">Copy the pitch</button>\n  </div>\n\n  <div id=\"out\"></div>\n</div>";

    
    'use strict';
    
    const $ = (id) => document.getElementById(id);
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    const esc = (s) => String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    
    /* Invented company names — vowel-dropped, over-suffixed, the usual. None of
       these are real companies; the generator avoids well-known names by
       construction rather than by blocklist. */
    const STEM = ['Zeph','Lume','Kindr','Orbi','Vaunt','Plink','Murmr','Sable','Tendr','Grava','Nulla',
      'Perch','Wisp','Hark','Quill','Onda','Brim','Solder','Yonder','Fathom','Nimbus','Crumb','Loft',
      'Verge','Halcy','Trellis','Cobalt','Pileus','Mote','Thicket'];
    const SUFF = ['ly','io','r','ify','base','stack','loop','hub','works','labs','co','wise','flow','pilot'];
    
    const NOUN_A = ['Uber','Airbnb','Spotify','Netflix','LinkedIn','Tinder','Duolingo','Slack','Strava','Wikipedia','eBay','Zoom'];
    const NOUN_B = [
      'regret','grudges','unfinished books','other people\'s laundry','the feeling you left the hob on',
      'apologies you owe','half-remembered dreams','your father\'s opinions','things you nearly said',
      'expired warranties','arguments you already lost','unread group chats','the loft',
      'people who owe you money','your own handwriting','plants you have killed','songs stuck in your head',
      'the bin schedule','small talk','borrowed umbrellas','unfinished side projects','your posture',
      'awkward silences','emails you drafted at 2am','the third drawer','other people\'s children',
      'sleep you did not get','the sound of your own voice','decisions made on a Tuesday','minor grievances'];
    
    const PITCHES = [
      'It is a two-sided marketplace. We have not identified either side yet, but the sides are the exciting part.',
      'Think of us as infrastructure. Nobody knows what we do, and that is defensibility.',
      'We are AI-first, which in practice means one model call and a spreadsheet somebody maintains by hand.',
      'The insight is that this is currently free and unstructured, and we intend to fix exactly one of those.',
      'We started as a newsletter. We are now a platform. The newsletter was better and had more readers.',
      'Users hate the current process. Our research shows they will also hate ours, but on their phones.',
      'It is a subscription. Everything is a subscription. The question was never whether.',
      'We take a fifteen per cent cut of something that has never previously involved money.',
      'The wedge is a free tool nobody wants, which we will convert into a paid tool nobody wants.',
      'Community-led growth, meaning we have a Discord with four hundred people and one of them is my brother.',
      'We are pre-revenue by choice. Revenue this early distorts the signal, we have decided.',
      'The moat is that it is extremely annoying to build and we were the only ones stubborn enough.',
    ];
    
    const WHY_NOW = [
      'The infrastructure only became cheap enough eighteen months ago, and nobody has noticed yet.',
      'A regulation changed in a jurisdiction we do not operate in. The direction of travel is clear.',
      'Post-pandemic behaviour has permanently shifted, in ways we will define after the round closes.',
      'Everyone tried this in 2014 and failed. We have studied why and we are going to do it again.',
      'The incumbent has become complacent, by which we mean profitable.',
      'Gen Z do this already, informally, for free. We are here to add friction and a fee.',
    ];
    
    const MODELS = ['freemium, with the free tier deliberately painful','£8 a month, cancellable in theory',
      'take rate on transactions we will have to invent','enterprise, eventually, once we meet an enterprise',
      'usage-based, which nobody can forecast including us','ads, but tasteful, we promise',
      'we have not decided, and the deck says "multiple monetisation levers"'];
    const TEAM = ['two founders, one technical, both tired','three cofounders and an unresolved equity conversation',
      'a solo founder and a very patient partner','ex-big-tech, which we mention early and often',
      'first-time founders with what we are calling founder-market fit','four people, one of whom is an advisor with 0.2%'];
    const ASKS = ['£1.2m on a SAFE, uncapped, do not ask','a £600k pre-seed to reach a metric we will choose later',
      '£2m to hire six people and buy a very large screen','£350k to keep going for eleven more months',
      'strategic capital only — we want the logo more than the money'];
    
    const FLAGS = [
      'The competitor slide lists three companies, two of which are dead and one of which is a feature.',
      'Growth chart has no y-axis. This was not an accident.',
      'The founders describe the market as "at least a billion" and decline to show the arithmetic.',
      'Slide 14 says "and then we expand to Europe", which is the entire international strategy.',
      'The CAC figure is from a two-week experiment with a budget of forty pounds.',
      'They have used the word "obviously" nine times and defended nothing.',
      'The product does not exist but the brand guidelines run to sixteen pages.',
      'They keep saying "when we get to scale" about a problem that only exists at scale.',
    ];
    
    function coName(){
      const n = pick(STEM) + pick(SUFF);
      return n.charAt(0).toUpperCase() + n.slice(1);
    }
    function bigNumber(){
      const n = ri(2, 940);
      const unit = pick(['bn','bn','tn']);
      return '£' + n + unit;
    }
    
    function render(){
      const name = coName();
      const a = pick(NOUN_A), b = pick(NOUN_B);
      const hue = ri(0, 359);
      $('out').innerHTML =
        '<div class="slide">' +
          '<div class="logo">' +
            '<div class="mark" style="background:hsl(' + hue + ' 68% 52%)">' + esc(name[0]) + '</div>' +
            '<div class="name">' + esc(name.slice(0, -2)) + '<em>' + esc(name.slice(-2)) + '</em></div>' +
          '</div>' +
          '<p class="but">' + esc(a) + ', but for ' + esc(b) + '.</p>' +
          '<p class="pitch">' + esc(pick(PITCHES)) + ' ' + esc(pick(PITCHES)) + '</p>' +
          '<div class="metrics">' +
            '<div><span>market size</span><b>' + bigNumber() + '</b></div>' +
            '<div><span>users</span><b>' + ri(0, 40) + '</b></div>' +
            '<div><span>revenue</span><b>£' + ri(0, 400) + '</b></div>' +
            '<div><span>burn</span><b>£' + ri(18, 240) + 'k/mo</b></div>' +
          '</div>' +
          '<dl class="rows">' +
            '<div class="row"><dt>why now</dt><dd>' + esc(pick(WHY_NOW)) + '</dd></div>' +
            '<div class="row"><dt>business model</dt><dd>' + esc(pick(MODELS)) + '</dd></div>' +
            '<div class="row"><dt>team</dt><dd>' + esc(pick(TEAM)) + '</dd></div>' +
            '<div class="row"><dt>the ask</dt><dd>' + esc(pick(ASKS)) + '</dd></div>' +
          '</dl>' +
          '<div class="flag"><b>noted by the associate who read it</b>' + esc(pick(FLAGS)) + '</div>' +
        '</div>';
    }
    
    /* ---- the sounds -------------------------------------------------------- *
     * A till drawer's bright double ding, and then — three quarters of a
     * second later, exactly when the associate's note appears — a record
     * scratch: a noise band swept hard downward with the pitch bending under
     * it. The joke is entirely in the gap between the two.
     * ---------------------------------------------------------------------- */
    function ding(){
      LCSound.play((A) => {
        [0, .055].forEach((at, i) => {
          A.blip(A.note(19 + i * 5), { at, dur: .5, level: A.cap(.07 - i * .015), type: 'sine', reverb: true });
          A.blip(A.note(31 + i * 5), { at, dur: .34, level: A.cap(.035), type: 'sine', reverb: true });
        });
        A.burst('white', { freq: 7200, q: 2, dur: .04, level: A.cap(.03), reverb: true });
      });
    }
    function scratch(){
      LCSound.play((A) => {
        /* two passes of the needle, the second shorter, which is what a
           scratch actually is */
        A.burst('white', { freq: 2600, q: .5, dur: .13, level: A.cap(.075), reverb: false });
        A.blip(520, { dur: .15, glide: 90, level: A.cap(.06), type: 'sawtooth',
                      filter: 'lowpass', filterFreq: 1500, reverb: false });
        A.burst('pink', { at: .15, freq: 1200, q: .6, dur: .1, level: A.cap(.05), reverb: false });
        A.blip(300, { at: .15, dur: .11, glide: 700, level: A.cap(.04), type: 'sawtooth', reverb: false });
      });
    }
    
    function pitch(){
      render();
      ding();
      const el = document.querySelector('.slide');
      setTimeout(() => {
        scratch();
        if (el){ el.classList.remove('scratched'); void el.offsetWidth; el.classList.add('scratched'); }
      }, 750);
    }
    
    $('go').addEventListener('click', pitch);
    
    $('copy').addEventListener('click', async () => {
      const el = document.querySelector('.slide');
      if (!el) return;
      const text = el.innerText.replace(/\n{3,}/g, '\n\n');
      try { await navigator.clipboard.writeText(text); $('copy').textContent = 'Copied'; }
      catch (e) { window.prompt('Copy the pitch:', text); }
      setTimeout(() => { $('copy').textContent = 'Copy the pitch'; }, 1500);
    });
    
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
