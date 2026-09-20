# Visual Environment Lab — Prototype Review

Private preview: https://codex-visual-environment-lab--dynasty-works-v54-candidate.netlify.app/visual-environment-lab/
Netlify sign-in required.
Branch: codex/visual-environment-lab
Checkpoint: 2ceb6392946891e30436d6d209c039ba04c6ffe5
Draft deployment: 6aace8b7ecda183a277a9e49

## Controller lock
The original Review52 scroll controller, thresholds, rail height, selection timing and Artifact implementation are unchanged. The existing continuous temperature/progress state is passed into an optional environment render slot. The default homepage does not pass this slot and does not load the environment module or CSS. All existing content, navigation, Builder and downstream sections are reused, not rebuilt.

## One world
A retained model of architectural planes and volumes is projected through one perspective camera into SVG. The same origin plane gains depth and a horizontal return. Axes establish the floor, material relationships emerge, volumes acquire mass, cobalt paths activate, passages gain depth, distant forms extend the world, and connections resolve. Continuous smoothstep interpolation operates within every interval; reverse scrolling restores the same geometry. No stage image swaps, generated imagery, texture downloads, timers, independent scroll controller, or new dependencies.

Foreground hierarchy is protected through restrained contrast and a spatial mask. Mobile omits distant structures/grid detail; the approved mobile foreground retains all eight stages. Reduced motion disables environmental camera movement while preserving the existing controller's reduced-motion behavior. The layer is aria-hidden and cannot intercept pointer input.

## Verification
Build / TypeScript / lint: PASS.
Original controller and Artifact source: identical after normalizing line endings.
Eight foreground states at desktop 1440 and mobile 390: identical SVG markup, placement and copy versus the unlayered homepage.
Continuous interpolation: PASS.
Forward/backward environmental geometry equality: PASS.
Keyboard stage activation: PASS.
Overflow: none at 320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920, 2560.
Local application console: no errors.
Local Edge scroll sample: 141 frames; median 16.7 ms, p95 16.8 ms. Device-specific sample, not a universal guarantee.
Live private deployment: route loaded, Company resolved at progress 7.0, reverse Strategy selection resolved at 1.2006.

## Limits / approval
This is a browser-native projected architectural model, not photorealistic WebGL rendering. Visual acceptance remains the founder's decision. The previously isolated in-app-browser iframe observer diagnostic is external to the application and was not patched.

## Protections
Existing integration draft 6aacdb78e99a5a09cdea951d remains ready on its separate branch alias. Investor deployment remains commit 0268f213206e7daedb1947770c4e41be29861573. No promotion or production changes. MyMosa unchanged.

## Captures
outputs/environment-arrival-1440.png
outputs/environment-idea-1440.png
outputs/environment-strategy-1440.png
outputs/environment-product-1440.png
outputs/environment-experience-1440.png
outputs/environment-company-1440.png
Corresponding -390.png captures provide the mobile pair.

## Changed source
src/VisualEnvironmentLab.tsx — retained projected model and interpolated construction
src/visual-environment.css — lab-only layer and mobile detail reduction
src/Review52.tsx — optional state-fed layer slot; controller/artifact unchanged
src/main.tsx — lazy lab route
src/experience/ExperienceSystem.tsx — recognize lab as the same Creation continuity context
scripts/write-portfolio-routes.cjs — static lab entry

## Craft refinement — d5791ac
Background files only: VisualEnvironmentLab.tsx and visual-environment.css.
Added recessed material joints, an inlaid return, aperture jamb/reveal, height-dependent cast shadows/contact shadows, floor-housed signal channels, repeated L-derived structural bays, ceiling ribs and corresponding light on the ground. Replaced cylindrical-looking gradients with restrained planar material shading. Mobile omits distant bays and reduces rib detail.
Foreground/controller identity, all eight stages, reversible interpolation, keyboard, 320–2560 overflow checks, build, TypeScript and lint pass. Local console clean. 142-frame scroll sample: median16.7ms/p95 16.8ms. Live private preview verified the new joinery, six ribs and three bays. No production or investor updates.
Checkpoint: d5791acb0a2967131a91815850edfca986fd0e4e
Draft: 6aacef06ecda1869f17a9e4c
