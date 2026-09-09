/* WALLBREAK — bricks, a bat and three balls. */
(function () {
  var OY = 14, COLS = 10, ROWS = 6, BW = 30, BH = 9, LEFT = 10, TOP = 30;
  var G = {
    id: 'breakout', name: 'WALLBREAK', desc: 'Clear the wall. The bat shrinks as you climb',
    score: 0, dead: false,
    reset: function () {
      this.score = 0; this.lives = 3; this.dead = false; this.level = 1;
      this.buildWall();
      this.pw = 40; this.px = 140;
      this.launch();
    },
    buildWall: function () {
      this.bricks = [];
      for (var r = 0; r < ROWS; r++)
        for (var c = 0; c < COLS; c++)
          this.bricks.push({ c: c, r: r, alive: true, col: [7, 8, 9, 11, 13, 14][r] });
    },
    launch: function () {
      this.bx = this.px + this.pw / 2; this.by = 200;
      var a = -Math.PI / 2 + (Math.random() * 0.7 - 0.35);
      var s = 150 + this.level * 10;
      this.vx = Math.cos(a) * s; this.vy = Math.sin(a) * s;
      this.stuck = true;
    },
    step: function (dt, A) {
      if (A.key('left')) this.px -= 190 * dt;
      if (A.key('right')) this.px += 190 * dt;
      this.px = Math.max(0, Math.min(320 - this.pw, this.px));
      if (this.stuck) {
        this.bx = this.px + this.pw / 2; this.by = 200;
        if (A.hit('a')) this.stuck = false;
        return;
      }
      this.bx += this.vx * dt; this.by += this.vy * dt;
      if (this.bx < 0) { this.bx = 0; this.vx = -this.vx; }
      if (this.bx > 316) { this.bx = 316; this.vx = -this.vx; }
      if (this.by < OY) { this.by = OY; this.vy = -this.vy; }

      // bat
      if (this.vy > 0 && this.by + 4 >= 210 && this.by < 218 &&
          this.bx + 4 > this.px && this.bx < this.px + this.pw) {
        this.by = 206; this.vy = -Math.abs(this.vy);
        var off = ((this.bx + 2) - (this.px + this.pw / 2)) / (this.pw / 2);
        this.vx += off * 110;
        var sp = Math.hypot(this.vx, this.vy), cap = 150 + this.level * 14;
        if (sp > cap) { this.vx *= cap / sp; this.vy *= cap / sp; }
      }
      if (this.by > 240) {
        this.lives--;
        if (this.lives <= 0) { this.dead = true; return; }
        this.launch();
        return;
      }
      // bricks
      for (var i = 0; i < this.bricks.length; i++) {
        var b = this.bricks[i]; if (!b.alive) continue;
        var x = LEFT + b.c * BW, y = TOP + b.r * BH;
        if (this.bx + 4 > x && this.bx < x + BW - 1 && this.by + 4 > y && this.by < y + BH - 1) {
          b.alive = false;
          this.score += (ROWS - b.r) * 5;
          // bounce off whichever face was nearer
          var cx = Math.abs((this.bx + 2) - (x + BW / 2)) / (BW / 2);
          var cy = Math.abs((this.by + 2) - (y + BH / 2)) / (BH / 2);
          if (cx > cy) this.vx = -this.vx; else this.vy = -this.vy;
          break;
        }
      }
      if (!this.bricks.some(function (b) { return b.alive; })) {
        this.level++;
        this.pw = Math.max(22, this.pw - 6);
        this.buildWall(); this.launch();
      }
    },
    render: function (g, A) {
      g.clear(0);
      A.hud(g, { left: 'SCORE ' + this.score, right: 'LV ' + this.level, lives: this.lives });
      for (var i = 0; i < this.bricks.length; i++) {
        var b = this.bricks[i]; if (!b.alive) continue;
        var x = LEFT + b.c * BW, y = TOP + b.r * BH;
        g.rect(x, y, BW - 2, BH - 2, b.col);
        g.rect(x, y, BW - 2, 1, 5);           // a lit top edge, arcade-style
        g.rect(x, y + BH - 3, BW - 2, 1, 1);
      }
      g.rect(this.px, 210, this.pw, 5, 13);
      g.rect(this.px, 210, this.pw, 1, 5);
      g.rect(this.bx, this.by, 4, 4, 9);
      if (this.stuck) g.textC('PRESS  Z', 226, 3);
    }
  };
  ARCADE.register(G);
})();
