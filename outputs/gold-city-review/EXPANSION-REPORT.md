# V1.1 + V1.2 expansion report

## Preserved

The existing Site identity, hosting, framework, dependencies, visual tokens, original project data, asset masters/derivatives, portfolio grid, case-study system, Templates catalog and inquiry form remain. No reinitialization, new backend, replacement theme or new stock/concept imagery was introduced.

## Files created

- app/start-a-business/page.tsx
- app/start-a-business/builder/page.tsx
- components/company-builder.tsx
- components/company-sections.tsx
- components/founder-pathways.tsx
- data/company-builder.ts
- data/practices.ts
- data/offerings.ts
- lib/company-builder.ts
- lib/analytics.ts
- types/company.ts
- scripts/qa-company-builder.mjs
- COMPANY-BUILDER-ARCHITECTURE.md
- EXPANSION-REPORT.md

## Files modified

- app/page.tsx: company-building hero entrances, invitation, connected journey, eight practices and template preview; original portfolio presentation retained.
- app/globals.css: company journey, practices, guided builder and responsive navigation styles using the original tokens.
- app/layout.tsx: integrated company-building metadata.
- app/services/page.tsx: eight practices and market-entry framework; original twelve disciplines remain in a disclosure.
- app/templates/page.tsx: DIY / guided / full-studio engagement context.
- app/work/[slug]/page.tsx and data/projects.ts: optional verified market sections.
- data/site.ts and components/navbar.tsx: new positioning and six-item navigation.
- components/studio.tsx: home entrance CTAs and cross-service relationships.
- components/inquiry-form.tsx and lib/inquiry.ts: formation/market choices, physical-market eligibility and removal of unapproved numeric budget bands.
- app/sitemap.ts: flagship founder page added; private local builder intentionally omitted from indexing.
- scripts/qa.mjs: new route coverage.
- eslint.config.mjs: ignores generated private packaging/emulator output.
- README.md, DYNASTY-WORKS-ROADMAP.md, QA-REPORT.md: architecture, release and verification updates.

## Routes added

/start-a-business and /start-a-business/builder.
Future stage pages and /portal remain unimplemented and unlinked.

## Components added

CompanyBuilder, FounderPathways, CompanyJourney, PracticeGrid, RelatedServices, ProfessionalBoundary, CompanyInvitation, MarketEntry, EngagementLevels, PackageCard, TrustEvidence, MarketCaseSections.
Existing checkbox/radio/progress primitives are reused and styled at the call site.

## Data models added

CompanyBuild, RecommendedService, Client, Company, Project, ProjectPhase, Service, Deliverable, Task, Approval, Asset, Document, Invoice, Message, CompanyInquiry, professional-network categories/members, VerifiedProof, MarketCaseSection and StudioPackage. Existing Inquiry/Template types are reused. These are TypeScript contracts, not deployed database tables.

## Company Builder status

Functional seven-step frontend with validation, type-aware optional recommendations, editable scope, reload recovery in tab-session storage, local summary download and clear-draft behavior. No form payload is sent, saved by the studio or presented as submitted. Budget bands, quotes and delivery timelines are not invented.

## Security considerations

Sensitive backend intake, private document storage, authentication, access policies, row-level security, signed URLs, audits, payment handling and real analytics remain future work. No insecure portal is exposed. Professional boundaries are shown in relevant contexts. Approved/source-backed market sections and proof gates prevent unsupported seeded claims. All existing case studies remain placeholders.

## Business decisions still needed

Approved company-building scope, professional-review process, real licensed providers and jurisdictions, package/retainer scope, budget ranges, actual template products, partner permissions, verified retail/distribution evidence, intake destination, retention/privacy policy and public launch approval.

## Recommended next phase

Approve one complete flagship case study and the company-builder service scope, then implement secure durable inquiry delivery and onboarding. See the seven-phase roadmap.

## Final verification

Production build, TypeScript, ESLint and company-builder model checks passed. HTTP checks covered 14 pages, 36 internal links/assets, nine API cases, robots/sitemap and the missing-project 404. Responsive checks covered all seven builder steps and eight representative routes at nine widths from 320 to 2560 pixels. Production browser interaction completed the guided flow without new console warnings/errors. See QA-REPORT.md for scope and the existing local emulator caveat.

Formatting-only changes also touched app/not-found.tsx and app/studio/page.tsx. Dependencies and lockfile were unchanged.
