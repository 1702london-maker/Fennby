export type Mood = "great" | "good" | "okay" | "low" | "tough";

export const moodOptions: { key: Mood; emoji: string; label: string }[] = [
  { key: "great", emoji: "🤩", label: "Great" },
  { key: "good", emoji: "🙂", label: "Good" },
  { key: "okay", emoji: "😐", label: "Okay" },
  { key: "low", emoji: "😕", label: "A bit low" },
  { key: "tough", emoji: "😣", label: "Tough day" },
];

export interface Subject {
  key: string;
  name: string;
  progress: number; // 0-100
  lastWeekProgress: number;
  color: "teal" | "coral" | "plum" | "sage";
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  awardedAt: string;
  isNew?: boolean;
}

export interface Child {
  id: string;
  name: string;
  yearGroup: string;
  avatarEmoji: string;
  subjects: Subject[];
  badges: Badge[];
  moodTrend: { date: string; mood: Mood }[];
  examHistory: {
    id: string;
    date: string;
    subject: string;
    score: number;
    prevScore: number;
    topicBreakdown: { topic: string; score: number }[];
  }[];
}

export const children: Child[] = [
  {
    id: "amara",
    name: "Amara",
    yearGroup: "Year 5",
    avatarEmoji: "🦊",
    subjects: [
      { key: "vr", name: "Verbal Reasoning", progress: 78, lastWeekProgress: 65, color: "teal" },
      { key: "nvr", name: "Non-Verbal Reasoning", progress: 62, lastWeekProgress: 58, color: "plum" },
      { key: "maths", name: "Maths", progress: 71, lastWeekProgress: 69, color: "coral" },
      { key: "english", name: "English", progress: 84, lastWeekProgress: 80, color: "sage" },
    ],
    badges: [
      { id: "b1", name: "5-Day Streak", icon: "🔥", awardedAt: "2026-07-03", isNew: true },
      { id: "b2", name: "Verbal Reasoning Ace", icon: "🧩", awardedAt: "2026-06-28" },
      { id: "b3", name: "Brain Warm-Up Champion", icon: "⚡", awardedAt: "2026-06-20" },
    ],
    moodTrend: [
      { date: "Mon", mood: "good" },
      { date: "Tue", mood: "great" },
      { date: "Wed", mood: "okay" },
      { date: "Thu", mood: "good" },
      { date: "Fri", mood: "great" },
    ],
    examHistory: [
      {
        id: "e1",
        date: "2026-07-04",
        subject: "Verbal Reasoning",
        score: 78,
        prevScore: 65,
        topicBreakdown: [
          { topic: "Analogies", score: 82 },
          { topic: "Codes", score: 70 },
          { topic: "Word Sequences", score: 80 },
        ],
      },
    ],
  },
  {
    id: "kofi",
    name: "Kofi",
    yearGroup: "Year 3",
    avatarEmoji: "🐢",
    subjects: [
      { key: "vr", name: "Verbal Reasoning", progress: 45, lastWeekProgress: 40, color: "teal" },
      { key: "maths", name: "Maths", progress: 58, lastWeekProgress: 50, color: "coral" },
      { key: "english", name: "English", progress: 63, lastWeekProgress: 60, color: "sage" },
    ],
    badges: [{ id: "b4", name: "First Mock Exam", icon: "🎉", awardedAt: "2026-06-30" }],
    moodTrend: [
      { date: "Mon", mood: "great" },
      { date: "Tue", mood: "good" },
      { date: "Wed", mood: "good" },
      { date: "Thu", mood: "okay" },
      { date: "Fri", mood: "great" },
    ],
    examHistory: [
      {
        id: "e2",
        date: "2026-07-02",
        subject: "Maths",
        score: 58,
        prevScore: 50,
        topicBreakdown: [
          { topic: "Number", score: 62 },
          { topic: "Shape & Space", score: 50 },
        ],
      },
    ],
  },
];

