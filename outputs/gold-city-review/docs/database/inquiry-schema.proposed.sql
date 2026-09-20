-- REVIEW PROPOSAL ONLY. Not an applied migration and not part of the Sites/Drizzle migration directory.
-- After production project approval: create a real migration with Supabase CLI, review, test locally, then apply explicitly.
-- Keep dynasty_private out of exposed Data API schemas. No browser role has access.
begin;
create schema dynasty_private;
revoke all on schema dynasty_private from public, anon, authenticated;
create type dynasty_private.lead_status as enum ('NEW','REVIEWING','QUALIFIED','STRATEGY_SCHEDULED','PROPOSAL','ENGAGED','NOT_NOW','CLOSED');
create table dynasty_private.leads (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 name text not null check (char_length(name) between 2 and 120),
 email text not null check (char_length(email) between 3 and 254),
 phone text check (char_length(phone)<=40), company_name text not null check (char_length(company_name) between 1 and 150),
 website text check (char_length(website)<=2000 and website ~* '^https?://'),
 source text not null check(source in ('general','builder','blueprint')),
 status dynasty_private.lead_status not null default 'NEW'
);
create table dynasty_private.inquiries (
 id uuid primary key default gen_random_uuid(), lead_id uuid not null references dynasty_private.leads(id) on delete cascade,
 created_at timestamptz not null default now(), inquiry_type text not null check(inquiry_type in ('general','builder','blueprint')),
 message text not null check(char_length(message)<=5000), status text not null default 'NEW' check(status in ('NEW','REVIEWING','CLOSED')),
 idempotency_key uuid not null unique, payload_hash text not null check(payload_hash ~ '^[0-9a-f]{64}$'),
 receipt_id uuid not null default gen_random_uuid() unique,
 evaluation_consent boolean not null check(evaluation_consent), communication_consent boolean not null check(communication_consent),
 notice_version text not null check(char_length(notice_version) between 1 and 100), consent_at timestamptz not null default now(),
 unique(id,lead_id)
);
create table dynasty_private.builder_submissions (
 id uuid primary key default gen_random_uuid(), lead_id uuid not null references dynasty_private.leads(id) on delete cascade,
 inquiry_id uuid not null unique,
 foreign key(inquiry_id,lead_id) references dynasty_private.inquiries(id,lead_id) on delete cascade,
 created_at timestamptz not null default now(), business_type text not null check(char_length(business_type)<=100),
 business_stage text not null check(business_stage in ('Idea','Preparing to launch','Operating','Growing')),
 existing_assets jsonb not null check(jsonb_typeof(existing_assets)='array'), selected_needs jsonb not null check(jsonb_typeof(selected_needs)='array'),
 launch_timeline text not null check(char_length(launch_timeline)<=200), budget_range text check(char_length(budget_range)<=200),
 recommended_services jsonb not null check(jsonb_typeof(recommended_services)='array'), recommended_phases jsonb not null check(jsonb_typeof(recommended_phases)='array'),
 recommended_package text not null check(char_length(recommended_package)<=100), roadmap_snapshot jsonb not null check(jsonb_typeof(roadmap_snapshot)='object'),
 rules_version text not null default '1.4'
);
create table dynasty_private.founder_blueprint_intakes (
 id uuid primary key default gen_random_uuid(), lead_id uuid not null references dynasty_private.leads(id) on delete cascade,
 inquiry_id uuid not null unique,
 foreign key(inquiry_id,lead_id) references dynasty_private.inquiries(id,lead_id) on delete cascade,
 created_at timestamptz not null default now(), business_type text not null check(char_length(business_type)<=100),
 business_stage text not null check(business_stage in ('Idea','Preparing to launch','Operating','Growing')), physical_market boolean not null,
 idea_description text not null check(char_length(idea_description) between 20 and 3000), problem_description text not null check(char_length(problem_description) between 10 and 2000),
 target_customer text not null check(char_length(target_customer) between 10 and 1500),
 existing_assets text check(char_length(existing_assets)<=2000), requested_needs text not null check(char_length(requested_needs) between 10 and 2000),
 target_launch text not null check(char_length(target_launch) between 1 and 200), primary_market text not null check(char_length(primary_market) between 1 and 200),
 competitors text check(char_length(competitors)<=1500), brand_assets text check(char_length(brand_assets)<=1500), company_documents text check(char_length(company_documents)<=1000),
 digital_assets text check(char_length(digital_assets)<=1500), distribution_goals text check(char_length(distribution_goals)<=2000),
 biggest_question text not null check(char_length(biggest_question) between 10 and 2000), reference_links jsonb not null default '[]'::jsonb check(jsonb_typeof(reference_links)='array' and jsonb_array_length(reference_links)<=5),
 intake_status text not null default 'NEW' check(intake_status in ('NEW','REVIEWING','NEEDS_INFORMATION','APPROVED','CLOSED'))
);
create index inquiries_lead_id_idx on dynasty_private.inquiries(lead_id);
create index builder_submissions_lead_id_idx on dynasty_private.builder_submissions(lead_id);
create index founder_blueprint_intakes_lead_id_idx on dynasty_private.founder_blueprint_intakes(lead_id);
create index leads_review_queue_idx on dynasty_private.leads(status,created_at);
alter table dynasty_private.leads enable row level security;
alter table dynasty_private.leads force row level security;
alter table dynasty_private.inquiries enable row level security;
alter table dynasty_private.inquiries force row level security;
alter table dynasty_private.builder_submissions enable row level security;
alter table dynasty_private.builder_submissions force row level security;
alter table dynasty_private.founder_blueprint_intakes enable row level security;
alter table dynasty_private.founder_blueprint_intakes force row level security;
revoke all on all tables in schema dynasty_private from public, anon, authenticated;
revoke all on all sequences in schema dynasty_private from public, anon, authenticated;
-- No permissive policies, public RPCs, or client grants. Staff and server access require separately reviewed grants/policies.
-- Server adapter must atomically keep child lead_id equal to the inquiry's lead_id, recompute recommendations, update updated_at,
-- claim idempotency keys and return opaque receipts. Never link records by a caller-supplied lead ID or email alone.
commit;
