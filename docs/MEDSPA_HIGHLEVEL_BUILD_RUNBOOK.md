# Dynasty MedSpa Growth Engine™
## HighLevel Operator Build Runbook (Phase 4A)

> **Document Classification**: Operator Implementation Runbook  
> **Status**: Ready for Execution (Awaiting Account Credentials)  
> **Execution Constraint**: **DO NOT EXECUTE UNTIL EXPLICITLY AUTHORIZED**  
> **Repository Branch**: `feature/medspa-growth-engine`  
> **Target Route**: `/growth/medspa`

This runbook provides the exact, sequential, copy-paste instructions for the Dynasty Works Studio systems engineer or operator to configure HighLevel and Netlify once the target sub-account and credentials are provisioned.

---

## Runbook Index

* [PHASE A — HighLevel Account Preparation](#phase-a--highlevel-account-preparation)
* [PHASE B — Custom Fields Configuration](#phase-b--custom-fields-configuration)
* [PHASE C — Tag Architecture Setup](#phase-c--tag-architecture-setup)
* [PHASE D — Sales Pipeline Setup](#phase-d--sales-pipeline-setup)
* [PHASE E — Strategy Call Calendar Setup](#phase-e--strategy-call-calendar-setup)
* [PHASE F — Email Domain & Sender Verification](#phase-f--email-domain--sender-verification)
* [PHASE G — SMS & 10DLC Compliance Preparation](#phase-g--sms--10dlc-compliance-preparation)
* [PHASE H — Netlify Secure Function Deployment](#phase-h--netlify-secure-function-deployment)
* [PHASE I — Contact & Opportunity Ingestion Setup](#phase-i--contact--opportunity-ingestion-setup)
* [PHASE J — Immediate Response Workflow (WF-02)](#phase-j--immediate-response-workflow-wf-02)
* [PHASE K — 7-Day Booking Nurture Workflow (WF-03)](#phase-k--7-day-booking-nurture-workflow-wf-03)
* [PHASE L — Appointment & Reminder Workflow (WF-04)](#phase-l--appointment--reminder-workflow-wf-04)
* [PHASE M — No-Show Recovery Workflow (WF-05)](#phase-m--no-show-recovery-workflow-wf-05)
* [PHASE N — Long-Term Nurture Workflow (WF-06)](#phase-n--long-term-nurture-workflow-wf-06)
* [PHASE O — Internal Operations Notifications](#phase-o--internal-operations-notifications)
* [PHASE P — End-to-End Sandbox Testing](#phase-p--end-to-end-sandbox-testing)
* [PHASE Q — Production Activation & Cutover](#phase-q--production-activation--cutover)

---

### PHASE A — HighLevel Account Preparation

* **WHAT TO CREATE**: Verify HighLevel Agency Sub-Account Configuration
* **EXACT NAME**: `Dynasty Works Studio — Acquisition Engine`
* **CONFIGURATION**:
  * Location Timezone: `America/Los_Angeles` (PST/PDT)
  * Business Address: Dynasty Works Studio legal operating entity
  * Currency: `USD ($)`
  * Record Location ID: Save `LOCATION_ID` securely to operator vault
* **DEPENDENCIES**: Dedicated HighLevel agency sub-account provisioned
* **TEST**: Verify dashboard loads, Location ID matches API key scope
* **PASS CONDITION**: Successful login, settings verified, Location ID recorded
* **ROLLBACK / DISABLE METHOD**: N/A (Standard account container)

---

### PHASE B — Custom Fields Configuration

* **WHAT TO CREATE**: 8 Contact Custom Fields in HighLevel Settings > Custom Fields
* **EXACT NAMES & SPECIFICATION**:
  1. `Primary Treatment to Grow` | Key: `dws_primary_treatment` | Type: Single Dropdown (`Injectables`, `Laser`, `Body Contouring`, `Skin / Facial`, `Hair Restoration`, `Weight Management`, `Other`)
  2. `Monthly Marketing Budget` | Key: `dws_monthly_marketing_budget` | Type: Single Dropdown (`Under $1,500`, `$1,500–$3,000`, `$3,000–$5,000`, `$5,000–$10,000`, `$10,000+`)
  3. `Current Monthly Lead Volume` | Key: `dws_current_monthly_lead_volume` | Type: Single Dropdown (`0–25`, `26–50`, `51–100`, `101–250`, `250+`, `Not Sure`)
  4. `Growth Success Criteria` | Key: `dws_success_criteria` | Type: Large Text
  5. `Consent Recorded` | Key: `dws_consent_recorded` | Type: Checkbox (Boolean)
  6. `Lead Source` | Key: `dws_lead_source` | Type: Text (Default: `Dynasty MedSpa Growth Engine`)
  7. `Landing Page` | Key: `dws_landing_page` | Type: Text (Default: `/growth/medspa`)
  8. `Growth Engine Vertical` | Key: `dws_growth_engine_vertical` | Type: Single Dropdown (Default: `MedSpa`)
* **DEPENDENCIES**: Phase A complete
* **TEST**: Open manual Contact create modal; confirm all 8 custom fields appear with exact dropdown choices
* **PASS CONDITION**: All fields save and persist values upon contact update
* **ROLLBACK / DISABLE METHOD**: Delete custom fields from HighLevel Settings > Custom Fields

---

### PHASE C — Tag Architecture Setup

* **WHAT TO CREATE**: Normalized System Tags in HighLevel Settings > Tags
* **EXACT NAMES**:
  * Universal Base Tags: `dws-lead`, `medspa-growth-engine`, `growth-plan-request`
  * Lifecycle State Tags: `medspa-new-lead`, `medspa-contacted`, `medspa-qualified`, `medspa-demo-booked`, `medspa-demo-completed`, `medspa-proposal`, `medspa-won`, `medspa-lost`, `medspa-nurture`
  * Compliance Suppression Tag: `dws-opt-out`
  * Dynamic Prefix Tags (Created dynamically upon ingestion): `treatment:*`, `budget:*`
* **DEPENDENCIES**: Phase A complete
* **TEST**: Verify tag list in HighLevel UI; confirm lowercase hyphenated formatting
* **PASS CONDITION**: All 13 static tags created and visible in system autocomplete
* **ROLLBACK / DISABLE METHOD**: Bulk-delete tags from HighLevel Settings > Tags

---

### PHASE D — Sales Pipeline Setup

* **WHAT TO CREATE**: Acquisition Sales Pipeline
* **EXACT NAME**: `MEDSPA GROWTH ENGINE — ACQUISITION`
* **CONFIGURATION** (10 Sequential Stages):
  1. `01 NEW GROWTH PLAN REQUEST`
  2. `02 AUTOMATED RESPONSE SENT`
  3. `03 CONTACT ATTEMPTED`
  4. `04 QUALIFIED` *(Strict Manual Review Only)*
  5. `05 STRATEGY CALL BOOKED`
  6. `06 STRATEGY CALL COMPLETED`
  7. `07 PROPOSAL / DECISION`
  8. `08 WON — FOUNDING PARTNER`
  9. `09 LONG-TERM NURTURE`
  10. `10 CLOSED / NOT FIT`
* **DEPENDENCIES**: Phase A complete
* **TEST**: Navigate to Opportunities > Pipelines; confirm pipeline renders all 10 stages in exact order
* **PASS CONDITION**: Drag-and-drop opportunity between stages works cleanly; stage names match specification
* **ROLLBACK / DISABLE METHOD**: Edit pipeline > Delete pipeline

---

### PHASE E — Strategy Call Calendar Setup

* **WHAT TO CREATE**: 30-Minute Growth Strategy Booking Calendar
* **EXACT NAME**: `MEDSPA GROWTH STRATEGY CALL`
* **CONFIGURATION**:
  * Title: `MedSpa Growth Engine™ — Strategy Session`
  * Duration: 30 minutes
  * Slot Interval: 30 minutes
  * Buffer Time: 15 minutes before / 15 minutes after
  * Minimum Scheduling Notice: 4 hours
  * Rolling Availability: 14 calendar days
  * Operating Hours: Monday–Friday 09:00–17:00 (PST)
  * Location: Google Meet / Zoom auto-integration
  * Form Fields: Full Name, Practice Name, Email, Phone, Website, Primary Treatment
* **DEPENDENCIES**: Strategist Google Workspace / Outlook calendar connected
* **TEST**: Open calendar public booking link in incognito; verify available slots, timezone display, and buffer enforcement
* **PASS CONDITION**: Selecting test slot books meeting, sends `.ics` invite, and creates calendar block
* **ROLLBACK / DISABLE METHOD**: Deactivate calendar toggle in HighLevel Calendars

---

### PHASE F — Email Domain & Sender Verification

* **WHAT TO CREATE**: Dedicated Sending Domain Configuration
* **EXACT NAME**: `growth@dynastyworksstudio.com`
* **CONFIGURATION**:
  * Add DNS records to domain registrar:
    * SPF: `v=spf1 include:mailgun.org ~all` (or HighLevel LC-Email SPF)
    * DKIM: Dedicated TXT keys provided by HighLevel
    * DMARC: `v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@dynastyworksstudio.com`
    * MX records for reply forwarding
  * Verify domain in HighLevel Settings > Email Services
* **DEPENDENCIES**: Access to Dynasty Works Studio DNS manager
* **TEST**: Send outbound test email to `mail-tester.com` or internal address; inspect raw headers
* **PASS CONDITION**: DKIM = PASS, SPF = PASS, DMARC = PASS; score 10/10; inbox delivery (not spam)
* **ROLLBACK / DISABLE METHOD**: Remove sending domain in HighLevel settings

---

### PHASE G — SMS & 10DLC Compliance Preparation

* **WHAT TO CREATE**: Dedicated Commercial 10DLC Sending Number & Brand Registration
* **EXACT NAME**: `Dynasty Works Studio — MedSpa Growth Engine A2P 10DLC`
* **CONFIGURATION**:
  * Register US A2P 10DLC Brand with Dynasty Works Studio EIN/legal name
  * Register Campaign: Low-Volume Mixed / Customer Service
  * Sample Messages: Copy from Blueprint Section 5 & Section 7
  * Opt-In Disclosure: Exact consent checkbox copy from `/growth/medspa`
  * Opt-Out Handling: Standard keyword `STOP` responds with compliance confirmation
  * **STATUS AT LAUNCH**: Keep SMS automations **DISABLED** until carrier TCR approval is green
* **DEPENDENCIES**: Corporate legal entity details, verified business phone
* **TEST**: Send test outbound SMS to operator phone; reply `STOP`; confirm immediate suppression
* **PASS CONDITION**: Carrier status = APPROVED; opt-out stops messages
* **ROLLBACK / DISABLE METHOD**: Release phone number or toggle SMS action off in all workflows

---

### PHASE H — Netlify Secure Function Deployment

* **WHAT TO CREATE**: Netlify TypeScript Serverless Function
* **EXACT NAME**: `netlify/functions/medspa-growth-plan.ts`
* **ENDPOINT ROUTE**: `/.netlify/functions/medspa-growth-plan`
* **CONFIGURATION**:
  * Netlify Environment Variables:
    * `HIGHLEVEL_LOCATION_API_KEY`: Secret HighLevel v2 Bearer Token
    * `HIGHLEVEL_LOCATION_ID`: Sub-Account Location ID
  * Logic Modules:
    * Zod schema parsing and input sanitization
    * In-memory / Netlify Blobs sliding-window rate limiter (5 req / 10 min)
    * Honeypot field inspection (`hp_clinic_website`)
    * Upstream fetch to `https://services.leadconnectorhq.com/contacts/upsert`
    * Upstream fetch to `https://services.leadconnectorhq.com/opportunities/`
* **DEPENDENCIES**: Phase A (Location ID & API Key generated)
* **TEST**: Execute curl POST request with valid mock JSON; verify HTTP 200 response with `referenceId`
* **PASS CONDITION**: Contact and Opportunity created in HighLevel; client receives no exposed API tokens
* **ROLLBACK / DISABLE METHOD**: Remove environment variable or return HTTP 503 maintenance mode in function

---

### PHASE I — Contact & Opportunity Ingestion Setup

* **WHAT TO CREATE**: HighLevel Ingestion Workflow (WF-01)
* **EXACT NAME**: `WF-01: Website Ingestion & Opportunity Router`
* **CONFIGURATION**:
  * Trigger: Inbound API Contact Upsert with tag `growth-plan-request`
  * Action 1: Create Opportunity in `MEDSPA GROWTH ENGINE — ACQUISITION` at `01 NEW GROWTH PLAN REQUEST`
  * Action 2: Internal Email Alert to `growth@dynastyworksstudio.com`
  * Action 3: HighLevel In-App Notification to assigned growth strategist
  * Action 4: Enroll in `WF-02: Immediate Lead Response`
* **DEPENDENCIES**: Phases B, C, D, H complete
* **TEST**: Submit payload via Netlify Function; inspect Opportunities board
* **PASS CONDITION**: Deal card appears in column 01 with practice name, treatment tag, and budget tag
* **ROLLBACK / DISABLE METHOD**: Set workflow status to `Draft`

---

### PHASE J — Immediate Response Workflow (WF-02)

* **WHAT TO CREATE**: Automated Lead Acknowledgment Workflow
* **EXACT NAME**: `WF-02: Immediate Lead Response`
* **CONFIGURATION**:
  * Trigger: Enrolled from WF-01 or Stage enters `01 NEW GROWTH PLAN REQUEST`
  * Action 1: Dispatch Email from `growth@dynastyworksstudio.com` (Blueprint Section 5 copy)
  * Action 2: Dispatch SMS (Keep Action TOGGLED OFF until Phase G complete)
  * Action 3: Advance Opportunity to `02 AUTOMATED RESPONSE SENT`
  * Action 4: Wait 24 Hours, then enroll in `WF-03: 7-Day Booking Nurture`
* **DEPENDENCIES**: Phase F complete (Email verified)
* **TEST**: Trigger with test contact; inspect delivery inbox
* **PASS CONDITION**: Email arrives promptly; merge tags `{{contact.first_name}}` and `{{contact.company_name}}` render correctly; calendar link functions
* **ROLLBACK / DISABLE METHOD**: Toggle workflow toggle to `Draft`

---

### PHASE K — 7-Day Booking Nurture Workflow (WF-03)

* **WHAT TO CREATE**: Multi-Touch Strategy Session Booking Workflow
* **EXACT NAME**: `WF-03: 7-Day Calendar Booking Nurture`
* **CONFIGURATION**:
  * Hard Exit Trigger: Calendar appointment booked on `MEDSPA GROWTH STRATEGY CALL` OR tag `dws-opt-out` applied
  * Step 1 (t + 24h): Day 1 Strategy Insight Email ("The Revenue Leak")
  * Step 2 (t + 48h): Day 2 Internal Strategist Task ("Review clinic social/web presence") + SMS (OFF)
  * Step 3 (t + 96h): Day 4 Architecture & Systems Email ("Connected Systems vs. Disjointed Marketing")
  * Step 4 (t + 168h): Day 7 Final Touchpoint Email ("Closing the loop")
  * Step 5: Advance Opportunity to `09 LONG-TERM NURTURE`; remove `medspa-new-lead`, add `medspa-nurture`
* **DEPENDENCIES**: Phases C, D, E, F complete
* **TEST**: Enroll test contact; book appointment after Step 1; verify workflow immediately exits
* **PASS CONDITION**: Workflow execution history shows clean cancellation upon appointment booking
* **ROLLBACK / DISABLE METHOD**: Set workflow to `Draft`

---

### PHASE L — Appointment & Reminder Workflow (WF-04)

* **WHAT TO CREATE**: Strategy Session Management Workflow
* **EXACT NAME**: `WF-04: Strategy Call Appointment & Reminders`
* **CONFIGURATION**:
  * Trigger: Appointment Status = `Booked` on `MEDSPA GROWTH STRATEGY CALL`
  * Action 1: Move Opportunity to `05 STRATEGY CALL BOOKED`
  * Action 2: Remove tag `medspa-contacted`; Add tag `medspa-demo-booked`
  * Action 3: Dispatch Booking Confirmation Email + `.ics` calendar file
  * Action 4: Wait until 24 Hours Before Meeting -> Dispatch 24-Hour Reminder Email
  * Action 5: Wait until 2 Hours Before Meeting -> Dispatch 2-Hour Reminder SMS (OFF until Phase G)
* **DEPENDENCIES**: Phases D, E, F complete
* **TEST**: Book appointment 26 hours in future; verify confirmation arrives immediately, verify 24h reminder queues
* **PASS CONDITION**: Timers calculate accurately against meeting start time
* **ROLLBACK / DISABLE METHOD**: Set workflow to `Draft`

---

### PHASE M — No-Show Recovery Workflow (WF-05)

* **WHAT TO CREATE**: Courteous Missed Consultation Recovery Sequence
* **EXACT NAME**: `WF-05: No-Show Recovery Protocol`
* **CONFIGURATION**:
  * Trigger: Appointment Status changed manually to `No-Show`
  * Action 1: Wait 20 minutes
  * Action 2: Dispatch Missed Session Email with self-service reschedule link
  * Action 3: Create Internal Task for Growth Strategist: "Phone outreach to no-show lead in 24h"
  * Action 4: Wait 48 Hours -> If no reschedule, dispatch final follow-up email
  * Action 5: Move Opportunity to `09 LONG-TERM NURTURE`
* **DEPENDENCIES**: Phases D, E, F complete
* **TEST**: Mark test appointment as `No-Show`; verify recovery email and internal task created
* **PASS CONDITION**: Exactly 1 email and 1 task created; no spamming
* **ROLLBACK / DISABLE METHOD**: Set workflow to `Draft`

---

### PHASE N — Long-Term Nurture Workflow (WF-06)

* **WHAT TO CREATE**: Low-Frequency Educational Maintenance Workflow
* **EXACT NAME**: `WF-06: Long-Term Educational Nurture`
* **CONFIGURATION**:
  * Trigger: Opportunity moved to `09 LONG-TERM NURTURE`
  * Action 1: Apply tag `medspa-nurture`; remove `medspa-new-lead`
  * Action 2: Enroll in monthly aesthetic practice acquisition newsletter list
  * Frequency: Max 1 email per month
  * Hard Exit: Contact unsubscribes or books a strategy session
* **DEPENDENCIES**: Phase F complete
* **TEST**: Move contact to stage 09; verify tag updates
* **PASS CONDITION**: Contact correctly tagged and placed in monthly queue
* **ROLLBACK / DISABLE METHOD**: Set workflow to `Draft`

---

### PHASE O — Internal Operations Notifications

* **WHAT TO CREATE**: Internal Notification Routing Rules
* **EXACT NAME**: `Internal Operations Notification Matrix`
* **CONFIGURATION**:
  * Alert Destinations:
    * Email: `growth@dynastyworksstudio.com`
    * In-App: HighLevel Mobile App & Desktop Notification center
  * Monitored Events:
    * New Form Submission
    * Strategy Call Booked
    * Strategy Call Cancelled
    * Strategy Call No-Show
    * Deal Advanced to `08 WON — FOUNDING PARTNER`
* **DEPENDENCIES**: Verified team email addresses
* **TEST**: Fire each trigger with test lead; verify email alerts arrive with complete contact metadata
* **PASS CONDITION**: All alerts received within 2 minutes of event
* **ROLLBACK / DISABLE METHOD**: Turn off notification toggles in workflow settings

---

### PHASE P — End-to-End Sandbox Testing

* **WHAT TO EXECUTE**: Comprehensive Test Matrix (TC-01 through TC-18)
* **TESTING PROTOCOL**:
  1. Submit TC-01 (Valid Lead) via local or staging web form
  2. Verify Netlify function returns HTTP 200 with formatted `referenceId`
  3. Verify HighLevel Contact created with all 8 custom fields and tags
  4. Verify Opportunity created in Stage 01
  5. Verify acknowledgment email delivered with working calendar link
  6. Book meeting via calendar link; verify Opportunity moves to Stage 05
  7. Cancel meeting; verify stage updates and task created
  8. Reschedule meeting; verify reminders reset
  9. Simulate No-Show; verify recovery email arrives
  10. Manually move deal to `08 WON — FOUNDING PARTNER`; verify `medspa-won` tag applied and all nurture workflows killed
* **PASS CONDITION**: 18/18 test cases meet acceptance criteria; zero CRM errors logged
* **ROLLBACK / DISABLE METHOD**: Purge all test contacts from HighLevel (`Tags = dws-test`)

---

### PHASE Q — Production Activation & Cutover

* **WHAT TO EXECUTE**: Live Funnel Ingestion Activation
* **PREREQUISITES CHECKLIST**:
  * [ ] Phase A through P verified and passed
  * [ ] DNS records (SPF, DKIM, DMARC) for `growth@dynastyworksstudio.com` green
  * [ ] Netlify production environment variables set (`HIGHLEVEL_LOCATION_API_KEY`)
  * [ ] Netlify serverless function deployed to live production site
  * [ ] Client-side environment variable configured: `VITE_HIGHLEVEL_WEBHOOK_URL=/.netlify/functions/medspa-growth-plan`
* **ACTIVATION STEPS**:
  1. Trigger single live test submission from `/growth/medspa` using verified founder email
  2. Confirm live end-to-end receipt in HighLevel
  3. Confirm lead receives acknowledgment email
  4. Delete test lead or convert to permanent internal baseline
* **ROLLBACK / DISABLE METHOD**: If unexpected ingestion errors occur, unset `VITE_HIGHLEVEL_WEBHOOK_URL` in Netlify build environment; website instantly reverts to graceful local mock mode with zero user-facing errors.
