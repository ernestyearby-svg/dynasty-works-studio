# Dynasty Works Studio — Growth Operating System
## Lead Generation Funnel Integration & Operator Blueprint V1.0

### Executive Overview
The **Dynasty Growth Operating System** is a business growth infrastructure bridging the entire journey between:
```
TRAFFIC → LEAD → FOLLOW-UP → APPOINTMENT → CUSTOMER → REVENUE
```

This document specifies the technical architecture, normalized data schema, tracking event bus, and webhook ingestion protocols for engineering and operations teams.

---

### 1. Routes & Canonical Architecture

All routes enforce the **Production Domain Lock**. Canonical URLs and Open Graph metadata strictly reference `https://dynastyworksstudio.com`.

| Route | Purpose | Component |
| :--- | :--- | :--- |
| `https://dynastyworksstudio.com/growth` | Primary Lead Generation Funnel Landing Page (Sections 01–09 with embedded audit form) | `GrowthLandingPage.tsx` |
| `https://dynastyworksstudio.com/growth/apply` | Dedicated High-Conversion Application Page | `GrowthApplyPage.tsx` |
| `https://dynastyworksstudio.com/growth/book` | Strategy Call Mapping & GoHighLevel Calendar Container | `GrowthBookPage.tsx` |
| `https://dynastyworksstudio.com/growth/thank-you` | Confirmation & Strategic Onboarding Stage ("What Happens Next" 01–04) | `GrowthThankYouPage.tsx` |

---

### 2. Normalized Form & Lead Payload Schema

All lead applications are normalized client-side by `src/growth/lib/growth-integration-adapter.ts` into the following standardized JSON payload before transmission:

```json
{
  "first_name": "Marcus",
  "last_name": "Vance",
  "business_name": "Apex Performance Studio",
  "email": "marcus@apexperformance.com",
  "phone": "(555) 234-5678",
  "website": "https://apexperformance.com",
  "industry": "Fitness / Gym",
  "monthly_marketing_budget": "$2,500–$5,000",
  "primary_goal": "Book More Appointments",
  "current_crm": "None / Spreadsheets",
  "lead_generation_method": "Referrals and local Meta ads",
  "biggest_bottleneck": "Leads wait 24 hours for a response and drop off before booking",
  "notes": "Looking to launch automated SMS follow-up before Q4",
  "utm_source": "meta",
  "utm_medium": "paid_social",
  "utm_campaign": "q4_growth_audit",
  "utm_content": "video_system_breakdown",
  "utm_term": "growth_infrastructure",
  "landing_page": "https://dynastyworksstudio.com/growth",
  "referrer": "https://l.instagram.com/",
  "first_touch_url": "https://dynastyworksstudio.com/growth?utm_source=meta&utm_medium=paid_social",
  "campaign_id": "1202058392",
  "creative_id": "94820184",
  "submitted_at": "2026-09-27T02:15:00.000Z"
}
```

---

### 3. Tracking & Event Bus Specification

The tracking engine (`src/growth/lib/growth-tracking.ts`) listens to and emits standardized events. It dispatches a custom browser event `growth_event` and forwards payloads to `dataLayer`, `fbq`, and `gtag` if present on the host page.

| Event Name | Trigger Moment | Expected Metadata |
| :--- | :--- | :--- |
| `growth_page_view` | Funnel page load (`/growth`, `/growth/apply`, etc.) | `{ page: string }` |
| `growth_cta_click` | User clicks any primary or secondary action button | `{ cta_label: string, cta_destination: string }` |
| `growth_form_start` | User interacts with the first input of the audit form | `{ page: string }` |
| `growth_form_submit` | Form submission triggered by user | `{ industry: string, budget: string, goal: string }` |
| `growth_form_success` | Webhook or mock submission resolved successfully | `{ submission_mode: 'webhook' \| 'mock', industry: string }` |
| `growth_booking_view` | User arrives at `/growth/book` | `{ page: '/growth/book' }` |
| `growth_booking_click` | User clicks calendar reservation or test trigger | `{ page: '/growth/book', metadata: object }` |
| `growth_thank_you_view` | User arrives at `/growth/thank-you` | `{ page: '/growth/thank-you' }` |

#### Client Listening Example:
```javascript
window.addEventListener('growth_event', (event) => {
  console.log('Growth telemetry captured:', event.detail);
});
```

---

### 4. Webhook & Endpoint Configuration

The adapter dynamically inspects the environment variable:
```env
VITE_GROWTH_SYSTEM_WEBHOOK_URL=https://your-n8n-instance.com/webhook/dws-growth-lead
```

#### Ingestion Endpoints Supported:
1. **n8n Webhook**: Direct `POST` node accepting JSON, forwarding to HighLevel or Supabase.
2. **GoHighLevel Custom Webhook**: Directly triggers a HighLevel workflow to instantiate Contact, assign pipeline, and fire sub-60s SMS.
3. **Supabase Edge Function**: Authenticated Postgres storage with real-time alerting.

#### Mock Mode Fallback:
If `VITE_GROWTH_SYSTEM_WEBHOOK_URL` is omitted or unconfigured, the adapter enters safe **Mock Mode**, simulating server latency (600ms), logging the validated payload to the console, and returning a valid success response to permit full local UI testing.

---

### 5. Security & Anti-Spam Architecture

1. **Zero Client Secrets**: No GoHighLevel API keys, database service-role secrets, or private tokens exist in client JavaScript bundles.
2. **Honeypot Protection**: A hidden field (`website_confirm`) is placed within the form. Automated bots that populate this field have their submissions silently dropped without triggering backend actions.
3. **Input Sanitization**: Email addresses are lowercased and verified against regex; all string fields are trimmed.
4. **Rate Limiting**: Downstream webhook handlers (n8n / cloud gateways) should enforce IP-based rate limiting (e.g., maximum 5 submissions per IP per 10-minute window).
