/* DESCENT — a marching grid that speeds up as it thins out. */
(function () {
  var G = {
    id: 'invaders', name: 'DESCENT', desc: 'They come down faster the fewer are left',
    score: 0, dead: false,
    reset: function () {
      this.score = 0; this.lives = 3; this.dead = false; this.wave = 1;
      this.px = 152; this.shots = []; this.bombs = []; this.t = 0; this.hitFlash = 0;
      /* ---- the hidden shield ----------------------------------------
         DESCENT has no downward movement, so the down key does nothing
         at all in this game — which makes holding it the one input a
         player can give that cannot be given by accident. Hold it for
         two continuous seconds and the ship comes up with an energy
         shield: it eats one hit instead of a life, breaks with a flare,
         and rebuilds itself after five seconds of not being hit, with
         the rising shimmer that goes with it. Nothing about it is on
         screen until it exists.                                       */
      this.downHold = 0;
      this.shieldOn = false;      // unlocked at all
      this.shield = 0;            // 1 = up, 0 = down
      this.recharge = 0;          // seconds until it comes back
      this.breakFlash = 0;
      this.chargeShimmer = 0;
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
      if (this.breakFlash > 0) this.breakFlash -= dt;
      if (this.chargeShimmer > 0) this.chargeShimmer -= dt;

      // the hidden unlock, and the recharge cycle
      if (A.key('down')) {
        this.downHold += dt;
        if (!this.shieldOn && this.downHold > 2) {
          this.shieldOn = true; this.shield = 1;
          if (window.LCAch) LCAch.fire('arcade.shield');
          this.chargeShimmer = 0.9;
        }
      } else this.downHold = 0;

      if (this.shieldOn && this.shield <= 0) {
        this.recharge -= dt;
        if (this.recharge <= 0) { this.shield = 1; this.chargeShimmer = 0.9; }
      }

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
          if (self.shieldOn && self.shield > 0) {
            // the shield takes it: no life lost, and five seconds of nerves
            self.shield = 0;
            self.recharge = 5;
            self.breakFlash = 0.5;
            return false;
          }
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

      this.drawShield(g);

      g.rect(0, 214, 320, 1, 2);
    },

    /* The shield, drawn on the same 320x240 grid as everything else — an
       arc of whole pixels rather than a smooth stroke, so it belongs to
       the cabinet. Three states: up (a steady bubble), breaking (a bright
       flare that expands and goes), and recharging (a shimmer that walks
       round the arc as it builds). */
    drawShield: function (g) {
      if (!this.shieldOn) return;
      var cx = this.px + 7, cy = 205;
      var i, a, x, y;

      if (this.breakFlash > 0) {
        // the flare: two expanding rings, brightest at the moment it goes
        var k = 1 - this.breakFlash / 0.5;
        for (var ring = 0; ring < 2; ring++) {
          var rr = 13 + k * 16 + ring * 4;
          var col = ring === 0 ? 5 : 13;
          for (i = 0; i < 30; i++) {
            a = Math.PI + (i / 29) * Math.PI;
            x = cx + Math.cos(a) * rr;
            y = cy + Math.sin(a) * rr * 0.75;
            if (Math.random() > k * 0.7) g.px(x, y, col);
          }
        }
        return;
      }

      if (this.shield <= 0) {
        // down: a broken outline, so you can see what you have lost
        for (i = 0; i < 26; i++) {
          if (i % 3 === 0) continue;
          a = Math.PI + (i / 25) * Math.PI;
          g.px(cx + Math.cos(a) * 13, cy + Math.sin(a) * 10, 2);
        }
        return;
      }

      // up: a steady bubble, brighter along the top
      for (i = 0; i < 34; i++) {
        a = Math.PI + (i / 33) * Math.PI;
        x = cx + Math.cos(a) * 13;
        y = cy + Math.sin(a) * 10;
        var top = Math.abs(Math.sin(a)) > 0.55;
        g.px(x, y, top ? 13 : 12);
      }
      // the recharge shimmer: a bright arc that runs round it once
      if (this.chargeShimmer > 0) {
        var p = 1 - this.chargeShimmer / 0.9;
        for (i = 0; i < 7; i++) {
          a = Math.PI + Math.min(1, p + i * 0.03) * Math.PI;
          g.px(cx + Math.cos(a) * 13, cy + Math.sin(a) * 10, 5);
          g.px(cx + Math.cos(a) * 15, cy + Math.sin(a) * 12, i < 3 ? 13 : 12);
        }
      }
    }
  };
  ARCADE.register(G);
})();
