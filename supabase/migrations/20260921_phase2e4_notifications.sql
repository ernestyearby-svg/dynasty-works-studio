-- ======================================================================
-- DYNASTY WORKS STUDIO // NOTIFICATION INFRASTRUCTURE & RETRY QUEUE
-- Migration: 20260921_phase2e4_notifications.sql
-- Status: PHASE 2E.4 NOTIFICATION SCAFFOLD
-- Classification: HIGH-CONFIDENTIALITY DWS COMMERCIAL INGESTION DATA BOUNDARY
-- ======================================================================

begin;

-- 1. Hardened Function to Record Notification Outcomes
create or replace function dynasty_private.record_notification_result(
  p_receipt_id uuid,
  p_status text,
  p_error text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns table (
  inquiry_id uuid,
  notification_status text,
  retry_count int,
  next_retry_at timestamptz
)
language plpgsql
security definer
set search_path = dynasty_private, pg_catalog, pg_temp
as $$
declare
  v_inquiry_id uuid;
  v_current_retries int;
  v_new_retries int;
  v_delay_sec int;
  v_final_status text;
  v_next_retry timestamptz;
  v_now timestamptz := clock_timestamp();
begin
  -- Validate status parameter
  if p_status not in ('SENT', 'FAILED', 'EXHAUSTED') then
    raise exception 'INVALID_STATUS: Notification status must be SENT, FAILED, or EXHAUSTED'
      using errcode = 'P0003';
  end if;

  select id, inquiries.retry_count into v_inquiry_id, v_current_retries
  from dynasty_private.inquiries
  where receipt_id = p_receipt_id;

  if not found then
    raise exception 'INQUIRY_NOT_FOUND: Receipt ID % does not exist', p_receipt_id
      using errcode = 'P0004';
  end if;

  if p_status = 'SENT' then
    update dynasty_private.inquiries
    set notification_status = 'SENT',
        notification_sent_at = v_now,
        notification_error = null,
        next_retry_at = null,
        metadata = inquiries.metadata || coalesce(p_metadata, '{}'::jsonb)
    where id = v_inquiry_id
    returning inquiries.id, inquiries.notification_status, inquiries.retry_count, inquiries.next_retry_at
    into v_inquiry_id, v_final_status, v_new_retries, v_next_retry;
  else
    v_new_retries := v_current_retries + 1;
    if v_new_retries >= 5 or p_status = 'EXHAUSTED' then
      v_final_status := 'EXHAUSTED';
      v_next_retry := null;
    else
      v_final_status := 'FAILED';
      -- Bounded exponential backoff: 2m (120s), 10m (600s), 30m (1800s), 2h (7200s), 6h (21600s)
      v_delay_sec := case v_new_retries
        when 1 then 120
        when 2 then 600
        when 3 then 1800
        when 4 then 7200
        else 21600
      end;
      v_next_retry := v_now + (v_delay_sec * interval '1 second');
    end if;

    update dynasty_private.inquiries
    set notification_status = v_final_status,
        retry_count = v_new_retries,
        next_retry_at = v_next_retry,
        notification_error = p_error,
        metadata = inquiries.metadata || coalesce(p_metadata, '{}'::jsonb)
    where id = v_inquiry_id
    returning inquiries.id, inquiries.notification_status, inquiries.retry_count, inquiries.next_retry_at
    into v_inquiry_id, v_final_status, v_new_retries, v_next_retry;
  end if;

  return query select v_inquiry_id, v_final_status, v_new_retries, v_next_retry;
end;
$$;

-- 2. Hardened Function to Query Retryable Inquiries
create or replace function dynasty_private.get_retryable_inquiries(
  p_batch_size int default 10
)
returns table (
  inquiry_id uuid,
  receipt_id uuid,
  inquiry_type dynasty_private.submission_type,
  name text,
  email text,
  phone text,
  company_name text,
  retry_count int,
  created_at timestamptz,
  detail jsonb
)
language plpgsql
security definer
set search_path = dynasty_private, pg_catalog, pg_temp
as $$
declare
  v_now timestamptz := clock_timestamp();
begin
  return query
  select
    i.id as inquiry_id,
    i.receipt_id,
    i.inquiry_type,
    l.name,
    l.email,
    l.phone,
    l.company_name,
    i.retry_count,
    i.created_at,
    case i.inquiry_type
      when 'builder' then
        coalesce(
          (select to_jsonb(b.*) from dynasty_private.builder_submissions b where b.inquiry_id = i.id),
          '{}'::jsonb
        )
      when 'blueprint' then
        coalesce(
          (select to_jsonb(bp.*) from dynasty_private.founder_blueprint_intakes bp where bp.inquiry_id = i.id),
          '{}'::jsonb
        )
      else
        coalesce(
          (select to_jsonb(g.*) from dynasty_private.general_inquiries g where g.inquiry_id = i.id),
          '{}'::jsonb
        )
    end as detail
  from dynasty_private.inquiries i
  join dynasty_private.leads l on i.lead_id = l.id
  where i.notification_status in ('PENDING', 'FAILED')
    and (i.next_retry_at is null or i.next_retry_at <= v_now)
    and i.retry_count < 5
  order by coalesce(i.next_retry_at, i.created_at) asc
  limit coalesce(p_batch_size, 10);
end;
$$;

-- 3. Restrict Permissions to service_role Only
revoke all on function dynasty_private.record_notification_result from public, anon, authenticated;
grant execute on function dynasty_private.record_notification_result to service_role;

revoke all on function dynasty_private.get_retryable_inquiries from public, anon, authenticated;
grant execute on function dynasty_private.get_retryable_inquiries to service_role;

commit;
