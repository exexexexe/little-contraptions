/* ------------------------------------------------------------------ *
 *  The four dioramas.
 *
 *  Each scene draws itself into a 128x128 buffer, one pixel at a time,
 *  which is then scaled up by a whole number with smoothing off. That
 *  single decision is what makes the pixels real: nothing inside the
 *  globe can be smooth even by accident.
 *
 *  A scene gets a seeded generator, so its windows, its trees and its
 *  bricks are the same every time you come back to that preset — the
 *  globe on your shelf does not rearrange itself when you look away.
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var S = 128;                       // the buffer is 128x128

  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* A tiny drawing bench, all integer rectangles. */
  function pen(ctx) {
    return {
      rect: function (x, y, w, h, c) {
        ctx.fillStyle = c;
        ctx.fillRect(x | 0, y | 0, Math.max(0, w | 0), Math.max(0, h | 0));
      },
      px: function (x, y, c) { ctx.fillStyle = c; ctx.fillRect(x | 0, y | 0, 1, 1); },
      /* a gradient sky, but banded rather than smooth, so it stays pixel art */
      sky: function (stops, bands) {
        for (var b = 0; b < bands; b++) {
          var t = b / (bands - 1);
          var c = mix(stops, t);
          ctx.fillStyle = c;
          ctx.fillRect(0, Math.round(b * S / bands), S, Math.ceil(S / bands));
        }
      }
    };
  }

  function hex(c) { return [parseInt(c.slice(1,3),16), parseInt(c.slice(3,5),16), parseInt(c.slice(5,7),16)]; }
  function toHex(a) {
    return '#' + a.map(function (v) {
      return Math.max(0, Math.min(255, Math.round(v))).toString(16).replace(/^(.)$/, '0$1');
    }).join('');
  }
  function mix(stops, t) {
    var n = stops.length - 1;
    var i = Math.min(n - 1, Math.floor(t * n));
    var f = t * n - i;
    var a = hex(stops[i]), b = hex(stops[i + 1]);
    return toHex([a[0]+(b[0]-a[0])*f, a[1]+(b[1]-a[1])*f, a[2]+(b[2]-a[2])*f]);
  }

  /* ---- shared furniture ------------------------------------------- */

  function conifer(p, x, base, h, dark, light) {
    var w = Math.max(3, Math.round(h * 0.62));
    for (var i = 0; i < h; i++) {
      var y = base - i;
      var half = Math.round((w / 2) * (1 - i / h));
      p.rect(x - half, y, half * 2 + 1, 1, i % 3 === 0 ? light : dark);
    }
    p.rect(x, base + 1, 1, 2, '#3A2A1E');
  }

  function snowCap(p, x, y, w, c) { p.rect(x, y, w, 1, c || '#F2F6FF'); }

  function windows(p, r, x, y, w, h, lit, cold) {
    for (var wy = y + 2; wy < y + h - 2; wy += 4) {
      for (var wx = x + 2; wx < x + w - 2; wx += 3) {
        var on = r() < 0.42;
        p.rect(wx, wy, 1, 2, on ? lit : cold);
      }
    }
  }

  /* ================= 1. a city rooftop ============================== */
  function rooftop(ctx, seed) {
    var p = pen(ctx), r = rng(seed);
    p.sky(['#0B1024', '#1B2450', '#3A3C6E', '#6A4A6E'], 22);

    // a moon, low and small
    p.rect(96, 20, 7, 7, '#E8E4D0');
    p.rect(97, 21, 5, 5, '#F6F3E4');
    p.rect(99, 19, 1, 1, '#D8D4C0');

    // far skyline, three depths
    var depths = [
      { base: 92, lo: 16, hi: 40, col: '#141A34', lit: '#2A3358', cold: '#1A2140' },
      { base: 100, lo: 20, hi: 52, col: '#1B2242', lit: '#D8C88A', cold: '#232B4E' },
      { base: 110, lo: 26, hi: 64, col: '#232B4E', lit: '#F2DC9A', cold: '#2C355C' }
    ];
    depths.forEach(function (d) {
      var x = -6;
      while (x < S + 6) {
        var w = 8 + Math.floor(r() * 16);
        var h = d.lo + Math.floor(r() * (d.hi - d.lo));
        p.rect(x, d.base - h, w, h, d.col);
        snowCap(p, x, d.base - h, w, '#C8D4EE');
        windows(p, r, x, d.base - h, w, h, d.lit, d.cold);
        // the occasional aerial
        if (r() < 0.3) p.rect(x + Math.floor(w / 2), d.base - h - 4, 1, 4, d.col);
        x += w + 1 + Math.floor(r() * 3);
      }
    });

    // the roof you are standing on
    p.rect(0, 110, S, 18, '#2B2438');
    p.rect(0, 110, S, 2, '#3E3550');
    p.rect(0, 112, S, 2, '#E8EEFF');          // snow on the parapet
    // a water tank, because every rooftop has one
    p.rect(18, 92, 20, 18, '#3A3048');
    p.rect(18, 92, 20, 2, '#4E4260');
    p.rect(17, 90, 22, 2, '#E8EEFF');
    for (var i = 0; i < 4; i++) p.rect(20 + i * 5, 110, 2, 6, '#2A2336');
    // a vent, and a string of lights
    p.rect(88, 100, 10, 10, '#332B42');
    p.rect(87, 98, 12, 2, '#E8EEFF');
    var cols = ['#E2504E', '#E8C24E', '#4EC28A', '#4E8AE2'];
    for (var lx = 44; lx < 86; lx += 4) {
      var sag = Math.round(Math.sin((lx - 44) / 42 * Math.PI) * 5);
      p.rect(lx, 96 + sag, 1, 1, cols[(lx / 4) % cols.length]);
      p.rect(lx + 1, 95 + sag, 1, 1, '#4A4258');
    }
    p.rect(40, 88, 2, 8, '#332B42');
    p.rect(86, 88, 2, 12, '#332B42');
  }

  /* ================= 2. a snowy village ============================= */
  function village(ctx, seed) {
    var p = pen(ctx), r = rng(seed);
    p.sky(['#101A2E', '#20304E', '#405878', '#7E90A6'], 20);

    // hills behind
    for (var hx = 0; hx < S; hx++) {
      var h1 = 66 + Math.round(Math.sin(hx / 26) * 7 + Math.sin(hx / 11) * 3);
      p.rect(hx, h1, 1, S - h1, '#2A3A52');
    }
    for (var hx2 = 0; hx2 < S; hx2++) {
      var h2 = 76 + Math.round(Math.sin(hx2 / 19 + 2) * 6 + Math.sin(hx2 / 7) * 2);
      p.rect(hx2, h2, 1, S - h2, '#3E5270');
      p.rect(hx2, h2, 1, 2, '#DCE6F6');
    }

    // trees on the slope
    for (var t = 0; t < 12; t++) {
      var tx = 4 + Math.floor(r() * 120);
      var tb = 74 + Math.floor(r() * 10);
      conifer(p, tx, tb, 8 + Math.floor(r() * 7), '#1E3A2E', '#2C523E');
    }

    // the ground
    p.rect(0, 96, S, 32, '#E4ECFA');
    p.rect(0, 96, S, 2, '#F4F8FF');

    // houses
    var houses = [[10, 86, 22, 14], [38, 80, 26, 20], [70, 84, 20, 16], [96, 78, 24, 22]];
    houses.forEach(function (h, i) {
      var x = h[0], y = h[1], w = h[2], hh = h[3];
      p.rect(x, y, w, hh, i % 2 ? '#6B4A3E' : '#5A4038');
      // roof
      for (var k = 0; k < Math.ceil(w / 2); k++) {
        p.rect(x + k, y - k - 1, w - k * 2, 1, '#3A2E36');
      }
      for (var k2 = 0; k2 < Math.ceil(w / 2); k2++) {
        p.rect(x + k2, y - k2 - 2, w - k2 * 2, 1, '#EEF4FF');
      }
      // one warm window each, sometimes two
      p.rect(x + 4, y + 4, 3, 4, '#F2C86A');
      if (w > 22) p.rect(x + w - 8, y + 4, 3, 4, '#F2C86A');
      p.rect(x + Math.floor(w / 2) - 1, y + hh - 6, 3, 6, '#3A2E36');
      // chimney and smoke
      p.rect(x + w - 6, y - Math.ceil(w / 2) - 2, 3, 5, '#4A3A42');
      var sx = x + w - 5;
      for (var s = 0; s < 5; s++) {
        p.rect(sx + Math.round(Math.sin(s) * 2), y - Math.ceil(w / 2) - 5 - s * 3, 2, 2,
               'rgba(220,228,242,' + (0.34 - s * 0.055) + ')');
      }
    });

    // a fence, and a lamp
    for (var f = 4; f < S; f += 6) {
      p.rect(f, 104, 1, 6, '#4A3A32');
      p.rect(f, 103, 1, 1, '#EEF4FF');
    }
    p.rect(2, 104, S, 1, '#4A3A32');
    p.rect(112, 92, 2, 18, '#2E2A34');
    p.rect(110, 88, 6, 5, '#F2D68A');
    p.rect(111, 89, 4, 3, '#FFF4C8');
  }

  /* ================= 3. a small-town main street ==================== */
  function mainstreet(ctx, seed) {
    var p = pen(ctx), r = rng(seed);
    p.sky(['#161C30', '#2A3050', '#4E4A68', '#8A6E72'], 20);

    // a row of shopfronts in one-point perspective, receding to the right
    var x = -4, depth = 0;
    while (x < S) {
      var w = 22 - depth * 2;
      var h = 54 - depth * 5;
      if (w < 8) break;
      var top = 96 - h;
      var body = ['#6E4A44', '#4A5A6E', '#5E5A46', '#4E4458'][depth % 4];
      p.rect(x, top, w, h, body);
      // cornice
      p.rect(x - 1, top - 2, w + 2, 2, '#2E2836');
      p.rect(x - 1, top - 3, w + 2, 1, '#EEF4FF');
      // upstairs windows
      for (var wy = top + 5; wy < 78; wy += 9) {
        for (var wx = x + 3; wx < x + w - 3; wx += 6) {
          p.rect(wx, wy, 3, 5, r() < 0.5 ? '#F2C86A' : '#2A2E42');
        }
      }
      // the shopfront, glowing
      p.rect(x + 1, 80, w - 2, 16, '#221E2C');
      p.rect(x + 2, 82, w - 4, 10, r() < 0.7 ? '#F0D08A' : '#39344A');
      // an awning on some of them
      if (r() < 0.5) {
        for (var a = 0; a < 3; a++) p.rect(x + a, 78 - a, w - a * 2, 1,
          ['#B04A44','#3E7A5E','#2E5A82'][depth % 3]);
      }
      x += w + 2;
      depth++;
    }

    // the road, with the snow pushed to the sides
    p.rect(0, 96, S, 32, '#3A3A46');
    p.rect(0, 96, S, 2, '#4A4A58');
    p.rect(0, 98, S, 4, '#E4ECFA');
    p.rect(0, 118, S, 10, '#E4ECFA');
    for (var d = 6; d < S; d += 14) p.rect(d, 108, 7, 2, '#C8C8D4');

    // a lamp post and a post box
    p.rect(16, 74, 2, 26, '#26222E');
    p.rect(13, 68, 8, 6, '#F2D68A');
    p.rect(14, 69, 6, 4, '#FFF6D2');
    p.rect(100, 88, 7, 12, '#A03A34');
    p.rect(100, 86, 7, 2, '#8A2E28');
    p.rect(102, 90, 3, 1, '#2A1C1A');

    // a parked car, half under snow
    p.rect(58, 88, 22, 8, '#2E4A6E');
    p.rect(62, 82, 13, 6, '#3A5A80');
    p.rect(63, 83, 4, 4, '#8AA8C8');
    p.rect(69, 83, 4, 4, '#8AA8C8');
    p.rect(58, 80, 22, 2, '#EEF4FF');
    p.rect(61, 96, 4, 3, '#1A1A22');
    p.rect(74, 96, 4, 3, '#1A1A22');
  }

  /* ================= 4. a lakeside cabin ============================ */
  function cabin(ctx, seed) {
    var p = pen(ctx), r = rng(seed);
    p.sky(['#0E1A26', '#1E3446', '#3E5E6E', '#7E9AA0'], 20);

    // far shore and mountains
    for (var mx = 0; mx < S; mx++) {
      var m = 52 + Math.round(Math.sin(mx / 21) * 12 + Math.sin(mx / 9 + 1) * 4);
      p.rect(mx, m, 1, 80 - m, '#22384A');
      if (m < 48) p.rect(mx, m, 1, 3, '#DCE8F2');
    }
    for (var fx = 0; fx < S; fx++) {
      var f = 74 + Math.round(Math.sin(fx / 15 + 3) * 3);
      p.rect(fx, f, 1, 6, '#1C3A32');
    }
    for (var t = 0; t < 16; t++) {
      conifer(p, Math.floor(r() * S), 78 + Math.floor(r() * 3), 6 + Math.floor(r() * 8),
              '#16302A', '#204034');
    }

    // the lake, half frozen
    p.rect(0, 80, S, 22, '#2A4A5E');
    for (var ly = 80; ly < 102; ly += 2) {
      p.rect(0, ly, S, 1, ly % 4 ? '#31576C' : '#284356');
    }
    // ice at the near edge
    p.rect(0, 96, S, 6, '#B8D0DE');
    p.rect(0, 96, S, 1, '#DCEAF2');
    for (var cr = 0; cr < 9; cr++) {
      var cx = Math.floor(r() * S);
      p.rect(cx, 97 + Math.floor(r() * 4), 4 + Math.floor(r() * 8), 1, '#9CB8C8');
    }

    // the near bank
    p.rect(0, 102, S, 26, '#E8F0FA');
    p.rect(0, 102, S, 2, '#F6FAFF');

    // the cabin
    var cx0 = 20, cy0 = 62, cw = 44, ch = 30;
    p.rect(cx0, cy0, cw, ch, '#5A3E30');
    for (var log = 0; log < ch; log += 4) p.rect(cx0, cy0 + log, cw, 1, '#4A3226');
    // roof
    for (var k = 0; k < Math.ceil(cw / 2) + 3; k++) {
      p.rect(cx0 - 3 + k, cy0 - k - 1, cw + 6 - k * 2, 1, '#3A2A22');
    }
    for (var k2 = 0; k2 < Math.ceil(cw / 2) + 3; k2++) {
      p.rect(cx0 - 3 + k2, cy0 - k2 - 2, cw + 6 - k2 * 2, 1, '#F0F6FF');
    }
    // door and windows
    p.rect(cx0 + 18, cy0 + 16, 8, 14, '#3A2A22');
    p.rect(cx0 + 24, cy0 + 23, 1, 1, '#D8C070');
    p.rect(cx0 + 5, cy0 + 8, 8, 8, '#F2C86A');
    p.rect(cx0 + 31, cy0 + 8, 8, 8, '#F2C86A');
    p.rect(cx0 + 9, cy0 + 8, 1, 8, '#3A2A22');
    p.rect(cx0 + 5, cy0 + 12, 8, 1, '#3A2A22');
    p.rect(cx0 + 35, cy0 + 8, 1, 8, '#3A2A22');
    p.rect(cx0 + 31, cy0 + 12, 8, 1, '#3A2A22');
    // light spilling onto the snow
    p.rect(cx0 + 2, 102, 14, 3, 'rgba(242,200,106,.22)');
    p.rect(cx0 + 28, 102, 14, 3, 'rgba(242,200,106,.22)');
    // chimney and smoke
    p.rect(cx0 + 34, cy0 - 22, 4, 8, '#4A3A32');
    for (var s = 0; s < 6; s++) {
      p.rect(cx0 + 34 + Math.round(Math.sin(s * .9) * 3), cy0 - 26 - s * 4, 3, 3,
             'rgba(216,226,238,' + (0.3 - s * 0.045) + ')');
    }
    // a jetty out onto the ice
    p.rect(78, 96, 26, 2, '#4A3A2E');
    for (var j = 80; j < 104; j += 6) p.rect(j, 98, 2, 5, '#3A2E24');
    // a rowing boat, pulled up
    p.rect(96, 104, 16, 4, '#6B4A38');
    p.rect(98, 102, 12, 2, '#7E5A44');
  }

  /* ================= 5. a lighthouse in the weather ================= */
  function lighthouse(ctx, seed) {
    var p = pen(ctx), r = rng(seed);
    p.sky(['#0A1220', '#16283C', '#2A4458', '#4A6470'], 20);

    // the sea: bands that get lighter and choppier towards the front
    for (var y = 84; y < S; y++) {
      var t = (y - 84) / (S - 84);
      p.rect(0, y, S, 1, mix(['#132638', '#1E3A50', '#2E5468'], t));
      if (r() < 0.5) {
        var wx = Math.floor(r() * S), ww = 2 + Math.floor(r() * 5);
        p.rect(wx, y, ww, 1, '#5A8296');
      }
    }

    // the rock it stands on
    p.rect(38, 92, 52, 12, '#2A2A2E');
    p.rect(44, 88, 40, 6, '#33333A');
    p.rect(50, 84, 28, 5, '#3A3A42');
    for (var k = 0; k < 22; k++) p.px(40 + Math.floor(r() * 48), 86 + Math.floor(r() * 16), '#22222A');

    // the tower, tapering, with the classic bands
    for (var i = 0; i < 46; i++) {
      var ty = 84 - i;
      var half = Math.round(7 - i * 0.075);
      var band = Math.floor(i / 7) % 2 === 0;
      p.rect(64 - half, ty, half * 2, 1, band ? '#E8E4DC' : '#C6483C');
      p.px(64 - half, ty, '#9A9490');
    }
    // the gallery and the lamp room
    p.rect(56, 38, 16, 3, '#2E3238');
    p.rect(58, 30, 12, 8, '#F2E8B4');
    p.rect(58, 30, 12, 2, '#3A3E44');
    p.rect(57, 26, 14, 4, '#2E3238');
    p.rect(63, 22, 2, 4, '#2E3238');
    // the beam, thrown out to one side in a wedge of light
    for (var b = 0; b < 40; b++) {
      var by = 34 - Math.round(b * 0.28);
      var spread = Math.round(1 + b * 0.22);
      p.rect(70 + b, by - spread, 1, spread * 2, 'rgba(242,232,180,0.10)');
    }
    // a keeper's cottage tucked behind
    p.rect(84, 74, 18, 12, '#3E3A42');
    p.rect(83, 72, 20, 3, '#5A5460');
    p.rect(88, 78, 3, 4, '#F2C86A');
    p.rect(95, 78, 3, 4, '#2C2A34');
  }

  /* ================= 6. a terrace in fog ============================ */
  function terrace(ctx, seed) {
    var p = pen(ctx), r = rng(seed);
    p.sky(['#2A2A32', '#3C3A42', '#4E4A52', '#5E5A60'], 18);

    // three receding rows, each paler than the last — the fog is doing
    // the perspective, so the drawing does not have to
    var rows = [
      { base: 86,  h: 34, wall: '#3A3840', roof: '#2E2C34', lit: '#6A6470', w: 13 },
      { base: 100, h: 40, wall: '#4A4650', roof: '#3A3842', lit: '#C6A868', w: 15 },
      { base: 118, h: 46, wall: '#5A5560', roof: '#46424E', lit: '#F2CE86', w: 17 }
    ];
    rows.forEach(function (row, ri) {
      var x = -8 + ri * 4;
      while (x < S + 8) {
        p.rect(x, row.base - row.h, row.w, row.h, row.wall);
        // the pitched roof, as a stepped triangle
        for (var i = 0; i < 6; i++) {
          p.rect(x + i, row.base - row.h - 6 + i, row.w - i * 2, 1, row.roof);
        }
        // a chimney with two pots
        p.rect(x + row.w - 4, row.base - row.h - 10, 3, 5, row.roof);
        p.rect(x + row.w - 4, row.base - row.h - 12, 1, 2, '#6E6874');
        // windows: two up, one down and a door
        for (var wy = 0; wy < 2; wy++) {
          for (var wx = 0; wx < 2; wx++) {
            var on = r() < (ri === 2 ? 0.5 : 0.3);
            p.rect(x + 3 + wx * 6, row.base - row.h + 6 + wy * 12, 3, 5, on ? row.lit : '#2A2830');
          }
        }
        if (ri === 2) p.rect(x + 6, row.base - 10, 4, 10, '#33303A');
        x += row.w + 1;
      }
      // the fog bank sitting on each row
      p.rect(0, row.base - 3, S, 3, 'rgba(150,146,156,0.22)');
    });

    // the pavement, and one streetlamp with its cone
    p.rect(0, 118, S, 10, '#4A4650');
    p.rect(0, 118, S, 1, '#6A6470');
    p.rect(30, 88, 2, 32, '#2E2C34');
    p.rect(28, 84, 6, 5, '#F2CE86');
    for (var c = 0; c < 16; c++) {
      p.rect(31 - c, 89 + c * 2, 2 + c * 2, 2, 'rgba(242,206,134,0.05)');
    }
  }

  /* ================= 7. a country halt ============================== */
  function halt(ctx, seed) {
    var p = pen(ctx), r = rng(seed);
    p.sky(['#0E1428', '#1C2440', '#32365C', '#4A4468'], 20);

    // hills behind, with snow on the tops
    for (var hx = -10; hx < S + 10; hx += 26) {
      var hh = 22 + Math.floor(r() * 14);
      for (var i = 0; i < hh; i++) {
        var half = Math.round((16) * (1 - i / hh));
        p.rect(hx - half, 80 - i, half * 2, 1, i > hh - 5 ? '#D8E2F2' : '#242C48');
      }
    }
    // trees along the back
    for (var t = 4; t < S; t += 11) conifer(p, t, 82, 12 + Math.floor(r() * 6), '#1A2A22', '#263A2E');

    // the ground, and the platform
    p.rect(0, 82, S, 46, '#E4EAF6');
    p.rect(0, 96, S, 32, '#C8D2E4');
    p.rect(0, 96, S, 2, '#F2F6FF');

    // the track: two rails and sleepers, running off to one side
    p.rect(0, 108, S, 14, '#3A3038');
    for (var sx = 0; sx < S; sx += 7) p.rect(sx, 110, 5, 2, '#4E4038');
    p.rect(0, 112, S, 1, '#8A94A6');
    p.rect(0, 118, S, 1, '#8A94A6');

    // the little shelter
    p.rect(20, 66, 34, 30, '#5A3A2E');
    p.rect(18, 62, 38, 5, '#3E2A22');
    p.rect(18, 60, 38, 2, '#F2F6FF');
    p.rect(26, 74, 8, 10, '#F2CE86');
    p.rect(40, 74, 8, 10, '#F2CE86');
    p.rect(34, 84, 6, 12, '#3A2820');
    // the running-in board, unreadable at this size on purpose
    p.rect(64, 74, 26, 8, '#1E3A2E');
    p.rect(65, 76, 24, 1, '#8AB49A');
    p.rect(65, 79, 16, 1, '#8AB49A');
    p.rect(70, 82, 2, 14, '#2A2A2E');
    p.rect(82, 82, 2, 14, '#2A2A2E');
    // a lamp on the platform, and a bench
    p.rect(100, 72, 2, 24, '#2A2A2E');
    p.rect(98, 68, 6, 5, '#F2DC9A');
    p.rect(106, 88, 14, 2, '#4A3A30');
    p.rect(107, 90, 2, 5, '#4A3A30');
    p.rect(117, 90, 2, 5, '#4A3A30');
  }

  /* ================= 8. an orchard in blossom ======================= */
  function orchard(ctx, seed) {
    var p = pen(ctx), r = rng(seed);
    p.sky(['#F2D8C6', '#F6E4CE', '#E8E2D2', '#CFE0D2'], 18);

    // a low sun sitting in the haze
    p.rect(94, 34, 12, 12, '#F8E6C0');
    p.rect(96, 32, 8, 16, '#F8E6C0');
    p.rect(92, 36, 16, 8, '#F8E6C0');

    // the grass, in three bands
    p.rect(0, 84, S, 44, '#7E9A62');
    p.rect(0, 96, S, 32, '#6E8C54');
    p.rect(0, 112, S, 16, '#5E7C46');

    // a drystone wall along the back
    p.rect(0, 80, S, 6, '#A8A296');
    for (var wx = 0; wx < S; wx += 5) {
      p.rect(wx, 80 + (wx % 10 ? 0 : 2), 4, 2, '#8E8A80');
      p.px(wx + 2, 83, '#7E7A72');
    }

    // the trees: trunk, a scribble of branches, and blossom in clumps
    var rows = [ { y: 92, sc: 0.72 }, { y: 104, sc: 0.86 }, { y: 118, sc: 1 } ];
    rows.forEach(function (row, ri) {
      for (var i = 0; i < 4 - ri * 0; i++) {
        var x = 16 + i * 32 + (ri % 2 ? 12 : 0);
        var h = Math.round(30 * row.sc);
        p.rect(x, row.y - h, Math.max(2, Math.round(3 * row.sc)), h, '#4E3A2C');
        for (var b = 0; b < 3; b++) {
          p.rect(x - 5 + b * 4, row.y - h + 4 + b * 3, 5, 1, '#4E3A2C');
        }
        var rad = Math.round(11 * row.sc);
        for (var k = 0; k < 34; k++) {
          var a = r() * 6.283, d = r() * rad;
          var px2 = Math.round(x + 1 + Math.cos(a) * d);
          var py2 = Math.round(row.y - h - 2 + Math.sin(a) * d * 0.8);
          p.px(px2, py2, r() < 0.35 ? '#FFFFFF' : (r() < 0.6 ? '#F6D6DE' : '#EEC4D0'));
        }
      }
    });

    // fallen blossom on the grass
    for (var f = 0; f < 40; f++) p.px(Math.floor(r() * S), 96 + Math.floor(r() * 32), '#F2DCE2');
  }

  /* ================= 9. a hilltop observatory ======================= */
  function observatory(ctx, seed) {
    var p = pen(ctx), r = rng(seed);
    p.sky(['#05060F', '#0A0E1E', '#121A34', '#1E2A46'], 22);

    // a scatter of stars, fixed by the seed so they do not crawl
    for (var i = 0; i < 90; i++) {
      var sx = Math.floor(r() * S), sy = Math.floor(r() * 88);
      var b = r();
      p.px(sx, sy, b < 0.6 ? '#8A96B4' : (b < 0.9 ? '#C8D2E8' : '#FFFFFF'));
    }
    // and a band of the galaxy across one corner
    for (var g = 0; g < 220; g++) {
      var t = r();
      var gx = Math.round(t * S), gy = Math.round(16 + t * 46 + (r() - 0.5) * 14);
      p.px(gx, gy, r() < 0.5 ? '#3A4468' : '#5A6490');
    }

    // the hill
    for (var y = 88; y < S; y++) {
      var w = Math.round((y - 84) * 2.6);
      p.rect(64 - w, y, w * 2, 1, y < 96 ? '#1A2030' : '#141A28');
    }
    // the dome: a stepped hemisphere with a shutter open to the sky
    var cx = 64, base = 92;
    for (var d = 0; d < 16; d++) {
      var half = Math.round(Math.sqrt(Math.max(0, 256 - d * d)));
      p.rect(cx - half, base - d, half * 2, 1, d > 11 ? '#3E4658' : '#2E3644');
    }
    p.rect(cx - 18, base, 36, 4, '#242A36');
    p.rect(cx - 20, base + 4, 40, 8, '#1E2430');
    // the shutter, and the tube looking out of it
    p.rect(cx - 3, base - 16, 6, 16, '#0A0E18');
    p.rect(cx - 2, base - 15, 4, 14, '#141A28');
    for (var t2 = 0; t2 < 12; t2++) {
      p.rect(cx - 2 + t2, base - 14 - t2, 3, 3, '#5A6478');
    }
    // a door with a light on behind it
    p.rect(cx - 3, base + 4, 6, 8, '#F2C86A');
    // a fence of aerials down the slope
    for (var a2 = 0; a2 < 4; a2++) {
      p.rect(30 + a2 * 24, 104 - a2 % 2 * 2, 1, 8, '#2A3040');
      p.rect(29 + a2 * 24, 103 - a2 % 2 * 2, 3, 1, '#2A3040');
    }
  }

  window.GLOBE_SCENES = [
    { id:'rooftop',    name:'A city rooftop',      note:'the good roof, the one with the tank on it',
      draw: rooftop,    seed: 0x51A7, weather:'snow', tone:'city' },
    { id:'village',    name:'A snowy village',     note:'four houses, one lamp, everybody in',
      draw: village,    seed: 0x7C31, weather:'snow', tone:'village' },
    { id:'mainstreet', name:'A small-town main street', note:'shops still lit, nobody about',
      draw: mainstreet, seed: 0x2E90, weather:'snow', tone:'street' },
    { id:'cabin',      name:'A lakeside cabin',    note:'half the lake has gone over',
      draw: cabin,      seed: 0x9B44, weather:'snow', tone:'lake' },
    { id:'lighthouse', name:'A lighthouse in the weather', note:'the light is on and the sea is not having it',
      draw: lighthouse, seed: 0x3F17, weather:'rain', tone:'sea' },
    { id:'terrace',    name:'A terrace in fog',    note:'three rows deep and you can only see one',
      draw: terrace,    seed: 0x6D22, weather:'fog', tone:'street' },
    { id:'halt',       name:'A country halt',      note:'two rails, one lamp, no train due',
      draw: halt,       seed: 0x8A5E, weather:'snow', tone:'village' },
    { id:'orchard',    name:'An orchard in blossom', note:'the one week a year it does this',
      draw: orchard,    seed: 0x24C9, weather:'spore', tone:'lake' },
    { id:'observatory',name:'A hilltop observatory', note:'shutter open, nobody about, everything visible',
      draw: observatory, seed: 0xB30D, weather:'starfield', tone:'city' }
  ];
  window.GLOBE_SIZE = S;
})();
