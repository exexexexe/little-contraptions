/* ------------------------------------------------------------------ *
 *  Wikimedia Commons, fetched once.
 *
 *  Two toys pull photographs from Commons — the San Francisco afternoon
 *  and the picture of the day — and both need the same three awkward
 *  things handled the same way:
 *
 *    1. `origin=*` on every call. Commons only sends CORS headers for an
 *       anonymous cross-origin request when that parameter is present,
 *       so without it the browser refuses the answer.
 *    2. thumb.wikimedia.org is blocked cross-origin in browsers and
 *       upload.wikimedia.org is not, and the API hands back the former.
 *       Every URL is rewritten.
 *    3. A file with no author or no licence in its metadata is dropped
 *       rather than shown. Attribution is the condition these are used
 *       under; a photograph we cannot credit is a photograph we do not
 *       display, whatever it looks like.
 *
 *  Nothing here needs a key and nothing goes through this hub's server:
 *  Commons is called directly from the browser.
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var API = 'https://commons.wikimedia.org/w/api.php';

  /* extmetadata values are HTML fragments — an artist is often an <a> to a
     user page. Flattened to text here so nothing from Commons is ever
     inserted as markup by a caller. */
  function strip(html) {
    var d = document.createElement('div');
    d.innerHTML = html || '';
    return (d.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function normaliseHost(u) {
    return (u || '').replace('//thumb.wikimedia.org/', '//upload.wikimedia.org/');
  }

  /* One API page turned into the shape both toys want, or null if it is
     not usable. `opts.landscapeOnly` and `opts.minWidth` are the two
     filters that differ between callers. */
  function photoFrom(page, opts) {
    opts = opts || {};
    var ii = (page.imageinfo || [])[0];
    if (!ii) return null;
    var em = ii.extmetadata || {};
    var val = function (k) { return em[k] ? strip(em[k].value) : null; };

    var artist = val('Artist');
    var licence = val('LicenseShortName');
    if (!artist || !licence) return null;              // see (3) above

    var src = ii.thumburl || ii.url;
    if (!src) return null;
    if (opts.minWidth && ii.width < opts.minWidth) return null;
    if (opts.landscapeOnly && ii.height > ii.width) return null;

    return {
      title: page.title.replace(/^File:/, '')
                       .replace(/\.(jpe?g|png|webp|tiff?)$/i, '')
                       .replace(/_/g, ' '),
      src: normaliseHost(src),
      page: 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(page.title),
      artist: artist,
      licence: licence,
      licenceUrl: val('LicenseUrl'),
      credit: val('Credit'),
      desc: val('ImageDescription'),
      date: val('DateTimeOriginal'),
      w: ii.width, h: ii.height
    };
  }

  function query(params) {
    var q = Object.assign({
      action: 'query', format: 'json', origin: '*',
      prop: 'imageinfo', iiprop: 'url|extmetadata|size'
    }, params);
    var parts = [];
    for (var k in q) if (q[k] != null) parts.push(k + '=' + encodeURIComponent(q[k]));
    return fetch(API + '?' + parts.join('&')).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  /* Every usable file in a category. Used by the San Francisco toy. */
  function category(name, opts) {
    opts = opts || {};
    return query({
      generator: 'categorymembers',
      gcmtype: 'file',
      gcmlimit: opts.limit || 100,
      gcmtitle: 'Category:' + name,
      iiurlwidth: opts.width || 1600
    }).then(function (j) {
      var pages = (j.query && j.query.pages) || {};
      return Object.keys(pages).map(function (k) {
        return photoFrom(pages[k], opts);
      }).filter(Boolean);
    });
  }

  /* Commons' picture of the day for a given YYYY-MM-DD.
   *
   * The template page Template:Potd/<date> transcludes the day's file, so
   * asking for the images ON that page is how you get it without scraping
   * anything. Some days the template pulls in a second decorative file;
   * the largest is the picture.
   */
  function pictureOfTheDay(ymd, opts) {
    opts = opts || {};
    return query({
      generator: 'images',
      titles: 'Template:Potd/' + ymd,
      gimlimit: 10,
      iiurlwidth: opts.width || 1600
    }).then(function (j) {
      var pages = (j.query && j.query.pages) || {};
      var out = Object.keys(pages).map(function (k) {
        return photoFrom(pages[k], opts);
      }).filter(Boolean);
      out.sort(function (a, b) { return (b.w * b.h) - (a.w * a.h); });
      return out[0] || null;
    });
  }

  /* YYYY-MM-DD in UTC. Commons' day is UTC, so asking in local time gets
     you tomorrow's page (which does not exist yet) for part of the day. */
  function today(offsetDays) {
    var d = new Date();
    d.setUTCDate(d.getUTCDate() + (offsetDays || 0));
    return d.toISOString().slice(0, 10);
  }

  window.LCCommons = {
    category: category,
    pictureOfTheDay: pictureOfTheDay,
    today: today,
    strip: strip,
    normaliseHost: normaliseHost
  };
})();
