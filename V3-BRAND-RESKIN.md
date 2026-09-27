# DWS V3 — institutional brand skin

## Preservation contract

Previous checkpoint: `c3ee59ba807ebbf13fb7d87d900731fbe274758f`.
Only a new CSS layer and its import change the application. No component markup, navigation destinations, section sequence, content, service data, portfolio architecture, forms, questions, recommendation logic, metadata, responsive breakpoints or $1,500 Founder Blueprint configuration changed. The approved symbol geometry and all original image files remain intact. Local work only; no hosting operation.

## Brand thesis and tokens

An editorial institution with industrial registration details. Bodoni Moda remains the declarative voice; Manrope remains the operational voice. The existing type scales and layout dimensions are retained, with stronger metadata weights, cobalt italic emphasis and editorial Builder questions.

| Token | Value / behavior |
|---|---|
| Paper white | #FFFFFF |
| Soft paper | #F7F8FA |
| Ink | #111318 |
| Industrial gray | #E4E7EC |
| Secondary type | #5B616C |
| DWS signal | #254DFF |
| Rules | #B9BEC8 |
| Workline | Fine cobalt rule with registration ticks; progress uses the same signal |
| Controls | Precise rectangles, weighted type, deliberate underline, cobalt selected feedback |
| Motion | 180 ms cuts; existing explicit interactions retained; no autoplay or new dependency |
| Texture | Very low-opacity print dot on the Builder entry; no generated imagery |

Signal candidates considered internally: red competes with beverage and heritage packaging; orange overlaps MyMosa; chartreuse needs dark support and can dominate; cobalt separates the institutional identity from the current warm project work and supports white-on-color controls. Chosen as a DWS working identifier, not a claim of exclusive color ownership.

## Application

Navigation uses a small signal rule and unchanged modular mark. The declaration keeps exactly the same line architecture. Foundry changes from carbon to industrial gray with a cobalt folio and selection line. Company Builder entry changes to ink/white print treatment; the application uses signal selection and progress. Project media remain untouched, without filters, gradients or packaging reinterpretation. Footer returns to ink/white.

## Asset audit

Rechecked repository source ledgers and existing asset directories. The authoritative records remain BRAND-ASSET-MANIFEST.md, MYMOSA-PORTFOLIO-SOURCE-MANIFEST.md and CREATIVE-BUILD-ASSET-MANIFEST.md. Eight approved MyMosa masters, official My Drink Family vectors and approved Mr. Cliff's source artwork remain in use. IKLA, SmokeSuite and FOA candidates still need exact publication clearance. No new media were needed for this skin; no uncertain assets were substituted.

## Verification

- Build, TypeScript and ESLint pass.
- Builder regression suite passes. Browser selection shows white on cobalt and advances to the unchanged next question.
- Brand integrity: all 22 assets, 16 SVGs and six icon sizes pass; Direction 03 geometry unchanged.
- HTTP QA: 27 page routes plus robots/sitemap, 87 internal links/assets and nine disabled-endpoint checks pass.
- Responsive DOM checks: seven principal routes at 320, 375, 430, 768, 1024, 1440, 1920 and 2560; no horizontal page overflow.
- Homepage headings, link destinations and section classes match the before snapshot exactly.
- Reduced-motion overrides cover the skin and pseudo-elements. Focus is cobalt on light fields and white on ink fields.
- Contrast measurements: cobalt/white and cobalt/industrial-gray exceed 4.5:1; secondary type/industrial-gray exceeds 4.5:1. This is a focused review, not formal accessibility certification.
- Development initially cached a missing stylesheet while files were being added; restart resolved it. No source workaround or business logic change was required.

## Before / after

Matching mobile captures are `outputs/v3-brand-reskin/before-mobile-hero.png` and `after-mobile-hero.png`. These show identical layout with the new surface, type emphasis, control and Workline treatment. Desktop/full-page and tablet captures were also retained; the browser screenshot adapter clipped/stitched portions of those larger captures, so use the local preview to assess desktop finish rather than interpreting capture seams as site layout.

Review locally at http://localhost:5174/ . No deployment or production change was made.
