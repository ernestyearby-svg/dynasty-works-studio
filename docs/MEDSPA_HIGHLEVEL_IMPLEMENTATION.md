# Dynasty MedSpa Growth Engine™
## HighLevel Implementation Blueprint (Phase 4A Approved Baseline)

> **Document Classification**: Internal Systems Specification  
> **Target Platform**: HighLevel (GoHighLevel / LeadConnector API v2)  
> **Serverless Ingestion Layer**: Netlify Functions (`/.netlify/functions/medspa-growth-plan`)  
> **Engine Route**: `/growth/medspa`  
> **Source Repository Branch**: `feature/medspa-growth-engine`  
> **Document Status**: Production Implementation Blueprint (Locked & Approved)

---

### System Architecture Summary

The Dynasty MedSpa Growth Engine™ operates as a two-machine ecosystem:

```
[MACHINE #1: AGENCY B2B ACQUISITION]  <-- SPECIFIED BY THIS BLUEPRINT
Aesthetic Clinic Owner / Director
       ↓
Dynasty Works Studio (/growth/medspa)
       ↓
Netlify Serverless Function (/.netlify/functions/medspa-growth-plan)
       ↓
HighLevel (DWS Private Sub-Account Instance)
       ↓
Pipeline: "MEDSPA GROWTH ENGINE — ACQUISITION"
       ↓
Automated Acknowledgment, Nurture & Strategy Call Booking
       ↓
Close as Founding Partner

═════════════════════════════════════════════════════════════════

[MACHINE #2: CLIENT B2C PATIENT ACQUISITION] <-- FUTURE SNAPSHOT DEPLOYMENT
Prospective Aesthetic Patient
       ↓
Client Dedicated Treatment Landing Pages (Installed by DWS)
       ↓
HighLevel (Client Sub-Account Instance)
       ↓
Pipeline: "CLINIC PATIENT CONSULTATION PIPELINE"
       ↓
Immediate Patient Response, Self-Booking & No-Show Recovery
       ↓
Patient in Clinic Treatment Chair
```

This blueprint specifies **Machine #1: The Dynasty Works Studio Agency Acquisition Engine**.

---

## 1. Contact Model & Duplicate Handling

### Standard Contact Field Mapping
The customer-facing form on `/growth/medspa` collects 13 data points. These map into HighLevel Contact records as follows:

| Website Field | Form Key | HighLevel Contact Field | Field Type | Validation Constraint |
|---|---|---|---|---|
| First Name | `firstName` | `firstName` | String | Required, trimmed, max 50 chars |
| Last Name | `lastName` | `lastName` | String | Required, trimmed, max 50 chars |
| Practice Name | `practiceName` | `companyName` | String | Required, mapped to Company / Account |
| Website | `website` | `website` | URL | Optional, normalized with `https://` |
| Email Address | `email` | `email` | Email | Required, lowercase, RFC 5322 regex |
| Phone Number | `phone` | `phone` | Phone | Required, E.164 normalized |
| City | `city` | `city` | String | Required |
| State | `state` | `state` | String | Required, 2-letter uppercase |

### Custom Fields Specification
Create the following 8 custom fields inside HighLevel under the **Contact** object:

| Field Name | HighLevel Field Key | Field Type | Allowed Options / Description |
|---|---|---|---|
| Primary Treatment to Grow | `dws_primary_treatment` | Single Dropdown | `Injectables`, `Laser`, `Body Contouring`, `Skin / Facial`, `Hair Restoration`, `Weight Management`, `Other` |
| Monthly Marketing Budget | `dws_monthly_marketing_budget` | Single Dropdown | `Under $1,500`, `$1,500–$3,000`, `$3,000–$5,000`, `$5,000–$10,000`, `$10,000+` |
| Current Monthly Lead Volume | `dws_current_monthly_lead_volume` | Single Dropdown | `0–25`, `26–50`, `51–100`, `101–250`, `250+`, `Not Sure` |
| Growth Success Criteria | `dws_success_criteria` | Large Text | Practice goals, revenue targets, treatment margin focus |
| Consent Recorded | `dws_consent_recorded` | Checkbox (Boolean) | `true` / `false` (Audit trail for TCPA/GDPR compliance) |
| Lead Source | `dws_lead_source` | Text / String | `Dynasty MedSpa Growth Engine` |
| Landing Page | `dws_landing_page` | Text / String | `/growth/medspa` |
| Growth Engine Vertical | `dws_growth_engine_vertical` | Single Dropdown | `MedSpa` |

