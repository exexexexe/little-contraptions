/* ------------------------------------------------------------------ *
 *  The registry.
 *
 *  Fifty-odd hidden things are scattered through this cabinet and until
 *  now each one was its own private event: it fired, something happened,
 *  and nothing anywhere knew it had. This is the central list they all
 *  report into.
 *
 *  The point of it is to be EXTENSIBLE. A new egg registers itself with
 *  define() and reports with fire(), and neither the tracker nor this
 *  file needs editing to know about it. Nothing here is a hard-coded
 *  count of how many eggs exist — the total is however many have been
 *  defined by the time you ask.
 *
 *  Progress is personal and lives in localStorage. It is deliberately
 *  NOT on the server: what somebody has found is theirs, and a hub that
 *  wrote it down would be keeping a record of how each visitor plays.
 *  The one shared thing is the hall of fame, which is a separate
 *  question and separate infrastructure.
 *
 *  Renames are expected. An entry may carry `was`, a previous id, and
 *  stored progress migrates to the new id the first time it is read —
 *  which matters because the consolidation ahead changes several toys'
 *  identities and nobody should lose a find to a URL change.
 *
 *  Usage:
 *      LCAch.fire('front.konami')        // from the toy that owns the egg
 *      LCAch.define([...])               // add to the catalogue below
 *      LCAch.progress()                  // { earned, total }
 *      LCAch.all()                       // definitions + earned state
 *      LCAch.on(function(entry){ ... })  // something was just earned
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var KEY = 'lc-achievements';
  var defs = {};                 // id -> definition
  var order = [];                // definition order, so a list reads stably
  var earned = null;             // id -> epoch ms
  var listeners = [];

  /* ---- storage ----
     Every read and write is wrapped: private mode throws on access, and
     an egg must never be the thing that breaks a page. A visitor with no
     storage simply finds things without the cabinet remembering. */
  function read(){
    if (earned) return earned;
    earned = {};
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (raw && typeof raw === 'object' && raw.earned && typeof raw.earned === 'object'){
        for (var k in raw.earned){
          var t = raw.earned[k];
          if (typeof t === 'number' && isFinite(t)) earned[k] = t;
        }
      }
    } catch (e) { /* private mode: nothing is remembered, everything works */ }
    return earned;
  }

  function write(){
    try { localStorage.setItem(KEY, JSON.stringify({ v: 1, earned: earned })); }
    catch (e) { /* out of quota or no storage: the session still counts */ }
  }

  /* An id that was renamed carries its old one forward once. */
  function migrate(d){
    if (!d.was) return;
    var e = read();
    var olds = Array.isArray(d.was) ? d.was : [d.was];
    for (var i = 0; i < olds.length; i++){
      if (e[olds[i]] != null && e[d.id] == null){
        e[d.id] = e[olds[i]];
        delete e[olds[i]];
        write();
      }
    }
  }

  function define(list){
    var arr = Array.isArray(list) ? list : [list];
    for (var i = 0; i < arr.length; i++){
      var d = arr[i];
      if (!d || !d.id) continue;
      if (!defs[d.id]) order.push(d.id);
      defs[d.id] = {
        id: d.id,
        toy: d.toy || '',
        name: d.name || d.id,
        hint: d.hint || '',              // what the tracker shows while locked
        secret: d.secret !== false,      // secret ones do not reveal their name
        was: d.was || null,
      };
      migrate(defs[d.id]);
    }
    return LCAch;
  }

  function has(id){ return read()[id] != null; }

  /* Returns true only the FIRST time — so a caller can celebrate a find
     without celebrating every repeat of it. */
  function fire(id, opts){
    var o = opts || {};
    if (!defs[id] && o.define) define(o.define);
    var e = read();
    if (e[id] != null) return false;
    e[id] = Date.now();
    write();
    var entry = defs[id] || { id: id, toy: '', name: id, hint: '', secret: true };
    for (var i = 0; i < listeners.length; i++){
      // a listener that throws must not stop the others, or the egg
      try { listeners[i](entry, progress()); } catch (err) {}
    }
    return true;
  }

  function all(){
    var e = read();
    return order.map(function(id){
      var d = defs[id];
      return { id: d.id, toy: d.toy, name: d.name, hint: d.hint,
               secret: d.secret, earned: e[id] != null, at: e[id] || null };
    });
  }

  function progress(){
    var e = read(), n = 0;
    for (var i = 0; i < order.length; i++) if (e[order[i]] != null) n++;
    return { earned: n, total: order.length };
  }

  /* The hall of fame's unlock condition.
     This is only meaningful because THE CATALOGUE BELOW IS THE WHOLE
     CATALOGUE and every page loads this file. Measuring against "what
     happens to be defined right now" would otherwise mean a toy page
     that registered its own three eggs reported a completed cabinet.
     Anything a page adds later with define() only ever adds to the
     total, so the figure cannot drift downwards either. */
  function complete(){
    var p = progress();
    return p.total > 0 && p.earned === p.total;
  }

  function forget(){
    earned = {};
    try { localStorage.removeItem(KEY); } catch (e) {}
  }

  var LCAch = {
    define: define,
    fire: fire,
    has: has,
    all: all,
    progress: progress,
    complete: complete,
    forget: forget,
    on: function(fn){ if (typeof fn === 'function') listeners.push(fn); return LCAch; },
    get ids(){ return order.slice(); },
  };

  window.LCAch = LCAch;

  /* ================================================================== *
   *  THE CATALOGUE
   *
   *  Every achievement in the cabinet is listed here, not in the toy
   *  that owns it. A toy only ever calls fire() — it does not need to
   *  know it is being counted, and a page that loads this file knows
   *  about every egg whether or not that toy is open.
   *
   *  That is what makes complete() above answerable at all: the total
   *  is the same number on every page. Add new eggs to this list.
   *
   *  Currently seeded with the front door's own. The retrofit of the
   *  other fifty-odd is Phase 6's actual work and has not been done —
   *  so the total below is honestly seven, not a placeholder for
   *  fifty-seven.
   * ================================================================== */
  define([
    /* --- the front door -------------------------------------------- */
    { id:'front.konami',   toy:'hub', name:'The old code',
      hint:'The oldest code there is, on the front door.' },
    { id:'front.shuffle',  toy:'hub', name:'Reshuffled',
      hint:'Tip the drawers out and put them back wrong.' },
    { id:'front.neal',     toy:'hub', name:'Hat tipped',
      hint:'Type the name of somebody this cabinet owes a debt to.' },
    { id:'front.tracker',  toy:'hub', name:'You found this list',
      hint:'You are reading it.', secret:false },
    { id:'desk.bluescreen',toy:'hub', name:'Not a drawer',
      hint:'One icon on the desktop is not a drawer at all.' },

    /* --- the five arrow codes --------------------------------------- */
    { id:'strat.studio',   toy:'hub', name:'Who made the arrows',
      hint:'Five arrows point somewhere real.' },
    { id:'strat.ballot',   toy:'hub', name:'Managed democracy',
      hint:'Five arrows, and a flag goes up.' },
    { id:'strat.brew',     toy:'hub', name:'A cup of something',
      hint:'Five arrows, and the steam makes a shape.' },
    { id:'strat.resupply', toy:'hub', name:'Delivered, roughly',
      hint:'Five arrows, and something lands nearby.' },
    { id:'strat.officer',  toy:'hub', name:'Entirely satisfied',
      hint:'Five arrows, and somebody approves.' },

    /* --- in the drawers ---------------------------------------------
       Everything below is documented in PROGRESS.md from the batches
       that built them. They are listed here so the total is the real
       total; the ones not yet reporting are named in the log rather
       than quietly left out. */
    { id:'archive.babel',      toy:'infinite-archive', name:'The library of Babel',
      hint:'Search the archive for the library it is pretending not to be.' },
    { id:'paradox.overflow',   toy:'paradox-machine', name:'Stack overflow',
      hint:'Give the paradox machine the same paradox twice.' },
    { id:'story.thousand',     toy:'story-chain', name:'The End?',
      hint:'Somebody has to write sentence one thousand.' },
    { id:'globe.figure',       toy:'snow-globe', name:'Somebody out there',
      hint:'Shake it hard, and then keep shaking.' },
    { id:'globe.inverted',     toy:'snow-globe', name:'Upside down',
      hint:'Turn the whole thing over and hold it there.' },
    { id:'morse.egg',          toy:'encode-anything', name:'Laid out as an egg',
      hint:'Encode the name of the thing you are looking for.' },
    { id:'closer.zanzibar',    toy:'history-desk', name:'Shorter than your visit',
      hint:'Keep comparing until it starts comparing you.' },
    { id:'dream.thissite',     toy:'dream-decoder', name:'A dream about this website',
      hint:'Tell the decoder where you are.' },
    { id:'declass.leftopen',   toy:'declassified-search', name:'Whoever left this open',
      hint:'Walk away from it for a minute and a quarter.' },
    { id:'whatif.nointernet',  toy:'history-desk', name:'It declines',
      hint:'Ask it to imagine away the thing it is running on.' },
    { id:'guestbook.neal',     toy:'guestbook', name:'Signed in good company',
      hint:'Sign it with a name this cabinet already tips its hat to.' },
    { id:'pixel.shape',        toy:'pixel-canvas', name:'A shape in the pixels',
      hint:'Draw something the canvas recognises.' },
    { id:'shipslog.april',     toy:'generator', name:'15 April',
      hint:'A date at sea that is not a joke.' },
    { id:'advisor.900',        toy:'generator', name:'Too long a reign',
      hint:'Push the realm further than anyone should.' },
    { id:'gun.sincere',        toy:'generator', name:'One sincere line',
      hint:'Ask the talking gun something genuinely large.' },
    { id:'city.stockholm',     toy:'city-builder-map', name:'A real street',
      hint:'Name a street after one that exists, a long way north.' },
    { id:'arcade.shield',      toy:'arcade', name:'The shield',
      hint:'In DESCENT, hold the one direction that cannot happen by accident.' },
    { id:'card.note',          toy:'hub', name:'Under the corner',
      hint:'The cards are dog-eared for a reason.' },
    { id:'ghost.nodrawer',     toy:'hub', name:'There is no drawer 82',
      hint:'Keep asking the drawer that is still being built.' },
    { id:'weather.roomtemp',   toy:'weather', name:'The twenty-fourth place',
      hint:'Visit every place the almanac lists, in one sitting.' },
    { id:'weather.offdial',    toy:'weather', name:'Past the end of the dial',
      hint:'Roughly one report in four hundred.' },
    { id:'radio.numbers',      toy:'radio', name:'Five-digit groups',
      hint:'Hold the needle in the middle of a wide gap.' },
    { id:'jar.lid',            toy:'gratitude-jar', name:'The lid gives',
      hint:'Shake it harder and for longer than seems wise.' },
    { id:'loot.impossible',    toy:'loot-terminal', name:'Impossible',
      hint:'Appraise the same thing twice running.' },
    { id:'bureau.free',        toy:'bureaucracy', name:'You are free',
      hint:'Three submissions running with nothing left blank.' },
    { id:'civ.onemore',        toy:'civilizations', name:'One more rung',
      hint:'Past the last of the sources.' },
    { id:'apoc.intent',        toy:'apocalypse-quiz', name:'A statement of intent',
      hint:'Answer every question as badly as it can be answered.' },
    { id:'beats.bees',         toy:'what-beats-this', name:'Bees, and also bees',
      hint:'Set a thousand of something against a thousand of itself.' },
    { id:'retroos.rightclick', toy:'retro-os', name:'Greyed out',
      hint:'Right-click where there is nothing to right-click.' },
    { id:'ghostrace.forty',    toy:'type-ghost', name:'Forty ahead',
      hint:'Beat your own ghost by a distance, and accurately.' },
    { id:'cookie.hundredth',   toy:'fortune-cookie', name:'The hundredth cookie',
      hint:'Not drawn from the pile. Fires once, at exactly one hundred.' },
    { id:'iss.stockholm',      toy:'iss', name:'Overhead right now',
      hint:'Wait until it is over somewhere in particular.' },
    { id:'inventions.notyet',  toy:'inventions', name:'The drawer after the last one',
      hint:'Open the newest thing on the timeline.' },
  ]);
})();
