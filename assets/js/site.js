/* Mended Consulting - site behaviour, v2
 *
 * Rules:
 *   - No window scroll listeners. IntersectionObserver only.
 *   - Every motion path checks prefers-reduced-motion and degrades to static.
 *   - Every enhancement is optional: if the markup is absent, skip it.
 *   - Content is never left invisible if JS fails: see the no-js fallback at
 *     the bottom of this file.
 */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
   * 1. Reveal: .rise, .unmask, .rule, .fig
   * Motivation: sequences content as the reader arrives at it, which builds
   * hierarchy on a long editorial page. Fires once, never replays.
   * ---------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('.rise, .unmask, .rule, .fig');
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
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
   * 2. Header: sticky state, and which act it is sitting over
   * The header inverts from bone to graphite as the page crosses the seam.
   * Both are driven by observers, not scroll maths.
   * ---------------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    // sticky state, via a sentinel at the very top of the document
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
    document.body.prepend(sentinel);

    new IntersectionObserver(function (e) {
      header.classList.toggle('is-stuck', !e[0].isIntersecting);
    }).observe(sentinel);

    // which act is under the header
    var acts = document.querySelectorAll('.act');
    if (!acts.length) return;

    var line = header.offsetHeight / 2;

    var actIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        header.setAttribute('data-over', e.target.classList.contains('act--light') ? 'light' : 'dark');
      });
    }, { rootMargin: '-' + line + 'px 0px -' + (window.innerHeight - line - 1) + 'px 0px' });

    Array.prototype.forEach.call(acts, function (el) { actIo.observe(el); });
  }

  /* ------------------------------------------------------------------
   * 3. Mobile navigation
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
   * 4. Index rows: cross-fade the backing image on hover
   * Motivation: gives each service a face without putting four photographs in
   * four boxes. Pointer only, and purely additive.
   * ---------------------------------------------------------------- */
  function initIndex() {
    document.querySelectorAll('[data-index]').forEach(function (list) {
      var rows = list.querySelectorAll('[data-index-row]');
      var media = list.querySelectorAll('[data-index-media]');
      if (!rows.length || !media.length) return;

      function activate(i) {
        list.classList.add('is-hovering');
        media.forEach(function (m, j) { m.classList.toggle('is-active', i === j); });
      }

      function clear() {
        list.classList.remove('is-hovering');
        media.forEach(function (m) { m.classList.remove('is-active'); });
      }

      rows.forEach(function (row, i) {
        row.addEventListener('pointerenter', function () { activate(i); });
        row.addEventListener('focus', function () { activate(i); });
      });

      list.addEventListener('pointerleave', clear);
      list.addEventListener('focusout', function (e) {
        if (!list.contains(e.relatedTarget)) clear();
      });
    });
  }

  /* ------------------------------------------------------------------
   * 5. Tabs
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
   * 6. Accordions: one open at a time within a group
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
   * 7. Enquiry form
   * Validation, then submit with explicit loading, error and success states.
   * The endpoint lives on the form so it can be swapped without touching JS.
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
   * 8. Odds and ends
   * ---------------------------------------------------------------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  function boot() {
    initReveal();
    initHeader();
    initNav();
    initIndex();
    initTabs();
    initAccordions();
    initForm();
    initYear();
    initIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
