/* ------------------------------------------------------------------ *
 *  Voice: Five Ways To Say It.
 *
 *  Was /shanty-ifier/. Moved across rather than rewritten: the word lists, the
 *  assembly and the room are the originals. The prose is the toy, and
 *  retyping it is how a merge quietly loses things.
 * ------------------------------------------------------------------ */
LCGen.voice({
  id: "shanty",
  name: "Five Ways To Say It",
  blurb: "The same sentence, below decks.",
  page: {
      "--gen-bg": "#1D343D",
      "--gen-ink": "rgb(234, 241, 242)",
      "--gen-body": "Optima, \"Gill Sans\", \"Gill Sans MT\", Candara, \"Trebuchet MS\", sans-serif",
      "--gen-bar": "rgba(0,0,0,.22)",
      "--gen-rule": "rgba(128,128,128,.35)",
      "--gen-field": "rgba(127,127,127,.14)"
  },

  css: `

:root{
  --sea:#0F1E24;
  --sea-2:#173039;
  --panel:#1D343D;
  --edge:rgba(95,180,196,.22);
  --foam:#EAF1F2;
  --teal:#5FB4C4;
  --brass:#E5B15E;
  --dim:#88A3AB;
  --serif:Optima,"Gill Sans","Gill Sans MT",Candara,"Trebuchet MS",sans-serif;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --disp:"Avenir Next Condensed","Roboto Condensed","Arial Narrow",var(--serif);
}
/* the swell: the whole page rises and falls, very slightly, on a long
   period — enough to feel and not enough to notice */
.room{ animation:swell 11s ease-in-out infinite }
@keyframes swell{ 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(4px) } }
@media (prefers-reduced-motion: reduce){ body{ animation:none } }
/* Below deck: planking running fore and aft, caulked seams between the
   boards, and one lamp swinging somewhere off to port. */
.room{
  background:
    radial-gradient(520px 340px at 22% -4%, rgba(255,222,160,.10), transparent 64%),
    repeating-linear-gradient(90deg,
      rgba(0,0,0,.34) 0 3px,
      rgba(255,255,255,.028) 3px 5px,
      transparent 5px 84px),
    repeating-linear-gradient(90deg, rgba(0,0,0,.10) 0 1px, transparent 1px 11px),
    linear-gradient(180deg,#33362E 0%,#232821 46%,#161A16 100%);
  color:var(--foam);font-family:var(--serif);
  padding:34px 18px 78px;display:flex;flex-direction:column;align-items:center;
}
/* a rope, coiled and lying across one corner */
body::before{
  content:"";position:fixed;right:0;bottom:0;width:210px;height:210px;z-index:0;
  border:14px solid rgba(196,168,116,.13);border-radius:50%;pointer-events:none;
  box-shadow:inset 0 0 0 13px rgba(196,168,116,.08), inset 0 0 0 27px rgba(196,168,116,.05);
  /* faded into the corner instead of hanging over the edge, which was
     adding to the scroll width */
  -webkit-mask-image:radial-gradient(circle at 100% 100%, #000 40%, transparent 78%);
          mask-image:radial-gradient(circle at 100% 100%, #000 40%, transparent 78%);
}
.wrap, footer{ position:relative;z-index:1 }
.wrap{ max-width:660px;width:100% }
header{ text-align:center }
h1{
  font-family:var(--disp);font-size:clamp(25px,5.6vw,38px);margin:0;
  letter-spacing:.14em;text-transform:uppercase;color:var(--teal);font-weight:700;
}
.sub{ font-family:var(--mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;opacity:.55;margin-top:9px }

.ask{ margin-top:24px }
.ask label{
  display:block;font-family:var(--mono);font-size:9.5px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--teal);margin-bottom:8px;
}
.ask textarea{
  width:100%;min-height:84px;resize:vertical;
  background:var(--panel);border:1px solid var(--edge);border-radius:3px;
  color:var(--foam);font-family:var(--serif);font-size:16.5px;line-height:1.6;padding:14px 15px;
}
.ask textarea:focus{ outline:2px solid var(--teal);outline-offset:-1px }
.row{ display:flex;gap:9px;margin-top:11px;flex-wrap:wrap }
.row button{
  font-family:var(--mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;
  border-radius:2px;padding:11px 18px;cursor:pointer;border:1px solid var(--edge);
  background:transparent;color:var(--foam);
}
.row button.go{ background:var(--brass);border-color:var(--brass);color:#20160A;font-weight:700;flex:1 1 auto }
.row button:hover{ filter:brightness(1.08) }
.row button:not(.go):hover{ border-color:var(--teal);color:var(--teal) }
.row button:focus-visible{ outline:2px solid var(--teal);outline-offset:2px }

.verses{ margin-top:26px;display:grid;gap:16px }
.verse{
  background:var(--panel);border:1px solid var(--edge);border-radius:3px;
  padding:20px 20px 18px;position:relative;
}
.verse::before{ content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--brass) }
.verse .head{ display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:13px }
.verse h2{
  font-family:var(--disp);font-size:18px;letter-spacing:.13em;text-transform:uppercase;
  margin:0;color:var(--brass);font-weight:700;
}
.verse .note{ font-family:var(--mono);font-size:9px;letter-spacing:.11em;text-transform:uppercase;color:var(--dim);text-align:right }
.verse .lines{ font-size:16px;line-height:1.78;color:#DCE7E9 }
.verse .lines .r{ padding-left:24px;color:var(--teal);font-style:italic }
.verse .copy{
  margin-top:13px;font-family:var(--mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;
  background:transparent;color:var(--dim);border:1px solid var(--edge);border-radius:2px;
  padding:6px 11px;cursor:pointer;
}
.verse .copy:hover{ border-color:var(--teal);color:var(--teal) }
.verse .copy:focus-visible{ outline:2px solid var(--brass);outline-offset:2px }

footer{
  max-width:660px;margin:28px auto 0;padding-top:14px;border-top:1px solid var(--edge);
  font-family:var(--mono);font-size:10.5px;line-height:1.8;color:var(--dim);
}
footer a{ color:var(--teal) }

/* --- touch targets (sweep) --- */
@media (pointer:coarse){
  #again, #lucky, .copy, .go{ min-height:44px }
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

    root.innerHTML = "<div class=\"wrap\">\n  <header>\n    <h1>Five Ways To Say It</h1>\n    <div class=\"sub\">one ordinary day &middot; five registers that will not shut up</div>\n  </header>\n\n  <div class=\"ask\">\n    <label for=\"in\">What happened today?</label>\n    <textarea id=\"in\" spellcheck=\"false\"\n      placeholder=\"I spent four hours arguing with the printer and then walked home in the rain.\"></textarea>\n    <div class=\"row\">\n      <button class=\"go\" id=\"go\" type=\"button\">Set it to verse</button>\n      <button id=\"again\" type=\"button\">Different wording</button>\n      <button id=\"lucky\" type=\"button\">Give me a day</button>\n    </div>\n  </div>\n\n  <div class=\"verses\" id=\"out\"></div>\n</div>";

    
    'use strict';
    const $ = (id) => document.getElementById(id);
    
    const DAYS = [
      'I spent four hours arguing with the printer and then walked home in the rain.',
      'My cat knocked a glass of water onto the laptop.',
      'I queued for forty minutes at the post office for one stamp.',
      'The boiler broke and I waited all afternoon for a man who never came.',
      'I cooked a whole dinner and burned the onions at the last minute.',
      'I missed the train by nine seconds and watched it leave.',
      'I finally fixed the shed door and it fell off again by evening.',
      'I carried a bookcase up three flights of stairs on my own.'
    ];
    
    let salt = 1;
    
    function render(){
      const text = $('in').value.trim();
      if (!text){
        $('out').innerHTML = '';
        return;
      }
      const verses = makeVerses(text, salt);
      $('out').innerHTML = verses.map(function(v){
        // The shanty's response lines are the ones that repeat; setting them
        // in from the margin is how a songbook would print them.
        const seen = {};
        v.lines.forEach(function(l){ seen[l] = (seen[l] || 0) + 1; });
        const body = v.lines.map(function(l){
          return '<div class="' + (seen[l] > 1 ? 'r' : '') + '">' + l + '</div>';
        }).join('');
        return '<div class="verse"><div class="head"><h2>' + v.name + '</h2>' +
               '<div class="note">' + v.note + '</div></div>' +
               '<div class="lines" data-id="' + v.id + '">' + body + '</div>' +
               '<button class="copy" type="button" data-for="' + v.id + '">Copy</button></div>';
      }).join('');
    
      $('out').querySelectorAll('.copy').forEach(function(b){
        b.addEventListener('click', async function(){
          const box = $('out').querySelector('[data-id="' + b.dataset.for + '"]');
          const txt = [...box.children].map((d) => d.textContent).join('\n');
          const was = b.textContent;
          try { await navigator.clipboard.writeText(txt); b.textContent = 'Copied'; }
          catch (e) { b.textContent = 'Could not copy'; }
          setTimeout(function(){ b.textContent = was; }, 1500);
        });
      });
    }
    
    /* ---- the sound: a squeezebox chord --------------------------------- *
     * Four reeds pushed at once, slightly out of tune with each other, with
     * the breath of the bellows underneath. The detuning is what makes it a
     * concertina rather than an organ.
     * ------------------------------------------------------------------- */
    function squeeze(){
      LCSound.play(function(A){
        [-12, 0, 4, 7].forEach(function(semi, i){
          A.blip(A.note(semi) * (1 + (i - 1.5) * 0.0035), {
            dur: .78, level: A.cap(.042), type: 'sawtooth',
            filter: 'lowpass', filterFreq: 1700, attack: .04, reverb: true
          });
        });
        A.burst('pink', { freq: 500, q: .7, dur: .5, level: A.cap(.018), attack: .12, reverb: true });
      });
    }
    
    $('go').addEventListener('click', function(){ salt++; render(); squeeze(); });
    $('again').addEventListener('click', function(){ salt++; render(); squeeze(); });
    $('lucky').addEventListener('click', function(){
      $('in').value = DAYS[Math.floor(Math.random() * DAYS.length)];
      salt++; render();
    });
    $('in').addEventListener('keydown', function(e){
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)){ e.preventDefault(); salt++; render(); }
    });
    
    $('in').value = DAYS[0];
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
