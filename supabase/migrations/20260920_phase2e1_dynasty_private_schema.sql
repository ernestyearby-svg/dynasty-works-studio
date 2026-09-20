-- ======================================================================
-- DYNASTY WORKS STUDIO // PRODUCTION DATABASE ARCHITECTURE
-- Migration: 20260920_phase2e1_dynasty_private_schema.sql
-- Status: PHASE 2E.1 FOUNDATION MIGRATION
-- Classification: HIGH-CONFIDENTIALITY DWS COMMERCIAL INGESTION DATA BOUNDARY
-- ======================================================================

begin;

-- 1. Create Isolated Private Schema
create schema if not exists dynasty_private;

-- Immediately revoke public, anonymous, and standard authenticated access to the schema
revoke all on schema dynasty_private from public, anon, authenticated;

-- 2. Enumerated Domain Types
do $$ begin
  create type dynasty_private.lead_status as enum (
    'NEW', 'REVIEWING', 'QUALIFIED', 'STRATEGY_SCHEDULED', 'PROPOSAL', 'ENGAGED', 'NOT_NOW', 'CLOSED'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type dynasty_private.submission_type as enum (
    'builder', 'blueprint', 'general'
  );
exception when duplicate_object then null;
end $$;

-- 3. Ephemeral Durable Rate Limiting Table (Privacy-Preserved Hash Only)
create table if not exists dynasty_private.rate_limits (
  ip_hash text not null,
  window_start timestamptz not null default now(),
  request_count int not null default 1,
  primary key (ip_hash, window_start)
);
create index if not exists rate_limits_window_idx on dynasty_private.rate_limits(window_start);

-- 4. Master Founder / Entity Record
create table if not exists dynasty_private.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 3 and 254),
  phone text check (char_length(phone) <= 40),
  company_name text not null check (char_length(company_name) between 1 and 150),
  website text check (char_length(website) <= 2000 and website ~* '^https?://'),
  source dynasty_private.submission_type not null,
  status dynasty_private.lead_status not null default 'NEW'
);
create index if not exists leads_email_idx on dynasty_private.leads(email);
create index if not exists leads_review_queue_idx on dynasty_private.leads(status, created_at desc);

-- 5. Immutable Submission Envelope & Audit Record
create table if not exists dynasty_private.inquiries (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references dynasty_private.leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  inquiry_type dynasty_private.submission_type not null,
  idempotency_key uuid not null unique,
  payload_hash text not null check (payload_hash ~ '^[0-9a-f]{64}$'),
  receipt_id uuid not null default gen_random_uuid() unique,
  evaluation_consent boolean not null check (evaluation_consent = true),
  communication_consent boolean not null check (communication_consent = true),
  notice_version text not null check (char_length(notice_version) between 1 and 100),
  consent_at timestamptz not null default now(),
  notification_status text not null default 'PENDING' check (notification_status in ('PENDING', 'SENT', 'FAILED', 'EXHAUSTED')),
  retry_count int not null default 0 check (retry_count >= 0),
  next_retry_at timestamptz,
  notification_sent_at timestamptz,
  notification_error text,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object')
);
create index if not exists inquiries_lead_id_idx on dynasty_private.inquiries(lead_id);
create index if not exists inquiries_receipt_id_idx on dynasty_private.inquiries(receipt_id);
create index if not exists inquiries_idempotency_idx on dynasty_private.inquiries(idempotency_key);
create index if not exists inquiries_pending_notifications_idx on dynasty_private.inquiries(notification_status, next_retry_at)
  where notification_status in ('PENDING', 'FAILED');

-- 6. Detail 01: Company Builder Lead Details
create table if not exists dynasty_private.builder_submissions (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null unique references dynasty_private.inquiries(id) on delete cascade,
  lead_id uuid not null references dynasty_private.leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  business_type text not null check (char_length(business_type) <= 100),
  business_stage text not null check (business_stage in ('Idea', 'Preparing to launch', 'Operating', 'Growing')),
  existing_assets jsonb not null check (jsonb_typeof(existing_assets) = 'array'),
  selected_needs jsonb not null check (jsonb_typeof(selected_needs) = 'array'),
  launch_timeline text not null check (char_length(launch_timeline) <= 200),
  budget_range text check (char_length(budget_range) <= 200),
  ambition_notes text check (char_length(ambition_notes) <= 2000),
  server_recomputed_services jsonb not null check (jsonb_typeof(server_recomputed_services) = 'array'),
  server_recomputed_phases jsonb not null check (jsonb_typeof(server_recomputed_phases) = 'array'),
  recommended_package text not null check (char_length(recommended_package) <= 100),
  rules_version text not null default '5.8'
);

