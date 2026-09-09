/* SIDE POCKET — real ball physics on Matter.js, drawn in cabinet pixels.
 * Matter is already an approved dependency here (the gratitude jar and
 * the rhythm sequencer both use it), so no new one was added. If the CDN
 * is unreachable the game says so rather than showing a dead table. */
(function () {
  var L = 18, T = 34, RW = 284, RH = 176, R = 6, POCK = 11;
  var G = {
    id: 'billiards', name: 'SIDE POCKET', desc: 'Real physics. Sink the colours, leave the white',
    score: 0, dead: false,
    reset: function () {
      this.ok = (typeof Matter !== 'undefined');
      this.score = 0; this.dead = false; this.shots = 0; this.sunk = 0; this.msg = '';
      if (!this.ok) return;
      var M = Matter;
      this.engine = M.Engine.create();
      this.engine.gravity.y = 0;
      this.world = this.engine.world;
      var wallOpts = { isStatic: true, restitution: 0.72, friction: 0.02 };
      M.World.add(this.world, [
        M.Bodies.rectangle(L + RW / 2, T - 6, RW + 24, 12, wallOpts),
        M.Bodies.rectangle(L + RW / 2, T + RH + 6, RW + 24, 12, wallOpts),
        M.Bodies.rectangle(L - 6, T + RH / 2, 12, RH + 24, wallOpts),
        M.Bodies.rectangle(L + RW + 6, T + RH / 2, 12, RH + 24, wallOpts)
      ]);
      this.pockets = [
        { x: L + 2, y: T + 2 }, { x: L + RW / 2, y: T - 1 }, { x: L + RW - 2, y: T + 2 },
        { x: L + 2, y: T + RH - 2 }, { x: L + RW / 2, y: T + RH + 1 }, { x: L + RW - 2, y: T + RH - 2 }
      ];
      this.balls = [];
      var cols = [7, 9, 11, 13, 14, 15, 8, 10, 12];
      var ax = L + RW * 0.68, ay = T + RH / 2, n = 0;
      for (var row = 0; row < 4 && n < 9; row++) {
        for (var i = 0; i <= row && n < 9; i++) {
          this.add(ax + row * (R * 2 + 1), ay - row * (R + 0.5) + i * (R * 2 + 1), cols[n], false);
          n++;
        }
      }
      this.cue = this.add(L + RW * 0.24, T + RH / 2, 5, true);
      this.aim = 0; this.power = 0; this.charging = false;
    },
    add: function (x, y, col, isCue) {
      var b = Matter.Bodies.circle(x, y, R, {
        restitution: 0.93, friction: 0.006, frictionAir: 0.019, density: 0.02
      });
      b.plugin = { col: col, cue: !!isCue, in: false };
      Matter.World.add(this.world, b);
      this.balls.push(b);
      return b;
    },
    moving: function () {
      return this.balls.some(function (b) {
        return !b.plugin.in && Math.hypot(b.velocity.x, b.velocity.y) > 0.16;
      });
    },
    step: function (dt, A) {
      if (!this.ok) return;
      var M = Matter;
      M.Engine.update(this.engine, Math.min(32, dt * 1000));

      var self = this;
      this.balls.forEach(function (b) {
        if (b.plugin.in) return;
        for (var i = 0; i < self.pockets.length; i++) {
          var p = self.pockets[i];
          if (Math.hypot(b.position.x - p.x, b.position.y - p.y) < POCK) {
            if (b.plugin.cue) {
              self.score = Math.max(0, self.score - 25);
              self.msg = 'SCRATCH';
              M.Body.setPosition(b, { x: L + RW * 0.24, y: T + RH / 2 });
              M.Body.setVelocity(b, { x: 0, y: 0 });
            } else {
              b.plugin.in = true;
              M.World.remove(self.world, b);
              self.sunk++; self.score += 100;
              self.msg = 'POTTED';
            }
            break;
          }
        }
      });
      if (this.sunk >= 9) { this.score += Math.max(0, 600 - this.shots * 25); this.dead = true; return; }

      if (this.moving()) { this.charging = false; return; }
      if (A.key('left')) this.aim -= 2.1 * dt;
      if (A.key('right')) this.aim += 2.1 * dt;
      if (A.key('a')) { this.charging = true; this.power = Math.min(1, this.power + dt * 1.5); }
      else if (this.charging) {
        var f = this.power * 0.019;
        Matter.Body.applyForce(this.cue, this.cue.position,
          { x: Math.cos(this.aim) * f, y: Math.sin(this.aim) * f });
        this.charging = false; this.power = 0; this.shots++; this.msg = '';
      }
    },
    render: function (g, A) {
      g.clear(0);
      A.hud(g, { left: 'SCORE ' + this.score, right: 'SHOTS ' + this.shots });
      if (!this.ok) {
        g.textC('PHYSICS  LIBRARY', 100, 7);
        g.textC('DID  NOT  LOAD', 116, 7);
        g.textC('THE OTHER GAMES ARE FINE', 140, 3);
        return;
      }
      // table
      g.rect(L - 7, T - 7, RW + 14, RH + 14, 6);
      g.rect(L - 4, T - 4, RW + 8, RH + 8, 8);
      g.rect(L, T, RW, RH, 10);
      for (var i = 0; i < RW; i += 4) g.px(L + i, T + ((i * 7) % RH), 11);
      this.pockets.forEach(function (p) { g.circle(p.x, p.y, 7, 0); });
      var self = this;
      this.balls.forEach(function (b) {
        if (b.plugin.in) return;
        var x = b.position.x, y = b.position.y;
        g.circle(x, y, R, b.plugin.col);
        g.circle(x - 2, y - 2, 2, 5);
        if (!b.plugin.cue) g.px(x, y, 0);
      });
      // aim line and power bar
      if (!this.moving()) {
        var c = this.cue.position;
        for (var d = 10; d < 42; d += 4) {
          g.px(c.x + Math.cos(this.aim) * d, c.y + Math.sin(this.aim) * d, 5);
        }
        g.rect(L, T + RH + 12, 90, 6, 1);
        g.rect(L + 1, T + RH + 13, 88 * this.power, 4, this.power > 0.75 ? 7 : 11);
        g.text('HOLD Z', L + 96, T + RH + 12, 3);
      }
      if (this.msg) g.textC(this.msg, 20, 9);
      g.text('SUNK ' + this.sunk + '/9', 232, T + RH + 12, 4);
    }
  };
  ARCADE.register(G);
})();
