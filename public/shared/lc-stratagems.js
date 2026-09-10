/* ------------------------------------------------------------------ *
 *  Directional codes.
 *
 *  Five arrow sequences hidden in the front door, in the same spirit as
 *  the Konami code that is already there: type the arrows, get a small
 *  thing.
 *
 *  The nod is to Helldivers 2, whose whole input language is arrow
 *  sequences and whose register is a very funny satire of cheerful
 *  wartime propaganda. Everything that appears here is written and drawn
 *  for this cabinet: the sequences are this page's own, the pixel
 *  animations are drawn a rectangle at a time in the code below, and
 *  every slogan is invented. There is no game footage, no game art, no
 *  game audio and no game text anywhere in this file, and none of these
 *  are the real stratagem codes. One of them links to Arrowhead's actual
 *  website, because if the joke lands you should be able to go and find
 *  the people who wrote it.
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var CODES = [
    {
      id: 'studio',
      seq: ['up', 'down', 'right', 'left', 'up'],
      name: 'WHO ACTUALLY MAKES IT',
      line: 'This is a nod, not the thing itself. The people who wrote the real joke are through here.',
      link: { href: 'https://www.arrowheadgamestudios.com/', label: 'arrowheadgamestudios.com' },
      draw: drawStudio
    },
    {
      id: 'ballot',
      seq: ['down', 'down', 'up', 'right', 'left'],
      name: 'MANAGED DEMOCRACY',
      line: 'Your vote has been received, counted, and improved.',
      draw: drawBallot
    },
    {
      id: 'brew',
      seq: ['right', 'right', 'up', 'up', 'down'],
      name: 'MORNING BREW',
      line: 'Freedom is best served hot and at a sustainable rate.',
      draw: drawBrew
    },
    {
      id: 'resupply',
      seq: ['left', 'down', 'right', 'up', 'up'],
      name: 'RESUPPLY INBOUND',
      line: 'Please stand clear of the drop zone. Please also stand in the drop zone.',
      draw: drawPod
    },
    {
      id: 'officer',
      seq: ['up', 'right', 'down', 'left', 'up'],
      name: 'MORALE INSPECTION',
      line: 'Your enthusiasm has been logged as adequate. Carry on.',
      draw: drawOfficer
    }
  ];

  var KEYMAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
  var GLYPH = { up: '▲', down: '▼', left: '◀', right: '▶' };
  var LONGEST = CODES.reduce(function (m, c) { return Math.max(m, c.seq.length); }, 0);

  var buffer = [];
  var lastKey = 0;
  var trail = null;
  var panel = null;
  var raf = 0;
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- the little trail, which only appears once you are clearly
     pressing arrows on purpose --------------------------------------- */
  function showTrail() {
    if (!trail) {
      trail = document.createElement('div');
      trail.id = 'lc-strat-trail';
      trail.setAttribute('aria-hidden', 'true');
      trail.style.cssText =
        'position:fixed;right:14px;bottom:14px;z-index:9998;display:flex;gap:5px;' +
        'padding:7px 11px;border-radius:999px;pointer-events:none;' +
        'background:rgba(12,14,10,.82);border:1px solid rgba(230,200,90,.45);' +
        'font:13px/1 ui-monospace,"SF Mono",Menlo,monospace;color:#E8C85A;' +
        'letter-spacing:.22em;opacity:0;transition:opacity .18s';
      document.body.appendChild(trail);
    }
    trail.textContent = buffer.slice(-LONGEST).map(function (d) { return GLYPH[d]; }).join('');
    trail.style.opacity = buffer.length >= 2 ? '1' : '0';
  }
  function hideTrail() {
    if (trail) trail.style.opacity = '0';
  }

  /* ================================================================== *
   *  The panel. Pixel art, drawn a rectangle at a time.
   * ================================================================== */
  var PX = 4, W = 88, H = 72;      /* the art is 88x72 "pixels", shown at 4x */

  function open(code) {
    /* Reported here rather than at each matcher: a code can arrive from
       the keyboard, from a swipe, or from the public API, and all three
       end up in this function. One call site cannot go out of step. */
    if (window.LCAch) LCAch.fire('strat.' + code.id);
    close();
    panel = document.createElement('div');
    panel.className = 'lc-strat';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', code.name);
    panel.style.cssText =
      'position:fixed;right:16px;bottom:16px;z-index:10000;width:min(320px,calc(100vw - 32px));' +
      'background:#12140E;border:2px solid #E8C85A;border-radius:4px;' +
      'box-shadow:0 14px 40px rgba(0,0,0,.6);overflow:hidden;' +
      'font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;color:#E8E2C8;' +
      (calm ? '' : 'animation:lc-strat-in .22s cubic-bezier(.2,.9,.3,1.2)');

    panel.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;' +
      'background:#E8C85A;color:#12140E;padding:5px 8px;font-size:10px;letter-spacing:.18em;font-weight:700">' +
        '<span>' + code.name + '</span>' +
        '<button type="button" data-close style="font:inherit;font-size:12px;line-height:1;' +
        'background:none;border:0;color:#12140E;cursor:pointer;padding:2px 4px">✕</button>' +
      '</div>' +
      '<canvas width="' + (W * PX) + '" height="' + (H * PX) + '" ' +
      'style="display:block;width:100%;height:auto;image-rendering:pixelated"></canvas>' +
      '<div style="padding:10px 11px 12px;font-size:11.5px;line-height:1.65;color:#BFC0A4">' +
        code.line +
        (code.link
          ? '<div style="margin-top:9px"><a href="' + code.link.href + '" target="_blank" ' +
            'rel="noopener noreferrer" style="color:#E8C85A;text-decoration:underline;' +
            'text-underline-offset:3px">' + code.link.label + ' ↗</a></div>'
          : '') +
        '<div style="margin-top:9px;font-size:9px;letter-spacing:.14em;color:#6E7058">' +
          'DRAWN HERE &middot; NOT FROM THE GAME' +
        '</div>' +
      '</div>';

    document.body.appendChild(panel);
    panel.querySelector('[data-close]').addEventListener('click', close);

    var cv = panel.querySelector('canvas');
    var ctx = cv.getContext('2d');
    var t0 = performance.now();
    (function frame(now) {
      if (!panel || !panel.isConnected) return;
      var t = (now - t0) / 1000;
      ctx.imageSmoothingEnabled = false;
      code.draw(pen(ctx), calm ? 1.4 : t);
      if (t > 9) return close();
      raf = requestAnimationFrame(frame);
    })(performance.now());
  }

  function close() {
    cancelAnimationFrame(raf);
    if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
    panel = null;
  }

  /* A pen in art pixels, so every drawing below reads as coordinates on
     an 88x72 grid rather than as canvas arithmetic. */
  function pen(ctx) {
    return {
      clear: function (c) { ctx.fillStyle = c || '#12140E'; ctx.fillRect(0, 0, W * PX, H * PX); },
      r: function (x, y, w, h, c) {
        ctx.fillStyle = c;
        ctx.fillRect(Math.round(x) * PX, Math.round(y) * PX,
                     Math.max(0, Math.round(w)) * PX, Math.max(0, Math.round(h)) * PX);
      },
      text: function (s, x, y, c) {
        ctx.fillStyle = c;
        ctx.font = 'bold ' + (5 * PX) + 'px ui-monospace,monospace';
        ctx.textAlign = 'center';
        ctx.fillText(s, x * PX, y * PX);
      }
    };
  }

  var GOLD = '#E8C85A', GOLD2 = '#B49034', DARK = '#12140E',
      STEEL = '#6E7466', STEEL2 = '#4A5044', BONE = '#E8E2C8', RUST = '#C0563A';

  /* ---- 1. the studio: an arrow, because that is the joke ------------ */
  function drawStudio(p, t) {
    p.clear();
    for (var i = 0; i < 5; i++) {
      var y = 4 + ((t * 9 + i * 14) % 80);
      p.r(0, y, W, 1, '#1A1D14');
    }
    var bob = Math.round(Math.sin(t * 2.2) * 2);
    /* an arrowhead, drawn as a stepped triangle over a shaft */
    for (var k = 0; k < 14; k++) {
      p.r(44 - k, 20 + k + bob, k * 2 + 1, 1, k > 10 ? GOLD2 : GOLD);
    }
    p.r(40, 34 + bob, 9, 22, GOLD2);
    p.r(42, 34 + bob, 5, 22, GOLD);
    /* three flights */
    p.r(33, 48 + bob, 7, 3, GOLD2);
    p.r(49, 48 + bob, 7, 3, GOLD2);
    p.text('↗', 44, 68, STEEL);
  }

  /* ---- 2. the ballot box, and the stamp ----------------------------- */
  function drawBallot(p, t) {
    p.clear();
    p.r(0, 56, W, 16, '#1C2016');
    var cycle = t % 3;
    /* the box */
    p.r(24, 34, 40, 24, STEEL2);
    p.r(24, 34, 40, 2, STEEL);
    p.r(38, 32, 12, 2, DARK);
    p.r(26, 40, 36, 2, '#3A4034');
    p.text('✚', 44, 54, GOLD);
    /* a paper going in, then a stamp coming down on it */
    if (cycle < 1.2) {
      var drop = Math.min(30, cycle * 34);
      p.r(40, 2 + drop, 8, 10, BONE);
      p.r(41, 4 + drop, 6, 1, STEEL2);
      p.r(41, 6 + drop, 6, 1, STEEL2);
    } else if (cycle < 2.1) {
      var s = (cycle - 1.2) / 0.9;
      var sy = s < .5 ? 2 + s * 40 : 22 - (s - .5) * 30;
      p.r(34, sy, 20, 10, RUST);
      p.r(36, sy + 10, 16, 4, '#8E3A26');
      if (s > .45 && s < .75) p.text('APPROVED', 44, 24, GOLD);
    } else {
      /* the flag, unfurling a slogan of this cabinet's own */
      var w = Math.min(56, (cycle - 2.1) * 90);
      p.r(14, 10, 3, 22, STEEL);
      p.r(17, 10, w, 14, GOLD);
      p.r(17, 24, w, 2, GOLD2);
      if (w > 40) {
        p.r(24, 14, 4, 4, DARK); p.r(32, 14, 4, 4, DARK);
        p.r(40, 14, 4, 4, DARK); p.r(48, 14, 4, 4, DARK);
        p.r(56, 14, 4, 4, DARK);
      }
    }
  }

  /* ---- 3. a cup of something, steaming ------------------------------ */
  function drawBrew(p, t) {
    p.clear();
    p.r(0, 58, W, 14, '#1C2016');
    /* the cup */
    p.r(30, 36, 28, 22, BONE);
    p.r(30, 36, 28, 3, '#C8C4AC');
    p.r(32, 39, 24, 3, '#8E4A2E');           /* what is in it */
    p.r(58, 41, 6, 3, BONE);                  /* the handle */
    p.r(62, 41, 3, 10, BONE);
    p.r(58, 51, 6, 3, BONE);
    p.r(26, 58, 36, 3, '#C8C4AC');            /* the saucer */
    /* steam, which rises and eventually makes a star */
    for (var i = 0; i < 3; i++) {
      var ph = t * 1.6 + i * 1.1;
      var y = 34 - ((ph * 8) % 26);
      var x = 38 + i * 6 + Math.round(Math.sin(ph * 2) * 3);
      if (y > 6) p.r(x, y, 2, 2, '#8E9482');
    }
    if ((t % 4) > 2.4) {
      var st = [[44,8],[42,10],[46,10],[40,12],[48,12],[43,14],[45,14]];
      st.forEach(function (q) { p.r(q[0], q[1], 2, 2, GOLD); });
    }
  }

  /* ---- 4. a pod, arriving with more enthusiasm than accuracy -------- */
  function drawPod(p, t) {
    p.clear('#0E1810');
    /* stars, fixed rather than twinkling, so the fall reads clearly */
    for (var s = 0; s < 22; s++) {
      p.r((s * 13) % W, (s * 7) % 34, 1, 1, '#2A3A2C');
    }
    p.r(0, 58, W, 14, '#1C2416');
    p.r(0, 58, W, 1, '#2E3A28');

    var cycle = t % 3.4;
    if (cycle < 1.5) {
      var y = -14 + (cycle / 1.5) * 66;
      /* the trail */
      for (var i = 0; i < 10; i++) p.r(41, y - i * 3, 6 - Math.floor(i / 3), 2,
        i < 3 ? '#F2E4A0' : (i < 6 ? GOLD : GOLD2));
      /* the pod */
      p.r(38, y, 12, 14, STEEL2);
      p.r(38, y, 12, 3, STEEL);
      p.r(40, y + 5, 8, 5, RUST);
    } else if (cycle < 2.0) {
      /* the landing, and the dust */
      var k = (cycle - 1.5) / 0.5;
      p.r(38, 44, 12, 14, STEEL2);
      p.r(38, 44, 12, 3, STEEL);
      var spread = Math.round(k * 26);
      p.r(44 - spread, 56, spread * 2, 3, 'rgba(140,150,120,' + (0.5 - k * 0.45).toFixed(2) + ')');
    } else {
      /* open, with the contents plainly labelled */
      p.r(36, 42, 16, 16, STEEL2);
      p.r(36, 42, 16, 3, STEEL);
      p.r(30, 40, 8, 4, STEEL);
      p.r(50, 40, 8, 4, STEEL);
      p.r(39, 46, 10, 10, GOLD);
      p.r(43, 46, 2, 10, GOLD2);
      p.r(39, 50, 10, 2, GOLD2);
      if (cycle > 2.5) p.text('SUPPLIES', 44, 30, BONE);
    }
  }

  /* ---- 5. an officer, entirely satisfied ---------------------------- */
  function drawOfficer(p, t) {
    p.clear();
    p.r(0, 60, W, 12, '#1C2016');
    var salute = (t % 3.6) > 1.8;
    /* cap */
    p.r(34, 12, 20, 5, STEEL2);
    p.r(32, 17, 24, 3, DARK);
    p.r(41, 13, 6, 3, GOLD);
    /* head and face */
    p.r(36, 20, 16, 13, '#C8A484');
    p.r(39, 25, 3, 2, DARK);
    p.r(46, 25, 3, 2, DARK);
    p.r(40, 30, 8, 1, DARK);
    /* body, with a great deal of braid */
    p.r(32, 33, 24, 27, STEEL2);
    p.r(32, 33, 24, 2, STEEL);
    p.r(42, 35, 4, 25, '#3A4034');
    for (var m = 0; m < 3; m++) p.r(35, 38 + m * 5, 4, 3, GOLD);
    /* the arm: down with a clipboard, or up in a salute */
    if (salute) {
      p.r(54, 30, 4, 12, STEEL2);
      p.r(52, 26, 8, 5, '#C8A484');
    } else {
      p.r(54, 36, 4, 14, STEEL2);
      p.r(56, 44, 12, 16, BONE);
      p.r(58, 46, 8, 1, STEEL2);
      p.r(58, 49, 8, 1, STEEL2);
      p.r(58, 52, 5, 1, STEEL2);
      p.r(59, 42, 6, 3, STEEL);
    }
    if (salute) p.text('★', 20, 30, GOLD);
  }

  /* ================================================================== *
   *  Listening.
   * ================================================================== */
  function onKey(e) {
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;

    if (e.key === 'Escape' && panel) { close(); return; }

    var dir = KEYMAP[e.key];
    if (!dir) return;

    var now = performance.now();
    if (now - lastKey > 2200) buffer.length = 0;   /* a pause is a fresh start */
    lastKey = now;

    buffer.push(dir);
    if (buffer.length > LONGEST) buffer.shift();
    showTrail();

    for (var i = 0; i < CODES.length; i++) {
      var c = CODES[i];
      if (buffer.length < c.seq.length) continue;
      if (buffer.slice(-c.seq.length).join(',') === c.seq.join(',')) {
        buffer.length = 0;
        hideTrail();
        e.preventDefault();
        open(c);
        return;
      }
    }
    setTimeout(function () { if (performance.now() - lastKey > 2100) hideTrail(); }, 2200);
  }

  window.addEventListener('keydown', onKey);

  /* ---- the same five codes, by swipe --------------------------------- *
   *  There are no arrow keys on a phone, so without this every one of
   *  these was unreachable there. A swipe arrives as the same direction
   *  the arrow key would have produced and goes through the identical
   *  matcher below — the sequence is the secret, not the keyboard.
   * ------------------------------------------------------------------ */
  function feedDirection(dir){
    var now = performance.now();
    if (now - lastKey > 2200) buffer.length = 0;
    lastKey = now;

    buffer.push(dir);
    if (buffer.length > LONGEST) buffer.shift();
    showTrail();

    for (var i = 0; i < CODES.length; i++) {
      var c = CODES[i];
      if (buffer.length < c.seq.length) continue;
      if (buffer.slice(-c.seq.length).join(',') === c.seq.join(',')) {
        buffer.length = 0;
        hideTrail();
        open(c);
        return true;
      }
    }
    setTimeout(function () { if (performance.now() - lastKey > 2100) hideTrail(); }, 2200);
    return false;
  }

  if (window.LCSwipe && LCSwipe.available) LCSwipe.on(feedDirection);

  window.LCStratagems = {
    codes: CODES,
    open: function (id) {
      var c = CODES.filter(function (x) { return x.id === id; })[0];
      if (c) open(c);
      return !!c;
    },
    close: close,
    feed: function (dirs) {
      dirs.forEach(function (d) {
        onKey({ key: 'Arrow' + d.charAt(0).toUpperCase() + d.slice(1),
                target: document.body, preventDefault: function () {} });
      });
      return !!panel;
    },
    /* the touch path, so it can be driven in a test the same way */
    swipe: function (dirs) {
      dirs.forEach(function (d) { feedDirection(d); });
      return !!panel;
    },
    isOpen: function () { return !!panel; }
  };
})();

/* the one keyframe the panel uses, added here so the module carries its
   own styling and no page has to know about it */
(function () {
  var st = document.createElement('style');
  st.textContent =
    '@keyframes lc-strat-in{from{transform:translateY(14px) scale(.96);opacity:0}' +
    'to{transform:none;opacity:1}}' +
    '.lc-strat a:focus-visible,.lc-strat button:focus-visible{outline:2px solid #E8C85A;outline-offset:2px}';
  document.head.appendChild(st);
})();
