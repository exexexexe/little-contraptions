/* DRIFT — rocks that split, and a ship with real inertia. */
(function () {
  function wrap(o) {
    if (o.x < 0) o.x += 320; if (o.x > 320) o.x -= 320;
    if (o.y < 12) o.y += 228; if (o.y > 240) o.y -= 228;
  }
  var G = {
    id: 'asteroids', name: 'DRIFT', desc: 'Inertia is real. Nothing here stops for you',
    score: 0, dead: false,
    reset: function () {
      this.score = 0; this.lives = 3; this.dead = false; this.wave = 1;
      this.ship = { x: 160, y: 126, a: -Math.PI / 2, vx: 0, vy: 0 };
      this.shots = []; this.rocks = []; this.inv = 2; this.cool = 0;
      this.makeWave();
    },
    makeWave: function () {
      this.rocks = [];
      for (var i = 0; i < 3 + this.wave; i++) {
        var e = Math.random() < 0.5;
        this.rocks.push({
          x: e ? Math.random() * 320 : (Math.random() < 0.5 ? 8 : 312),
          y: e ? (Math.random() < 0.5 ? 20 : 232) : 12 + Math.random() * 228,
          vx: (Math.random() * 44 - 22), vy: (Math.random() * 44 - 22),
          r: 16, seed: (Math.random() * 999) | 0
        });
      }
    },
    step: function (dt, A) {
      var s = this.ship;
      if (this.inv > 0) this.inv -= dt;
      if (this.cool > 0) this.cool -= dt;
      if (A.key('left')) s.a -= 3.4 * dt;
      if (A.key('right')) s.a += 3.4 * dt;
      this.thrust = A.key('up');
      if (this.thrust) { s.vx += Math.cos(s.a) * 150 * dt; s.vy += Math.sin(s.a) * 150 * dt; }
      var sp = Math.hypot(s.vx, s.vy);
      if (sp > 150) { s.vx *= 150 / sp; s.vy *= 150 / sp; }
      s.vx *= (1 - 0.35 * dt); s.vy *= (1 - 0.35 * dt);
      s.x += s.vx * dt; s.y += s.vy * dt; wrap(s);

      if (A.hit('a') && this.cool <= 0) {
        this.cool = 0.22;
        this.shots.push({ x: s.x, y: s.y, vx: Math.cos(s.a) * 250 + s.vx, vy: Math.sin(s.a) * 250 + s.vy, life: 1.1 });
      }
      this.shots.forEach(function (b) { b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt; wrap(b); });
      this.shots = this.shots.filter(function (b) { return b.life > 0; });
      this.rocks.forEach(function (r) { r.x += r.vx * dt; r.y += r.vy * dt; wrap(r); });

      var self = this, add = [];
      this.shots = this.shots.filter(function (b) {
        for (var i = 0; i < self.rocks.length; i++) {
          var r = self.rocks[i];
          if (Math.hypot(r.x - b.x, r.y - b.y) < r.r) {
            self.score += r.r > 12 ? 20 : r.r > 7 ? 50 : 100;
            if (r.r > 7) {
              for (var k = 0; k < 2; k++) add.push({
                x: r.x, y: r.y, vx: (Math.random() * 90 - 45), vy: (Math.random() * 90 - 45),
                r: r.r === 16 ? 9 : 5, seed: (Math.random() * 999) | 0
              });
            }
            self.rocks.splice(i, 1);
            return false;
          }
        }
        return true;
      });
      this.rocks = this.rocks.concat(add);
      if (!this.rocks.length) { this.wave++; this.makeWave(); this.inv = 1.4; }

      if (this.inv <= 0) {
        for (var i = 0; i < this.rocks.length; i++) {
          var r = this.rocks[i];
          if (Math.hypot(r.x - s.x, r.y - s.y) < r.r + 4) {
            this.lives--; this.inv = 2.2;
            s.x = 160; s.y = 126; s.vx = 0; s.vy = 0; s.a = -Math.PI / 2;
            if (this.lives <= 0) this.dead = true;
            break;
          }
        }
      }
    },
    render: function (g, A) {
      g.clear(0);
      A.hud(g, { left: 'SCORE ' + this.score, right: 'WAVE ' + this.wave, lives: this.lives });
      var self = this;
      this.rocks.forEach(function (r) {
        // chunky rock: a filled blob, deliberately jagged at the pixel level
        var n = 9, pts = [];
        for (var i = 0; i < n; i++) {
          var a = (i / n) * Math.PI * 2;
          var wob = 0.72 + (((r.seed + i * 37) % 10) / 22);
          pts.push([r.x + Math.cos(a) * r.r * wob, r.y + Math.sin(a) * r.r * wob]);
        }
        for (var j = 0; j < n; j++) {
          var p = pts[j], q = pts[(j + 1) % n];
          g.line(p[0], p[1], q[0], q[1], 3);
        }
        g.px(r.x, r.y, 2);
      });
      this.shots.forEach(function (b) { g.rect(b.x, b.y, 2, 2, 9); });
      if (!(this.inv > 0 && ((performance.now() / 90) | 0) % 2)) {
        var s = this.ship, a = s.a;
        var nose = [s.x + Math.cos(a) * 7, s.y + Math.sin(a) * 7];
        var l = [s.x + Math.cos(a + 2.5) * 6, s.y + Math.sin(a + 2.5) * 6];
        var r2 = [s.x + Math.cos(a - 2.5) * 6, s.y + Math.sin(a - 2.5) * 6];
        g.line(nose[0], nose[1], l[0], l[1], 13);
        g.line(nose[0], nose[1], r2[0], r2[1], 13);
        g.line(l[0], l[1], r2[0], r2[1], 12);
        if (this.thrust) {
          var t = [s.x - Math.cos(a) * 9, s.y - Math.sin(a) * 9];
          g.line((l[0] + r2[0]) / 2, (l[1] + r2[1]) / 2, t[0], t[1], 8);
        }
      }
    }
  };
  ARCADE.register(G);
})();
