# Automation security — V1.7 architecture

No live integrations, production writes, credential insertion or destructive actions. Contracts and pure planning checks are scaffolding, not a deployed security system. server/automation-adapters.ts returns disabled regardless of input and has no activation switch.

## Trust boundaries
Browser collects bounded preferences only. The server must validate input, authenticate users, resolve tenant/role membership, enforce action policy and select allowlisted destinations. AI outputs and external email/content/webhooks are untrusted data, never authority to alter rules or execute tools. Models receive only necessary context; redact secrets and sensitive fields, restrict tools, validate structured outputs and route uncertainty to review. Client-submitted risk/mode/approval values must be ignored in favor of trusted configuration.

## Credentials and integrations
Use provider authorization and least privilege. Store secrets server-side in managed secret storage/environment bindings; never browser storage, public bundles, URLs, logs or source. Isolate development/production accounts. Encrypt stored refresh credentials, rotate/revoke, restrict operator access and document incident response. OAuth state/PKCE and redirect allowlists must be implemented with the selected provider. Verify webhook signatures over raw request bodies, timestamp tolerance, replay IDs, content limits and rate limits. Require outbound allowlists and SSRF protections.

## Potential Supabase role
Candidate database, auth, private storage and client/project record layer. Do not create/connect an unknown project. No migrations or credentials in V1.7. Before implementation confirm project ID/owner, region, environment and schema. Use explicit grants plus RLS on exposed tables; deny access by default. Enforce tenant membership and record ownership for every operation. Trusted app/server authorization data, not editable user metadata, determines privileged roles. Keep service-role credentials server-side and tightly scoped because they bypass RLS. Prefer separate restricted worker roles and private internal schemas. Use private buckets with scoped object policies and short-lived authorized downloads. Test unauthenticated, cross-tenant, unauthorized actor and valid-owner paths. Check grants, views/functions and storage policies as well as tables.

## Approval and audit
Higher consequence defaults to human approval. Bind approval to tenant, actor authority, exact action/revision/digest, account, recipient and expiry. Recheck server-side inside atomic claim/dispatch sequencing. Revocation and payload edits block execution. Record safe identifiers and outcomes; do not retain secrets, email bodies or personal data unnecessarily. Define retention, deletion and audit access before activation. Audit system failure should block consequential dispatch, not silently lose history.

## Resilience
Durable outbox, idempotency reservations, bounded retry, timeouts, failure queue, partial-result reconciliation, operator visibility and emergency disable. Unknown send/publish outcomes require provider lookup or manual review. Require backup/restore tests and rollback before writes are enabled.

## Sources reviewed 2026-09-15
- [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security): grants and RLS must both be considered; service roles bypass RLS.
- [Supabase changelog](https://supabase.com/changelog): recheck SDK/runtime and API exposure changes before installing or implementing. No dependency or database update is needed for this architecture-only release.
- [n8n error handling](https://docs.n8n.io/flow-logic/error-handling/): shared error handling supports failure visibility.

## Required pre-live review
Provider/account ownership, data categories and retention, consent and suppression rules, authenticated approver roles, per-workflow risk/action limits, integration permissions, signed ingress, policy/RLS tests, reconciliation, monitoring, rollback and explicit activation approval. Keep financial actions, legal commitments and destructive data operations out of the initial internal pilots.
