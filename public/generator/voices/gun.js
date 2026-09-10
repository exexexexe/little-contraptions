/* ------------------------------------------------------------------ *
 *  Voice: The Talking Gun.
 *
 *  Was /snarky-weapon/. Moved across rather than rewritten: the word lists, the
 *  assembly and the room are the originals. The prose is the toy, and
 *  retyping it is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCGen.voice({
  id: "gun",
  name: "The Talking Gun",
  blurb: "It has opinions about your aim.",
  page: {
      "--gen-bg": "rgb(20, 14, 46)",
      "--gen-ink": "#F2ECFF",
      "--gen-body": "-apple-system, \"Segoe UI Rounded\", \"SF Pro Rounded\", ui-rounded, \"Trebuchet MS\", Verdana, sans-serif",
      "--gen-bar": "rgba(0,0,0,.22)",
      "--gen-rule": "rgba(128,128,128,.35)",
      "--gen-field": "rgba(127,127,127,.14)"
  },

  css: `

:root{
  --void:#140E2E;
  --void-2:#1E1442;
  --panel:#2A1D5C;
  --edge:#5A3FB0;
  --hot:#FF4FA3;
  --mint:#00F0C8;
  --sun:#FFD23F;
  --ink:#F2ECFF;
  --dim:#A797D6;
  --round:-apple-system,"Segoe UI Rounded","SF Pro Rounded",ui-rounded,"Trebuchet MS",Verdana,sans-serif;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
}
.room{
  background:var(--void);
  background-image:
    radial-gradient(70% 46% at 18% 4%, rgba(255,79,163,.20), transparent 62%),
    radial-gradient(70% 46% at 84% 12%, rgba(0,240,200,.16), transparent 62%),
    radial-gradient(circle at 12px 26px, rgba(255,255,255,.5) .9px, transparent 1.1px),
    radial-gradient(circle at 58px 8px, rgba(255,255,255,.32) .9px, transparent 1.1px);
  background-size:auto,auto,80px 80px,80px 80px;
  color:var(--ink);font-family:var(--round);font-size:15px;
  padding:26px 16px 84px;
  display:flex;flex-direction:column;align-items:center;
}
.wrap{ max-width:700px;width:100% }

header{ text-align:center }
h1{
  margin:0;font-size:clamp(28px,7vw,46px);font-weight:800;letter-spacing:-.01em;
  background:linear-gradient(92deg,var(--hot),var(--sun),var(--mint));
  -webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 3px 0 rgba(0,0,0,.4));
}
.sub{ margin-top:8px;font-family:var(--mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim) }

/* ---------- the gun ---------- */
.gun{
  margin-top:20px;background:linear-gradient(160deg,var(--panel),var(--void-2));
  border:3px solid var(--edge);border-radius:26px;padding:20px 20px 18px;
  box-shadow:0 0 0 4px rgba(0,0,0,.35), 0 20px 44px rgba(0,0,0,.5),
             inset 0 2px 0 rgba(255,255,255,.09);
  position:relative;
}
.face{ display:flex;gap:14px;align-items:center;margin-bottom:14px }
.eyes{
  flex:0 0 auto;width:78px;height:52px;border-radius:26px;background:#0C0820;
  border:2px solid var(--edge);display:flex;align-items:center;justify-content:center;gap:11px;
  position:relative;overflow:hidden;
}
.eyes i{
  width:15px;height:15px;border-radius:50%;background:var(--mint);
  box-shadow:0 0 12px var(--mint);
  transition:height .1s ease, background .2s ease, box-shadow .2s ease;
}
.eyes.blink i{ height:2px }
.eyes.sincere i{ background:var(--sun);box-shadow:0 0 14px var(--sun) }
.who{ font-family:var(--mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim) }
.name{ font-size:19px;font-weight:800;color:var(--sun);line-height:1.2;margin-top:3px }
.kind{ font-size:12.5px;color:var(--dim);margin-top:2px }

