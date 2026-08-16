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
   * 12. Hero motion background: maroon flow lines
   * A field of slow sine currents drawn in the exact brand maroon, 2px
   * strokes to match the system's line weight. The CSS decides whether
   * the layer exists at all (fine-pointer desktop, motion allowed); this
   * only draws when the layer is displayed, and pauses whenever the hero
   * leaves the viewport or the tab is hidden. ~30fps, one 2d canvas.
   * ---------------------------------------------------------------- */
  function initMotionBg() {
    var layer = document.querySelector('.hero-motion');
    var canvas = layer && layer.querySelector('[data-waves]');
    if (!layer || !canvas) return;
    if (reduce) return;
    if (getComputedStyle(layer).display === 'none') return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var MAROON = '88, 11, 14';           // --accent as rgb components
    var LINES = 9;
    var w = 0, h = 0;

    function resize() {
      var r = layer.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      canvas.width = w;                   // dpr 1 on purpose: background wash
      canvas.height = h;
    }

    var t = 0;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 2;
      for (var i = 0; i < LINES; i++) {
        var base = h * (0.08 + (0.84 * i) / (LINES - 1));
        var amp1 = 26 + 14 * Math.sin(i * 1.7);
        var amp2 = 12 + 6 * Math.cos(i * 2.3);
        var alpha = 0.08 + 0.08 * ((i % 3) + 1) / 3;
        ctx.strokeStyle = 'rgba(' + MAROON + ',' + alpha.toFixed(3) + ')';
        ctx.beginPath();
        for (var x = -20; x <= w + 20; x += 14) {
          var y = base +
            amp1 * Math.sin(x * 0.0042 + t * 0.5 + i * 1.9) +
            amp2 * Math.sin(x * 0.011 - t * 0.32 + i * 0.7);
          if (x === -20) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

    var running = false, inView = true, raf = null, last = 0;
    var FRAME = 1000 / 30;

    function loop(now) {
      raf = null;
      if (!running) return;
      if (now - last >= FRAME) {
        last = now;
        t += 0.016;
        draw();
      }
      raf = window.requestAnimationFrame(loop);
    }

    function setRunning(on) {
      on = on && inView && !document.hidden;
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
    window.addEventListener('resize', function () {
      if (resizeRaf) return;
      resizeRaf = window.requestAnimationFrame(function () {
        resizeRaf = null;
        resize();
        draw();
      });
    });

    resize();
    draw();
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
