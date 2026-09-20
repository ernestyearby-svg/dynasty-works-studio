# Recommendation engine — V1.3

## Inputs and output

`lib/recommendation-engine.ts` evaluates business type, explicit stage (with legacy milestone inference), existing assets, selected needs, physical-market intent, product/location readiness, storefront readiness, identity redesign intent, launch window and working preference. It returns catalog-backed service IDs, reasons, requested/dependency/suggested provenance, initial/future timing, prerequisite notes, applicable phases, engagement and specialist notes. No AI, price estimate or binding schedule is generated.

The seven-screen builder is preserved. Stage/assets live in Starting point, working preference in Range and an optional referral source in Contact. Summary displays only applicable Foundation, Brand, Product / Infrastructure, Digital, Commercialization, Launch, Distribution, Activation and Growth phases.

## Rule order

1. Normalize and prune irrelevant needs.
2. Map requested needs to catalog IDs.
3. Recursively insert prerequisites, deduplicate and detect recursion cycles defensively.
4. Suppress existing name/identity/formation work; explicit identity redesign permits identity work. Existing website requests begin with optimization/review. Optimization without the matching website/store adds creation work instead.
5. Add bounded type-specific suggestions only where relevant to expressed scope (hospitality growth also uses its explicit stage). These act as qualitative weights, not stereotypes or predictive scores.
6. Flag distribution/activation as future until product/location readiness is declared; activation at Idea stage is future even with readiness checked. Early growth suggestions are future. Future prerequisite work makes dependent work future.
7. Group services in phase order, omitting empty phases. Within each phase prerequisites precede dependents.
8. Choose a non-binding package using stage, physical intent, phase breadth and needs. Explicit DIY/DWY preference overrides. Short launch windows emphasize initial scope and staged review, never shorter promised delivery.

Food/beverage may receive visualization, licensing research, future tastings and later expansion. Fashion can receive collection visualization and campaign work. Technology emphasizes data/analytics. Professional services emphasize positioning and an enquiry path. Hospitality growth adds venue activation and brand management. E-commerce adds email and analytics. Software-only requests receive no distribution or physical activation.

## Engagement precedence

Growing + market intent → Market Expansion; ongoing/optimization → Growth Partnership; seven or more phases with company setup → Full Company Build; physical market scope → Brand-to-Market; brand/digital or digital/launch → Company Launch; brand without digital → Identity Build; broad remaining scope → Company Launch; early strategy → Founder Blueprint. A focused remaining scope can become Dynasty Guided. Preference can select Dynasty Tools or Guided without changing specialist requirements.

## Limits

Readiness is self-reported, not certification. Initial scope still requires review. Dependencies are planning relationships, not dates. Suggestions are explicitly optional and can be reconsidered after scope changes. The engine cannot assess licensing, feasibility, capacity, commercial success or data quality. Package pricing and approval never follow automatically from recommendation.

## Verification

`scripts/qa-recommendation-engine.mjs` covers the six required business scenarios plus catalog references, existing asset suppression, readiness, explicit redesign, absent website/store optimization, physical intent override, DIY/DWY, timelines and payload consent. `scripts/qa-company-builder.mjs` preserves V1.2 regression coverage.

## V1.4 recommendation precedence update

The V1.3 package fallback above is superseded: an early founder (Idea or Preparing to launch) with at most one existing infrastructure category and a selected need/uncertainty, or at least three needs across three phases, is considered for Founder Blueprint. Explicit uncertainty also qualifies unless it accompanies a single defined need in a mature business. This adds a strategic first step without altering the roadmap's future execution services. Mature one-service work stays direct/growth, and explicit DIY preference remains Dynasty Tools. Guide me can resolve to the more specific Founder Blueprint when it fits. The public fee is $1,500 only for that approved strategy engagement.

The download contains user-facing reasons and phase priorities, not scoring rules, private prices or margins. No AI is claimed. New tests cover fit/non-fit, food/beverage future work, software exclusions, approved-price uniqueness and uncertainty. See scripts/qa-founder-blueprint.mjs.