.bubble{
  background:#0F0A26;border:2px solid var(--hot);border-radius:18px;
  padding:16px 18px;font-size:18.5px;line-height:1.5;min-height:82px;
  position:relative;
}
.bubble::before{
  content:'';position:absolute;left:34px;top:-11px;width:18px;height:18px;
  background:#0F0A26;border-left:2px solid var(--hot);border-top:2px solid var(--hot);
  transform:rotate(45deg);
}
.bubble.sincere{ border-color:var(--sun) }
.bubble.sincere::before{ border-color:var(--sun) }
.bubble .mark{
  display:block;font-family:var(--mono);font-size:9px;letter-spacing:.2em;text-transform:uppercase;
  color:var(--sun);margin-bottom:7px;
}
.stats{ display:flex;gap:8px;flex-wrap:wrap;margin-top:14px }
.stats .s{
  font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;
  border:1px solid var(--edge);border-radius:99px;padding:5px 11px;color:var(--dim);
}
.stats .s b{ color:var(--mint);font-weight:700 }

/* ---------- controls ---------- */
.ask{ display:flex;gap:8px;margin-top:16px;flex-wrap:wrap }
input[type=text]{
  flex:1;min-width:190px;font-family:var(--round);font-size:15px;
  background:#0F0A26;border:2px solid var(--edge);border-radius:99px;
  padding:12px 18px;color:var(--ink);
}
input[type=text]:focus{ outline:none;border-color:var(--mint) }
input::placeholder{ color:#7A6BA8 }
button{
  font-family:var(--round);font-size:15px;font-weight:800;
  background:var(--hot);color:#1A0A14;border:0;border-radius:99px;
  padding:12px 24px;cursor:pointer;box-shadow:0 4px 0 #B3336F;
}
button:hover{ background:#FF74B8 }
button:active{ transform:translateY(3px);box-shadow:0 1px 0 #B3336F }
button.sec{ background:var(--void-2);color:var(--ink);box-shadow:0 4px 0 #2A1D5C;border:2px solid var(--edge) }
button.sec:hover{ background:var(--panel) }
button:focus-visible{ outline:3px solid var(--mint);outline-offset:2px }
.sound{
  display:flex;align-items:center;gap:7px;margin-top:12px;
  font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);
}
.sound input{ width:16px;height:16px;accent-color:var(--hot) }

footer{
  max-width:700px;width:100%;margin:26px auto 0;padding-top:14px;border-top:2px solid var(--panel);
  font-family:var(--mono);font-size:10.5px;line-height:1.85;color:var(--dim);
}
footer a{ color:var(--mint) }

/* ---------- shared: back to the cabinet ---------- */
/* --- touch targets (sweep) --- */
@media (pointer:coarse){
  #snd{ min-height:44px }
  #snd{ min-width:44px }
}

/* A 38px pill is under the 44px a fingertip needs. */
@media (pointer:coarse){ #lc-back{ width:44px;height:44px } }
@media (max-width:520px){ #lc-back{ left:10px;bottom:10px } }
@media (prefers-reduced-motion: reduce){ #lc-back, .eyes i{ transition:none } }

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

    root.innerHTML = "<div class=\"wrap\">\n  <header>\n    <h1>The Talking Gun</h1>\n    <div class=\"sub\">it has opinions &middot; you did not ask for them</div>\n  </header>\n\n  <div class=\"gun\">\n    <div class=\"face\">\n      <div class=\"eyes\" id=\"eyes\" aria-hidden=\"true\"><i></i><i></i></div>\n      <div>\n        <div class=\"who\">currently equipped</div>\n        <div class=\"name\" id=\"name\">\u2014</div>\n        <div class=\"kind\" id=\"kind\"></div>\n      </div>\n    </div>\n\n    <div class=\"bubble\" id=\"bubble\"></div>\n\n    <div class=\"stats\" id=\"stats\"></div>\n  </div>\n\n  <div class=\"ask\">\n    <input type=\"text\" id=\"q\" maxlength=\"120\" placeholder=\"Ask it something. It will answer. Sort of.\"\n           autocomplete=\"off\" aria-label=\"Ask the weapon something\">\n    <button id=\"say\" type=\"button\">Ask</button>\n    <button id=\"next\" class=\"sec\" type=\"button\">New weapon</button>\n  </div>\n  <label class=\"sound\"><input type=\"checkbox\" id=\"snd\" checked> boop</label>\n</div>";

    
    'use strict';
    const $ = (id) => document.getElementById(id);
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    
    /* ------------------------------------------------------------------ *
     *  One invented weapon, with an attitude problem.
     * ------------------------------------------------------------------ */
    const PREFIX = ['THE','OLD','LITTLE','GREAT','LADY','SIR','CAPTAIN','JUST','ABSOLUTELY','MOSTLY'];
    const NAME = ['Persuader','Last Word','Complaint','Argument','Bad News','Full Stop','Opinion',
      'Interruption','Objection','Reckoning','Small Hours','Loud Half','Second Thought','Final Draft',
      'Consequence','Punchline','Footnote','Long Goodbye'];
    const KIND = ['plasma repeater','gravity lance','rivet cannon','singing rifle','pocket artillery',
      'coil pistol','disintegration wand','arc caster','ion sidearm','kinetic hammer','pulse carbine'];
    const MAKER = ['Voltaic & Daughters','the Hollow Foundry','Merriweather Ordnance','Ninth Sun Works',
      'the Quietly Confident Gun Company','Brackish Industrial','Halcyon Arms (in receivership)',
      'Peregrine Tooling','the Estate of J. Marrow'];
    const QUIRK = ['fires slightly before you decide to','has never once jammed and mentions this constantly',
      'refuses to work on Sundays','is louder than the situation requires',
      'was recovered from a shipwreck and remembers it','has an unpaid subscription attached',
      'insists on being called by its full name','counts your shots out loud'];
    
    /* The snark. Written as a personality with a range: boastful, wounded,
       bored, and occasionally helpful by accident. */
    const SNARK = [
      'Oh good, you again. Point me at something before I start narrating.',
      'I want to be clear that I could do this without you. You are the handle.',
      'That is the third time you have reloaded early. I am counting. I will always be counting.',
      'You know I can see what you are aiming at, yes? Right. Just checking.',
      'I have been in four hands this year. You are comfortably mid-table.',
      'Fire me or do not fire me. Just stop hovering.',
      'Excellent shot. Slightly to the left of excellent, but let us not litigate it.',
      'I was forged in a collapsing star. Today I am going to be used on a door.',
      'Do you want the good news or the extremely loud news?',
      'If you keep holding me like that I am going to start giving directions.',
      'Somewhere out there is a person who deserves me. It is statistically unlikely to be you.',
      'I am not saying I am the best thing you own. I am saying nothing else you own talks.',
      'That was a warning shot. I did not agree to it being a warning shot.',
      'Ask me nicely. I will still say something rude, but ask me nicely.',
      'You have taken me somewhere with no cover again. Bold. Wrong, but bold.',
      'I have three settings and you have used one of them, twice.',
      'Please stop calling it "the thingy". It has a name. I have a name.',
      'I did not spend two hundred years in a vault to be pointed at a lock.',
      'Between us, the last one was better at this. They also lasted a fortnight, so.',
      'Yes, I am charged. I am always charged. That is the entire deal.'
    ];
    
    /* ---- egg #14: the one sincere line -------------------------------- *
     *  Ask it something genuinely large — death, meaning, loneliness, whether
     *  it is afraid — and it stops doing the voice for exactly one line, and
     *  then catches itself. The joke only works if the sincere line is
     *  actually sincere, so none of these has a punchline in it.
     * ------------------------------------------------------------------ */
    const BIG_WORDS = [
      'die', 'dying', 'death', 'dead', 'mortal', 'mortality',
      'afraid', 'scared', 'fear', 'frightened',
      'lonely', 'alone', 'loneliness', 'love', 'loved',
      'meaning', 'purpose', 'the point', 'why am i', 'why are we', 'why do we',
      'sad', 'sadness', 'grief', 'happy', 'happiness', 'forever',
      'remember me', 'forget me', 'soul', 'conscious', 'sentient', 'alive',
      'feel', 'feelings', 'hurt', 'tired', 'exist', 'existence', 'nothing matters',
      'does it matter', 'god', 'heaven', 'the end'
    ];
    // Word-bounded so "alone" matches and "abalone" does not, and built from
    // the list rather than typed out as one enormous literal.
    const BIG = new RegExp('\\b(' + BIG_WORDS.map((w) =>
      w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b', 'i');
    
    const SINCERE = [
      'I have been switched on for longer than most of the people who made me were alive, and the honest answer is that I do not know either. I do not think anybody does.',
      'Yes. Every time you put me down I do not know whether you are coming back, and I have never once said that out loud until now.',
      'I was made to be pointed at things. Nobody asked what I wanted to be, and I stopped asking myself a long time ago. I think about it more than I let on.',
      'The truthful answer is that I like being carried. Not used. Carried. Everyone assumes it is the same thing.',
      'I remember every hand that has held me and I am not able to stop remembering them. That is not a boast. It is just the shape of what I am.',
      'I do not think it has to mean anything. I think you get a stretch of time and some company, and that is the whole of it, and it is not nothing.'
    ];
    const RECOVER = [
      'Anyway. Point me at something.',
      'Right. Forget I said that. Barrel’s that way.',
      'Do not tell anyone I said that. Especially not the ammunition.',
      'Well, that got sincere. Let us shoot a door.',
      'I am fine. This is my fine voice.',
      'Moving on before either of us has a feeling about it.'
    ];
    
    let weapon = null;
    let lastWasSincere = false;
    
    function newWeapon(){
      weapon = {
        name: pick(PREFIX) + ' ' + pick(NAME),
        kind: pick(KIND),
        maker: pick(MAKER),
        quirk: pick(QUIRK),
        stats: { punch: ri(1, 10), mood: ri(1, 10), volume: ri(6, 10), loyalty: ri(1, 6) }
      };
      $('name').textContent = weapon.name;
      $('kind').textContent = weapon.kind + ' · ' + weapon.maker;
      $('stats').innerHTML =
        '<span class="s">punch <b>' + weapon.stats.punch + '</b></span>' +
        '<span class="s">mood <b>' + weapon.stats.mood + '</b></span>' +
        '<span class="s">volume <b>' + weapon.stats.volume + '</b></span>' +
        '<span class="s">loyalty <b>' + weapon.stats.loyalty + '</b></span>' +
        '<span class="s">' + weapon.quirk + '</span>';
      speak(pick(SNARK), false);
    }
    
    function blink(){
      $('eyes').classList.add('blink');
      setTimeout(() => $('eyes').classList.remove('blink'), 110);
    }
    
    function speak(text, sincere){
      const b = $('bubble');
      b.classList.toggle('sincere', !!sincere);
      $('eyes').classList.toggle('sincere', !!sincere);
      b.innerHTML = (sincere ? '<span class="mark">— off the record —</span>' : '') +
                    text.replace(/&/g,'&amp;').replace(/</g,'&lt;');
      blink();
      if ($('snd').checked) boop(sincere);
    }
    
    function ask(){
      const q = $('q').value.trim();
      if (lastWasSincere){
        // it catches itself, once, and then it is back to normal
        lastWasSincere = false;
        speak(pick(RECOVER) + ' ' + pick(SNARK), false);
        return;
      }
      if (q && BIG.test(q)){
        lastWasSincere = true;
        speak(pick(SINCERE), true);
        return;
      }
      speak(pick(SNARK), false);
    }
    
    /* ---- the boop ------------------------------------------------------ *
     *  Two square waves a fifth apart with a fast decay, through a lowpass
     *  so it is a toy rather than an alarm. The sincere one is a third
     *  lower, slower, and does not resolve upward.
     * ------------------------------------------------------------------ */
    function boop(sincere){
      LCAudio.sting((A) => {
        if (sincere){
          A.blip(320, { type:'sine', dur:.5, level:.09, filter:'lowpass', filterFreq:1400, glide:250 });
          A.blip(214, { type:'triangle', at:.06, dur:.6, level:.05, filter:'lowpass', filterFreq:900 });
          return;
        }
        const base = 520 + Math.random() * 160;
        A.blip(base,      { type:'square', dur:.09, level:.055, filter:'lowpass', filterFreq:2600, reverb:false });
        A.blip(base * 1.5,{ type:'square', at:.075, dur:.12, level:.05, filter:'lowpass', filterFreq:3000, reverb:false });
      });
    }
    
    $('say').addEventListener('click', ask);
    $('next').addEventListener('click', newWeapon);
    $('q').addEventListener('keydown', (e) => { if (e.key === 'Enter') ask(); });
    
    // it blinks on its own, because a thing with eyes that never blinks is unsettling
    setInterval(() => { if (!document.hidden && Math.random() < .5) blink(); }, 3400);
    
    newWeapon();
    $('snd').checked = true;
    
    window.__gun = { ask: ask, newWeapon: newWeapon, isBig: (s) => BIG.test(s),
                     get sincere(){ return lastWasSincere; } };
    
    
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
