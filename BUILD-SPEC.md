# Mended Consulting - website build spec

Working directory: `C:\Users\tmayo\.claude\projects\CLIENT WORK\MENDED\site`

This is the single source of truth for the build. The design system, content and
constraints below are already decided. Build to them; do not re-litigate them.

---

## 1. The client

**Mended Consulting** is a business consultancy for the wellness industry. It helps
owner-operated fitness and wellness businesses run better across hiring, operations,
systems and sales.

Critical positioning facts, taken from the client proposal:

- This is **not** wellness coaching for consumers. The client is the **business owner**.
- The outcome sold is a healthier, more profitable, better-run operation.
- Avoid the phrase "wellness consultant" as a primary term. In search it collides with
  HR consultancies selling employee-wellbeing programs to mining and enterprise. Mended
  must not rank for that. Use **"wellness business consulting"**, "business consultant
  for gyms and studios", "fitness business consulting" instead.
- Markets: **Australia, Bali, Singapore**. These are where boutique wellness operators
  cluster and where Australian operators most often expand.
- Competitive gap: most competitors lead with either marketing/leads or gym-specific
  operations. Mended's opening is **operator-to-operator, whole-of-business**, across the
  full breadth of wellness verticals and across the AU/Bali/Singapore corridor.
- The website must make that distinction obvious **above the fold**.

### Who the site speaks to

The owner or operator of a boutique, physical-location wellness or fitness business who
is strong on the wellness side but needs help running the business.

- **Fitness** - gyms, functional-fitness gyms, CrossFit boxes
- **Studios** - pilates and reformer, yoga and barre, spin and cycle, dance-fitness
- **Recovery** - recovery centres, cryotherapy, sauna and ice bath, float tanks,
  IV therapy (note: outside WA)
- **Retreats and groups** - health retreats, wellness resorts, multi-site and franchise
  operators. This is the Bali market in particular.

### Service pillars (exactly four, framed as business outcomes)

1. **Hiring and team** - finding, onboarding and keeping good people; getting the owner
   out of every shift.
2. **Operations and systems** - the processes, tooling and rhythm that let the business
   run without the owner in the room.
3. **Sales and revenue** - memberships, packages, pricing and retention. Revenue from
   the members you already have, not just new leads.
4. **Reset and crisis turnaround** - the business is losing money, leaking members, or
   the owner is at the end of it. Stabilise first, rebuild second.

---

## 2. Design read and dials

**Reading this as:** a B2B consultancy marketing site for owner-operators of boutique
wellness businesses, with a dark editorial / operator-credible language, leaning toward
Tailwind utilities + Bricolage Grotesque + Geist + restrained scroll-reveal motion.

- `DESIGN_VARIANCE: 7`
- `MOTION_INTENSITY: 5`
- `VISUAL_DENSITY: 4`

The buyer is a business owner who is sceptical, time-poor and has been sold to before.
Credibility beats spectacle. No scroll hijacking, no cursor tricks, no auto-playing
anything.

---

## 3. Design system - already built, do not rewrite

Three files exist and are the contract:

- `assets/css/site.css` - brand tokens, type scale, all components
- `assets/js/tailwind.config.js` - Tailwind CDN config mapping the same tokens
- `assets/js/site.js` - header, reveal, nav, tabs, accordions, form, icons

**Division of labour, follow it strictly:**

- Tailwind utility classes -> **layout only** (grid, flex, gap, spacing, sizing, order,
  responsive breakpoints)
- `site.css` classes -> **all** brand surface, type, colour and component styling

Never hardcode a hex value in markup. Never invent a new colour.

### Locked decisions

**Theme lock.** Dark only, every page, top to bottom. No section inverts to a light
background. `color-scheme: dark` is set.

**Colour lock.** One accent: eucalyptus `--accent #4fa37f` / `--accent-bright #74c9a2`.
It is used for links, active states, small marks and the emphasised word in a headline.
It is never joined by a second accent. Primary CTAs are bone-on-ink, not accent.

**Shape lock.** Cards and panels `16px`. Inputs `12px`. Buttons full pill. No exceptions.

**Type.**
- Display: **Bricolage Grotesque** via `.font-display` + `.h-display` / `.h-section` / `.h-card`
- Body: **Geist**
- Small labels and figures: **Geist Mono** via `.font-mono-label`
- Emphasis inside a headline is done with `.accent-word` (colour). **Never** by dropping a
  serif word into a sans headline. That mixed-family move is banned.

