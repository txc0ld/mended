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

The site is built on a concept called **The Seam**.

Mended repairs businesses, so the page enacts that. It **opens in the dark** (the business
under pressure) and **resolves into paper** (the business working). The join between them
is the seam, and it is the only piece of ornament the site allows itself. In kintsugi a
repair is not hidden, it becomes the most considered part of the object.

Every page has the same arc:

```
  ACT ONE    ink      hero over a full-bleed photograph
  ~~~~~~~~   seam     a shallow tear with a thread of light along it
  ACT TWO    paper    the body of the page
  ~~~~~~~~   seam-up  a straight return
  FOOTER     ink
```

Sections declare which act they are in, and components read semantic tokens, so the same
markup works in both:

```html
<section class="act act--dark pad"> ... </section>
<section class="act act--light pad"> ... </section>
```

**Every full-width band must carry the `act` class.** The fixed header inverts from bone
to graphite by observing which act is behind it. A band without the class breaks that.

**Almost nothing is a card.** Content is composed from type, rules, measure and space.
If you add a bordered rounded box with a heading and a paragraph in it, you are undoing
the redesign. The full rules are in `ART-DIRECTION.md`.

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

### 5. Replace the photography

Every image is a `picsum.photos` placeholder and every one has an HTML comment directly
above it describing what the real photo should show.

Be aware that picsum serves a **random** photo per seed, so the subjects currently on the
page are not wellness related and will not match their alt text. That is expected. The
seeds are stable, so the same image returns every load, and the alt text and the comment
above each image already describe the correct subject. Do not show the site to the client
as final until these are swapped.

Images are rendered grayscale with a eucalyptus tint (`.photo` in `site.css`) so photos
from different shoots still read as one system. That treatment will flatter real brand
photography too. If you want full colour, remove the `filter` line from `.photo img`.

Also needed: `assets/img/og-default.jpg` at 1200x630 for link previews. It is referenced
by every page and does not exist yet.

### 6. Apply the real brand kit

The proposal says Mended's brand identity is already established and will be provided.
The site was built so that arriving brand does not mean a rebuild. Open
`assets/css/site.css` and change the values in `:root` at the top:

```css
--ink:        #0b0f0d;   /* page background */
--bone:       #eceae4;   /* primary text and primary button fill */
--accent:     #4fa37f;   /* the single accent */
```

Then mirror the same values in `assets/js/tailwind.config.js`. Fonts are set in one place
per page, in the Google Fonts `<link>` in the head, and mapped in `site.css`.

The interim palette is a warm near-black with a single eucalyptus accent. It was chosen
to read as a credible business consultancy rather than consumer wellness, and to avoid
the beige and brass palette every wellness brand already uses.

---

## Design rules the site follows

If you extend the site, keep these or it will drift.

- **Two acts, never three.** Dark hero, paper body, dark footer. No middle section flips
  back to dark for emphasis.
- **Colour lock.** One accent hue with two values, one per act: `--accent-dk` on ink,
  `--accent-lt` on paper. Never introduce a second hue.
- **Almost no cards.** Compose with type, rules, `.offset-2` / `.offset-3`, bleeding
  images and space.
- **Type.** Bricolage Grotesque for display, Geist for body, Geist Mono for numerals and
  the rare small label. Emphasis inside a headline is `.em` (colour) or `.em-hollow`
  (outline), never a second font family. `.em-hollow` appears once on the whole site, on
  the word "studio." in the home page hero.
- **Eyebrows are rationed.** `.label` appears at most twice per page. Zero is better.
- **Tailwind for layout only.** All colour, type and surface styling comes from
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

Any static host works: Netlify, Cloudflare Pages, Vercel, GitHub Pages, or plain shared
hosting over FTP. Upload the contents of this folder to the web root.

Recommended host settings:

- Force HTTPS and redirect the apex or `www` to whichever you set as canonical.
- Point the 404 handler at `404.html`.
- If the host supports clean URLs, serve `/services` from `services.html` and update the
  canonicals and internal links to match. The current links use `.html` so the site works
  when opened directly from disk.

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