### Default Parameter Values (Injected Automatically)
```json
{
  "dws_lead_source": "Dynasty MedSpa Growth Engine",
  "dws_landing_page": "/growth/medspa",
  "dws_growth_engine_vertical": "MedSpa"
}
```

### Deterministic Duplicate Handling
To prevent duplicate clutter and maintain historical pipeline integrity:
1. **Primary Unique Identifier**: `email` (lowercased and trimmed).
2. **Secondary Identifier**: `phone` (E.164 format).
3. **Upsert Logic**:
   - If a matching contact is found by email:
     - Update standard fields (`firstName`, `lastName`, `companyName`, `city`, `state`, `website`).
     - Update custom fields with the newest submission values (`dws_primary_treatment`, `dws_monthly_marketing_budget`, etc.).
     - Append new dynamic tags (`treatment:*`, `budget:*`) without deleting existing historical tags.
     - **Do NOT create a duplicate contact record.**
   - **Opportunity Handling for Repeat Submissions**:
     - If the contact has an active opportunity in `01` through `07`: Add a detailed internal note on the existing opportunity with the new submission details, update the opportunity title, and alert the assigned strategist.
     - If the contact's previous opportunity was `WON`, `LOST`, or in `LONG-TERM NURTURE`: Open a new opportunity in `01 NEW GROWTH PLAN REQUEST` to re-enter the active acquisition pipeline.

---

## 2. Tagging System

### Base Normalized Tags
Every lead submitted through the funnel receives three universal baseline tags:
* `dws-lead` — Universal identifier for any lead in Dynasty Works Studio.
* `medspa-growth-engine` — Funnel / product family tag.
* `growth-plan-request` — Specific conversion event tag.

### Dynamic Attribute Tags
Generated programmatically from form dropdown selections:
* **Treatment Tag**: `treatment:{slug}`  
  *Examples*: `treatment:injectables`, `treatment:laser`, `treatment:body-contouring`, `treatment:skin-facial`, `treatment:hair-restoration`, `treatment:weight-management`, `treatment:other`
* **Budget Tag**: `budget:{slug}`  
  *Examples*: `budget:under-1500`, `budget:1500-3000`, `budget:3000-5000`, `budget:5000-10000`, `budget:10000-plus`

### Lifecycle State Tags
Only **one** active lifecycle tag should exist on a contact at any time:
* `medspa-new-lead` — Ingestion completed; automated response initiated.
* `medspa-contacted` — Response sent or outbound contact attempted.
* `medspa-qualified` — Verified through manual strategist review.
* `medspa-demo-booked` — Strategy call scheduled on calendar.
* `medspa-demo-completed` — Strategy review completed; awaiting proposal.
* `medspa-proposal` — Growth plan / partnership proposal delivered.
* `medspa-won` — Contract signed / Founding Partner agreement executed.
* `medspa-lost` — Formally passed, unviable economics, or competitor chosen.
* `medspa-nurture` — Unresponsive or deferred timing; moved to educational track.

### Tag Hygiene Rules
1. Automated workflows must remove previous lifecycle tags before applying a new stage tag.
2. Never create plural or casing duplicates (e.g., no `medspa-leads`, `MedSpa-Lead`, etc.).
3. Tag slugs must always be lowercase with hyphen delimiters.

---

## 3. Sales Pipeline Specification & Manual Qualification

### Pipeline Name
`MEDSPA GROWTH ENGINE — ACQUISITION`

### Pipeline Stages & Operating Rules

