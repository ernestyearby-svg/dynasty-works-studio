# Package engine — V1.3

`data/packages.ts` centrally defines seven preliminary engagement structures: Founder Blueprint, Identity Build, Company Launch, Brand-to-Market, Full Company Build, Market Expansion and Growth Partnership. Each references catalog IDs, supports optional services, buying mode, applicability, featured/active state and a null publicPrice. `data/offerings.ts` adapts these into the prior draft-card interface; no duplicate package list governs recommendations.

The packages are starting structures, not fixed promises. The roadmap's selected scope takes precedence over a package's possible contents. Existing assets and physical-market exclusions continue to apply; recommending Company Launch does not force identity replacement. All public prices are null. Package approval, estimates, capacity and acceptance remain manual future work.

## Buying modes

DIY = Dynasty Tools. DWY = Dynasty Guided. DFY = Dynasty Works. GROWTH = ongoing partnerships. The builder asks how the prospect wants to work. Explicit DIY or guidance preference takes priority over package breadth. Focused scopes may receive Dynasty Guided. Tools are coming soon until actual available template products exist.

## Recurring support

Studio Partner: design and creative. Digital Partner: website/store optimization. Content Partner: social/video/campaign work. Automation Partner: workflow maintenance. Growth Partner: integrated creative/digital/commercialization. /growth-partnership explains these as preliminary scopes with no billing or recurring contract enabled.

## Private pricing separation

`server/internal-pricing.ts` is a type-only future contract for internalPricingStatus, estimatedHours, internalCost, contractorCost, softwareCost, thirdPartyCost, targetGrossMargin, minimumPrice, recommendedPrice and rushMultiplier. There are no instantiated values. It is not imported by runtime or client code. Future records must live behind staff authorization, never in exported public catalog/package JSON. Approving a public price requires a separate sanitized publication step; it must not serialize an internal record.
