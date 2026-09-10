/* ------------------------------------------------------------------ *
 *  Voice: The Contraption Bureau.
 *
 *  The nonsense-inventor voice pack. It is INSPIRED BY a tradition —
 *  two visitors explaining the ordinary world back to you as though it
 *  were an elaborate invention, with perfect internal logic and no
 *  external logic at all — and it is not those characters. No names, no
 *  likenesses, no borrowed lines. Everything below was written here.
 *
 *  The rule that makes it work: the nonsense has to be RIGOROUS. Every
 *  device follows from its premise, each step follows from the last, and
 *  the caution at the bottom is a real consequence of the mechanism
 *  described. A random absurdity is not funny; a wrong thing argued
 *  carefully is.
 * ------------------------------------------------------------------ */
LCGen.voice({
  id: 'nonsense',
  name: 'The Contraption Bureau',
  blurb: 'Two inventors, one problem, and a device that follows from its own premise and nothing else.',

  /* what the page outside the room takes from this voice */
  page: {
    '--gen-bg': '#FFF8E7', '--gen-ink': '#2A2118',
    '--gen-body': '"Marker Felt","Comic Sans MS","Chalkboard SE","Bradley Hand",ui-sans-serif,system-ui,sans-serif',
    '--gen-bar': 'rgba(253,237,200,.86)', '--gen-rule': '#E4D2A8',
    '--gen-field': 'rgba(255,255,255,.7)'
  },

  css: `
:root{
  --paper:#FFF8E7; --paper-2:#FDEDC8; --ink:#2A2118; --ink-2:#6B5A44;
  --red:#D6472F; --blue:#2C6FA8; --green:#4E8B4A; --yellow:#F2B705;
  --rule:#E4D2A8;
  --hand:"Marker Felt","Comic Sans MS","Chalkboard SE","Bradley Hand",ui-sans-serif,system-ui,sans-serif;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
}
.room{
  font-family:var(--hand);color:var(--ink);
  background-image:
    radial-gradient(circle at 12% 6%, rgba(242,183,5,.15), transparent 34%),
    radial-gradient(circle at 88% 88%, rgba(44,111,168,.12), transparent 38%);
}
h1{ font-size:clamp(26px,5.6vw,40px);margin:0;line-height:1.08;transform:rotate(-1.1deg) }
.sub{ font-family:var(--mono);font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;
      color:var(--ink-2);margin-top:10px }

.pick{ display:flex;gap:7px;flex-wrap:wrap;margin:20px 0 18px }
.pick button{
  font-family:var(--hand);font-size:14px;background:#fff;border:2px solid var(--ink);
  color:var(--ink);padding:8px 13px;cursor:pointer;border-radius:14px 9px 15px 8px;
  box-shadow:2px 2px 0 var(--ink);
}
.pick button:nth-child(3n){ border-radius:9px 15px 8px 14px }
.pick button[aria-pressed="true"]{ background:var(--yellow) }
.pick button:hover{ transform:translate(-1px,-1px);box-shadow:3px 3px 0 var(--ink) }

/* The device sheet: a page torn out of a workshop notebook and pinned up
   slightly crooked, because nobody in this bureau owns a ruler. */
.sheet{
  background:#fff;border:2px solid var(--ink);border-radius:5px;
  padding:22px 20px 20px;box-shadow:4px 5px 0 rgba(42,33,24,.18);
  transform:rotate(-.5deg);position:relative;
}
.sheet::before{
  content:"";position:absolute;top:-9px;left:50%;width:18px;height:18px;margin-left:-9px;
  background:var(--red);border:2px solid var(--ink);border-radius:50%;
}
.name{ font-size:clamp(21px,4.4vw,30px);line-height:1.15;margin:4px 0 2px;color:var(--red) }
.made{ font-family:var(--mono);font-size:11px;color:var(--ink-2);letter-spacing:.04em;margin:0 0 16px }
.how{ margin:0;padding:0;list-style:none;counter-reset:step }
.how li{
  counter-increment:step;position:relative;padding:0 0 13px 38px;font-size:16.5px;line-height:1.5;
  opacity:0;animation:land .34s ease forwards;
}
.how li::before{
  content:counter(step);position:absolute;left:0;top:-1px;width:25px;height:25px;
  display:flex;align-items:center;justify-content:center;
  background:var(--blue);color:#fff;border:2px solid var(--ink);border-radius:50%;
  font-family:var(--mono);font-size:12px;
}
@keyframes land{ from{ opacity:0;transform:translateY(7px) rotate(.6deg) } to{ opacity:1 } }
@media (prefers-reduced-motion: reduce){ .how li{ animation:none;opacity:1 } }

.caution{
  margin-top:16px;padding:11px 13px;background:var(--paper-2);
  border:2px dashed var(--ink);border-radius:4px;font-size:15px;line-height:1.5;
}
.caution b{ color:var(--red) }
.by{ margin-top:14px;font-family:var(--mono);font-size:10.5px;color:var(--ink-2);
     letter-spacing:.08em;text-transform:uppercase }

.deck{ display:flex;gap:9px;flex-wrap:wrap;margin-top:20px }
.btn{
  font-family:var(--hand);font-size:15px;background:var(--red);color:#fff;
  border:2px solid var(--ink);padding:10px 18px;cursor:pointer;border-radius:13px 8px 14px 9px;
  box-shadow:3px 3px 0 var(--ink);
}
.btn:hover{ transform:translate(-1px,-1px);box-shadow:4px 4px 0 var(--ink) }
.btn:active{ transform:translate(2px,2px);box-shadow:1px 1px 0 var(--ink) }
.btn.sec{ background:#fff;color:var(--ink) }
.btn:focus-visible{ outline:3px solid var(--blue);outline-offset:3px }
.note{ margin-top:22px;font-family:var(--mono);font-size:10.5px;line-height:1.8;color:var(--ink-2) }
@media (pointer:coarse){ .pick button,.btn{ min-height:44px } }
`,

  mount: function (root) {
    'use strict';

    /* A pending timer here touches elements inside root, and root is
       emptied when the voice is switched away — so the copy button's
       reset would throw into whichever voice is on screen by then. */
    var __timers = [], __dead = false;
    function setTimeout(fn, ms){
      var id = window.setTimeout(function(){ if (!__dead) fn(); }, ms);
      __timers.push(id); return id;
    }

    /* Six ordinary complaints. The bureau does not consider any of them
       small, which is the joke: the machine is always proportionate to
       how seriously the problem is taken, never to the problem. */
    var PROBLEMS = [
      { k:'socks', label:'a sock has gone missing' },
      { k:'toast', label:'the toast landed butter-down' },
      { k:'keys',  label:'I cannot find my keys' },
      { k:'queue', label:'my queue is the slow one' },
      { k:'lid',   label:'the jar will not open' },
      { k:'rain',  label:'it rains when I go out' },
    ];

    var PREFIX = ['Automatic','Semi-Automatic','Obedient','Reluctant','Municipal','Pocket',
                  'Two-Person','Self-Winding','Polite','Industrial','Domestic','Portable'];
    var CORE = ['Sock','Toast','Key','Queue','Lid','Weather','Doubt','Thursday','Corner','Draught'];
    var KIND = ['Persuader','Interrogator','Reverser','Negotiator','Accountant','Dowser',
                'Apologiser','Straightener','Redirector','Confessor'];

    var MATERIALS = [
      'one bicycle bell, three teaspoons, and a length of string that remembers being longer',
      'a colander, two clothes pegs, and the good scissors nobody is allowed to use',
      'half a bellows, a doorknob from a door that no longer exists, and forty centimetres of tubing',
      'a biscuit tin, a spirit level that has never once agreed with another spirit level, and wire',
      'an umbrella turned inside out on purpose, a bulldog clip, and one very confident magnet',
      'a kitchen timer, a shoehorn, and a small brass thing that came with something else',
      'two funnels, a bootlace, and a mirror angled so it can see round the problem',
      'a watering can, a tuning fork, and the cardboard tube everyone in the house was saving',
    ];

    /* Each step has to follow from the one before it. The device is wrong
       from the premise onward, and rigorous after that. */
    var STEPS = {
      socks: [
        ['The drum is loaded with the surviving sock and nothing else, so it has no one to blame.',
         'A bell is rung once. Socks are known to answer a bell they were not expecting.',
         'The missing sock, hearing its pair announced, is obliged by symmetry to declare a position.',
         'The declared position is written on the lid in pencil so it can be argued with later.'],
        ['The surviving sock is weighed, and then weighed again to see if it is being honest.',
         'The difference between the two weighings is the weight of the absent sock. This is the whole principle.',
         'That weight is fed into the tube, which is only wide enough for one sock’s worth of opinion.',
         'Whatever comes out the far end is the direction. Follow it slowly and do not look keen.'],
      ],
      toast: [
        ['The slice is introduced to the plate before buttering, so the two have met socially.',
         'The bellows applies a short upward draught, timed to the moment of doubt.',
         'A tilt of eleven degrees is added, which is the angle at which toast stops having a preference.',
         'The slice lands on whichever side it feels it has earned. Results are not appealed.'],
        ['The butter is applied to both sides, removing the question entirely.',
         'The machine then withdraws one side’s butter at the last moment, and does not say which.',
         'The toast, having no information, cannot conspire against you.',
         'This works precisely once per person. After that the toast learns the trick.'],
      ],
      keys: [
        ['Every pocket in the building is opened at the same time so none of them can pass anything on.',
         'The dowsing arm is released and allowed to wander, because keys respond badly to being hunted.',
         'When the arm slows, that room is declared warm and the search is politely abandoned there.',
         'The keys arrive on their own within the hour, on the surface you have already checked twice.'],
        ['You are asked to describe the keys out loud, in detail, to the funnel.',
         'The funnel repeats the description back at half speed, which is how objects prefer to be addressed.',
         'The mirror is angled so the search can see round the corner of your own certainty.',
         'The keys are behind the certainty. They are always behind the certainty.'],
      ],
      queue: [
        ['Both queues are timed for one minute with the spoons, which is long enough to be unfair.',
         'The slower spoon is set aside and is not consulted again, having proved unreliable.',
         'You join the queue the machine did NOT recommend, because queues can read.',
         'The queue you left immediately slows down. This is the device working, not failing.'],
      ],
      lid: [
        ['The jar is shown the good scissors. Nothing is done with them.',
         'The rubber grip is applied by a second person, so responsibility is shared and the jar knows it.',
         'One short turn anticlockwise first — an unexpected direction unsettles a lid considerably.',
         'The real turn follows immediately, before the lid has finished being surprised.'],
      ],
      rain: [
        ['The umbrella is opened indoors, which is a provocation, and then closed again apologetically.',
         'The device notes whether the ceiling reacted. It usually does not, but it must be checked.',
         'You are sent out carrying the umbrella openly, which weather finds insulting and avoids.',
         'On days when this fails, the umbrella is at fault and should be spoken to on returning.'],
      ],
    };

    var CAUTIONS = [
      'Do not operate this near a second one of these. They agree with each other and stop being useful.',
      'The device must be switched off before it finishes, or it will begin solving the next problem uninvited.',
      'Never thank it out loud. It will wait to be thanked again and nothing else will happen until you do.',
      'Keep the lid closed on Thursdays. This is not explained in the manual and the manual is right not to.',
      'If it starts humming, it has understood the problem better than you have. Let it finish.',
      'Do not read the label aloud while it is running. It hears its own name and becomes self-conscious.',
    ];

    var INVENTORS = [
      'the taller one, who does the thinking',
      'the shorter one, who does the wiring',
      'both of them, disagreeing',
      'the shorter one, working from a drawing by the taller one',
      'the taller one, after being told not to',
      'both of them, on a Sunday, in a shed that was not theirs',
    ];

    root.innerHTML =
      '<h1>The Contraption Bureau</h1>' +
      '<div class="sub">bring us a problem &middot; we will bring you a device</div>' +
      '<div class="pick" id="pick"></div>' +
      '<div class="sheet">' +
      '  <p class="name" id="name">&mdash;</p>' +
      '  <p class="made" id="made"></p>' +
      '  <ol class="how" id="how"></ol>' +
      '  <div class="caution" id="caution"></div>' +
      '  <div class="by" id="by"></div>' +
      '</div>' +
      '<div class="deck">' +
      '  <button class="btn" id="again">Build another &#9881;</button>' +
      '  <button class="btn sec" id="copy">Copy</button>' +
      '</div>' +
      '<p class="note">Every device is assembled in your browser out of the lists above, and none ' +
      'of them exists. This voice is an original invention in the spirit of a well-loved kind of ' +
      'nonsense; it is nobody in particular and quotes nothing.</p>';

    var $ = function (id) { return root.querySelector('#' + id); };
    var esc = function (s) {
      return String(s == null ? '' : s)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    };
    var pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };

    var problem = PROBLEMS[0], made = '';

    function renderPicks(){
      $('pick').innerHTML = PROBLEMS.map(function (p, i) {
        return '<button data-i="' + i + '" aria-pressed="' + (p === problem) + '">' +
               esc(p.label) + '</button>';
      }).join('');
    }

    function build(){
      var steps = pick(STEPS[problem.k]);
      var title = pick(PREFIX) + ' ' + pick(CORE) + ' ' + pick(KIND);
      made = title;
      $('name').textContent = 'The ' + title;
      $('made').textContent = 'built from ' + pick(MATERIALS);
      $('how').innerHTML = steps.map(function (s, i) {
        return '<li style="animation-delay:' + (i * 0.09).toFixed(2) + 's">' + esc(s) + '</li>';
      }).join('');
      $('caution').innerHTML = '<b>Caution.</b> ' + esc(pick(CAUTIONS));
      $('by').textContent = 'assembled by ' + pick(INVENTORS);
      clank();
    }

    /* A workshop noise: two bits of metal meeting, a spring, and a small
       bell that is far too pleased with itself. */
    function clank(){
      if (!window.LCSound) return;
      LCSound.play(function (A) {
        A.burst('white', { freq: 2600, q: 5, dur: 0.035, level: A.cap(0.05), reverb: false });
        A.burst('pink',  { at: 0.05, type: 'bandpass', freq: 420, q: 2.2, dur: 0.10,
                           level: A.cap(0.06), reverb: false });
        A.blip(880, { at: 0.13, dur: 0.30, glide: 1320, level: A.cap(0.045), type: 'triangle' });
        A.blip(1320, { at: 0.20, dur: 0.36, level: A.cap(0.030), type: 'sine' });
      });
    }

    $('pick').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-i]');
      if (!b) return;
      problem = PROBLEMS[Number(b.dataset.i)];
      renderPicks(); build();
    });
    $('again').addEventListener('click', build);
    $('copy').addEventListener('click', function () {
      var text = 'The ' + made + '\n' + $('made').textContent + '\n\n' +
        [].map.call(root.querySelectorAll('.how li'), function (li, i) {
          return (i + 1) + '. ' + li.textContent;
        }).join('\n') + '\n\n' + $('caution').textContent + '\n' + $('by').textContent;
      var done = function () {
        $('copy').textContent = 'Copied';
        setTimeout(function () { $('copy').textContent = 'Copy'; }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { window.prompt('Copy:', text); });
      } else { window.prompt('Copy:', text); }
    });

    renderPicks();
    build();
    return function () {
      __dead = true;
      __timers.forEach(function (id) { try { window.clearTimeout(id); } catch (e) {} });
      __timers = [];
    };
  }
});