| # | Stage Name | Entry Condition | Exit Condition | Responsible Party | Automation Behavior |
|---|---|---|---|---|---|
| **01** | `01 NEW GROWTH PLAN REQUEST` | Form submission envelope ingested from website. | Automated acknowledgement sent or strategist reviews. | System / Automation | Ingest contact, apply tags, create opportunity, fire internal email & in-app alerts. |
| **02** | `02 AUTOMATED RESPONSE SENT` | Automated acknowledgement SMS/Email dispatched. | Prospect clicks link, books call, or 24h passes without action. | System / Automation | Triggers booking nurture sequence. |
| **03** | `03 CONTACT ATTEMPTED` | Manual outreach performed (call/direct email) or Day 2 nurture trigger. | Lead responds or call scheduled. | Growth Strategist | Logs outreach touchpoint; tracks response SLA. |
| **04** | `04 QUALIFIED` | **Strict Manual Review** by Growth Strategist. | Strategy session booked or lead marked not fit. | Growth Strategist | Removes `medspa-new-lead`, adds `medspa-qualified`. |
| **05** | `05 STRATEGY CALL BOOKED` | Prospect schedules via HighLevel calendar widget. | Meeting begins or is cancelled/rescheduled. | System & Strategist | Cancels nurture sequence; triggers reminder sequence (24h, 2h). |
| **06** | `06 STRATEGY CALL COMPLETED` | Meeting concludes; strategist marks disposition. | Proposal sent or lead routed to nurture. | Growth Strategist | Creates internal task: "Deliver Growth Plan Proposal within 24h". |
| **07** | `07 PROPOSAL / DECISION` | Growth Plan presentation & agreement sent. | Agreement signed or decision deferred. | Managing Partner | Follow-up sequence (Day 2, Day 5 review touchpoints). |
| **08** | `08 WON — FOUNDING PARTNER` | Signed partnership agreement executed. | Client onboarding begins. | Executive Leadership | Stops all prospect automations; applies `medspa-won`; triggers Onboarding. |
| **09** | `09 LONG-TERM NURTURE` | Nurture sequence completed or lead requested later timing. | Prospect re-engages or requests opt-out. | Marketing System | Low-frequency aesthetic marketing briefings & insights. |
| **10** | `10 CLOSED / NOT FIT` | Lead disqualified during manual review or meeting. | Pipeline terminal. | Growth Strategist | Closes opportunity as Lost/Abandoned; removes active nurture tags. |

### Strict Manual Qualification Protocol
> [!IMPORTANT]
> **NO AUTOMATIC QUALIFICATION**: A monthly marketing budget of $3,000+ is a **signal**, NOT an automatic qualification decision. Under no circumstances may a lead be moved to `04 QUALIFIED` by an automated rule.

Every qualification transition into `04 QUALIFIED` requires manual human review by a Dynasty Works Growth Strategist assessing:
1. **Legitimate Operating Practice**: Verifiable physical location, active medical director, credible web/social footprint.
2. **Treatment / Service Opportunity**: Alignment with high-value procedures where connected funnels drive strong unit economics (Injectables, Body Contouring, Laser).
3. **Realistic Acquisition Objective**: Practice has realistic growth expectations and capacity to handle new patient inquiry volume.
4. **Ability & Willingness to Invest**: Financial viability to sustain advertising spend and partnership investment.
5. **Operational Readiness**: Front desk or patient coordinator capable of following up and handling clinical consultations.
6. **Decision-Maker Involvement**: Owner, medical director, or authorized executive director engaged.
7. **Brand & Cultural Fit**: Practice standards align with Dynasty Works Studio's quality and aesthetic benchmarks.

---

## 4. Website Form Ingestion Workflow (WF-01)

```
[WEBSITE FORM SUBMISSION ON /growth/medspa]
       ↓
[NETLIFY SERVERLESS FUNCTION: /.netlify/functions/medspa-growth-plan]
  • Validates payload (Zod schema)
  • Enforces rate limiting & honeypot anti-bot checks
  • Sanitizes inputs
       ↓
[HIGHLEVEL REST API v2 INGESTION]
  • Upsert Contact by Email / Phone
  • Apply Base Tags: dws-lead, medspa-growth-engine, growth-plan-request, medspa-new-lead
  • Apply Dynamic Tags: treatment:{slug}, budget:{slug}
  • Save Custom Fields (Treatment, Budget, Volume, Criteria, Consent)
       ↓
[CREATE / UPDATE OPPORTUNITY]
  • Pipeline: MEDSPA GROWTH ENGINE — ACQUISITION
  • Stage: 01 NEW GROWTH PLAN REQUEST
  • Opportunity Name: {{contact.company_name}} — Growth Plan
       ↓
[INTERNAL NOTIFICATIONS]
  • HighLevel in-app notification to operations team
  • Email notification to growth@dynastyworksstudio.com
       ↓
[TRIGGER WORKFLOW: WF-02 IMMEDIATE LEAD RESPONSE]
```

