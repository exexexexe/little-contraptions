/* ------------------------------------------------------------------ *
 *  The particle field.
 *
 *  Twelve named weather effects over one shared loop. Lifted out of the
 *  Elsewhere Almanac, which is where every one of them was written and
 *  where they still run; the snow globe wanted the same snow and the
 *  same rain, and there should not be two versions of either.
 *
 *  These are stylistic variations on one loop, not twelve systems: each
 *  effect is a spawn/step pair, and `base` is a particle count tuned for
 *  roughly a 1.2 megapixel surface which is then scaled to whatever it
 *  is actually attached to — so a big window gets a full field and a
 *  small globe does not get a blizzard.
 *
 *  Usage:
 *      var fx = LCWeatherFX.attach(canvasEl);
 *      fx.set('snow');
 *      fx.start();            // or fx.stop()
 *      fx.resize();           // after the canvas changes size
 *
 *  The loop drops itself entirely when the tab is hidden rather than
 *  idling in it, and respects prefers-reduced-motion by refusing to
 *  start at all.
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

  function attach(canvas, opts) {
    opts = opts || {};
    var fxCtx = canvas.getContext('2d');
    var VW = 0, VH = 0;
    var density = opts.density == null ? 1 : opts.density;

    /* The canvas may be the whole window (the almanac) or a box inside the
       page (the globe). `fit` asks the element how big it actually is
       unless a size is given. */
    function sizeCanvas(w, h) {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (w == null || h == null) {
        var r = canvas.getBoundingClientRect();
        w = Math.max(1, Math.round(r.width));
        h = Math.max(1, Math.round(r.height));
      }
      VW = w; VH = h;
      canvas.width = Math.round(VW * dpr);
      canvas.height = Math.round(VH * dpr);
      fxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const rnd = (lo, hi) => lo + Math.random() * (hi - lo);
    function dot(x, y, r, fill){
      fxCtx.beginPath(); fxCtx.arc(x, y, r, 0, 6.2832); fxCtx.fillStyle = fill; fxCtx.fill();
    }
    function streak(x, y, dx, dy, w, stroke){
      fxCtx.beginPath(); fxCtx.moveTo(x, y); fxCtx.lineTo(x + dx, y + dy);
      fxCtx.strokeStyle = stroke; fxCtx.lineWidth = w; fxCtx.stroke();
    }

    // Each effect declares a `base` particle count for a roughly 1.2Mpx
    // window; seedParticles() scales that to the actual viewport, so the
    // field stays legible on a large screen instead of thinning to nothing.
    // Same loop throughout — these are stylistic variations, not 12 systems.
    const EFFECTS = {
      snow: { base: 340,
        spawn(p){ p.x=rnd(0,VW); p.y=rnd(-VH,VH); p.r=rnd(1.4,3.8); p.v=rnd(28,80); p.d=rnd(-14,14); p.a=rnd(.45,.95); p.ph=rnd(0,6.3); },
        step(p,dt,t){ p.y+=p.v*dt; p.x+=p.d*dt+Math.sin(t*.8+p.ph)*.5;
          if(p.y>VH+5){ p.y=-5; p.x=rnd(0,VW); }
          dot(p.x,p.y,p.r,'rgba(232,244,255,'+p.a+')'); } },

      sand: { base: 240,
        spawn(p){ p.x=rnd(0,VW); p.y=rnd(0,VH); p.len=rnd(50,180); p.v=rnd(220,520); p.a=rnd(.10,.30); p.w=rnd(1.5,5.5); },
        step(p,dt){ p.x+=p.v*dt;
          if(p.x-p.len>VW){ p.x=-p.len; p.y=rnd(0,VH); }
          streak(p.x,p.y,-p.len,0,p.w,'rgba(222,180,104,'+p.a+')'); } },

      rain: { base: 380,
        spawn(p){ p.x=rnd(-60,VW); p.y=rnd(-VH,VH); p.len=rnd(14,34); p.v=rnd(620,1100); p.a=rnd(.28,.62); },
        step(p,dt){ p.y+=p.v*dt; p.x+=p.v*dt*.12;
          if(p.y>VH+p.len){ p.y=-p.len; p.x=rnd(-60,VW); }
          streak(p.x,p.y,-p.len*.12,-p.len,1.4,'rgba(190,216,238,'+p.a+')'); } },

      'acid-rain': { base: 320,
        spawn(p){ p.x=rnd(-60,VW); p.y=rnd(-VH,VH); p.len=rnd(16,36); p.v=rnd(500,880); p.a=rnd(.32,.70); },
        step(p,dt){ p.y+=p.v*dt; p.x+=p.v*dt*.1;
          if(p.y>VH+p.len){ p.y=-p.len; p.x=rnd(-60,VW); }
          streak(p.x,p.y,-p.len*.1,-p.len,1.8,'rgba(162,240,130,'+p.a+')'); } },

      ash: { base: 300,
        spawn(p){ p.x=rnd(0,VW); p.y=rnd(-VH,VH); p.r=rnd(1,3.2); p.v=rnd(14,44); p.ph=rnd(0,6.3); p.a=rnd(.30,.70); },
        step(p,dt,t){ p.y+=p.v*dt; p.x+=Math.sin(t*.5+p.ph)*.6;
          if(p.y>VH+5){ p.y=-5; p.x=rnd(0,VW); }
          dot(p.x,p.y,p.r,'rgba(208,202,194,'+p.a+')'); } },

      embers: { base: 260,
        spawn(p){ p.x=rnd(0,VW); p.y=rnd(0,VH+80); p.r=rnd(1.1,3); p.v=rnd(30,90); p.ph=rnd(0,6.3); p.a=rnd(.45,1); },
        step(p,dt,t){ p.y-=p.v*dt; p.x+=Math.sin(t*1.3+p.ph)*.8;
          if(p.y<-6){ p.y=VH+rnd(0,60); p.x=rnd(0,VW); }
          dot(p.x,p.y,p.r,'rgba(255,160,70,'+(p.a*(.55+.45*Math.sin(t*4+p.ph)))+')'); } },

      fog: { base: 46,
        spawn(p){ p.x=rnd(-140,VW+140); p.y=rnd(0,VH); p.r=rnd(90,230); p.v=rnd(5,20)*(Math.random()<.5?-1:1); p.a=rnd(.05,.13); },
        step(p,dt){ p.x+=p.v*dt;
          if(p.x-p.r>VW) p.x=-p.r;
          if(p.x+p.r<0) p.x=VW+p.r;
          const g=fxCtx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
          g.addColorStop(0,'rgba(206,216,212,'+p.a+')');
          g.addColorStop(1,'rgba(206,216,212,0)');
          fxCtx.fillStyle=g; fxCtx.beginPath(); fxCtx.arc(p.x,p.y,p.r,0,6.2832); fxCtx.fill(); } },

      spore: { base: 280,
        spawn(p){ p.x=rnd(0,VW); p.y=rnd(0,VH); p.r=rnd(1.2,3.4); p.v=rnd(8,28); p.d=rnd(-14,14); p.ph=rnd(0,6.3); p.a=rnd(.40,.95); },
        step(p,dt,t){ p.y-=p.v*dt*.5; p.x+=p.d*dt*.4+Math.sin(t*.7+p.ph)*.6;
          if(p.y<-6){ p.y=VH+6; p.x=rnd(0,VW); }
          dot(p.x,p.y,p.r,'rgba(250,194,96,'+(p.a*(.6+.4*Math.sin(t*2+p.ph)))+')'); } },

      starfield: { base: 420,
        spawn(p){ p.x=rnd(0,VW); p.y=rnd(0,VH); p.r=rnd(.6,1.9); p.v=rnd(1,4); p.ph=rnd(0,6.3); p.a=rnd(.40,1); },
        step(p,dt,t){ p.x+=p.v*dt*.15;
          if(p.x>VW+2) p.x=-2;
          dot(p.x,p.y,p.r,'rgba(238,243,255,'+(p.a*(.55+.45*Math.sin(t*1.6+p.ph)))+')'); } },

      fluorescent: { base: 200,
        spawn(p){ p.x=rnd(0,VW); p.y=rnd(0,VH); p.r=rnd(.8,2.2); p.v=rnd(3,14); p.d=rnd(-7,7); p.a=rnd(.22,.60); },
        step(p,dt){ p.y+=p.v*dt*.3; p.x+=p.d*dt*.3;
          if(p.y>VH+5){ p.y=-5; p.x=rnd(0,VW); }
          dot(p.x,p.y,p.r,'rgba(238,242,160,'+p.a+')'); },
        // the buzz: a faint irregular flicker over the whole field
        after(t){ const j=.05+.055*Math.abs(Math.sin(t*17)+Math.sin(t*31)*.4);
          fxCtx.fillStyle='rgba(198,206,96,'+j+')'; fxCtx.fillRect(0,0,VW,VH); } },

      aurora: { base: 60,
        spawn(p,i,n){ p.i=i; p.n=n; p.ph=rnd(0,6.3); p.a=rnd(.07,.20); p.w=rnd(18,56); },
        step(p,dt,t){
          const x=(p.i/p.n)*VW+Math.sin(t*.3+p.ph)*40;
          const top=VH*.06+Math.sin(t*.45+p.ph*1.7)*VH*.08;
          const h=VH*(.3+.16*Math.sin(t*.25+p.ph));
          const g=fxCtx.createLinearGradient(0,top,0,top+h);
          g.addColorStop(0,'rgba(120,255,205,0)');
          g.addColorStop(.4,'rgba(120,255,205,'+p.a+')');
          g.addColorStop(1,'rgba(90,170,255,0)');
          fxCtx.fillStyle=g; fxCtx.fillRect(x,top,p.w,h); } },

      calm: { base: 150,
        spawn(p){ p.x=rnd(0,VW); p.y=rnd(0,VH); p.r=rnd(1,2.6); p.v=rnd(5,18); p.d=rnd(-7,7); p.ph=rnd(0,6.3); p.a=rnd(.22,.60); },
        step(p,dt,t){ p.y+=p.v*dt*.5; p.x+=p.d*dt*.3+Math.sin(t*.4+p.ph)*.25;
          if(p.y>VH+5){ p.y=-5; p.x=rnd(0,VW); }
          dot(p.x,p.y,p.r,'rgba(220,230,224,'+p.a+')'); } },
    };

    let particles = [];
    let activeEffect = null;
    let rafId = 0, lastTs = 0;

    // `base` is tuned for ~1.2Mpx; scale to the real viewport so a big
    // window gets a full field and a phone doesn't get a blizzard.
    function particleCount(e){
        const scaled = Math.round(e.base * density * (VW * VH) / 1.2e6);
        return Math.max(12, Math.min(e.base * 3, scaled));
      }

    function seedParticles(name){
      const e = EFFECTS[name] || EFFECTS.calm;
      const n = particleCount(e);
      particles = [];
      for (let i = 0; i < n; i++){ const p = {}; e.spawn(p, i, n); particles.push(p); }
    }

    function frame(ts){
      // Hidden tab: drop the loop entirely rather than idling in it.
      // visibilitychange restarts it when the tab comes back.
      if (document.hidden){ rafId = 0; return; }
      rafId = requestAnimationFrame(frame);
      const dt = Math.min((ts - lastTs) / 1000, .05) || 0;
      lastTs = ts;
      const t = ts / 1000;
      const e = EFFECTS[activeEffect] || EFFECTS.calm;
      fxCtx.clearRect(0, 0, VW, VH);
      for (let i = 0; i < particles.length; i++) e.step(particles[i], dt, t);
      if (e.after) e.after(t);
    }

    function startLoop(){
      if (rafId || (REDUCE && REDUCE.matches) || document.hidden) return;
      lastTs = performance.now();
      rafId = requestAnimationFrame(frame);
    }
    function stopLoop(){
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    }

    sizeCanvas(opts.w, opts.h);

    return {
      names: Object.keys(EFFECTS),
      ctx: fxCtx,
      set: function (name) {
        if (!EFFECTS[name]) name = 'calm';
        if (name === activeEffect) return activeEffect;
        activeEffect = name;
        if (!(REDUCE && REDUCE.matches)) seedParticles(name);
        return activeEffect;
      },
      get current() { return activeEffect; },
      start: startLoop,
      stop: function () { stopLoop(); },
      clear: function () { fxCtx.clearRect(0, 0, VW, VH); },
      resize: function (w, h) {
        sizeCanvas(w, h);
        if (activeEffect && !(REDUCE && REDUCE.matches)) seedParticles(activeEffect);
      },
      get size() { return { w: VW, h: VH }; },
      /* the shake: shove every particle sideways, used by the snow globe */
      disturb: function (fx, fy) {
        for (var i = 0; i < particles.length; i++) {
          var p = particles[i];
          if (p.x != null) p.x += (Math.random() - 0.5) * (fx || 0);
          if (p.y != null) p.y += (Math.random() - 0.5) * (fy || 0);
          if (p.v != null) p.v *= 1 + Math.random() * 0.4;
        }
      },
      count: function () { return particles.length; }
    };
  }

  window.LCWeatherFX = { attach: attach };
})();
