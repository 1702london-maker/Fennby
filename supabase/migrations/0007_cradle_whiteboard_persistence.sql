alter table public.cradle_sessions
  add column if not exists whiteboard_strokes jsonb not null default '[]'::jsonb,
  add column if not exists whiteboard_snapshot text;
