# Project Vahana — System Architecture v1.1
**Status:** Authoritative amendment to Architecture v1.0

## 1. Architecture Decision
Keep the React + Node.js/Express + MongoDB modular monolith. No microservices are required for MVP.

## 2. New/Clarified Boundaries
Add a centralized State Transition/Policy layer for Campaign, Assignment, DailyVerification, Payment and Payout.

Add an internal Operations/Workflow module for:
- admin-controlled matching
- partial fulfilment decisions
- installation coordination
- verification exceptions
- payout operations

This is not a new public user role.

## 3. Data/Workflow Requirements
- Track requested, accepted and active vehicle quantities.
- Daily verification scheduler creates one unique obligation per assignment/window.
- Scheduler is independent of the frontend and must be idempotent/retry-safe.
- External printing/installation partners remain integrations.
- Location remains optional/configurable; no continuous fleet tracking in MVP.
- Evidence remains private and linked to the correct campaign/assignment/verification.
- Business values such as limits, durations, verification windows, notification timing, fee rules, payout rules and creative constraints should be configuration-driven.
- Money, eligibility, execution-state and evidence decisions require audit events.

## 4. Recommended Modules
auth, users, vehicles, documents, eligibility, campaigns, assignments/matching, installations, verification, payments, payouts, notifications, disputes, operations, audit and configuration.