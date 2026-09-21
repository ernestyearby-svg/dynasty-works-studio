-- ======================================================================
-- DYNASTY WORKS STUDIO // PRINCIPAL SECURE ASSET RETRIEVAL AUDIT
-- Migration: 20260921_phase2f3_principal_retrieval.sql
-- Status: PHASE 2F.3 PRINCIPAL SECURE ASSET RETRIEVAL
-- Classification: HIGH-CONFIDENTIALITY DWS OPERATOR ACCESS BOUNDARY
-- ======================================================================

begin;

-- 1. Create Private Audit Table for Principal Asset Retrievals
create table if not exists dynasty_private.asset_retrieval_audits (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references dynasty_private.inquiry_assets(id) on delete cascade,
  inquiry_id uuid not null references dynasty_private.inquiries(id) on delete cascade,
  retrieved_at timestamptz not null default now(),
  actor text not null default 'principal',
  auth_method text not null default 'ticket',
  client_ip_hash text,
  user_agent text
);

create index if not exists asset_retrieval_audits_asset_idx on dynasty_private.asset_retrieval_audits(asset_id);
create index if not exists asset_retrieval_audits_inquiry_idx on dynasty_private.asset_retrieval_audits(inquiry_id);
create index if not exists asset_retrieval_audits_created_idx on dynasty_private.asset_retrieval_audits(retrieved_at desc);

-- Revoke all public access
revoke all on table dynasty_private.asset_retrieval_audits from public, anon, authenticated;

-- 2. Function to Retrieve Single Asset by ID for Authorized Principal
create or replace function dynasty_private.get_asset_by_id(p_asset_id uuid)
returns table (
  id uuid,
  inquiry_id uuid,
  lead_id uuid,
  receipt_id uuid,
  original_filename text,
  sanitized_filename text,
  mime_type text,
  size_bytes bigint,
  storage_path text,
  status text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = dynasty_private, pg_catalog, pg_temp
as $$
begin
  return query
  select
    a.id,
    a.inquiry_id,
    a.lead_id,
    i.receipt_id,
    a.original_filename,
    a.sanitized_filename,
    a.mime_type,
    a.size_bytes,
    a.storage_path,
    a.status,
    a.created_at
  from dynasty_private.inquiry_assets a
  join dynasty_private.inquiries i on a.inquiry_id = i.id
  where a.id = p_asset_id;
end;
$$;

revoke execute on function dynasty_private.get_asset_by_id from public, anon, authenticated;
grant execute on function dynasty_private.get_asset_by_id to service_role;

-- 3. Function to Record Retrieval Audit Event
create or replace function dynasty_private.record_asset_retrieval_audit(
  p_asset_id uuid,
  p_actor text default 'principal',
  p_auth_method text default 'ticket',
  p_ip_hash text default null,
  p_ua text default null
)
returns table (
  audit_id uuid,
  asset_id uuid,
  inquiry_id uuid,
  retrieved_at timestamptz
)
language plpgsql
security definer
set search_path = dynasty_private, pg_catalog, pg_temp
as $$
declare
  v_inquiry_id uuid;
  v_audit_id uuid;
  v_retrieved_at timestamptz := now();
begin
  -- Lookup inquiry ID from asset
  select inquiry_assets.inquiry_id into v_inquiry_id
  from dynasty_private.inquiry_assets
  where inquiry_assets.id = p_asset_id;

  if v_inquiry_id is null then
    raise exception 'ASSET_NOT_FOUND: Specified asset does not exist'
      using errcode = 'P0002';
  end if;

  -- Insert audit row
  insert into dynasty_private.asset_retrieval_audits (
    asset_id,
    inquiry_id,
    retrieved_at,
    actor,
    auth_method,
    client_ip_hash,
    user_agent
  )
  values (
    p_asset_id,
    v_inquiry_id,
    v_retrieved_at,
    coalesce(p_actor, 'principal'),
    coalesce(p_auth_method, 'ticket'),
    p_ip_hash,
    p_ua
  )
  returning id into v_audit_id;

  -- Update asset metadata with last retrieval timestamp
  update dynasty_private.inquiry_assets
  set metadata = jsonb_set(
    coalesce(metadata, '{}'::jsonb),
    '{last_retrieved_at}',
    to_jsonb(v_retrieved_at::text)
  )
  where inquiry_assets.id = p_asset_id;

  return query
  select v_audit_id, p_asset_id, v_inquiry_id, v_retrieved_at;
end;
$$;

revoke execute on function dynasty_private.record_asset_retrieval_audit from public, anon, authenticated;
grant execute on function dynasty_private.record_asset_retrieval_audit to service_role;

commit;
