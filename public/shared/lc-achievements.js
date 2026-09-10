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
    { id:'front.konami',    toy:'hub', name:'The old code',
      hint:'The oldest code there is, on the front door.' },
    { id:'front.shuffle',   toy:'hub', name:'Reshuffled',
      hint:'Tip the drawers out and put them back wrong.' },
    { id:'strat.studio',    toy:'hub', name:'Who made the arrows',
      hint:'Five arrows point somewhere real.' },
    { id:'strat.ballot',    toy:'hub', name:'Managed democracy',
      hint:'Five arrows, and a flag goes up.' },
    { id:'strat.brew',      toy:'hub', name:'A cup of something',
      hint:'Five arrows, and the steam makes a shape.' },
    { id:'strat.resupply',  toy:'hub', name:'Delivered, roughly',
      hint:'Five arrows, and something lands nearby.' },
    { id:'strat.officer',   toy:'hub', name:'Entirely satisfied',
      hint:'Five arrows, and somebody approves.' },
  ]);
})();