export interface Message {
  id: string;
  sender: "tutor" | "parent" | "child";
  senderName: string;
  content: string;
  time: string;
}

export const chatThread: Message[] = [
  { id: "m1", sender: "tutor", senderName: "Ms. Reece", content: "Hi Amara! Great work on today's Verbal Reasoning warm-up 🎉", time: "9:02am" },
  { id: "m2", sender: "child", senderName: "Amara", content: "Thank you Ms Reece! The codes ones were tricky", time: "9:03am" },
  { id: "m3", sender: "tutor", senderName: "Ms. Reece", content: "Totally normal — we'll go through code strategies together on Thursday.", time: "9:04am" },
  { id: "m4", sender: "parent", senderName: "You", content: "Thanks Ms Reece, really appreciate the update — she mentioned she enjoyed today's session.", time: "6:45pm" },
  { id: "m5", sender: "tutor", senderName: "Ms. Reece", content: "She's doing brilliantly. I've logged today's session notes on the dashboard for you.", time: "6:47pm" },
];

export const upcomingSessions = [
  { id: "s1", child: "Amara", tutor: "Ms. Reece", subject: "Verbal Reasoning", date: "2026-07-08", time: "4:00pm" },
  { id: "s2", child: "Kofi", tutor: "Mr. Aldous", subject: "Maths", date: "2026-07-09", time: "5:00pm" },
];

export const assignedChildren = [
  { id: "amara", name: "Amara", yearGroup: "Year 5", subject: "Verbal Reasoning", nextSession: "2026-07-08, 4:00pm", lastNote: "Strong on analogies, revisit codes strategy." },
  { id: "priya", name: "Priya", yearGroup: "Year 6", subject: "Maths", nextSession: "2026-07-09, 3:30pm", lastNote: "Fractions much improved; keep practising ratio." },
  { id: "leo", name: "Leo", yearGroup: "Year 5", subject: "English", nextSession: "2026-07-10, 4:30pm", lastNote: "Comprehension confident; work on inference." },
];

export const schoolCohort = Array.from({ length: 15 }, (_, i) => ({
  id: `pupil-${i + 1}`,
  label: `Pupil ${i + 1}`,
  yearGroup: i % 3 === 0 ? "Year 6" : i % 3 === 1 ? "Year 5" : "Year 4",
  pupilPremium: i % 4 === 0,
  progress: 40 + ((i * 7) % 55),
}));

export const brainTeasers = [
  { id: "t1", question: "If CAT is coded as 3120, how is DOG coded?", options: ["4157", "4715", "4165", "4175"], answer: 3 },
  { id: "t2", question: "Which shape completes the pattern?", options: ["Triangle", "Circle", "Square", "Hexagon"], answer: 1 },
  { id: "t3", question: "Odd one out: Apple, Banana, Carrot, Mango", options: ["Apple", "Banana", "Carrot", "Mango"], answer: 2 },
];

export const examQuestions = [
  { id: "q1", topic: "Analogies", question: "Book is to Read as Fork is to ___?", options: ["Eat", "Kitchen", "Plate", "Spoon"], answer: 0 },
  { id: "q2", topic: "Codes", question: "If PEN = 16-5-14, what is INK?", options: ["9-14-11", "9-11-14", "8-14-11", "9-14-10"], answer: 0 },
  { id: "q3", topic: "Word Sequences", question: "Complete: one, two, four, eight, ___?", options: ["ten", "twelve", "sixteen", "fourteen"], answer: 2 },
  { id: "q4", topic: "Analogies", question: "Bird is to Nest as Bee is to ___?", options: ["Sky", "Hive", "Flower", "Wing"], answer: 1 },
];

export interface AllBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  awardedAt?: string;
}

