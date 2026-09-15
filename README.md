# Dynasty Works Studio — Version 1 foundation

An editorial studio website and extensible portfolio foundation. All six project records are explicitly labeled placeholders; client attribution, years, deliverables and outcomes are not fabricated. Inquiries and commerce are intentionally unavailable until real providers are connected.

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
- /services — 12 expandable capability groups
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

Add a slug, title, intro and items in data/services.ts. The home and capabilities page render the same source. Add a corresponding inquiry choice in lib/inquiry.ts only when visitors should be able to request it separately.

## Add a template

Add a TemplateProduct in data/templates.ts. Keep price null and status placeholder until there is an actual product. Add verified formats, contents, license, compatibility, preview and asset information before launch. The V1 UI is deliberately a coming-soon catalog; implement status-aware purchase behavior when a real product is introduced. Replace the unavailable CommerceProvider with a server-owned Stripe or other provider, validate product IDs and calculate prices server-side. Verify signed webhooks and grant downloads only after verified payment. Never trust a browser-supplied amount.

## Inquiry behavior and connection checklist

The UI keeps its brief only in React memory. It does not use localStorage, upload files or transmit the draft. Download produces a local JSON copy. Clicking Submit project displays an explicit **not submitted** message.

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

