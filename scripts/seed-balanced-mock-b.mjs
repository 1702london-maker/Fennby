import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(path) {
  if (!fs.existsSync(path)) return;
  for (const line of fs.readFileSync(path, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    const key = line.slice(0, index);
    const value = line.slice(index + 1);
    process.env[key] ??= value;
  }
}

loadEnvFile(".env.local");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const questions = [
  ["english", "vocabulary", "easy", "Which word is closest in meaning to cautious?", ["careful", "careless", "noisy", "quick"], 0, "Cautious means careful or wary.", 45],
  ["english", "comprehension", "easy", "Choose the sentence with the correct apostrophe.", ["The childs bag was blue.", "The child's bag was blue.", "The childs' bag was blue.", "The child bag's was blue."], 1, "The bag belongs to one child, so child takes apostrophe s.", 55],
  ["english", "comprehension", "medium", "A character whispers before opening a door. What does this most strongly suggest?", ["They are trying not to be heard", "They are speaking to a crowd", "They are angry about the weather", "They have forgotten the door"], 0, "Whispering suggests secrecy or caution.", 60],
  ["english", "vocabulary", "easy", "Which spelling is correct?", ["seperate", "separate", "seperete", "seprate"], 1, "Separate is the correct spelling.", 35],
  ["english", "comprehension", "medium", "Which sentence is punctuated correctly?", ["Although it was raining we played outside.", "Although it was raining, we played outside.", "Although, it was raining we played outside.", "Although it was, raining we played outside."], 1, "The comma separates the opening subordinate clause.", 60],
  ["english", "comprehension", "medium", "Maya checked her watch for the third time and tapped her foot. How is Maya probably feeling?", ["impatient", "relaxed", "sleepy", "confused"], 0, "Repeatedly checking a watch and tapping a foot suggest impatience.", 45],
  ["english", "vocabulary", "medium", "Which word best completes the sentence: The kitten moved ____ across the windowsill.", ["gracefully", "squarely", "loudly", "heavily"], 0, "Gracefully best describes smooth, careful movement.", 45],
  ["english", "comprehension", "hard", "Which option combines the ideas most clearly? The road was icy. The driver slowed down.", ["The road was icy, so the driver slowed down.", "The road was icy the driver slowed down.", "The driver slowed down the road was icy.", "Icy was the road and slowed the driver."], 0, "So clearly shows the cause and effect.", 60],
  ["maths", "number", "easy", "What is 37 + 48?", ["85", "75", "95", "83"], 0, "37 + 48 = 85.", 40],
  ["maths", "number", "medium", "Which fraction is equivalent to 3/4?", ["6/8", "3/8", "4/6", "9/16"], 0, "Multiplying numerator and denominator by 2 gives 6/8.", 45],
  ["maths", "number", "medium", "What is 25% of 64?", ["16", "12", "20", "24"], 0, "25% is one quarter, and one quarter of 64 is 16.", 45],
  ["maths", "shape-space", "easy", "A rectangle is 8 cm long and 5 cm wide. What is its perimeter?", ["26 cm", "40 cm", "13 cm", "18 cm"], 0, "Perimeter is 8 + 5 + 8 + 5 = 26 cm.", 50],
  ["maths", "number", "medium", "How many millilitres are in 2.5 litres?", ["2500 ml", "250 ml", "25 ml", "2050 ml"], 0, "1 litre is 1000 ml, so 2.5 litres is 2500 ml.", 40],
  ["maths", "number", "medium", "The numbers are 4, 7, 9, 10, 10. What is the mode?", ["10", "8", "7", "9"], 0, "The mode is the value that appears most often.", 40],
  ["maths", "number", "medium", "If n + 6 = 17, what is n?", ["11", "23", "9", "13"], 0, "Subtract 6 from both sides: n = 11.", 40],
  ["maths", "number", "hard", "A recipe uses 2 eggs for 5 cakes. How many eggs are needed for 20 cakes?", ["8", "10", "6", "12"], 0, "20 cakes is four times 5 cakes, so 2 eggs x 4 = 8.", 55],
  ["vr", "analogies", "easy", "Book is to reading as fork is to _____.", ["eating", "drawing", "sleeping", "running"], 0, "A fork is used for eating.", 35],
  ["vr", "codes", "medium", "If CAT is coded as DBU, how is DOG coded?", ["EPH", "CNE", "FQI", "ENH"], 0, "Each letter moves forward by one place.", 55],
  ["vr", "analogies", "easy", "Which word does not belong?", ["triangle", "square", "circle", "window"], 3, "Window is not a geometric shape in this list.", 35],
  ["vr", "analogies", "medium", "Find the pair with the same relationship as hot:cold.", ["early:late", "warm:sunny", "fire:smoke", "water:drink"], 0, "Hot and cold are opposites, as early and late are opposites.", 45],
  ["vr", "word-sequences", "medium", "Which word can follow sun to make a compound word?", ["flower", "table", "river", "pencil"], 0, "Sunflower is a compound word.", 35],
  ["vr", "word-sequences", "hard", "What comes next in the sequence: A, C, F, J, O, ?", ["U", "T", "S", "V"], 0, "The gaps increase by 1: +2, +3, +4, +5, then +6.", 70],
  ["vr", "word-sequences", "medium", "Which word means to make something smaller?", ["reduce", "expand", "protect", "observe"], 0, "Reduce means make smaller.", 35],
  ["vr", "analogies", "hard", "All blicks are green. Some green things are round. Which must be true?", ["All blicks are green", "All green things are blicks", "Some blicks are round", "No round things are green"], 0, "Only the first statement is guaranteed by the information.", 70],
  ["nvr", "shape-sequences", "medium", "A shape is turned a quarter turn clockwise. How many degrees has it turned?", ["90 degrees", "45 degrees", "180 degrees", "360 degrees"], 0, "A quarter turn is 90 degrees.", 35],
  ["nvr", "shape-sequences", "easy", "Which capital letter has a vertical line of shape-sequences?", ["A", "F", "G", "R"], 0, "A can be split into two matching halves vertically in standard block form.", 35],
  ["nvr", "shape-sequences", "medium", "A pattern goes circle, square, triangle, circle, square. What comes next?", ["triangle", "circle", "square", "star"], 0, "The three-shape pattern repeats.", 35],
  ["nvr", "shape-sequences", "hard", "In a row, the number of dots increases by 2 each time: 3, 5, 7, ?. What comes next?", ["9", "8", "10", "11"], 0, "The pattern adds 2 each time.", 35],
  ["nvr", "shape-sequences", "medium", "Which shape has exactly five sides?", ["pentagon", "hexagon", "octagon", "rectangle"], 0, "A pentagon has five sides.", 35],
  ["nvr", "shape-sequences", "hard", "A cube has 6 faces. If two cubes are joined face-to-face, how many outside faces are visible?", ["10", "12", "8", "11"], 0, "Two touching faces are hidden, so 12 - 2 = 10.", 65],
  ["general", "knowledge", "easy", "Which organ pumps blood around the body?", ["heart", "lung", "stomach", "kidney"], 0, "The heart pumps blood.", 30],
  ["general", "knowledge", "easy", "What is the capital city of Wales?", ["Cardiff", "Swansea", "Bristol", "Bangor"], 0, "Cardiff is the capital of Wales.", 35],
  ["general", "knowledge", "medium", "The Romans built many straight roads in Britain mainly to help with _____.", ["travel and control", "growing oranges", "printing books", "making electricity"], 0, "Roads helped soldiers, trade, and administnumbern move efficiently.", 50],
  ["general", "knowledge", "medium", "What gas do plants take in for photosynthesis?", ["carbon dioxide", "oxygen", "helium", "nitrogen"], 0, "Plants take in carbon dioxide during photosynthesis.", 45],
  ["general", "knowledge", "medium", "Which river runs through London?", ["Thames", "Severn", "Mersey", "Tyne"], 0, "The River Thames runs through London.", 35],
  ["general", "knowledge", "easy", "Which password is strongest?", ["River!72Cloud", "password", "123456", "qwerty"], 0, "A strong password mixes words, symbols, and numbers and is not common.", 40],
  ["general", "logic", "medium", "A club has 12 children. Half choose art and a quarter choose football. How many choose something else?", ["3", "4", "6", "9"], 0, "Half is 6 and a quarter is 3, leaving 3 children.", 60],
  ["general", "logic", "medium", "A train leaves at 09:35 and arrives at 10:20. How long is the journey?", ["45 minutes", "35 minutes", "50 minutes", "55 minutes"], 0, "From 09:35 to 10:20 is 45 minutes.", 45],
  ["general", "logic", "hard", "Lina is older than Sam. Sam is older than Jo. Who is youngest?", ["Jo", "Sam", "Lina", "Cannot tell"], 0, "If Lina > Sam > Jo, Jo is youngest.", 40],
  ["general", "logic", "medium", "Which is the best estimate for 19 x 21?", ["400", "200", "600", "900"], 0, "19 x 21 is close to 20 x 20 = 400.", 45],
];

const duplicateOptions = questions.filter((question) => new Set(question[4]).size !== question[4].length);
if (duplicateOptions.length) {
  console.error(`Refusing to seed ${duplicateOptions.length} questions with duplicate options.`);
  process.exit(1);
}

const { data: existing, error: existingError } = await supabase
  .from("assessments")
  .select("id, assessment_questions(id)")
  .eq("title", "Fennby Balanced 11+ Mock B")
  .limit(10);

if (existingError) {
  console.error(existingError.message);
  process.exit(1);
}

if (existing?.some((assessment) => (assessment.assessment_questions ?? []).length >= questions.length)) {
  console.log("Fennby Balanced 11+ Mock B already exists.");
  process.exit(0);
}

if (existing?.length) {
  const { error: cleanupError } = await supabase
    .from("assessments")
    .delete()
    .eq("title", "Fennby Balanced 11+ Mock B");

  if (cleanupError) {
    console.error(cleanupError.message);
    process.exit(1);
  }
}

const { data: assessment, error: assessmentError } = await supabase
  .from("assessments")
  .insert({
    title: "Fennby Balanced 11+ Mock B",
    subject_key: "general",
    level_key: "eleven_plus",
    mode: "digital",
    status: "published",
    published: true,
    exam_board: "Fennby",
    age_group: "Year 5",
    duration_minutes: 50,
  })
  .select("id")
  .single();

if (assessmentError || !assessment) {
  console.error(assessmentError?.message ?? "Assessment insert failed.");
  process.exit(1);
}

const questionRows = questions.map(([subject_key, topic_key, difficulty, text, options, correct_answer, explanation, estimated_seconds]) => ({
  subject_key,
  topic_key,
  exam_board: "Fennby",
  difficulty,
  type: "multiple_choice",
  text,
  options,
  correct_answer,
  explanation,
  estimated_seconds,
  status: "published",
}));

const { data: insertedQuestions, error: questionError } = await supabase
  .from("questions")
  .insert(questionRows)
  .select("id, text");

if (questionError || !insertedQuestions) {
  console.error(questionError?.message ?? "Question insert failed.");
  process.exit(1);
}

const questionIdByText = new Map(insertedQuestions.map((question) => [question.text, question.id]));
const assessmentQuestionRows = questions.map((question, index) => ({
  assessment_id: assessment.id,
  question_id: questionIdByText.get(question[3]),
  position: index + 1,
}));

const { error: linkError } = await supabase.from("assessment_questions").insert(assessmentQuestionRows);
if (linkError) {
  console.error(linkError.message);
  process.exit(1);
}

console.log(`Seeded Fennby Balanced 11+ Mock B with ${questions.length} questions.`);
