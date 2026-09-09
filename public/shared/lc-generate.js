/* ------------------------------------------------------------------ *
 *  Shared client for POST /api/generate.
 *
 *  Every toy that calls the language model goes through this, so all of
 *  them handle a missing key, a rate limit and an outage identically.
 *  It never throws: callers always get {ok:false, kind, message} back
 *  rather than a rejected promise, so a failure can only ever become a
 *  message on the page.
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var MESSAGES = {
    no_key: 'This one needs a language model behind it, and the key is not set on the server. ' +
            'Everything else in the cabinet still works.',
    bad_key: 'The server has a key for this, but the generator would not accept it. ' +
             'Nothing you can do from here, sorry.',
    rate_limited: 'That is twenty of these in an hour, which is plenty. Try again a bit later.',
    busy: 'The generator is busy for a moment — it has a per-minute budget. Try again shortly.',
    timeout: 'The generator took too long to answer. Try again — it is usually quicker than that.',
    failed: 'The generator could not be reached just now. Try again in a moment.',
    offline: 'No connection. Try again when you have one.',
    empty: 'There was nothing to work from — fill something in first.'
  };

  function classify(status, body) {
    var err = (body && body.error) || '';
    if (err === 'no_api_key') return 'no_key';
    if (err === 'bad_api_key') return 'bad_key';
    if (err === 'upstream_rate_limited') return 'busy';        // Groq's limit, not yours
    if (err === 'rate_limited' || status === 429) return 'rate_limited';   // this hub's limit
    if (err === 'upstream_timeout' || status === 504) return 'timeout';
    if (err === 'empty_input' || err === 'bad_input') return 'empty';
    return 'failed';
  }

  /* Ask for text. Resolves to {ok:true, text, ms} or {ok:false, kind, message}. */
  function run(toy, input, opts) {
    opts = opts || {};
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, opts.timeout || 30000) : null;

    return fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toy: toy, input: input || {} }),
      signal: controller ? controller.signal : undefined
    }).then(function (r) {
      return r.text().then(function (raw) {
        var body = null;
        try { body = JSON.parse(raw); } catch (e) { /* served an error page, not JSON */ }
        if (!r.ok || !body || typeof body.text !== 'string') {
          var kind = classify(r.status, body);
          return { ok: false, kind: kind, message: (body && body.message) || MESSAGES[kind], status: r.status };
        }
        return { ok: true, text: body.text, ms: body.ms, remaining: body.remaining, model: body.model };
      });
    }).catch(function (e) {
      var aborted = e && (e.name === 'AbortError');
      var offline = typeof navigator !== 'undefined' && navigator.onLine === false;
      var kind = aborted ? 'timeout' : (offline ? 'offline' : 'failed');
      return { ok: false, kind: kind, message: MESSAGES[kind] };
    }).then(function (out) {
      if (timer) clearTimeout(timer);
      return out;
    });
  }

  /* Models are asked for JSON but do not always send it. Pull the object
     out of whatever came back, and return null rather than throwing so the
     caller can fall back to its own generator. */
  function parseJSON(text) {
    if (typeof text !== 'string') return null;
    var t = text.trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```$/, '')
      .trim();
    try { return JSON.parse(t); } catch (e) { /* try harder below */ }
    var first = t.indexOf('{'), last = t.lastIndexOf('}');
    if (first >= 0 && last > first) {
      try { return JSON.parse(t.slice(first, last + 1)); } catch (e) { /* give up */ }
    }
    return null;
  }

  /* Shape guard: every field a toy needs, present and the right sort of
     thing, or null. Keeps half-formed output from reaching the page. */
  function need(obj, spec) {
    if (!obj || typeof obj !== 'object') return null;
    var out = {};
    for (var k in spec) {
      if (!Object.prototype.hasOwnProperty.call(spec, k)) continue;
      var want = spec[k], v = obj[k];
      if (want === 'string') {
        if (typeof v !== 'string' || !v.trim()) return null;
        out[k] = v.trim();
      } else if (want === 'number') {
        var n = Number(v);
        if (!isFinite(n)) return null;
        out[k] = n;
      } else if (want === 'array') {
        if (!Array.isArray(v) || !v.length) return null;
        out[k] = v;
      } else if (want === 'string?') {
        out[k] = typeof v === 'string' ? v.trim() : '';
      }
    }
    return out;
  }

  window.LCGenerate = { run: run, parseJSON: parseJSON, need: need, MESSAGES: MESSAGES };
})();
