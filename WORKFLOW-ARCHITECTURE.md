# Workflow architecture — V1.7

## Proposed internal operating system
Website + Company Builder + Founder Blueprint
→ system of record (Supabase is a candidate)
→ workflow orchestration (n8n is a candidate)
→ email / CRM / content / social / documents / projects / analytics / notifications
→ internal operating dashboard.

These are responsibility boundaries, not deployed connections. Keep provider logic behind server adapters and business policy outside UI components. The website's existing backend-disabled response is preserved.

## Domain and record design
Tenant-scoped entities: workflow_definition, workflow_run, workflow_action, workflow_approval, audit_event, integration_connection, content_item, content_revision, project_record, failure_queue and idempotency_reservation. Every consequential action records tenant, workflow, record, revision, payload digest, mode and idempotency key. Provider references are stored separately from credentials. Define unique (tenant_id, workflow_id, idempotency_key) constraints and compare payload digests on conflict. These are proposed tables, not migrations.

## Execution modes
1. Draft only: prepare; a human executes separately.
2. Approval required: prepare an exact action; an authorized actor approves; server rechecks and executes.
3. Automated: previously approved low-risk rules only. Limits include permitted actions, destinations, quantities, schedule and escalation conditions.

Low: internal notifications, organization, reports and drafts. Medium: routine publishing, customer follow-up, CRM updates. Higher consequence: money, legal or contractual communication, sensitive communication, destructive data changes and major public statements. Medium and higher-consequence actions require approval in this initial architecture; draft-only remains the default. A future financial/legal workflow requires separate authorization and safeguards. Payments are excluded from V1.7.

## Approval invariants
Approval binds tenant, action ID, exact payload digest and revision, recipient/account, asset versions, schedule and expiry. Editing any material field invalidates approval. The server resolves actor identity and tenant roles from trusted authorization data; form inputs are never authority. Recheck approval/revocation and claim the action atomically immediately before dispatch. Expired approval pauses execution. Prevent race conditions with revision checks and transactional state transitions. The pure planner is not a replacement for this server implementation.

## Engine maps
Canonical sequences are data/automation.ts and the /automation page.
- Lead: website → Builder → capture → record/CRM → qualify → notify → follow-up → meeting/action → pipeline → report. See LEAD-ENGINE.md.
- Content: idea → brief → draft → creative → caption → approval → adapt → schedule → publish → analytics → archive. See CONTENT-ENGINE.md.
- Email: incoming → classify → client/project association → identify action → draft → required approval → send → log → follow-up. Scope inquiry, client/vendor, project/meeting follow-up and document requests. Unknown association or sensitive content pauses for human review.
- Client onboarding: approved engagement → read-only payment/agreement status → client record → project → intake → private folders → tasks → timeline → reviewed welcome → project start. No payment creation or charging. Never infer a signed agreement from free text.
- Documents: structured data → draft → human review → approval → final output → private vault. Support Blueprint, proposals, reports, roadmaps, meeting summaries, briefs, status reports and presentations. Reuse existing document review controls and V1.6 mark/grid/numbering; no invented client details.
- Distribution: targets → research → qualify → prepare outreach → materials → authorized contact → response → follow-up → meeting → status → next action. Research is untrusted input. Strategy/coordination only; no claim to licensed distribution.
- Activation: market → event/retail opportunity → plan → assets → staff/ambassadors → execution → consented data capture → follow-up → reporting. Confirm permissions and responsible people.

## Monitoring and audit
HEALTHY, ATTENTION, FAILED, DISABLED. Show last run, successes/failures, safe error code, retry state and integration health. Disabled is the initial state, never a fake healthy indicator. Alert the owner for unresolved failures; show timestamps so stale health is visible. Append audit events with time, tenant, workflow/run/action/record, mode, approval state, authorized actor when applicable and result. Restrict access, retention and sensitive fields. Do not log credentials or full email bodies by default.

## Failure handling
Bounded exponential backoff with jitter and provider Retry-After for retryable 429/5xx responses. Set operation timeouts. Validation/permission failures do not loop. Expired credentials pause the integration and request reauthorization. Exhausted attempts enter a persistent failure queue with owner and reason. Unknown external-send results enter manual reconciliation; never blindly retry an email or publication. Record completed steps after partial failure and resume only the incomplete safe steps. Use outbox/inbox reservations, provider idempotency where supported, event deduplication and leases with recovery. Never promise exactly-once external delivery where a provider cannot guarantee it. Cancellation must reconcile remote state before reporting success. No failed action is silently dropped.
