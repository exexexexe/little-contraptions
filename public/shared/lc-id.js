/* ------------------------------------------------------------------ *
 *  The one anonymous id.
 *
 *  Every shared thing in the cabinet — the boards, the guestbook, the
 *  canvas, the story, the head-count — needs to recognise "you" without
 *  knowing anything about you. This is what it uses: a string this
 *  browser invents for itself once and keeps in localStorage.
 *
 *  It is not derived from the address, the user agent, the screen, or
 *  anything else. It never leaves the browser except as itself, and the
 *  server stores it as an opaque key and never sends it back out.
 *
 *  In a private window, or with storage refused, this still returns an
 *  id — a fresh one each load. That is the honest degradation: you can
 *  still take part, the boards just will not recognise you tomorrow.
 *
 *  There is also a handle: three-to-twelve characters, whatever you type
 *  into an arcade cabinet or sign a guestbook with. It is decoration,
 *  not an account, and is stored beside the id so a toy can offer the
 *  same one back rather than asking twice.
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var ID_KEY = 'lc-visitor-token';
  var HANDLE_KEY = 'lc-handle';
  var VALID = /^[a-z0-9]{8,64}$/i;
  var cached = null;

  function fresh(n) {
    var out = '';
    try {
      var bytes = new Uint8Array(n);
      (window.crypto || window.msCrypto).getRandomValues(bytes);
      for (var i = 0; i < bytes.length; i++) out += (bytes[i] % 36).toString(36);
      return out;
    } catch (e) {
      for (var j = 0; j < n; j++) out += Math.floor(Math.random() * 36).toString(36);
      return out;
    }
  }

  function id() {
    if (cached) return cached;
    try {
      var t = localStorage.getItem(ID_KEY);
      if (t && VALID.test(t)) { cached = t; return t; }
      t = fresh(12);
      localStorage.setItem(ID_KEY, t);
      cached = t;
      return t;
    } catch (e) {
      cached = fresh(16);
      return cached;
    }
  }

  /* Whatever is stored, trimmed to what a board will accept. Empty is a
     perfectly good answer and every board renders it as "anon". */
  function handle(next) {
    if (next !== undefined) {
      var h = String(next == null ? '' : next).replace(/\s+/g, ' ').trim().slice(0, 12);
      try { localStorage.setItem(HANDLE_KEY, h); } catch (e) {}
      return h;
    }
    try { return (localStorage.getItem(HANDLE_KEY) || '').slice(0, 12); }
    catch (e) { return ''; }
  }

  /* A GET with the id attached, parsed, and never throwing: a shared
     surface that cannot be reached should render as a state on the page,
     the same way the generator client does it. */
  function get(url) {
    var join = url.indexOf('?') >= 0 ? '&' : '?';
    return fetch(url + join + 't=' + encodeURIComponent(id()))
      .then(function (r) { return r.json(); })
      .catch(function () { return { ok: false, why: 'unreachable' }; });
  }

  function post(url, body) {
    var payload = Object.assign({ token: id() }, body || {});
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); })
      .catch(function () { return { ok: false, why: 'unreachable' }; });
  }

  /* What to put on the page when the shared side is not there. Every toy
     that shares something uses the same wording, because it is the same
     situation and it is not the visitor's fault. */
  var WHY = {
    no_store:  'This one keeps something that everybody shares, and the shared storage is not ' +
               'mounted on this server. Nothing you can do from here — the rest of the cabinet ' +
               'is unaffected.',
    unreachable: 'Could not reach the server just now. Try again in a moment.',
    too_many:  'That is a lot of writing in one hour. Have a break and come back.',
    too_soon:  'Not quite yet — give it a moment.',
    no_links:  'No links, sorry. That rule exists because of what link spam is for.',
    too_long:  'That is longer than this will take.',
    empty:     'There is nothing there to add.',
    bad_token: 'This browser would not identify itself, which usually means storage is blocked.',
    no_budget: 'You have used your pixels for now. They come back.',
    unknown_board: 'No such board.',
    your_turn_passed: 'You wrote the last one. Somebody else goes next.'
  };
  function why(code) { return WHY[code] || 'Something went wrong on the shared side.'; }

  window.LCId = { id: id, handle: handle, get: get, post: post, why: why, WHY: WHY };
})();
