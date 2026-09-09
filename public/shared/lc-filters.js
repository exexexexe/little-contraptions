/* ------------------------------------------------------------------ *
 *  The photograph filters.
 *
 *  Two toys apply a look to somebody else's photograph — Atmosphere and
 *  the picture of the day — and there is exactly one definition of what
 *  each look is, here. Neither toy owns a copy: they both call into
 *  this, so adding a filter adds it to both and fixing one fixes both.
 *
 *  Every look is a CSS `filter` string plus an optional overlay layer.
 *  Nothing is drawn to a canvas and nothing is re-encoded, which matters
 *  for more than performance: the original file is never modified, the
 *  browser is compositing over it, and the licence conversation stays
 *  "shown with a colour grade" rather than "here is a derived work we
 *  made and are now serving you".
 *
 *  `apply(imgEl, id)` sets the filter on the image and returns the
 *  overlay CSS the caller should put on a sibling layer, or ''. The
 *  caller owns its own markup; this owns the numbers.
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var FILTERS = [
    {
      id: 'none', name: 'As taken',
      note: 'No grade at all. The file as its photographer left it.',
      css: 'none', overlay: ''
    },
    {
      id: 'nostalgia', name: 'Nostalgia',
      note: 'Warmed, lifted blacks, a little less contrast — the way a print looks after twenty years in a drawer.',
      css: 'sepia(.28) saturate(1.14) contrast(.92) brightness(1.06) hue-rotate(-6deg)',
      overlay: 'linear-gradient(200deg, rgba(255,196,120,.18), rgba(255,150,90,.06) 46%, rgba(60,40,90,.12))'
    },
    {
      id: 'y2k', name: 'Y2K Camera',
      note: 'A two-megapixel compact in 2003: too much contrast, too much blue, and a flash it did not need.',
      css: 'saturate(1.5) contrast(1.22) brightness(1.04) hue-rotate(6deg)',
      overlay: 'radial-gradient(58% 48% at 50% 44%, rgba(255,255,255,.20), transparent 62%),' +
               'linear-gradient(0deg, rgba(20,40,120,.12), rgba(20,40,120,.12))'
    },
    {
      id: 'faded', name: 'Sun-faded',
      note: 'Left in a window. The dyes have gone and the cyan went first.',
      css: 'saturate(.55) contrast(.86) brightness(1.12) sepia(.16)',
      overlay: 'linear-gradient(160deg, rgba(255,240,210,.22), rgba(255,255,255,.06))'
    },
    {
      id: 'nightvision', name: 'Late shift',
      note: 'Everything cooled and dimmed, the way a corridor looks at four in the morning.',
      css: 'saturate(.7) contrast(1.08) brightness(.82) hue-rotate(178deg) saturate(1.3) hue-rotate(-178deg)',
      overlay: 'linear-gradient(180deg, rgba(20,40,60,.30), rgba(10,20,40,.42))'
    },
    {
      id: 'chrome', name: 'Black and white',
      note: 'A straight desaturation with the contrast pushed, which is what a red filter did on film.',
      css: 'grayscale(1) contrast(1.16) brightness(1.02)',
      overlay: ''
    },
    {
      id: 'xerox', name: 'Photocopied',
      note: 'Run through the machine twice. Almost no midtones survive that.',
      css: 'grayscale(1) contrast(2.6) brightness(1.12)',
      overlay: 'repeating-linear-gradient(0deg, rgba(0,0,0,.06) 0 1px, transparent 1px 3px)'
    },
    {
      id: 'vhs', name: 'Off a tape',
      note: 'Third generation. The colour has bled sideways and the blacks are grey.',
      css: 'saturate(1.3) contrast(.94) brightness(1.05) blur(.3px)',
      overlay: 'repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 2px, rgba(0,0,0,.05) 2px 4px),' +
               'linear-gradient(96deg, rgba(255,0,80,.05), rgba(0,180,255,.05))'
    }
  ];

  var BY_ID = {};
  FILTERS.forEach(function (f) { BY_ID[f.id] = f; });

  function get(id) { return BY_ID[id] || BY_ID.none; }

  /* Set the grade on an <img> (or any element). Returns the overlay CSS
     the caller should paint on a layer above it, '' when there is none. */
  function apply(el, id) {
    var f = get(id);
    if (el) el.style.filter = f.css === 'none' ? '' : f.css;
    return f.overlay;
  }

  /* A row of buttons, for the toys that want the standard control.
     `onPick` is called with the id. The caller styles it; the markup is
     deliberately plain so two different-looking toys can both use it. */
  function buttons(host, current, onPick) {
    if (!host) return;
    host.innerHTML = FILTERS.map(function (f) {
      return '<button type="button" data-f="' + f.id + '" title="' + f.note.replace(/"/g, '&quot;') +
             '" aria-pressed="' + (f.id === current ? 'true' : 'false') + '">' + f.name + '</button>';
    }).join('');
    host.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      current = b.getAttribute('data-f');
      [].forEach.call(host.children, function (x) {
        x.setAttribute('aria-pressed', String(x.getAttribute('data-f') === current));
      });
      onPick(current);
    });
  }

  window.LCFilters = { list: FILTERS, get: get, apply: apply, buttons: buttons };
})();
