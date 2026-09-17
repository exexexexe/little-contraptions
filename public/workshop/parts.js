/* parts.js — Chapter 1: Workshop Basics.
 *
 * The chapter's own parts, registered into the engine. Nothing here is known
 * to `lc-contraption.js`: each part says how to build itself out of Matter
 * bodies, how to draw itself, and — if it does something the physics engine
 * cannot express on its own, like blowing air — what to do on each step.
 */
(function () {
  'use strict';
  var LC = window.LCContraption;
  if (!LC || !window.Matter) return;
  var M = window.Matter, PEN = LC.pen, P = LC.palette;

  LC.defineParts({

    /* A plank, bolted where you put it. The ball rolls down it — it is not a
       path the ball follows, which is the whole point of the drawer. */
    ramp: {
      label: 'Ramp',
      hint: 'A fixed plank. Steeper carries further, shallow keeps hold of the ball.',
      w: 280, h: 22, rotatable: true,
      build: function (p) {
        return { bodies: [M.Bodies.rectangle(p.x, p.y, 280, 22, {
          isStatic: true, angle: p.angle * Math.PI / 180,
          friction: .5, frictionStatic: .7, restitution: .04,
          label: p.id || 'ramp'
        })] };
      },
      draw: function (c, p) {
        var b = p.bodies[0];
        c.save(); c.translate(b.position.x, b.position.y); c.rotate(b.angle);
        PEN.plank(c, 280, 22);
        /* Two bolt heads, because a ramp that does not move should look like
           something that has been fixed down. */
        [-116, 116].forEach(function (x) {
          c.save(); c.translate(x, 0); PEN.brassDisc(c, 6); c.restore();
        });
        c.restore();
      },
      icon: function (c, w, h) {
        c.save(); c.translate(w / 2, h / 2); c.rotate(-.28); c.scale(w / 320, w / 320);
        PEN.plank(c, 280, 22); c.restore();
      }
    }

  });
})();