### Available classes

Layout `.shell` `.section` `.section--flush` `.hairline`
Surfaces `.panel` `.panel-2` `.panel-accent` `.photo` `.photo--hover` `.card-lift`
Type `.font-display` `.h-display` `.h-section` `.h-card` `.lede` `.body-copy`
      `.accent-word` `.font-mono-label` `.stat-num`
Buttons `.btn` + `.btn-primary` / `.btn-ghost` / `.btn-accent`, sizes `.btn-sm` `.btn-lg`
Links `.link-quiet`
Nav `.site-header` `.header-inner` `.wordmark` `.nav-desktop` `.nav-link` `.nav-toggle`
     `.nav-mobile` `.nav-mobile-link`
Motion `.reveal` (add inline `style="--reveal-delay:120ms"` to stagger)
Rail `.rail` `.rail-item`
Tabs `.tab-btn` inside `[data-tabs]`
Accordion `.acc` `.acc-icon` `.acc-body` inside `[data-accordion]`
Forms `.field` `.field-label` `.field-hint` `.field-req` `.input` `.select` `.textarea`
       `.field-error` `.check` `.form-status` `.spinner`
Misc `.pill` `.pill-accent` `.step-marker` `.footer-head` `.footer-link` `.skip-link`
      `.tofill` (marks placeholder content, keep it on anything awaiting client input)

---

## 4. Required page head

Every page uses exactly this head order:

```html
<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>…</title>
<meta name="description" content="…">
<link rel="canonical" href="https://mendedconsulting.com.au/…">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Mended Consulting">
<meta property="og:title" content="…">
<meta property="og:description" content="…">
<meta property="og:url" content="https://mendedconsulting.com.au/…">
<meta property="og:image" content="https://mendedconsulting.com.au/assets/img/og-default.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Geist:wght@300..600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script src="assets/js/tailwind.config.js"></script>
<link rel="stylesheet" href="assets/css/site.css">
<script src="https://unpkg.com/lucide@latest"></script>
<script defer src="assets/js/site.js"></script>
<script type="application/ld+json">…</script>
</head>
```

`assets/img/og-default.jpg` does not exist yet. Reference it anyway and it goes on the
handover list.

---

## 5. Shared header and footer

Identical on every page. Copy them verbatim between pages, changing only which nav link
carries `aria-current="page"`.

**Header** - fixed, 72px, single line at desktop.

Wordmark: the word `Mended` set in Bricolage 700, preceded by a small mark: two short
strokes meeting at an offset seam, referencing a repair. Keep it to a single simple
geometric SVG, roughly 22x22, `stroke="currentColor"`, `stroke-width="1.6"`. Nothing
ornate.

Desktop nav, in this order, one line:
`Services` `Approach` `Results` `About` `Contact`, then the CTA button
`Book a call` (`.btn .btn-primary .btn-sm`).

Mobile: `.nav-toggle` labelled "Menu" opens `.nav-mobile`.

**Footer** - four columns at desktop, stacked on mobile.
1. Wordmark + one line on what Mended does + the three markets
2. `Services` column linking to the four pillar anchors on services.html
3. `Company` column: About, Results, Contact, Privacy
4. `Markets` column linking to the three localised pages

Bottom bar: `© <span data-year></span> Mended Consulting.` plus an ABN placeholder
carrying `.tofill`.

---

## 6. Copy rules

Australian English throughout: organisation, optimise, specialise, centre, programme
avoided in favour of "program", "enrol".

Voice: direct, plain, operator-to-operator. Short sentences. No consultant-speak.

**Banned words:** elevate, seamless, unleash, next-gen, revolutionise, empower, journey,
holistic, synergy, bespoke, cutting-edge, game-changer, transform (as filler).

**Banned punctuation: the em dash and the en dash. Zero on the page.** Not in headlines,
eyebrows, buttons, body copy, quotes, attribution, captions or alt text. Use a full stop,
a comma, a colon, brackets, or a plain hyphen.

**No fabricated evidence.** This is a real client's real website. Do not invent:
- client names, business names, testimonials or quotes
- logos for a "trusted by" wall
- statistics, percentages, revenue figures, client counts, years in business

