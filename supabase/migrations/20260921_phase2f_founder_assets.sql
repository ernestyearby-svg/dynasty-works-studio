-- ======================================================================
-- DYNASTY WORKS STUDIO // SECURE FOUNDER ASSET INTAKE INFRASTRUCTURE
-- Migration: 20260921_phase2f_founder_assets.sql
-- Status: PHASE 2F SECURE FOUNDER ASSETS
-- Classification: HIGH-CONFIDENTIALITY DWS COMMERCIAL INGESTION DATA BOUNDARY
-- ======================================================================

begin;

-- 1. Create Private Bucket in Supabase Storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'founder-intake-assets',
  'founder-intake-assets',
  false,
  26214400, -- 25MB max per object
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/csv',
    'text/plain',
    'image/png',
    'image/jpeg',
    'image/webp'
  ]
)
on conflict (id) do update set
  public = false,
  file_size_limit = 26214400,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. Metadata Persistence Table in dynasty_private
create table if not exists dynasty_private.inquiry_assets (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references dynasty_private.inquiries(id) on delete cascade,
  lead_id uuid not null references dynasty_private.leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  storage_bucket text not null default 'founder-intake-assets',
  storage_path text not null unique,
  original_filename text not null check (char_length(original_filename) between 1 and 255),
  sanitized_filename text not null check (char_length(sanitized_filename) between 1 and 255),
  mime_type text not null check (char_length(mime_type) between 3 and 100),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 26214400),
  status text not null default 'uploaded' check (status in ('pending', 'uploaded', 'failed', 'removed')),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object')
);

create index if not exists inquiry_assets_inquiry_idx on dynasty_private.inquiry_assets(inquiry_id);
create index if not exists inquiry_assets_lead_idx on dynasty_private.inquiry_assets(lead_id);
create index if not exists inquiry_assets_created_idx on dynasty_private.inquiry_assets(created_at desc);

-- Immediately isolate table from all unauthorized roles
revoke all on table dynasty_private.inquiry_assets from public, anon, authenticated;

-- 3. Hardened Function to Register Uploaded Asset Metadata
create or replace function dynasty_private.register_inquiry_asset(
  p_receipt_id uuid,
  p_storage_path text,
  p_original_filename text,
  p_sanitized_filename text,
  p_mime_type text,
  p_size_bytes bigint,
  p_metadata jsonb default '{}'::jsonb
)
returns table (
  asset_id uuid,
  inquiry_id uuid,
  lead_id uuid,
  storage_path text,
  status text
)
language plpgsql
security definer
set search_path = dynasty_private, pg_catalog, pg_temp
as $$
declare
  v_inquiry_id uuid;
  v_lead_id uuid;
  v_existing_count int;
  v_existing_bytes bigint;
  v_asset_id uuid;
  v_allowed_mimes text[] := array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/csv',
    'text/plain',
    'image/png',
    'image/jpeg',
    'image/webp'
  ];
begin
  -- Validate receipt ID
  select id, inquiries.lead_id into v_inquiry_id, v_lead_id
  from dynasty_private.inquiries
  where receipt_id = p_receipt_id;

  if not found then
    raise exception 'INQUIRY_NOT_FOUND: Receipt ID % does not exist', p_receipt_id
      using errcode = 'P0004';
  end if;

  -- Validate MIME type against strict allowed list
  if not (p_mime_type = any(v_allowed_mimes)) then
    raise exception 'INVALID_MIME_TYPE: File type % is not permitted for founder intake', p_mime_type
      using errcode = 'P0005';
  end if;

  -- Validate individual file size (25MB max)
  if p_size_bytes <= 0 or p_size_bytes > 26214400 then
    raise exception 'INVALID_FILE_SIZE: File size must be between 1 byte and 25MB'
      using errcode = 'P0006';
  end if;

  -- Validate inquiry aggregate limits (max 10 files, max 100MB)
  select coalesce(count(*), 0), coalesce(sum(size_bytes), 0)
  into v_existing_count, v_existing_bytes
  from dynasty_private.inquiry_assets
  where inquiry_assets.inquiry_id = v_inquiry_id
    and inquiry_assets.status = 'uploaded';

  if v_existing_count >= 10 then
    raise exception 'MAX_FILES_EXCEEDED: Maximum of 10 files per inquiry reached'
      using errcode = 'P0007';
  end if;

  if (v_existing_bytes + p_size_bytes) > 104857600 then -- 100MB
    raise exception 'MAX_AGGREGATE_SIZE_EXCEEDED: Total upload volume exceeds 100MB limit'
      using errcode = 'P0008';
  end if;

  -- Insert authoritative asset metadata record
  insert into dynasty_private.inquiry_assets (
    inquiry_id,
    lead_id,
    storage_bucket,
    storage_path,
    original_filename,
    sanitized_filename,
    mime_type,
    size_bytes,
    status,
    metadata
  )
  values (
    v_inquiry_id,
    v_lead_id,
    'founder-intake-assets',
    p_storage_path,
    p_original_filename,
    p_sanitized_filename,
    p_mime_type,
    p_size_bytes,
    'uploaded',
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_asset_id;

  return query
  select v_asset_id, v_inquiry_id, v_lead_id, p_storage_path, 'uploaded'::text;
end;
$$;

-- Revoke public execution, grant strictly to service_role
revoke execute on function dynasty_private.register_inquiry_asset from public, anon, authenticated;
grant execute on function dynasty_private.register_inquiry_asset to service_role;

-- 4. Read Function to Retrieve Metadata for Authorized Internal Review
create or replace function dynasty_private.get_inquiry_assets(p_receipt_id uuid)
returns table (
  id uuid,
  original_filename text,
  sanitized_filename text,
  mime_type text,
  size_bytes bigint,
  storage_path text,
  uploaded_at timestamptz,
  status text
)
language plpgsql
security definer
set search_path = dynasty_private, pg_catalog, pg_temp
as $$
begin
  return query
  select
    a.id,
    a.original_filename,
    a.sanitized_filename,
    a.mime_type,
    a.size_bytes,
    a.storage_path,
    a.created_at,
    a.status
  from dynasty_private.inquiry_assets a
  join dynasty_private.inquiries i on a.inquiry_id = i.id
  where i.receipt_id = p_receipt_id
  order by a.created_at asc;
end;
$$;

revoke execute on function dynasty_private.get_inquiry_assets from public, anon, authenticated;
grant execute on function dynasty_private.get_inquiry_assets to service_role;

-- 5. Read Function to Validate Receipt ID and Get Inquiry ID & Lead ID
create or replace function dynasty_private.get_inquiry_by_receipt(p_receipt_id uuid)
returns table (
  id uuid,
  lead_id uuid
)
language plpgsql
security definer
set search_path = dynasty_private, pg_catalog, pg_temp
as $$
begin
  return query
  select i.id, i.lead_id
  from dynasty_private.inquiries i
  where i.receipt_id = p_receipt_id;
end;
$$;

revoke execute on function dynasty_private.get_inquiry_by_receipt from public, anon, authenticated;
grant execute on function dynasty_private.get_inquiry_by_receipt to service_role;

commit;
