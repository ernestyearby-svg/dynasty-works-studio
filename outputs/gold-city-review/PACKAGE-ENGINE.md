# Package engine — V1.4

## Canonical paid engagement

Founder Blueprint is approved at **$1,500 USD**, centrally defined in data/founder-blueprint.ts. It includes the strategy session, concept/market work, company/brand/digital/commercialization/launch roadmaps, 30/60/90 execution sequence and reviewed digital document. Its page is /founder-blueprint. Other six packages have publicPrice=null and remain preliminary. No checkout, recurring billing or payment provider is active.

## Architecture preserved

Seven engagement structures remain in data/packages.ts: Founder Blueprint, Identity Build, Company Launch, Brand-to-Market, Full Company Build, Market Expansion and Growth Partnership. Catalog IDs define service relationships. The prior package-card shape in data/offerings.ts is a compatibility adapter; it now recognizes Blueprint approval and price. The roadmap describes possible execution work; the $1,500 Blueprint price covers the strategic engagement, not all execution services in the roadmap.

DIY / Dynasty Tools and DWY / Dynasty Guided remain available. Founder Blueprint can be the appropriate guided engagement for a founder needing strategic sequencing. Explicit DIY preference is preserved. Mature single-service needs do not receive Blueprint automatically. See RECOMMENDATION-ENGINE.md.

Five growth partnership structures remain unchanged and unpriced: Studio, Digital, Content, Automation and Growth Partner. They do not activate recurring services or billing.

## Private commercial separation

The internal pricing contract remains type-only in server/internal-pricing.ts, outside client imports, with no costs/margins populated. The approved public Blueprint amount is a separate sanitized offer. Future checkout must obtain the offer server-side, verify processor webhooks and reconcile idempotently before onboarding; never accept client amounts or redirect parameters as payment evidence.

## Decisions

Approve capacity, turnaround, research depth, revisions, payment/refund/tax terms, jurisdictions and professional-resource handling. No approval is inferred for pricing another package. See FOUNDER-BLUEPRINT.md and SUPABASE-INTEGRATION-PLAN.md for current scope and activation requirements.
