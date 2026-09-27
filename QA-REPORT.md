# Version 1 QA report
Date: 2026-09-15

## Passed
- Production build completed successfully.
- ESLint: zero errors and zero warnings.
- TypeScript: zero errors.
- All 12 rendered pages return HTTP 200. Missing project returns HTTP 404.
- Sitemap and robots endpoints return HTTP 200.
- Automated checks covered 29 production internal links/assets, unique page titles, descriptions, canonicals, one H1 per page and absence of lorem ipsum.
- Nine API checks: unconfigured response, invalid email, honeypot, unsafe URL scheme, empty input, malformed JSON, unsupported media type, cross-origin request and oversized request.
- Browser checked all 12 rendered pages at 320, 375, 390, 430, 768, 1024, 1440, 1920 and 2560 pixels: no horizontal page overflow.
- Mobile menu open/navigation/close behavior checked.
- Portfolio UI filtering and WebMCP filtering checked. Invalid WebMCP category is rejected without corrupting filter state.
- Capabilities disclosures and template details checked.
- Four-step inquiry tested with synthetic data: service requirement, description/details, email validation, acknowledgment, review, local download and explicit not-submitted message.
- Optimized image loading and alt text checked in the browser.
- Production navigation and filter interactivity checked after fixing a runtime prefetch issue.
- Basic source secret-pattern scan found no credentials. Environment template contains no private values.
- Original assets preserved; client facts, products, prices and outcomes are clearly unapproved or absent.

## Runtime findings and resolutions
The Sites starter uses Vinext beta with Next.js conventions. Its production Link prefetch/navigation failed during browser QA. Navigation now uses a small native anchor wrapper (components/site-link.tsx), retaining ordinary document navigation and avoiding the failing client routing path. There were no new browser errors after that fix.