Where the client must supply something, write the real markup and put the placeholder in
`.tofill` with a square-bracket token, for example
`<p class="tofill">[Client quote, 2 to 3 lines maximum]</p>`, and add an HTML comment
directly above saying exactly what is needed.

Numbers that are structural facts are fine because they are true by construction: four
service pillars, three markets, the named verticals.

---

## 7. Images

No image generation tool is available. Use `https://picsum.photos/seed/{seed}/{w}/{h}`
with descriptive seeds, always inside `.photo` so the grayscale + eucalyptus tint
treatment makes photos from different sources read as one system.

Example: `<img src="https://picsum.photos/seed/mended-reformer-studio/1200/900" alt="…" width="1200" height="900" loading="lazy">`

- Always set `width` and `height` (CLS).
- The hero image is the LCP element: `loading="eager"` and `fetchpriority="high"`.
- Alt text describes the subject in plain language. Never stuff keywords.
- Above every picsum image add `<!-- TODO replace: [what the photo should show] -->`.
- No pills, tags or credit captions overlaid on photos.
- No `<div>`-built fake dashboards, fake apps or fake screenshots anywhere.

---

## 8. Anti-slop rules (hard fails)

These are the patterns that make a page read as machine-made. Any one of them fails
the build.

- Zero em dashes or en dashes anywhere visible.
- **Eyebrow budget.** An eyebrow is a small uppercase wide-tracking label above a section
  headline. Maximum **one per three sections**. A nine-section page gets at most three.
  Prefer zero. The headline alone is enough.
- No section-number eyebrows (`01 / SERVICES`, `002 · Approach`).
- No "Stage 1 / Step 2 / Phase 03" step labels. Name the step by its verb.
- No scroll cues (`Scroll`, `↓ Scroll to explore`, animated mouse icons).
- No decorative status dots before nav items, list rows or badges.
- No version or build stamps (`v1.4`, `Build 0048`).
- No locale, time or weather strips (`Sydney 14:23 · 22°C`).
- No decorative text strip under the hero (`HIRE. SYSTEMISE. SELL.`).
- No middle dot `·` used as the default separator for everything. One per line maximum.
- No split-header pattern: big headline left, small floating explainer paragraph right.
  Stack headline then body vertically, max 65ch.
- No three equal feature cards in a row. Vary the cell sizes.
- Maximum two consecutive sections using an image-left/text-right split. The third
  consecutive one is a fail. Break the pattern.
- No two sections on the same page may share a layout family. A nine-section page needs
  at least five distinct families.
- Bento grids have exactly as many cells as there is content for. No empty tiles.
- At least two cells in any multi-cell grid carry real visual variation (a photo, the
  `.panel-accent` gradient), not six identical text cards.
- Lists over five items do not ship as a bulleted `<ul>` with a hairline under every row.
  Use the rail, tabs, an accordion or a grouped grid.
- CTA labels never wrap at desktop. Three words maximum.
- **One label per intent, sitewide.** Contact intent is always **"Book a call"**. Never
  also "Get in touch", "Let's talk", "Start a project" or "Enquire now" on the same site.
  Results intent is always **"See the results"**. Services intent is **"See the services"**.
- Quotes are three lines maximum, attribution is name + role + business, never name only.

---

## 9. Accessibility and performance

- One `<h1>` per page. Headings descend in order, never skip a level.
- Every page opens with `<a class="skip-link" href="#main">Skip to content</a>` and the
  main region is `<main id="main">`.
- All interactive controls reachable and visible on keyboard. Focus styles are already
  in `site.css`, do not override them.
- Tabs use `role="tablist"` / `role="tab"` / `role="tabpanel"` with `aria-controls` and
  `aria-selected`. `site.js` wires the behaviour including arrow keys.
- Accordions are native `<details>` inside `[data-accordion]`.
- Icons are Lucide via `data-lucide="name"` on an `<i>`. Decorative icons get
  `aria-hidden="true"`. Never hand-roll an SVG icon path. The only bespoke SVG on the
  site is the wordmark mark.
- Hero must fit the initial viewport: headline two lines maximum at desktop, subtext
  20 words maximum, CTAs visible without scrolling. Hero top padding no more than the
  header offset plus `pt-24`.
- Hero carries at most four text elements. No trust strip, no tagline under the CTAs,
  no pricing teaser inside the hero.
