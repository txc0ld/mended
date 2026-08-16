# Mended Consulting - art direction, v2 "The Seam"

This supersedes the layout guidance in `BUILD-SPEC.md`. The client facts, copy rules,
banned words, dash ban and no-invented-evidence rules in `BUILD-SPEC.md` all still apply.

---

## 1. Why v1 failed

Version one was a stack of rounded-rectangle cards on a dark background. Every section
was: left-aligned headline at the same size, a lede, then a grid of bordered boxes,
separated by a hairline. Photographs sat inside those boxes. Nothing carried the eye from
one section to the next.

That is the generic template signature. The fix is not more rules against clichés. The
fix is actual composition.

**The single most important instruction in this document: almost nothing on this page is
a card.** If you find yourself writing a bordered, rounded container with a heading and a
paragraph inside it, stop and rebuild that block out of type, rules, measure and space.

---

## 2. The concept

Mended repairs businesses. The page enacts that.

It **opens in the dark** (the business under pressure), and **resolves into paper** (the
business working). The join between them is **the seam**, and it is the only ornament the
site is allowed. In kintsugi a repair is not hidden, it becomes the most considered part
of the object. That is the whole idea.

So the page has exactly **two acts, plus a bookend**:

```
  ACT ONE    ink      the hero. one screen. cinematic.
  ~~~~~~~~   seam     the tear, with a thread of light along it
  ACT TWO    paper    the entire body of the page
  ~~~~~~~~   seam-up  a straight return
  FOOTER     ink
```

There is no third act. Do not flip a middle section back to dark for emphasis.

---

## 3. The system you must build on

`assets/css/site.css` is already written and is the contract. Read it fully first.

Every section declares its act, and components read semantic tokens, so the same markup
works in either:

```html
<section class="act act--dark pad"> ... </section>
<section class="act act--light pad"> ... </section>
```

**Required in `<head>`, before the stylesheet.** The reveal classes hide content until
observed, so this guard makes the page render fully if JavaScript fails:

```html
<script>document.documentElement.classList.add('js')</script>
```

### Type scale

| Class | Use |
|---|---|
| `.display .t-hero` | the hero headline only, once per site |
| `.display .t-lead` | section openers |
| `.display .t-row` | index rows, article titles |
| `.display .t-sub` | sub-headings inside a block |
| `.lede` | short intro, 46ch, sits under a lead |
| `.copy` | body, 58ch |
| `.label` | small mono caps. **Maximum two on the page. Zero is better.** |
| `.numeral` | 01, 02. Real enumeration only |
| `.pullquote` `.stat` | as named |

Emphasis inside a headline is `.em` (colour) or `.em-hollow` (outline). **Never a second
font family.** `.em-hollow` is used exactly once on the site, in the hero.

### Layout

`.shell` container. `.pad` `.pad-lg` `.pad-sm` for vertical rhythm.
`.offset-2` and `.offset-3` push a block right by 1/6 and 1/3 at 900px and up. **Use
them.** Not every block starts at the same left edge. That is what makes a page feel
composed rather than stacked.

`.bleed` `.bleed-l` `.bleed-r` break the container to the viewport edge.
`.rule` is a hairline that draws itself in.

### Motion

`.rise` for blocks (stagger with `style="--d:120ms"`).
`.unmask` wraps a headline; each line is a `<span>` inside it that slides up from a mask:

```html
<h1 class="display t-hero">
  <span class="unmask"><span>You built the studio.</span></span>
  <span class="unmask" style="--d:110ms"><span>Now build the business.</span></span>
</h1>
```

`.fig` on any image wrapper gives the duotone treatment and a settle-in scale.

---

## 4. Build this composition, section by section

Eleven blocks. Every one has a different structure. Follow these.

### 1. Hero. `act--dark`, `min-h-[100dvh]`

Full-bleed photograph behind everything, heavily darkened by the `.act--dark .fig`
duotone. Content anchored **low and left**, like a film title card, not centred and not
vertically centred. There is a large area of quiet image above the type. That silence is
the point.

- H1 `.display .t-hero`, two `.unmask` lines: `You built the studio.` /
  `Now build the business.`
- Set the word `studio.` in `.em-hollow` so it reads as the thing that already exists,
  and `business.` in `.em` so it reads as the thing to be made. That is the argument of
  the page in one line.
- `.lede` beneath, then two CTAs: `Book a call` (`.btn .btn-fill`) and
  `See the services` (`.btn .btn-line`).
- Nothing else. No eyebrow. No scroll cue. No trust strip. No stats.

### 2. The seam

```html
<div class="seam" aria-hidden="true"></div>
```

Nothing else in this block.

### 3. Opening statement. `act--light`, `pad-lg`

