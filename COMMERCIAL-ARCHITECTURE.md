# Commercial architecture — V1.3

## Connected systems

Central catalog → package composition → deterministic recommendations → local Dynasty Build Roadmap. Portfolio remains the evidence layer. Public pages show scope and conversion paths without internal commercial figures. These Markdown documents are repository artifacts, outside public assets and application imports; the deployment archive includes compiled output only.

## Local lead interface

`BuilderLeadPayload` supports builderSessionId, createdAt, businessType, businessStage, existingAssets, selectedNeeds, launchTimeline, budgetRange, recommendedServices, recommendedPhases, recommendedPackage, contactInformation, consentState and referralSource. Identity is created in memory on load/reset. Payload construction is pure and has no transport. submissionConsent is explicitly false. Local acknowledgment is not consent to send a lead.

Non-contact choices may survive a reload through tab-session storage. Name, company, email, phone, website, written budget, referral text and acknowledgment remain memory-only; any prior stored contact fields are scrubbed when restoring the old draft. Reload requires contact re-entry. Users can clear the draft or download their roadmap locally. A downloaded file is under their control. No lead, quote, analytics event or contact payload is submitted. The disabled intake endpoint remains disabled.

## Future CRM flow — not implemented

Website → Company Builder → validated server intake → Supabase lead record → staff project review → proposal → client → project → private client portal.

Before enabling intake: approve consent/privacy/retention policy, implement input validation and bounded request sizes, rate limiting and anti-spam, use server-side secrets, and grant least privilege. Authenticate staff and clients where applicable. Enable Row Level Security on all exposed tables with actual ownership or membership policies; authentication alone is insufficient. Keep private documents in private storage and authorize short-lived download URLs. Never expose service-role keys, internal pricing, client documents or private project records. Recompute recommendations server-side from validated inputs rather than trusting posted prices or service decisions. Test cross-client isolation, staff roles, spam resistance, secret separation and deletion/retention behavior before delivery is enabled. No database, schema, policy or integration is created by V1.3.

## Analytics

The no-op typed adapter prepares builder_started, builder_completed, roadmap_generated, package_recommended, service_viewed, practice_viewed, roadmap_downloaded, strategy_review_clicked, template_viewed, project_inquiry_started and project_inquiry_submitted. Builder events are wired; page-view and successful submission hooks remain integration points. Do not emit successful submission while delivery is disabled. No cookies, identifiers, external requests or invasive tracking are active. Future events must avoid contact fields and sensitive scope text.

## Commercial approval queue

Service scope/capacity; package contents and optional add-ons; private pricing method; recurring cadence; professional authorization/jurisdictions; actual available tools; verified case studies; intake destination; client consent and retention; public-launch approval. The next useful milestone is one approved engagement scope and secure, consented durable inquiry delivery.
