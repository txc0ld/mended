# Mended Consulting - website

Static HTML site. No WordPress, no build step, no database. Open `index.html` in a
browser and it runs.

---

## What is here

| File | Purpose |
|---|---|
| `index.html` | Home |
| `services.html` | The four service pillars, anchors `#hiring` `#operations` `#sales` `#reset` |
| `about.html` | Founder story and the operator-to-operator point of difference |
| `results.html` | Case study index |
| `case-study-template.html` | Duplicate this to publish a new case study |
| `contact.html` | Enquiry form with qualification fields |
| `thank-you.html` | Form success page, noindex |
| `wellness-business-consulting-australia.html` | Localised landing page |
| `wellness-business-consulting-bali.html` | Localised landing page |
| `wellness-business-consulting-singapore.html` | Localised landing page |
| `privacy.html` | Privacy policy |
| `404.html` | Not found, noindex |
| `robots.txt` / `sitemap.xml` | Crawl and indexing |
| `assets/css/site.css` | All brand styling. The one file to edit for a rebrand. |
| `assets/js/site.js` | Header, scroll reveal, nav, index rows, tabs, accordions, form |
| `assets/js/tailwind.config.js` | Tailwind CDN token config |
| `ART-DIRECTION.md` | **The design direction.** Read this before changing any layout. |
| `BUILD-SPEC.md` | Client facts, copy rules, page-by-page content spec. |
| `_v1/` | The first design, superseded. Kept for reference. Not linked, not indexed. Safe to delete. |

---

## The design in one page

The site is built on **TIDE**, a neo-brutalist system. Paper cream background, hot pink
and caution yellow, 2px black borders on everything, hard offset shadows instead of blurs,
and a lot of motion. The reference point is Gumroad and retail signage rather than
software.

The look is deliberately loud. **The copy is not.** Mended sells to a gym or studio owner
making a business decision, and the client proposal is explicit that this is not consumer
wellness, so the writing stays plain and operator to operator while the design does the
personality.

### The five rules

1. Every container gets a **2px solid black border**.
2. Depth is a **hard offset shadow**, `4px 4px 0 #000`. Never a blur.
3. Backgrounds are **flat**: cream, pink, yellow or black. **No gradients anywhere.**
4. Technical labels are **uppercase mono**, `0.1em` tracking. Use `.mono`.
5. **Pink is a fill, never text on cream.** `#ff90e8` on `#f4f4f0` is 1.8:1 and fails
   WCAG badly. Links are `.link`, black text with a pink underline. To emphasise a word in
   a headline use `.mark`, which sets it on a pink block. Pink text on the black
   `.band-ink` is fine and is used there for `.mono` labels.

### The moving parts

`site.js` supplies all of these, you only write the markup:

| Hook | What it does |
|---|---|
| `[data-progress]` | fixed pink scroll progress bar |
| `[data-target]` | counters that tick up when scrolled into view |
| `.stat-bar` | the bar that grows under each counter |
| `.marquee-track` | pink running band, cloned in JS for a seamless loop |
| `.module` | grid cell with a black sweep on hover |
| `.pipeline-signal` | dot tracing the process rail |
| `[data-gallery]` `[data-filter]` `[data-cat]` | filterable vertical gallery |
| `.magnetic` | button pulls toward the cursor |
| `data-tilt` | card tilts toward the cursor |
| `.reveal` | scroll reveal, stagger with `style="--d:120ms"` |

Pointer effects are gated behind `(hover: hover) and (pointer: fine)` so they never fire
on touch, and every animation is disabled under `prefers-reduced-motion`.

The full rules and the page-by-page composition are in `ART-DIRECTION.md`.

---

## Before this goes live

These are the blockers. Everything marked `.tofill` in the HTML shows as a dimmed block
with a left border in the browser, so nothing placeholder can ship by accident. Search
the folder for `tofill` and for `TODO` to find every one.

### 1. Set the real domain

Every page has a canonical and Open Graph URL pointing at `https://mendedconsulting.com.au/`.
If the real domain differs, find and replace across all HTML files plus `sitemap.xml`
and `robots.txt`.

