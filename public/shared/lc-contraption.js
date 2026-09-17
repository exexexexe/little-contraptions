/* lc-contraption.js — the contraption engine.
 *
 * A board where parts are placed, a simulation is run, and a win condition is
 * asked whether the machine did its job.
 *
 * The engine deliberately knows nothing about ramps, dominoes or "get the ball
 * to the crate". Part types and win-condition types are *registered into* it
 * from outside, so a later chapter — gears, a trebuchet, a music box — brings
 * its own set and reuses everything here. What the engine owns is the board,
 * the grid, placement and dragging, the fixed-step simulation, reset, the level
 * schema and its lint pass, and the asking of the win condition.
 *
 * Needs Matter.js on the page. Without it the board says so rather than
 * throwing, the same way the other physics drawers do.
 */
(function (global) {
  'use strict';

  var M = global.Matter;
  var HAVE_MATTER = typeof M !== 'undefined';

  /* One board is 1600x1000 internal units, drawn to whatever size the page
     gives the canvas. Levels are authored in these units, never in pixels of
     somebody's screen. 40 columns by 25 rows. */
  var W = 1600, H = 1000, GRID = 40;

  /* The simulation is stepped at a fixed 60Hz whether it is on screen or in a
     headless verification run, so a level that solves in one solves in the
     other. A variable delta off requestAnimationFrame would make "verified
     solvable" mean nothing. */
  var DT = 1000 / 60;

  var PALETTE = {
    paper:  '#F0E4CE',
    grid:   'rgba(58,46,32,.07)',
    gridOn: 'rgba(58,46,32,.14)',
    ink:    '#3A2E20',
    dim:    '#8A7A62',
    brass:  '#B98A3C',
    brass2: '#D8A94A',
    brass3: '#8C6526',
    wood:   '#C08A4E',
    wood2:  '#8A5A2B',
    wood3:  '#E0B07A',
    iron:   '#6E6A62',
    iron2:  '#4A4740',
    iron3:  '#9A958A',
    red:    '#E2483C',
    green:  '#2FA86B',
    blue:   '#2E7BD6'
  };

  /* ---- small drawing helpers parts share ------------------------------- */

  function roundRect(c, x, y, w, h, r) {
    r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  /* A plank drawn about its own centre: body, end grain, a highlight along the
     top edge and two lines of grain. Parts call this inside a transform that
     has already moved and rotated to the body. */
  function plank(c, w, h, tone) {
    var light = (tone && tone.light) || PALETTE.wood3;
    var mid   = (tone && tone.mid)   || PALETTE.wood;
    var dark  = (tone && tone.dark)  || PALETTE.wood2;
    var g = c.createLinearGradient(0, -h / 2, 0, h / 2);
    g.addColorStop(0, light); g.addColorStop(.45, mid); g.addColorStop(1, dark);
    roundRect(c, -w / 2, -h / 2, w, h, Math.min(5, h / 2.4));
    c.fillStyle = g; c.fill();
    c.strokeStyle = dark; c.lineWidth = 2; c.stroke();
    c.save(); c.clip();
    c.strokeStyle = 'rgba(90,55,20,.22)'; c.lineWidth = 1.5;
    for (var i = -1; i <= 1; i += 2) {
      c.beginPath();
      c.moveTo(-w / 2 + 6, i * h * .18);
      c.bezierCurveTo(-w / 6, i * h * .30, w / 6, i * h * .08, w / 2 - 6, i * h * .22);
      c.stroke();
    }
    c.restore();
  }

  function metal(c, w, h, r) {
    var g = c.createLinearGradient(0, -h / 2, 0, h / 2);
    g.addColorStop(0, PALETTE.iron3); g.addColorStop(.5, PALETTE.iron); g.addColorStop(1, PALETTE.iron2);
    roundRect(c, -w / 2, -h / 2, w, h, r == null ? Math.min(4, h / 2) : r);
    c.fillStyle = g; c.fill();
    c.strokeStyle = PALETTE.iron2; c.lineWidth = 2; c.stroke();
  }

  function brassDisc(c, r) {
    var g = c.createRadialGradient(-r * .3, -r * .3, r * .1, 0, 0, r);
    g.addColorStop(0, PALETTE.brass2); g.addColorStop(1, PALETTE.brass3);
    c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2);
    c.fillStyle = g; c.fill();
    c.strokeStyle = PALETTE.brass3; c.lineWidth = 2; c.stroke();
  }

  var PEN = { roundRect: roundRect, plank: plank, metal: metal, brassDisc: brassDisc };

  /* ---- registries ------------------------------------------------------ */

  var PARTS = {};       /* name -> part definition */
  var WINS  = {};       /* type -> win-condition definition */

  function definePart(name, def) {
    PARTS[name] = Object.assign({
      name: name,
      label: name,
      hint: '',
      w: GRID * 4, h: GRID / 2,
      rotatable: false,
      movable: true,
      build: null,        /* (p, api) -> {bodies, constraints, tick} */
      zone: null,         /* (p) -> {x,y,w,h}, for win conditions that need one */
      draw: function () {},
      icon: null
    }, def);
  }
  function defineParts(map) { Object.keys(map).forEach(function (k) { definePart(k, map[k]); }); }

  function defineWin(type, def) {
    WINS[type] = Object.assign({
      type: type,
      describe: function () { return ''; },
      init: function () { return {}; },
      /* (spec, st, api) -> true when the job is done */
      test: function () { return false; },
      draw: null
    }, def);
  }
  function defineWins(map) { Object.keys(map).forEach(function (k) { defineWin(k, map[k]); }); }

  /* ---- core props ------------------------------------------------------
     Scenery every chapter needs whatever its parts are: something solid, a
     thing to move, and a place for it to end up. Chapter part sets are
     registered on top of these. */

  defineParts({

    wall: {
      label: 'Wall', movable: false, rotatable: true,
      build: function (p) {
        return { bodies: [M.Bodies.rectangle(p.x, p.y, p.w, p.h, {
          isStatic: true, angle: p.angle * Math.PI / 180,
          friction: p.friction == null ? .5 : p.friction,
          restitution: p.restitution == null ? .05 : p.restitution,
          label: p.id || 'wall'
        })] };
      },
      draw: function (c, p) {
        var b = p.bodies[0];
        c.save(); c.translate(b.position.x, b.position.y); c.rotate(b.angle);
        var g = c.createLinearGradient(0, -p.h / 2, 0, p.h / 2);
        g.addColorStop(0, '#C9B594'); g.addColorStop(1, '#A08C6C');
        roundRect(c, -p.w / 2, -p.h / 2, p.w, p.h, 4);
        c.fillStyle = g; c.fill();
        c.strokeStyle = '#8A7558'; c.lineWidth = 2; c.stroke();
        c.restore();
      }
    },

    ball: {
      label: 'Ball', movable: false,
      build: function (p) {
        var r = p.r || 26;
        return { bodies: [M.Bodies.circle(p.x, p.y, r, {
          restitution: p.restitution == null ? .14 : p.restitution,
          friction: .04, frictionAir: .001, density: .0022,
          label: p.id || 'ball'
        })] };
      },
      draw: function (c, p) {
        var b = p.bodies[0], r = p.r || 26;
        c.save(); c.translate(b.position.x, b.position.y); c.rotate(b.angle);
        var g = c.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r);
        g.addColorStop(0, '#9FA6AD'); g.addColorStop(.55, '#6E757C'); g.addColorStop(1, '#3E444A');
        c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.fillStyle = g; c.fill();
        c.strokeStyle = '#33383D'; c.lineWidth = 2; c.stroke();
        /* One mark on the ball, so its spin is visible rather than implied. */
        c.beginPath(); c.moveTo(0, -r + 5); c.lineTo(0, -r * .35);
        c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 3; c.lineCap = 'round'; c.stroke();
        c.restore();
      }
    },

    goal: {
      /* No bodies at all — a goal is a place, not a thing. Win conditions ask
         it for its rectangle; the ball passes straight through it. */
      label: 'Crate', movable: false,
      build: function () { return { bodies: [] }; },
      zone: function (p) { return { x: p.x, y: p.y, w: p.w, h: p.h }; },
      draw: function (c, p, api) {
        var x = p.x - p.w / 2, y = p.y - p.h / 2;
        c.save();
        var hit = api && api.winState && api.winState.hitting;
        c.fillStyle = hit ? 'rgba(47,168,107,.20)' : 'rgba(185,138,60,.13)';
        roundRect(c, x, y, p.w, p.h, 8); c.fill();
        c.setLineDash([12, 9]); c.lineWidth = 4;
        c.strokeStyle = hit ? PALETTE.green : PALETTE.brass;
        c.stroke(); c.setLineDash([]);
        if (p.title) {
          c.fillStyle = hit ? PALETTE.green : PALETTE.brass3;
          c.font = '600 20px "Avenir Next",system-ui,sans-serif';
          c.textAlign = 'center'; c.textBaseline = 'bottom';
          c.fillText(p.title, p.x, y - 10);
        }
        c.restore();
      }
    }

  });

  /* ---- core win conditions --------------------------------------------- */

  function bodyByLabel(api, label) {
    var found = null;
    api.placements.forEach(function (p) {
      (p.bodies || []).forEach(function (b) { if (!found && b.label === label) found = b; });
    });
    return found;
  }
  function zoneById(api, id) {
    var found = null;
    api.placements.forEach(function (p) {
      if (found || p.id !== id) return;
      var def = PARTS[p.part];
      if (def && def.zone) found = def.zone(p);
    });
    return found;
  }

  defineWins({

    /* The one Chapter 1 needs: a named body inside a named zone, and staying
       there. `hold` is in milliseconds of simulated time — without it a ball
       that flies through the crate at speed would count, which is not what
       "get it into the crate" means. */
    reachZone: {
      describe: function (s) { return 'Get ' + (s.bodyName || 'the ball') + ' into ' + (s.zoneName || 'the crate') + '.'; },
      init: function () { return { held: 0, hitting: false }; },
      test: function (spec, st, api) {
        var b = bodyByLabel(api, spec.body), z = zoneById(api, spec.zone);
        if (!b || !z) return false;
        var inside = Math.abs(b.position.x - z.x) <= z.w / 2 &&
                     Math.abs(b.position.y - z.y) <= z.h / 2;
        st.hitting = inside;
        st.held = inside ? st.held + DT : 0;
        return st.held >= (spec.hold == null ? 400 : spec.hold);
      }
    },

    /* Composites. Chapter 1 does not use them; they are here because the
       schema promises win conditions are a type among types rather than the
       one rule the engine happens to implement, and a registry nothing ever
       joins is not a registry. */
    all: {
      describe: function (s, api) { return s.of.map(function (w) { return api.describeWin(w); }).join(' '); },
      init: function (spec) { return { subs: spec.of.map(function (w) { return WINS[w.type].init(w); }), done: [] }; },
      test: function (spec, st, api) {
        return spec.of.every(function (w, i) {
          if (st.done[i]) return true;
          var ok = WINS[w.type].test(w, st.subs[i], api);
          if (ok) st.done[i] = true;
          return ok;
        });
      }
    },
    any: {
      describe: function (s, api) { return s.of.map(function (w) { return api.describeWin(w); }).join(' Or: '); },
      init: function (spec) { return { subs: spec.of.map(function (w) { return WINS[w.type].init(w); }) }; },
      test: function (spec, st, api) {
        return spec.of.some(function (w, i) { return WINS[w.type].test(w, st.subs[i], api); });
      }
    }

  });

  /* ---- the level schema, and its lint pass -----------------------------
     Every level is JSON in this shape:

       {
         "id": "first-drop",              required, unique within the chapter
         "title": "The First Drop",       required, shown on the plate
         "goal": "Roll it into the crate.",   required, the sentence on the card
         "source": "hand-designed",       required: hand-designed | generated
         "verified": true,                required: has a headless run proved it
         "par": 1,                        optional, parts a known solution uses
         "scenery": [ {part,x,y,...} ],   fixed, never movable by the player
         "placed":  [ {part,x,y,angle} ], on the board at the start, movable
         "tray":    [ {part,count} ],     what the player may add, and how many
         "win":     { "type": "...", ... },  looked up in the win registry
         "limits":  { "maxSteps": 1800 }, how long a run gets before it fails
         "solution": [ {part,x,y,angle} ]  a layout known to solve it
       }

     `solution` is what makes "verified": true mean something. The harness
     places exactly that layout, runs the simulation to completion, and refuses
     the level unless the win condition actually fires — and unless the same
     level *fails* with the bench left as handed over, which catches a win zone
     that was already satisfied before the player did anything.

     Its entries come in two kinds: `{part, x, y, angle}` takes a part out of
     the tray and puts it down, and `{move, x, y, angle}` picks up something
     already on the board — a `placed` part, by its id — and moves it. A level
     whose whole puzzle is where to put a part it already gave you needs the
     second kind to be able to state its own solution at all.

     Anything in `scenery` or `placed` is a part name looked up in the part
     registry, so a chapter's own parts need no engine change. */

  function lint(level) {
    var bad = [];
    if (!level || typeof level !== 'object') return ['level is not an object'];
    ['id', 'title', 'goal'].forEach(function (k) {
      if (!level[k]) bad.push('missing "' + k + '"');
    });
    if (level.source !== 'hand-designed' && level.source !== 'generated') {
      bad.push('"source" must be hand-designed or generated');
    }
    if (typeof level.verified !== 'boolean') bad.push('"verified" must be true or false');

    var ids = {};
    ['scenery', 'placed'].forEach(function (key) {
      (level[key] || []).forEach(function (p, i) {
        var where = key + '[' + i + ']';
        if (!PARTS[p.part]) { bad.push(where + ': no such part "' + p.part + '"'); return; }
        if (typeof p.x !== 'number' || typeof p.y !== 'number') bad.push(where + ': needs numeric x and y');
        if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) bad.push(where + ': sits off the board');
        if (p.id) { if (ids[p.id]) bad.push(where + ': duplicate id "' + p.id + '"'); ids[p.id] = true; }
      });
    });

    (level.solution || []).forEach(function (p, i) {
      var where = 'solution[' + i + ']';
      if (typeof p.x !== 'number' || typeof p.y !== 'number') bad.push(where + ': needs numeric x and y');
      if (p.move) {
        var target = (level.placed || []).filter(function (q) { return q.id === p.move; })[0];
        if (!target) bad.push(where + ': nothing placed on the board has id "' + p.move + '"');
      } else if (!PARTS[p.part]) {
        bad.push(where + ': no such part "' + p.part + '"');
      }
    });

    (level.tray || []).forEach(function (t, i) {
      if (!PARTS[t.part]) bad.push('tray[' + i + ']: no such part "' + t.part + '"');
      if (!(t.count > 0)) bad.push('tray[' + i + ']: count must be above zero');
    });

    /* A win condition that names something the board does not contain is the
       failure this pass exists to catch — it looks fine in the file and is
       simply never satisfiable. */
    (function walk(w, where) {
      if (!w || !w.type) { bad.push(where + ': missing win condition'); return; }
      if (!WINS[w.type]) { bad.push(where + ': no such win type "' + w.type + '"'); return; }
      if (w.of) { w.of.forEach(function (s, i) { walk(s, where + '.of[' + i + ']'); }); return; }
      if (w.body) {
        var hasBody = (level.scenery || []).concat(level.placed || [])
          .some(function (p) { return p.id === w.body; });
        if (!hasBody) bad.push(where + ': nothing on the board is labelled "' + w.body + '"');
      }
      if (w.zone) {
        var z = (level.scenery || []).concat(level.placed || [])
          .filter(function (p) { return p.id === w.zone; })[0];
        if (!z) bad.push(where + ': no zone with id "' + w.zone + '"');
        else if (!PARTS[z.part] || !PARTS[z.part].zone) bad.push(where + ': "' + w.zone + '" is not a zone');
      }
    })(level.win, 'win');

    return bad;
  }

  /* ---- the board ------------------------------------------------------- */

  function create(opts) {
    opts = opts || {};
    var cv = opts.canvas;
    var ctx = cv ? cv.getContext('2d') : null;
    var onChange = opts.onChange || function () {};

    var engine = null, world = null;
    if (HAVE_MATTER) {
      engine = M.Engine.create();
      engine.gravity.y = 1;
      /* Matter's defaults are 6 position and 4 velocity iterations. Stacked
         dominoes and a loaded seesaw both settle badly there, and a board this
         small can afford the extra passes. */
      engine.positionIterations = 8;
      engine.velocityIterations = 6;
      world = engine.world;
    }

    var board = {
      W: W, H: H, GRID: GRID, DT: DT,
      palette: PALETTE, pen: PEN,
      canvas: cv, ctx: ctx,
      haveMatter: HAVE_MATTER,
      engine: engine, world: world,
      level: null,
      placements: [],     /* every part on the board, scenery and player's alike */
      tray: [],           /* [{part, count, used}] */
      status: 'idle',     /* idle | running | solved | failed */
      steps: 0,
      winState: null,
      selected: null,
      message: ''
    };

    /* --- world building ------------------------------------------------- */

    function api() {
      return {
        placements: board.placements,
        board: board,
        winState: board.winState,
        describeWin: function (w) { return WINS[w.type] ? WINS[w.type].describe(w, api()) : ''; }
      };
    }

    function buildOne(p) {
      var def = PARTS[p.part];
      var built = def.build ? def.build(p, api()) : { bodies: [] };
      p.bodies = built.bodies || [];
      p.constraints = built.constraints || [];
      p.tick = built.tick || null;
      /* Anything else a part hands back is kept on the placement, so a part
         that needs its own state to draw with — where a pulley's anchors are,
         how much rope has gone over the wheel — has somewhere to put it
         without the engine knowing what it is. */
      Object.keys(built).forEach(function (k) {
        if (k !== 'bodies' && k !== 'constraints' && k !== 'tick') p[k] = built[k];
      });
      p.bodies.forEach(function (b) { b.plugin = b.plugin || {}; b.plugin.lcPlacement = p; });
      if (p.bodies.length) M.Composite.add(world, p.bodies);
      if (p.constraints.length) M.Composite.add(world, p.constraints);
    }

    /* Rebuilding from the placements is how reset works too: the placements are
       the truth, the bodies are only this run's copy of them. */
    function rebuild() {
      if (!HAVE_MATTER) return;
      M.Composite.clear(world, false, true);
      /* The board's own floor and walls, so nothing can simply leave. */
      var t = 60;
      M.Composite.add(world, [
        M.Bodies.rectangle(W / 2, H + t / 2 - 4, W, t, { isStatic: true, label: '_floor', friction: .6 }),
        M.Bodies.rectangle(-t / 2 + 4, H / 2, t, H * 3, { isStatic: true, label: '_wallL' }),
        M.Bodies.rectangle(W + t / 2 - 4, H / 2, t, H * 3, { isStatic: true, label: '_wallR' })
      ]);
      board.placements.forEach(buildOne);
      board.steps = 0;
      board.winState = board.level && WINS[board.level.win.type]
        ? WINS[board.level.win.type].init(board.level.win, api()) : null;
    }

    /* --- levels ---------------------------------------------------------- */

    function load(level) {
      var problems = lint(level);
      if (problems.length) {
        board.message = 'This level does not lint: ' + problems.join('; ');
        board.status = 'idle';
        onChange(board);
        return problems;
      }
      board.level = level;
      board.selected = null;
      board.placements = []
        .concat((level.scenery || []).map(function (s) { return mk(s, true); }))
        .concat((level.placed  || []).map(function (s) { return mk(s, false); }));
      board.tray = (level.tray || []).map(function (t) {
        return { part: t.part, count: t.count, used: 0 };
      });
      board.status = 'idle';
      board.message = '';
      rebuild();
      onChange(board);
      return [];
    }

    function mk(spec, locked) {
      var def = PARTS[spec.part];
      return Object.assign({
        w: def.w, h: def.h, angle: 0
      }, spec, { locked: !!locked, fromTray: false });
    }

    /* --- placing, moving, removing --------------------------------------- */

    function snap(v) { return Math.round(v / GRID) * GRID; }

    /* Nothing may be put down inside something else. Two solids that start
       overlapping are shoved apart hard on the first step, which looks like a
       machine working and is really the solver getting out of a hole — and a
       level "solved" that way is not solved. The board's own floor and walls
       are excluded: a seesaw's foot is *meant* to sit in the floor. */
    function simpleParts(b) { return b.parts.length > 1 ? b.parts.slice(1) : [b]; }

    function overlaps(bodies, ignore) {
      if (!HAVE_MATTER) return false;
      var others = [];
      board.placements.forEach(function (p) {
        if (p === ignore) return;
        (p.bodies || []).forEach(function (b) {
          simpleParts(b).forEach(function (q) { others.push(q); });
        });
      });
      return bodies.some(function (b) {
        return simpleParts(b).some(function (a) {
          return others.some(function (o) {
            var c = M.Collision.collides(a, o);
            /* A tolerance, because a ball resting exactly on a shelf is
               touching, not overlapping, and floating point says so. */
            return c && c.collided && c.depth > 3;
          });
        });
      });
    }

    /* Build a part where it is being asked for, without adding it to the
       world, purely to ask whether it would fit. */
    function trial(part, x, y, angle) {
      var def = PARTS[part];
      var spec = Object.assign({ w: def.w, h: def.h }, { part: part, x: x, y: y, angle: angle || 0 });
      var built = def.build ? def.build(spec, api()) : { bodies: [] };
      return built.bodies || [];
    }

    function trayRow(part) {
      for (var i = 0; i < board.tray.length; i++) if (board.tray[i].part === part) return board.tray[i];
      return null;
    }
    function trayLeft(part) {
      var r = trayRow(part);
      return r ? r.count - r.used : 0;
    }

    function add(part, x, y, angle) {
      if (board.status === 'running') return null;
      var def = PARTS[part];
      if (!def) return null;
      var row = trayRow(part);
      if (row && row.used >= row.count) return null;
      var sx = snap(x), sy = snap(y);
      if (overlaps(trial(part, sx, sy, angle || 0), null)) {
        board.message = 'That will not fit there — something is already in the way.';
        onChange(board);
        return null;
      }
      var p = mk({ part: part, x: sx, y: sy, angle: angle || 0 }, false);
      p.fromTray = !!row;
      if (row) row.used++;
      board.placements.push(p);
      board.status = 'idle';
      rebuild(); onChange(board);
      return p;
    }

    function remove(p) {
      if (board.status === 'running' || !p || p.locked) return false;
      var i = board.placements.indexOf(p);
      if (i < 0) return false;
      board.placements.splice(i, 1);
      if (p.fromTray) { var row = trayRow(p.part); if (row) row.used--; }
      if (board.selected === p) board.selected = null;
      board.status = 'idle';
      rebuild(); onChange(board);
      return true;
    }

    function moveTo(p, x, y) {
      if (board.status === 'running' || !p || p.locked) return false;
      var nx = Math.max(GRID, Math.min(W - GRID, snap(x)));
      var ny = Math.max(GRID, Math.min(H - GRID, snap(y)));
      if (nx === p.x && ny === p.y) return true;
      if (overlaps(trial(p.part, nx, ny, p.angle), p)) return false;
      p.x = nx; p.y = ny;
      board.status = 'idle';
      rebuild(); onChange(board);
      return true;
    }

    function rotate(p, by) {
      if (board.status === 'running' || !p || p.locked || !PARTS[p.part].rotatable) return false;
      var a = (((p.angle + by) % 360) + 360) % 360;
      if (a === p.angle) return true;
      if (overlaps(trial(p.part, p.x, p.y, a), p)) return false;
      p.angle = a;
      board.status = 'idle';
      rebuild(); onChange(board);
      return true;
    }

    function clear() {
      if (board.status === 'running') return;
      board.placements = board.placements.filter(function (p) { return p.locked; });
      board.tray.forEach(function (r) { r.used = 0; });
      /* The level's own pre-placed movable parts come back — clearing the bench
         means "back to how the job was handed to me", not "empty". */
      (board.level.placed || []).forEach(function (s) { board.placements.push(mk(s, false)); });
      board.selected = null;
      board.status = 'idle'; board.message = '';
      rebuild(); onChange(board);
    }

    function partAt(x, y) {
      /* Last drawn is topmost, so search backwards. Locked scenery is skipped:
         it cannot be picked up and should not swallow a click meant for a part
         lying on it. */
      for (var i = board.placements.length - 1; i >= 0; i--) {
        var p = board.placements[i];
        if (p.locked) continue;
        var def = PARTS[p.part];
        var a = -p.angle * Math.PI / 180;
        var dx = x - p.x, dy = y - p.y;
        var lx = dx * Math.cos(a) - dy * Math.sin(a);
        var ly = dx * Math.sin(a) + dy * Math.cos(a);
        var hw = Math.max(def.w, 44) / 2, hh = Math.max(def.h, 44) / 2;
        if (Math.abs(lx) <= hw && Math.abs(ly) <= hh) return p;
      }
      return null;
    }

    /* --- running ---------------------------------------------------------- */

    function run() {
      if (!HAVE_MATTER || board.status === 'running') return;
      rebuild();
      board.selected = null;
      board.status = 'running';
      board.message = '';
      board.settled = 0;
      onChange(board);
    }

    function reset() {
      if (!HAVE_MATTER) return;
      board.status = 'idle';
      board.message = '';
      rebuild(); onChange(board);
    }

    function maxSteps() {
      return (board.level && board.level.limits && board.level.limits.maxSteps) || 1800;
    }

    /* One fixed step: the world, then whatever the parts want to do to it (a
       fan pushes, a pulley pays out rope), then the win condition. The order
       matters — a part that applies force after the step would be a step late. */
    function step() {
      if (board.status !== 'running') return board.status;
      board.placements.forEach(function (p) { if (p.tick) p.tick(p, api()); });
      M.Engine.update(engine, DT);
      board.steps++;

      var w = board.level.win;
      if (WINS[w.type].test(w, board.winState, api())) {
        board.status = 'solved';
        onChange(board);
        return board.status;
      }

      /* A run also ends when nothing is moving any more. Waiting out the full
         step budget on a board that has visibly stopped is just a slower way
         of saying the same thing. */
      var moving = 0;
      M.Composite.allBodies(world).forEach(function (b) {
        if (b.isStatic) return;
        moving += b.speed + Math.abs(b.angularSpeed) * 8;
      });
      board.settled = moving < .35 ? board.settled + 1 : 0;

      if (board.steps >= maxSteps() || (board.settled > 90 && board.steps > 120)) {
        board.status = 'failed';
        onChange(board);
      }
      return board.status;
    }

    /* Used by the verification harness: run a whole simulation as fast as the
       machine will go, with no frames drawn, and report what happened. */
    function runHeadless(limit) {
      run();
      var cap = limit || maxSteps() + 10;
      while (board.status === 'running' && board.steps < cap) step();
      if (board.status === 'running') board.status = 'failed';
      return { status: board.status, steps: board.steps };
    }

    /* --- drawing ---------------------------------------------------------- */

    function drawPaper() {
      ctx.fillStyle = PALETTE.paper;
      ctx.fillRect(0, 0, W, H);
      ctx.lineWidth = 1;
      var x, y;
      for (x = GRID; x < W; x += GRID) {
        ctx.strokeStyle = (x % (GRID * 5) === 0) ? PALETTE.gridOn : PALETTE.grid;
        ctx.beginPath(); ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, H); ctx.stroke();
      }
      for (y = GRID; y < H; y += GRID) {
        ctx.strokeStyle = (y % (GRID * 5) === 0) ? PALETTE.gridOn : PALETTE.grid;
        ctx.beginPath(); ctx.moveTo(0, y + .5); ctx.lineTo(W, y + .5); ctx.stroke();
      }
    }

    function drawFrame() {
      ctx.strokeStyle = PALETTE.brass; ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, W - 6, H - 6);
      ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 2;
      ctx.strokeRect(8, 8, W - 16, H - 16);
    }

    function drawSelection(p) {
      var def = PARTS[p.part];
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.angle * Math.PI / 180);
      ctx.strokeStyle = PALETTE.blue; ctx.lineWidth = 3; ctx.setLineDash([9, 7]);
      roundRect(ctx, -def.w / 2 - 8, -def.h / 2 - 8, def.w + 16, def.h + 16, 8);
      ctx.stroke(); ctx.setLineDash([]);
      if (def.rotatable) {
        /* The rotation handle, on a stalk above the part, so it is grabbable
           without overlapping the part itself. */
        ctx.beginPath(); ctx.moveTo(0, -def.h / 2 - 8); ctx.lineTo(0, -def.h / 2 - 40);
        ctx.stroke();
        ctx.beginPath(); ctx.arc(0, -def.h / 2 - 48, 13, 0, Math.PI * 2);
        ctx.fillStyle = PALETTE.blue; ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke();
      }
      ctx.restore();
    }

    function handleAt(p) {
      var def = PARTS[p.part];
      if (!def.rotatable) return null;
      var a = p.angle * Math.PI / 180, d = def.h / 2 + 48;
      return { x: p.x + Math.sin(a) * d, y: p.y - Math.cos(a) * d, r: 20 };
    }

    function drawGhost(part, x, y, angle, ok) {
      var def = PARTS[part];
      ctx.save();
      ctx.globalAlpha = .55;
      ctx.translate(snap(x), snap(y)); ctx.rotate((angle || 0) * Math.PI / 180);
      roundRect(ctx, -def.w / 2, -def.h / 2, def.w, def.h, 5);
      ctx.fillStyle = ok ? 'rgba(46,123,214,.28)' : 'rgba(226,72,60,.28)';
      ctx.fill();
      ctx.strokeStyle = ok ? PALETTE.blue : PALETTE.red;
      ctx.lineWidth = 3; ctx.setLineDash([8, 6]); ctx.stroke();
      ctx.restore();
    }

    function draw(ghost) {
      if (!ctx) return;
      drawPaper();
      var a = api();
      /* Zones under everything, parts over them. */
      board.placements.forEach(function (p) {
        if (PARTS[p.part].zone) PARTS[p.part].draw(ctx, p, a);
      });
      board.placements.forEach(function (p) {
        if (!PARTS[p.part].zone) PARTS[p.part].draw(ctx, p, a);
      });
      if (board.selected && board.status !== 'running') drawSelection(board.selected);
      if (ghost) drawGhost(ghost.part, ghost.x, ghost.y, ghost.angle, ghost.ok);
      drawFrame();
    }

    Object.assign(board, {
      load: load, lint: lint,
      add: add, remove: remove, moveTo: moveTo, rotate: rotate, clear: clear,
      partAt: partAt, handleAt: handleAt, snap: snap,
      trayLeft: trayLeft,
      run: run, reset: reset, step: step, runHeadless: runHeadless,
      draw: draw, rebuild: rebuild,
      describeWin: function () {
        var w = board.level && board.level.win;
        return w && WINS[w.type] ? WINS[w.type].describe(w, api()) : '';
      }
    });

    draw();
    return board;
  }

  global.LCContraption = {
    version: 1,
    W: W, H: H, GRID: GRID, DT: DT,
    palette: PALETTE, pen: PEN,
    haveMatter: HAVE_MATTER,
    parts: PARTS, wins: WINS,
    definePart: definePart, defineParts: defineParts,
    defineWin: defineWin, defineWins: defineWins,
    lint: lint,
    create: create
  };
})(window);
