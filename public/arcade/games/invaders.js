/* DESCENT — a marching grid that speeds up as it thins out. */
(function () {
  var G = {
    id: 'invaders', name: 'DESCENT', desc: 'They come down faster the fewer are left',
    score: 0, dead: false,
    reset: function () {
      this.score = 0; this.lives = 3; this.dead = false; this.wave = 1;
      this.px = 152; this.shots = []; this.bombs = []; this.t = 0; this.hitFlash = 0;
      this.spawn();
    },
    spawn: function () {
      this.rows = [];
      for (var r = 0; r < 5; r++)
        for (var c = 0; c < 9; c++)
          this.rows.push({ x: 26 + c * 30, y: 28 + r * 18, r: r, alive: true });
      this.dir = 1; this.drop = 0; this.stepT = 0;
      this.shields = [];
      for (var s = 0; s < 4; s++)
        for (var i = 0; i < 5; i++)
          for (var j = 0; j < 3; j++)
            this.shields.push({ x: 34 + s * 76 + i * 5, y: 178 + j * 5, hp: 3 });
    },
    alive: function () { return this.rows.filter(function (a) { return a.alive; }); },
    step: function (dt, A) {
      this.t += dt;
      if (this.hitFlash > 0) this.hitFlash -= dt;
      if (A.key('left')) this.px -= 130 * dt;
      if (A.key('right')) this.px += 130 * dt;
      this.px = Math.max(4, Math.min(300, this.px));
      if (A.hit('a') && this.shots.length < 2) this.shots.push({ x: this.px + 7, y: 198 });

      var live = this.alive();
      if (!live.length) { this.wave++; this.spawn(); return; }

      // march: one discrete step, faster as the wave thins — the arcade rule
      var interval = Math.max(0.07, 0.62 * (live.length / 45));
      this.stepT += dt;
      if (this.stepT >= interval) {
        this.stepT = 0;
        var edge = false;
        for (var i = 0; i < live.length; i++) {
          if ((this.dir > 0 && live[i].x > 296) || (this.dir < 0 && live[i].x < 6)) edge = true;
        }
        if (edge) {
          this.dir = -this.dir;
          for (var k = 0; k < live.length; k++) live[k].y += 8;
        } else {
          for (var m = 0; m < live.length; m++) live[m].x += this.dir * 6;
        }
        // someone drops a bomb
        if (Math.random() < 0.55) {
          var pick = live[(Math.random() * live.length) | 0];
          this.bombs.push({ x: pick.x + 6, y: pick.y + 10 });
        }
        for (var n = 0; n < live.length; n++) if (live[n].y > 190) { this.dead = true; }
      }

      var self = this;
      this.shots.forEach(function (s) { s.y -= 260 * dt; });
      this.bombs.forEach(function (b) { b.y += 110 * dt; });

      // shots vs aliens and shields
      this.shots = this.shots.filter(function (s) {
        if (s.y < 12) return false;
        for (var i = 0; i < self.rows.length; i++) {
          var a = self.rows[i];
          if (a.alive && s.x > a.x - 1 && s.x < a.x + 14 && s.y > a.y && s.y < a.y + 11) {
            a.alive = false; self.score += (5 - a.r) * 10; return false;
          }
        }
        for (var j = 0; j < self.shields.length; j++) {
          var sh = self.shields[j];
          if (sh.hp > 0 && s.x >= sh.x && s.x < sh.x + 5 && s.y >= sh.y && s.y < sh.y + 5) {
            sh.hp--; return false;
          }
        }
        return true;
      });
      this.bombs = this.bombs.filter(function (b) {
        if (b.y > 240) return false;
        for (var j = 0; j < self.shields.length; j++) {
          var sh = self.shields[j];
          if (sh.hp > 0 && b.x >= sh.x && b.x < sh.x + 5 && b.y >= sh.y && b.y < sh.y + 5) {
            sh.hp--; return false;
          }
        }
        if (b.y > 198 && b.y < 212 && b.x > self.px && b.x < self.px + 15) {
          self.lives--; self.hitFlash = 0.4;
          if (self.lives <= 0) self.dead = true;
          return false;
        }
        return true;
      });
    },
    render: function (g, A) {
      g.clear(0);
      A.hud(g, { left: 'SCORE ' + this.score, right: 'WAVE ' + this.wave, lives: this.lives });
      var SPR = [
        ['.7..7.', '.7777.', '77.7.7', '777777', '.7..7.'],
        ['..8...', '.8888.', '88.8.8', '.8888.', '8....8'],
        ['.dd...', 'dddddd', 'd.dd.d', 'dddddd', '.d..d.'],
        ['.ee...', '.eeee.', 'e.ee.e', 'eeeeee', 'e....e'],
        ['.bb...', 'bbbbbb', 'b.bb.b', '.bbbb.', 'b.b.b.']
      ];
      var frame = ((this.t * 3) | 0) % 2;
      for (var i = 0; i < this.rows.length; i++) {
        var a = this.rows[i]; if (!a.alive) continue;
        g.sprite(SPR[a.r], a.x, a.y, frame === 1);
      }
      for (var j = 0; j < this.shields.length; j++) {
        var sh = this.shields[j]; if (sh.hp <= 0) continue;
        g.rect(sh.x, sh.y, 5, 5, sh.hp === 3 ? 10 : sh.hp === 2 ? 11 : 9);
      }
      this.shots.forEach(function (s) { g.rect(s.x, s.y, 1, 5, 5); });
      this.bombs.forEach(function (b) { g.rect(b.x, b.y, 1, 4, 15); });
      var pc = (this.hitFlash > 0 && ((this.t * 20) | 0) % 2) ? 7 : 13;
      g.sprite(['...5...', '..555..', '.55555.', '5555555'], this.px + 4, 200, false);
      g.rect(this.px, 204, 15, 4, pc);
      g.rect(0, 214, 320, 1, 2);
    }
  };
  ARCADE.register(G);
})();