*Note*: The customer-facing form on the website remains the source of truth for user interface and brand styling. HighLevel forms must **not** replace the custom React front end.

---

## 5. Immediate Lead Response (WF-02)

> **Operational Standard**: Automated acknowledgment is initiated as soon as practical after successful ingestion. No unverified latency claims (<60s) are promised in customer copy.

### SMS Workflow Requirements (DISABLED AT LAUNCH)
> [!WARNING]
> All automated SMS workflows must remain **DISABLED** in production until:
> 1. Dedicated sending phone number is provisioned.
> 2. A2P 10DLC Brand & Campaign registration is fully approved.
> 3. Consent language and TCPA disclosures are audited.
> 4. Automated `STOP` / opt-out keyword handling is verified in sandbox.
> 5. End-to-end test messaging passes QA.

#### Proposed SMS Copy (When Activated)
* **Sender**: Dynasty Works Studio (Dedicated 10DLC Number)
* **Copy**:
```text
Hi {{contact.first_name}}, this is the MedSpa Growth Engine team at Dynasty Works Studio. We received the Growth Plan request for {{contact.company_name}}.

The next step is a short strategy conversation so we can review your current patient-acquisition process and identify where stronger follow-up and booking systems could create additional opportunity.

Choose a time that fits your clinic schedule here:
{{calendar_link}}
```

### Email Workflow Requirements
> [!NOTE]
> Automated email sending will be activated only after SPF, DKIM, DMARC, and custom sending-domain records are verified for `growth@dynastyworksstudio.com`.

#### Proposed Email Template
* **From**: `Dynasty Works Studio <growth@dynastyworksstudio.com>`
* **Reply-To**: `growth@dynastyworksstudio.com`
* **Subject**: `Your MedSpa Growth Plan Request — {{contact.company_name}}`
* **Preheader**: `We have received your request and initiated your practice acquisition review.`
* **Body**:
```html
<p>Dear {{contact.first_name}},</p>

<p>Thank you for requesting a custom Growth Plan for <strong>{{contact.company_name}}</strong>.</p>

<p>Our team has received your clinic details and your focus on <strong>{{contact.dws_primary_treatment}}</strong>. We are reviewing your market positioning, current patient flow, and follow-up opportunities.</p>

<p><strong>What Your Growth Plan Covers:</strong></p>
<ul>
  <li><strong>Current Lead Flow</strong> — An objective review of your active inquiry volume and patient acquisition sources.</li>
  <li><strong>High-Value Treatment Opportunity</strong> — Prioritizing procedures with strong local demand and optimal clinician margins.</li>
  <li><strong>Inquiry Response &amp; Follow-Up</strong> — Assessing speed-to-lead and testing follow-up consistency to eliminate lost inquiries.</li>
  <li><strong>Consultation Booking Path</strong> — Removing friction from the patient scheduling journey to maximize show-up rates.</li>
  <li><strong>Dormant Database Opportunity</strong> — Uncovering untapped revenue inside historical patient lists and unbooked leads.</li>
  <li><strong>Recommended Acquisition Roadmap</strong> — A step-by-step implementation blueprint tailored to your practice capacity.</li>
</ul>

<p><strong>Next Step:</strong></p>
<p>To walk through your custom roadmap and evaluate fit for a managed growth deployment, please select a convenient 30-minute window for a Growth Strategy Call:</p>

<p style="text-align: center; margin: 2rem 0;">
  <a href="{{calendar_link}}" style="background: #b89247; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
    SCHEDULE YOUR STRATEGY CALL &rarr;
  </a>
</p>

<p>If you have any immediate questions before our call, simply reply directly to this email.</p>

<p>Warm regards,<br>
<strong>The MedSpa Growth Engine Team</strong><br>
Dynasty Works Studio<br>
<span style="font-size: 12px; color: #888;">Automation &bull; Systems &bull; Brands</span></p>
```

