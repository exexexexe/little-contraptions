/* THE LONG WAY DOWN — ten single-screen levels.
 * # solid  o coin  ^ spike  M walker  P start  E exit  - crumbling ledge */
(function () {
  var COLS = 20, ROWS = 13, C = 16, OY = 28;
  var LEVELS = [
    [ // 1
      '....................',
      '....................',
      '....................',
      '....................',
      '....................',
      '....................',
      '....................',
      '....................',
      '.........ooo........',
      '..........###.......',
      '....................',
      '.P................E.',
      '####################'
    ],
    [ // 2
      '....................',
      '....................',
      '....................',
      '....................',
      '....................',
      '.....ooo....ooo.....',
      '....................',
      '....................',
      '....................',
      '....................',
      '....................',
      '.P................E.',
      '#####...####...#####'
    ],
    [ // 3
      '....................',
      '....................',
      '................oo..',
      '....................',
      '..............####..',
      '...........o........',
      '.........####.......',
      '......o.............',
      '....####............',
      '..o.................',
      '.###................',
      'P.................E.',
      '####################'
    ],
    [ // 4
      '....................',
      '....................',
      '....................',
      '....................',
      '....................',
      '......ooo...........',
      '.....#####..........',
      '....................',
      '............oo......',
      '..........#####.....',
      '....................',
      '.P.....M........M.E.',
      '####################'
    ],
    [ // 5
      '....................',
      '....................',
      '....................',
      '....................',
      '....................',
      '....................',
      '....................',
      '....................',
      '.....oo.....oo......',
      '....................',
      '....................',
      '.P................E.',
      '#####^^#####^^######'
    ],
    [ // 6
      '....................',
      '................E...',
      '................####',
      '....................',
      '............####....',
      '..........o.........',
      '........####........',
      '......o.............',
      '....####............',
      '..o.................',
      '.###................',
      'P...................',
      '####################'
    ],
    [ // 7
      '....................',
      '....................',
      '....................',
      '....................',
      '....................',
      '....................',
      '....................',
      '....................',
      '....oo........oo....',
      '....................',
      '....................',
      '.P.....M..M.......E.',
      '####..########..####'
    ],
    [ // 8
      '....................',
      '....................',
      '..o.............o...',
      '.###..........####..',
      '....................',
      '......o...o.........',
      '.....###.###........',
      '....................',
      '..........o.........',
      '.........###........',
      '....................',
      '.P.......M......M.E.',
      '####################'
    ],
    [ // 9
      '....................',
      '....................',
      '....................',
      '....................',
      '....................',
      '....................',
      '....................',
      '....................',
      '....oo....oo....oo..',
      '....................',
      '....................',
      '.P.....M.....M....E.',
      '####^^####^^###^^###'
    ],
    [ // 10
      '....................',
      '....................',
      '.............ooo....',
      '............#####...',
      '....................',
      '.....oo.......o.....',
      '....####....####....',
      '....................',
      '...o................',
      '..####......####....',
      '....................',
      '.P....M.....M.....E.',
      '####################'
    ]
  ];

  var G = {
    id: 'platform', name: 'THE LONG WAY DOWN', desc: 'Ten screens. Jump is Z, and momentum is yours to keep',
    score: 0, dead: false,
    reset: function () { this.score = 0; this.lives = 3; this.lv = 0; this.dead = false; this.load(); },
    load: function () {
      var src = LEVELS[this.lv];
      this.map = src.map(function (r) { return r.split(''); });
      this.coins = []; this.walkers = []; this.t = 0; this.win = 0;
      for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
        var ch = this.map[y][x];
        if (ch === 'P') { this.sx = x * C + 3; this.sy = y * C + 2; this.map[y][x] = '.'; }
        if (ch === 'E') { this.ex = x * C; this.ey = y * C; this.map[y][x] = '.'; }
        if (ch === 'o') { this.coins.push({ x: x * C + 8, y: y * C + 8, got: false }); this.map[y][x] = '.'; }
        if (ch === 'M') {
          // drop it onto the first floor below, so a misplaced walker in the
          // level data cannot end up hovering and flipping on the spot
          var wy = y;
          while (wy + 1 < ROWS && src[wy + 1][x] !== '#') wy++;
          this.walkers.push({ x: x * C + 2, y: wy * C + 4, vx: 26, dead: false });
          this.map[y][x] = '.';
        }
      }
      this.p = { x: this.sx, y: this.sy, vx: 0, vy: 0, on: false, face: 1, dead: 0 };
    },
    solid: function (x, y) {
      var tx = Math.floor(x / C), ty = Math.floor(y / C);
      if (tx < 0 || tx >= COLS) return true;
      if (ty < 0) return false;
      if (ty >= ROWS) return false;
      return this.map[ty][tx] === '#';
    },
    spike: function (x, y) {
      var tx = Math.floor(x / C), ty = Math.floor(y / C);
      if (tx < 0 || tx >= COLS || ty < 0 || ty >= ROWS) return false;
      return this.map[ty][tx] === '^';
    },
    /* Sample all four corners and the midpoints. The previous version
       stepped in eights and only ever tested ONE bottom corner, so the
       moment the player's right edge crossed a gap the whole body was
       treated as unsupported: you fell a tile early at every ledge and
       could never jump from an edge, because p.on was already false. */
    boxHits: function (x, y, w, h, fn) {
      var xs = [x, x + w / 2, x + w];
      var ys = [y, y + h / 2, y + h];
      for (var i = 0; i < xs.length; i++) {
        for (var j = 0; j < ys.length; j++) {
          if (fn.call(this, xs[i], ys[j])) return true;
        }
      }
      return false;
    },
    step: function (dt, A) {
      this.t += dt;
      var p = this.p, PW = 10, PH = 14;
      if (this.win > 0) {
        this.win -= dt;
        if (this.win <= 0) {
          this.lv++;
          if (this.lv >= LEVELS.length) { this.score += 1000; this.dead = true; return; }
          this.load();
        }
        return;
      }
      if (p.dead > 0) {
        p.dead -= dt; p.vy += 620 * dt; p.y += p.vy * dt;
        if (p.dead <= 0) {
          this.lives--;
          if (this.lives <= 0) { this.dead = true; return; }
          this.load();
        }
        return;
      }

      var acc = A.key('left') ? -1 : A.key('right') ? 1 : 0;
      if (acc) { p.vx += acc * 620 * dt; p.face = acc; }
      else p.vx *= Math.pow(0.0016, dt);
      p.vx = Math.max(-82, Math.min(82, p.vx));

      p.vy += 620 * dt;
      if (p.vy > 300) p.vy = 300;
      if ((A.hit('a') || A.hit('up')) && p.on) { p.vy = -250; p.on = false; }

      // x sweep
      var nx = p.x + p.vx * dt;
      if (this.boxHits(nx, p.y, PW, PH - 1, this.solid)) {
        while (!this.boxHits(p.x + Math.sign(p.vx), p.y, PW, PH - 1, this.solid) &&
               Math.abs(p.x - nx) > 0.5) p.x += Math.sign(p.vx);
        p.vx = 0;
      } else p.x = nx;

      // y sweep
      var ny = p.y + p.vy * dt;
      p.on = false;
      if (this.boxHits(p.x, ny, PW, PH, this.solid)) {
        if (p.vy > 0) { p.y = Math.floor((ny + PH) / C) * C - PH - 0.01; p.on = true; }
        else p.y = Math.floor(ny / C) * C + C + 0.01;
        p.vy = 0;
      } else p.y = ny;

      if (p.y > ROWS * C + 30) { p.dead = 0.9; p.vy = -60; return; }
      if (this.boxHits(p.x, p.y, PW, PH, this.spike)) { p.dead = 0.9; p.vy = -170; return; }

      // coins
      for (var i = 0; i < this.coins.length; i++) {
        var c = this.coins[i];
        if (!c.got && Math.abs(c.x - (p.x + 5)) < 10 && Math.abs(c.y - (p.y + 7)) < 12) {
          c.got = true; this.score += 25;
        }
      }
      // walkers
      var self = this;
      this.walkers.forEach(function (w) {
        if (w.dead) return;
        w.x += w.vx * dt;
        // turn at a wall or at the lip of a ledge
        if (self.solid(w.x + (w.vx > 0 ? 12 : -1), w.y + 6) ||
            !self.solid(w.x + (w.vx > 0 ? 12 : 0), w.y + 15)) {
          w.vx = -w.vx;
          w.x += w.vx * dt * 2;
        }
        if (Math.abs((w.x + 6) - (p.x + 5)) < 11 && Math.abs((w.y + 6) - (p.y + 7)) < 13) {
          if (p.vy > 40 && (p.y + PH) - w.y < 10) {
            w.dead = true; self.score += 75; p.vy = -160;
          } else { p.dead = 0.9; p.vy = -170; }
        }
      });

      if (Math.abs(p.x - this.ex) < 12 && Math.abs(p.y - this.ey) < 14) {
        this.score += 150; this.win = 0.8;
      }
    },
    render: function (g, A) {
      g.clear(0);
      A.hud(g, { left: 'SCORE ' + this.score, right: 'STAGE ' + (this.lv + 1) + '/10', lives: this.lives });
      // sky
      g.rect(0, 12, 320, 228, 1);
      for (var s = 0; s < 18; s++) g.px((s * 53 + 11) % 320, 16 + ((s * 29) % 120), 2);
      for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
        var ch = this.map[y][x], px = x * C, py = OY + y * C;
        if (ch === '#') {
          g.rect(px, py, C, C, 6);
          g.rect(px, py, C, 2, 8);
          g.rect(px, py, 1, C, 8);
          g.rect(px, py + C - 1, C, 1, 0);
          g.px(px + 4, py + 6, 0); g.px(px + 11, py + 9, 0);
        } else if (ch === '^') {
          g.rect(px, py + 10, C, 6, 2);
          for (var k = 0; k < 2; k++) {
            var bx = px + k * 8;
            g.sprite(['...3....', '..333...', '.33333..', '3333333.'], bx, py + 6);
          }
        }
      }
      // exit
      var ex = this.ex, ey = OY + this.ey;
      g.rect(ex + 1, ey, 13, 16, 2);
      g.rect(ex + 2, ey + 1, 11, 15, 14);
      g.rect(ex + 5, ey + 5, 5, 11, 9);
      g.px(ex + 9, ey + 10, 0);
      // coins: a four-frame spin
      var fr = ((this.t * 8) | 0) % 4;
      var wq = [4, 3, 1, 3][fr];
      this.coins.forEach(function (c) {
        if (c.got) return;
        var x0 = c.x - wq / 2, y0 = OY + c.y - 4;
        g.rect(x0, y0 + 1, wq, 6, 9);
        g.rect(x0 + (wq > 1 ? 1 : 0), y0, Math.max(1, wq - 2), 1, 9);
        g.rect(x0 + (wq > 1 ? 1 : 0), y0 + 7, Math.max(1, wq - 2), 1, 8);
        g.rect(x0, y0 + 1, 1, 5, 5);
      });
      // walkers
      this.walkers.forEach(function (w) {
        if (w.dead) return;
        var bob = ((performance.now() / 160) | 0) % 2;
        g.sprite([
          '..7777..',
          '.777777.',
          '75577557',
          '77777777',
          '.777777.',
          bob ? '7.7..7.7' : '.77..77.'
        ], w.x, OY + w.y, w.vx < 0);
      });
      // the runner
      var p = this.p;
      var run = p.on && Math.abs(p.vx) > 6 ? ((this.t * 11) | 0) % 2 : 0;
      var body = [
        '..dddd..',
        '.dddddd.',
        'd55dd55d',
        'd5dd55dd',
        'dddddddd',
        'dddddddd',
        '.dddddd.',
        p.on ? (run ? 'd.d..d.d' : '.dd..dd.') : 'd......d'
      ];
      g.sprite(body, p.x, OY + p.y, p.face < 0);
      if (this.win > 0) g.textC('STAGE  CLEAR', 116, 11, 1);
    }
  };
  ARCADE.register(G);

  // level sanity, checked at load rather than trusted
  LEVELS.forEach(function (lv, i) {
    if (lv.length !== ROWS) console.error('level ' + (i + 1) + ' has ' + lv.length + ' rows');
    lv.forEach(function (r, j) {
      if (r.length !== COLS) console.error('level ' + (i + 1) + ' row ' + j + ' is ' + r.length + ' wide');
    });
    if (lv.join('').indexOf('P') < 0) console.error('level ' + (i + 1) + ' has no start');
    if (lv.join('').indexOf('E') < 0) console.error('level ' + (i + 1) + ' has no exit');
  });
})();
