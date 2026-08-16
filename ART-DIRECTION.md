# Mended Consulting - art direction v3, TIDE

Supersedes all previous art direction. The client facts, copy rules, banned words, dash
ban and no-invented-evidence rules in `BUILD-SPEC.md` still apply in full.

---

## 1. The brief

Two previous designs were rejected. The first was a dark card grid, the second a dark
editorial layout. Both read as serious and both read as generic. This one is **fun**:
neo-brutalist, high contrast, bone paper and brand maroon, heavy black
outlines, hard offset shadows and a lot of motion.

**The look is playful. The words are not.** Mended sells to a gym or studio owner making a
business decision, and the client proposal is explicit that this is not consumer wellness.
So the visual system is loud and the copy stays plain, direct and operator to operator.
Keep the approved copy from `_v2/`. Do not make it cute, do not add jokes, do not add
wellness-brand language.

---

## 2. The system

`assets/css/site.css` is the TIDE system and is the contract. Read it fully first. Same
for `assets/js/site.js`, which supplies every interaction listed below.

### The five rules

1. Every container gets a **2px solid black border**.
2. Depth is a **hard offset shadow**, `4px 4px 0 #000`. Never a blur, never a gradient.
3. Backgrounds are **flat**: bone, maroon, sand or black. No gradients anywhere.
4. Technical labels are **uppercase mono** with `0.1em` tracking. Use `.mono`.
5. **Maroon fills take bone text, always.** The brand maroon is dark, so the contrast
   logic is the reverse of a light accent:
   - maroon text on bone: 12:1, fine. Links are `.link`, black text on a maroon underline.
   - bone text on maroon: 12:1, fine. Every maroon fill (`.mark`, `.btn-brand`,
     `.band-brand`, the marquee, the footer) sets `color` to bone itself.
   - **black text on maroon: 1.5:1, banned.**
   - **maroon on black: 1.5:1, banned.** Nothing maroon sits on a black surface, which is
     why the footer is maroon rather than black and labels on `.band-ink` are sand.

### Palette

The client's real brand, sampled from their identity lockup ("MENDED." in oxblood on bone):

`--paper #efece4` (bone) · `--ink #000` · `--accent #580b0e` (maroon) ·
`--accent-hov #7a1418` · `--sand #e4ded2` · `--success #0e8f78` · `--danger #dc2626`

Maroon is the brand voice: the marquee, primary CTAs, `.mark` blocks, open accordion
headers, badges, pipeline nodes and the footer. Sand is the quiet secondary surface:
tiles, secondary cards, the placeholder marker. Black is borders, the module sweep and
`.band-ink`. There is no yellow and no pink anywhere.

### Type

Display and body: **Archivo**, 400 to 800. Headings are 800, uppercase, tracking -0.025em
or tighter. Labels: **Space Mono**, uppercase, 0.1em tracking.

Classes: `.display` + `.t-hero` / `.t-sec` / `.t-card` / `.t-sub`, then `.lede`, `.copy`,
`.mono`.

### Head block, required on every page

```html
<script>document.documentElement.classList.add('js')</script>
```
before the stylesheet. The reveal classes hide content until observed, so without this
line a JavaScript failure blanks the page.

Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

---

## 3. Components available

| Class | What it is |
|---|---|
| `.wrap` `.sec` | 1280px container, 112px desktop section padding |
| `.band` `.band-brand` `.band-sand` `.band-ink` | full-bleed colour block with top and bottom rules |
| `.card` `.card-brand` `.card-sand` `.card-ink` `.card-hover` | bordered box with hard shadow |
| `.btn` `.btn-brand` `.btn-sand` `.btn-ink` | mono uppercase button, presses down on click |
| `.link` | black text, maroon underline that fills on hover |
| `.badge` `.dot` | maroon pill with bone text, pulsing status dot |
| `.marquee` + `.marquee-track` + `.marquee-group` | maroon scrolling bar, bone text, 28s |
| `.modules` `.modules-2/3/4` + `.module` | grid divided by 2px black lines, black sweep on hover |
| `.stat-num` `.stat-bar` | counter and its growing bar |
| `.pipeline` `.pipeline-rail` `.pipeline-signal` `.pipeline-node` | the process rail with a running signal dot |
| `.filters` `.filter` `.tile` `.tile-label` | filterable gallery |
| `.acc` `.acc-icon` `.acc-body` | accordion, maroon header with bone text when open |
| `.field` `.input` `.select` `.textarea` `.check` | forms |
| `.tofill` | loud sand-and-maroon placeholder, dashed border |
| `.reveal` | scroll reveal, stagger with `style="--d:120ms"` |
| `.magnetic` | button pulls toward the cursor |
| `data-tilt` | card tilts toward the cursor |

### JavaScript hooks

`[data-progress]` scroll bar · `[data-target]` counter, with optional `data-suffix`,
`data-prefix`, `data-decimals` · `[data-gallery]` + `[data-filter]` + `[data-cat]` +
`[data-gallery-count]` · `[data-tabs]` · `[data-accordion]` · `[data-nav-toggle]`
`[data-nav-drawer]` `[data-nav-close]` · `[data-enquiry-form]` · `[data-year]`

---

## 4. Build this composition

### Fixed furniture

- `<div class="scroll-progress" data-progress></div>` first in body.
- Sticky header, 72px, bone, 2px bottom border. Wordmark is a round maroon `.wordmark-badge`
  reading `MC` with the shimmer overlay and the 8 degree hover rotation, then
  `MENDED` in Archivo 800 uppercase. Nav is mono uppercase. Header CTA is
  `.btn .btn-brand .btn-sm` reading **Book a call**.
- Footer is `.site-footer`, maroon with bone type, four columns, same links as
  `_v2/index.html`. It is never black, because maroon on black is 1.5:1.

