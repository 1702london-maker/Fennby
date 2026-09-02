insert into storage.buckets (id, name, public)
values ('learner-submissions', 'learner-submissions', false)
on conflict (id) do nothing;

drop policy if exists "children upload own learner submissions" on storage.objects;
create policy "children upload own learner submissions" on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'learner-submissions'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "children read own learner submissions" on storage.objects;
create policy "children read own learner submissions" on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'learner-submissions'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "children update own learner submissions" on storage.objects;
create policy "children update own learner submissions" on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'learner-submissions'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'learner-submissions'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

alter table assessment_attempts
  add column if not exists uploaded_image_url text,
  add column if not exists marking_status text not null default 'not_required'
    check (marking_status in ('not_required', 'pending', 'processing', 'needs_review', 'marked', 'failed')),
  add column if not exists marking_notes text;

create index if not exists assessment_attempts_marking_status_idx
  on assessment_attempts (marking_status, started_at desc);
