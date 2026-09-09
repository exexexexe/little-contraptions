/* ------------------------------------------------------------------ *
 *  BACKROAD — a top-down racer.
 *
 *  The road scrolls under a fixed car. Everything is drawn on whole
 *  pixels into the shared 320x240 buffer with the cabinet's sixteen
 *  colours, so it belongs to the same machine as the rest.
 *
 *  The road is not a random walk: it is a sum of three sines at
 *  incommensurable rates, sampled by distance rather than by time. That
 *  makes the curve a pure function of how far you have driven, so the
 *  verge you can see at the top of the screen is exactly the verge you
 *  will meet, and slowing down does not change the shape of the corner.
 *
 *  The three amplitudes are not chosen by eye. The road can slide
 *  sideways at most (sum of amplitude x rate) pixels per pixel driven,
 *  which is 0.315 here; at the 210 px/s top speed that is 66 px/s, and
 *  the car steers at up to 147 px/s. So a corner can always be taken —
 *  the first draft could not, and a bot that tracked the centre line
 *  perfectly still went off in three seconds.
 * ------------------------------------------------------------------ */
(function () {
  var VIEW = 226;                 // pixels of road on screen, below the HUD
  var OY = 14;                    // top of the play field
  var CAR_Y = OY + VIEW - 34;     // the car sits low, so you can see ahead

  function roadCentre(d) {
    // three sines, none a multiple of another, so it never repeats visibly
    return 160
      + Math.sin(d * 0.0031) * 46
      + Math.sin(d * 0.0071 + 1.7) * 18
      + Math.sin(d * 0.0017 + 0.4) * 26;
  }
  function halfWidth(d) {
    // the road narrows as the run goes on; never past something driveable
    return Math.max(26, 62 - d * 0.0018);
  }

  var g_ = {
    id: 'racer', name: 'BACKROAD', desc: 'Stay on the tarmac. It gets narrower',
    score: 0, dead: false,

    reset: function () {
      this.d = 0;              // distance driven, in road pixels
      this.x = 160;            // the car's own position across the screen
      this.vx = 0;
      this.speed = 96;
      this.score = 0; this.dead = false;
      this.shake = 0; this.grass = 0;
      this.cones = [];         // { d, side }
      this.nextCone = 400;
      this.best = 0;
    },

    step: function (dt, A) {
      // steering has weight: you carry a line into a corner
      var push = (A.key('right') ? 1 : 0) - (A.key('left') ? 1 : 0);
      this.vx += push * 900 * dt;
      this.vx *= Math.pow(0.0016, dt);          // frame-rate independent drag
      this.vx = Math.max(-150, Math.min(150, this.vx));
      this.x += this.vx * dt;
      this.x = Math.max(6, Math.min(314, this.x));

      // the throttle is the up key; lifting off is the only brake
      var want = A.key('up') ? 210 : (A.key('down') ? 70 : 132);
      this.speed += (want - this.speed) * Math.min(1, dt * 1.7);

      this.d += this.speed * dt;
      this.score = Math.floor(this.d / 10);

      // cones on the verge, placed by distance so they arrive with the road
      if (this.d > this.nextCone) {
        this.cones.push({ d: this.d + VIEW + 20, side: Math.random() < 0.5 ? -1 : 1 });
        this.nextCone = this.d + 130 + Math.random() * 260;
      }
      this.cones = this.cones.filter(function (c) { return c.d > this.d - 30; }, this);

      // off the tarmac: you are slowed and shaken, and three seconds of it
      // ends the run. Leaving the road is not instant death, it is a mistake
      // you get a moment to correct.
      var c = roadCentre(this.d), hw = halfWidth(this.d);
      var off = Math.abs(this.x - c) - hw;
      if (off > 0) {
        this.grass += dt;
        this.shake = 1;
        this.speed *= Math.pow(0.22, dt);
        if (this.grass > 3 || off > 40) this.dead = true;
      } else {
        this.grass = Math.max(0, this.grass - dt * 1.6);
        this.shake = Math.max(0, this.shake - dt * 4);
      }

      // a cone at your distance, on your side of the road, is a hit
      for (var i = 0; i < this.cones.length; i++) {
        var k = this.cones[i];
        if (Math.abs(k.d - this.d) < 6) {
          var cx = roadCentre(k.d) + k.side * (halfWidth(k.d) - 5);
          if (Math.abs(this.x - cx) < 8) { this.dead = true; }
        }
      }
    },

    render: function (g, A) {
      g.clear(0);
      A.hud(g, { left: 'SCORE ' + this.score, right: 'HI ' + A.hiscore('racer'),
                 mid: null });

      var jitter = this.shake > 0 ? ((Math.random() * 3) | 0) - 1 : 0;

      // ground either side of the tarmac
      g.rect(0, OY, 320, VIEW, 10);

      // the road, one scanline at a time, near row first
      for (var r = 0; r < VIEW; r++) {
        var y = OY + VIEW - 1 - r;
        var dd = this.d + r;
        var c = roadCentre(dd) + jitter, hw = halfWidth(dd);
        var l = Math.round(c - hw), w = Math.round(hw * 2);

        // verge, tarmac, verge
        g.rect(l - 3, y, 3, 1, 11);
        g.rect(l + w, y, 3, 1, 11);
        g.rect(l, y, w, 1, 2);

        // painted edges, dashed by distance so they scroll with the road
        var dash = (Math.floor(dd / 8) % 2) === 0;
        g.rect(l, y, 1, 1, 4);
        g.rect(l + w - 1, y, 1, 1, 4);
        if (dash) g.rect(Math.round(c) + jitter, y, 1, 1, 9);
      }

      // cones
      for (var i = 0; i < this.cones.length; i++) {
        var k = this.cones[i];
        var rr = k.d - this.d;
        if (rr < 0 || rr >= VIEW) continue;
        var cy = OY + VIEW - 1 - Math.round(rr);
        var cx = Math.round(roadCentre(k.d) + k.side * (halfWidth(k.d) - 5)) + jitter;
        g.rect(cx - 2, cy - 1, 5, 2, 8);
        g.rect(cx - 1, cy - 3, 3, 2, 5);
      }

      // the car, drawn from above
      var px = Math.round(this.x) - 5, py = CAR_Y;
      var lean = this.vx > 40 ? 1 : (this.vx < -40 ? -1 : 0);
      g.sprite([
        '..77..',
        '.7777.',
        '755557',
        '755557',
        '.7777.',
        '777777',
        '.0..0.'
      ], px, py, false);
      // headlight wash ahead, so the car reads as facing up
      g.rect(px + 1 + lean, py - 3, 1, 2, 9);
      g.rect(px + 4 + lean, py - 3, 1, 2, 9);

      // speed readout, in the cabinet's own units
      g.text(Math.round(this.speed) + ' KPH', 6, OY + VIEW - 10, 13);

      if (this.grass > 0.15 && !this.dead) {
        g.textC('OFF  THE  ROAD', OY + 30, ((this.grass * 8) | 0) % 2 ? 7 : 9);
      }
    }
  };
  ARCADE.register(g_);
})();
