# Capability Lab — Phase II Founder Gate

Source checkpoint: `3810ddb`.
Scope: FORM and SURFACE / STRUCTURE only. Local review; no deployment.

## 05 — FORM

Preserved orange field, FORM typography, original three-cut chevron seed and continuous SVG slider. Seven states now available:

1. Symbol — original master mark.
2. Language — mark/type lockup and baseline relationship.
3. Micro — compressed identification mark with optical guides.
4. Motion — timed compression and release, disabled under reduced motion.
5. Spatial — seed becomes dimensional directional signage within a drawn architectural field.
6. Interface — actual Discover / Make / Move navigation changes the headline and progress rule.
7. Environment — repeated seed resolves into an oversized cropped identity field.

The primary seed persists through interpolated translation, scale, compression and skew. Supporting geometry resolves between applications; pattern dominates only Environment.

## 06 — SURFACE / STRUCTURE

Replaced rectangular mailer geometry with a six-sided radial shell. Its flat outer blank folds into a faceted shoulder and slotted crown. Native geometry includes board thickness, beveled exposed edges, scored hinges, folded seam flanges, hinged locking tongues, receiving slots, insert supports, circular cradle, and a fitted presentation tray.

The tray lowers into the established volume before the closure completes. Closed / Open / Presentation reveal separates the crown, opens the shoulder petals and lifts the tray. Assembly remains reversible and directly controlled by the original slider.

Three substrates change color, roughness, edge response and procedural grain: Uncoated Mineral Board, Black Dyed Stock, Rigid Composite. Unfinished / Micro emboss / Registered linework are mutually exclusive finishing states. Flat-state linework shows inset safe boundaries, bleed offsets and registration crosses.

### Engineering limits

This is a structural visualization, not a certified production dieline. Material grain and fold radii are procedural approximations. Board grades, bend allowances, locking clearances, load capacity and tooling require physical prototyping. Outer shell uses one blank; tray and crown are separate parts. No manufacturing-readiness claim is made. No AI raster assets, stock imagery or new dependencies were introduced.

## New captures

All captures are under `outputs/phase-ii-founder-gate/`:

- form-symbol-1440.png
- form-language-1440.png
- form-spatial-1440.png
- form-interface-1440.png
- form-environment-1440.png
- form-primary-390.png
- package-dieline-1440.png
- package-fold-25-1440.png
- package-volume-50-1440.png
- package-closure-75-1440.png
- package-finished-closed-1440.png
- package-finished-open-1440.png
- package-finished-390.png

Review gallery: `outputs/phase-ii-founder-gate/index.html`.
Desktop captures: 1440 × 1000. Mobile captures: 390 × 844.
Visual inspection covered the new capture set, including full-size mobile and finished-open views.

## QA

- Isolated lab production build: PASS.
- TypeScript: PASS.
- Lint: PASS.
- Browser console: PASS — no errors recorded.
- 132 automated checks: PASS.
- Horizontal overflow: none at 320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920 and 2560, across five slider positions in both studies.
- Keyboard: sliders, selected states and reveal controls verified.
- Focus: visible outlines verified.
- Reduced motion: Form timed animation disabled; package reveal resolves without spatial interpolation.
- Material/finish selectors and all seven Form modes verified.
- Render lifecycle: package renders on input/resize; animation frames stop after reveal settles. Geometry, materials, textures, observer and renderer are disposed on unmount.
- Performance limitation: existing lazy Three.js/RoomEnvironment chunk remains approximately 579 kB minified / 146 kB gzip and produces Vite's >500 kB warning. No frame-rate guarantee from headless testing.

## Preservation

Only five Form/Packaging source files changed from 3810ddb. Assets 01 Object Zero, 02 Living Canvas, 03 Sovereign OS, 04 Signal and shared lab styles/entry are unchanged.

V5.8, investor deployment, public production, MyMosa and IKLA unchanged.
Assets 07–10 not started. Nothing deployed or pushed.

STOP — founder review required before further work.
