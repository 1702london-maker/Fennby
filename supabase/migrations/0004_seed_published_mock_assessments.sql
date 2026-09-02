-- Seed published mock assessments from the existing question bank.

delete from assessment_questions
where assessment_id in (
  select id
  from assessments
  where title in (
    'Seed test',
    'Fennby Mixed 11+ Mock A',
    'Fennby FSCE-Style Curriculum Mock A'
  )
);

delete from assessments
where title in (
  'Seed test',
  'Fennby Mixed 11+ Mock A',
  'Fennby FSCE-Style Curriculum Mock A'
);

insert into assessments (
  title,
  subject_key,
  level_key,
  mode,
  status,
  created_at,
  published,
  exam_board,
  age_group,
  duration_minutes
)
values
  (
    'Fennby Mixed 11+ Mock A',
    null,
    null,
    'simulation',
    'published',
    '2026-09-02 12:00:00+00',
    true,
    'Fennby',
    'Year 5',
    45
  ),
  (
    'Fennby FSCE-Style Curriculum Mock A',
    null,
    null,
    'simulation',
    'published',
    '2026-09-02 12:05:00+00',
    true,
    'FSCE-style',
    'Year 5',
    50
  );

with mixed_assessment as (
  select id
  from assessments
  where title = 'Fennby Mixed 11+ Mock A'
  limit 1
),
ranked as (
  select
    q.id,
    row_number() over (
      partition by q.subject_key
      order by q.difficulty nulls last, q.updated_at desc, q.id
    ) as subject_position
  from questions q
  where q.status = 'published'
    and q.type = 'multiple_choice'
    and q.subject_key in ('maths', 'english', 'vr', 'nvr', 'general')
),
selected as (
  select id, row_number() over (order by subject_position, id) as position
  from ranked
  where subject_position <= 8
)
insert into assessment_questions (assessment_id, question_id, position)
select mixed_assessment.id, selected.id, selected.position
from mixed_assessment
cross join selected;

with fsce_assessment as (
  select id
  from assessments
  where title = 'Fennby FSCE-Style Curriculum Mock A'
  limit 1
),
ranked as (
  select
    q.id,
    case
      when q.subject_key = 'maths' then 1
      when q.subject_key = 'english' then 2
      when q.subject_key = 'general' then 3
      else 4
    end as subject_order,
    row_number() over (
      partition by q.subject_key
      order by q.difficulty nulls last, q.updated_at desc, q.id
    ) as subject_position
  from questions q
  where q.status = 'published'
    and q.type = 'multiple_choice'
    and q.subject_key in ('maths', 'english', 'general')
),
selected as (
  select id, row_number() over (order by subject_order, subject_position, id) as position
  from ranked
  where
    (subject_order = 1 and subject_position <= 16)
    or (subject_order = 2 and subject_position <= 16)
    or (subject_order = 3 and subject_position <= 8)
)
insert into assessment_questions (assessment_id, question_id, position)
select fsce_assessment.id, selected.id, selected.position
from fsce_assessment
cross join selected;
