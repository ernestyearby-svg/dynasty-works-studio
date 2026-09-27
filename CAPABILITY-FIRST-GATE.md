# Capability Lab — First Founder Gate

Local review: http://127.0.0.1:5194/capability-lab

Run from experience-integration: `npx vite --config vite.capability.ts`

## Scope
Only three studies: 3d-product, web, os. Separate HTML entry, Vite configuration and scoped styles. No approved V5.8 source file changed. No deployment or production connection.

## Implementation
- Industrial: native Three.js linear task-light geometry, rounded housing, optical insert, base, surface selection, orthographic/wireframe/exploded inspection, light and rotation controls; SVG fallback.
- Web: original unnamed editorial site, responsive native SVG relief, collection filters, modal reading, keyboard dismissal and focus restoration.
- OS: sample program horizon, local approvals, project filtering/search, financial allocation, registries and workflow simulation. No real financial/client data or connected automations.

## QA
Production bundle, TypeScript and lint passed. Browser interaction tests passed. No application exceptions in tested sessions. No document overflow at 320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920, 2560. Desktop 1440 and mobile 390 captures visually inspected. Reduced motion and keyboard interaction exercised. WebGL-unavailable fallback verified.

Captures: outputs/capability-review (six primary captures plus exploded assembly).

## Limits
- Conceptual industrial dimensions, not engineering/manufacturing certification.
- OS stores demonstration changes in session memory only; refresh resets.
- Three.js chunk is 567 kB minified / 142 kB gzip; loaded only by the product route. Vite reports the 500 kB advisory. Rendering is event-driven, not a permanent animation loop.
- Local review server only. Standalone dist-capability is not a deployment package: public fonts and route hosting configuration would need to be included before any future deployment.
- Automated browser QA is not physical-device testing or a full accessibility certification.

Stopped at the three-study approval gate. Remaining seven studies not built.
