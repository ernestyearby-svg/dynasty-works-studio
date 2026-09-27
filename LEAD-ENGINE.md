# Internal workflow 01 — Lead Engine

Status: architecture only. Existing inquiry/Builder submission remains disabled.

Company Builder / Inquiry → approved record store → qualification → internal notification → follow-up draft → authorized approval → send → pipeline → reminder → reporting.

## Records
Capture source, business type/stage, selected core needs, automation assessment when relevant, recommended engagement, consent, contact details, pipeline status and activity history. Server validates the original bounded build and recomputes recommendations; do not trust client-supplied package or service claims. Preserve existing idempotency and submission envelope contracts. Freeform process notes are excluded from browser persistence and reload, like contact details and budget notes. Do not collect passwords or client secrets.

## Qualification
Use deterministic service/stage matching first. Optional future AI classification must show uncertainty and route ambiguous or sensitive inquiries to a person. A qualification suggestion does not reject a lead, make a contractual offer or send a message.

## Approval and execution
Prepare a follow-up draft bound to the exact lead, recipient, sender account, content revision and purpose. Authorized approver reviews. Server confirms consent/use basis, suppression and do-not-contact rules, revision, account rights and idempotency immediately before sending. Log provider reference and result. Timeouts with unknown send outcome require reconciliation. No automatic duplicate follow-up.

## Next action
Assign a named owner, due date and pipeline stage (new, reviewing, qualified, meeting, proposal, active, closed). Review appropriate retention and reminder intervals before activation. Meeting integration requires real calendar permission and confirmation; no invented bookings.

## Acceptance before activation
Valid inquiry creates one authorized tenant-scoped record; duplicate event creates no duplicate notification/send; invalid/cross-tenant requests are rejected; missing/revoked approval blocks sending; provider timeout is reconciled; failed notification stays visible; staff can disable the workflow. Baseline actual response time and admin effort internally before publishing any improvement claim.

Required decisions: backend project/region and ownership, email provider/sender, CRM destination, approvers, consent/retention rules, notification destination and escalation owner. No accounts connected in V1.7.
