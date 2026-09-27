# Supabase integration plan — not connected

## Project status

The correct production project has not been supplied. No project was created, discovered or borrowed, and no credentials, database write, migration or storage operation was attempted. The SQL under docs/database/inquiry-schema.proposed.sql is a review proposal, outside all deployment migration folders. It is not an applied migration.

## Proposed model

Four PostgreSQL tables in a non-exposed dynasty_private schema: leads, inquiries, builder_submissions and founder_blueprint_intakes. UUID primary/foreign keys; timestamptz timestamps; bounded text and check constraints; JSONB for typed roadmap/array snapshots. Foreign-key indexes support linked review queries. A composite foreign key enforces matching lead/inquiry relationships. Inquiry UUID idempotency key and opaque receipt are unique. Lead email is not a unique identity claim. Internal lead statuses: NEW, REVIEWING, QUALIFIED, STRATEGY_SCHEDULED, PROPOSAL, ENGAGED, NOT_NOW, CLOSED. No public status/read API exists.

All four tables enable and force RLS. Schema/table/sequence privileges are revoked from PUBLIC, anon and authenticated. No permissive policies, public RPCs or staff policies are invented. Keep the schema out of exposed Data API schemas. This default-deny proposal still needs real-project tests: privileged roles can bypass RLS, and future server privileges must be narrowly reviewed. Separate private records from the public portfolio.

## Required environment names (blank in .env.example)

- NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: optional future browser client configuration; not sufficient or necessary to activate the current server-only intake. Publishable does not grant authorization by itself.
- SUPABASE_URL and SUPABASE_SECRET_KEY: approved project's server-only connection values. Never use NEXT_PUBLIC for secret/service-role credentials. Prefer the approved least-privilege server mechanism.
- INQUIRY_SUBMISSIONS_ENABLED: false; currently documentation only, not an automatic switch.
- INQUIRY_RATE_LIMIT_URL / INQUIRY_RATE_LIMIT_TOKEN: placeholders for an approved distributed abuse-control provider.
- INQUIRY_BOT_SECRET: approved verifier secret (provider-specific public challenge settings to be defined when selected).
- SUPABASE_PRIVATE_INTAKE_BUCKET: future private bucket; no bucket created or selected.

No SDK/dependency was added. Sites runs on Cloudflare Workers; choose an HTTP-compatible server adapter or approved HTTPS Edge Function transaction boundary. Do not use raw TCP. Do not expose the private schema merely to make a client call work.

## Exact activation checklist

1. User supplies the intended Supabase project identity, confirms ownership/environment and authorizes that project's integration. Configure its values through protected runtime settings, never the repository or chat output.
2. Approve privacy/terms, actual submission consent, retention and deletion, reviewed service scope and staff access roles. Payment approval is separate.
3. Inspect that project's existing schema. Use the Supabase CLI migration workflow to create a real reviewable migration, adapt the proposal without touching unrelated tables, and run it on an approved local/test database first. No guessed migration filename or project ref.
4. Verify the private schema is not exposed; verify anon and authenticated cannot SELECT/INSERT/UPDATE/DELETE any lead or submission. Test cross-user/staff role boundaries, grants and RLS; run Supabase advisors. Review any server-only function permissions, search_path and execution role. Do not grant public RPC execution.
5. Implement the transaction repository over an approved server-only HTTPS boundary: atomic idempotency, consistent related IDs, recomputed versioned roadmap, explicit consent, safe retention, opaque receipt and sanitized logging. Test concurrent duplicates, conflict, rollback and failure-after-commit retries.
6. Attach a distributed limiter keyed from trusted platform metadata plus abuse controls, with fail-closed behavior. Configure and verify bot challenge/token checks, origin configuration, bounded parsing and provider timeouts; never trust arbitrary forwarded IP headers.
7. Run integration tests against the authorized staging project: all three intake types, invalid/oversized/slow bodies, denied bot/origin, rate exhaustion, failure/retry, and no PII/secrets in client output, logs or caches. Verify staff notification delivery separately if later authorized.
8. Review an actual consented staging submission and persisted receipt. Only then attach the production dependencies, add the frontend transport, and explicitly enable production submissions. UI success must follow confirmed persistence. Merely setting environment variables must not be treated as activation.
9. Enable files only after a separate private bucket, authorization, signed access, content/size checks, quarantine/scanning and storage policy tests. Enable payment only after an approved processor, signed webhook verification and reviewed terms.

## Reference basis

[Supabase RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security) explains that grants and policies both control access and that privileged server roles require special care. [Supabase API-key guidance](https://supabase.com/docs/guides/getting-started/api-keys) distinguishes public client keys from server secrets. These references informed the proposal; they do not substitute for project-specific security tests.