export const allBadges: AllBadge[] = [
  { id: "b1", name: "5-Day Streak", icon: "🔥", description: "Complete 5 days of warm-ups in a row.", earned: true, awardedAt: "2026-07-03" },
  { id: "b2", name: "Verbal Reasoning Ace", icon: "🧩", description: "Score 75%+ on a Verbal Reasoning mock.", earned: true, awardedAt: "2026-06-28" },
  { id: "b3", name: "Brain Warm-Up Champion", icon: "⚡", description: "Complete 20 brain warm-ups.", earned: true, awardedAt: "2026-06-20" },
  { id: "b4", name: "First Mock Exam", icon: "🎉", description: "Complete your very first mock exam.", earned: true, awardedAt: "2026-06-01" },
  { id: "b5", name: "Maths Whizz", icon: "🔢", description: "Score 80%+ on a Maths mock.", earned: false },
  { id: "b6", name: "Non-Verbal Ninja", icon: "🧠", description: "Score 75%+ on a Non-Verbal Reasoning mock.", earned: false },
  { id: "b7", name: "30-Day Streak", icon: "🌟", description: "Complete 30 days of warm-ups in a row.", earned: false },
  { id: "b8", name: "Full Simulation Finisher", icon: "⏱️", description: "Complete a full timed exam simulation.", earned: false },
  { id: "b9", name: "Craft Creator", icon: "🧵", description: "Complete your first vocational track session.", earned: false },
  { id: "b10", name: "Kindness Star", icon: "💫", description: "Awarded by your tutor for great effort.", earned: false },
];

export interface Tutor {
  id: string;
  name: string;
  specialism: string;
  bio: string;
  dbsVerified: boolean;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
}

export const tutors: Tutor[] = [
  {
    id: "t-reece",
    name: "Ms. Reece",
    specialism: "Verbal Reasoning · 11+",
    bio: "Former grammar school teacher with 9 years' experience preparing children for 11+ entrance exams.",
    dbsVerified: true,
    rating: 4.9,
    reviewCount: 128,
    yearsExperience: 9,
  },
  {
    id: "t-aldous",
    name: "Mr. Aldous",
    specialism: "Maths · Non-Verbal Reasoning",
    bio: "Maths specialist focused on building confidence with number and shape reasoning for ages 7-11.",
    dbsVerified: true,
    rating: 4.8,
    reviewCount: 94,
    yearsExperience: 6,
  },
  {
    id: "t-oyelaran",
    name: "Mrs. Oyelaran",
    specialism: "English · Creative Writing",
    bio: "Primary English lead helping children build comprehension and creative writing skills with warmth and patience.",
    dbsVerified: true,
    rating: 5.0,
    reviewCount: 61,
    yearsExperience: 12,
  },
  {
    id: "t-nkemdi",
    name: "Mr. Nkemdi",
    specialism: "Verbal & Non-Verbal Reasoning",
    bio: "Specialist in CEM and GL-style reasoning papers, known for turning tricky topics into simple strategies.",
    dbsVerified: true,
    rating: 4.7,
    reviewCount: 47,
    yearsExperience: 4,
  },
];

export const billing = {
  plan: "Family Plan — 2 children",
  price: "£49/month",
  paymentMethod: "Visa ending 4242",
  nextInvoiceDate: "2026-08-01",
  invoices: [
    { id: "inv-1", date: "2026-07-01", amount: "£49.00", status: "Paid" },
    { id: "inv-2", date: "2026-06-01", amount: "£49.00", status: "Paid" },
    { id: "inv-3", date: "2026-05-01", amount: "£49.00", status: "Paid" },
  ],
  plans: [
    { name: "Single Child", price: "£29/month", features: ["1 child", "Digital + hybrid mock exams", "Full parent visibility"] },
    { name: "Family Plan", price: "£49/month", features: ["Up to 3 children", "Everything in Single Child", "Priority tutor matching"], current: true },
    { name: "Family Plus", price: "£69/month", features: ["Up to 5 children", "Everything in Family Plan", "Vocational track included"] },
  ],
};

