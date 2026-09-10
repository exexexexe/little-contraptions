/* ------------------------------------------------------------------ *
 *  Rest.
 *
 *  The screen goes down to almost nothing, one of Room Tone's beds
 *  comes up underneath it, and the cabinet sits there until you come
 *  back. It is the screensaver's better-behaved relative: nothing to
 *  watch, nothing to score, nothing asking for a decision.
 *
 *  The sound is /shared/lc-roomtone.js — the same six beds the Room
 *  Tone drawer plays, at a lower level, because there is no reason for
 *  this cabinet to own two ambient engines. If Web Audio is missing the
 *  dim still works and the room is simply quiet; resting is the point,
 *  the noise is the accompaniment.
 *
 *  Anything you do ends it: a key, a click, a touch. That is deliberate
 *  — a mode you have to work out how to leave is a trap, not a rest.
 *
 *  Usage:
 *      LCW98Rest.enter({ scene:'underwater', volume:0.34 })
 *      LCW98Rest.exit()
 *      LCW98Rest.toggle()
 *      LCW98Rest.resting
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var layer = null, styled = false, tick = null;
  var restored = null;          // what the audio was doing before we took it

  function styles(){
    if (styled) return;
    styled = true;
    var s = document.createElement('style');
    s.textContent = [
      '.lcrest{position:fixed;inset:0;z-index:2147482000;background:#000;',
      '  display:flex;align-items:center;justify-content:center;flex-direction:column;',
      '  gap:16px;cursor:none;opacity:0;transition:opacity 1.6s ease;',
      '  font:400 14px/1.6 ui-sans-serif,system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;',
      '  color:#5a6472;text-align:center;padding:24px}',
      '.lcrest.on{opacity:1}',
      '.lcrest .clk{font-size:clamp(30px,8vw,58px);font-weight:200;letter-spacing:1.5px;color:#79879b;',
      '  font-variant-numeric:tabular-nums}',
      '.lcrest .place{font-size:13px;letter-spacing:.6px;color:#4a525e}',
      '.lcrest .out{font-size:11.5px;letter-spacing:.5px;color:#333a44;margin-top:26px}',
      /* the whole layer breathes, very slowly, so a black screen does not
         read as a machine that has died */
      '@keyframes lcrest-breathe{0%,100%{opacity:.86}50%{opacity:1}}',
      '.lcrest.on .clk{animation:lcrest-breathe 7s ease-in-out infinite}',
      '@media (prefers-reduced-motion: reduce){',
      '  .lcrest{transition:none}.lcrest.on .clk{animation:none}}',
    ].join('');
    document.head.appendChild(s);
  }

  function clock(){
    var d = new Date();
    return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  }

  function enter(opts){
    if (layer) return false;
    var o = opts || {};
    var key = o.scene || 'underwater';
    styles();

    layer = document.createElement('div');
    layer.className = 'lcrest';
    layer.setAttribute('role', 'dialog');
    layer.setAttribute('aria-label', 'Resting. Any key returns.');

    var RT = window.LCRoomTone;
    var sc = RT && RT.scene ? RT.scene(key) : null;
    layer.innerHTML =
      '<div class="clk">' + clock() + '</div>' +
      '<div class="place">' + (sc ? sc.name : 'Resting') + '</div>' +
      '<div class="out">any key returns</div>';

    document.body.appendChild(layer);
    // one frame, so the opacity transition has something to run from
    requestAnimationFrame(function(){ if (layer) layer.classList.add('on'); });

    tick = setInterval(function(){
      var c = layer && layer.querySelector('.clk');
      if (c) c.textContent = clock();
    }, 20000);

    if (RT && RT.available()){
      // put back whatever was playing when we are done, including nothing
      restored = { key: RT.current, vol: RT.volume, was: RT.running };
      RT.setVolume(typeof o.volume === 'number' ? o.volume : 0.34);
      RT.play(key);
    } else {
      restored = null;
    }

    document.addEventListener('keydown', exit, true);
    document.addEventListener('pointerdown', exit, true);
    document.addEventListener('wheel', exit, { capture: true, passive: true });
    return true;
  }

  function exit(){
    if (!layer) return false;
    document.removeEventListener('keydown', exit, true);
    document.removeEventListener('pointerdown', exit, true);
    document.removeEventListener('wheel', exit, { capture: true });
    clearInterval(tick); tick = null;

    var RT = window.LCRoomTone;
    if (RT && restored){
      if (restored.was && restored.key){
        RT.setVolume(restored.vol);
        RT.play(restored.key);        // it was already playing: hand it back
      } else {
        RT.stop();
        RT.setVolume(restored.vol);
      }
    }
    restored = null;

    var going = layer;
    layer = null;
    going.classList.remove('on');
    setTimeout(function(){
      if (going.parentNode) going.parentNode.removeChild(going);
    }, 1700);
    return true;
  }

  window.LCW98Rest = {
    enter: enter,
    exit: exit,
    toggle: function(o){ return layer ? exit() : enter(o); },
    get resting(){ return !!layer; },
  };
})();