The local Wrangler proxy intermittently returned a plain-text worker-restart HTTP 503, separately from the intentional JSON 503 returned by the disabled inquiry endpoint. This resembles the [reported Cloudflare local proxy issue](https://github.com/cloudflare/workers-sdk/issues/14641). The final regression run passed with one explicitly counted retry of that exact local proxy error. Application errors are not retried by the test. The user-facing form never transmits a draft while delivery is unconfigured.

On Windows, rebuilding while the production emulator held dist open caused a file-lock failure. Stopping that emulator before rebuilding resolved it. The development preview stayed available.

## Scope limits
- Browser checks used the available Chromium-based environment. Safari, Firefox, physical iOS/Android devices, assistive-technology audits and real-user performance measurements remain for launch QA.
- No Lighthouse score or WCAG certification is claimed.
- Optional video, before/after and device modules are typed and implemented but await approved real assets for content-specific visual QA.
- Native anchors trigger full document navigation; animated SPA transitions are not implemented.
- No external inquiry delivery, uploads, payments or CMS persistence is enabled or represented as tested.
- Retina assets are limited to the generated 1536-pixel masters; replace with higher-resolution approved imagery for large displays where needed.
- Public indexing remains disabled pending content approval.


## V1.1 + V1.2 expansion verification — September 15, 2026

- Production build, TypeScript and ESLint passed; lint reported zero warnings/errors. Git whitespace check passed.
- All 14 rendered routes, robots and sitemap returned HTTP 200; missing case study returned 404. Verified 36 production internal links/assets, metadata and heading checks, and nine inquiry API cases. One retry was limited to the previously documented local Wrangler restart error.
- Company-builder model tests passed: physical-market eligibility, software exclusions, explicit physical intent, stale-selection pruning, optional recommendations, draft validation/recovery, contact/budget validation, evidence gates, eight stages/practices and unapproved offering data.
- All seven builder steps were checked for horizontal overflow at 320, 375, 390, 430, 768, 1024, 1440, 1920 and 2560 pixels. Eight representative site routes were also checked at those nine widths; no page overflow was found.
- Browser checks covered founder pathways, carried milestones, required fields, email errors, budget discussion, conditional distribution options, back navigation, session reload recovery, review, local download, honest not-submitted messaging and draft clearing. Mobile navigation and conditional inquiry options passed.
- Production browser flow completed all seven steps with synthetic details and produced no new browser warnings/errors. Synthetic drafts were cleared. No real inquiry was transmitted.
- Existing QA scope limits above still apply. No new backend, account system, payments, analytics collection or professional partner integration is represented as live.

## V1.3 verification — September 15, 2026

- Production build passed. TypeScript passed. ESLint passed with zero warnings/errors.
- All 24 rendered pages returned 200; robots and sitemap returned 200. Verified 48 production internal links/assets, metadata/heading checks and nine API cases. One exact local Wrangler restart error retry was counted, consistent with the earlier documented emulator issue.
- Missing practice and project routes returned 404. Requests for SERVICE-CATALOG.md and server/internal-pricing.ts returned 404. A compiled-client scan found no internal pricing field names or service-role/private-key markers. No private documentation is imported into application code or placed in public assets.
- All seven builder steps passed horizontal overflow checks at 320, 375, 390, 430, 768, 1024, 1440, 1920 and 2560 pixels. Thirteen representative routes (home, capabilities, all eight practice pages, growth partnerships, legacy services and templates) passed at the same widths.
- Browser verified a Food / Beverage idea roadmap with eight phases and 27 services; production Technology scenario had two phases and three services with Dynasty Guided, and no physical-market choices. Nested service disclosures, local roadmap download and explicit not-submitted strategy review messaging worked. Contact email was empty after reload while scope selections recovered. Synthetic drafts were cleared.
- Browser console review found no new warnings/errors. Browser-control navigation/locator deadlines were recovered by inspecting the resulting page; they did not correspond to application console errors. Screenshot capture in the available in-app browser remained intermittently clipped/stale; responsive conclusions rely on live viewport and DOM measurements, not on those captures.
- Both model suites passed. Required scenarios: Food / Beverage idea (8 phases / 27 services / Full Company Build), Fashion existing brand (3 / 6 / Company Launch), Technology new company (3 / 12 / Company Launch), Professional Service existing company (4 / 6 / Company Launch), Hospitality growth (4 / 10 / Market Expansion), E-commerce optimization (3 / 4 / Growth Partnership). Counts reflect these specific tested inputs, not fixed business-type prescriptions.
- Additional model checks cover dependency ordering/references, product readiness, absent website/store optimization, asset suppression, explicit identity redesign, physical-intent override, DIY/DWY preference, launch-window guidance, package price nulls and consent=false in the future payload.

Prior browser/device/accessibility and backend scope limits remain. No Lighthouse or cross-browser certification is claimed.

## V1.4 verification — September 15, 2026

- Production build, TypeScript and ESLint passed. The 122-service catalog and prior routes remain intact.
- All 26 rendered pages plus robots/sitemap returned 200; missing project returned 404. Verified 56 production internal links/assets and nine legacy inquiry API cases. The previously documented local Wrangler restart required one counted retry in the legacy suite.
- Blueprint model/security tests passed: early founder fit, mature website-update non-fit, established identity work, food/beverage future commercialization, software physical-market exclusions, uncertain scope, DIY preference, approved-price uniqueness and roadmap text.
- Synthetic handler tests covered disabled state, origin/media-type/JSON/size validation, honeypot, explicit consent, strict rejection of posted recommendation fields, mock-only limiter/bot/persistence success/failure/conflict and the exact-revision human-review delivery gate.
- Six additional HTTP checks against the compiled local server passed: all three valid submission types return 503 not_configured, invalid input returns 422, foreign origin 403 and unknown type 404. This suite was rerun once after the local emulator returned its known plain-text worker-restart error. No real backend write was attempted.
- /docs/database/inquiry-schema.proposed.sql, /FOUNDER-BLUEPRINT.md and /server/submission-adapters.ts returned 404. Compiled-client scans found no Supabase secret variable, internal lead-status label, private schema, persistence implementation or private margin fields.
- Founder Blueprint page, all five intake steps and the updated builder result passed horizontal overflow checks at 320, 375, 390, 430, 768, 1024, 1440, 1920 and 2560 pixels. Desktop, tablet and mobile controls remained usable; capture clipping in the in-app browser is the earlier documented tooling limitation.
- Browser checks passed: approved price/scope, CTA to intake, empty-field validation, unsafe reference rejection, applicable physical-market goals, review, local download, explicit disabled status, clearing on reload, uncertain builder scope, Blueprint reason/price and CTA. Synthetic drafts were cleared. Final production offer and post-fix browser-console checks showed no new warnings/errors. One temporary development duplicate-import error was fixed before final checks.
- Existing company-builder and six-scenario recommendation regression suites passed with updated approved-price/Blueprint expectations.

Database SQL remains an unapplied proposal. Real Supabase RLS/grant/transaction tests, distributed rate-limit/bot integration, payments, uploads and portal authorization have not been performed or represented as active. Prior cross-browser/device/accessibility scope limits continue to apply.
