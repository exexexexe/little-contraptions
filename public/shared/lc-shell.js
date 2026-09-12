/* ------------------------------------------------------------------ *
 *  The shell a consolidated toy is built on.
 *
 *  Four drawers in this cabinet are really several former drawers under
 *  one roof — the Generator, the Design Studio, the Sound Lab and the
 *  History Desk. They all need the same three things and nothing else:
 *  a list of parts, a door between them, and a guarantee that leaving
 *  one takes everything it started with it.
 *
 *  The rule they are all built under: a part brings its own room. Each
 *  of these was a toy with a surround built for it, and a merge that
 *  flattened them into one house style would spend that work to save
 *  effort. So a part carries its palette, its type, its markup and its
 *  behaviour, and this file only decides which one is on screen.
 *
 *      var S = LCShell.create({
 *        key: 'lc-generator-voice',   // where the choice is remembered
 *        param: 'voice',              // ?voice= in the URL
 *        label: 'Voice',              // what the picker is called
 *      });
 *      S.add({ id, name, blurb, page, css, mount(root) })
 *      S.boot()
 *
 *  `mount` may return a teardown. It is called before the next part is
 *  built, and the room is emptied either way.
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  function create(opts) {
    var o = opts || {};
    var KEY = o.key || 'lc-shell-part';
    var PARAM = o.param || 'part';

    var parts = [], byId = {}, injected = {};
    var current = null, teardown = null, pageVars = [];

    function add(def) {
      if (!def || !def.id || byId[def.id]) return;
      byId[def.id] = def;
      parts.push(def);
    }

    /* A part's CSS is written against .room and is given its own
       namespace on the way in, so two parts can both style .sheet
       without ever meeting. */
    function inject(def) {
      if (injected[def.id] || !def.css) return;
      injected[def.id] = true;
      var s = document.createElement('style');
      s.setAttribute('data-part', def.id);
      s.textContent = def.css.replace(/(^|\})([^@{}]+)\{/g, function (m, close, sel) {
        if (/^\s*(from|to|\d+%)\s*$/.test(sel)) return m;        // keyframe stops
        var scoped = sel.split(',').map(function (p) {
          p = p.trim();
          if (!p) return p;
          if (/^:root$/.test(p)) return '#shell-room[data-part="' + def.id + '"]';
          return '#shell-room[data-part="' + def.id + '"] ' + p;
        }).join(',');
        return close + scoped + '{';
      });
      document.head.appendChild(s);
    }

    /* Scoping the CSS into the room puts a part's :root variables on the
       room rather than the document, so the page behind it would keep
       the shell's default and only the middle of the screen would
       change. These few go on the root element instead, and are cleared
       between parts so one never leaks into the next. */
    function setPage(def) {
      var root = document.documentElement;
      pageVars.forEach(function (k) { root.style.removeProperty(k); });
      pageVars = [];
      var p = def.page || {};
      for (var k in p) {
        if (!Object.prototype.hasOwnProperty.call(p, k)) continue;
        root.style.setProperty(k, p[k]);
        pageVars.push(k);
      }
    }

    function show(id) {
      var def = byId[id] || parts[0];
      if (!def) return;
      if (teardown) { try { teardown(); } catch (e) {} teardown = null; }

      var room = document.getElementById('shell-room');
      room.innerHTML = '';
      room.dataset.part = def.id;
      inject(def);
      setPage(def);
      current = def;

      try { localStorage.setItem(KEY, def.id); } catch (e) {}
      var pick = document.getElementById('shell-pick');
      if (pick) pick.value = def.id;
      var blurb = document.getElementById('shell-blurb');
      if (blurb) blurb.textContent = def.blurb || '';
      document.title = def.name + ' — ' + (o.title || document.title);

      var host = document.createElement('div');
      host.className = 'room';
      room.appendChild(host);
      try {
        teardown = def.mount(host) || null;
      } catch (e) {
        room.innerHTML = '<div class="shell-missing"><strong>' + def.name +
          '</strong> did not start: ' + String(e && e.message || e) + '</div>';
      }
    }

    function boot() {
      var pick = document.getElementById('shell-pick');
      if (!parts.length) {
        document.getElementById('shell-room').innerHTML =
          '<div class="shell-missing">Nothing loaded. This drawer is a shell and its parts ' +
          'are separate files; none of them answered.</div>';
        return;
      }
      if (pick) {
        pick.innerHTML = parts.map(function (p) {
          return '<option value="' + p.id + '">' + p.name + '</option>';
        }).join('');
        pick.addEventListener('change', function () { show(pick.value); });
      }

      var want = null;
      try { want = localStorage.getItem(KEY); } catch (e) {}
      var q = null;
      try { q = new URLSearchParams(location.search).get(PARAM); } catch (e) {}
      show((q && byId[q]) ? q : (want && byId[want]) ? want : parts[0].id);

      if (window.LCSound && LCSound.mount) LCSound.mount();
    }

    return {
      add: add, show: show, boot: boot,
      get parts() { return parts.slice(); },
      get current() { return current && current.id; },
    };
  }

  window.LCShell = { create: create };
})();