-- 7. Detail 02: Founder Blueprint Intake Details
create table if not exists dynasty_private.founder_blueprint_intakes (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null unique references dynasty_private.inquiries(id) on delete cascade,
  lead_id uuid not null references dynasty_private.leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  business_type text not null check (char_length(business_type) <= 100),
  business_stage text not null check (business_stage in ('Idea', 'Preparing to launch', 'Operating', 'Growing')),
  physical_market boolean not null,
  idea_description text not null check (char_length(idea_description) between 20 and 3000),
  problem_description text not null check (char_length(problem_description) between 10 and 2000),
  target_customer text not null check (char_length(target_customer) between 10 and 1500),
  existing_assets text check (char_length(existing_assets) <= 2000),
  requested_needs text not null check (char_length(requested_needs) between 10 and 2000),
  target_launch text not null check (char_length(target_launch) between 1 and 200),
  primary_market text not null check (char_length(primary_market) between 1 and 200),
  competitors text check (char_length(competitors) <= 1500),
  brand_assets text check (char_length(brand_assets) <= 1500),
  company_documents text check (char_length(company_documents) <= 1000),
  digital_assets text check (char_length(digital_assets) <= 1500),
  distribution_goals text check (char_length(distribution_goals) <= 2000),
  biggest_question text not null check (char_length(biggest_question) between 10 and 2000),
  reference_links jsonb not null default '[]'::jsonb check (jsonb_typeof(reference_links) = 'array' and jsonb_array_length(reference_links) <= 5)
);

-- 8. Detail 03: General Studio Inquiry Details
create table if not exists dynasty_private.general_inquiries (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null unique references dynasty_private.inquiries(id) on delete cascade,
  lead_id uuid not null references dynasty_private.leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  services jsonb not null check (jsonb_typeof(services) = 'array'),
  physical_market boolean not null default false,
  description text not null check (char_length(description) between 20 and 5000),
  stage text not null check (char_length(stage) <= 100),
  budget text not null check (char_length(budget) <= 100),
  timeframe text not null check (char_length(timeframe) <= 100),
  reference_url text check (char_length(reference_url) <= 2000 and reference_url ~* '^https?://')
);

-- 9. FORCE ROW LEVEL SECURITY (RLS) ON ALL TABLES
alter table dynasty_private.rate_limits enable row level security;
alter table dynasty_private.rate_limits force row level security;

alter table dynasty_private.leads enable row level security;
alter table dynasty_private.leads force row level security;

alter table dynasty_private.inquiries enable row level security;
alter table dynasty_private.inquiries force row level security;

alter table dynasty_private.builder_submissions enable row level security;
alter table dynasty_private.builder_submissions force row level security;

alter table dynasty_private.founder_blueprint_intakes enable row level security;
alter table dynasty_private.founder_blueprint_intakes force row level security;

alter table dynasty_private.general_inquiries enable row level security;
alter table dynasty_private.general_inquiries force row level security;

-- 10. Revoke all permissions from public, anon, and authenticated roles
revoke all on all tables in schema dynasty_private from public, anon, authenticated;
revoke all on all sequences in schema dynasty_private from public, anon, authenticated;

-- 11. Hardened Atomic Ingestion Function (RPC)
create or replace function dynasty_private.submit_inquiry(
  p_idempotency_key uuid,
  p_payload_hash text,
  p_inquiry_type dynasty_private.submission_type,
  p_name text,
  p_email text,
  p_phone text,
  p_company text,
  p_website text,
  p_ip_hash text,
  p_detail jsonb
)
returns table (
  status text,
  receipt_id uuid
)
language plpgsql
security definer
set search_path = dynasty_private, pg_catalog, pg_temp
as $$
declare
  v_lead_id uuid;
  v_inquiry_id uuid;
  v_receipt_id uuid;
  v_existing_hash text;
  v_rate_count int;
  v_now timestamptz := clock_timestamp();
