alter table public.cradle_sessions
  drop constraint if exists cradle_sessions_session_type_check;

alter table public.cradle_sessions
  add constraint cradle_sessions_session_type_check
  check (session_type in ('academic', 'vocational'));
