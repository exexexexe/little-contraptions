/* PENTAFALL — a falling-block puzzle built on the twelve PENTOMINOES.
 *
 * Deliberately not the seven-tetromino game: five cells per piece, twelve
 * shapes, a twelve-wide well, and a colour mapping of its own that avoids
 * the familiar cyan/yellow/purple/green/red/blue/orange convention
 * entirely. Five-cell pieces change the game as well as the look — the
 * well is wider because pentominoes cannot be packed as tightly, and a
 * clear is worth more because it is harder to arrange.
 */
(function () {
  var COLS = 12, ROWS = 20, C = 9, OX = 106, OY = 30;

  // each shape as its cell offsets, and its own colour
  var SHAPES = {
    F: { c: 15, p: [[1,0],[2,0],[0,1],[1,1],[1,2]] },
    I: { c: 14, p: [[0,0],[0,1],[0,2],[0,3],[0,4]] },
    L: { c: 11, p: [[0,0],[0,1],[0,2],[0,3],[1,3]] },
    N: { c: 13, p: [[1,0],[1,1],[0,2],[1,2],[0,3]] },
    P: { c: 8,  p: [[0,0],[1,0],[0,1],[1,1],[0,2]] },
    T: { c: 7,  p: [[0,0],[1,0],[2,0],[1,1],[1,2]] },
    U: { c: 9,  p: [[0,0],[2,0],[0,1],[1,1],[2,1]] },
    V: { c: 10, p: [[0,0],[0,1],[0,2],[1,2],[2,2]] },
    W: { c: 12, p: [[0,0],[0,1],[1,1],[1,2],[2,2]] },
    X: { c: 4,  p: [[1,0],[0,1],[1,1],[2,1],[1,2]] },
    Y: { c: 3,  p: [[1,0],[0,1],[1,1],[1,2],[1,3]] },
    Z: { c: 6,  p: [[0,0],[1,0],[1,1],[1,2],[2,2]] }
  };
  var KEYS = Object.keys(SHAPES);

  function rot(cells) {
    var maxY = 0;
    cells.forEach(function (c) { if (c[1] > maxY) maxY = c[1]; });
    var out = cells.map(function (c) { return [maxY - c[1], c[0]]; });
    var minX = Math.min.apply(null, out.map(function (c) { return c[0]; }));
    var minY = Math.min.apply(null, out.map(function (c) { return c[1]; }));
    return out.map(function (c) { return [c[0] - minX, c[1] - minY]; });
  }

  var G = {
    id: 'pentomino', name: 'PENTAFALL', desc: 'Twelve pentominoes, five cells each, twelve wide',
    score: 0, dead: false,
    reset: function () {
      this.well = [];
      for (var i = 0; i < COLS * ROWS; i++) this.well.push(0);
      this.score = 0; this.lines = 0; this.level = 1; this.dead = false;
      this.bag = []; this.next = this.draw(); this.spawn();
      this.t = 0; this.rep = 0; this.flash = null; this.flashT = 0;
    },
    draw: function () {
      if (!this.bag.length) {
        this.bag = KEYS.slice();
        for (var i = this.bag.length - 1; i > 0; i--) {
          var j = (Math.random() * (i + 1)) | 0, t = this.bag[i];
          this.bag[i] = this.bag[j]; this.bag[j] = t;
        }
      }
      return this.bag.pop();
    },
    spawn: function () {
      this.k = this.next; this.next = this.draw();
      this.cells = SHAPES[this.k].p.map(function (c) { return c.slice(); });
      this.px = 4; this.py = 0;
      if (this.hits(this.cells, this.px, this.py)) this.dead = true;
    },
    hits: function (cells, px, py) {
      for (var i = 0; i < cells.length; i++) {
        var x = px + cells[i][0], y = py + cells[i][1];
        if (x < 0 || x >= COLS || y >= ROWS) return true;
        if (y >= 0 && this.well[y * COLS + x]) return true;
      }
      return false;
    },
    lock: function () {
      var col = SHAPES[this.k].c, self = this;
      this.cells.forEach(function (c) {
        var x = self.px + c[0], y = self.py + c[1];
        if (y >= 0) self.well[y * COLS + x] = col;
      });
      // find full rows
      var full = [];
      for (var y = 0; y < ROWS; y++) {
        var ok = true;
        for (var x = 0; x < COLS; x++) if (!this.well[y * COLS + x]) { ok = false; break; }
        if (ok) full.push(y);
      }
      if (full.length) {
        this.flash = full; this.flashT = 0.22;
        this.lines += full.length;
        this.score += [0, 100, 300, 600, 1000, 1500][full.length];
        this.level = 1 + Math.floor(this.lines / 8);
      } else {
        this.spawn();
      }
    },
    clearRows: function () {
      var self = this;
      this.flash.sort(function (a, b) { return a - b; }).forEach(function (y) {
        self.well.splice(y * COLS, COLS);
        for (var i = 0; i < COLS; i++) self.well.unshift(0);
      });
      this.flash = null;
      this.spawn();
    },
    step: function (dt, A) {
      if (this.flash) {
        this.flashT -= dt;
        if (this.flashT <= 0) this.clearRows();
        return;
      }
      this.rep -= dt;
      var move = 0;
      if (A.hit('left')) move = -1; else if (A.hit('right')) move = 1;
      else if (this.rep <= 0) {
        if (A.key('left')) { move = -1; this.rep = 0.07; }
        else if (A.key('right')) { move = 1; this.rep = 0.07; }
      }
      if (move && !this.hits(this.cells, this.px + move, this.py)) this.px += move;

      if (A.hit('up') || A.hit('a')) {
        var r = rot(this.cells);
        // wall kick: try in place, then one step either way
        var kicks = [0, -1, 1, -2, 2];
        for (var i = 0; i < kicks.length; i++) {
          if (!this.hits(r, this.px + kicks[i], this.py)) { this.cells = r; this.px += kicks[i]; break; }
        }
      }
      if (A.hit('b')) {                                  // hard drop
        while (!this.hits(this.cells, this.px, this.py + 1)) { this.py++; this.score += 2; }
        this.lock(); return;
      }

      var speed = Math.max(0.06, 0.62 - (this.level - 1) * 0.05);
      if (A.key('down')) speed = 0.035;
      this.t += dt;
      if (this.t >= speed) {
        this.t = 0;
        if (!this.hits(this.cells, this.px, this.py + 1)) this.py++;
        else this.lock();
      }
    },
    block: function (g, x, y, col) {
      g.rect(x, y, C - 1, C - 1, col);
      g.rect(x, y, C - 1, 1, 5);          // chunky bevel, two pixels of shading
      g.rect(x, y, 1, C - 1, 5);
      g.rect(x, y + C - 2, C - 1, 1, 0);
      g.rect(x + C - 2, y, 1, C - 1, 0);
    },
    render: function (g, A) {
      g.clear(0);
      A.hud(g, { left: 'SCORE ' + this.score, right: 'LV ' + this.level });
      // the well
      g.frame(OX - 2, OY - 2, COLS * C + 4, ROWS * C + 4, 2);
      g.rect(OX, OY, COLS * C, ROWS * C, 1);
      for (var y = 0; y < ROWS; y++) {
        var lit = this.flash && this.flash.indexOf(y) >= 0;
        for (var x = 0; x < COLS; x++) {
          var v = this.well[y * COLS + x];
          if (!v) continue;
          this.block(g, OX + x * C, OY + y * C, lit ? 5 : v);
        }
      }
      if (!this.flash && !this.dead) {
        var self = this, col = SHAPES[this.k].c;
        // ghost, so a five-cell piece can actually be aimed
        var gy = this.py;
        while (!this.hits(this.cells, this.px, gy + 1)) gy++;
        this.cells.forEach(function (c) {
          var x = OX + (self.px + c[0]) * C, y = OY + (gy + c[1]) * C;
          g.frame(x, y, C - 1, C - 1, 2);
        });
        this.cells.forEach(function (c) {
          if (self.py + c[1] < 0) return;
          self.block(g, OX + (self.px + c[0]) * C, OY + (self.py + c[1]) * C, col);
        });
      }
      // side panels
      g.text('NEXT', 246, 34, 3);
      var np = SHAPES[this.next];
      for (var i = 0; i < np.p.length; i++) {
        this.block(g, 248 + np.p[i][0] * C, 46 + np.p[i][1] * C, np.c);
      }
      g.text('PIECE', 246, 116, 3);
      g.text(this.k, 246, 128, SHAPES[this.k].c);
      g.text('LINES', 246, 146, 3);
      g.text(String(this.lines), 246, 158, 4);
      g.text('12', 20, 34, 2); g.text('SHAPES', 20, 46, 2);
      g.text('5', 20, 64, 2); g.text('CELLS', 20, 76, 2);
    }
  };
  ARCADE.register(G);
})();
