# Project Vahana — SRS v1.1
**Status:** Authoritative amendment to SRS v1.0

## 1. Campaign State Machine
DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED → PAYMENT_PENDING → PAID → MATCHING → INSTALLATION → ACTIVE → COMPLETED → CLOSED.

Exceptional states: CHANGES_REQUESTED, REJECTED, CANCELLED, PAUSED, DISPUTED.

All transitions are backend-controlled and actor-authorized.

## 2. Assignment State Machine
INVITED → ACCEPTED or DECLINED → INSTALLATION_PENDING → INSTALLED → VERIFIED → ACTIVE → COMPLETED → PAYOUT_PENDING → PAID.

Exceptional states such as CANCELLED, EXPIRED and REJECTED may be used where applicable.

## 3. Daily Verification State Machine
DUE → CAPTURED → OTP_PENDING → VERIFIED.

Exceptional states: MISSED, EXPIRED, FAILED, REJECTED, FLAGGED_FOR_REVIEW.

Each verification belongs to exactly one assignment and verification window. Retries must not create duplicate obligations.

## 4. Payment State Machine
CREATED → PENDING → VERIFIED/PAID.

Failure/cancellation/refund states are recorded separately as applicable. Only verified provider data/webhooks can move a campaign to PAID.

## 5. Payout State Machine
ELIGIBLE → PENDING → PROCESSING → PAID.

FAILED and CANCELLED may be used where applicable. Duplicate payouts must be prevented and safe retries supported.

## 6. Functional Rules
- Store requested_quantity, accepted_quantity and active_quantity separately.
- Never silently activate a campaign below requested quantity.
- Enforce state-specific editable fields.
- Material post-approval changes require re-review.
- Cancellation and refund APIs must be state-aware and auditable.
- Creative type, size and dimension limits are configuration-driven.
- Resource authorization must prevent cross-user vehicle manipulation.
- Approval, changes, rejection, payment verification, matching, invitation decisions, installation verification, verification exceptions, refunds, payouts and disputes generate audit events.