/* ------------------------------------------------------------------ *
 *  The cabinet.
 *
 *  One virtual screen, 320x240, drawn at that size and then scaled up
 *  by a whole number with smoothing off. That single decision is what
 *  makes the pixels real: every game draws into the same small buffer,
 *  so nothing inside the cabinet can be smooth even by accident.
 *
 *  The font is a 5x7 bitmap defined below, drawn a pixel at a time.
 *  There is no webfont: a real blocky face was the requirement, and a
 *  hand-set bitmap is the only way to be sure of it at this size.
 *
 *  The palette is sixteen colours and every game is limited to it.
 *  The CRT treatment lives on the cabinet shell, once, so each game
 *  inherits it rather than re-implementing it.
 * ------------------------------------------------------------------ */
(function (global) {
  'use strict';

  var W = 320, H = 240;

  /* ---- the sixteen ---------------------------------------------- */
  var P = [
    '#0B0C14', // 0  ink
    '#232741', // 1  slate
    '#3E4A73', // 2  steel
    '#6E7BA8', // 3  haze
    '#C3CBE6', // 4  bone
    '#FFFFFF', // 5  white
    '#8A1F3C', // 6  oxblood
    '#E23B52', // 7  red
    '#F58B4C', // 8  orange
    '#F5D06B', // 9  gold
    '#2C7A3F', // 10 green
    '#7ED957', // 11 lime
    '#2E6FB8', // 12 blue
    '#58C7E8', // 13 cyan
    '#8A5BC7', // 14 violet
    '#E27BB8'  // 15 pink
  ];

  /* ---- 5x7 bitmap font, set by hand ------------------------------ */
  var GLYPHS = {
    ' ': '...../...../...../...../...../...../.....',
    'A': '.###./#...#/#...#/#####/#...#/#...#/#...#',
    'B': '####./#...#/####./#...#/#...#/#...#/####.',
    'C': '.###./#...#/#..../#..../#..../#...#/.###.',
    'D': '####./#...#/#...#/#...#/#...#/#...#/####.',
    'E': '#####/#..../#..../####./#..../#..../#####',
    'F': '#####/#..../#..../####./#..../#..../#....',
    'G': '.###./#...#/#..../#.###/#...#/#...#/.###.',
    'H': '#...#/#...#/#...#/#####/#...#/#...#/#...#',
    'I': '.###./..#../..#../..#../..#../..#../.###.',
    'J': '..###/...#./...#./...#./...#./#..#./.##..',
    'K': '#...#/#..#./#.#../##.../#.#../#..#./#...#',
    'L': '#..../#..../#..../#..../#..../#..../#####',
    'M': '#...#/##.##/#.#.#/#...#/#...#/#...#/#...#',
    'N': '#...#/##..#/#.#.#/#..##/#...#/#...#/#...#',
    'O': '.###./#...#/#...#/#...#/#...#/#...#/.###.',
    'P': '####./#...#/#...#/####./#..../#..../#....',
    'Q': '.###./#...#/#...#/#...#/#.#.#/#..#./.##.#',
    'R': '####./#...#/#...#/####./#.#../#..#./#...#',
    'S': '.####/#..../#..../.###./....#/....#/####.',
    'T': '#####/..#../..#../..#../..#../..#../..#..',
    'U': '#...#/#...#/#...#/#...#/#...#/#...#/.###.',
    'V': '#...#/#...#/#...#/#...#/#...#/.#.#./..#..',
    'W': '#...#/#...#/#...#/#...#/#.#.#/##.##/#...#',
    'X': '#...#/#...#/.#.#./..#../.#.#./#...#/#...#',
    'Y': '#...#/#...#/.#.#./..#../..#../..#../..#..',
    'Z': '#####/....#/...#./..#../.#.../#..../#####',
    '0': '.###./#...#/#..##/#.#.#/##..#/#...#/.###.',
    '1': '..#../.##../..#../..#../..#../..#../.###.',
    '2': '.###./#...#/....#/...#./..#../.#.../#####',
    '3': '#####/...#./..#../...#./....#/#...#/.###.',
    '4': '...#./..##./.#.#./#..#./#####/...#./...#.',
    '5': '#####/#..../####./....#/....#/#...#/.###.',
    '6': '..##./.#.../#..../####./#...#/#...#/.###.',
    '7': '#####/....#/...#./..#../.#.../.#.../.#...',
    '8': '.###./#...#/#...#/.###./#...#/#...#/.###.',
    '9': '.###./#...#/#...#/.####/....#/...#./.##..',
    '.': '...../...../...../...../...../.##../.##..',
    ',': '...../...../...../...../.##../.##../.#...',
    ':': '...../.##../.##../...../.##../.##../.....',
    '-': '...../...../...../#####/...../...../.....',
    '_': '...../...../...../...../...../...../#####',
    '+': '...../..#../..#../#####/..#../..#../.....',
    '=': '...../...../#####/...../#####/...../.....',
    '/': '....#/...#./..#../..#../.#.../#..../#....',
    '!': '..#../..#../..#../..#../..#../...../..#..',
    '?': '.###./#...#/....#/...#./..#../...../..#..',
    "'": '..#../..#../...../...../...../...../.....',
    '"': '.#.#./.#.#./...../...../...../...../.....',
    '(': '...#./..#../.#.../.#.../.#.../..#../...#.',
    ')': '.#.../..#../...#./...#./...#./..#../.#...',
    '<': '...#./..#../.#.../#..../.#.../..#../...#.',
    '>': '.#.../..#../...#./....#/...#./..#../.#...',
    '*': '...../#.#.#/.###./#####/.###./#.#.#/.....',
    '%': '##..#/##..#/...#./..#../.#.../#..##/#..##',
    '#': '.#.#./#####/.#.#./#####/.#.#./...../.....',
    '&': '.##../#..#./.##../.##.#/#..##/#..#./.##.#',
    '@': '.###./#...#/#.###/#.#.#/#.###/#..../.###.',
    '$': '..#../.####/#.#../.###./..#.#/####./..#..',
    '[': '.###./.#.../.#.../.#.../.#.../.#.../.###.',
    ']': '.###./...#./...#./...#./...#./...#./.###.',
    'a': '.###./#...#/#...#/#####/#...#/#...#/#...#'
  };
  // parse once into arrays of row bitmasks
  var FONT = {};
  Object.keys(GLYPHS).forEach(function (ch) {
    FONT[ch] = GLYPHS[ch].split('/').map(function (row) {
      var bits = 0;
      for (var i = 0; i < 5; i++) if (row[i] === '#') bits |= (1 << (4 - i));
      return bits;
    });
  });

  /* ---- the drawing surface -------------------------------------- */
  function Gfx(ctx) {
    this.c = ctx;
  }
  Gfx.prototype.clear = function (col) {
    this.c.fillStyle = P[col == null ? 0 : col];
    this.c.fillRect(0, 0, W, H);
  };
  Gfx.prototype.rect = function (x, y, w, h, col) {
    this.c.fillStyle = P[col];
    this.c.fillRect(x | 0, y | 0, Math.max(0, w | 0), Math.max(0, h | 0));
  };
  Gfx.prototype.frame = function (x, y, w, h, col) {
    this.rect(x, y, w, 1, col); this.rect(x, y + h - 1, w, 1, col);
    this.rect(x, y, 1, h, col); this.rect(x + w - 1, y, 1, h, col);
  };
  Gfx.prototype.px = function (x, y, col) { this.rect(x, y, 1, 1, col); };
  Gfx.prototype.circle = function (cx, cy, r, col) {
    // integer midpoint fill, so the edge stays chunky
    this.c.fillStyle = P[col];
    for (var y = -r; y <= r; y++) {
      var span = Math.floor(Math.sqrt(r * r - y * y));
      this.c.fillRect((cx - span) | 0, (cy + y) | 0, span * 2 + 1, 1);
    }
  };
  Gfx.prototype.line = function (x0, y0, x1, y1, col) {
    x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0;
    var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    var sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, err = dx - dy;
    for (;;) {
      this.px(x0, y0, col);
      if (x0 === x1 && y0 === y1) break;
      var e2 = err * 2;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }
  };
  /* text: 5x7 glyphs on a 6x8 cell, optional integer scale */
  Gfx.prototype.text = function (str, x, y, col, scale) {
    scale = scale || 1;
    str = String(str).toUpperCase();
    this.c.fillStyle = P[col];
    var cx = x | 0;
    for (var i = 0; i < str.length; i++) {
      var g = FONT[str[i]] || FONT['?'];
      for (var r = 0; r < 7; r++) {
        var bits = g[r];
        if (!bits) continue;
        for (var b = 0; b < 5; b++) {
          if (bits & (1 << (4 - b))) {
            this.c.fillRect(cx + b * scale, (y | 0) + r * scale, scale, scale);
          }
        }
      }
      cx += 6 * scale;
    }
  };
  Gfx.prototype.textW = function (str, scale) { return String(str).length * 6 * (scale || 1) - (scale || 1); };
  Gfx.prototype.textC = function (str, y, col, scale) {
    this.text(str, (W - this.textW(str, scale)) / 2, y, col, scale);
  };
  /* sprite: array of strings, each char a palette digit, '.' transparent */
  Gfx.prototype.sprite = function (rows, x, y, flip) {
    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      for (var i = 0; i < row.length; i++) {
        var ch = row[i];
        if (ch === '.') continue;
        var col = parseInt(ch, 16);
        this.rect(x + (flip ? row.length - 1 - i : i), y + r, 1, 1, col);
      }
    }
  };

  /* ---- input ----------------------------------------------------- */
  var keys = {}, pressed = {};
  var MAP = {
    ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
    a: 'left', d: 'right', w: 'up', s: 'down',
    A: 'left', D: 'right', W: 'up', S: 'down',
    z: 'a', Z: 'a', ' ': 'a', Enter: 'start',
    x: 'b', X: 'b', Escape: 'back'
  };

  var A = {
    W: W, H: H, P: P,
    key: function (k) { return !!keys[k]; },
    hit: function (k) { if (pressed[k]) { pressed[k] = false; return true; } return false; },
    games: [],
    register: function (g) { A.games.push(g); }
  };

  function setKey(name, down) {
    if (!name) return;
    if (down && !keys[name]) pressed[name] = true;
    keys[name] = down;
  }

  /* ---- boot ------------------------------------------------------ */
  A.boot = function () {
    var host = document.getElementById('cab');
    var cv = document.getElementById('screen');
    var ctx = cv.getContext('2d');
    cv.width = W; cv.height = H;
    ctx.imageSmoothingEnabled = false;
    var g = new Gfx(ctx);

    function fit() {
      // measure the window, not the host: the host is sized BY the canvas,
      // so asking it how much room there is always answers "this much".
      var availW = Math.min(window.innerWidth - 40, 1100);
      var availH = window.innerHeight - (window.matchMedia('(pointer:coarse)').matches ? 210 : 150);
      // Integer scaling above 1x keeps the pixels crisp. Below 1x, flooring
      // pinned the canvas at its full 320px and it hung off the side of a
      // phone, so under 1x it takes the exact fractional fit instead.
      var raw = Math.min(availW / W, availH / H);
      var s = raw >= 1 ? Math.floor(raw) : raw;
      cv.style.width = (W * s) + 'px';
      cv.style.height = (H * s) + 'px';
      var ov = document.getElementById('crt');
      if (ov) { ov.style.width = (W * s) + 'px'; ov.style.height = (H * s) + 'px'; }
    }
    A._fit = fit;   // exposed so the scaling can be checked from outside
    window.addEventListener('resize', fit);

    document.addEventListener('keydown', function (e) {
      var n = MAP[e.key];
      if (n) { e.preventDefault(); setKey(n, true); }
    });
    document.addEventListener('keyup', function (e) {
      var n = MAP[e.key];
      if (n) { e.preventDefault(); setKey(n, false); }
    });
    // touch pad
    [].forEach.call(document.querySelectorAll('[data-k]'), function (b) {
      var n = b.getAttribute('data-k');
      var on = function (e) { e.preventDefault(); setKey(n, true); };
      var off = function (e) { e.preventDefault(); setKey(n, false); };
      b.addEventListener('touchstart', on, { passive: false });
      b.addEventListener('touchend', off, { passive: false });
      b.addEventListener('touchcancel', off, { passive: false });
      b.addEventListener('mousedown', on);
      b.addEventListener('mouseup', off);
      b.addEventListener('mouseleave', off);
    });

    /* ---- high scores ---- */
    var HS = {};
    try { HS = JSON.parse(localStorage.getItem('lc-arcade-hs') || '{}') || {}; } catch (e) { HS = {}; }
    A.hiscore = function (id) { return HS[id] || 0; };
    A.submit = function (id, score) {
      if (score > (HS[id] || 0)) {
        HS[id] = score;
        try { localStorage.setItem('lc-arcade-hs', JSON.stringify(HS)); } catch (e) {}
        return true;
      }
      return false;
    };

    /* ---- the shared board ----------------------------------------- *
     *  The local best above is still the number on the menu, because that
     *  one is instant and always true. This is the other one: everybody's,
     *  fetched from the same SQLite the guestbook and the canvas use.
     *
     *  Nothing here can stop the cabinet. If the server has no shared
     *  storage, or the fetch fails, `A.board` simply reports it and the
     *  screen says so in the cabinet's own voice; the games are untouched.
     * ---------------------------------------------------------------- */
    var HANDLE_KEY = 'lc-handle';
    A.handle = function (next) {
      if (next !== undefined) {
        try { localStorage.setItem(HANDLE_KEY, String(next).slice(0, 12)); } catch (e) {}
        return next;
      }
      try { return (localStorage.getItem(HANDLE_KEY) || '').slice(0, 12); } catch (e) { return ''; }
    };

    A.boardId = function (id) { return 'arcade:' + id; };

    A.fetchBoard = function (id) {
      if (!window.LCId) return Promise.resolve({ ok: false, why: 'no_store' });
      return LCId.get('/api/scores?board=' + encodeURIComponent(A.boardId(id)));
    };
    A.postScore = function (id, score, handle) {
      if (!window.LCId) return Promise.resolve({ ok: false, why: 'no_store' });
      A.handle(handle);
      return LCId.post('/api/scores', {
        board: A.boardId(id), score: score, handle: handle
      });
    };

    /* ---- HUD, in 1980s cabinet conventions ---- */
    A.hud = function (g, opts) {
      g.rect(0, 0, W, 11, 1);
      g.rect(0, 11, W, 1, 2);
      g.text(opts.left || '', 4, 2, 9);
      if (opts.right != null) g.text(opts.right, W - g.textW(opts.right) - 4, 2, 4);
      if (opts.mid != null) g.textC(opts.mid, 2, 13);
      if (opts.lives != null) {
        for (var i = 0; i < opts.lives; i++) {
          g.sprite(['.7.', '777', '7.7'], 150 + i * 6, 2);
        }
      }
    };

    /* ---- state ---- */
    var mode = 'menu', sel = 0, cur = null, over = 0, paused = false;
    var last = performance.now(), acc = 0;

    /* name entry and the board share one small state machine so that
       finishing a game walks you straight through both. */
    var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .-';
    var entry = { at: 0, chars: [0, 0, 0], gameId: null, score: 0, blink: 0 };
    var board = { id: null, name: '', data: null, state: 'idle', pending: false };

    function startGame(i) {
      cur = A.games[i];
      cur.reset();
      mode = 'play'; over = 0; paused = false;
    }

    function beginEntry(game, score) {
      // seed from whatever was typed last time, so a regular is not made
      // to spell their name again every round
      var was = (A.handle() || '').toUpperCase();
      for (var i = 0; i < 3; i++) {
        var k = LETTERS.indexOf(was[i] || 'A');
        entry.chars[i] = k < 0 ? 0 : k;
      }
      entry.at = 0; entry.blink = 0;
      entry.gameId = game.id; entry.score = score;
      mode = 'name';
    }

    function entryText() {
      return LETTERS[entry.chars[0]] + LETTERS[entry.chars[1]] + LETTERS[entry.chars[2]];
    }

    function openBoard(id, name) {
      board.id = id; board.name = name; board.data = null;
      board.state = 'loading'; board.pending = true;
      mode = 'board';
      A.fetchBoard(id).then(function (d) {
        board.pending = false;
        if (!d || !d.ok) { board.state = d && d.why === 'no_store' ? 'nostore' : 'failed'; return; }
        board.data = d; board.state = 'ok';
      });
    }

    function submitAndShow() {
      var name = entryText().replace(/\s+$/, '');
      A.handle(name);
      var id = entry.gameId;
      board.id = id;
      board.name = (function () {
        for (var i = 0; i < A.games.length; i++) if (A.games[i].id === id) return A.games[i].name;
        return id;
      })();
      board.data = null; board.state = 'loading'; board.pending = true;
      mode = 'board';
      A.postScore(id, entry.score, name).then(function (d) {
        board.pending = false;
        if (!d || !d.ok) { board.state = d && d.why === 'no_store' ? 'nostore' : 'failed'; return; }
        board.data = d; board.state = 'ok';
      });
    }

    function drawEntry(g) {
      g.clear(0);
      g.rect(0, 0, W, 24, 1);
      g.rect(0, 24, W, 1, 14);
      g.textC('NEW  ENTRY', 9, 9);

      g.textC('SCORE  ' + entry.score, 44, 4);
      g.textC('THREE  LETTERS  FOR  THE  BOARD', 60, 3);

      // the three slots, big
      var s = 4, w = 6 * s, gap = 14;
      var total = 3 * w + 2 * gap;
      var x0 = (W - total) / 2;
      for (var i = 0; i < 3; i++) {
        var x = x0 + i * (w + gap);
        var on = i === entry.at;
        g.text(LETTERS[entry.chars[i]], x, 90, on ? 9 : 4, s);
        g.rect(x, 90 + 7 * s + 4, w - s, 2, on ? 9 : 2);
        if (on && entry.blink < 0.5) { g.text('^', x + w / 2 - 3 * s / 2, 90 + 7 * s + 9, 13, 1); }
      }

      g.rect(0, H - 34, W, 34, 1);
      g.rect(0, H - 34, W, 1, 2);
      g.textC('UP/DOWN  LETTER   LEFT/RIGHT  SLOT', H - 27, 3);
      g.textC('Z  CONFIRM      X  SKIP THE BOARD', H - 15, 13);
    }

    function drawBoard(g) {
      g.clear(0);
      g.rect(0, 0, W, 24, 1);
      g.rect(0, 24, W, 1, 14);
      g.textC('HIGH  SCORES', 9, 9);
      g.textC(String(board.name || '').slice(0, 30), 30, 13);

      if (board.state === 'loading') { g.textC('READING  THE  BOARD...', 110, 3); }
      else if (board.state === 'nostore') {
        g.textC('NO  SHARED  BOARD  ON  THIS', 96, 8);
        g.textC('SERVER.  YOUR  OWN  BEST  IS', 108, 8);
        g.textC('STILL  KEPT  IN  THIS  BROWSER.', 120, 8);
      }
      else if (board.state === 'failed') {
        g.textC('COULD  NOT  REACH  THE  BOARD.', 104, 7);
        g.textC('THE  GAMES  ARE  FINE.', 116, 3);
      }
      else if (board.data) {
        var top = board.data.top || [];
        if (!top.length) { g.textC('NOBODY  HAS  PLAYED  THIS  YET', 108, 3); }
        for (var i = 0; i < Math.min(10, top.length); i++) {
          var r = top[i], y = 44 + i * 14;
          var col = r.you ? 9 : (i === 0 ? 13 : 4);
          if (r.you) g.rect(10, y - 3, 300, 12, 1);
          g.text(String(r.rank), 14, y, col);
          g.text(String(r.handle).toUpperCase().slice(0, 12), 44, y, col);
          var sc = String(r.score);
          g.text(sc, 300 - g.textW(sc), y, col);
        }
        var n = board.data.players || 0;
        g.textC(n + (n === 1 ? '  PLAYER' : '  PLAYERS'), 190, 2);
        if (board.data.mine) g.textC('YOU  ARE  NUMBER  ' + board.data.mine.rank, 202, 3);
      }

      g.rect(0, H - 20, W, 20, 1);
      g.rect(0, H - 20, W, 1, 2);
      g.textC('Z  OR  X  TO  GO  BACK', H - 14, 3);
    }

    function drawMenu(g) {
      g.clear(0);
      // marquee
      g.rect(0, 0, W, 30, 1);
      g.rect(0, 30, W, 1, 14);
      g.textC('LITTLE CONTRAPTIONS', 6, 9, 1);
      g.textC('ARCADE', 16, 13, 1);

      var n = A.games.length, perCol = Math.ceil(n / 2);
      for (var i = 0; i < n; i++) {
        var col = i < perCol ? 0 : 1;
        var row = i % perCol;
        var x = 12 + col * 154, y = 40 + row * 14;
        var on = i === sel;
        if (on) g.rect(x - 4, y - 3, 146, 13, 2);
        g.text(A.games[i].name, x, y, on ? 9 : 3);
        var hs = A.hiscore(A.games[i].id);
        if (hs) g.text(String(hs), x + 138 - g.textW(String(hs)), y, on ? 4 : 2);
      }
      var d = A.games[sel].desc || '';
      g.rect(0, H - 26, W, 26, 1);
      g.rect(0, H - 26, W, 1, 2);
      g.textC(d.slice(0, 44), H - 21, 3);
      g.textC('Z  START      X  HIGH SCORES', H - 11, 13);
    }

    function loop(now) {
      requestAnimationFrame(loop);
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (mode === 'menu') {
        var n = A.games.length, perCol = Math.ceil(n / 2);
        if (A.hit('down')) sel = (sel + 1) % n;
        if (A.hit('up')) sel = (sel + n - 1) % n;
        if (A.hit('right')) sel = (sel + perCol) % n;
        if (A.hit('left')) sel = (sel + n - perCol) % n;
        if (A.hit('b')) { openBoard(A.games[sel].id, A.games[sel].name); drawBoard(g); return; }
        if (A.hit('a') || A.hit('start')) startGame(sel);
        drawMenu(g);
        return;
      }

      if (mode === 'name') {
        entry.blink = (entry.blink + dt) % 1;
        if (A.hit('up'))    entry.chars[entry.at] = (entry.chars[entry.at] + 1) % LETTERS.length;
        if (A.hit('down'))  entry.chars[entry.at] = (entry.chars[entry.at] + LETTERS.length - 1) % LETTERS.length;
        if (A.hit('right')) entry.at = (entry.at + 1) % 3;
        if (A.hit('left'))  entry.at = (entry.at + 2) % 3;
        if (A.hit('b') || A.hit('back')) { mode = 'menu'; cur = null; drawMenu(g); return; }
        if (A.hit('a') || A.hit('start')) { submitAndShow(); drawBoard(g); return; }
        drawEntry(g);
        return;
      }

      if (mode === 'board') {
        if (A.hit('a') || A.hit('b') || A.hit('back') || A.hit('start')) {
          mode = 'menu'; cur = null; drawMenu(g); return;
        }
        drawBoard(g);
        return;
      }

      if (A.hit('back')) { mode = 'menu'; cur = null; return; }
      if (A.hit('start')) paused = !paused;

      if (!paused) {
        if (over > 0) {
          over -= dt;
          if (over <= 0) {
            // A zero is not worth a name; anything else gets offered the board.
            if ((cur.score | 0) > 0) { beginEntry(cur, cur.score | 0); return; }
            mode = 'menu'; cur = null; return;
          }
        } else {
          cur.step(dt, A);
          if (cur.dead) {
            A.submit(cur.id, cur.score | 0);
            over = 2.6;
          }
        }
      }
      cur.render(g, A);

      if (cur.dead) {
        g.rect(40, 96, 240, 48, 0);
        g.frame(40, 96, 240, 48, 7);
        g.textC('GAME  OVER', 108, 7, 2);
        g.textC('SCORE ' + (cur.score | 0) + '   BEST ' + A.hiscore(cur.id), 130, 9);
      }
      if (paused) {
        g.rect(100, 106, 120, 28, 0);
        g.frame(100, 106, 120, 28, 9);
        g.textC('PAUSED', 116, 9, 1);
      }
    }

    fit();
    // menu needs at least one game
    if (!A.games.length) { g.clear(0); g.textC('NO GAMES LOADED', 110, 7); return; }
    requestAnimationFrame(loop);
    A._g = g;
    A._state = function () { return { mode: mode, entry: entry, board: board, sel: sel }; };
    A._go = function (m) { mode = m; };
    A._entry = beginEntry;
    A._openBoard = openBoard;
  };

  global.ARCADE = A;
})(window);