---

## 6. Booking Nurture Workflow (WF-03)

If the prospect does not book an appointment immediately upon receiving the initial response, this sequence activates:

```
[WF-02 IMMEDIATE ACKNOWLEDGEMENT SENT]
       ↓
[WAIT 24 HOURS]
  Condition: Is Strategy Call Booked?
  → YES: Stop workflow.
  → NO: Step 1 (Day 1)
       ↓
[DAY 1: STRATEGY INSIGHT EMAIL]
  • Channel: Email
  • Focus: "The Revenue Leak: Why inquiries slip away before the chair"
  • CTA: Calendar link
       ↓
[WAIT 24 HOURS]
  Condition: Is Strategy Call Booked?
  → YES: Stop workflow.
  → NO: Step 2 (Day 2)
       ↓
[DAY 2: CHECK-IN SMS (If Active) + INTERNAL STRATEGIST TASK]
  • Channel: SMS (if enabled) & Internal Task
  • SMS Copy: "Hi {{contact.first_name}}, our team is preparing your {{contact.dws_primary_treatment}} acquisition roadmap. Did you have a chance to pick a time for your strategy review? {{calendar_link}}"
  • Internal Task: Growth Strategist manually checks clinic website/social presence.
       ↓
[WAIT 48 HOURS]
  Condition: Is Strategy Call Booked?
  → YES: Stop workflow.
  → NO: Step 3 (Day 4)
       ↓
[DAY 4: ARCHITECTURE & SYSTEMS EMAIL]
  • Channel: Email
  • Focus: "Connected Systems vs. Disjointed Marketing in Aesthetic Practices"
  • CTA: Calendar link
       ↓
[WAIT 72 HOURS]
  Condition: Is Strategy Call Booked?
  → YES: Stop workflow.
  → NO: Step 4 (Day 7)
       ↓
[DAY 7: FINAL TOUCHPOINT EMAIL]
  • Channel: Email
  • Copy: Friendly close-the-loop inquiry. Leaves door open without pressure.
       ↓
[MOVE OPPORTUNITY TO: 09 LONG-TERM NURTURE]
  • Remove tag: medspa-new-lead
  • Add tag: medspa-nurture
```

### Global Stop Conditions (Workflow Hard Exit)
The workflow terminates immediately if:
1. Contact books any appointment on `MEDSPA GROWTH STRATEGY CALL`.
2. Contact replies with `STOP`, `UNSUBSCRIBE`, or expresses opt-out intent.
3. Strategist manually changes opportunity stage to `CLOSED / NOT FIT` or removes contact.

---

## 7. Strategy Call Calendar & Reminders (WF-04)

### Calendar Configuration
* **Calendar Name**: `MEDSPA GROWTH STRATEGY CALL`
* **Duration**: 30 minutes
* **Buffer Times**: 15 minutes before / 15 minutes after
* **Minimum Scheduling Notice**: 4 hours
* **Date Range Availability**: Rolling 14 calendar days
* **Meeting Channel**: Google Meet / Zoom link (auto-generated)

### V1 Reminder Cadence (Extensible)
* **Immediate**: Booking confirmation email + calendar invite (`.ics`).
* **24 Hours Before**: Email reminder with session agenda and direct video join link.
* **2 Hours Before**: SMS reminder (once SMS is activated): *"Hi {{contact.first_name}}, looking forward to reviewing {{contact.company_name}}'s Growth Plan today at {{appointment.time}}. Join here: {{appointment.meeting_link}}"*
* *(Note: 15-minute SMS reminder removed from V1 to prevent message fatigue).*

### Rescheduling & Cancellation
* Every reminder includes a one-click self-service rescheduling link.
* If rescheduled: calendar automatically updates and resets reminder timers.
* If cancelled: opportunity stage updates to `03 CONTACT ATTEMPTED` and an internal follow-up task is assigned.

---

## 8. Appointment Workflow & Post-Call Disposition

