# Project Vahana — Development v1.1
**Status:** Authoritative amendment to Development v1.0

## 1. Implementation Order
1. Finalize business rules: approval/payment order, owner vs driver responsibility, partial fulfilment, cancellation/refund, payout workflow, verification windows/consequences, creative constraints and editing rules.
2. Repository, environments, CI/testing, logging, configuration and secrets.
3. Authentication, sessions, RBAC, ownership checks and protected routes.
4. Profiles, vehicles, documents and advertising eligibility.
5. Campaign draft/create/submit/review, request-changes flow, state machine and creative storage.
6. Payment order creation, webhook verification, payment state machine and idempotency.
7. Admin-controlled matching, partial fulfilment workflow, invitations and assignment state machine.
8. Installation tracking, evidence upload and admin verification.
9. Daily scheduler, camera-only capture, OTP, verification state machine and exception handling.
10. Campaign completion, payout eligibility and admin-operated payout workflow.
11. Notifications, cancellation/refund, disputes, reports and operations queues.
12. End-to-end, authorization, financial idempotency, file-upload, responsive, camera/OTP and security testing.
13. Deployment, backups, observability, smoke tests, runbooks and launch monitoring.

## 2. MVP Protection Rules
Do not build automated matching, AI image analysis, continuous GPS, native apps, advanced analytics or multi-city automation.

Centralize and test state transitions before dependent UI is finalized.

Business values that are not validated must be configuration-driven and marked Pending Validation rather than hard-coded.