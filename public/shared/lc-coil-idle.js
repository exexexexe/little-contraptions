/* ------------------------------------------------------------------ *
 *  The idle coil — a small, self-contained, droppable component.
 *
 *  A rainbow coil hanging in a box, wobbling gently on its own, which
 *  you can click to boop. It is the Endless Coil's little brother and
 *  it is meant to be picked up and put somewhere else.
 *
 *  WHY IT DOES ITS OWN PHYSICS. The big coil next door runs on
 *  Matter.js. This one deliberately does not: it is 90 lines of spring
 *  integration with no dependency at all, because the place this is
 *  eventually going — a live desktop widget — should not have to pull a
 *  physics engine off a CDN, and should not break when that CDN is
 *  having a bad day. A widget has to be cheap and it has to be certain.
 *
 *  NOT WIRED INTO THE DESKTOP. This file is the component only. The
 *  widget system — the toggle, the placement, the wiring into the hub
 *  shell — is a separate, supervised job, and every widget in it has to
 *  end up independently switchable rather than hidden behind one master
 *  switch. See PROGRESS.md.
 *
 *  Usage:
 *      var c = LCCoilIdle.create(canvasEl, { coils: 13 });
 *      c.boop();        // as if it had been clicked
 *      c.destroy();     // stops the loop and unbinds
 *
 *  Options: coils, hue0, hueSpan, gravity, damp, quiet (no auto-wobble).
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  function create(cv, opts) {
    if (!cv || !cv.getContext) return null;
    var o = opts || {};
    var ctx = cv.getContext('2d');

    var N = Math.max(5, Math.min(40, o.coils || 12));
    var HUE0 = o.hue0 == null ? 0 : o.hue0;
    var SPAN = o.hueSpan == null ? 300 : o.hueSpan;
    var G = o.gravity == null ? 0.34 : o.gravity;
    var DAMP = o.damp == null ? 0.965 : o.damp;
    var QUIET = !!o.quiet;

    var W = cv.width, H = cv.height;
    var REST = Math.min(18, (H * 0.62) / N);     /* how far apart at rest */
    var ANCHOR = { x: W / 2, y: H * 0.17 };

    /* Each ring is a point with a velocity. The top one is pinned. */
    var p = [];
    for (var i = 0; i < N; i++) {
      p.push({ x: ANCHOR.x, y: ANCHOR.y + i * REST, vx: 0, vy: 0 });
    }

    var t = 0, raf = null, alive = true, kick = 0;

    /* ---- one step ---------------------------------------------------- *
     *  Springs to the neighbour above and below, plus a much weaker one
     *  to the ring two along — the same "faint memory of being straight"
     *  the big coil uses, and the reason this reads as a spring rather
     *  than a bead necklace.
     * ------------------------------------------------------------------ */
    function step() {
      var K = 0.34, K2 = 0.05;
      for (var i = 1; i < N; i++) {
        var a = p[i];
        a.vy += G;

        var up = p[i - 1];
        var dx = a.x - up.x, dy = a.y - up.y;
        var d = Math.hypot(dx, dy) || 0.0001;
        var f = (d - REST) * K;
        a.vx -= (dx / d) * f; a.vy -= (dy / d) * f;
        if (i > 1) { up.vx += (dx / d) * f * 0.5; up.vy += (dy / d) * f * 0.5; }

        if (i >= 2) {
          var u2 = p[i - 2];
          var dx2 = a.x - u2.x, dy2 = a.y - u2.y;
          var d2 = Math.hypot(dx2, dy2) || 0.0001;
          var f2 = (d2 - REST * 2) * K2;
          a.vx -= (dx2 / d2) * f2; a.vy -= (dy2 / d2) * f2;
        }
      }

      /* a breath of its own, so it is never completely still */
      if (!QUIET) {
        var w = Math.sin(t * 0.021) * 0.05 + Math.sin(t * 0.0071 + 1.1) * 0.03;
        for (var k = 1; k < N; k++) p[k].vx += w * (k / N);
      }

      for (var j = 1; j < N; j++) {
        p[j].vx *= DAMP; p[j].vy *= DAMP;
        p[j].x += p[j].vx; p[j].y += p[j].vy;
        /* it lives in its box */
        if (p[j].y > H - 10) { p[j].y = H - 10; p[j].vy *= -0.34; }
        if (p[j].x < 12) { p[j].x = 12; p[j].vx *= -0.5; }
        if (p[j].x > W - 12) { p[j].x = W - 12; p[j].vx *= -0.5; }
      }
      p[0].x = ANCHOR.x; p[0].y = ANCHOR.y; p[0].vx = p[0].vy = 0;

      if (kick > 0) kick -= 0.04;
      t++;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      /* the peg it hangs from */
      ctx.beginPath();
      ctx.arc(ANCHOR.x, ANCHOR.y - 8, 4.5, 0, 6.283);
      ctx.fillStyle = '#9A93B4';
      ctx.fill();

      for (var i = 0; i < N; i++) {
        var a = p[i];
        var prev = p[Math.max(0, i - 1)], next = p[Math.min(N - 1, i + 1)];
        var dx = next.x - prev.x, dy = next.y - prev.y;
        var ang = Math.atan2(dy, dx);
        var sep = Math.hypot(dx, dy) / 2;
        var minor = Math.max(1.8, REST * 0.5 - sep * 0.28);
        var major = Math.min(W, H) * 0.20;

        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.ellipse(0, 0, minor, major, 0, 0, 6.283);
        var hue = HUE0 + (i / Math.max(1, N - 1)) * SPAN;
        ctx.strokeStyle = 'hsl(' + hue + ',72%,42%)';
        ctx.lineWidth = 4.2;
        ctx.stroke();
        ctx.strokeStyle = 'hsl(' + hue + ',86%,62%)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
    }

    function loop() {
      if (!alive) return;
      if (!document.hidden) { step(); draw(); }
      raf = requestAnimationFrame(loop);
    }

    /* ---- a boop ------------------------------------------------------ */
    function boop(where) {
      kick = 1;
      for (var i = 1; i < N; i++) {
        var f = i / N;
        p[i].vx += (where === 'left' ? -1 : 1) * (2.6 + f * 5.2) * (0.6 + Math.random() * 0.5);
        p[i].vy -= (1.4 + f * 2.2);
      }
      if (window.LCSound) {
        LCSound.play(function (A) {
          A.blip(560, { type: 'triangle', dur: 0.34, glide: 150, level: A.cap(0.05) });
          A.blip(840, { at: 0.02, type: 'sine', dur: 0.26, glide: 240, level: A.cap(0.022) });
        });
      }
    }

    function onClick(e) {
      var r = cv.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      boop(x < 0.5 ? 'left' : 'right');
    }
    cv.addEventListener('click', onClick);

    /* reduced motion: it hangs there, and still boops when asked */
    var rm = null;
    try {
      rm = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (rm.matches) QUIET = true;
      if (rm.addEventListener) rm.addEventListener('change', function (m) { QUIET = m.matches; });
    } catch (e) {}

    loop();

    return {
      boop: boop,
      canvas: cv,
      coils: N,
      /* for a host that wants to know it is worth drawing */
      moving: function () {
        var s = 0;
        for (var i = 1; i < N; i++) s += Math.abs(p[i].vx) + Math.abs(p[i].vy);
        return s;
      },
      points: function () { return p.map(function (q) { return [Math.round(q.x), Math.round(q.y)]; }); },
      destroy: function () {
        alive = false;
        if (raf) cancelAnimationFrame(raf);
        cv.removeEventListener('click', onClick);
      }
    };
  }

  window.LCCoilIdle = { create: create };
})();
