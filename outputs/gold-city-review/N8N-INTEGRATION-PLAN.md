# n8n integration plan — inactive

n8n is a candidate orchestration layer, not the public product identity. Contracts live in server/automation-adapters.ts; no n8n endpoint, project or workflow has been configured.

## Responsibilities
Verified triggers/webhooks, schedules, API calls, data transformation, approved AI model calls, approval routing, notifications, content operations and CRM synchronization. Business authorization belongs in a trusted policy service and system of record; a workflow node or client input cannot self-approve.

## Proposed deployment sequence
1. Select hosted or self-hosted environment, owner, data region, retention and licensing appropriate to the intended use. Review current vendor requirements.
2. Use isolated development/test credentials and synthetic records. Version workflows without secrets; export reviewed definitions to source control.
3. Implement verified ingress → validated event → transactional outbox → workflow run. Event IDs and signed timestamps prevent replay. Rate-limit ingress.
4. Separate prepare, await approval and execute stages. Persist waits and recheck approval expiry/record revision before execution. Human approval has a timeout and escalation owner.
5. Use a shared error workflow, bounded retries and failure queue; retain safe execution identifiers and alert the owner. Reconcile uncertain external effects before retry.
6. Restrict outbound destinations and node credentials; use least privilege, per-environment secret isolation and rotation.
7. Test duplicate/replayed events, revoked approvals, outages, expired tokens and partial completion. Canary one internal workflow with a kill switch and rollback procedure.

## Activation gates
Architecture approval; named providers/accounts; auth and credential storage; ownership and permissions; tested audit/monitoring; incident response; explicit production activation approval. No imported or activated production workflow in V1.7.

Vendor reference: [n8n error handling](https://docs.n8n.io/flow-logic/error-handling/). Error workflows can centralize failure handling; application-level reconciliation remains our responsibility. Recheck vendor behavior during implementation.
