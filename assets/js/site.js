/* Mended Consulting - TIDE interaction layer
 *
 * Rules:
 *   - No window scroll listeners for reveals. IntersectionObserver only.
 *     The scroll progress bar is the one exception and it is rAF-throttled
 *     and writes only a transform, so it never triggers layout.
 *   - Every motion path checks prefers-reduced-motion and degrades to static.
 *   - Pointer-driven effects (magnetic, tilt) use transforms only, are gated
 *     behind a fine-pointer query, and never touch layout properties.
 *   - Every enhancement is optional: if the markup is absent, skip it.
 */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ------------------------------------------------------------------
   * 1. Reveal on scroll
   * ---------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal, .stat-bar');
    if (!items.length) return;

    if (reduce || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
   * 2. Scroll progress bar
   * Writes a transform on one fixed element, throttled to one write per
   * frame. No layout reads inside the handler.
   * ---------------------------------------------------------------- */
  function initProgress() {
    var bar = document.querySelector('[data-progress]');
    if (!bar) return;

    var ticking = false;

    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var pct = max > 0 ? Math.min(1, doc.scrollTop / max) : 0;
      bar.style.transform = 'scaleX(' + pct + ')';
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  /* ------------------------------------------------------------------
   * 3. Counters
   * Counts to data-target when the element enters view. Respects
   * data-suffix and data-prefix. Reduced motion jumps straight to the value.
   * ---------------------------------------------------------------- */
  function initCounters() {
    var els = document.querySelectorAll('[data-target]');
    if (!els.length) return;

    function render(el, value) {
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      el.textContent = (el.getAttribute('data-prefix') || '') +
        value.toFixed(decimals) +
        (el.getAttribute('data-suffix') || '');
    }

    function run(el) {
      var target = parseFloat(el.getAttribute('data-target'));
      if (isNaN(target)) return;

      if (reduce) { render(el, target); return; }

      var dur = 1400;
      var start = null;

      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        // easeOutExpo, matches the system easing feel
        var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        render(el, target * eased);
        if (p < 1) window.requestAnimationFrame(step);
        else render(el, target);
      }

      window.requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, function (el) { run(el); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        run(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.4 });

    Array.prototype.forEach.call(els, function (el) {
      render(el, 0);
      io.observe(el);
    });
  }

  /* ------------------------------------------------------------------
   * 4. Magnetic buttons
   * A light pull toward the cursor. Pointer devices only, so it never
   * interferes with touch, and off entirely under reduced motion.
   * ---------------------------------------------------------------- */
  function initMagnetic() {
    if (reduce || !finePointer) return;

    document.querySelectorAll('.magnetic').forEach(function (el) {
      var raf = null, tx = 0, ty = 0;

      function apply() {
        el.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
        raf = null;
      }

      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 14;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 14;
        if (!raf) raf = window.requestAnimationFrame(apply);
      });

      el.addEventListener('pointerleave', function () {
        tx = 0; ty = 0;
        if (!raf) raf = window.requestAnimationFrame(apply);
      });
    });
  }

  /* ------------------------------------------------------------------
   * 5. Tilt cards
   * ---------------------------------------------------------------- */
  function initTilt() {
    if (reduce || !finePointer) return;

    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var raf = null, rx = 0, ry = 0;

      function apply() {
        el.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
        raf = null;
      }

      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        ry = ((e.clientX - r.left) / r.width - 0.5) * 7;
        rx = -((e.clientY - r.top) / r.height - 0.5) * 7;
        if (!raf) raf = window.requestAnimationFrame(apply);
      });

      el.addEventListener('pointerleave', function () {
        rx = 0; ry = 0;
        if (!raf) raf = window.requestAnimationFrame(apply);
      });
    });
  }

  /* ------------------------------------------------------------------
   * 6. Filterable gallery
   * Buttons are real buttons with aria-pressed. Hiding uses the hidden
   * attribute so screen readers agree with what is on screen.
   * ---------------------------------------------------------------- */
  function initFilters() {
    document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
      var buttons = gallery.querySelectorAll('[data-filter]');
      var tiles = gallery.querySelectorAll('[data-cat]');
      var live = gallery.querySelector('[data-gallery-count]');
      if (!buttons.length || !tiles.length) return;

      function apply(filter) {
        var shown = 0;
        tiles.forEach(function (t) {
          var match = filter === 'all' || t.getAttribute('data-cat') === filter;
          t.hidden = !match;
          if (match) shown++;
        });
        buttons.forEach(function (b) {
          b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === filter));
        });
        if (live) {
          live.textContent = shown + (shown === 1 ? ' type shown' : ' types shown');
        }
      }

      buttons.forEach(function (b) {
        b.addEventListener('click', function () { apply(b.getAttribute('data-filter')); });
      });

      apply('all');
    });
  }

  /* ------------------------------------------------------------------
   * 7. Marquee
   * The track holds the item group twice so the -50% translate loops
   * seamlessly. This clones the group if the markup only has one.
   * ---------------------------------------------------------------- */
  function initMarquee() {
    document.querySelectorAll('.marquee-track').forEach(function (track) {
      if (track.children.length === 1) {
        var clone = track.firstElementChild.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      }
    });
  }

  /* ------------------------------------------------------------------
   * 8. Mobile navigation
   * ---------------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var drawer = document.querySelector('[data-nav-drawer]');
    if (!toggle || !drawer) return;

    var close = drawer.querySelector('[data-nav-close]');

    function setOpen(open) {
      drawer.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      drawer.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        var first = drawer.querySelector('a, button');
        if (first) first.focus();
      } else {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(!drawer.classList.contains('is-open'));
    });

    if (close) close.addEventListener('click', function () { setOpen(false); });

    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) setOpen(false);
    });
  }

  /* ------------------------------------------------------------------
   * 9. Tabs
   * ---------------------------------------------------------------- */
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (group) {
      var tabs = Array.prototype.slice.call(group.querySelectorAll('[role="tab"]'));
      if (!tabs.length) return;

      function select(tab) {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute('aria-selected', String(on));
          t.setAttribute('tabindex', on ? '0' : '-1');
          var panel = document.getElementById(t.getAttribute('aria-controls'));
          if (panel) panel.hidden = !on;
        });
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () { select(tab); });
        tab.addEventListener('keydown', function (e) {
          var next = null;
          if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
          if (e.key === 'ArrowLeft')  next = tabs[(i - 1 + tabs.length) % tabs.length];
          if (e.key === 'Home')       next = tabs[0];
          if (e.key === 'End')        next = tabs[tabs.length - 1];
          if (!next) return;
          e.preventDefault();
          select(next);
          next.focus();
        });
      });

      select(tabs.filter(function (t) {
        return t.getAttribute('aria-selected') === 'true';
      })[0] || tabs[0]);
    });
  }

  /* ------------------------------------------------------------------
   * 10. Accordions, one open at a time per group
   * ---------------------------------------------------------------- */
  function initAccordions() {
    document.querySelectorAll('[data-accordion]').forEach(function (group) {
      var items = Array.prototype.slice.call(group.querySelectorAll('details'));
      items.forEach(function (item) {
        item.addEventListener('toggle', function () {
          if (!item.open) return;
          items.forEach(function (o) { if (o !== item) o.open = false; });
        });
      });
    });
  }

  /* ------------------------------------------------------------------
   * 11. Enquiry form
   * ---------------------------------------------------------------- */
  function initForm() {
    var form = document.querySelector('[data-enquiry-form]');
    if (!form) return;

    var submit = form.querySelector('[data-submit]');
    var label  = submit ? submit.querySelector('[data-submit-label]') : null;
    var status = form.querySelector('[data-form-status]');

    function show(kind, message) {
      if (!status) return;
      status.className = 'form-status is-visible form-status--' + kind;
      status.textContent = message;
      status.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    }

    function clear() {
      if (!status) return;
      status.className = 'form-status';
      status.textContent = '';
    }

    function wrapOf(el) { return el.closest('.field') || el.closest('.check'); }

    function validate(el) {
      var wrap = wrapOf(el);
      if (!wrap) return true;
      var ok = el.checkValidity();
      wrap.classList.toggle('has-error', !ok);
      if (!ok) {
        var msg = wrap.querySelector('.field-error');
        if (msg && !msg.dataset.custom) msg.textContent = el.validationMessage;
      }
      return ok;
    }

    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('blur', function () { validate(el); });
      el.addEventListener('input', function () {
        var wrap = wrapOf(el);
        if (wrap && wrap.classList.contains('has-error')) validate(el);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clear();

      var els = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'));
      var bad = els.filter(function (el) { return !validate(el); });

      if (bad.length) {
        show('error', 'Please check the highlighted fields and try again.');
        bad[0].focus();
        bad[0].scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
        return;
      }

      var endpoint = form.getAttribute('data-endpoint');

      // Not wired to an inbox yet: fail loudly rather than pretend it sent.
      if (!endpoint || endpoint.indexOf('YOUR_FORM_ID') !== -1) {
        show('error',
          'This form is not connected to an inbox yet. Set data-endpoint on the form ' +
          '(see README) or email hello@mendedconsulting.com.au in the meantime.');
        return;
      }

      if (submit) submit.setAttribute('aria-busy', 'true');
      if (label) label.textContent = 'Sending';

      fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('status ' + res.status);
          var to = form.getAttribute('data-redirect');
          if (to) { window.location.href = to; return; }
          form.reset();
          show('ok', 'Thanks, your enquiry is in. You will hear back within one business day.');
        })
        .catch(function () {
          show('error',
            'Something went wrong sending that. Please try again, or email ' +
            'hello@mendedconsulting.com.au directly.');
        })
        .finally(function () {
          if (submit) submit.removeAttribute('aria-busy');
          if (label) label.textContent = 'Send enquiry';
        });
    });
  }

  /* ------------------------------------------------------------------
   * 12. Hero motion background: the Auralis shader
   * A vanilla WebGL port of the Auralis component: simplex-noise field,
   * a glow pass and film grain, running the brand maroons over the dark
   * hero stage. The GLSL is the component's, verbatim; the React wrapper
   * is replaced by this site's gating: it runs on every device except
   * under prefers-reduced-motion, the DPR cap keeps phones cheap, and the
   * loop pauses whenever the hero leaves the viewport or the tab hides.
   * Colours are read from the live CSS tokens, so a rebrand re-tints the
   * shader with no code change.
   * ---------------------------------------------------------------- */
  function initMotionBg() {
    var layer = document.querySelector('.hero-motion');
    var canvas = layer && layer.querySelector('[data-aurora]');
    if (!layer || !canvas) return;
    // Under prefers-reduced-motion the setup still runs, but exactly one
    // frame is rendered and the loop never starts: the artwork shows, and
    // nothing on the page moves. See the bottom of this function.
    if (getComputedStyle(layer).display === 'none') return;

    var gl = canvas.getContext('webgl', { antialias: true });
    if (!gl) return;

    var VERT =
      'attribute vec2 position;varying vec2 vUv;' +
      'void main(){vUv=position*0.5+0.5;gl_Position=vec4(position,0.0,1.0);}';

    var FRAG =
      // highp is not guaranteed in fragment shaders on mobile GLES2; without
      // this guard the shader fails to compile on many Android GPUs and the
      // hero silently stays flat.
      '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n' +
      'varying vec2 vUv;' +
      'uniform vec2 u_resolution;uniform float u_time;uniform float u_grain;uniform vec3 u_colors[3];' +
      'vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}' +
      'vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}' +
      'vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}' +
      'float snoise(vec2 v){' +
      'const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);' +
      'vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);' +
      'vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);' +
      'vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod289(i);' +
      'vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));' +
      'vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);' +
      'm=m*m;m=m*m;' +
      'vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;vec3 ox=floor(x+0.5);vec3 a0=x-ox;' +
      'm*=1.79284291400159-0.85373472095314*(a0*a0+h*h);' +
      'vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;' +
      'return 130.0*dot(m,g);}' +
      'void main(){' +
      'vec2 uv=vUv;float ratio=u_resolution.x/u_resolution.y;' +
      'vec2 p=uv*vec2(ratio,1.0);float t=u_time*0.2;' +
      'float n1=snoise(p*0.5+t);' +
      'float n2=snoise(p*0.9-t*0.5+n1);' +
      'float light=pow(abs(n2),2.5)*0.5;' +
      'vec3 col=vec3(0.02,0.01,0.01);' +
      'col+=u_colors[0]*smoothstep(0.1,1.0,n1)*0.5;' +
      'col+=u_colors[1]*light;' +
      'float grain=fract(sin(dot(uv,vec2(12.9898,78.233)))*43758.5453+u_time);' +
      'col+=(grain-0.5)*u_grain*0.5;' +
      'float dist=length(uv-0.5);' +
      'col*=smoothstep(1.2,0.2,dist);' +
      'gl_FragColor=vec4(col,1.0);}';

    function shader(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
      return s;
    }

    var vs = shader(gl.VERTEX_SHADER, VERT);
    var fs = shader(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var pos = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    var locRes = gl.getUniformLocation(program, 'u_resolution');
    var locTime = gl.getUniformLocation(program, 'u_time');
    var locGrain = gl.getUniformLocation(program, 'u_grain');
    var locColors = gl.getUniformLocation(program, 'u_colors');

    // Colours come from the live tokens so a rebrand re-tints the shader.
    // u_colors[0] is the broad wash, u_colors[1] the glow: the glow gets a
    // brightness lift because the shader halves it, and the deep brand
    // maroon would otherwise barely register over the dark field.
    function token(name) {
      var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      var h = v.replace('#', '');
      return [parseInt(h.slice(0, 2), 16) / 255,
              parseInt(h.slice(2, 4), 16) / 255,
              parseInt(h.slice(4, 6), 16) / 255];
    }

    function lift(rgb, k) {
      return [Math.min(1, rgb[0] * k), Math.min(1, rgb[1] * k), Math.min(1, rgb[2] * k)];
    }

    var accent = token('--accent');
    var hov = token('--accent-hov');
    var colors = new Float32Array([].concat(lift(accent, 1.6), lift(hov, 2.4), accent));

    var SPEED = 0.3;
    var GRAIN = 0.5;

    var sizedW = 0, sizedH = 0;

    function resize(force) {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var r = layer.getBoundingClientRect();
      var w = Math.max(1, Math.round(r.width * dpr));
      var h = Math.max(1, Math.round(r.height * dpr));
      // Mobile browsers collapse and expand the URL bar while scrolling,
      // which jiggles the layer height. Setting canvas.width/height WIPES
      // the canvas, and the repaint lands a frame later: that gap is a
      // black flicker on every scroll. So height-only wobble is absorbed
      // by CSS stretch (invisible on a noise field) and the buffer is only
      // reallocated for real changes.
      if (!force && w === sizedW && Math.abs(h - sizedH) < 180) return false;
      sizedW = w; sizedH = h;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      return true;
    }

    function draw(t) {
      gl.uniform2f(locRes, canvas.width, canvas.height);
      gl.uniform1f(locTime, t * 0.001 * SPEED);
      gl.uniform1f(locGrain, GRAIN);
      gl.uniform3fv(locColors, colors);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    var running = false, inView = true, raf = null, lost = false;

    canvas.addEventListener('webglcontextlost', function (e) {
      e.preventDefault();
      lost = true;   // static dark stage remains; no recovery attempt
    });

    function loop(now) {
      raf = null;
      if (!running || lost) return;
      draw(now);
      raf = window.requestAnimationFrame(loop);
    }

    function setRunning(on) {
      // reduce is a hard stop: the observers below still fire, but they can
      // never start the loop for a reduced-motion user.
      on = on && inView && !document.hidden && !lost && !reduce;
      if (on === running) return;
      running = on;
      if (running && !raf) raf = window.requestAnimationFrame(loop);
    }

    new IntersectionObserver(function (e) {
      inView = e[0].isIntersecting;
      setRunning(true);
    }).observe(layer);

    document.addEventListener('visibilitychange', function () { setRunning(true); });

    var resizeRaf = null;
    new ResizeObserver(function () {
      if (resizeRaf) return;
      resizeRaf = window.requestAnimationFrame(function () {
        resizeRaf = null;
        // A real reallocation wipes the canvas, so the redraw happens in the
        // SAME frame: no blank frame is ever presented.
        if (resize(false)) draw(reduce ? 40000 : performance.now());
      });
    }).observe(layer);

    resize(true);
    if (reduce) {
      // one still frame at a fixed time, chosen for a good composition
      draw(40000);
      return;
    }
    draw(performance.now());
    setRunning(true);
  }

  /* ------------------------------------------------------------------
   * 13. Odds and ends
   * ---------------------------------------------------------------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function boot() {
    initReveal();
    initProgress();
    initCounters();
    initMagnetic();
    initTilt();
    initFilters();
    initMarquee();
    initNav();
    initTabs();
    initAccordions();
    initForm();
    initMotionBg();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