```
[APPOINTMENT BOOKED ON CALENDAR]
       ↓
[HIGHLEVEL ACTION: UPDATE OPPORTUNITY]
  • Move to Stage: 05 STRATEGY CALL BOOKED
  • Update tags: Remove medspa-contacted, Add medspa-demo-booked
       ↓
[HIGHLEVEL ACTION: CANCEL ALL ACTIVE NURTURE WORKFLOWS]
       ↓
[HIGHLEVEL ACTION: DISPATCH CONFIRMATION & CALENDAR INVITE]
       ↓
[HIGHLEVEL ACTION: SCHEDULE REMINDERS (24h Email, 2h SMS)]
       ↓
[STRATEGY CALL HAPPENS]
       ↓
[STRICT MANUAL DISPOSITION BY GROWTH STRATEGIST]
  (Strict Rule: NO automatic qualification or won status)
  • Disposition A: 06 STRATEGY CALL COMPLETED (Scoping roadmap)
  • Disposition B: 07 PROPOSAL / DECISION (Proposal presented)
  • Disposition C: 09 LONG-TERM NURTURE (Timing deferred; relationship maintained)
  • Disposition D: 10 CLOSED / NOT FIT (Disqualified)
```

---

## 9. No-Show Recovery Protocol (WF-05)

If a prospect fails to attend the scheduled strategy session:

1. **Trigger**: Strategist marks appointment status as `No-Show` in HighLevel.
2. **Immediate Action (t + 20 minutes)**:
   * **Email**: *"We missed our strategy session today — Rescheduling link inside"*
   * **SMS (if active)**: *"Hi {{contact.first_name}}, we missed you for our scheduled growth session today. We know practice emergencies arise—you can choose a new time that works best for you here: {{calendar_link}}"*
3. **Internal Task Created**: *"Review lead {{contact.name}} ({{contact.company_name}}) - No-show follow-up outreach in 24 hours."*
4. **Follow-Up (t + 48 hours)**: If no reschedule occurs, send one gentle follow-up email before transitioning to `09 LONG-TERM NURTURE`.
5. **Anti-Spam Constraint**: Maximum of 2 automated recovery touchpoints. No aggressive repetitive messaging.

---

## 10. Internal Notifications Architecture

For V1, all internal notifications are routed through **HighLevel In-App Alerts** and **Dynasty Works Email Notifications** (`growth@dynastyworksstudio.com`). There is **zero external Slack dependency** in V1.

| Event | Channel | Notification Copy |
|---|---|---|
| **New Growth Plan Request** | HighLevel In-App & Email | `🚨 New MedSpa Lead: {{contact.first_name}} {{contact.last_name}} ({{contact.company_name}}) — Treatment: {{contact.dws_primary_treatment}}, Budget: {{contact.dws_monthly_marketing_budget}}. Ref: {{contact.dws_reference_id}}` |
| **Qualified Prospect** | HighLevel In-App & Email | `⭐ Qualified MedSpa Lead: {{contact.company_name}} manually approved by {{user.name}}. Target Treatment: {{contact.dws_primary_treatment}}` |
| **Strategy Call Booked** | Email & Calendar Invite | `📅 Strategy Call Scheduled: {{contact.first_name}} {{contact.last_name}} ({{contact.company_name}}) on {{appointment.date}} at {{appointment.time}}. Agenda: Growth Plan Scoping.` |
| **Strategy Call Cancelled** | HighLevel In-App & Email | `⚠️ Strategy Call Cancelled: {{contact.company_name}} cancelled appointment for {{appointment.date}}. Follow-up task created.` |
| **Strategy Call No-Show** | HighLevel In-App & Task | `❌ No-Show: {{contact.company_name}} missed session on {{appointment.date}}. Recovery sequence initiated.` |
| **Proposal Stage** | HighLevel In-App | `📋 Proposal Active: {{contact.company_name}} moved to 07 PROPOSAL / DECISION. Review SLA: 48h.` |
| **Won Client** | HighLevel In-App & Email | `🎉 NEW FOUNDING PARTNER: {{contact.company_name}} has signed! Initiating Machine #2 Client Onboarding.` |

---

## 11. Founding Partner Conversion (WF-07)

When an opportunity is manually advanced to `08 WON — FOUNDING PARTNER`:

