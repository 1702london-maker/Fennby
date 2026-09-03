import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(path) {
  if (!fs.existsSync(path)) return;
  for (const line of fs.readFileSync(path, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index === -1) continue;
    process.env[line.slice(0, index)] ??= line.slice(index + 1);
  }
}

loadEnvFile(".env.local");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) throw new Error("Missing Supabase env vars.");

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const vocabulary = [
  ["brisk", "quick", ["slow", "dull", "heavy"]],
  ["scarce", "rare", ["common", "bright", "smooth"]],
  ["timid", "shy", ["bold", "noisy", "wide"]],
  ["ancient", "old", ["new", "small", "kind"]],
  ["fragile", "delicate", ["strong", "plain", "late"]],
  ["gloomy", "dismal", ["cheerful", "sharp", "tiny"]],
  ["generous", "giving", ["selfish", "sleepy", "rough"]],
  ["precise", "exact", ["vague", "gentle", "rapid"]],
  ["drowsy", "sleepy", ["alert", "curved", "empty"]],
  ["reluctant", "unwilling", ["eager", "golden", "silent"]],
];
const places = ["library", "garden", "station", "market", "museum", "kitchen", "playground", "harbour", "classroom", "studio"];
const objects = ["notebook", "ticket", "lantern", "parcel", "painting", "compass", "recipe", "trophy", "sketch", "message"];
const animals = ["otter", "falcon", "badger", "heron", "fox", "dolphin", "squirrel", "lizard", "owl", "beetle"];
const tones = ["morning", "after-school", "weekend", "rainy-day", "summer", "winter", "library-club", "science-fair", "sports-day", "craft-club"];
const colours = ["red", "blue", "green", "yellow", "purple", "silver", "orange", "white", "black", "gold"];
const capitals = [
  ["Scotland", "Edinburgh", ["Cardiff", "Dublin", "York"]],
  ["Wales", "Cardiff", ["Swansea", "Bristol", "Bangor"]],
  ["France", "Paris", ["Lyon", "Madrid", "Rome"]],
  ["Italy", "Rome", ["Milan", "Paris", "Athens"]],
  ["Spain", "Madrid", ["Barcelona", "Lisbon", "Seville"]],
  ["Germany", "Berlin", ["Munich", "Vienna", "Hamburg"]],
  ["Ireland", "Dublin", ["Cork", "Belfast", "Galway"]],
  ["Japan", "Tokyo", ["Kyoto", "Seoul", "Osaka"]],
  ["Canada", "Ottawa", ["Toronto", "Vancouver", "Montreal"]],
  ["Australia", "Canberra", ["Sydney", "Melbourne", "Perth"]],
];

function options(correct, wrong) {
  const picked = [correct, ...wrong].map(String);
  if (new Set(picked.map((v) => v.toLowerCase())).size !== picked.length) throw new Error(`Duplicate options for ${correct}`);
  return picked;
}

function codeWord(index) {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  return `${letters[Math.floor(index / letters.length) % letters.length]}${letters[index % letters.length]}`;
}

function q(subject_key, topic_key, difficulty, text, answer, wrong, explanation, seconds = 40) {
  return {
    subject_key,
    topic_key,
    exam_board: "Fennby Warm-Up V2",
    difficulty,
    type: "multiple_choice",
    text: `${text} Set ${codeWord(rows.length)}.`,
    options: options(answer, wrong),
    correct_answer: 0,
    explanation,
    estimated_seconds: seconds,
    status: "published",
  };
}

const rows = [];

for (let i = 0; i < 200; i += 1) {
  const word = vocabulary[i % vocabulary.length];
  const place = places[Math.floor(i / places.length) % places.length];
  const object = objects[Math.floor(i / 10) % objects.length];
  rows.push(q("english", i % 2 ? "comprehension" : "vocabulary", i % 5 ? "easy" : "medium", `In a ${tones[i % tones.length]} sentence about a ${object} in the ${place}, which word is closest in meaning to "${word[0]}"?`, word[1], word[2], `${word[0]} is closest in meaning to ${word[1]}.`));
}

for (let i = 0; i < 200; i += 1) {
  const a = 12 + i;
  const b = 3 + (i % 17);
  const topic = i % 4 === 0 ? "shape-space" : "number";
  if (topic === "shape-space") {
    const width = 4 + (i % 9);
    const length = 7 + (i % 11);
    const perimeter = 2 * (width + length);
    rows.push(q("maths", topic, "medium", `A ${colours[i % colours.length]} ${objects[Math.floor(i / 10) % objects.length]} display is ${length} cm long and ${width} cm wide. What is its perimeter?`, `${perimeter} cm`, [`${length * width} cm`, `${length + width} cm`, `${perimeter + 4} cm`], "Add all four sides of the rectangle.", 55));
  } else {
    const answer = a + b;
    rows.push(q("maths", topic, i % 6 ? "easy" : "medium", `A ${tones[i % tones.length]} quiz team in the ${places[Math.floor(i / 10) % places.length]} scores ${a} points, then gains ${b} more. What is the total?`, answer, [answer + 1, answer - 2, answer + 5], "Add the two scores.", 40));
  }
}