begin
  -- 01. Enforce Durable Rate Limit (Max 5 requests per 10 minutes per IP hash)
  select coalesce(sum(request_count), 0) into v_rate_count
  from dynasty_private.rate_limits
  where ip_hash = p_ip_hash and window_start > (v_now - interval '10 minutes');

  if v_rate_count >= 5 then
    raise exception 'RATE_LIMITED: Submission frequency exceeds allowable threshold. Please try again later.'
      using errcode = 'P0001';
  end if;

  insert into dynasty_private.rate_limits(ip_hash, window_start, request_count)
  values (p_ip_hash, date_trunc('minute', v_now), 1)
  on conflict (ip_hash, window_start)
  do update set request_count = dynasty_private.rate_limits.request_count + 1;

  -- Ephemeral cleanup: prune entries older than 24 hours
  delete from dynasty_private.rate_limits
  where window_start < (v_now - interval '24 hours');

  -- 02. Enforce Idempotency & Conflict Detection
  select i.receipt_id, i.payload_hash into v_receipt_id, v_existing_hash
  from dynasty_private.inquiries i
  where i.idempotency_key = p_idempotency_key;

  if found then
    if v_existing_hash = p_payload_hash then
      -- Idempotent replay: return confirmed receipt without duplicate creation
      return query select 'replay'::text, v_receipt_id;
      return;
    else
      raise exception 'IDEMPOTENCY_CONFLICT: Idempotency key previously used for differing payload.'
        using errcode = 'P0002';
    end if;
  end if;

  -- 03. Upsert Master Lead
  insert into dynasty_private.leads (name, email, phone, company_name, website, source)
  values (p_name, p_email, p_phone, p_company, p_website, p_inquiry_type)
  returning id into v_lead_id;

  -- 04. Insert Immutable Inquiry Envelope
  v_receipt_id := gen_random_uuid();
  insert into dynasty_private.inquiries (
    lead_id, inquiry_type, idempotency_key, payload_hash, receipt_id,
    evaluation_consent, communication_consent, notice_version
  ) values (
    v_lead_id, p_inquiry_type, p_idempotency_key, p_payload_hash, v_receipt_id,
    true, true, 'dws-eval-v1'
  ) returning id into v_inquiry_id;

  -- 05. Insert Type-Specific Detail
  if p_inquiry_type = 'builder' then
    insert into dynasty_private.builder_submissions (
      inquiry_id, lead_id, business_type, business_stage, existing_assets, selected_needs,
      launch_timeline, budget_range, ambition_notes,
      server_recomputed_services, server_recomputed_phases, recommended_package
    ) values (
      v_inquiry_id, v_lead_id,
      p_detail->>'businessType', p_detail->>'businessStage',
      coalesce(p_detail->'existingAssets', '[]'::jsonb), coalesce(p_detail->'selectedNeeds', '[]'::jsonb),
      coalesce(p_detail->>'launchTimeline', 'Exploring'), p_detail->>'budgetRange', p_detail->>'ambitionNotes',
      coalesce(p_detail->'recomputedServices', '[]'::jsonb), coalesce(p_detail->'recomputedPhases', '[]'::jsonb),
      coalesce(p_detail->>'recommendedPackage', 'founder-blueprint')
    );
  elsif p_inquiry_type = 'blueprint' then
    insert into dynasty_private.founder_blueprint_intakes (
      inquiry_id, lead_id, business_type, business_stage, physical_market,
      idea_description, problem_description, target_customer, existing_assets, requested_needs,
      target_launch, primary_market, competitors, brand_assets, company_documents,
      digital_assets, distribution_goals, biggest_question, reference_links
    ) values (
      v_inquiry_id, v_lead_id,
      p_detail->>'businessType', p_detail->>'businessStage', coalesce((p_detail->>'physicalMarket')::boolean, false),
      p_detail->>'ideaDescription', p_detail->>'problemDescription', p_detail->>'targetCustomer',
      p_detail->>'existingAssets', p_detail->>'requestedNeeds',
      coalesce(p_detail->>'targetLaunch', 'Exploring'), coalesce(p_detail->>'primaryMarket', 'General'),
      p_detail->>'competitors', p_detail->>'brandAssets', p_detail->>'companyDocuments',
      p_detail->>'digitalAssets', p_detail->>'distributionGoals', p_detail->>'biggestQuestion',
      coalesce(p_detail->'referenceLinks', '[]'::jsonb)
    );
  else
    insert into dynasty_private.general_inquiries (
      inquiry_id, lead_id, services, physical_market, description, stage, budget, timeframe, reference_url
    ) values (
      v_inquiry_id, v_lead_id,
      coalesce(p_detail->'services', '[]'::jsonb), coalesce((p_detail->>'physicalMarket')::boolean, false),
      p_detail->>'description', p_detail->>'stage', p_detail->>'budget', p_detail->>'timeframe',
      p_detail->>'referenceUrl'
    );
  end if;

  return query select 'accepted'::text, v_receipt_id;
end;
$$;

-- 12. Restrict Execution of Ingestion Function
revoke execute on function dynasty_private.submit_inquiry from public, anon, authenticated;
grant execute on function dynasty_private.submit_inquiry to service_role;

commit;
