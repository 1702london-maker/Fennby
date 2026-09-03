export const games = [
  {
    key: "memory-builder",
    name: "Memory Builder",
    skill: "Working memory",
    minutes: 5,
    difficulty: "Easy",
    emoji: "🧠",
    href: "/child/games/memory-builder",
  },
  {
    key: "pattern-recognition",
    name: "Pattern Recognition",
    skill: "Non-Verbal Reasoning",
    minutes: 5,
    difficulty: "Medium",
    emoji: "🔷",
    href: "/child/games/pattern-recognition",
  },
  {
    key: "logic-puzzle",
    name: "Logic Puzzle",
    skill: "Verbal Reasoning",
    minutes: 7,
    difficulty: "Medium",
    emoji: "🧩",
    href: "/child/games/logic-puzzle",
  },
  {
    key: "number-recall",
    name: "Number Recall",
    skill: "Maths",
    minutes: 5,
    difficulty: "Easy",
    emoji: "🔢",
    href: "/child/games/number-recall",
  },
  {
    key: "reading-focus",
    name: "Reading Focus",
    skill: "English",
    minutes: 6,
    difficulty: "Medium",
    emoji: "📖",
    href: "/child/games/reading-focus",
  },
  {
    key: "attention-switch",
    name: "Attention Switch",
    skill: "Concentration",
    minutes: 5,
    difficulty: "Hard",
    emoji: "🔀",
    href: "/child/games/attention-switch",
  },
  {
    key: "reasoning-challenge",
    name: "Reasoning Challenge",
    skill: "Verbal Reasoning",
    minutes: 8,
    difficulty: "Hard",
    emoji: "💡",
    href: "/child/games/reasoning-challenge",
  },
] as const;

export type GameKey = (typeof games)[number]["key"];

export const gameChallenges: Record<Exclude<GameKey, "memory-builder">, {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}[]> = {
  "pattern-recognition": [
    { prompt: "Which comes next: small square, large square, small circle, large circle, small triangle, ?", options: ["Large triangle", "Small square", "Large circle", "Small triangle"], answer: 0, explanation: "The shape repeats small then large before moving to the next shape." },
    { prompt: "A shape turns one quarter turn clockwise each step. What happens next?", options: ["It turns another quarter clockwise", "It disappears", "It changes colour only", "It gets smaller"], answer: 0, explanation: "The rule is rotation, so the next step keeps rotating the same way." },
    { prompt: "The shaded part moves from top to right to bottom. Where next?", options: ["Left", "Top", "Middle", "Bottom"], answer: 0, explanation: "It is moving around the shape in order." },
  ],
  "logic-puzzle": [
    { prompt: "All blicks are blue. This thing is a blick. What must be true?", options: ["It is blue", "It is red", "It is not a blick", "It is large"], answer: 0, explanation: "If all blicks are blue, every blick must be blue." },
    { prompt: "Maya is older than Leo. Leo is older than Sam. Who is oldest?", options: ["Maya", "Leo", "Sam", "They are the same age"], answer: 0, explanation: "Maya is above Leo, and Leo is above Sam." },
    { prompt: "Only children with a green ticket may enter. Asha entered. What can you infer?", options: ["Asha had a green ticket", "Asha had a red ticket", "Asha was late", "Asha is a tutor"], answer: 0, explanation: "Entering requires a green ticket." },
  ],
  "number-recall": [
    { prompt: "Remember this number, then choose it: 4729", options: ["4792", "4729", "4279", "7429"], answer: 1, explanation: "The correct order is 4, 7, 2, 9." },
    { prompt: "Remember this number, then choose it: 81635", options: ["81635", "81365", "86135", "81653"], answer: 0, explanation: "Read the digits in small groups to keep them steady." },
    { prompt: "Remember this number, then choose it backwards: 2946", options: ["6492", "6924", "4629", "6429"], answer: 0, explanation: "Backwards, 2946 becomes 6492." },
  ],
  "reading-focus": [
    { prompt: "The sentence says: The lane was narrow, so the cyclist slowed down. Why did the cyclist slow down?", options: ["The lane was narrow", "It was raining", "The bike broke", "The cyclist was tired"], answer: 0, explanation: "The reason is stated directly in the sentence." },
    { prompt: "The word 'reluctant' most nearly means...", options: ["Not willing", "Very quick", "Extremely loud", "Already finished"], answer: 0, explanation: "Reluctant means not keen or not willing." },
    { prompt: "The phrase 'checked twice' suggests the character was...", options: ["Careful", "Angry", "Lost", "Hungry"], answer: 0, explanation: "Checking twice is a clue that someone is being careful." },
  ],
  "attention-switch": [
    { prompt: "Rule: choose the colour word, not the colour it names. RED", options: ["RED", "Blue", "Green", "Yellow"], answer: 0, explanation: "The task asks for the written word." },
    { prompt: "Rule change: choose the opposite. Up", options: ["Down", "Up", "Left", "Right"], answer: 0, explanation: "When the rule changes, slow down and use the new rule." },
    { prompt: "Rule change: choose the number of letters. SCHOOL", options: ["4", "5", "6", "7"], answer: 2, explanation: "SCHOOL has six letters." },
  ],
  "reasoning-challenge": [
    { prompt: "Book is to reading as fork is to...", options: ["Eating", "Drawing", "Sleeping", "Running"], answer: 0, explanation: "A book is used for reading. A fork is used for eating." },
    { prompt: "Find the odd one out.", options: ["Apple", "Pear", "Carrot", "Peach"], answer: 2, explanation: "Carrot is a vegetable. The others are fruits." },
    { prompt: "Complete the pattern: 3, 6, 12, 24, ?", options: ["30", "36", "48", "42"], answer: 2, explanation: "Each number doubles." },
  ],
};
