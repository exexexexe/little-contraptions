/* app.js — the bench page: the parts tray, the pointer handling, the buttons,
 * and the one animation loop that steps the simulation and draws it.
 *
 * Everything about *physics* lives in the engine. What lives here is the
 * business of getting a part from the tray onto the board and saying, in
 * words, what just happened.
 */
(function () {
  'use strict';

  var LC = window.LCContraption;
  if (!LC) return;

  var cv       = document.getElementById('cv');
  var boardEl  = document.getElementById('board');
  var trayEl   = document.getElementById('tray');
  var emptyEl  = document.getElementById('tray-empty');
  var saidEl   = document.getElementById('said');
  var goalEl   = document.getElementById('goal');
  var stateEl  = document.getElementById('p-state');
  var levelEl  = document.getElementById('p-level');
  var selEl    = document.getElementById('sel-level');
  var btnRun   = document.getElementById('btn-run');
  var btnReset = document.getElementById('btn-reset');
  var btnClear = document.getElementById('btn-clear');

  var board = LC.create({ canvas: cv, onChange: refresh });

  if (!board.haveMatter) {
    stateEl.textContent = 'no physics';
    saidEl.textContent = 'The physics library did not load, so the bench cannot run a machine. ' +
      'A reload usually fixes it.';
    [btnRun, btnReset, btnClear].forEach(function (b) { b.disabled = true; });
    return;
  }

  /* ---- loading levels --------------------------------------------------- */

  var levels = [], current = null;

  function say(text, tone) {
    saidEl.textContent = text;
    saidEl.className = 'said' + (tone ? ' ' + tone : '');
  }

  fetch('/workshop/levels/index.json')
    .then(function (r) { return r.json(); })
    .then(function (list) {
      levels = list;
      selEl.innerHTML = list.map(function (l, i) {
        return '<option value="' + i + '">' + l.title + '</option>';
      }).join('');
      return loadLevel(0);
    })
    .catch(function () {
      say('The list of jobs could not be fetched, so there is nothing to build. A reload usually fixes it.', 'fail');
      stateEl.textContent = 'no jobs';
    });

  function loadLevel(i) {
    return fetch('/workshop/levels/' + levels[i].file)
      .then(function (r) { return r.json(); })
      .then(function (level) {
        current = level;
        selEl.value = String(i);
        var problems = board.load(level);
        if (problems.length) {
          say('This job will not load: ' + problems.join('; '), 'fail');
          return problems;
        }
        levelEl.textContent = level.id;
        goalEl.textContent = level.goal;
        document.getElementById('tagline').textContent = level.title;
        say(level.opening || 'Lay the parts out, then start the machine.');
        return [];
      });
  }

  selEl.addEventListener('change', function () { loadLevel(+selEl.value); });

  /* ---- the tray --------------------------------------------------------- */

  function drawIcon(cvs, partName) {
    var def = LC.parts[partName];
    var c = cvs.getContext('2d');
    var w = cvs.width, h = cvs.height;
    c.clearRect(0, 0, w, h);
    if (def.icon) def.icon(c, w, h);
  }

  function refresh() {
    /* The tray is rebuilt from the board's own counts rather than kept in step
       by hand — there is then no way for the two to disagree about how many
       ramps are left. */
    var rows = board.tray;
    emptyEl.hidden = rows.length > 0;
    var keep = {};
    rows.forEach(function (row) {
      var id = 'tray-' + row.part;
      keep[id] = true;
      var el = document.getElementById(id);
      if (!el) {
        el = document.createElement('button');
        el.type = 'button'; el.id = id; el.className = 'part';
        el.setAttribute('aria-pressed', 'false');
        el.dataset.part = row.part;
        var ic = document.createElement('canvas');
        ic.width = 76; ic.height = 60;
        el.appendChild(ic);
        var n = document.createElement('span');
        n.className = 'n'; n.textContent = LC.parts[row.part].label;
        el.appendChild(n);
        var left = document.createElement('span');
        left.className = 'left';
        el.appendChild(left);
        el.title = LC.parts[row.part].hint || '';
        trayEl.appendChild(el);
        drawIcon(ic, row.part);
        wireTrayItem(el);
      }
      var n = row.count - row.used;
      el.querySelector('.left').textContent = n + '/' + row.count;
      el.dataset.spent = n > 0 ? '0' : '1';
      el.setAttribute('aria-pressed', armed === row.part ? 'true' : 'false');
    });
    Array.prototype.slice.call(trayEl.querySelectorAll('.part')).forEach(function (el) {
      if (!keep[el.id]) el.remove();
    });

    var running = board.status === 'running';
    btnRun.disabled = running;
    btnRun.textContent = running ? 'Running…' : 'Start the machine';
    btnClear.disabled = running;
    stateEl.textContent = {
      idle: 'bench ready', running: 'machine running',
      solved: 'job done', failed: 'no good'
    }[board.status] || board.status;

    if (board.message) {
      say(board.message, 'fail');
      board.message = '';
    } else if (board.status === 'solved') {
      say(current && current.won ? current.won : 'That did it — the job is done.', 'win');
    } else if (board.status === 'failed') {
      say(current && current.lost ? current.lost : 'Everything has stopped, and not where it was meant to. Put it back and move something.', 'fail');
    }
  }

  /* ---- placing parts ---------------------------------------------------- */

  var armed = null;      /* a tray part waiting for a click on the board */
  var ghost = null;      /* what is drawn under the pointer while dragging */
  var dragging = null;   /* a placed part being moved */
  var rotating = null;   /* a placed part being turned by its handle */

  function toBoard(ev) {
    var r = cv.getBoundingClientRect();
    return { x: (ev.clientX - r.left) * (board.W / r.width),
             y: (ev.clientY - r.top) * (board.H / r.height) };
  }
  function overBoard(ev) {
    var r = cv.getBoundingClientRect();
    return ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
  }

  function wireTrayItem(el) {
    /* One gesture covers both habits: drag it onto the board, or click it and
       then click where it goes. The second is what a keyboard and a shaky hand
       both need, so it is not a fallback bolted on afterwards. */
    el.addEventListener('pointerdown', function (ev) {
      if (board.status === 'running' || el.dataset.spent === '1') return;
      var part = el.dataset.part;
      var moved = false;
      el.setPointerCapture(ev.pointerId);

      function move(e) {
        if (!moved && Math.hypot(e.clientX - ev.clientX, e.clientY - ev.clientY) < 6) return;
        moved = true;
        if (overBoard(e)) {
          var b = toBoard(e);
          ghost = { part: part, x: b.x, y: b.y, angle: 0, ok: board.trayLeft(part) > 0 };
        } else ghost = null;
      }
      function up(e) {
        el.releasePointerCapture(ev.pointerId);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
        if (moved) {
          if (overBoard(e)) { var b = toBoard(e); board.selected = board.add(part, b.x, b.y, 0); }
          ghost = null;
        } else {
          armed = (armed === part) ? null : part;
          refresh();
        }
      }
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });
  }

  cv.addEventListener('pointerdown', function (ev) {
    if (board.status === 'running') return;
    cv.setPointerCapture(ev.pointerId);
    var b = toBoard(ev);

    if (board.selected) {
      var h = board.handleAt(board.selected);
      if (h && Math.hypot(b.x - h.x, b.y - h.y) <= h.r * 1.8) { rotating = board.selected; return; }
    }

    var hit = board.partAt(b.x, b.y);
    if (hit) {
      board.selected = hit;
      dragging = { p: hit, dx: hit.x - b.x, dy: hit.y - b.y };
      armed = null; refresh();
      return;
    }

    if (armed) {
      var p = board.add(armed, b.x, b.y, 0);
      board.selected = p;
      if (board.trayLeft(armed) <= 0) armed = null;
      refresh();
      return;
    }
    board.selected = null;
  });

  cv.addEventListener('pointermove', function (ev) {
    var b = toBoard(ev);
    if (rotating) {
      /* The handle sits above the part, so the angle from part to pointer is
         the part's angle plus a quarter turn. Snapped to 15 degrees: free
         rotation makes a level that solved once impossible to solve again. */
      var a = Math.atan2(b.y - rotating.y, b.x - rotating.x) * 180 / Math.PI + 90;
      board.rotate(rotating, Math.round(a / 15) * 15 - rotating.angle);
      return;
    }
    if (dragging) { board.moveTo(dragging.p, b.x + dragging.dx, b.y + dragging.dy); return; }
    if (armed) { ghost = { part: armed, x: b.x, y: b.y, angle: 0, ok: true }; return; }
    boardEl.classList.toggle('over-part', !!board.partAt(b.x, b.y) && board.status !== 'running');
  });

  function endPointer(ev) {
    if (cv.hasPointerCapture && ev.pointerId != null && cv.hasPointerCapture(ev.pointerId)) {
      cv.releasePointerCapture(ev.pointerId);
    }
    dragging = null; rotating = null;
  }
  cv.addEventListener('pointerup', endPointer);
  cv.addEventListener('pointercancel', endPointer);
  cv.addEventListener('pointerleave', function () { if (!dragging && !rotating) ghost = null; });

  document.addEventListener('keydown', function (ev) {
    if (board.status === 'running' || !board.selected) return;
    var p = board.selected, g = board.GRID, done = true;
    switch (ev.key) {
      case '[': case ',': board.rotate(p, -15); break;
      case ']': case '.': board.rotate(p, 15); break;
      case 'Backspace': case 'Delete': board.remove(p); break;
      case 'ArrowLeft':  board.moveTo(p, p.x - g, p.y); break;
      case 'ArrowRight': board.moveTo(p, p.x + g, p.y); break;
      case 'ArrowUp':    board.moveTo(p, p.x, p.y - g); break;
      case 'ArrowDown':  board.moveTo(p, p.x, p.y + g); break;
      default: done = false;
    }
    if (done) ev.preventDefault();
  });

  /* ---- the buttons ------------------------------------------------------ */

  btnRun.addEventListener('click', function () {
    armed = null; ghost = null;
    board.run();
    say('Running.');
  });
  btnReset.addEventListener('click', function () {
    board.reset();
    say('Back where you left it. Move something and start it again.');
  });
  btnClear.addEventListener('click', function () {
    board.clear();
    armed = null; ghost = null;
    say('Bench cleared.');
  });

  /* ---- the loop ---------------------------------------------------------
     One frame is one simulation step. At 60fps that is real time; if the tab
     is throttled the machine runs slower rather than skipping ahead, which is
     the honest behaviour for something whose whole claim is that it simulates
     rather than animates. */
  (function frame() {
    if (board.status === 'running') board.step();
    boardEl.classList.toggle('placing', !!(dragging || rotating));
    board.draw(ghost);
    requestAnimationFrame(frame);
  })();

  /* The verification harness drives the bench through this. It is the same
     board object the page uses — nothing about a headless run is a special
     code path, which is the only way the run can stand for the real one. */
  window.LCBench = {
    board: board,
    levels: function () { return levels; },
    load: function (id) {
      var i = levels.findIndex(function (l) { return l.id === id; });
      return i < 0 ? Promise.reject(new Error('no level ' + id)) : loadLevel(i);
    },
    applySolution: function () {
      board.clear();
      (current.solution || []).forEach(function (s) {
        if (s.move) {
          var target = board.placements.filter(function (p) { return p.id === s.move; })[0];
          if (!target) throw new Error('solution moves "' + s.move + '", which is not on the board');
          board.moveTo(target, s.x, s.y);
          if (s.angle != null) board.rotate(target, s.angle - target.angle);
          return;
        }
        var p = board.add(s.part, s.x, s.y, s.angle || 0);
        if (!p) throw new Error('solution asks for a ' + s.part + ' the tray does not have');
      });
      return board.placements.length;
    },
    runHeadless: function (limit) { return board.runHeadless(limit); }
  };
})();