for (let i = 0; i < 200; i += 1) {
  const item = objects[i % objects.length];
  const animal = animals[Math.floor(i / animals.length) % animals.length];
  if (i % 3 === 0) {
    rows.push(q("vr", "analogies", "medium", `In a ${tones[i % tones.length]} puzzle, ${item} is to writing as ${animal} is to _____.`, "living thing", ["building", "number", "weather"], "The second pair should describe what the animal is.", 45));
  } else if (i % 3 === 1) {
    const start = 1 + (i % 13);
    rows.push(q("vr", "codes", "medium", `In the ${colours[i % colours.length]} code, if A=${start}, B=${start + 1}, C=${start + 2}, what is CAB?`, `${start + 2}-${start}-${start + 1}`, [`${start}-${start + 1}-${start + 2}`, `${start + 1}-${start}-${start + 2}`, `${start + 2}-${start + 1}-${start}`], "Match each letter to its code.", 55));
  } else {
    const first = String.fromCharCode(65 + (i % 10));
    const second = String.fromCharCode(first.charCodeAt(0) + 2);
    const third = String.fromCharCode(second.charCodeAt(0) + 3);
    rows.push(q("vr", "word-sequences", "hard", `What comes next in the ${places[i % places.length]} letter pattern ${first}, ${second}, ${third}?`, String.fromCharCode(third.charCodeAt(0) + 4), [String.fromCharCode(third.charCodeAt(0) + 2), String.fromCharCode(third.charCodeAt(0) + 3), String.fromCharCode(third.charCodeAt(0) + 5)], "The gaps increase by one each time.", 60));
  }
}

for (let i = 0; i < 200; i += 1) {
  const shapes = ["circle", "square", "triangle", "hexagon", "star", "oval"];
  const first = shapes[i % shapes.length];
  const second = shapes[(i + 1) % shapes.length];
  const third = shapes[(i + 2) % shapes.length];
  rows.push(q("nvr", "shape-sequences", i % 5 ? "easy" : "medium", `A ${colours[i % colours.length]} ${tones[Math.floor(i / 10) % tones.length]} pattern repeats ${first}, ${second}, ${third}, ${first}, ${second}. What comes next?`, third, [first, second, shapes[(i + 3) % shapes.length]], "The three-shape sequence repeats.", 35));
}

for (let i = 0; i < 200; i += 1) {
  if (i % 2 === 0) {
    const cap = capitals[(i / 2) % capitals.length];
    rows.push(q("general", "knowledge", "easy", `In the ${tones[i % tones.length]} travel round, which city is the capital of ${cap[0]}?`, cap[1], cap[2], `${cap[1]} is the capital of ${cap[0]}.`, 35));
  } else {
    const a = animals[i % animals.length];
    const b = objects[i % objects.length];
    rows.push(q("general", "logic", "medium", `In a ${colours[i % colours.length]} logic card, all ${a}s are living things. A ${b} is not a living thing. Which statement must be true?`, `A ${b} is not a ${a}`, [`All ${b}s are ${a}s`, `No ${a}s are living things`, `Every living thing is a ${b}`], "If one thing is not living, it cannot be one of the animals described.", 55));
  }
}

const uniqueText = new Set(rows.map((row) => row.text));
if (uniqueText.size !== rows.length) throw new Error(`Generated ${rows.length - uniqueText.size} duplicate questions.`);

const { count: existingCount, error: countError } = await supabase
  .from("questions")
  .select("id", { count: "exact", head: true })
  .eq("exam_board", "Fennby Warm-Up V2");
if (countError) throw countError;

if ((existingCount ?? 0) >= rows.length) {
  console.log(`Fennby Warm-Up V2 bank already has ${existingCount} generated questions.`);
  process.exit(0);
}

const { error: cleanupError } = await supabase.from("questions").delete().eq("exam_board", "Fennby Warm-Up V2");
if (cleanupError) throw cleanupError;

for (let index = 0; index < rows.length; index += 100) {
  const { error } = await supabase.from("questions").insert(rows.slice(index, index + 100));
  if (error) throw error;
}

console.log(`Seeded ${rows.length} varied Fennby Warm-Up V2 questions.`);
