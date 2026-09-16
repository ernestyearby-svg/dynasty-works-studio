# DWS benchmark critique and gold-city upgrade

Research date: 16 September 2026. A selected comparison of relevant, established studios, not an objective ranking of the world's best agencies. This critique concerns their public positioning, offer architecture and project presentation; it does not claim to assess delivery quality, pricing, conversion rates or private business results.

## What the benchmarks teach us

| Studio | What works | My critique / limitation for DWS | What we adopt |
|---|---|---|---|
| [COLLINS](https://wearecollins.com/programs/) | Programs are organized around business situations such as creation, repositioning and expansion rather than an undifferentiated service list. | The premium-value framing fits established leadership teams; an early founder still needs a concrete first step and an explanation of what gets made. | Three clear starting situations, a visible $1,500 Blueprint, and scoped outputs. |
| [Red Antler](https://www.redantler.com/branding) | Connects identities across physical and digital applications. Sector and discipline filters make a broad portfolio easier to explore. | Its recognizable client roster does much of the persuasion. Copying that authority language without comparable evidence would make DWS less credible. | Explain the connection between identity, packaging, products and digital execution; keep client evidence behind Work. |
| [Pentagram](https://www.pentagram.com/) | Specific project descriptions and a rich discipline/sector taxonomy make its multidisciplinary breadth concrete. | An extensive archive supports exploration but is not a guided starting point for a founder. DWS should not imitate the volume of its homepage. | Specific labels and tangible examples, with a separate guided Company Builder route. |
| [AKQA](https://www.akqa.com/expertise/digital-product-and-experience-design/) | Product and experience capability is supported by many different real applications, rather than technology jargon alone. | A large enterprise project catalog can leave an early founder unsure what a practical first engagement would be. | Describe what could be built and offer a clear next decision; do not imitate enterprise scale or claim connected integrations. |
| [R/GA](https://www.rga.com/) | A concise brand-systems proposition connects creative work, technology and business value. | Systems language can become abstract without clear artifacts or entry points. This is also a current DWS weakness. | Translate Define / Build / Launch / Scale into decisions and possible outputs. |

These are editorial judgments based on the linked public pages. No layouts, imagery, branding or proprietary interactions were copied.

## Candid DWS critique

1. The gold/city hero is distinctive within this chosen direction, but architecture alone can suggest real estate or hospitality rather than company creation. Keep the founder-approved hero and let the next steps make the offer explicit.
2. The existing capability engine is deep, but generic service descriptions make the visitor work to understand what an engagement produces.
3. With case studies deliberately off the homepage, the site needs a clear route to both authentic evidence and illustrative capability. They must remain visibly different.
4. The earlier Concept Lab was a category index without much to inspect. It now contains three large visual studies.
5. Photorealism is useful for evaluating a possibility. It is not proof of manufacturing, engineering, client delivery or commercial performance. The new examples are labeled accordingly.

## Implemented upgrade

### Homepage

Kept the approved gold/city environment, typography, navigation and business systems. Kept Selected Work and the MyMosa feature off the homepage. Replaced the generic capability introduction with three concrete entry paths:

- Have an idea → Founder Blueprint, with the approved $1,500 price visible.
- Ready to build → Company Builder and company roadmap.
- Already operating → digital systems and automation capability.

Concept Lab remains a text link, not a case-study or mockup image section on the homepage.

### How We Build

Recomposed the method as an editorial four-stage sequence. Each stage states a decision, a short purpose, illustrative outputs, and optional detailed scope. Original capability links and specialist boundaries are retained. No promised outcomes, fixed timelines or new prices were invented.

### Concept Lab

Three separate photorealistic mockup studies:

1. Identity — paper, print, identity materials and tactile finish.
2. Packaging — amber vessel, ceramic jar, paper label and carton.
3. Product — an aluminum audio-object concept and material detail.

Each has an AI-generated concept label, meaningful alternative text, a short purpose and an accurate status note. No client identity was regenerated. No client case study was added to the homepage.

## Asset audit and provenance

Existing repository assets and ASSET-INVENTORY.md, CREATIVE-BUILD-ASSET-MANIFEST.md and prior approval manifests were inspected. Approved MyMosa and Mr. Cliff's material remains in the Work architecture. The existing audit records unresolved approval/rights for additional IKLA, SmokeSuite and FOA material; none was used for these new demonstrations.

The new examples meet distinct gaps in the requested demonstration gallery; they do not replace approved client assets. This is three studies, not a ten-asset pack.

| File | Status | Intended use |
|---|---|---|
| `internal-assets/concept-lab-studies/identity-master.png` | AI-GENERATED CONCEPT | Identity/material demonstration |
| `internal-assets/concept-lab-studies/packaging-master.png` | AI-GENERATED CONCEPT | Packaging/material demonstration |
| `internal-assets/concept-lab-studies/product-master.png` | AI-GENERATED CONCEPT | Industrial form visualization |
| `internal-assets/concept-lab-studies/PROMPTS.md` | SOURCE RECORD | Exact prompts and built-in generation mode |
| `review-upgrades/gold-city/web-assets/*` | WEB DERIVATIVES | 768px and 1536px WebP versions |

Six derivatives total 670,642 bytes. Each image uses responsive sources, explicit dimensions and lazy loading. Original generated PNGs are preserved; no source master was overwritten.

## Local review links

- Homepage: http://localhost:5176/
- Upgraded method: http://localhost:5176/how-we-build
- Photorealistic studies: http://localhost:5176/concept-lab

No deployment, production domain change, backend activation, or new integration.

## Reproducible source

The selected gold-city review is based on commit `f592a0e`, running from `outputs/gold-city-review`. Because that local output directory is ignored, the complete six-file upgrade is also preserved as `review-upgrades/gold-city/upgrade.patch`. Apply it only to a clean copy of `f592a0e`; copy `web-assets` into that copy's `public/assets/concept-lab`.

The patch includes the user's previous removal of homepage case-study sections. It does not roll the active V3 branch backwards. All newer checkpoints remain intact.

Main `tsconfig.json` now excludes local `outputs` snapshots so archived applications do not accidentally compile against the active application's module aliases. This changes tooling scope, not business behavior.

## Validation completed

- Gold-city upgrade production build: PASS.
- Active V3 production build: PASS after stopping/restarting its local server to release Windows output-file locks.
- Gold-city TypeScript: PASS; active V3 TypeScript: PASS.
- Gold-city lint: PASS.
- Route QA: 27 application routes plus robots/sitemap; 91 internal links/assets; 9 disabled-API checks: PASS.
- All six generated WebP URLs: 200.
- Gold hero retained; homepage case-study sections absent; $1,500 price present.
- Concept Lab overflow checks: 320, 375, 390, 430, 768, 1440, 2560 px: PASS.
- Method and homepage overflow checks: 320, 390, 768, 1440, 2560 px: PASS.
- Mobile gallery and method screenshots inspected. All three images loaded; no altered proportions or client marks.
- Native method scope disclosure tested with Enter; links remain keyboard accessible.
- Browser console after server restart: no warnings/errors observed.
- Reproducible patch checked against the saved baseline: PASS.

A transient development-server cache error occurred while a new stylesheet was being created; restarting the local server resolved it. No remaining asset or compile error was observed. No measured Core Web Vitals or conversion improvement is claimed.
