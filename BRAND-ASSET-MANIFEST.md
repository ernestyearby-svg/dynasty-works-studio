# Dynasty Works Studio — production asset manifest V1.6

Approved identity: Direction 03 / Modular System Mark. All symbol applications derive from brand-source/modular-master.json. Approval is for this brand system; it does not approve client portfolio materials.

Base directory: public/assets/brand/. SVG logos have outlined lettering; no font file or raster image is embedded. Document/social templates retain editable text and are clearly labeled as templates.

| Filename | Purpose / usage | Format | Background compatibility | Status |
|---|---|---|---|---|
| symbol/symbol.svg | Master symbol | SVG | Bone / light | PRODUCTION |
| symbol/symbol-outline.svg | Approved outline master; intentionally identical to symbol | SVG | Bone / light | PRODUCTION |
| symbol/symbol-reversed.svg | Reversed symbol | SVG | Obsidian / Graphite | PRODUCTION |
| symbol/symbol-small.svg | Small-size optical derivative: dividers omitted, outer stroke 18 | SVG | Bone / light | PRODUCTION |
| logo/logo-primary.svg | Default symbol + two-line name lockup | SVG | Bone / light | PRODUCTION |
| logo/logo-horizontal.svg | Wide horizontal lockup | SVG | Bone / light | PRODUCTION |
| logo/logo-stacked.svg | Stacked cover lockup | SVG | Bone / light | PRODUCTION |
| logo/wordmark.svg | Name-only two-line wordmark | SVG | Bone / light | PRODUCTION |
| logo/logo-primary-reversed.svg | Primary reversed lockup | SVG | Obsidian / Graphite | PRODUCTION |
| documents/document-mark.svg | Header / footer / page mark | SVG | Bone / light | PRODUCTION |
| documents/watermark.svg | Low-opacity document watermark | SVG | Bone only; never behind critical text | PRODUCTION |
| icons/app-icon.svg | Application master | SVG | Opaque Obsidian | PRODUCTION |
| social/avatar.svg | Universal social avatar; centered safe area | SVG | Opaque Obsidian | PRODUCTION |
| icons/icon-16.png | Application / favicon derivative 16px | PNG | Opaque Obsidian | PRODUCTION |
| icons/icon-32.png | Application / favicon derivative 32px | PNG | Opaque Obsidian | PRODUCTION |
| icons/icon-48.png | Application / favicon derivative 48px | PNG | Opaque Obsidian | PRODUCTION |
| icons/icon-180.png | Apple touch icon | PNG | Opaque Obsidian | PRODUCTION |
| icons/icon-192.png | Application / favicon derivative 192px | PNG | Opaque Obsidian | PRODUCTION |
| icons/icon-512.png | Application / favicon derivative 512px | PNG | Opaque Obsidian | PRODUCTION |
| documents/blueprint-cover-template.svg | Editable cover architecture; replace bracketed fields before client use | SVG | Obsidian | TEMPLATE — NO CLIENT DATA |
| social/opengraph-template.svg | 1200 × 630 OpenGraph layout architecture; not wired as a raster social card | SVG | Obsidian | TEMPLATE |
| documents/presentation-cover-template.svg | 16:9 presentation title architecture | SVG | Obsidian | TEMPLATE — NO CLIENT DATA |
| /favicon.svg | Browser tab; optical small-size mark | SVG | Opaque Obsidian | PRODUCTION |
| /manifest.webmanifest | Application name and 192/512 icon references | JSON | n/a | PRODUCTION |

## Masters and reproducibility

- brand-source/modular-master.json — unchanged approved path coordinates, stroke widths, optical bounds and clear-space unit. ViewBox cropped to 250×150 for equal horizontal margins; this does not alter the mark.
- brand-source/wordmark-paths.json — outlined Arial Bold master name and Arial Regular descriptor, created from the installed Windows font. Font files are not redistributed.
- brand-source/extract-wordmark.ps1 — reproducible Windows outline extraction; use only with a legally installed font.
- scripts/build-brand-assets.mjs — derives every production SVG and icon from those masters using the existing Sharp installation. No production rendering dependency added.
- scripts/qa-brand.mjs — geometry, safe-vector, lettering-outline, icon dimension and reference checks.
- brand-source/asset-inventory.json — generated machine-readable inventory.

## Small size

The 16/32/48px PNGs and favicon omit only the two hairline dividers and use an 18-unit outer stroke. The module positions, angles and proportions remain unchanged. Icons at 180/192/512 retain the exact 10-unit outer / 2-unit divider master. Icon canvases are optically centered with an Obsidian field; these are any-purpose icons, not maskable PWA icons.

## Templates and sharing

Blueprint cover includes bracketed client/company and date fields; no fictitious client values are populated. Presentation template is 1600×900; OpenGraph template is 1200×630. The latter prepares the layout only and is not installed as a live crawler image. Social avatar is ready; announcement, case-study, project-reveal, quote, educational, process, Blueprint and Builder post architecture is documented in the brand guidelines. No posts are fabricated.

## V1.8A presentation assets

The 22 production identity assets above are unchanged. New supporting environments and licensed fonts live outside /assets/brand/. See the complete V1.8A register in V1.8A-VISUAL-MASTER-IMPLEMENTATION.md. Environments are conceptual DWS imagery; they must never be used as client proof.
