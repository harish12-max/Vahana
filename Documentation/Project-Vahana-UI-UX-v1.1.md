# Project Vahana — UI/UX v1.1
**Status:** Authoritative amendment to UI/UX v1.0

## 1. Advertiser Flow
Show the lifecycle:
Create Draft → Submit → Under Review → Approved/Changes Requested/Rejected → Payment → Matching → Installation → Active → Completed.

## 2. Campaign Creation
- Present one primary campaign price; an optional transparent breakdown can show included components.
- Clearly distinguish Requested Autos, Accepted Autos and Active Autos.
- If fewer autos are available, show the partial-fulfilment state and require the configured advertiser decision.
- Prefer Start Date + Duration with End Date calculated by the system.
- Admin review has Approve, Request Changes and Reject. Request Changes requires a reason.

## 3. Campaign Detail
Show timeline plus requested/accepted/installed/active counts, installation progress, today's verification summary, payment status and current state.

## 4. Auto Owner
Invitation must show campaign duration, expected payout, vehicle/advertising requirements, installation requirements, verification obligations and acceptance deadline when configured.

## 5. Daily Verification
Notification → Campaign/Vehicle Context → Camera Permission → Direct Camera → Capture → Retake → Submit → OTP → Success.

No gallery/file-picker option.

Missed verification shows status, next action, configured consequence and recovery/support path.

## 6. Payments/Payouts/Cancellation
Show payment processing/success/failure clearly. Payouts show eligible/pending/processing/paid/failed. Cancellation UI explains availability and refund outcome before confirmation.

## 7. Admin
Prioritize queues for owner/vehicle verification, campaign approval, matching, installation, verification exceptions, payments, payouts and disputes.

## 8. Location
Request location only when required; do not imply continuous tracking in MVP.