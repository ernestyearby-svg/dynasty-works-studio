# Dynasty Works Studio — Version 1.2

An integrated company-building studio website with an editorial portfolio, founder pathways and a seven-step local company brief builder. All six project records are explicitly labeled placeholders; client attribution, years, deliverables and outcomes are not fabricated. Inquiries and commerce are intentionally unavailable until real providers are connected.

## Technology

React 19, TypeScript, Next.js 16 App Router conventions, Tailwind CSS 4, Zod validation. The Sites starter uses **Vinext 1.0.0-beta.5 / Vite** to compile the Next-compatible application for Cloudflare Workers. This runtime is a beta; it is not a stock Next.js production runtime. Versions are locked in package-lock.json. No motion or commerce SDK was added. Vendored starter UI components remain available but the website uses a bespoke component and CSS system.

## Local development

Node >=22.13.0 required.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
npm run qa -- http://localhost:5174
```

Use the exact port printed by the server. The default is 5173; the first preview used 5174 because 5173 was occupied. QA requires a running server. On this Windows host the npm shim fails when invoked by some helper scripts. The verified fallback is:

```powershell
node 'C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js' run dev
node 'C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js' run build
```

The completed production build is in dist/server and dist/client. `npm start` serves the built Worker locally through Wrangler.

## Routes

- / — home: hero, selected work, capabilities, process, featured case study, studio statement, CTA
- /work — all projects and 11 discipline filters
- /work/[slug] — six case studies and a real not-found state
- /start-a-business — flagship founder pathways and connected company/market journey
- /start-a-business/builder — seven-step guided local brief
- /services — eight practices and the original 12 specialist disciplines
- /studio — studio statement, principles and visual study
- /templates — three clearly labeled collection previews
- /contact — four-step brief builder and local download
- /api/inquiries — bounded, validated endpoint that always fails closed while unconfigured
- /sitemap.xml and /robots.txt — SEO infrastructure

Future insights, shop and client portal routes are not exposed.

## Folder architecture

```text
app/                 Routes, layouts, metadata and API boundary
components/          Bespoke reusable website components
components/ui/       Unmodified starter UI catalog
data/                Site copy, navigation, projects, services, catalog
lib/content.ts       Async ContentRepository boundary for a future CMS
lib/commerce.ts      Provider-neutral CheckoutResult / CommerceProvider
lib/inquiry.ts       Shared schema, upload policy and future adapter contract
public/assets/       Web derivatives only
scripts/qa.mjs       Route, metadata, link, asset and API regression checks
build/, scripts/     Sites runtime and deployment helpers
```

### Components

Navbar / mobile menu, Hero, SectionHeading, PageIntro, ProjectArtwork, ProjectCard, ProjectGrid, WorkExplorer, MediaFrame, OptimizedImage, ProjectGallery, CaseStudySection, CaseModuleView, VideoFrame, DeviceMockup, BeforeAfter, ServiceGrid, ProcessTimeline, TemplateCard, TemplateCatalog, InquiryForm, FinalCTA. The footer is currently shared in the root layout.

## Design system

All primary colors, space and content width are CSS variables at the top of app/globals.css. Editorial system fonts avoid external font requests. Motion uses CSS and respects reduced motion. Hero copy/media lives in data/site.ts. Optional hero video is muted; image fallback remains available. Native disclosure controls, labeled form inputs, focus styling, skip navigation, touch targets and semantic landmarks are included.

## Asset workflow

No approved assets existed in the repository. Two original AI-generated concept images were created; they are not approved client work. Their lossless masters are preserved outside the repository at:

`C:/Users/ernes/.codex/visualizations/2026/09/15/01a0a5f6-4758-70e3-b555-a568a899ed77/`

See ASSET-INVENTORY.md. Copy approved masters into your own controlled archive, preserve them unchanged, then create web derivatives. Add actual image dimensions and descriptive alt text to each data record. For decorative imagery use an empty alt. Images use WebP derivatives at 768 and 1536 pixels with responsive srcset, explicit dimensions and lazy loading except for priority images. New imagery needs its own size/format checks; the current srcset helper recognizes only the two supplied concept assets.

Organize derivatives under public/assets/brand, projects, templates, studio and ui. Never add uncertain assets automatically. Empty asset categories include .gitkeep files.

## Add a portfolio project

1. Add a typed Project record to data/projects.ts with a unique slug and order.
2. Supply verified client, year, categories, industries, services and copy. Use null/omitted fields until facts are approved.
3. Set status to draft to hide it from listings, detail retrieval and sitemap; placeholder for review-only concept content; published for approved work.
4. Add heroImage, optional heroVideo and gallery. Add composable modules for text, galleries, video, devices or before/after comparisons.
5. Use featured to include it in selected work. The oversized home feature currently chooses SmokeSuite explicitly in app/page.tsx; change that selection when a final featured case study is approved.
6. Run QA and review the actual visuals before publication.

ContentRepository in lib/content.ts is asynchronous so a CMS can replace the local implementation without changing page consumers. Do not expose drafts through a future API.

## Add a service

Add a slug, title, intro and items in data/services.ts. The specialist-discipline disclosure uses this source. The eight top-level practices are in data/practices.ts. Add a corresponding inquiry choice in lib/inquiry.ts only when visitors should be able to request it separately.

## Add a template

Add a TemplateProduct in data/templates.ts. Keep price null and status placeholder until there is an actual product. Add verified formats, contents, license, compatibility, preview and asset information before launch. The V1 UI is deliberately a coming-soon catalog; implement status-aware purchase behavior when a real product is introduced. Replace the unavailable CommerceProvider with a server-owned Stripe or other provider, validate product IDs and calculate prices server-side. Verify signed webhooks and grant downloads only after verified payment. Never trust a browser-supplied amount.

## Inquiry behavior and connection checklist

The project inquiry UI keeps its brief only in React memory. It does not use localStorage, upload files or transmit the draft. Download produces a local JSON copy. Clicking Submit project displays an explicit **not submitted** message.

The API contract is implemented independently and returns HTTP 503 for a valid request while unconfigured; invalid JSON, schema failures, oversized requests, unsupported media and cross-origin requests are rejected. It does not log or persist the request. Upload controls are disabled. Upload policy and adapter interfaces are present, with a five-file/10 MB per-file allowlist as a future starting point.

Before enabling delivery:

1. Select a durable inquiry store and studio destination; add a server-side adapter.
2. Add distributed rate limiting and server-verified bot protection. The honeypot alone is not sufficient.
3. Implement idempotency and retry-safe storage; acknowledge success only after durable acceptance.
4. Finalize retention, access controls, privacy notice and consent copy.
5. Implement short-lived upload authorization, MIME/magic-byte validation, malware scanning and private storage. Do not trust filename extensions or public download URLs.
6. Connect the UI to the API and replace preview language only after end-to-end delivery tests.
7. Test backend failure, duplicate submission, throttling and delivery monitoring.

## Environment variables

Copy .env.example to .env.local if needed. No credentials are included.

- NEXT_PUBLIC_SITE_URL: trusted public origin for canonical and social URLs. Rebuild after changing this public value.
- INDEXING_ENABLED: false by default; switch to true only after approved public launch. Both robots metadata and robots.txt protect the preview from indexing.
- Backend secrets: none required in V1. Do not place future private keys in NEXT_PUBLIC_ variables or browser code.

## Deployment

The registered Site identity is in .openai/hosting.json. Preserve its project_id. The initial review site is owner-private. For Sites, build locally, commit and push the exact source to the registered repository, package validated dist output with the Sites package helper, save the version and deploy privately. Never package project source as the runtime artifact or commit credentials. Manage runtime secrets through the hosting environment.

This application is portable at the data/component layer. Moving to stock Next.js requires replacing the Vinext/Cloudflare build setup and validating route, metadata, image and API behavior again.

## Future Supabase integration notes

No Supabase project, SDK, schema or credentials are configured. A future server-side implementation can back ContentRepository with project/service/product records and private inquiry storage. Keep draft/admin data separate from public content, require authenticated administration, enable row-level security, define explicit policies and use private storage for inquiries. Keep service-role credentials server-only. Verify current Supabase docs and migrations when that phase starts; these notes are architecture guidance, not a tested integration.

## Release status

See QA-REPORT.md for completed checks and limits. See DYNASTY-WORKS-ROADMAP.md for phases. Public business launch still requires approved case studies and assets, real inquiry delivery, product information, domain choice and a privacy notice.

Navigation uses components/site-link.tsx for native document transitions after production QA identified a Vinext prefetch issue. See QA-REPORT.md.

## V1.1 / V1.2 Company Builder expansion

See COMPANY-BUILDER-ARCHITECTURE.md and EXPANSION-REPORT.md for the full model, professional boundaries and file inventory. The seven-step Company Builder saves a versioned draft in sessionStorage for the current tab, validates restored data, and offers local download and clearing. It makes no submission request. This session-storage behavior is separate from the original project inquiry form, which remains memory-only.

Run `node scripts/qa-company-builder.mjs` for business-type eligibility, stale-selection removal, saved-draft validation, proof gating and unpublished-offering checks. The test uses the existing esbuild dependency; no new package was installed.

No numeric budget bands are published. Package and retainer placeholders remain drafts with null prices/timelines. The professional network contains categories only, not named members. No tracker or analytics provider is enabled. The builder stays noindex even when public content indexing is later enabled.

## V1.3 — Commercial roadmap engine

The service catalog now defines 122 services across eight practices. Seven preliminary package structures and five growth partnerships reference catalog IDs, with no public prices. The builder adds stage, readiness, asset suppression, working preference and a deterministic roadmap with dependency-aware phases and honest future-work labels. See SERVICE-CATALOG.md, PACKAGE-ENGINE.md, RECOMMENDATION-ENGINE.md and COMMERCIAL-ARCHITECTURE.md.

New routes: /capabilities, /capabilities/[practice] (eight practices), /growth-partnership. Existing /services and portfolio routes remain available. Contact and written budget are now memory-only; only non-contact selections persist for the tab session. Reload requires re-entry. No backend transmission, CRM, pricing or tracking is enabled.

Additional regression command: node scripts/qa-recommendation-engine.mjs. Private commercial type contracts stay outside runtime imports in server/internal-pricing.ts.

## V1.4 — Founder Blueprint and disabled secure-intake preparation

Founder Blueprint is now the first approved engagement at **$1,500 USD**. This supersedes earlier statements that every package is unpriced. No other package price is approved. /founder-blueprint presents its scope; /founder-blueprint/intake offers five progressive, memory-only screens with validation and local download. The builder recommends Blueprint when strategic sequencing is appropriate and preserves direct paths for mature single-service needs.

The new /api/submissions/general, /api/submissions/builder and /api/submissions/blueprint handlers validate strict bounded requests, but production dependencies are null and valid requests return 503 not_configured. The forms do not transmit. No Supabase project, payment processor, upload storage or portal has been connected. The reviewed-SQL proposal under docs/database is not deployed.

See FOUNDER-BLUEPRINT.md, INQUIRY-PIPELINE.md, SUPABASE-INTEGRATION-PLAN.md and PACKAGE-ENGINE.md. Run scripts/qa-founder-blueprint.mjs for the new synthetic recommendation/validation/security tests alongside prior QA suites. Real database integration and permission tests remain mandatory before activation.

## V1.5 creative system

See DYNASTY-WORKS-BRAND-SYSTEM.md and PORTFOLIO-ASSET-AUDIT.md. The concept derivatives described above are now preserved under internal-assets, outside public hosting. All unapproved project detail routes are gated; this supersedes the earlier placeholder publication behavior. /creative-review is a noindex non-navigation review route; /work/archive is an approval-gated creative library. The business architecture, $1,500 Blueprint and disabled backend are unchanged.

## V1.6 approved production identity

Direction 03 is now the locked production mark. See DYNASTY-WORKS-BRAND-SYSTEM.md and BRAND-ASSET-MANIFEST.md for production usage, sources, optical icon derivatives and document/social templates. /creative-review labels Direction 03 approved and the other territories archived. This supersedes V1.5 identity approval-pending notes only; portfolio approval gates remain unchanged.


## V1.7 — AI + Automation Systems

New /automation capability, conditional Builder discovery and conservative automation roadmap. All provider adapters remain disabled. The 122 core services, eight practices, seven packages, five partnership types, $1,500 Founder Blueprint and 22 Direction 03 brand assets are preserved. See [AI-AUTOMATION-SYSTEMS.md](AI-AUTOMATION-SYSTEMS.md), [WORKFLOW-ARCHITECTURE.md](WORKFLOW-ARCHITECTURE.md), [AUTOMATION-SECURITY.md](AUTOMATION-SECURITY.md), [LEAD-ENGINE.md](LEAD-ENGINE.md), [CONTENT-ENGINE.md](CONTENT-ENGINE.md) and [N8N-INTEGRATION-PLAN.md](N8N-INTEGRATION-PLAN.md).

Automation model regression: node scripts/qa-automation.mjs. No credentials, database or workflow setup is required for this release.


## V1.8 — digital experience

New cinematic homepage, interactive build/identity/Blueprint/workflow moments, refined navigation and Company Builder presentation. Existing recommendation logic, prices, service/package catalog, brand assets and disabled integrations are unchanged. /creative-review includes the internal Digital Experience register and remains noindex.

See [DWS-VISUAL-ASSET-PLAN.md](DWS-VISUAL-ASSET-PLAN.md) for approved-media requirements, responsive crops and budgets. No proprietary raster/3D assets or client work were fabricated; precise vector and native UI treatments remain until separate media approval. Experience QA: node scripts/qa-experience.mjs against the local production server. Motion honors device preferences and the footer's Reduce motion control.