- Use `min-h-[100dvh]` never `h-screen`.
- Every multi-column layout declares its single-column fallback under `md:`.

---

## 10. Pages to build

Flat file structure in `site/`. All asset paths are relative (`assets/…`) so the site
opens correctly from the file system and from any host.

### 10.1 `index.html` - Home

Nine sections. Each must use a different layout family. Suggested composition:

1. **Hero** - asymmetric split, copy left, photo right.
   - H1: `You built the studio. Now build the business.` (emphasise "business" with
     `.accent-word`)
   - Sub: `Mended is a business consultancy for owner-operated wellness and fitness
     businesses across Australia, Bali and Singapore.`
   - CTAs: `Book a call` (primary) + `See the services` (ghost)
2. **Who this is for** - the `.rail` horizontal scroll-snap, four cards: Fitness,
   Studios, Recovery, Retreats and multi-site. Each lists its verticals as plain text,
   not bullets.
3. **The four pillars** - asymmetric bento, exactly four cells of mixed size. At least
   two cells carry a photo or `.panel-accent`.
4. **The difference** - full-width statement plus a two-column support block that names
   the gap honestly: most consultants in this space sell either marketing and leads, or
   gym-specific operations. Mended works on the whole business, and has run one.
5. **How it works** - three steps in a sticky left column plus scrolling right content.
   Steps are named by verb: `Diagnose`, `Rebuild`, `Hand over`. Never "Step 1".
6. **Markets** - three tabs (Australia / Bali / Singapore) with market-specific content:
   - Australia: a saturated boutique-fitness market on the East Coast, competing on
     price, thin margins, owner working in the business
   - Bali: retreat and expat operator scene, seasonal demand, staffing and management
     at distance, multi-site and franchise ambitions
   - Singapore: the regulatory and leasing environment, high fixed costs, premium
     positioning required to survive rent
   Each tab ends with a link to that localised landing page.
7. **Client results** - single large quote slot, `.tofill` placeholder, plus a link to
   `results.html`.
8. **FAQ** - `<details>` accordion. Write these genuinely, they carry the AEO layer:
   - What does a wellness business consultant do?
   - How is this different from a gym marketing agency?
   - What size business does Mended work with?
   - Do you work with businesses outside Australia?
   - What does an engagement look like and how long does it run?
   - What does it cost?  (answer honestly: scoped per engagement after the first call,
     no invented figures)
9. **Closing CTA** - centred band, single primary CTA `Book a call`.

JSON-LD: `ProfessionalService` (name, description, areaServed AU/ID/SG, serviceType,
url, sameAs placeholder array) plus `FAQPage` matching section 8 verbatim, plus
`WebSite`.

### 10.2 `services.html`

H1 around the outcome, not the word "services". Four deep sections, one per pillar, each
with an `id` matching the footer anchors: `#hiring`, `#operations`, `#sales`, `#reset`.

Per pillar: what the owner is actually experiencing, what Mended does, what changes.
Vary the layout between pillars so it does not become four identical blocks and does not
become a four-times zigzag. Close with the engagement shapes and a `Book a call` CTA.

JSON-LD: `Service` entries plus `BreadcrumbList`.

### 10.3 `about.html`

Founder story, credibility, the operator-to-operator point of difference.

**The founder's name, background and history are not in the brief.** Build the full page
and mark every unknown with `.tofill` and a bracket token, with an HTML comment above
each block stating exactly what is needed. Do not invent a name, a gym, a city or a
number of years.

Sections: opening statement, the founder block (photo + story, `.tofill`), why
operator-to-operator matters, what Mended believes (three or four short principles),
CTA.

JSON-LD: `AboutPage` + `Person` with `.tofill`-equivalent empty values commented.

### 10.4 `results.html` - case studies index

The client has no published case studies yet. Do not fake any.

- Short honest intro on how Mended measures a result.
- A grid of three placeholder cards using the real card markup, every content slot a
  bracket token inside `.tofill`, each linking to `case-study-template.html`.
- An empty-state note explaining results are published as clients clear them for
  release, with a `Book a call` CTA.

JSON-LD: `CollectionPage` + `BreadcrumbList`.

### 10.5 `case-study-template.html`

The duplicate-me page. Fully designed, entirely placeholder. At the very top of `<body>`
put an HTML comment block explaining: duplicate the file, rename it to the client slug,
replace every `[bracket token]`, remove every `tofill` class, update the head tags and
add the URL to `sitemap.xml`.

