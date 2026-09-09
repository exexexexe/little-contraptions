/* RALLY — two bats and a square. First to eleven. */
(function () {
  var OY = 14, FH = 226;
  var G = {
    id: 'pong', name: 'RALLY', desc: 'First to eleven. The cabinet does not go easy',
    score: 0, dead: false,
    reset: function () {
      this.py = 100; this.ay = 100; this.ph = 34;
      this.score = 0; this.them = 0; this.dead = false;
      this.serve(1);
    },
    serve: function (dir) {
      this.bx = 158; this.by = 110 + (Math.random() * 40 - 20);
      this.vx = 96 * dir; this.vy = (Math.random() * 90 - 45);
      this.wait = 0.7;
    },
    step: function (dt, A) {
      if (this.wait > 0) { this.wait -= dt; return; }
      if (A.key('up')) this.py -= 150 * dt;
      if (A.key('down')) this.py += 150 * dt;
      this.py = Math.max(OY, Math.min(OY + FH - this.ph, this.py));

      // opponent: tracks with a deliberate lag so it is beatable
      var target = this.by - this.ph / 2;
      var speed = 104 + Math.min(60, this.them * 6);
      if (this.ay + 2 < target) this.ay += speed * dt;
      else if (this.ay - 2 > target) this.ay -= speed * dt;
      this.ay = Math.max(OY, Math.min(OY + FH - this.ph, this.ay));

      this.bx += this.vx * dt; this.by += this.vy * dt;
      if (this.by < OY) { this.by = OY; this.vy = -this.vy; }
      if (this.by > OY + FH - 4) { this.by = OY + FH - 4; this.vy = -this.vy; }

      // player bat on the left at x=10, opponent right at x=306
      if (this.vx < 0 && this.bx <= 14 && this.bx > 8 &&
          this.by + 4 > this.py && this.by < this.py + this.ph) {
        this.bx = 14; this.vx = Math.abs(this.vx) * 1.05;
        this.vy += ((this.by - (this.py + this.ph / 2)) / this.ph) * 150;
      }
      if (this.vx > 0 && this.bx + 4 >= 306 && this.bx < 312 &&
          this.by + 4 > this.ay && this.by < this.ay + this.ph) {
        this.bx = 302; this.vx = -Math.abs(this.vx) * 1.05;
        this.vy += ((this.by - (this.ay + this.ph / 2)) / this.ph) * 150;
      }
      this.vx = Math.max(-260, Math.min(260, this.vx));
      this.vy = Math.max(-200, Math.min(200, this.vy));

      if (this.bx < 0) { this.them++; this.serve(1); }
      if (this.bx > 320) { this.score += 1; this.serve(-1); }
      if (this.score >= 11 || this.them >= 11) this.dead = true;
    },
    render: function (g, A) {
      g.clear(0);
      A.hud(g, { left: 'YOU ' + this.score, right: 'CAB ' + this.them });
      for (var y = OY; y < OY + FH; y += 10) g.rect(159, y, 2, 5, 1);
      g.rect(10, this.py, 4, this.ph, 13);
      g.rect(306, this.ay, 4, this.ph, 7);
      g.rect(this.bx, this.by, 4, 4, 9);
    }
  };
  ARCADE.register(G);
})();
