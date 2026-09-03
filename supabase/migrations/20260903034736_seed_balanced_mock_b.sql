with new_assessment as (
  insert into public.assessments (
    title,
    subject_key,
    level_key,
    mode,
    status,
    published,
    exam_board,
    age_group,
    duration_minutes
  )
  values (
    'Fennby Balanced 11+ Mock B',
    'general',
    'eleven_plus',
    'digital',
    'published',
    true,
    'Fennby',
    'Year 5',
    50
  )
  returning id
),
seed_questions(position, subject_key, topic_key, exam_board, difficulty, question_text, options, correct_answer, explanation, estimated_seconds) as (
  values
    (1, 'english', 'vocabulary', 'Fennby', 'easy', 'Which word is closest in meaning to cautious?', array['careful','careless','noisy','quick'], 0, 'Cautious means careful or wary.', 45),
    (2, 'english', 'comprehension', 'Fennby', 'easy', 'Choose the sentence with the correct apostrophe.', array['The childs bag was blue.','The child''s bag was blue.','The childs'' bag was blue.','The child bag''s was blue.'], 1, 'The bag belongs to one child, so child takes apostrophe s.', 55),
    (3, 'english', 'comprehension', 'Fennby', 'medium', 'A character whispers before opening a door. What does this most strongly suggest?', array['They are trying not to be heard','They are speaking to a crowd','They are angry about the weather','They have forgotten the door'], 0, 'Whispering suggests secrecy or caution.', 60),
    (4, 'english', 'vocabulary', 'Fennby', 'easy', 'Which spelling is correct?', array['seperate','separate','seperete','seprate'], 1, 'Separate is the correct spelling.', 35),
    (5, 'english', 'comprehension', 'Fennby', 'medium', 'Which sentence is punctuated correctly?', array['Although it was raining we played outside.','Although it was raining, we played outside.','Although, it was raining we played outside.','Although it was, raining we played outside.'], 1, 'The comma separates the opening subordinate clause.', 60),
    (6, 'english', 'comprehension', 'Fennby', 'medium', 'Maya checked her watch for the third time and tapped her foot. How is Maya probably feeling?', array['impatient','relaxed','sleepy','confused'], 0, 'Repeatedly checking a watch and tapping a foot suggest impatience.', 45),
    (7, 'english', 'vocabulary', 'Fennby', 'medium', 'Which word best completes the sentence: The kitten moved ____ across the windowsill.', array['gracefully','squarely','loudly','heavily'], 0, 'Gracefully best describes smooth, careful movement.', 45),
    (8, 'english', 'comprehension', 'Fennby', 'hard', 'Which option combines the ideas most clearly? The road was icy. The driver slowed down.', array['The road was icy, so the driver slowed down.','The road was icy the driver slowed down.','The driver slowed down the road was icy.','Icy was the road and slowed the driver.'], 0, 'So clearly shows the cause and effect.', 60),
    (9, 'maths', 'number', 'Fennby', 'easy', 'What is 37 + 48?', array['85','75','95','83'], 0, '37 + 48 = 85.', 40),
    (10, 'maths', 'number', 'Fennby', 'medium', 'Which fraction is equivalent to 3/4?', array['6/8','3/8','4/6','9/16'], 0, 'Multiplying numerator and denominator by 2 gives 6/8.', 45),
    (11, 'maths', 'number', 'Fennby', 'medium', 'What is 25% of 64?', array['16','12','20','24'], 0, '25% is one quarter, and one quarter of 64 is 16.', 45),
    (12, 'maths', 'shape-space', 'Fennby', 'easy', 'A rectangle is 8 cm long and 5 cm wide. What is its perimeter?', array['26 cm','40 cm','13 cm','18 cm'], 0, 'Perimeter is 8 + 5 + 8 + 5 = 26 cm.', 50),
    (13, 'maths', 'number', 'Fennby', 'medium', 'How many millilitres are in 2.5 litres?', array['2500 ml','250 ml','25 ml','2050 ml'], 0, '1 litre is 1000 ml, so 2.5 litres is 2500 ml.', 40),
    (14, 'maths', 'number', 'Fennby', 'medium', 'The numbers are 4, 7, 9, 10, 10. What is the mode?', array['10','8','7','9'], 0, 'The mode is the value that appears most often.', 40),
    (15, 'maths', 'number', 'Fennby', 'medium', 'If n + 6 = 17, what is n?', array['11','23','9','13'], 0, 'Subtract 6 from both sides: n = 11.', 40),
    (16, 'maths', 'number', 'Fennby', 'hard', 'A recipe uses 2 eggs for 5 cakes. How many eggs are needed for 20 cakes?', array['8','10','6','12'], 0, '20 cakes is four times 5 cakes, so 2 eggs x 4 = 8.', 55),
    (17, 'vr', 'analogies', 'Fennby', 'easy', 'Book is to reading as fork is to _____.', array['eating','drawing','sleeping','running'], 0, 'A fork is used for eating.', 35),
    (18, 'vr', 'codes', 'Fennby', 'medium', 'If CAT is coded as DBU, how is DOG coded?', array['EPH','CNE','FQI','ENH'], 0, 'Each letter moves forward by one place.', 55),
    (19, 'vr', 'analogies', 'Fennby', 'easy', 'Which word does not belong?', array['triangle','square','circle','window'], 3, 'Window is not a geometric shape in this list.', 35),
    (20, 'vr', 'analogies', 'Fennby', 'medium', 'Find the pair with the same relationship as hot:cold.', array['early:late','warm:sunny','fire:smoke','water:drink'], 0, 'Hot and cold are opposites, as early and late are opposites.', 45),
    (21, 'vr', 'word-sequences', 'Fennby', 'medium', 'Which word can follow sun to make a compound word?', array['flower','table','river','pencil'], 0, 'Sunflower is a compound word.', 35),
    (22, 'vr', 'word-sequences', 'Fennby', 'hard', 'What comes next in the sequence: A, C, F, J, O, ?', array['U','T','S','V'], 0, 'The gaps increase by 1: +2, +3, +4, +5, then +6.', 70),
    (23, 'vr', 'word-sequences', 'Fennby', 'medium', 'Which word means to make something smaller?', array['reduce','expand','protect','observe'], 0, 'Reduce means make smaller.', 35),
    (24, 'vr', 'analogies', 'Fennby', 'hard', 'All blicks are green. Some green things are round. Which must be true?', array['All blicks are green','All green things are blicks','Some blicks are round','No round things are green'], 0, 'Only the first statement is guaranteed by the information.', 70),
    (25, 'nvr', 'shape-sequences', 'Fennby', 'medium', 'A shape is turned a quarter turn clockwise. How many degrees has it turned?', array['90 degrees','45 degrees','180 degrees','360 degrees'], 0, 'A quarter turn is 90 degrees.', 35),
    (26, 'nvr', 'shape-sequences', 'Fennby', 'easy', 'Which capital letter has a vertical line of shape-sequences?', array['A','F','G','R'], 0, 'A can be split into two matching halves vertically in standard block form.', 35),
    (27, 'nvr', 'shape-sequences', 'Fennby', 'medium', 'A pattern goes circle, square, triangle, circle, square. What comes next?', array['triangle','circle','square','star'], 0, 'The three-shape pattern repeats.', 35),
    (28, 'nvr', 'shape-sequences', 'Fennby', 'hard', 'In a row, the number of dots increases by 2 each time: 3, 5, 7, ?. What comes next?', array['9','8','10','11'], 0, 'The pattern adds 2 each time.', 35),
    (29, 'nvr', 'shape-sequences', 'Fennby', 'medium', 'Which shape has exactly five sides?', array['pentagon','hexagon','octagon','rectangle'], 0, 'A pentagon has five sides.', 35),
    (30, 'nvr', 'shape-sequences', 'Fennby', 'hard', 'A cube has 6 faces. If two cubes are joined face-to-face, how many outside faces are visible?', array['10','12','8','11'], 0, 'Two touching faces are hidden, so 12 - 2 = 10.', 65),
    (31, 'general', 'knowledge', 'Fennby', 'easy', 'Which organ pumps blood around the body?', array['heart','lung','stomach','kidney'], 0, 'The heart pumps blood.', 30),
    (32, 'general', 'knowledge', 'Fennby', 'easy', 'What is the capital city of Wales?', array['Cardiff','Swansea','Bristol','Bangor'], 0, 'Cardiff is the capital of Wales.', 35),
    (33, 'general', 'knowledge', 'Fennby', 'medium', 'The Romans built many straight roads in Britain mainly to help with _____.', array['travel and control','growing oranges','printing books','making electricity'], 0, 'Roads helped soldiers, trade, and administnumbern move efficiently.', 50),
    (34, 'general', 'knowledge', 'Fennby', 'medium', 'What gas do plants take in for photosynthesis?', array['carbon dioxide','oxygen','helium','nitrogen'], 0, 'Plants take in carbon dioxide during photosynthesis.', 45),
    (35, 'general', 'knowledge', 'Fennby', 'medium', 'Which river runs through London?', array['Thames','Severn','Mersey','Tyne'], 0, 'The River Thames runs through London.', 35),
    (36, 'general', 'knowledge', 'Fennby', 'easy', 'Which password is strongest?', array['River!72Cloud','password','123456','qwerty'], 0, 'A strong password mixes words, symbols, and numbers and is not common.', 40),
    (37, 'general', 'logic', 'Fennby', 'medium', 'A club has 12 children. Half choose art and a quarter choose football. How many choose something else?', array['3','4','6','9'], 0, 'Half is 6 and a quarter is 3, leaving 3 children.', 60),
    (38, 'general', 'logic', 'Fennby', 'medium', 'A train leaves at 09:35 and arrives at 10:20. How long is the journey?', array['45 minutes','35 minutes','50 minutes','55 minutes'], 0, 'From 09:35 to 10:20 is 45 minutes.', 45),
    (39, 'general', 'logic', 'Fennby', 'hard', 'Lina is older than Sam. Sam is older than Jo. Who is youngest?', array['Jo','Sam','Lina','Cannot tell'], 0, 'If Lina > Sam > Jo, Jo is youngest.', 40),
    (40, 'general', 'logic', 'Fennby', 'medium', 'Which is the best estimate for 19 x 21?', array['400','200','600','900'], 0, '19 x 21 is close to 20 x 20 = 400.', 45)
),
inserted_questions as (
  insert into public.questions (
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
    exam_board,
    difficulty,
    'multiple_choice',
    question_text,
    options,
    correct_answer,
    explanation,
    estimated_seconds,
    'published'
  from seed_questions
  returning id, text
)
insert into public.assessment_questions (assessment_id, question_id, position)
select
  new_assessment.id,
  inserted_questions.id,
  seed_questions.position
from new_assessment
join seed_questions on true
join inserted_questions on inserted_questions.text = seed_questions.question_text
order by seed_questions.position;
