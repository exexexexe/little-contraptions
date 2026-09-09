/* CLEARANCE — the hidden-mine grid, with its own skin.
   No borrowed icon set: the marker is a pennant on a post and the
   charge is a spiked disc, both drawn here out of cabinet palette. */
(function () {
  var COLS = 16, ROWS = 12, C = 16, OX = 32, OY = 30, MINES = 30;
  var NUMCOL = [0, 13, 11, 9, 8, 7, 15, 14, 4];   // 1..8 get their own colour
  var G = {
    id: 'mines', name: 'CLEARANCE', desc: 'Sixteen by twelve, thirty charges, no guessing needed',
    score: 0, dead: false,
    reset: function () {
      this.grid = [];
      for (var i = 0; i < COLS * ROWS; i++) this.grid.push({ m: false, o: false, f: false, n: 0 });
      this.laid = false; this.cx = 8; this.cy = 6; this.score = 0; this.dead = false;
      this.won = false; this.t = 0; this.flags = 0;
    },
    idx: function (x, y) { return y * COLS + x; },
    lay: function (sx, sy) {
      var placed = 0;
      while (placed < MINES) {
        var x = (Math.random() * COLS) | 0, y = (Math.random() * ROWS) | 0;
        if (Math.abs(x - sx) <= 1 && Math.abs(y - sy) <= 1) continue;   // first click is always safe
        var c = this.grid[this.idx(x, y)];
        if (c.m) continue;
        c.m = true; placed++;
      }
      for (var yy = 0; yy < ROWS; yy++) for (var xx = 0; xx < COLS; xx++) {
        var n = 0;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
          var nx = xx + dx, ny = yy + dy;
          if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;
          if (this.grid[this.idx(nx, ny)].m) n++;
        }
        this.grid[this.idx(xx, yy)].n = n;
      }
      this.laid = true;
    },
    open: function (x, y) {
      if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return;
      var c = this.grid[this.idx(x, y)];
      if (c.o || c.f) return;
      c.o = true;
      if (c.m) { this.dead = true; return; }
      this.score += 5;
      if (c.n === 0) {
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
          if (dx || dy) this.open(x + dx, y + dy);
        }
      }
    },
    step: function (dt, A) {
      this.t += dt;
      if (this.won) return;
      if (A.hit('left')) this.cx = Math.max(0, this.cx - 1);
      if (A.hit('right')) this.cx = Math.min(COLS - 1, this.cx + 1);
      if (A.hit('up')) this.cy = Math.max(0, this.cy - 1);
      if (A.hit('down')) this.cy = Math.min(ROWS - 1, this.cy + 1);
      if (A.hit('a')) {
        if (!this.laid) this.lay(this.cx, this.cy);
        this.open(this.cx, this.cy);
      }
      if (A.hit('b')) {
        var c = this.grid[this.idx(this.cx, this.cy)];
        if (!c.o) { c.f = !c.f; this.flags += c.f ? 1 : -1; }
      }
      // cleared when every safe square is open
      var safeLeft = this.grid.filter(function (c) { return !c.m && !c.o; }).length;
      if (this.laid && safeLeft === 0) { this.won = true; this.score += 500; this.dead = true; }
    },
    render: function (g, A) {
      g.clear(0);
      A.hud(g, { left: 'CHARGES ' + (MINES - this.flags), right: 'SCORE ' + this.score });
      g.frame(OX - 2, OY - 2, COLS * C + 4, ROWS * C + 4, 2);
      for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) {
        var c = this.grid[this.idx(x, y)];
        var px = OX + x * C, py = OY + y * C;
        if (!c.o) {
          g.rect(px, py, C - 1, C - 1, 2);
          g.rect(px, py, C - 1, 1, 3);            // bevel: lit top, dark bottom
          g.rect(px, py, 1, C - 1, 3);
          g.rect(px, py + C - 2, C - 1, 1, 1);
          g.rect(px + C - 2, py, 1, C - 1, 1);
          if (c.f) {
            g.rect(px + 7, py + 3, 1, 9, 4);      // post
            g.sprite(['777.', '7777', '777.'], px + 4, py + 3);
          }
        } else {
          g.rect(px, py, C - 1, C - 1, 1);
          if (c.m) {
            g.circle(px + 7, py + 7, 4, 7);
            g.rect(px + 7, py + 1, 1, 12, 7); g.rect(px + 1, py + 7, 12, 1, 7);
            g.rect(px + 5, py + 5, 2, 2, 9);
          } else if (c.n > 0) {
            g.text(String(c.n), px + 5, py + 4, NUMCOL[c.n]);
          }
        }
      }
      // cursor: a bracket, blinking, in the arcade way
      if (!this.dead || this.won) {
        var bx = OX + this.cx * C, by = OY + this.cy * C;
        var col = ((this.t * 6) | 0) % 2 ? 9 : 5;
        g.rect(bx - 1, by - 1, 4, 1, col); g.rect(bx - 1, by - 1, 1, 4, col);
        g.rect(bx + C - 4, by - 1, 4, 1, col); g.rect(bx + C - 2, by - 1, 1, 4, col);
        g.rect(bx - 1, by + C - 2, 4, 1, col); g.rect(bx - 1, by + C - 5, 1, 4, col);
        g.rect(bx + C - 4, by + C - 2, 4, 1, col); g.rect(bx + C - 2, by + C - 5, 1, 4, col);
      }
      g.textC(this.won ? 'FIELD  CLEAR' : 'Z DIG    X MARK', 226, this.won ? 11 : 3);
    }
  };
  ARCADE.register(G);
})();
