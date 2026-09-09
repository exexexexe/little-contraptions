/* HOISTER — the swinging-crane timing game.
 * The crane pendulums a slab overhead; drop it and whatever hangs past
 * the slab below is sheared off. Miss entirely and the tower is done.
 * Art and HUD are this cabinet's own — no ranking panel, no coin slot. */
(function () {
  var FLOOR = 218, BH = 10;
  var G = {
    id: 'stacker', name: 'HOISTER', desc: 'Time the drop. Overhang gets sheared off',
    score: 0, dead: false,
    reset: function () {
      this.stack = [{ x: 110, w: 100 }];
      this.score = 0; this.dead = false; this.cam = 0; this.camTo = 0;
      this.perfect = 0; this.t = 0;
      this.newBlock();
      this.falling = null; this.chips = [];
    },
    newBlock: function () {
      var top = this.stack[this.stack.length - 1];
      this.bw = top.w;
      this.swing = 0;
      this.speed = 1.1 + Math.min(1.5, this.stack.length * 0.06);
      this.phase = Math.random() * Math.PI * 2;
    },
    craneX: function () {
      var span = 150 - Math.min(50, this.stack.length * 2);
      return 160 + Math.sin(this.phase) * span - this.bw / 2;
    },
    step: function (dt, A) {
      this.t += dt;
      this.cam += (this.camTo - this.cam) * Math.min(1, dt * 6);
      this.chips.forEach(function (c) { c.vy += 380 * dt; c.x += c.vx * dt; c.y += c.vy * dt; });
      this.chips = this.chips.filter(function (c) { return c.y < 300; });

      if (this.falling) {
        var f = this.falling;
        f.vy += 520 * dt; f.y += f.vy * dt;
        var top = this.stack[this.stack.length - 1];
        var restY = FLOOR - this.stack.length * BH;
        if (f.y >= restY) {
          f.y = restY;
          var l = Math.max(f.x, top.x), r = Math.min(f.x + f.w, top.x + top.w);
          var ov = r - l;
          if (ov <= 0) { this.dead = true; this.falling = null; return; }
          // shear the overhang and throw the offcuts away
          if (f.x < l) this.chips.push({ x: f.x, y: f.y, w: l - f.x, vx: -40, vy: -50 });
          if (f.x + f.w > r) this.chips.push({ x: r, y: f.y, w: (f.x + f.w) - r, vx: 40, vy: -50 });
          var exact = Math.abs(f.x - top.x) < 1.4;
          if (exact) { this.perfect++; this.score += 20 + this.perfect * 5; ov = top.w; l = top.x; }
          else { this.perfect = 0; this.score += 10; }
          this.stack.push({ x: l, w: ov });
          this.falling = null;
          this.camTo = Math.max(0, (this.stack.length - 9) * BH);
          this.newBlock();
        }
        return;
      }
      this.phase += this.speed * dt;
      if (A.hit('a')) {
        this.falling = { x: this.craneX(), y: 34 + this.cam, w: this.bw, vy: 0 };
      }
    },
    render: function (g, A) {
      g.clear(0);
      var cam = this.cam;
      // sky bands, darker the higher you get
      var band = Math.min(5, (this.stack.length / 8) | 0);
      g.rect(0, 12, 320, 228, [0, 1, 1, 0, 0, 0][band]);
      for (var s = 0; s < 26; s++) {
        var sx = (s * 71 + 13) % 320, sy = 16 + ((s * 37) % 200) - (cam * 0.25) % 200;
        if (sy > 14) g.px(sx, sy, 2);
      }
      A.hud(g, { left: 'HEIGHT ' + (this.stack.length - 1), right: 'SCORE ' + this.score });

      // the crane rail and its cable
      if (!this.falling && !this.dead) {
        var cx = this.craneX();
        g.rect(0, 26, 320, 2, 2);
        g.rect(cx + this.bw / 2 - 5, 26, 10, 5, 3);
        g.rect(cx + this.bw / 2 - 1, 28, 2, 6, 3);
        this.slab(g, cx, 34, this.bw, 9, true);
      }
      if (this.falling) this.slab(g, this.falling.x, this.falling.y - cam, this.falling.w, 8, true);

      for (var i = 0; i < this.stack.length; i++) {
        var b = this.stack[i];
        var y = FLOOR - i * BH + cam;
        if (y < 8 || y > 244) continue;
        this.slab(g, b.x, y, b.w, BH - 1, i === this.stack.length - 1);
      }
      var self = this;
      this.chips.forEach(function (c) { g.rect(c.x, c.y - cam, c.w, 8, 6); });
      if (this.perfect > 1) g.textC('PERFECT  x' + this.perfect, 20, 9);
      if (!this.falling && !this.dead) g.textC('Z  DROP', 228, 3);
    },
    slab: function (g, x, y, w, h, lit) {
      g.rect(x, y, w, h, lit ? 13 : 12);
      g.rect(x, y, w, 1, 5);
      g.rect(x, y + h - 1, w, 1, 1);
      for (var i = 4; i < w - 3; i += 8) g.rect(x + i, y + 2, 2, h - 4, lit ? 12 : 2);
    }
  };
  ARCADE.register(G);
})();