### 2. Connect the enquiry form

`contact.html` carries:

```html
<form data-enquiry-form data-endpoint="https://formspree.io/f/YOUR_FORM_ID" data-redirect="thank-you.html">
```

Replace `YOUR_FORM_ID` with a real endpoint. Until you do, the form refuses to submit and
tells the visitor to email instead, rather than silently swallowing an enquiry.

Any endpoint that accepts a `POST` of `FormData` and returns 2xx will work: Formspree,
Basin, Netlify Forms, Web3Forms, or your own handler. Notification routing is configured
at the provider, not in this code.

### 3. Confirm the contact email

`hello@mendedconsulting.com.au` is used as a placeholder in `site.js`, `contact.html`
and `privacy.html`. Confirm or change it in all three.

### 4. Supply the content the client owns

- **Founder details** on `about.html`: name, background, the operating history behind the
  operator-to-operator claim, years in the industry, and a portrait.
- **Testimonial** on `index.html`: an approved quote, plus name, role and business.
- **ABN and business address** in the footer and `privacy.html`.
- **Social profile URLs** for the `sameAs` array in the home page JSON-LD.
- **Case studies**: see below.

### 5. Photography

**This is no longer a blocker.** The site uses real Unsplash photography of gyms, reformer
studios, yoga rooms, saunas, float tanks and retreats, matched to the vertical each image
illustrates. Every URL was checked and returns HTTP 200, and Unsplash's licence allows
commercial use without attribution, so these can ship as they are.

The full list of approved photo IDs is in `ART-DIRECTION.md` section 4b. **Only use IDs
from that table.** Invented Unsplash IDs 404, which is how placeholder images silently
break.

Swap them for Mended's own photography when it exists. Gallery images are rendered
grayscale and return to colour on hover, so mixed sources still read as one set.

Still needed: `assets/img/og-default.jpg` at 1200x630 for link previews. It is referenced
by every page and does not exist yet.

### 6. Apply the real brand kit

The proposal says Mended's brand identity is already established and will be provided.
The site was built so that arriving brand does not mean a rebuild. Open
`assets/css/site.css` and change the values in `:root` at the top:

```css
--paper:     #f4f4f0;   /* page background */
--ink:       #000000;   /* text and every border */
--accent:    #ff90e8;   /* TIDE pink, fills only */
--highlight: #ffc900;   /* caution yellow, badges and open accordions */
```

Then mirror them in `assets/js/tailwind.config.js`. Fonts are set once per page in the
Google Fonts `<link>` and mapped in `site.css`.

**If you change the accent, re-check contrast.** The current pink is deliberately never
used as text on cream because it only reaches 1.8:1. If the brand's accent is darker it
may be safe as text, in which case `.link` can be simplified. If it is lighter, keep the
fill-only rule.

---

## Design rules the site follows

If you extend the site, keep these or it will drift.

- **The five rules above are the system.** Border, hard shadow, flat colour, mono labels,
  pink never as text on cream.
- **Type.** Archivo for display and body, Space Mono for technical labels. Headings are
  weight 800, uppercase, tight tracking. Emphasis inside a headline is `.mark`, a colour
  block, never a second font family and never a colour swap.
- **Every page gets at least one full-bleed colour band** so it does not read as one long
  cream column. `.band-pink`, `.band-yellow` or `.band-ink`.
- **Tailwind for layout only.** All colour, type, border and shadow styling comes from
  `site.css`. No hex values in markup.
- **One label per intent.** Contact is always "Book a call". Services is always
  "See the services". Results is always "See the results".
- **No em dashes or en dashes anywhere.** The whole site is written without them.
- **Nothing invented.** No client name, quote, logo or statistic appears on this site that
  the client did not supply. Placeholders are visible rather than plausible on purpose.
- **The page must survive without JavaScript.** The reveal classes hide content until
  observed, so every page carries
  `<script>document.documentElement.classList.add('js')</script>` in the head before the
  stylesheet. Without that line the hidden states never apply and the page renders fully
  but statically. Do not remove it, and do not move it after the stylesheet.

