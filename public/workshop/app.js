/* app.js — wires the bench page to the engine. */
(function () {
  'use strict';

  var cv = document.getElementById('cv');
  var said = document.getElementById('said');
  var state = document.getElementById('p-state');

  if (!window.LCContraption) return;

  var board = window.LCContraption.create({ canvas: cv });

  if (!board.haveMatter) {
    state.textContent = 'no physics';
    said.textContent = 'The physics library did not load, so the bench cannot run a machine. ' +
      'A reload usually fixes it.';
    return;
  }

  state.textContent = 'bench ready';
  said.textContent = 'The bench is empty.';
})();
