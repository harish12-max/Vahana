# Project Vahana — PRD v1.1
**Status:** Authoritative amendment to PRD v1.0

Where this document conflicts with PRD v1.0, this v1.1 amendment is authoritative.

## 1. Authoritative Advertiser Flow
Register → Verify → Create Draft → Submit → Admin Review → Approved / Changes Requested / Rejected → Payment → Server-side Payment Verification → Matching → Owner Invitations → Acceptance → Printing/Installation → Installation Verification → Active → Daily Verification → Completion → Payout → Basic Report.

## 2. Business Rules
- Payment occurs after campaign approval. Vahana does not require payment for a campaign that has not been approved.
- MVP matching is admin-controlled/manual. Product language should say "matching" or "admin-assisted matching".
- Requested autos and active autos are distinct. Vahana must not silently activate fewer autos than requested. Partial fulfilment requires the advertiser's configured decision.
- MVP enrolment is based on the verified person responsible for the vehicle/advertising participation. A driver operating another person's vehicle requires documented authorization. A separate driver role is deferred.
- Advertisers primarily see one campaign price. Internal economics may separately track owner payout, printing, installation, payment processing, taxes/fees and Vahana contribution.
- Campaign duration must be internally consistent. Prefer start date + duration with the end date derived by the system.
- Drafts are editable. After submission, approval, payment, matching, installation and activation, edits become progressively restricted. Material changes require controlled re-review.
- Cancellation/refund rules depend on campaign state. Before payment there is no payment to refund; after payment, refund eligibility depends on the operational state and approved refund policy.
- External printing and installation partners remain integrations, not first-class application roles in MVP.
- Daily camera-only + OTP verification is P0/MVP. Exact windows, missed thresholds and financial consequences remain configurable/pending validation.
- MVP payouts may be admin-operated. Payout eligibility follows configured completion rules.
- Admin can request campaign changes with a reason; advertiser edits and resubmits.
- Reports must contain defensible operational facts and must not claim impressions/reach without a measurement method.
- Continuous GPS tracking is out of MVP; location is optional/configurable.

## 3. MVP Boundary
Keep automated matching, AI image analysis, liveness detection, continuous GPS, native apps, advanced analytics and multi-city automation deferred.