### Home page, in order

1. **Hero.** Bone. A maroon `.badge` with a `.dot` reading a real status line. Then the
   headline at `.t-hero`, uppercase, with **BUSINESS** wrapped in `.mark` so it sits on a
   maroon block. Then the `.lede`, then two buttons, `.btn .btn-brand .btn-lg .magnetic`
   reading **Book a call** and `.btn .btn-lg` reading **See the services**. Two absolutely
   positioned floating `.card` badges at the sides on desktop, hidden below 900px.
   No image needed. The type and colour carry it.

2. **Marquee.** Maroon band, bone text. The verticals Mended serves, separated by `✦`. One
   `.marquee-group` in the markup, the script clones it for the seamless loop.

3. **Stats.** Four `.modules-4` cells with counters.
   **Only structurally true numbers.** 4 service areas, 3 markets, 12 verticals served,
   1 owner it answers to. Do not invent client counts, revenue or percentages.

4. **Services.** `.modules .modules-2` with four `.module` cells, numbered 01 to 04, each
   linking to its `services.html` anchor. The black sweep is the hover state.

5. **Who it is for.** The filterable gallery. Filters: All, Fitness, Studios, Recovery,
   Retreats. Tiles are the individual verticals with `data-cat`. Include the
   `[data-gallery-count]` live region.

6. **The difference.** A `.band-ink` full-bleed black section. Two columns: what most
   consultants sell, what Mended does. Bone type on black, sand `.mono` labels.

7. **How it works.** The `.pipeline`. Three stages named by verb: Diagnose, Rebuild,
   Hand over, with `.pipeline-node` markers on the rail and the signal dot running.

8. **Markets.** Three `.card` blocks, Australia, Bali, Singapore, each with its operating
   pressure and a `.link` to the localised page. Vary the card colours: one cream, one
   sand, one maroon.

9. **Client result.** A large `.card-lg` holding a pull quote. Placeholder, `.tofill`,
   with a TODO comment. Do not invent a testimonial.

10. **FAQ.** Six `.acc` accordions, questions and answers verbatim from `_v2/index.html`
    so the `FAQPage` JSON-LD stays accurate.

11. **Close.** A `.band-brand` full-bleed block, big headline, one `.btn .btn-sand .btn-lg
    .magnetic` reading **Book a call**.

---

## 4b. Asset map

**Every URL below was verified to return HTTP 200.** Use these exact IDs. Do not invent
Unsplash IDs, they will 404. Do not use picsum any more.

Build the URL as:
`https://images.unsplash.com/<ID>?w=<width>&q=75&auto=format&fit=crop`

| Purpose | Photo ID |
|---|---|
| Gym floor, machines and weights | `photo-1689877020200-403d8542d95d` |
| Gym, equipment room | `photo-1671970922029-0430d2ae122c` |
| Gym with large windows | `photo-1757924284732-4189190321cf` |
| Kettlebells, functional fitness | `photo-1597076537061-a6b58163aa45` |
| Gym wall, racked equipment | `photo-1771270786606-f5a0e57db762` |
| Reformer studio, machines and plant | `photo-1717500252297-b09508db7ceb` |
| Pilates, equipment in use | `photo-1754258167836-6878c54e316c` |
| Pilates, ball work | `photo-1754257319767-f844f61837e1` |
| Modern studio, mats and windows | `photo-1761971975962-9cc397e2ba2a` |
| Yoga studio, mats laid out | `photo-1687783615494-b4a1f1af8b58` |
| Yoga, group class | `photo-1683056255281-e52a141924f0` |
| Yoga, single practitioner | `photo-1506126613408-eca07ce68773` |
| Spin or cycle room | `photo-1593079831268-3381b0db4a77` |
| Sauna, water on the rocks | `photo-1741601274134-fa98352f1c95` |
| Sauna, benches | `photo-1572168400468-62e1b3209d7d` |
| Sauna, wooden room | `photo-1712659604528-b179a3634560` |
| Recovery, hot tub | `photo-1544843776-7c98a52e08a4` |
| Float, water surface | `photo-1517498327491-f903e1e281cd` |
| Retreat, group session outdoors | `photo-1687875495230-96dfea96d9da` |
| Retreat or resort, pool | `photo-1616940779493-6958fbd615fe` |

Match the photo to the thing it illustrates. A reformer studio tile gets the reformer
photo, not a generic gym. Alt text describes the actual subject in plain language and
never repeats keywords.

Images live inside `.tile` in the gallery, which already applies grayscale with a colour
return on hover. Elsewhere give them a `2px` black border and a hard shadow like any other
container. Always set `width`, `height` and `loading="lazy"`, except the first image on the
page which is `loading="eager" fetchpriority="high"`.

## 5. Hard fails

- Any em dash or en dash anywhere, including comments, alt text and JSON-LD.
- Black text on a maroon fill, or maroon text or labels on a black surface.
- Any gradient, any blurred shadow, any container without a 2px black border.
- Any invented client name, business name, testimonial, quote, logo, statistic or founder
  detail. Unknowns are `[bracket tokens]` inside `.tofill` with a TODO comment above.
- Hardcoded hex values in markup. Everything comes from the classes above.
- More than one `<h1>`, or headings that skip a level.
- A page that loses content with JavaScript disabled.
- Changing the approved copy into something jokey or wellness-brand flavoured.

## 6. Carried over unchanged

Titles, meta descriptions, canonicals, OG tags and the JSON-LD graph from the matching
`_v2/` file. CTA labels: **Book a call**, **See the services**, **See the results**.
Australian English. One `<h1>`, skip link, `<main id="main">`, labels above inputs, Lucide
is gone so any icon must be inline SVG kept to simple geometry, or omitted entirely.
Prefer omitting. The system does not need icons.
