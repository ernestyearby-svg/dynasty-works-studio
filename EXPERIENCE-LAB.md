# DWS V5.4 — Experience Lab

Local review: http://127.0.0.1:5184/experience-lab
Parent: 0268f213206e7daedb1947770c4e41be29861573
Branch: codex/experience-lab
Separate checkout; nothing pushed or deployed to investor review.

## Three experiments
1. Persistent Creation Primitive: approved L-derived plane/open edge/signal, six selectable states, compact fixed state indicator. Loading is a finite simulated assembly, not a live network request or spinner.
2. Route transition: two fictional local page states. Architecture compresses to an L-shaped mask, context changes, architecture resolves. 720 ms plus one render frame. Repeat activation is guarded. No actual routes, history, or production navigation are intercepted.
3. Navigation and CTA: approved labels, rule extension, directional arrow, small typographic response, persistent primitive feedback. Buttons deliberately select simulated contexts only. Company Builder is untouched.

## Motion tokens
FAST: 160 ms — interaction response.
STANDARD: 360 ms — component/state transition.
SYSTEM: 720 ms — architecture transfer, two 360 ms halves.
Easing: cubic-bezier(.22,.68,.12,1).
CSS variables are scoped to .experience-lab. Web Animations uses matching numeric tokens. No global animation library or dependency added.

## Performance
Route lazy-loaded. Lab-specific production assets: 9.22 kB JS / 11.05 kB CSS (3.10 / 2.99 kB gzip), excluding shared React and existing fonts.
No continuous animation, scroll handler, cursor replacement or image payload. Finite loading assembly pauses when its study leaves view. Route animations resolve immediately offscreen/hidden; reduced motion changes context immediately. Layout reads occur at transition start only.
Headless Edge desktop sample: 90 frame intervals; median 16.7 ms, p95 16.8 ms during transition. This is a short local sample, not a cross-device 60 fps guarantee. Clip-path masking may require paint; keep it constrained to this bounded experiment.

## Accessibility / QA
Semantic buttons, explicit pressed states, status announcements, focus outlines, skip link, native cursor and touch controls. Decorative SVGs hidden from screen readers; state remains available as text. Enter/keyboard transition tested with reduced motion. Mobile targets >=48 px.
Build PASS; TypeScript PASS; lint PASS.
Interaction/overflow QA at 320, 390, 768, 1440, 1920: PASS. Zero runtime errors. Six states, A/B transfers, navigation and CTA tested.
Captures and JSON evidence in parent outputs/: lab-*-primitive.png, lab-*-transition.png, lab-*-navigation.png, lab-*-full.png, lab-1440-mid-transfer.png, lab-1440-page-b.png, lab-qa.json, lab-performance.json.

## Scope firewall
Only new lab TSX/CSS, a lazy route entry, static route build output registration, and this document. Approved homepage/Work/MyMosa/Concept Lab/Company Builder source files unchanged. Investor checkout and deployment untouched. No repository or hosting settings changed.

## Review boundary
Local only; not an external investor link. Await founder approval before any site-wide integration or further experiments.