Type only. No image, no columns, no boxes. One `.rule` across the top, then a single
`.display .t-lead` statement in `.offset-2`, roughly 18 to 26 words, making the
operator-to-operator claim. Then a lot of space.

This is the breath after the hero. Resist adding anything to it.

### 4. Who this is for. `act--light`

Two columns at 900px and up, **collapsing to one below**.

- Left: a tall `.fig` using `bleed-l` so it runs off the left edge of the viewport.
- Right: the four sector groups as plain type. Each is a `.t-sub` name with a `.copy`
  line of the verticals under it, separated by `.rule`, not boxed.

Groups: Fitness, Studios, Recovery, Retreats and multi-site. Content per
`BUILD-SPEC.md` section 1.

### 5. The index. `act--light`, `pad-lg`

**The centrepiece.** The four service pillars as editorial rows, not cards.

```html
<div class="index" data-index>
  <div class="index-media" data-index-media> <img …> </div>   <!-- one per row -->
  …
  <a class="index-row" data-index-row href="services.html#hiring">
    <span class="numeral">01</span>
    <h3 class="display t-row">Hiring and team</h3>
    <p class="copy">…</p>
    <span class="index-arrow" aria-hidden="true"><i data-lucide="arrow-up-right"></i></span>
  </a>
  …
</div>
```

The CSS already handles the rule wipe, the row shift and the image cross-fade on hover.
Give each row a distinct backing image. Rows link to the matching `services.html` anchor.

A short `.t-lead` above the list. No lede paragraph, the rows carry it.

### 6. The difference. `act--light`

The honest competitive point. Two blocks separated by a `.rule`, set as type on rules,
**not two cards**:

- A `.t-lead` statement across the top.
- Then `What most consultants sell` and `What Mended does`, each a `.t-sub` with a
  `.copy` under it, in a two-column grid with a vertical `.rule` between them at desktop.

### 7. How it works. `act--light`, `pad-lg`

A horizontal band of three entries divided by **vertical rules**, collapsing to stacked
rows with horizontal rules below 900px.

Steps are named by verb only: `Diagnose`, `Rebuild`, `Hand over`. Each is a `.t-sub` and
a `.copy`. **No step numbers here**, the index already uses numerals and repeating them
makes the page feel templated.

### 8. Markets. `act--light`

Three tabs, `Australia` / `Bali` / `Singapore`, using `.tab-btn` and the
`[data-tabs]` / `role="tab"` / `role="tabpanel"` contract that `site.js` wires up.

Each panel is **not a bordered card**. It is: the market name at `.t-lead` scale, a
`.copy` on the operating pressure specific to that market, and a `.link` to the localised
page. Market content per `BUILD-SPEC.md` section 10.1 item 6.

### 9. Client result. `act--light`, `pad-lg`

A `.rule`, then a `.pullquote` at large scale in `.offset-2`, then the attribution, then
a `.rule`. Enormous space around it.

The client has no approved testimonial. Use `.tofill` with bracket tokens and a `TODO`
comment above, exactly as in v1. Do not invent a quote.

### 10. FAQ. `act--light`

Two columns at 900px: a sticky `.t-lead` on the left, the `<details>` accordion on the
right. Six questions, verbatim from v1 `index.html` including the answers, so the
`FAQPage` JSON-LD stays accurate.

### 11. Close, then the bookend. `act--light` then `act--dark`

A centred `.t-lead` statement and a single `Book a call` CTA. Then:

```html
<div class="seam seam--up" aria-hidden="true"></div>
<footer class="site-footer act act--dark"> … </footer>
```

The footer keeps v1's four-column structure and links.

---

## 5. Header

`.site-header` is fixed and inverts from bone to graphite as the page crosses the seam.
`site.js` sets `data-over` by observing `.act` sections, so **every full-width band on the
page must carry the `act` class** or the header will not know what it is sitting over.

Nav order stays: Services, Approach, Results, About, Contact, then `.nav-cta`
`Book a call`. One line at desktop, 76px tall.

---

## 6. Checks before you stop

- Count your bordered containers. If the answer is more than two on the whole page, you
  have built cards again. Rebuild them as type on rules.
- Count distinct section structures. Eleven blocks must produce at least eight genuinely
  different structures.
- At least three blocks must use `.offset-2` or `.offset-3`. Not everything is flush left.
- At least two images must `bleed`.
- `.label` appears at most twice. `.em-hollow` appears exactly once.
- Zero em dashes and zero en dashes, including in comments, alt text and JSON-LD.
- No invented client name, quote, logo, statistic or founder detail.
- One `<h1>`. Headings descend in order. Canonical, description, OG tags and the JSON-LD
  graph from v1 `index.html` all carried over.
- The page must render fully with JavaScript disabled.
