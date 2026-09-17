/* lc-contraption.js — the contraption engine.
 *
 * A board where parts are placed, a simulation is run, and a win condition is
 * asked whether the machine did its job. The engine deliberately knows nothing
 * about ramps, dominoes, or "get the ball to the bucket": part types and
 * win-condition types are registered from outside, so a later chapter (gears,
 * a trebuchet, a music box) can bring its own set and reuse everything here.
 *
 * Needs Matter.js on the page. Without it the board says so rather than
 * throwing, the same way the other physics drawers do.
 *
 * Phase 0: the board, its frame, and the paper it is drawn on.
 */
(function (global) {
  'use strict';

  var HAVE_MATTER = typeof global.Matter !== 'undefined';

  /* One board is 1600x1000 internal units, drawn to whatever size the page
     gives the canvas. Levels are authored in these units, never in pixels of
     somebody's screen. */
  var W = 1600, H = 1000, GRID = 40;

  var PALETTE = {
    paper:  '#F0E4CE',
    grid:   'rgba(58,46,32,.07)',
    gridOn: 'rgba(58,46,32,.14)',
    ink:    '#3A2E20',
    dim:    '#8A7A62',
    brass:  '#B98A3C',
    brass2: '#D8A94A',
    wood:   '#C08A4E',
    wood2:  '#8A5A2B',
    iron:   '#6E6A62',
    iron2:  '#514E48',
    red:    '#E2483C',
    green:  '#2FA86B',
    blue:   '#2E7BD6'
  };

  /* ---- registries ------------------------------------------------------ */

  var PARTS = {};       /* name -> part definition */
  var WINS  = {};       /* type -> win-condition definition */

  function definePart(name, def) { PARTS[name] = Object.assign({ name: name }, def); }
  function defineParts(map) { Object.keys(map).forEach(function (k) { definePart(k, map[k]); }); }
  function defineWin(type, def) { WINS[type] = Object.assign({ type: type }, def); }
  function defineWins(map) { Object.keys(map).forEach(function (k) { defineWin(k, map[k]); }); }

  /* ---- the board ------------------------------------------------------- */

  function create(opts) {
    opts = opts || {};
    var cv = opts.canvas;
    var ctx = cv ? cv.getContext('2d') : null;

    /* The physics engine is made once and reused for every run; a reset
       clears the world and rebuilds it rather than throwing the engine away,
       so nothing that holds a reference to it goes stale. */
    var engine = null, world = null;
    if (HAVE_MATTER) {
      engine = global.Matter.Engine.create();
      engine.gravity.y = 1;
      /* Four iterations is Matter's default for positions; stacks of dominoes
         and a loaded seesaw both settle badly at the default, and the board is
         small enough that the extra passes cost nothing measurable. */
      engine.positionIterations = 8;
      engine.velocityIterations = 6;
      world = engine.world;
    }

    var board = {
      W: W, H: H, GRID: GRID, palette: PALETTE,
      canvas: cv, ctx: ctx,
      haveMatter: HAVE_MATTER,
      engine: engine, world: world,
      level: null,
      draw: draw
    };

    function drawPaper() {
      ctx.fillStyle = PALETTE.paper;
      ctx.fillRect(0, 0, W, H);

      /* The grid parts snap to. Faint, and every fifth line a shade darker, so
         the eye can count across the board without the lines competing with
         the parts. */
      ctx.lineWidth = 1;
      for (var x = GRID; x < W; x += GRID) {
        ctx.strokeStyle = (x % (GRID * 5) === 0) ? PALETTE.gridOn : PALETTE.grid;
        ctx.beginPath(); ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, H); ctx.stroke();
      }
      for (var y = GRID; y < H; y += GRID) {
        ctx.strokeStyle = (y % (GRID * 5) === 0) ? PALETTE.gridOn : PALETTE.grid;
        ctx.beginPath(); ctx.moveTo(0, y + .5); ctx.lineTo(W, y + .5); ctx.stroke();
      }
    }

    function drawFrame() {
      /* A brass rule around the working area, so the board reads as a bench
         top rather than as a browser canvas that happens to be beige. */
      ctx.strokeStyle = PALETTE.brass;
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, W - 6, H - 6);
      ctx.strokeStyle = 'rgba(255,255,255,.45)';
      ctx.lineWidth = 2;
      ctx.strokeRect(8, 8, W - 16, H - 16);
    }

    function draw() {
      if (!ctx) return;
      drawPaper();
      drawFrame();
    }

    draw();
    return board;
  }

  global.LCContraption = {
    version: 0,
    W: W, H: H, GRID: GRID,
    palette: PALETTE,
    haveMatter: HAVE_MATTER,
    parts: PARTS,
    wins: WINS,
    definePart: definePart,
    defineParts: defineParts,
    defineWin: defineWin,
    defineWins: defineWins,
    create: create
  };
})(window);
