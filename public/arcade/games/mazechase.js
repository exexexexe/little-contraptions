/* THE ROUNDS — a maze chase with its own cast.
 * The runner is a six-legged mite, not a wedge; the four that want it
 * are WARDENS: flat-bottomed boxes with a single visor. Neither the
 * characters nor the maze are borrowed from anything. */
(function () {
  var C = 16, OX = 8, OY = 28;
  var MAP = [
    '###################',
    '#........#........#',
    '#.##.###.#.###.##.#',
    '#o...............o#',
    '#.##.#.#####.#.##.#',
    '#....#...#...#....#',
    '####.###.#.###.####',
    '#........W........#',
    '#.##.###.#.###.##.#',
    '#o...............o#',
    '##.#.#.#####.#.#.##',
    '#.......P.........#',
    '###################'
  ];
  var W = MAP[0].length, H = MAP.length;

  function wall(grid, x, y) {
    if (x < 0 || y < 0 || x >= W || y >= H) return true;
    return grid[y][x] === '#';
  }
  var DIRS = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };

  var G = {
    id: 'mazechase', name: 'THE ROUNDS', desc: 'Clear the grid. Four wardens would rather you did not',
    score: 0, dead: false,
    reset: function () {
      this.grid = MAP.map(function (r) { return r.split(''); });
      this.pellets = [];
      this.total = 0;
      for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
        var ch = this.grid[y][x];
        if (ch === '.') { this.pellets.push({ x: x, y: y, big: false }); this.total++; }
        if (ch === 'o') { this.pellets.push({ x: x, y: y, big: true }); this.total++; }
        if (ch === 'P') this.start = { x: x, y: y };
        if (ch === 'W') this.den = { x: x, y: y };
      }
      this.score = 0; this.lives = 3; this.dead = false; this.level = 1;
      this.spawn();
    },
    spawn: function () {
      var d = this.den;
      this.p = { x: this.start.x * C, y: this.start.y * C, dir: 'left', want: 'left', sp: 54 };
      this.w = [];
      var cols = [7, 15, 8, 11];
      for (var i = 0; i < 4; i++) {
        this.w.push({ x: (d.x - 1 + i) * C, y: d.y * C, dir: i % 2 ? 'left' : 'right',
                      col: cols[i], sp: 44 + i * 2, out: i * 1.6 });
      }
      this.fright = 0; this.t = 0; this.ready = 1.2;
    },
    centred: function (e) { return (e.x % C === 0) && (e.y % C === 0); },
    canGo: function (e, dir) {
      var d = DIRS[dir], tx = (e.x / C) + d[0], ty = (e.y / C) + d[1];
      return !wall(this.grid, tx, ty);
    },
    move: function (e, dt) {
      var d = DIRS[e.dir];
      e.x += d[0] * e.sp * dt; e.y += d[1] * e.sp * dt;
      // snap when a whole cell has been crossed
      if (Math.abs(e.x % C) < 0.9 || Math.abs(e.x % C) > C - 0.9) e.x = Math.round(e.x / C) * C;
      if (Math.abs(e.y % C) < 0.9 || Math.abs(e.y % C) > C - 0.9) e.y = Math.round(e.y / C) * C;
    },
    step: function (dt, A) {
      this.t += dt;
      if (this.ready > 0) { this.ready -= dt; return; }
      if (this.fright > 0) this.fright -= dt;

      var p = this.p;
      ['left', 'right', 'up', 'down'].forEach(function (k) { if (A.key(k)) p.want = k; });
      if (this.centred(p)) {
        if (this.canGo(p, p.want)) p.dir = p.want;
        if (!this.canGo(p, p.dir)) { this.move(p, 0); }
        else this.move(p, dt);
      } else this.move(p, dt);

      // eat
      var px = Math.round(p.x / C), py = Math.round(p.y / C);
      for (var i = 0; i < this.pellets.length; i++) {
        var pel = this.pellets[i];
        if (pel.x === px && pel.y === py) {
          this.pellets.splice(i, 1);
          this.score += pel.big ? 50 : 10;
          if (pel.big) { this.fright = 6; }
          break;
        }
      }
      if (!this.pellets.length) {
        this.level++;
        this.grid = MAP.map(function (r) { return r.split(''); });
        this.pellets = [];
        for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
          var ch = this.grid[y][x];
          if (ch === '.') this.pellets.push({ x: x, y: y, big: false });
          if (ch === 'o') this.pellets.push({ x: x, y: y, big: true });
        }
        this.spawn();
        return;
      }

      // wardens
      var self = this;
      this.w.forEach(function (w) {
        if (w.out > 0) { w.out -= dt; return; }
        if (self.centred(w)) {
          var opts = ['left', 'right', 'up', 'down'].filter(function (d) { return self.canGo(w, d); });
          var back = { left: 'right', right: 'left', up: 'down', down: 'up' }[w.dir];
          if (opts.length > 1) opts = opts.filter(function (d) { return d !== back; });
          // head toward the runner, or away from it while frightened
          var best = opts[0], bestScore = 1e9;
          opts.forEach(function (d) {
            var dd = DIRS[d];
            var nx = w.x + dd[0] * C, ny = w.y + dd[1] * C;
            var dist = Math.hypot(nx - p.x, ny - p.y);
            var sc = self.fright > 0 ? -dist : dist;
            sc += Math.random() * 18;                 // enough drift to be escapable
            if (sc < bestScore) { bestScore = sc; best = d; }
          });
          w.dir = best;
        }
        var sp = w.sp; w.sp = self.fright > 0 ? 30 : (44 + self.level * 2);
        self.move(w, dt); w.sp = w.sp;
      });

      // contact
      for (var j = 0; j < this.w.length; j++) {
        var w = this.w[j];
        if (Math.hypot(w.x - p.x, w.y - p.y) < 11) {
          if (this.fright > 0) {
            this.score += 200;
            w.x = this.den.x * C; w.y = this.den.y * C; w.out = 2;
          } else {
            this.lives--;
            if (this.lives <= 0) { this.dead = true; return; }
            this.spawn(); return;
          }
        }
      }
    },
    render: function (g, A) {
      g.clear(0);
      A.hud(g, { left: 'SCORE ' + this.score, right: 'LV ' + this.level, lives: this.lives });
      // maze
      for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
        if (this.grid[y][x] === '#') {
          var px = OX + x * C, py = OY + y * C;
          g.rect(px, py, C, C, 1);
          g.rect(px + 2, py + 2, C - 4, C - 4, 12);
          g.rect(px + 2, py + 2, C - 4, 1, 13);
        }
      }
      this.pellets.forEach(function (pel) {
        var px = OX + pel.x * C, py = OY + pel.y * C;
        if (pel.big) g.circle(px + 8, py + 8, 4, 9);
        else g.rect(px + 7, py + 7, 2, 2, 4);
      });
      // the runner: a mite with legs, not a wedge
      var p = this.p, bx = OX + p.x, by = OY + p.y;
      var wob = ((this.t * 10) | 0) % 2;
      g.sprite([
        '..dddd..',
        '.dddddd.',
        'dd5dd5dd',
        'dddddddd',
        'dddddddd',
        '.dddddd.',
        wob ? 'd.d..d.d' : '.d.dd.d.',
        wob ? '........' : 'd......d'
      ], bx + 4, by + 4);
      // wardens: flat-bottomed boxes with a visor
      var fr = this.fright;
      this.w.forEach(function (w) {
        var c = fr > 0 ? (fr < 1.6 && ((performance.now() / 120) | 0) % 2 ? 4 : 14) : w.col;
        var wx = OX + w.x + 4, wy = OY + w.y + 4;
        g.rect(wx, wy + 1, 8, 7, c);
        g.rect(wx + 1, wy, 6, 1, c);
        g.rect(wx, wy + 8, 8, 1, c);
        g.rect(wx + 1, wy + 3, 6, 2, 0);
        if (fr <= 0) g.rect(wx + (w.dir === 'left' ? 1 : 4), wy + 3, 2, 2, 5);
      });
      if (this.ready > 0) g.textC('READY', 116, 9, 1);
    }
  };
  ARCADE.register(G);
})();