1. **Terminate All Prospecting**: Instantly kill any active lead, nurture, or booking sequences.
2. **Apply Won Tag**: Add `medspa-won`.
3. **Tag Cleanup**: Remove all prospect-phase lifecycle tags (`medspa-new-lead`, `medspa-contacted`, `medspa-qualified`, `medspa-demo-booked`, `medspa-proposal`, `medspa-nurture`).
4. **Trigger Onboarding Placeholder**: Fire trigger `FOUNDING PARTNER ONBOARDING` (creates internal handoff task).
5. **Billing Separation**: Billing, Stripe retainers, and contracts are handled outside the automated funnel; no billing automations are triggered inside this workflow.

---

## 12. Dynasty Data Ownership Architecture

> [!IMPORTANT]
> **Data Sovereignty Rule**: HighLevel serves as the operational execution CRM and automation engine. It is **NOT** the sole long-term repository of Dynasty Works Studio's proprietary acquisition intelligence.

### Future Multi-Tier Architecture (Documented for Future Phase)
```
[WEBSITE FORM ON /growth/medspa]
       ↓
[NETLIFY SECURE FUNCTION: /.netlify/functions/medspa-growth-plan]
  ├── (A) Operational Ingestion → HighLevel REST API v2 (Leads, Pipelines, Automations)
  └── (B) Proprietary Ingestion → Dynasty Data Layer (Supabase PostgreSQL Database)
```

And downstream operational event tracking:
```
[HIGHLEVEL WEBHOOKS / EVENT TRIGGERS]
  (Lead Stage Changes, Appointments Booked, Attendance Status, Conversions)
       ↓
[NETLIFY WEBHOOK HANDLER]
       ↓
[DYNASTY DATA LAYER (Supabase)]
       ↓
[CROSS-VERTICAL REPORTING & ACQUISITION INTELLIGENCE]
```

*Note*: This dual-synchronization layer is documented as architectural guidance. **It will NOT be implemented during Phase 4.**

---

## 13. Consent, TCPA & Communication Controls

To maintain full compliance with TCPA, CAN-SPAM, and GDPR regulations:

1. **Preserved Submission Metadata**:
   * Exact UTC submission timestamp (`submittedAt`)
   * Explicit affirmative consent state (`consent: true`)
   * Source landing page route (`/growth/medspa`)
   * Funnel identity (`Dynasty MedSpa Growth Engine`)
   * Deterministic submission reference ID (`DWS-MEDSPA-{TIMESTAMP}-{RANDOM}`)
2. **Automated Opt-Out & Suppression**:
   * Inbound SMS keywords: `STOP`, `UNSUBSCRIBE`, `CANCEL`, `QUIT`, `END`.
   * Action upon keyword detection:
     - HighLevel automatically suppresses further SMS to that phone number.
     - Adds contact tag `dws-opt-out`.
     - Removes contact from all active workflows immediately.
3. **Manual Stop Capability**:
   * Every strategist has one-click capability to mark DND (Do Not Disturb) across SMS, Email, and Calls directly in the HighLevel contact record.
   * Moving a deal to `10 CLOSED / NOT FIT` automatically applies full communication suppression.

---

## 14. Netlify Secure Serverless Endpoint & HighLevel Authentication

### Platform Decision: Netlify Functions
The serverless proxy will be hosted directly within Dynasty Works Studio's existing Netlify deployment:
* **Function Path**: `netlify/functions/medspa-growth-plan.ts`
* **Public Endpoint**: `/.netlify/functions/medspa-growth-plan`
* **Zero Third-Party Cloud Dependencies**: No AWS Lambda, no Cloudflare Workers.

### Authentication Specification
* **V1 Authentication Method**: **Private Integration / Location-Level API Key** (REST API v2).
* **Token Storage**: Stored exclusively as a private server-side environment variable (`HIGHLEVEL_LOCATION_API_KEY`) within Netlify's secure environment settings.
* **Client-Side Isolation**: The React client bundle contains **zero API keys**. It communicates only with `/.netlify/functions/medspa-growth-plan`.
* **Future OAuth 2.0 Roadmap**: If Dynasty Works productizes multi-location snapshots across independent sub-accounts in the future, OAuth 2.0 app authorization will be implemented. For V1, private location-level authentication is strictly enforced.

