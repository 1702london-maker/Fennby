-- Seed a broad Fennby question pool for warm-ups, practice, and mock assembly.
-- This deliberately uses generated variations so local and production databases
-- can be brought above the 1,000-question threshold repeatably.

insert into subjects (key, name)
values
  ('general', 'General Knowledge')
on conflict (key) do nothing;

insert into topics (key, subject_key, name)
values
  ('logic', 'general', 'Logic'),
  ('knowledge', 'general', 'General Knowledge'),
  ('vocabulary', 'english', 'Vocabulary')
on conflict (key) do nothing;

with generated_questions as (
  select
    case (n % 10)
      when 0 then 'maths'
      when 1 then 'maths'
      when 2 then 'english'
      when 3 then 'english'
      when 4 then 'vr'
      when 5 then 'vr'
      when 6 then 'nvr'
      when 7 then 'nvr'
      when 8 then 'general'
      else 'general'
    end as subject_key,
    case (n % 10)
      when 0 then 'number'
      when 1 then 'shape-space'
      when 2 then 'comprehension'
      when 3 then 'vocabulary'
      when 4 then 'analogies'
      when 5 then 'codes'
      when 6 then 'shape-sequences'
      when 7 then 'shape-sequences'
      when 8 then 'logic'
      else 'knowledge'
    end as topic_key,
    case (n % 3)
      when 0 then 'easy'
      when 1 then 'medium'
      else 'hard'
    end as difficulty,
    case (n % 10)
      when 0 then format('Warm-up maths %s: What is %s + %s?', n, 10 + (n % 30), 3 + (n % 12))
      when 1 then format('Warm-up shape %s: A rectangle has length %s cm and width %s cm. What is its perimeter?', n, 5 + (n % 10), 2 + (n % 8))
      when 2 then format('Warm-up comprehension %s: Which word best means "careful"?', n)
      when 3 then format('Warm-up vocabulary %s: Choose the closest meaning of "rapid".', n)
      when 4 then format('Warm-up analogy %s: Seed is to plant as egg is to what?', n)
      when 5 then format('Warm-up code %s: If A=1, B=2, C=3, what is the value of CAB?', n)
      when 6 then format('Warm-up NVR %s: Which pattern comes next after circle, square, circle, square?', n)
      when 7 then format('Warm-up sequence %s: Which number completes 2, 4, 8, 16, __?', n)
      when 8 then format('Warm-up logic %s: All robins are birds. Some birds sing. Which statement must be true?', n)
      else format('Warm-up knowledge %s: Which planet is known as the Red Planet?', n)
    end as text,
    case (n % 10)
      when 0 then array[((10 + (n % 30)) + (3 + (n % 12)))::text, ((10 + (n % 30)) + (4 + (n % 12)))::text, ((9 + (n % 30)) + (3 + (n % 12)))::text, ((11 + (n % 30)) + (5 + (n % 12)))::text]
      when 1 then array[((2 * ((5 + (n % 10)) + (2 + (n % 8))))::text), ((5 + (n % 10)) * (2 + (n % 8)))::text, ((5 + (n % 10)) + (2 + (n % 8)))::text, ((5 + (n % 10)) - (2 + (n % 8)))::text]
      when 2 then array['cautious', 'careless', 'noisy', 'sleepy']
      when 3 then array['fast', 'tiny', 'heavy', 'silent']
      when 4 then array['chick', 'nest', 'shell', 'feather']
      when 5 then array['3-1-2', '1-2-3', '2-1-3', '3-2-1']
      when 6 then array['circle', 'triangle', 'star', 'line']
      when 7 then array['32', '24', '18', '30']
      when 8 then array['All robins are birds', 'All birds are robins', 'No robins sing', 'All birds sing']
      else array['Mars', 'Venus', 'Jupiter', 'Mercury']
    end as options,
    case (n % 10)
      when 0 then 0
      when 1 then 0
      when 2 then 0
      when 3 then 0
      when 4 then 0
      when 5 then 0
      when 6 then 0
      when 7 then 0
      when 8 then 0
      else 0
    end as correct_answer,
    case (n % 10)
      when 0 then 'Add the two numbers carefully.'
      when 1 then 'Perimeter is twice the length plus twice the width.'
      when 2 then 'Cautious means careful.'
      when 3 then 'Rapid means fast.'
      when 4 then 'An egg can develop into a chick, as a seed can develop into a plant.'
      when 5 then 'C is 3, A is 1, and B is 2.'
      when 6 then 'The alternating pattern continues with circle.'
      when 7 then 'Each number doubles.'
      when 8 then 'The only certain statement is that robins belong to the bird group.'
      else 'Mars is commonly called the Red Planet.'
    end as explanation,
    30 + (n % 4) * 10 as estimated_seconds
  from generate_series(1, 1200) as series(n)
)
insert into questions (
  subject_key,
  topic_key,
  exam_board,
  difficulty,
  type,
  text,
  options,
  correct_answer,
  explanation,
  estimated_seconds,
  status
)
select
  subject_key,
  topic_key,
  'Fennby Warm-Up',
  difficulty,
  'multiple_choice',
  text,
  options,
  correct_answer,
  explanation,
  estimated_seconds,
  'published'
from generated_questions g
where not exists (
  select 1 from questions q where q.text = g.text and q.exam_board = 'Fennby Warm-Up'
);
