/* ------------------------------------------------------------------ *
 *  Voice: The Escalating Excuse.
 *
 *  Was /excuses/. The six situations, their six tiers each, the
 *  believability table and the nervous laugh are the originals, moved
 *  across rather than rewritten — the prose is the toy and retyping it
 *  is how a merge quietly loses things.
 *
 *  The room comes with it: ruled paper gone slightly yellow, biro-blue
 *  ink, and every word trembling on its own clock, harder the further
 *  out on the limb you are.
 * ------------------------------------------------------------------ */
LCGen.voice({
  id: 'excuse',
  name: 'The Escalating Excuse',
  blurb: 'It starts reasonable. It does not stay that way.',

  /* what the page outside the room takes from this voice */
  page: {
    '--gen-bg': '#F6F0DE', '--gen-ink': '#22304E',
    '--gen-body': '"Bradley Hand","Segoe Print","Chalkboard SE","Comic Sans MS",ui-sans-serif,system-ui,sans-serif',
    '--gen-bar': 'rgba(235,226,200,.86)', '--gen-rule': '#DED3B4',
    '--gen-field': 'rgba(255,255,255,.72)'
  },

  css: `
:root{
  /* A note written in a hurry on the back of something. Everything is a
     shade too warm and a shade too anxious: the paper has gone slightly
     yellow, the ink is biro-blue rather than black, and the accent is the
     colour of a correction you have made three times. */
  --paper:#F6F0DE;
  --paper-2:#EBE2C8;
  --ink:#22304E;
  --ink-2:#4A5A78;
  --dim:#948C74;
  --red:#B8442E;
  --rule:#DED3B4;
  --sans:ui-sans-serif,system-ui,"Helvetica Neue",Arial,sans-serif;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --serif:"Bradley Hand","Segoe Print","Chalkboard SE","Comic Sans MS",var(--sans);
  --display:"Bradley Hand","Segoe Print","Chalkboard SE","Comic Sans MS",var(--sans);
}
.room{
  background:var(--paper);color:var(--ink);font-family:var(--serif);padding:30px 18px 64px;
  background-image:
    repeating-linear-gradient(180deg, transparent 0 26px, rgba(120,140,180,.10) 26px 27px),
    radial-gradient(circle at 82% 8%, rgba(184,68,46,.055), transparent 46%);
}
.wrap{ max-width:700px;margin:0 auto }
h1{ font-family:var(--display);font-size:clamp(27px,5.8vw,42px);margin:0;letter-spacing:.01em;font-weight:700;transform:rotate(-.7deg) }
.sub{ font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);margin-top:8px }

.pick{ display:flex;gap:7px;flex-wrap:wrap;margin:20px 0 18px }
.pick button{
  font-family:var(--mono);font-size:11px;background:transparent;border:1px solid var(--rule);
  color:var(--ink-2);padding:9px 13px;cursor:pointer;border-radius:2px;
}
.pick button[aria-pressed="true"]{ background:var(--ink);color:var(--paper);border-color:var(--ink);font-weight:700 }
.pick button:hover{ border-color:var(--red);color:var(--red) }
.pick button[aria-pressed="true"]:hover{ color:var(--paper) }

.sheet{
  background:#FFFDF4;border:1px solid var(--rule);border-radius:2px;padding:24px;
  box-shadow:0 10px 30px rgba(90,80,50,.10);
  transform:rotate(.35deg);
  transition:transform .3s ease;
}
.sheet.flinch{ animation:flinch .4s ease }
@keyframes flinch{
  0%{ transform:rotate(.35deg) }
  30%{ transform:rotate(-.9deg) translateX(-3px) }
  60%{ transform:rotate(1.1deg) translateX(2px) }
  100%{ transform:rotate(.35deg) }
}
@media (prefers-reduced-motion: reduce){ .sheet.flinch{ animation:none } }
.gauge{ display:flex;align-items:center;gap:10px;margin-bottom:18px }
.gauge .bar{ flex:1;height:6px;background:var(--paper-2);border-radius:3px;overflow:hidden }
.gauge .bar i{ display:block;height:100%;background:linear-gradient(90deg,#7BA05B,#D9A441,var(--red));transition:width .35s ease }
.gauge .lv{
  font-family:var(--mono);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);
  white-space:nowrap;
}
.gauge .lv b{ color:var(--red) }

.ex{ font-family:var(--serif);font-size:clamp(19px,3.8vw,26px);line-height:1.55;margin:0 }
/* Each word is its own element so it can tremble on its own clock. The
   amplitude comes from the level: level one barely moves, level six is
   visibly coming apart. */
.ex .w{ display:inline-block;white-space:pre;animation:jitter var(--sp,2.6s) infinite }
.ex .w.in{ animation:arrive .34s cubic-bezier(.2,.9,.3,1.4) backwards, jitter var(--sp,2.6s) .34s infinite }
@keyframes jitter{
  0%,100%{ transform:translate(0,0) rotate(0) }
  20%{ transform:translate(calc(var(--a,.4px) * 1), calc(var(--a,.4px) * -.7)) rotate(calc(var(--r,.2deg) * 1)) }
  45%{ transform:translate(calc(var(--a,.4px) * -.8), calc(var(--a,.4px) * .6)) rotate(calc(var(--r,.2deg) * -1)) }
  70%{ transform:translate(calc(var(--a,.4px) * .5), calc(var(--a,.4px) * .9)) rotate(calc(var(--r,.2deg) * .6)) }
}
@keyframes arrive{
  from{ opacity:0;transform:translateY(6px) rotate(2deg) }
  to{ opacity:1 }
}
.ex .why .w{ animation-duration:calc(var(--sp,2.6s) * 1.5) }
@media (prefers-reduced-motion: reduce){
  .ex .w, .ex .w.in{ animation:none }
}
.ex .why{ display:block;margin-top:14px;font-size:.72em;color:var(--ink-2);font-style:italic }

.plaus{
  margin-top:20px;padding-top:14px;border-top:1px solid var(--rule);
  display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;
  font-family:var(--mono);font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--dim);
}
.plaus b{ color:var(--ink);font-weight:700 }

.deck{ display:flex;gap:9px;flex-wrap:wrap;margin-top:18px }
.btn{
  font-family:var(--mono);font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;
  background:var(--red);color:#fff;border:0;padding:12px 18px;cursor:pointer;font-weight:700;border-radius:2px;
}
.btn:hover{ background:#D6564A }
.btn[disabled]{ opacity:.35;cursor:default }
.btn.sec{ background:transparent;color:var(--ink);border:1px solid var(--rule);font-weight:400 }
.btn.sec:hover{ border-color:var(--red);color:var(--red) }
.btn:focus-visible{ outline:2px solid var(--red);outline-offset:3px }

.log{ margin-top:22px;border-top:1px solid var(--rule);padding-top:15px }
.log h2{ font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--dim);font-weight:400;margin:0 0 11px }
.log ol{ margin:0;padding-left:20px }
.log li{ font-size:14px;line-height:1.6;color:var(--ink-2);margin-bottom:7px }

footer{
  max-width:700px;margin:26px auto 0;padding-top:14px;border-top:1px solid var(--rule);
  font-family:var(--mono);font-size:10.5px;line-height:1.8;color:var(--dim);
}
footer a{ color:var(--ink-2) }

/* --- touch targets --- */
@media (pointer:coarse){
  .pick button, .btn{ min-height:44px;padding-top:0;padding-bottom:0 }
}

/* A 38px pill is under the 44px a fingertip needs. */
@media (pointer:coarse){ #lc-back{ width:44px;height:44px } }
body{ padding-bottom:64px }
@media (max-width:520px){ #lc-back{ left:10px;bottom:10px } }
@media print{ #lc-back{ display:none } }
@media (prefers-reduced-motion: reduce){ #lc-back, .gauge .bar i{ transition:none } }
`,

  mount: function (root) {
    'use strict';

    const LEVELS = ['plausible','a bit thin','stretching it','openly suspicious','physically impossible','cosmological'];
    const BELIEVE = ['84%','61%','38%','17%','4%','0%'];
    const PRESSED = ['hold firm','add a detail','change the subject','produce a receipt','leave the country','admit nothing'];
    
    /* ------------------------------------------------------------------ *
     *  Six situations, six escalating tiers each. Tier 1 is something a
     *  person might actually say; tier 6 is not. The step between them is
     *  the joke, so each tier is written to be a believable escalation of
     *  the one before rather than a random absurdity.
     * ------------------------------------------------------------------ */
    const SITUATIONS = [
      { k:'late', label:'I am late',
        tiers:[
          ['The train was held at a signal.', 'Everyone was late. Ask anyone.'],
          ['There was a bag on the line and they had to stop for it.', 'It was a very large bag.'],
          ['A swan got onto the platform and would not be reasoned with.', 'Staff were involved. It took a while.'],
          ['I was briefly deputised by a man in a high-visibility jacket who I now believe worked for nobody.', 'I directed traffic for eleven minutes out of politeness.'],
          ['Time moved differently in the underpass. I went in at eight and came out at nine, having aged four minutes.', 'I have raised this with the council.'],
          ['I left on time. The building moved. I have the surveying data and I am prepared to walk you through it.', 'Everything else in the city is where it was. It is only this building.'],
        ] },
      { k:'code', label:'the code is not done',
        tiers:[
          ['It is done, it just needs testing.', 'The tests are the last bit. They always are.'],
          ['There was an edge case nobody had thought about, and now everybody has.', 'It is a good edge case, in fairness.'],
          ['The library we depend on shipped a change on Friday and did not tell anyone what it was.', 'I have read their commit history. It did not help.'],
          ['It works on my machine, and my machine has begun refusing to explain how.', 'I am no longer confident my machine is on our side.'],
          ['The bug only occurs on Tuesdays, only in the office, and only when I am watching. I have hired somebody else to watch.', 'It behaves perfectly for them. It is personal.'],
          ['The code is finished in a branch that exists, that I can see, and that the server denies all knowledge of.', 'I have the hash. The hash resolves to nothing. I would like to move on.'],
        ] },
      { k:'dishes', label:'the dishes are not washed',
        tiers:[
          ['I was going to do them after this.', 'They are soaking. Soaking is a stage.'],
          ['The good sponge has gone missing and the other one is a punishment.', 'I refuse to work under those conditions.'],
          ['The hot water ran out halfway through and I made a judgment call.', 'Half-washed is arguably worse. I stopped for the greater good.'],
          ['There is something at the bottom of the pan and I have decided it needs more time.', 'It is not mould. It is more of a project.'],
          ['I loaded the dishwasher and it has begun making decisions I was not consulted on.', 'It runs when it likes now. We have an arrangement.'],
          ['Doing them would reset a small ecosystem that has, over four days, achieved a kind of balance.', 'There is a food chain. I am not going to be the one to end it.'],
        ] },
      { k:'reply', label:'I never replied',
        tiers:[
          ['It went to the other inbox.', 'The one I check on Thursdays.'],
          ['I read it on my phone, mentally replied in full, and closed the app.', 'The reply was excellent. You would have liked it.'],
          ['I started a reply, deleted it for being too long, and then never wrote the short one.', 'The long one was three pages. You dodged it.'],
          ['Your message arrived in a week I have since agreed to describe as "the incident".', 'Nobody got a reply that week. You are not special, which should be a comfort.'],
          ['My email client marked it as read on its own initiative. I have never touched it.', 'It has done this eleven times and only to people I like.'],
          ['I replied. The reply exists. It is currently somewhere between two servers and has been for six weeks.', 'I have written to the provider. They have not replied either, which I think proves my point.'],
        ] },
      { k:'plans', label:'I cancelled again',
        tiers:[
          ['Something came up.', 'The usual sort of something.'],
          ['I said yes on a Tuesday for a Saturday, and Tuesday me does not consult Saturday me.', 'They have never met. It shows.'],
          ['I got home, sat down for one minute, and the chair claimed me.', 'I have been sat down for two hours. I am still sat down.'],
          ['I have been double-booked by myself, twice, in a way that suggests a system problem.', 'The system is me. I am aware.'],
          ['I left the house, got two streets away, remembered nothing specific, and came home anyway.', 'It was the right call. I could not tell you why.'],
          ['I attended in spirit and the spirit reports that it was lovely and that I was missed.', 'The spirit takes very good notes. I can forward them.'],
        ] },
      { k:'gym', label:'I did not go',
        tiers:[
          ['I will go tomorrow.', 'Tomorrow is a better day for it anyway.'],
          ['My kit was still in the bag from last time, in a state I did not want to investigate.', 'That is arguably a hygiene decision.'],
          ['I did the stairs twice today, which at my age is comparable.', 'Two flights. Carrying things.'],
          ['I have been resting a muscle that I do not use and have not injured, as a precaution.', 'Prevention. It is the modern approach.'],
          ['I drove past, made eye contact with the building, and we agreed to leave it.', 'It knew. I knew. It was mutual.'],
          ['I have calculated that the energy spent getting there exceeds the energy spent inside, making attendance a net loss to the universe.', 'I can show the working. It is not rigorous but it is heartfelt.'],
        ] },
    ];
    

    root.innerHTML =
      '<div class="wrap">' +
      '  <h1>The Escalating Excuse</h1>' +
      '  <div class="sub">it starts reasonable &middot; it does not stay that way</div>' +
      '  <div class="pick" id="pick"></div>' +
      '  <div class="sheet">' +
      '    <div class="gauge">' +
      '      <span class="lv">level <b id="lv">1</b> of 6</span>' +
      '      <span class="bar"><i id="bar" style="width:16%"></i></span>' +
      '      <span class="lv" id="lvname">plausible</span>' +
      '    </div>' +
      '    <p class="ex" id="ex"></p>' +
      '    <div class="plaus">' +
      '      <span>believability <b id="believe">&mdash;</b></span>' +
      '      <span>if pressed <b id="pressed">&mdash;</b></span>' +
      '    </div>' +
      '  </div>' +
      '  <div class="deck">' +
      '    <button class="btn" id="worse">Make it worse &uarr;</button>' +
      '    <button class="btn sec" id="reset">Start over</button>' +
      '    <button class="btn sec" id="copy">Copy</button>' +
      '  </div>' +
      '  <div class="log" id="log" hidden>' +
      '    <h2>what you have already claimed</h2>' +
      '    <ol id="loglist"></ol>' +
      '  </div>' +
      '  <p class="note">Six levels, escalating. Every excuse is generated here in your ' +
      '     browser and none of them will work. Do not use these on anyone who can affect ' +
      '     your rent.</p>' +
      '</div>';

    var $ = function (id) { return root.querySelector('#' + id); };
    var esc = function (s) {
      return String(s == null ? '' : s)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    };

    var sit = SITUATIONS[0], level = 0, history = [];

    function renderPicks(){
      $('pick').innerHTML = SITUATIONS.map(function (s, i) {
        return '<button data-i="' + i + '" aria-pressed="' + (s === sit) + '">' +
               esc(s.label) + '</button>';
      }).join('');
    }

    /* Each word is its own element with its own speed and phase: a line
       where every word trembles in step reads as a wobble effect, and a
       line where they all disagree reads as nerves. */
    function tremble(text, level, animateIn){
      var amp = (0.28 + level * 0.30).toFixed(2);
      var rot = (0.10 + level * 0.13).toFixed(2);
      return text.split(/(\s+)/).map(function (w, i) {
        if (!w.trim()) return w;
        var sp = (1.9 + ((i * 37) % 17) / 10).toFixed(2);
        return '<span class="w' + (animateIn ? ' in' : '') + '" style="--a:' + amp +
               'px;--r:' + rot + 'deg;--sp:' + sp + 's;animation-delay:' +
               (animateIn ? (i * 0.022).toFixed(3) + 's,' + (0.34 + i * 0.022).toFixed(3) + 's' : '0s') +
               '">' + esc(w) + '</span>';
      }).join('');
    }

    function render(animateIn){
      var t = sit.tiers[level];
      $('ex').innerHTML = tremble(t[0], level, animateIn) +
        '<span class="why">' + tremble(t[1], level, animateIn) + '</span>';
      $('lv').textContent = level + 1;
      $('lvname').textContent = LEVELS[level];
      $('bar').style.width = ((level + 1) / 6 * 100).toFixed(0) + '%';
      $('believe').textContent = BELIEVE[level];
      $('pressed').textContent = PRESSED[level];
      $('worse').disabled = level >= 5;
      $('worse').textContent = level >= 5 ? 'there is no worse' : 'Make it worse \u2191';
      if (history.length){
        $('log').hidden = false;
        $('loglist').innerHTML = history.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('');
      } else {
        $('log').hidden = true;
        $('loglist').innerHTML = '';
      }
    }

    /* Three or four rising "ha" syllables, faster and higher the further
       out you are. Not a sample and not a word: the shape of the noise a
       person makes when they know they are not being believed. */
    function laugh(level){
      if (!window.LCSound) return;
      LCSound.play(function (A) {
        var n = 3 + Math.min(2, Math.floor(level / 2));
        var base = 260 + level * 26;
        for (var i = 0; i < n; i++){
          var at = i * (0.115 - level * 0.008);
          var f = base * (1 + i * 0.09) * (0.97 + Math.random() * 0.06);
          A.blip(f, { at: at, dur: 0.075, glide: f * 0.82, level: A.cap(0.055 - i * 0.006),
                      type: 'triangle', filter: 'bandpass', filterFreq: f * 2.4, q: 1.4, reverb: false });
          A.burst('pink', { at: at, freq: f * 3, q: 1.1, dur: 0.045, level: A.cap(0.022), reverb: false });
        }
      });
    }

    function choose(i){
      sit = SITUATIONS[i]; level = 0; history = [];
      renderPicks(); render(true);
      if (window.LCSound) LCSound.play(function (A) {
        A.burst('pink', { freq: 1500, q: 1.2, dur: .05, level: A.cap(.03), reverb: false });
      });
    }

    $('pick').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-i]');
      if (b) choose(Number(b.dataset.i));
    });
    $('worse').addEventListener('click', function () {
      if (level >= 5) return;
      history.push(sit.tiers[level][0]);
      level++;
      render(true);
      var sheet = root.querySelector('.sheet');
      sheet.classList.remove('flinch');
      void sheet.offsetWidth;
      sheet.classList.add('flinch');
      laugh(level);
    });
    $('reset').addEventListener('click', function () {
      level = 0; history = []; render(true);
      if (window.LCSound) LCSound.play(function (A) {
        A.blip(300, { dur: .2, glide: 200, level: A.cap(.05), type: 'sine' });
      });
    });
    $('copy').addEventListener('click', function () {
      var t = sit.tiers[level], text = t[0] + ' ' + t[1];
      var done = function () {
        $('copy').textContent = 'Copied';
        setTimeout(function () { $('copy').textContent = 'Copy'; }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { window.prompt('Copy:', text); });
      } else { window.prompt('Copy:', text); }
    });

    renderPicks();
    render(false);
  }
});
