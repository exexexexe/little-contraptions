/* ------------------------------------------------------------------ *
 *  One mute switch for the whole cabinet.
 *
 *  Every toy that makes a noise on a button press goes through here, so
 *  there is exactly one preference and it is remembered across all of
 *  them: mute the excuse generator and the conspiracy board is muted too.
 *  The key is deliberately shared rather than per-toy, because a person
 *  who turns sound off has told you something about the room they are
 *  in, not about one page.
 *
 *  Sound is on by default. Nothing can play on load — a Web Audio
 *  context will not start without a gesture, and every cue in the
 *  cabinet is triggered by a deliberate click — so the first noise a
 *  visitor hears is one they asked for, and the switch is sitting
 *  next to the button that made it.
 *
 *  Levels are kept low on purpose. The house ceiling is 0.14 and most
 *  cues sit between 0.04 and 0.10; anything louder is a bug.
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var KEY = 'lc-sound';
  var CEILING = 0.14;
  var listeners = [];
  var enabled = true;

  try {
    var v = localStorage.getItem(KEY);
    if (v === 'off') enabled = false;
  } catch (e) { /* private mode: sound stays on, preference is not kept */ }

  function set(on) {
    enabled = !!on;
    try { localStorage.setItem(KEY, enabled ? 'on' : 'off'); } catch (e) {}
    // the toys that build their noises straight off the shared bench are
    // muted at the bench, not here — this is what reaches them
    if (typeof LCAudio !== 'undefined' && LCAudio.setMuted) LCAudio.setMuted(!enabled);
    listeners.forEach(function (fn) { try { fn(enabled); } catch (e) {} });
    return enabled;
  }

  /* Play a cue. The callback is handed LCAudio's bench plus `cap`, which
     clamps a level to the house ceiling so no single toy can be the loud
     one. Silently does nothing when muted or when there is no audio at
     all, so no caller ever has to check. */
  function play(fn) {
    if (!enabled) return false;
    if (typeof LCAudio === 'undefined') return false;
    LCAudio.sting(function (A) {
      A.cap = function (v) { return Math.min(CEILING, Math.max(0, v)); };
      fn(A);
    });
    return true;
  }

  /* A muted output for a toy that builds its own AudioContext rather than
     using the shared bench. Connect to this instead of ctx.destination and
     the cabinet's switch reaches it like everything else.

     The bench has its own gate in lc-audio.js; this is the same idea for
     the handful of toys that predate it and own their context outright.
     Ramped rather than stepped, because cutting a running voice to zero
     is itself a click. */
  function gate(ctx) {
    var g = ctx.createGain();
    g.gain.value = enabled ? 1 : 0;
    g.connect(ctx.destination);
    listeners.push(function (on) {
      try {
        var t = ctx.currentTime;
        g.gain.cancelScheduledValues(t);
        g.gain.setValueAtTime(g.gain.value, t);
        g.gain.linearRampToValueAtTime(on ? 1 : 0, t + 0.04);
      } catch (e) { /* the toy goes on working; only the fade is lost */ }
    });
    return g;
  }

  /* ---- the switch --------------------------------------------------- *
   * A small speaker in the bottom-right, deliberately opposite the back
   * button so the two never fight. It takes its colours from whatever
   * page it lands on via currentColor, so it does not need to know
   * anything about the toy's palette.
   * ------------------------------------------------------------------ */
  function mount(opts) {
    opts = opts || {};
    if (document.getElementById('lc-sound-btn')) return document.getElementById('lc-sound-btn');

    var css = document.createElement('style');
    css.textContent =
      '#lc-sound-btn{position:fixed;right:14px;bottom:14px;z-index:9999;width:38px;height:38px;' +
      'display:inline-flex;align-items:center;justify-content:center;padding:0;cursor:pointer;' +
      'border-radius:999px;border:1px solid currentColor;background:transparent;' +
      'color:' + (opts.color || 'inherit') + ';opacity:.42;' +
      'transition:opacity .16s,transform .12s}' +
      '#lc-sound-btn:hover{opacity:.92}' +
      '#lc-sound-btn:active{transform:scale(.94)}' +
      '#lc-sound-btn:focus-visible{outline:2px solid currentColor;outline-offset:3px;opacity:1}' +
      '#lc-sound-btn svg{width:17px;height:17px;display:block}' +
      '@media (max-width:520px){#lc-sound-btn{right:10px;bottom:10px}}' +
      /* 38px is under the 44px a fingertip needs, and this one sits in the
         corner a thumb reaches for. */
      '@media (pointer:coarse){#lc-sound-btn{width:44px;height:44px}' +
      '#lc-sound-btn svg{width:19px;height:19px}}' +
      '@media print{#lc-sound-btn{display:none}}';
    document.head.appendChild(css);

    var b = document.createElement('button');
    b.id = 'lc-sound-btn';
    b.type = 'button';
    if (opts.color) b.style.color = opts.color;

    function paint() {
      b.setAttribute('aria-pressed', String(enabled));
      b.setAttribute('aria-label', enabled ? 'Sound is on. Turn it off.' : 'Sound is off. Turn it on.');
      b.title = enabled ? 'sound on' : 'sound off';
      b.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" fill="currentColor" stroke="none"/>' +
        (enabled
          ? '<path d="M15.6 9.2a4 4 0 0 1 0 5.6"/><path d="M18.2 6.6a7.6 7.6 0 0 1 0 10.8"/>'
          : '<path d="M16 9.6l5 4.8"/><path d="M21 9.6l-5 4.8"/>') +
        '</svg>';
    }
    b.addEventListener('click', function () {
      set(!enabled);
      paint();
      /* a click of confirmation, but only when turning it back ON —
         confirming a mute by making a noise would be absurd */
      if (enabled) play(function (A) {
        A.blip(760, { dur: 0.07, level: A.cap(0.05), reverb: false });
      });
    });
    paint();
    listeners.push(paint);
    document.body.appendChild(b);
    return b;
  }

  window.LCSound = {
    get on() { return enabled; },
    set: set,
    toggle: function () { return set(!enabled); },
    play: play,
    gate: gate,
    mount: mount,
    onChange: function (fn) { listeners.push(fn); },
    CEILING: CEILING
  };
})();