Structure: client and vertical, the situation, what was done across the pillars that
applied, what changed, a pull quote slot, and a `Book a call` CTA.

JSON-LD: `Article` with placeholder values, commented.

### 10.6 `contact.html`

H1 plus a short line setting the expectation of what happens after they send it.

Form `[data-enquiry-form]` with
`data-endpoint="https://formspree.io/f/YOUR_FORM_ID"` and
`data-redirect="thank-you.html"`. `site.js` already handles validation and states, so
just supply correct markup. Every field needs a `<label class="field-label">` **above**
the control (never a placeholder as label) and an empty `<p class="field-error">`.

Fields, in this order:
- Your name (required)
- Email (required, `type="email"`)
- Phone (optional, `type="tel"`)
- Business name (required)
- Website or Instagram (optional)
- Business type (required select): Gym or functional fitness, CrossFit box, Pilates or
  reformer studio, Yoga or barre studio, Spin or cycle studio, Dance fitness, Recovery
  centre, Sauna and ice bath, Float, IV therapy, Health retreat or wellness resort,
  Multi-site or franchise, Something else
- Where are you based (required select): grouped by Australia (the states and
  territories), then Bali or wider Indonesia, Singapore, Somewhere else
- Number of locations (required select): 1, 2 to 3, 4 to 9, 10 or more
- Team size (required select): Just me, 2 to 5, 6 to 15, 16 to 40, 40 or more
- Monthly revenue (optional select, hint that it helps scope the first call): Under
  $20k, $20k to $50k, $50k to $100k, $100k to $250k, Over $250k, Rather not say
- What needs fixing first (required select): Hiring and team, Operations and systems,
  Sales and revenue, Reset or turnaround, Not sure yet
- When do you want to start (required select): Now, Within a month, Within three months,
  Just researching
- Tell us what is going on (required textarea)
- Consent checkbox (required)

Include `<div class="form-status" data-form-status></div>` and a submit button
containing `<span class="spinner" aria-hidden="true"></span><span data-submit-label>Send enquiry</span>`
with `data-submit`.

Beside the form, a short panel on what happens next and the direct email
`hello@mendedconsulting.com.au` marked `.tofill` since the real address is unconfirmed.

JSON-LD: `ContactPage`.

### 10.7 `thank-you.html`

Short confirmation, what happens next, links back into Services and Results.
`<meta name="robots" content="noindex">`.

### 10.8 Localised landing pages

Three files, built from one template, genuinely differentiated content:

- `wellness-business-consulting-australia.html`
- `wellness-business-consulting-bali.html`
- `wellness-business-consulting-singapore.html`

Each: locally-worded H1, the market-specific pain points from section 10.1 item 6 written
out properly, which verticals dominate that market, how Mended works there, a
market-specific FAQ block of three questions, a `.tofill` case study slot, and a
`Book a call` CTA.

Each carries `ProfessionalService` JSON-LD with the correct `areaServed`, plus its own
`FAQPage` matching its visible questions, plus `BreadcrumbList`.

These are campaign destinations, so keep them tighter than the home page: six sections
maximum, CTA visible early.

### 10.9 `privacy.html` and `404.html`

Privacy: a real, plainly written policy covering what the enquiry form collects, why,
where it goes, retention, and contact for removal. Mark the ABN, the business address
and the contact address `.tofill`. `noindex` is not needed.

404: short, on-voice, links to Services, Results and Contact. `noindex`.

### 10.10 `robots.txt` and `sitemap.xml`

Robots allows everything, points at the sitemap. Sitemap lists every indexable page
(exclude thank-you, 404, and the case study template) at
`https://mendedconsulting.com.au/…` with `lastmod` of `2026-08-15`.

---

## 11. Before you finish

Re-read every visible string on every page and confirm:

- Zero em dashes and en dashes.
- No invented client name, quote, logo or statistic anywhere.
- Every `.tofill` block has an HTML comment above it saying what is needed.
- CTA labels are consistent sitewide and none wraps at desktop.
- Eyebrow count per page is at most one per three sections.
- Every internal link resolves to a file that exists in `site/`.
- Every page has exactly one `<h1>`, a canonical, a description, and valid JSON-LD.
- Nav renders on one line at 1024px.
- Every image has width, height and real alt text.
