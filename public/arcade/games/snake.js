/* SERPENTINE — snake. Grid of 10px cells so the body reads as blocks. */
(function () {
  var C = 10, COLS = 32, ROWS = 22, OY = 14;
  var g_ = {
    id: 'snake', name: 'SERPENTINE', desc: 'Eat, grow, do not double back on yourself',
    score: 0, dead: false,
    reset: function () {
      this.body = [{ x: 8, y: 11 }, { x: 7, y: 11 }, { x: 6, y: 11 }];
      this.dir = { x: 1, y: 0 }; this.next = { x: 1, y: 0 };
      this.score = 0; this.dead = false; this.t = 0; this.rate = 0.13;
      this.food = this.place(); this.flash = 0;
    },
    place: function () {
      for (;;) {
        var p = { x: (Math.random() * COLS) | 0, y: (Math.random() * ROWS) | 0 };
        var clash = this.body.some(function (b) { return b.x === p.x && b.y === p.y; });
        if (!clash) return p;
      }
    },
    step: function (dt, A) {
      if (A.key('left') && this.dir.x === 0) this.next = { x: -1, y: 0 };
      if (A.key('right') && this.dir.x === 0) this.next = { x: 1, y: 0 };
      if (A.key('up') && this.dir.y === 0) this.next = { x: 0, y: -1 };
      if (A.key('down') && this.dir.y === 0) this.next = { x: 0, y: 1 };
      if (this.flash > 0) this.flash -= dt;

      this.t += dt;
      if (this.t < this.rate) return;
      this.t = 0;
      this.dir = this.next;
      var h = { x: this.body[0].x + this.dir.x, y: this.body[0].y + this.dir.y };
      if (h.x < 0 || h.y < 0 || h.x >= COLS || h.y >= ROWS) { this.dead = true; return; }
      if (this.body.some(function (b) { return b.x === h.x && b.y === h.y; })) { this.dead = true; return; }
      this.body.unshift(h);
      if (h.x === this.food.x && h.y === this.food.y) {
        this.score += 10; this.flash = 0.16;
        this.rate = Math.max(0.055, this.rate - 0.004);
        this.food = this.place();
      } else this.body.pop();
    },
    render: function (g, A) {
      g.clear(0);
      A.hud(g, { left: 'SCORE ' + this.score, right: 'HI ' + A.hiscore('snake') });
      // play field border
      g.frame(0, OY - 2, 320, ROWS * C + 4, 1);
      for (var i = this.body.length - 1; i >= 0; i--) {
        var b = this.body[i];
        var col = i === 0 ? 11 : (i % 2 ? 10 : 11);
        g.rect(b.x * C, OY + b.y * C, C - 1, C - 1, col);
        if (i === 0) {
          g.rect(b.x * C + 2, OY + b.y * C + 2, 2, 2, 0);
          g.rect(b.x * C + 5, OY + b.y * C + 2, 2, 2, 0);
        }
      }
      var f = this.food, fc = this.flash > 0 ? 9 : 7;
      g.rect(f.x * C + 1, OY + f.y * C + 1, C - 3, C - 3, fc);
      g.rect(f.x * C + 3, OY + f.y * C, 2, 2, 10);
    }
  };
  ARCADE.register(g_);
})();
