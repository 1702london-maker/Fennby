alter table public.cradle_sessions
  add column if not exists recording_url text,
  add column if not exists recording_provider_ref text;
