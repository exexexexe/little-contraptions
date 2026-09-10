/* ------------------------------------------------------------------ *
 *  Turning it off and on again.
 *
 *  Two screens the desktop can put up over itself: a restart, which
 *  runs a power-on self test and then genuinely reloads, and a
 *  shutdown, which parks on the line everybody remembers and waits to
 *  be switched back on.
 *
 *  The BIOS is invented. There is no real vendor's string in here, no
 *  real copyright line and no real POST code table — it is a machine
 *  that never existed, built out of the shape of the ones that did. It
 *  reports the cabinet's own numbers where it can, because a self test
 *  that counts something real is funnier than one that counts nothing.
 *
 *  Self-contained on purpose: it injects its own styles, owns its own
 *  full-screen layer, and asks the page for nothing. The hub only has
 *  to call it.
 *
 *  Usage:
 *      LCW98Power.restart()             // POST, then location.reload()
 *      LCW98Power.shutdown()            // safe-to-turn-off, click to return
 *      LCW98Power.restart({ drawers: 149, reload: fn })
 *      LCW98Power.up                    // is a screen showing
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var layer = null;
  var timers = [];
  var styled = false;

  function reduced(){
    try { return matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  }

  function after(ms, fn){ var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearAll(){ timers.forEach(clearTimeout); timers = []; }

  function styles(){
    if (styled) return;
    styled = true;
    var s = document.createElement('style');
    s.textContent = [
      '.lcpwr{position:fixed;inset:0;z-index:2147483000;background:#000;color:#c8c8c8;',
      '  font:14px/1.55 ui-monospace,"SF Mono",Menlo,Consolas,monospace;',
      '  padding:26px 22px;overflow:hidden;cursor:default;-webkit-font-smoothing:none}',
      '.lcpwr b{color:#fff;font-weight:400}',
      '.lcpwr .dim{color:#7a7a7a}',
      '.lcpwr .amb{color:#e8a33d}',
      /* the shutdown screen: one line, floated in the middle of nothing */
      '.lcpwr.off{display:flex;align-items:center;justify-content:center;padding:24px;cursor:pointer}',
      '.lcpwr.off .msg{color:#e8a33d;font-size:clamp(15px,3.4vw,25px);text-align:center;',
      '  text-shadow:0 0 18px rgba(232,163,61,.42);letter-spacing:.4px;max-width:22ch}',
      '.lcpwr.off .sub{display:block;margin-top:20px;font-size:12.5px;color:#6b5426;',
      '  text-shadow:none;letter-spacing:.3px}',
      '@keyframes lcpwr-breathe{0%,100%{opacity:1}50%{opacity:.62}}',
      '.lcpwr.off .msg{animation:lcpwr-breathe 3.8s ease-in-out infinite}',
      '@keyframes lcpwr-blink{0%,49%{opacity:1}50%,100%{opacity:0}}',
      '.lcpwr .cur{display:inline-block;width:8px;height:14px;background:#c8c8c8;',
      '  vertical-align:-2px;animation:lcpwr-blink 1.05s step-end infinite}',
      '@media (prefers-reduced-motion: reduce){',
      '  .lcpwr .cur,.lcpwr.off .msg{animation:none}}',
    ].join('');
    document.head.appendChild(s);
  }

  function open(cls){
    close();
    styles();
    layer = document.createElement('div');
    layer.className = 'lcpwr' + (cls ? ' ' + cls : '');
    layer.setAttribute('role', 'alertdialog');
    layer.setAttribute('aria-live', 'assertive');
    document.body.appendChild(layer);
    // the desktop must not scroll behind a screen that is pretending to be
    // the whole machine
    layer.dataset.prevOverflow = document.documentElement.style.overflow || '';
    document.documentElement.style.overflow = 'hidden';
    return layer;
  }

  function close(){
    clearAll();
    if (!layer) return;
    document.documentElement.style.overflow = layer.dataset.prevOverflow || '';
    if (layer.parentNode) layer.parentNode.removeChild(layer);
    layer = null;
  }

  /* ---- the self test ------------------------------------------------ *
   *  Invented throughout. The memory figure counts up because that is the
   *  one part of a POST anybody actually watched.
   * ------------------------------------------------------------------ */
  function restart(opts){
    var o = opts || {};
    var drawers = o.drawers || 0;
    var reload = o.reload || function(){ try { location.reload(); } catch (e) {} };
    var box = open('post');
    var fast = reduced();

    var head = document.createElement('div');
    head.innerHTML =
      '<b>Contraption Systems BIOS</b> <span class="dim">v4.10.98</span><br>' +
      '<span class="dim">Cabinet Controller, 32-bit &mdash; no warranty is offered or implied</span><br><br>';
    box.appendChild(head);

    var mem = document.createElement('div');
    box.appendChild(mem);

    var rest = document.createElement('div');
    box.appendChild(rest);

    var TARGET = 65536;
    var lines = [
      'Detecting drawers .............. ' + (drawers ? drawers + ' found' : 'OK'),
      'Front panel .................... OK',
      'Card catalogue ................. mounted read/write',
      'Widget rail .................... 6 devices',
      'Undocumented things ............ present, not listed',
      'Clock .......................... running, roughly',
      '',
      'Starting Little Contraptions...',
    ];

    function memCount(){
      if (fast){
        mem.innerHTML = 'Memory Test : <b>' + TARGET + 'K OK</b><br><br>';
        return after(260, spill);
      }
      var v = 0;
      var step = function(){
        v = Math.min(TARGET, v + 4096);
        mem.innerHTML = 'Memory Test : <b>' + v + 'K</b>' + (v >= TARGET ? ' <b>OK</b><br><br>' : '<br><br>');
        if (v < TARGET) after(48, step);
        else after(360, spill);
      };
      step();
    }

    function spill(){
      if (fast){
        rest.innerHTML = lines.join('<br>') + ' <span class="cur"></span>';
        return after(700, reload);
      }
      var i = 0;
      var next = function(){
        rest.innerHTML = lines.slice(0, i + 1).join('<br>') + ' <span class="cur"></span>';
        i++;
        if (i < lines.length) after(lines[i - 1] === '' ? 180 : 300, next);
        else after(1150, reload);
      };
      next();
    }

    memCount();
    return box;
  }

  /* ---- the other one ------------------------------------------------ */
  function shutdown(opts){
    var o = opts || {};
    var box = open('off');
    box.innerHTML =
      '<div class="msg">It is now safe to turn off your computer.' +
      '<span class="sub">Click anywhere to switch it back on.</span></div>';

    function back(e){
      if (e) e.preventDefault();
      box.removeEventListener('click', back);
      document.removeEventListener('keydown', back);
      close();
      if (typeof o.onPowerOn === 'function') o.onPowerOn();
    }
    // a beat before it will listen, or the click that chose Shut Down
    // dismisses the screen it just asked for
    after(420, function(){
      box.addEventListener('click', back);
      document.addEventListener('keydown', back);
    });
    return box;
  }

  window.LCW98Power = {
    restart: restart,
    shutdown: shutdown,
    dismiss: close,
    get up(){ return !!layer; },
  };
})();
