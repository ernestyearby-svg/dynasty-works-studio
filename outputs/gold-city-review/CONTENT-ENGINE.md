# Internal workflow 02 — Content Engine

Status: architecture only. No content queue UI or publishing integration is activated.

Content calendar → brief → creative / draft → approval → platform adaptation → scheduling → Instagram / YouTube / TikTok / LinkedIn → analytics → weekly report → archive.

## Queue and revisions
ContentQueueItem in types/automation.ts includes platform, campaign, private assets, caption, scheduled time/time zone, status, revision, approval and provider reference. Statuses: DRAFT, REVIEW, APPROVED, SCHEDULED, PUBLISHED, FAILED, ARCHIVED. Future actions: Preview, Approve, Request Revision, Schedule, Cancel.

Draft → review → approved → scheduled → published → archived. Review can return to draft. Failed items return to review before rescheduling. Revisions to caption, asset, account, metadata or time invalidate approval. Platform adaptation after editorial approval must produce a final per-platform preview; any material adaptation requires renewed approval of the exact publication payload. Approval must never apply to unseen final content.

## Permissions and truthful state
Authorized editor prepares; reviewer approves; publisher schedules; administrator configures accounts. Tenant-scoped server role checks enforce separation. PUBLISHED requires a verified provider receipt/reconciliation, never an optimistic browser click. Cancel first attempts remote cancellation and confirms the result; if already published, report that fact and require a separate reviewed removal decision. Preview must not reveal private assets across tenants.

## Adapter boundaries
SocialAdapter handles per-provider capabilities, account auth scopes, media validation and upload, caption/metadata/video requirements, schedule availability, rate limits, publishing receipt, reconciliation and cancellation. Instagram, YouTube, TikTok and LinkedIn require separate adapters. Do not hardcode platform limits into UI or assume publishing API access; verify current documentation, app review and actual account capabilities at implementation. Each platform may require a different format and authorization flow.

## Assets and security
Private originals, approved version references, expiring authorized preview links, rights/consent checks and explicit campaign attribution. Never store OAuth or refresh tokens in the browser. Use server-side provider authorization, encrypted credentials, rotation and revocation handling. Treat briefs and asset metadata as untrusted inputs to AI tools.

## Monitoring and acceptance
Check drafts/approvals, scheduling time zones and daylight-saving changes, token expiry, rate limits, duplicates, failed uploads, partial multi-platform publication and unknown results. One platform failure must not republish already successful posts. Use per-platform action IDs. Analytics permissions may differ from publishing permissions; report gaps, not fabricated zeros. Weekly report only uses observed data. Require a named editorial owner, platform authorizations, approval policy, asset rights, retention and escalation rules before activation.