---

## Publishing a case study

1. Duplicate `case-study-template.html` and rename it to the client slug, for example
   `case-study-coastal-reformer.html`.
2. Replace every `[bracket token]` and delete the `tofill` class from each element you
   fill.
3. Update the `<title>`, meta description, canonical, Open Graph tags and the `Article`
   JSON-LD at the top of the file.
4. On `results.html`, replace one of the placeholder cards with the real one and point it
   at your new file.
5. Add the new URL to `sitemap.xml`.

---

## Hosting

**Live now:** https://mended-six.vercel.app

- **Repo:** https://github.com/txc0ld/mended (public)
- **Vercel project:** `tx-build/mended`, connected to the repo

Pushing to `main` deploys to production automatically. Any pull request gets its own
preview URL. There is no build step, Vercel serves the files as they are.

`vercel.json` sets:

- security headers on every response
- a one hour cache on `/assets/*`
- `X-Robots-Tag: noindex, nofollow` **only** on `*.vercel.app` hosts, so the staging URL
  cannot be indexed. That rule is host-scoped, so it stops applying by itself the moment
  a real domain is attached. You do not need to remember to remove it.

`404.html` is served automatically for unknown paths.

### Attaching the real domain

1. In Vercel, open the `mended` project, then Settings, then Domains, and add the domain.
2. Point the DNS at Vercel as instructed there.
3. Find and replace `https://mendedconsulting.com.au/` across the HTML files plus
   `sitemap.xml` and `robots.txt` if the final domain differs.
4. Decide apex or `www` and redirect the other to it, so it matches the canonical tags.

### Other hosts

Nothing here is Vercel specific. Netlify, Cloudflare Pages, GitHub Pages or plain shared
hosting over FTP all work: upload the contents of this folder to the web root and point
the 404 handler at `404.html`. Only `vercel.json` would need replacing with that host's
equivalent config.

Internal links use `.html` extensions on purpose, so the site also works when opened
directly from disk. If you switch the host to clean URLs, update the canonical tags and
the internal links to match.

---

## Production note on Tailwind

The site loads Tailwind from the CDN, which compiles utility classes in the browser. That
is fine for review and for a low-traffic marketing site, but it costs a render-blocking
script and a flash of unstyled layout on slow connections.

To ship a compiled stylesheet instead, from this folder:

```bash
npm install -D tailwindcss
npx tailwindcss -i ./assets/css/tailwind-input.css -o ./assets/css/tailwind.css --minify
```

with `tailwind-input.css` containing the three `@tailwind` directives and a `content`
glob of `./*.html`. Then in every page swap the two CDN script tags for
`<link rel="stylesheet" href="assets/css/tailwind.css">`. `site.css` is unaffected.

---

## Analytics and search console

Not installed, because the accounts do not exist yet. When they do, add the GA4 snippet
directly before `</head>` on every page, and verify the property in Google Search Console
using the DNS or HTML file method, then submit `sitemap.xml`.

---

## SEO and AEO notes

- Titles and descriptions are unique per page and lead with "wellness business
  consulting", not "wellness consultant". That distinction is deliberate. In search,
  "wellness consultant" collides with HR consultancies selling employee wellbeing
  programs to enterprise and mining, which is a different industry and a different buyer.
- Structured data: `ProfessionalService` with `areaServed` for Australia, Indonesia and
  Singapore, `FAQPage` on the home page and on each localised landing page,
  `BreadcrumbList` on inner pages, `WebSite` on home.
- The FAQ answers are written in a definitional, question-first style so answer engines
  can extract and cite them. Every FAQ answer in the visible HTML matches its JSON-LD
  string exactly. If you edit one, edit both.
- The three localised pages exist to catch local intent and to give paid campaigns a
  relevant destination per market. They are genuinely different pages, not one template
  with the city swapped, which is what makes them worth indexing.
- Internal linking runs home to services pillars, home to each localised page, and every
  page back to contact.
