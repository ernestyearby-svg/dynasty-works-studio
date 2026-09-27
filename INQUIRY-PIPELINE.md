# Inquiry pipeline — V1.4

## Current state

Production submission is disabled. No Supabase credentials/project, payment provider or upload provider has been supplied. The three new `/api/submissions/general`, `/api/submissions/builder` and `/api/submissions/blueprint` endpoints validate and return HTTP 503 `not_configured` for valid requests. The existing `/api/inquiries` endpoint is preserved and disabled. Forms never call these endpoints in this release.

The Blueprint intake is memory-only, including narrative, contact and links. Navigating away/reloading clears it. A user may download their own local text copy. The builder preserves its non-contact tab-session selection recovery, and its contact/budget narrative remains memory-only. No confidential files are requested or uploaded.

## Contracts and validation

`lib/submission-contracts.ts` defines strict envelopes: version, UUID idempotency key, explicit evaluation/communication consent with a notice version, honeypot, optional future bot token and route-specific data. Local preview acknowledgment is separate and cannot stand in for submission consent. No internal lead ID, status, price or recommendation snapshot can be supplied. Builder recommendations are recomputed server-side from validated input.

`lib/blueprint-intake.ts` shares bounded, trimmed field validation with the future server handler. HTTP(S) references only, at most five links, defined type/stage enums, no unknown keys and control-character rejection. React renders user text normally; it is never inserted as raw HTML. Future database writes must remain parameterized. Do not fetch submitted URLs automatically (SSRF risk); verify any future research fetcher independently.

## Server boundary

`server/submission-handler.ts` checks POST, same configured origin, cross-site fetch metadata, JSON content type, advertised and streamed body size (48 KB), body timeout (5 seconds), valid UTF-8/JSON and schema. Missing Origin is rejected on the new browser-facing routes. Local loopback is permitted only when the request URL itself is loopback. No forwarded IP/host headers are trusted by this handler.

Default dependencies are enabled=false and null repository/limiter/bot-verifier. Environment flags alone cannot activate writes. Future activation must attach all three reviewed dependencies. When active, a distributed limiter runs before body processing; bot verification follows validation. Denial returns 429/403, mismatched idempotency returns 409, validation returns 422 and provider errors return a generic 503 without leaking private error details. Cache-Control is no-store. A success response is possible only after the server repository returns a persisted opaque receipt.

The active branch is tested with in-memory mocks only. It is NOT proof of production database persistence, distributed limiting or bot protection. No production security dependency is claimed to be operating while the feature is disabled.

## Transaction and duplicates

The repository must atomically claim UUID idempotency key + canonical payload hash, create the lead and inquiry, and create the matching builder/intake record. The same key and identical payload returns the same receipt; changed payload returns conflict. Include consent and meaningful input in the hash, exclude transient bot tokens. Use an appropriate server-side keyed hash where needed to avoid guessable sensitive fingerprints; review key rotation/retention. Do not automatically merge leads by an unauthenticated email match or accept caller-supplied lead IDs. Database unique constraints resolve concurrent retries; a partial transaction must roll back. After an uncertain response, retry with the same key. No payload/contact logging.

## States

`SubmissionUIState` and `SubmissionFeedback` prepare idle, submitting, error, disabled and confirmed-success presentations. Only disabled feedback is reachable from the current intake. Intake-completed analytics means local validation completed, not lead accepted or paid. Future success must be driven by an accepted response with an opaque receipt. It must not imply booking, payment or contract acceptance.

## Upload and privacy requirements

Uploads remain null/unconfigured. Future private storage: ownership-checked authorization, non-guessable object paths, short-lived signed access, allowed MIME/content signatures (not extension alone), size/count limits, quarantine and malware scanning, no public read/list, no executable/HTML/SVG uploads, and explicit retention/deletion rules. Existing candidate limit is five files, 10 MB each, PDF/JPEG/PNG/WebP; review these before activation.

The form describes project evaluation and communication, warns against sensitive identifiers/secrets, and states local-only behavior. This is not a substitute for reviewed privacy/terms. Before a public launch, approve lawful collection, retention, deletion/access requests, processor terms, staff access and consent wording.
