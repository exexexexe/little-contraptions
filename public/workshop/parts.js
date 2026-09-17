/* parts.js — Chapter 1: Workshop Basics.
 *
 * The chapter's own parts, registered into the engine. Nothing here is known
 * to `lc-contraption.js`: each part says how to build itself out of Matter
 * bodies, how to draw itself, and — where it does something the physics engine
 * cannot express on its own, like blowing air or paying out rope — what to do
 * on each step.
 *
 * Wood, iron and brass, drawn as shapes. No pixel art anywhere in the cabinet.
 */
(function () {
  'use strict';
  var LC = window.LCContraption;
  if (!LC || !window.Matter) return;
  var M = window.Matter, PEN = LC.pen, P = LC.palette;
  var rad = function (deg) { return deg * Math.PI / 180; };

  LC.defineParts({

    /* ---- ramp ---------------------------------------------------------- */
    /* A plank, bolted where you put it. The ball rolls down it — it is not a
       path the ball follows, which is the whole point of the drawer. */
    ramp: {
      label: 'Ramp',
      hint: 'A fixed plank. Steep carries further; shallow keeps hold of the ball.',
      w: 280, h: 22, rotatable: true,
      build: function (p) {
        return { bodies: [M.Bodies.rectangle(p.x, p.y, 280, 22, {
          isStatic: true, angle: rad(p.angle),
          friction: .5, frictionStatic: .7, restitution: .04,
          label: p.id || 'ramp'
        })] };
      },
      draw: function (c, p) {
        var b = p.bodies[0];
        c.save(); c.translate(b.position.x, b.position.y); c.rotate(b.angle);
        PEN.plank(c, 280, 22);
        [-116, 116].forEach(function (x) {
          c.save(); c.translate(x, 0); PEN.brassDisc(c, 6); c.restore();
        });
        c.restore();
      },
      icon: function (c, w, h) {
        c.save(); c.translate(w / 2, h / 2); c.rotate(-.28); c.scale(w / 330, w / 330);
        PEN.plank(c, 280, 22); c.restore();
      }
    },

    /* ---- domino -------------------------------------------------------- */
    /* Stands where it is put and falls on whatever is next to it. High static
       friction, so it topples rather than sliding away from the thing that hit
       it — the failure that makes a domino run look broken. */
    domino: {
      label: 'Domino',
      hint: 'Stands up. Falls on what is next to it, if it is close enough.',
      w: 30, h: 130, rotatable: true,
      build: function (p) {
        return { bodies: [M.Bodies.rectangle(p.x, p.y, 30, 130, {
          angle: rad(p.angle),
          density: .0030, friction: .62, frictionStatic: .95, restitution: .02,
          label: p.id || 'domino'
        })] };
      },
      draw: function (c, p) { tile(c, p.bodies[0], 30, 130); },
      icon: function (c, w, h) {
        c.save(); c.translate(w / 2, h / 2); c.scale(h / 150, h / 150);
        tileShape(c, 30, 130); c.restore();
      }
    },

    /* ---- seesaw -------------------------------------------------------- */
    /* A plank pinned through its middle to a fixed point, with a block under
       it that the plank lands on. The pin is a zero-length constraint, which
       in Matter is how a hinge is spelled; the block is what stops it turning
       all the way round, the same way a real one does. */
    seesaw: {
      label: 'Seesaw',
      hint: 'Pinned in the middle. Weight on one end lifts the other.',
      w: 320, h: 64, rotatable: false,
      build: function (p) {
        var plank = M.Bodies.rectangle(p.x, p.y - 10, 320, 20, {
          density: .0009, friction: .58, frictionStatic: .85, restitution: .02,
          label: p.id || 'seesaw'
        });
        var base = M.Bodies.trapezoid(p.x, p.y + 46, 96, 74, .74, {
          isStatic: true, friction: .6, label: (p.id || 'seesaw') + '-base'
        });
        var pin = M.Constraint.create({
          pointA: { x: p.x, y: p.y - 10 }, bodyB: plank, pointB: { x: 0, y: 0 },
          length: 0, stiffness: 1, damping: .06
        });
        return { bodies: [plank, base], constraints: [pin] };
      },
      draw: function (c, p) {
        var plank = p.bodies[0], base = p.bodies[1];
        c.save(); c.translate(base.position.x, base.position.y);
        c.beginPath();
        base.vertices.forEach(function (v, i) {
          var x = v.x - base.position.x, y = v.y - base.position.y;
          i ? c.lineTo(x, y) : c.moveTo(x, y);
        });
        c.closePath();
        var g = c.createLinearGradient(0, -37, 0, 37);
        g.addColorStop(0, P.iron3); g.addColorStop(1, P.iron2);
        c.fillStyle = g; c.fill();
        c.strokeStyle = P.iron2; c.lineWidth = 2; c.stroke();
        c.restore();

        c.save(); c.translate(plank.position.x, plank.position.y); c.rotate(plank.angle);
        PEN.plank(c, 320, 20);
        c.restore();

        c.save(); c.translate(plank.position.x, plank.position.y);
        PEN.brassDisc(c, 11); c.restore();
      },
      icon: function (c, w, h) {
        c.save(); c.translate(w / 2, h / 2 + 4); c.scale(w / 360, w / 360);
        c.beginPath(); c.moveTo(-40, 34); c.lineTo(40, 34); c.lineTo(18, -10); c.lineTo(-18, -10);
        c.closePath(); c.fillStyle = P.iron; c.fill();
        c.save(); c.translate(0, -14); c.rotate(-.16); PEN.plank(c, 300, 20); c.restore();
        c.save(); c.translate(0, -14); PEN.brassDisc(c, 10); c.restore();
        c.restore();
      }
    },

    /* ---- fan ----------------------------------------------------------- */
    /* Blows along the way it is pointing. Matter has no air, so the push is
       applied by hand each step: anything dynamic inside the cone in front of
       the fan gets a force scaled to its own mass, falling off with distance.
       Scaling by mass is what makes the fan push a ball and a domino by the
       same amount of *acceleration*, which is what "wind" means here. */
    fan: {
      label: 'Fan',
      hint: 'Blows the way it points. Strong close up, weak at the far end.',
      w: 104, h: 124, rotatable: true,
      build: function (p) {
        var a = rad(p.angle);
        var dir = { x: Math.sin(a), y: -Math.cos(a) };      /* local "up" */
        var mouth = { x: p.x + dir.x * 58, y: p.y + dir.y * 58 };
        var REACH = 420, SPREAD = 150, PUSH = .0017;
        var body = M.Bodies.rectangle(p.x, p.y, 104, 124, {
          isStatic: true, angle: a, friction: .4, label: p.id || 'fan'
        });
        return {
          bodies: [body],
          tick: function (pl, api) {
            M.Composite.allBodies(api.board.world).forEach(function (b) {
              if (b.isStatic) return;
              var dx = b.position.x - mouth.x, dy = b.position.y - mouth.y;
              var along  = dx * dir.x + dy * dir.y;
              var across = Math.abs(dx * -dir.y + dy * dir.x);
              if (along <= 0 || along > REACH) return;
              if (across > SPREAD / 2 + along * .16) return;
              var f = PUSH * (1 - along / REACH) * b.mass;
              M.Body.applyForce(b, b.position, { x: dir.x * f, y: dir.y * f });
            });
            pl.spin = (pl.spin || 0) + .38;
          }
        };
      },
      draw: function (c, p, api) {
        var b = p.bodies[0];
        var running = api && api.board && api.board.status === 'running';
        c.save(); c.translate(b.position.x, b.position.y); c.rotate(b.angle);

        /* the draught, drawn only while it is actually blowing */
        if (running) {
          c.save();
          for (var i = 0; i < 4; i++) {
            var d = 74 + i * 96 + ((p.spin || 0) * 6) % 96;
            c.globalAlpha = .26 * (1 - i / 4.4);
            c.beginPath();
            c.arc(0, -d, 34 + i * 12, Math.PI * 1.12, Math.PI * 1.88);
            c.strokeStyle = P.blue; c.lineWidth = 6; c.lineCap = 'round'; c.stroke();
          }
          c.restore();
        }

        PEN.metal(c, 104, 124, 10);
        /* the cage mouth */
        c.beginPath(); c.arc(0, -18, 38, 0, Math.PI * 2);
        c.fillStyle = 'rgba(30,28,25,.55)'; c.fill();
        c.strokeStyle = P.iron2; c.lineWidth = 3; c.stroke();
        c.save(); c.translate(0, -18); c.rotate((p.spin || 0));
        for (var k = 0; k < 3; k++) {
          c.rotate(Math.PI * 2 / 3);
          c.beginPath(); c.moveTo(0, 0);
          c.quadraticCurveTo(22, -8, 30, 10);
          c.quadraticCurveTo(14, 10, 0, 0);
          c.fillStyle = running ? '#B6BCC2' : '#8E949A'; c.fill();
        }
        c.restore();
        c.save(); c.translate(0, -18); PEN.brassDisc(c, 7); c.restore();
        /* the foot */
        c.fillStyle = P.iron2;
        PEN.roundRect(c, -40, 44, 80, 16, 5); c.fill();
        c.restore();
      },
      icon: function (c, w, h) {
        c.save(); c.translate(w / 2, h / 2); c.scale(h / 150, h / 150);
        PEN.metal(c, 104, 124, 10);
        c.beginPath(); c.arc(0, -18, 38, 0, Math.PI * 2);
        c.fillStyle = 'rgba(30,28,25,.55)'; c.fill();
        c.strokeStyle = P.iron2; c.lineWidth = 3; c.stroke();
        c.save(); c.translate(0, -18); PEN.brassDisc(c, 7); c.restore();
        c.restore();
      }
    },

    /* ---- pulley -------------------------------------------------------- */
    /* A wheel with a rope over it: a bucket on one side, a tray on the other.
       Put weight in the bucket and the tray goes up.

       Matter has no rope that runs over a wheel, and the obvious way to fake
       one — two constraints whose lengths are set from where the ends already
       are — quietly does nothing: the lengths agree with every position, so
       they never pull. This is written instead as what a pulley actually is,
       a single degree of freedom. Each step both ends are held on their
       vertical rails, their speeds are made equal and opposite, and the two
       rope lengths are corrected back to adding up. What is left for Matter to
       do is the part it is good at: what lands in the bucket, and what the
       tray carries.

       The ends therefore cannot be shoved sideways. On a rope over a wheel
       that is roughly true, and it is what stops the bucket swinging off into
       the scenery. */
    pulley: {
      label: 'Pulley',
      hint: 'Rope over a wheel. Weight in the bucket lifts the tray.',
      w: 200, h: 80, rotatable: false,
      build: function (p) {
        var SPAN = 70, DROP = 190, SUM = DROP * 2, MIN = 70, MAX = SUM - MIN;
        var aL = { x: p.x - SPAN, y: p.y }, aR = { x: p.x + SPAN, y: p.y };

        /* A bucket is three planks, so a ball dropped in it stays in it. */
        var bucket = M.Body.create({
          parts: [
            M.Bodies.rectangle(aL.x, aL.y + DROP + 30, 104, 14),
            M.Bodies.rectangle(aL.x - 45, aL.y + DROP - 6, 14, 64),
            M.Bodies.rectangle(aL.x + 45, aL.y + DROP - 6, 14, 64)
          ],
          friction: .7, restitution: .02,
          label: (p.id || 'pulley') + '-bucket'
        });
        M.Body.setDensity(bucket, .0016);
        M.Body.setInertia(bucket, Infinity);

        var tray = M.Bodies.rectangle(aR.x, aR.y + DROP, 132, 16, {
          density: .0016, friction: .7, restitution: .02,
          label: (p.id || 'pulley') + '-tray'
        });
        M.Body.setInertia(tray, Infinity);
        /* The two ends are made to weigh the same, so an empty pulley hangs
           where it was put instead of sitting on its own end stop. A pulley
           already at the bottom of its travel is not a part, it is scenery. */
        M.Body.setMass(tray, bucket.mass);

        function rail(b, a) {
          M.Body.setAngle(b, 0);
          M.Body.setAngularVelocity(b, 0);
          if (b.position.x !== a.x) M.Body.setPosition(b, { x: a.x, y: b.position.y });
        }

        return {
          bodies: [bucket, tray],
          rope: { aL: aL, aR: aR, DROP: DROP },
          tick: function (pl) {
            rail(bucket, aL); rail(tray, aR);

            /* Equal and opposite: one end goes down exactly as fast as the
               other comes up. */
            var v = (bucket.velocity.y - tray.velocity.y) / 2;
            M.Body.setVelocity(bucket, { x: 0, y:  v });
            M.Body.setVelocity(tray,   { x: 0, y: -v });

            var dL = bucket.position.y - aL.y, dR = tray.position.y - aR.y;
            var err = (dL + dR) - SUM;
            M.Body.setPosition(bucket, { x: aL.x, y: bucket.position.y - err / 2 });
            M.Body.setPosition(tray,   { x: aR.x, y: tray.position.y - err / 2 });

            /* The ends of the rope. Reaching one stops the machine dead
               rather than letting the bucket carry on through the floor. */
            dL = bucket.position.y - aL.y;
            if (dL < MIN || dL > MAX) {
              var clamped = Math.max(MIN, Math.min(MAX, dL));
              M.Body.setPosition(bucket, { x: aL.x, y: aL.y + clamped });
              M.Body.setPosition(tray,   { x: aR.x, y: aR.y + (SUM - clamped) });
              M.Body.setVelocity(bucket, { x: 0, y: 0 });
              M.Body.setVelocity(tray,   { x: 0, y: 0 });
            }
            pl.ropeL = bucket.position.y - aL.y;
          }
        };
      },
      draw: function (c, p) {
        var bucket = p.bodies[0], tray = p.bodies[1];
        var aL = p.rope.aL, aR = p.rope.aR;
        var x = (aL.x + aR.x) / 2, y = aL.y - 34;

        c.save();
        c.strokeStyle = P.iron; c.lineWidth = 10; c.lineCap = 'round';
        c.beginPath(); c.moveTo(aL.x, y); c.lineTo(aR.x, y); c.stroke();
        c.restore();

        c.save();
        c.strokeStyle = '#8A7A5E'; c.lineWidth = 4;
        c.beginPath(); c.moveTo(aL.x, y); c.lineTo(bucket.position.x, bucket.position.y - 30); c.stroke();
        c.beginPath(); c.moveTo(aR.x, y); c.lineTo(tray.position.x, tray.position.y); c.stroke();
        c.restore();

        /* The wheel turns by however much rope has gone over it, which is the
           one thing on the part that shows the mechanism working. */
        c.save(); c.translate(x, y);
        c.rotate(((p.ropeL || p.rope.DROP) - p.rope.DROP) / 30);
        PEN.brassDisc(c, 30);
        c.strokeStyle = 'rgba(70,45,10,.45)'; c.lineWidth = 3;
        for (var i = 0; i < 4; i++) {
          c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -22); c.stroke(); c.rotate(Math.PI / 2);
        }
        c.restore();
        [aL, aR].forEach(function (a) {
          c.save(); c.translate(a.x, y); PEN.brassDisc(c, 8); c.restore();
        });

        c.save(); c.translate(bucket.position.x, bucket.position.y); c.rotate(bucket.angle);
        c.save(); c.translate(0, 30); PEN.plank(c, 104, 14); c.restore();
        c.save(); c.translate(-45, -6); PEN.plank(c, 14, 64); c.restore();
        c.save(); c.translate(45, -6); PEN.plank(c, 14, 64); c.restore();
        c.restore();

        c.save(); c.translate(tray.position.x, tray.position.y); c.rotate(tray.angle);
        PEN.metal(c, 132, 16, 4);
        c.restore();
      },
      icon: function (c, w, h) {
        c.save(); c.translate(w / 2, h / 2); c.scale(h / 120, h / 120);
        c.strokeStyle = '#8A7A5E'; c.lineWidth = 5;
        c.beginPath(); c.moveTo(-26, -8); c.lineTo(-26, 40); c.stroke();
        c.beginPath(); c.moveTo(26, -8); c.lineTo(26, 30); c.stroke();
        c.save(); c.translate(0, -18); PEN.brassDisc(c, 26); c.restore();
        c.save(); c.translate(-26, 46); PEN.plank(c, 44, 10); c.restore();
        c.restore();
      }
    }

  });

  /* A domino face: bone tile, a line across the middle, brass pips. Drawn from
     the body so it turns with it. */
  function tile(c, b, w, h) {
    c.save(); c.translate(b.position.x, b.position.y); c.rotate(b.angle);
    tileShape(c, w, h);
    c.restore();
  }
  function tileShape(c, w, h) {
    var g = c.createLinearGradient(-w / 2, 0, w / 2, 0);
    g.addColorStop(0, '#FBF3E2'); g.addColorStop(.55, '#EFE2C8'); g.addColorStop(1, '#D8C7A6');
    PEN.roundRect(c, -w / 2, -h / 2, w, h, 5);
    c.fillStyle = g; c.fill();
    c.strokeStyle = '#B39F7C'; c.lineWidth = 2; c.stroke();
    c.beginPath(); c.moveTo(-w / 2 + 4, 0); c.lineTo(w / 2 - 4, 0);
    c.strokeStyle = 'rgba(120,100,70,.5)'; c.lineWidth = 2; c.stroke();
    [[0, -h / 4], [-6, h / 4 - 8], [6, h / 4 + 8]].forEach(function (pt) {
      c.save(); c.translate(pt[0], pt[1]); PEN.brassDisc(c, 4); c.restore();
    });
  }
})();
