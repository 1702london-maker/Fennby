create table if not exists brain_warmup_answers (
  id uuid primary key default uuid_generate_v4(),
  warmup_id uuid not null references brain_warmups(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  question_id uuid references questions(id) on delete set null,
  subject_key text,
  topic_key text,
  choice_index int not null,
  correct_answer int not null,
  is_correct boolean not null,
  answered_at timestamptz not null default now()
);

create index if not exists brain_warmup_answers_learner_answered_idx
  on brain_warmup_answers (learner_id, answered_at desc);

create index if not exists brain_warmup_answers_question_idx
  on brain_warmup_answers (question_id)
  where question_id is not null;

alter table brain_warmup_answers enable row level security;

drop policy if exists "brain warmup answers visible to parent and child" on brain_warmup_answers;
create policy "brain warmup answers visible to parent and child" on brain_warmup_answers
  for select
  to authenticated
  using (
    exists (
      select 1
      from learners l
      where l.id = brain_warmup_answers.learner_id
        and (l.parent_id = (select auth.uid()) or l.auth_id = (select auth.uid()))
    )
  );

drop policy if exists "children insert own brain warmup answers" on brain_warmup_answers;
create policy "children insert own brain warmup answers" on brain_warmup_answers
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from learners l
      where l.id = brain_warmup_answers.learner_id
        and l.auth_id = (select auth.uid())
    )
    and exists (
      select 1
      from brain_warmups bw
      where bw.id = brain_warmup_answers.warmup_id
        and bw.learner_id = brain_warmup_answers.learner_id
    )
  );
