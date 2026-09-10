/* ------------------------------------------------------------------ *
 *  Directions, for people without arrow keys.
 *
 *  Several things in this cabinet are unlocked by a sequence of arrow
 *  presses — the Konami code on the front door, and the five stratagem
 *  codes next to it. On a phone there are no arrow keys, so all of them
 *  were simply unreachable: not awkward, not fiddly, unreachable.
 *
 *  This turns a swipe into the same direction an arrow key would have
 *  given, and hands it to whoever is listening. It is the sequence that
 *  is secret, not the input device.
 *
 *  It only ever WATCHES. Nothing here calls preventDefault, so the page
 *  goes on scrolling exactly as it did — entering a code scrolls the
 *  page about as a side effect, which is the honest trade for not
 *  breaking scrolling everywhere else to support an easter egg.
 *
 *  Usage:
 *      LCSwipe.on(function (dir) { ... });   // 'up' | 'down' | 'left' | 'right'
 *      LCSwipe.available                     // false where there is no touch
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var MIN = 38;          // px before a drag counts as a swipe at all
  var RATIO = 1.5;       // how much one axis must beat the other to be that axis
  var MAX_MS = 900;      // a slow drag is a scroll, not a flick

  var listeners = [];
  var start = null;
  var fired = false;

  var hasTouch = ('ontouchstart' in window) ||
                 (navigator.maxTouchPoints > 0) ||
                 (navigator.msMaxTouchPoints > 0);

  function emit(dir) {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](dir); } catch (e) { /* one bad listener must not stop the rest */ }
    }
  }

  function isTypingTarget(t) {
    return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
  }

  function down(e) {
    var t = e.touches ? e.touches[0] : e;
    if (isTypingTarget(e.target)) { start = null; return; }
    start = { x: t.clientX, y: t.clientY, at: Date.now() };
    fired = false;
  }

  /* Fire as soon as the threshold is crossed rather than waiting for the
     finger to lift: a code is four or five flicks in a row and people do
     not fully lift between them. One direction per touch, so a long
     wandering drag cannot spray four directions at once. */
  function move(e) {
    if (!start || fired) return;
    var t = e.touches ? e.touches[0] : e;
    var dx = t.clientX - start.x, dy = t.clientY - start.y;
    var ax = Math.abs(dx), ay = Math.abs(dy);
    if (ax < MIN && ay < MIN) return;
    if (Date.now() - start.at > MAX_MS) { start = null; return; }
    fired = true;
    if (ax > ay * RATIO) emit(dx > 0 ? 'right' : 'left');
    else if (ay > ax * RATIO) emit(dy > 0 ? 'down' : 'up');
    else fired = false;                      // a diagonal is not a direction
  }

  function up() { start = null; fired = false; }

  if (hasTouch) {
    document.addEventListener('touchstart', down, { passive: true });
    document.addEventListener('touchmove', move, { passive: true });
    document.addEventListener('touchend', up, { passive: true });
    document.addEventListener('touchcancel', up, { passive: true });
  }

  window.LCSwipe = {
    available: hasTouch,
    on: function (fn) { if (typeof fn === 'function') listeners.push(fn); },
    off: function (fn) {
      var i = listeners.indexOf(fn);
      if (i >= 0) listeners.splice(i, 1);
    },
    /* for tests and for anything that wants to drive it directly */
    feed: emit
  };
})();
