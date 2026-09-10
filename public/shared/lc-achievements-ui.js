/* ------------------------------------------------------------------ *
 *  The tracker panel.
 *
 *  What /shared/lc-achievements.js knows, drawn. It is deliberately
 *  plain: a list of what has been found, a list of gaps, and a count.
 *
 *  How a locked row reads is the whole design problem. A row that says
 *  nothing is not a puzzle, it is a blank; a row that says exactly what
 *  to do is not an egg any more. So a locked entry shows its hint and
 *  withholds its name, and the hints are written to be true but not
 *  sufficient — "five arrows point somewhere real" tells you a shape to
 *  look for and not one arrow of the sequence.
 *
 *  It takes its colours from the hub's Windows 98 scheme through the
 *  same custom properties the desktop sets, so it follows whatever
 *  scheme the visitor picked. Every one has a fallback, so it is still
 *  legible on a page that sets none of them.
 *
 *  Usage:
 *      LCAchUI.open()      LCAchUI.close()      LCAchUI.toggle()
 *      LCAchUI.open        // is it showing
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var panel = null, styled = false, lastFocus = null;

  function styles(){
    if (styled) return;
    styled = true;
    var s = document.createElement('style');
    s.textContent = [
      '.lcach-back{position:fixed;inset:0;z-index:2147481000;background:rgba(0,0,0,.42);',
      '  display:flex;align-items:center;justify-content:center;padding:18px}',
      '.lcach{width:min(520px,100%);max-height:min(78vh,660px);display:flex;flex-direction:column;',
      '  background:var(--w98-face,#c0c0c0);color:var(--w98-text,#000);',
      '  border:2px solid;border-color:var(--w98-lite,#dfdfdf) var(--w98-dark,#404040)',
      '  var(--w98-dark,#404040) var(--w98-lite,#dfdfdf);',
      '  font:12px/1.5 "Pixelated MS Sans Serif",ui-sans-serif,system-ui,Arial,sans-serif;',
      '  box-shadow:3px 3px 0 rgba(0,0,0,.35)}',
      '.lcach .bar{display:flex;align-items:center;gap:8px;padding:3px 3px 3px 6px;',
      '  background:linear-gradient(90deg,var(--w98-title-a,#000080),var(--w98-title-b,#1084d0));',
      '  color:var(--w98-title-t,#fff);font-weight:700;flex:none}',
      '.lcach .bar .t{flex:1}',
      '.lcach .bar button{font:inherit;font-weight:700;width:18px;height:16px;line-height:1;',
      '  background:var(--w98-face,#c0c0c0);color:var(--w98-text,#000);cursor:pointer;',
      '  border:1px solid;border-color:var(--w98-lite,#dfdfdf) var(--w98-dark,#404040)',
      '  var(--w98-dark,#404040) var(--w98-lite,#dfdfdf)}',
      '.lcach .count{flex:none;padding:9px 11px 7px;font-weight:700}',
      '.lcach .meter{flex:none;margin:0 11px 9px;height:14px;background:var(--w98-win,#fff);',
      '  border:1px solid;border-color:var(--w98-dark,#404040) var(--w98-lite,#dfdfdf)',
      '  var(--w98-lite,#dfdfdf) var(--w98-dark,#404040);padding:2px;display:flex;gap:2px;overflow:hidden}',
      '.lcach .meter i{flex:none;width:9px;background:var(--w98-title-a,#000080)}',
      '.lcach .list{overflow:auto;margin:0 11px 11px;padding:4px;background:var(--w98-win,#fff);',
      '  border:1px solid;border-color:var(--w98-dark,#404040) var(--w98-lite,#dfdfdf)',
      '  var(--w98-lite,#dfdfdf) var(--w98-dark,#404040)}',
      '.lcach .row{display:flex;gap:8px;padding:5px 6px;align-items:baseline}',
      '.lcach .row + .row{border-top:1px dotted rgba(128,128,128,.45)}',
      '.lcach .mk{flex:none;width:14px;text-align:center;font-weight:700}',
      '.lcach .row.got .mk{color:#0a7a2f}',
      '.lcach .row.locked{opacity:.72}',
      '.lcach .nm{flex:1}',
      '.lcach .row.locked .nm{font-style:italic}',
      '.lcach .wh{flex:none;font-variant-numeric:tabular-nums;opacity:.65;font-size:11px}',
      '.lcach .foot{flex:none;padding:0 11px 11px;font-size:11px;opacity:.75}',
      '.lcach .done{margin:0 11px 11px;padding:8px 10px;background:var(--w98-win,#fff);',
      '  border:1px solid var(--w98-dark,#404040);font-weight:700}',
      '@media (max-width:420px){.lcach .wh{display:none}}',
      /* the wall, which only exists once everything has been found */
      '.lcach .wall{margin:0 11px 11px;padding:9px 10px;background:var(--w98-win,#fff);',
      '  border:1px solid;border-color:var(--w98-dark,#404040) var(--w98-lite,#dfdfdf)',
      '  var(--w98-lite,#dfdfdf) var(--w98-dark,#404040)}',
      '.lcach .wall h3{margin:0 0 6px;font-size:12px}',
      '.lcach .wall .names{max-height:132px;overflow:auto;margin:0 0 8px}',
      '.lcach .wall .who{padding:3px 0;border-bottom:1px dotted rgba(128,128,128,.4)}',
      '.lcach .wall .who:last-child{border-bottom:0}',
      '.lcach .wall .who b{font-weight:700}',
      '.lcach .wall .who.you b{text-decoration:underline}',
      '.lcach .wall .who span{opacity:.7}',
      '.lcach .wall form{display:flex;gap:5px;flex-wrap:wrap;align-items:center}',
      '.lcach .wall input{font:inherit;padding:3px 5px;min-width:0;',
      '  border:1px solid;border-color:var(--w98-dark,#404040) var(--w98-lite,#dfdfdf)',
      '  var(--w98-lite,#dfdfdf) var(--w98-dark,#404040)}',
      '.lcach .wall input.h{width:8ch}.lcach .wall input.t{flex:1 1 12ch}',
      '.lcach .wall button{font:inherit;padding:3px 9px;min-height:22px;cursor:pointer;',
      '  background:var(--w98-face,#c0c0c0);color:var(--w98-text,#000);',
      '  border:1px solid;border-color:var(--w98-lite,#dfdfdf) var(--w98-dark,#404040)',
      '  var(--w98-dark,#404040) var(--w98-lite,#dfdfdf)}',
      '.lcach .wall .say{margin:6px 0 0;font-size:11px;opacity:.8}',
      '@media (pointer:coarse){.lcach .wall button,.lcach .wall input{min-height:38px}}',
    ].join('');
    document.head.appendChild(s);
  }

  function when(ms){
    var d = new Date(ms);
    return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) +
           '/' + String(d.getFullYear()).slice(-2);
  }

  function esc(t){
    return String(t).replace(/[&<>"]/g, function(c){
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c];
    });
  }

  function rows(){
    var all = window.LCAch ? LCAch.all() : [];
    if (!all.length) return '<div class="row"><div class="nm">Nothing is registered yet.</div></div>';
    return all.map(function(a){
      if (a.earned){
        return '<div class="row got"><div class="mk">&#10003;</div>' +
               '<div class="nm">' + esc(a.name) + '</div>' +
               '<div class="wh">' + when(a.at) + '</div></div>';
      }
      // locked: the hint, never the name, unless it was never secret
      var label = a.secret ? (a.hint || 'Something, somewhere.') : esc(a.name);
      return '<div class="row locked"><div class="mk">&#183;</div>' +
             '<div class="nm">' + esc(label) + '</div></div>';
    }).join('');
  }

  function body(){
    var p = window.LCAch ? LCAch.progress() : { earned: 0, total: 0 };
    var done = window.LCAch && LCAch.complete();
    var pips = '';
    for (var i = 0; i < p.earned; i++) pips += '<i></i>';
    return '<div class="bar"><span class="t">Found Things</span>' +
           '<button type="button" aria-label="Close">&times;</button></div>' +
           '<div class="count">' + p.earned + ' of ' + p.total + ' found</div>' +
           '<div class="meter" role="img" aria-label="' + p.earned + ' of ' + p.total + '">' + pips + '</div>' +
           '<div class="list">' + rows() + '</div>' +
           (done
             ? '<div class="done">Everything on this list has been found.</div>' +
               '<div class="wall" id="lcach-wall"><h3>The wall</h3>' +
               '<p class="say">Loading the wall&hellip;</p></div>'
             : '<div class="foot">The rest are still out there. Nothing here is on the server &mdash; ' +
               'this is your copy and nobody else can see it.</div>');
  }

  /* ---- the wall ------------------------------------------------------ *
   *  The one part of this that other people can see. Everything else in
   *  the tracker is private to the browser it happens in; this is a
   *  shared board, on the same infrastructure as the guestbook.
   *
   *  It is only fetched once the list is complete. Asking the server for
   *  it earlier would tell the server that somebody had opened the
   *  tracker, which is not its business.
   * ------------------------------------------------------------------- */
  function paintWall(data){
    var el = panel && panel.querySelector('#lcach-wall');
    if (!el) return;
    if (!data || !data.ok){
      var why = (window.LCId && LCId.why) ? LCId.why(data && data.why) : null;
      el.innerHTML = '<h3>The wall</h3><p class="say">' +
        esc(why || 'The wall is not reachable just now.') + '</p>';
      return;
    }
    var names = data.entries.length
      ? data.entries.map(function(e){
          return '<div class="who' + (e.you ? ' you' : '') + '"><b>' + esc(e.handle) + '</b>' +
                 (e.text ? ' <span>&mdash; ' + esc(e.text) + '</span>' : '') + '</div>';
        }).join('')
      : '<div class="who"><span>Nobody has signed it yet. You would be first.</span></div>';

    el.innerHTML =
      '<h3>The wall &mdash; ' + data.total + ' ' + (data.total === 1 ? 'name' : 'names') + '</h3>' +
      '<div class="names">' + names + '</div>' +
      (data.signed
        ? '<p class="say">You are on it. Signing again replaces what you wrote.</p>' +
          '<form id="lcach-sign"><input class="h" id="lcach-h" maxlength="12" placeholder="name" ' +
          'aria-label="Your name"><input class="t" id="lcach-t" maxlength="140" ' +
          'placeholder="say something (optional)" aria-label="Something to say">' +
          '<button type="submit">Change it</button></form>'
        : '<form id="lcach-sign"><input class="h" id="lcach-h" maxlength="12" placeholder="name" ' +
          'aria-label="Your name"><input class="t" id="lcach-t" maxlength="140" ' +
          'placeholder="say something (optional)" aria-label="Something to say">' +
          '<button type="submit">Sign it</button></form>');

    var h = el.querySelector('#lcach-h');
    if (h && window.LCId && LCId.handle) { try { h.value = LCId.handle() || ''; } catch (e) {} }

    var form = el.querySelector('#lcach-sign');
    if (form) form.addEventListener('submit', function(e){
      e.preventDefault();
      if (!window.LCId || !window.LCAch) return;
      var p = LCAch.progress();
      var btn = form.querySelector('button');
      btn.disabled = true; btn.textContent = 'Signing\u2026';
      LCId.post('/api/hall', {
        handle: el.querySelector('#lcach-h').value,
        text: el.querySelector('#lcach-t').value,
        found: p.earned, total: p.total
      }).then(function(out){
        if (out && out.ok) paintWall(out);
        else {
          btn.disabled = false; btn.textContent = 'Sign it';
          var say = document.createElement('p');
          say.className = 'say';
          say.textContent = (window.LCId && LCId.why(out && out.why)) ||
                            'That did not go through.';
          form.appendChild(say);
        }
      });
    });
  }

  function loadWall(){
    if (!panel || !window.LCAch || !LCAch.complete()) return;
    if (!window.LCId){ paintWall({ ok: false, why: 'unreachable' }); return; }
    LCId.get('/api/hall').then(paintWall);
  }

  function open(){
    if (panel) return false;
    styles();
    lastFocus = document.activeElement;

    panel = document.createElement('div');
    panel.className = 'lcach-back';
    panel.innerHTML = '<div class="lcach" role="dialog" aria-modal="true" ' +
                      'aria-label="Found things" tabindex="-1">' + body() + '</div>';
    document.body.appendChild(panel);

    var box = panel.querySelector('.lcach');
    box.querySelector('.bar button').addEventListener('click', close);
    // the backdrop closes, the panel itself must not
    panel.addEventListener('click', function(e){ if (e.target === panel) close(); });
    document.addEventListener('keydown', onKey, true);
    box.focus();
    loadWall();
    return true;
  }

  function onKey(e){
    if (e.key === 'Escape'){ e.stopPropagation(); close(); }
  }

  function close(){
    if (!panel) return false;
    document.removeEventListener('keydown', onKey, true);
    if (panel.parentNode) panel.parentNode.removeChild(panel);
    panel = null;
    // put focus back where it was, or the trigger is lost to a keyboard
    if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) {}
    lastFocus = null;
    return true;
  }

  /* Something was just found while the panel is open — redraw it rather
     than leave a stale count sitting in front of the person who caused it. */
  if (window.LCAch) LCAch.on(function(){
    if (!panel) return;
    var box = panel.querySelector('.lcach');
    box.innerHTML = body();
    box.querySelector('.bar button').addEventListener('click', close);
    loadWall();
  });

  window.LCAchUI = {
    open: open,
    close: close,
    toggle: function(){ return panel ? close() : open(); },
    get showing(){ return !!panel; },
  };
})();