### Server-Side Security Controls
1. **Zod Schema Validation**: Enforces string length, valid email structure, E.164 phone formats, and required booleans.
2. **Sliding-Window Rate Limiting**: Max 5 submissions per IP address per 10 minutes (returns HTTP 429).
3. **Anti-Bot Honeypot**: Hidden field `hp_clinic_website` rejected if populated.
4. **Idempotency Protection**: `referenceId` cached to prevent double-charging or duplicate opportunity creation on double-clicks.
5. **Exponential Backoff**: Up to 3 retries (1s, 2s, 4s) on HTTP 5xx responses from HighLevel API.
6. **Error Masking**: User browser receives only safe, generic status messages (`Submission received` or `Unable to submit, please try again`).

---

## 15. Comprehensive Test Plan

> [!IMPORTANT]
> All testing must utilize verified internal test accounts (`@dynastyworksstudio.com`) and designated sandbox phone numbers. Zero real prospective med-spa owners may receive automated messages during QA.

| Test Case ID | Test Scenario | Input Data / Condition | Expected Result | Pass Criteria |
|---|---|---|---|---|
| **TC-01** | Valid Lead Submission | Complete valid form with all 13 fields. | Contact upserted, tags applied, opportunity in Stage 01, immediate email sent, Reference ID displayed. | Status 200; Reference ID matches pattern. |
| **TC-02** | Missing Required Field | Submit form with empty `practiceName`. | Client-side validation stops submit; field highlighted in red. | No network request fired; error message visible. |
| **TC-03** | Invalid Email | Submit `claire@invalid`. | Error: "Please provide a valid email address." | Submit blocked. |
| **TC-04** | Invalid Phone | Submit `555-12`. | Error: "Please provide a valid contact phone number." | Submit blocked. |
| **TC-05** | Duplicate Email | Submit identical email with updated treatment. | Existing contact updated; new opportunity note created; no duplicate contact record. | Single contact record in CRM. |
| **TC-06** | Duplicate Phone | Submit matching phone with different name. | Contact merged or flagged per HighLevel deduplication settings. | Record logged correctly. |
| **TC-07** | Rapid Repeated Submissions | 6 submits in 2 minutes from same IP. | Netlify Function rate limiter returns HTTP 429 Too Many Requests. | Abuse prevented. |
| **TC-08** | Webhook Network Failure | Simulate network timeout to endpoint. | Form displays graceful user error: "An error occurred during submission. Please try again." | No unhandled JS crash. |
| **TC-09** | HighLevel Service 503 | Server receives 503 from LeadConnector. | Function retries 3x, logs error, returns friendly user error. | Retry verified in logs. |
| **TC-10** | SMS Delivery Failure | Test with invalid carrier number (when SMS enabled). | Workflow logs SMS error; fallback email dispatched. | Log shows fallback. |
| **TC-11** | Email Bounced | Test with disposable bounce mailbox. | HighLevel marks email bounced; flags contact for review. | Contact flagged in CRM. |
| **TC-12** | Appointment Booked | Prospect clicks calendar link and selects slot. | Opportunity moves to `05 STRATEGY CALL BOOKED`; nurture workflow killed; calendar invite delivered. | Opportunity stage verified in pipeline. |
| **TC-13** | Appointment Cancelled | Prospect cancels via calendar link. | Opportunity stage updates to `03 CONTACT ATTEMPTED`; task created for strategist. | Strategist notified. |
| **TC-14** | Appointment Rescheduled | Prospect reschedules meeting time. | Calendar update synced; reminder triggers recalculated for new time. | New reminder times set. |
| **TC-15** | Strategy Call No-Show | Strategist marks appointment as No-Show. | Courteous recovery email dispatched; follow-up task created. | No-show workflow fires. |
| **TC-16** | SMS Opt-Out | Prospect replies `STOP` (when SMS enabled). | HighLevel immediately blacklists SMS; unsubscribed tag applied. | Zero further SMS sent. |
| **TC-17** | Manual Disqualification | Strategist moves lead to `10 CLOSED / NOT FIT`. | Opportunity closed; all active automations stopped. | Pipeline reflects lost opportunity. |
| **TC-18** | Won Client | Lead moved to `08 WON — FOUNDING PARTNER`. | `medspa-won` applied; all prospect workflows killed; onboarding alert fired. | Clean transition to onboarding. |
