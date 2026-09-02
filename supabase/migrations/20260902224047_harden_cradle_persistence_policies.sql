create table if not exists public.cradle_sessions (
  id uuid primary key default uuid_generate_v4(),
  lesson_session_id uuid references public.lesson_sessions(id) on delete set null,
  host_id uuid not null references public.profiles(id) on delete cascade,
  session_type text not null check (session_type in ('academic', 'vocational')),
  video_provider text not null default 'twilio',
  video_room_sid text,
  peer_anonymity_enabled boolean not null default false,
  recording_status text not null default 'not_recording',
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  whiteboard_strokes jsonb not null default '[]'::jsonb,
  whiteboard_snapshot text
);

create table if not exists public.cradle_participants (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.cradle_sessions(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  learner_id uuid references public.learners(id) on delete cascade,
  role_in_session text not null default 'participant',
  anonymized_display_name text,
  joined_at timestamptz not null default now()
);

alter table public.cradle_sessions
  add column if not exists whiteboard_strokes jsonb not null default '[]'::jsonb,
  add column if not exists whiteboard_snapshot text;

alter table public.message_threads
  add column if not exists cradle_session_id uuid references public.cradle_sessions(id) on delete set null;

alter table public.cradle_sessions enable row level security;
alter table public.cradle_participants enable row level security;

drop policy if exists "cradle sessions visible to participants and parents" on public.cradle_sessions;
drop policy if exists "tutors create cradle sessions" on public.cradle_sessions;
drop policy if exists "cradle participants update session state" on public.cradle_sessions;
drop policy if exists "cradle participants visible to session members" on public.cradle_participants;
drop policy if exists "users join visible cradle sessions" on public.cradle_participants;
drop policy if exists "authenticated users create cradle message threads" on public.message_threads;
drop policy if exists "cradle hosts attach message threads" on public.message_threads;

create policy "cradle sessions visible to participants and parents" on public.cradle_sessions
  for select
  to authenticated
  using (
    host_id = (select auth.uid())
    or exists (
      select 1
      from public.cradle_participants cp
      where cp.session_id = cradle_sessions.id
        and cp.profile_id = (select auth.uid())
    )
    or exists (
      select 1
      from public.lesson_sessions ls
      join public.learners l on l.id = ls.learner_id
      where ls.id = cradle_sessions.lesson_session_id
        and (l.parent_id = (select auth.uid()) or l.auth_id = (select auth.uid()))
    )
  );

create policy "tutors create cradle sessions" on public.cradle_sessions
  for insert
  to authenticated
  with check (
    host_id = (select auth.uid())
    and exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
        and p.role in ('tutor', 'admin')
    )
  );

create policy "cradle participants update session state" on public.cradle_sessions
  for update
  to authenticated
  using (
    host_id = (select auth.uid())
    or exists (
      select 1
      from public.cradle_participants cp
      where cp.session_id = cradle_sessions.id
        and cp.profile_id = (select auth.uid())
    )
  )
  with check (
    host_id = (select auth.uid())
    or exists (
      select 1
      from public.cradle_participants cp
      where cp.session_id = cradle_sessions.id
        and cp.profile_id = (select auth.uid())
    )
  );

create policy "cradle participants visible to session members" on public.cradle_participants
  for select
  to authenticated
  using (
    profile_id = (select auth.uid())
    or exists (
      select 1
      from public.cradle_sessions cs
      where cs.id = cradle_participants.session_id
        and cs.host_id = (select auth.uid())
    )
    or exists (
      select 1
      from public.cradle_sessions cs
      join public.lesson_sessions ls on ls.id = cs.lesson_session_id
      join public.learners l on l.id = ls.learner_id
      where cs.id = cradle_participants.session_id
        and (l.parent_id = (select auth.uid()) or l.auth_id = (select auth.uid()))
    )
  );

create policy "users join visible cradle sessions" on public.cradle_participants
  for insert
  to authenticated
  with check (
    profile_id = (select auth.uid())
    and exists (
      select 1
      from public.cradle_sessions cs
      left join public.lesson_sessions ls on ls.id = cs.lesson_session_id
      left join public.learners l on l.id = ls.learner_id
      where cs.id = cradle_participants.session_id
        and cs.ended_at is null
        and (
          cs.host_id = (select auth.uid())
          or l.parent_id = (select auth.uid())
          or l.auth_id = (select auth.uid())
          or exists (
            select 1
            from public.profiles p
            where p.id = (select auth.uid())
              and p.role in ('tutor', 'admin')
          )
        )
    )
  );

create policy "authenticated users create cradle message threads" on public.message_threads
  for insert
  to authenticated
  with check (
    learner_id is null
    or exists (
      select 1
      from public.learners l
      where l.id = message_threads.learner_id
        and (l.parent_id = (select auth.uid()) or l.auth_id = (select auth.uid()))
    )
  );

create policy "cradle hosts attach message threads" on public.message_threads
  for update
  to authenticated
  using (
    learner_id is null
    or exists (
      select 1
      from public.learners l
      where l.id = message_threads.learner_id
        and (l.parent_id = (select auth.uid()) or l.auth_id = (select auth.uid()))
    )
  )
  with check (
    exists (
      select 1
      from public.cradle_sessions cs
      where cs.id = message_threads.cradle_session_id
        and cs.host_id = (select auth.uid())
    )
  );
