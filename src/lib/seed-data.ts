// Seed data for local/mock preview — mirrors the DB schema in types.ts.
// One connected dataset: every dashboard reads from the same source so nothing is isolated fake data.
import {
  Learner,
  TutorProfile,
  School,
  SchoolClass,
  Subject,
  Topic,
  Question,
  Assessment,
  AssessmentResult,
  RevisionItem,
  BrainWarmup,
  MoodCheckin,
  Achievement,
  LearnerAchievement,
  MessageThread,
  Message,
  LessonSession,
  LessonNote,
  Homework,
  Activity,
  ActivityRegistration,
  SafeguardingCase,
  Profile,
} from "@/lib/types";

export const profiles: Profile[] = [
  { id: "u-parent-1", role: "parent", fullName: "Ade Okafor", email: "ade@example.com" },
  { id: "u-tutor-1", role: "tutor", fullName: "Ms. Reece", email: "reece@fennby.com" },
  { id: "u-tutor-2", role: "tutor", fullName: "Mr. Aldous", email: "aldous@fennby.com" },
  { id: "u-teacher-1", role: "teacher", fullName: "Mrs. Bello", email: "bello@traffordgrammarprep.sch.uk" },
  { id: "u-teacher-2", role: "teacher", fullName: "Mr. Whitfield", email: "whitfield@traffordgrammarprep.sch.uk" },
  { id: "u-admin-1", role: "admin", fullName: "Sam Iwu", email: "sam@fennby.com" },
  { id: "u-dsl-1", role: "safeguarding", fullName: "Priya Shah", email: "priya@fennby.com" },
  { id: "u-la-1", role: "authority", fullName: "Trafford LA Viewer", email: "la-viewer@trafford.gov.uk" },
];

export const learners: Learner[] = [
  {
    id: "amara",
    parentId: "u-parent-1",
    firstName: "Amara",
    preferredName: "Amara",
    dateOfBirth: "2016-03-14",
    yearGroup: "Year 5",
    currentSchool: "Trafford Grammar Prep",
    targetExam: "11+ Grammar Entrance",
    targetSchool: "Trafford Grammar School",
    examBoard: "GL Assessment",
    learningGoals: "Build confidence in Verbal Reasoning codes and improve Non-Verbal Reasoning speed.",
    sendNotes: "None recorded.",
    accessibilityNeeds: "None recorded.",
    avatarEmoji: "🦊",
  },
  {
    id: "kofi",
    parentId: "u-parent-1",
    firstName: "Kofi",
    preferredName: "Kofi",
    dateOfBirth: "2018-09-02",
    yearGroup: "Year 3",
    currentSchool: "Trafford Grammar Prep",
    targetExam: "SATs preparation",
    targetSchool: "N/A",
    examBoard: "N/A",
    learningGoals: "Build early reasoning confidence and reading fluency.",
    sendNotes: "Mild dyslexia — extra time recommended on written tasks.",
    accessibilityNeeds: "Larger font size on reading materials.",
    avatarEmoji: "🐢",
  },
];

export const tutorProfiles: TutorProfile[] = [
  {
    id: "u-tutor-1",
    name: "Ms. Reece",
    email: "reece@fennby.com",
    subjects: ["Verbal Reasoning", "English"],
    ageGroups: ["Year 4", "Year 5", "Year 6"],
    experienceYears: 9,
    qualifications: "PGCE, former grammar school teacher",
    examBoards: ["GL Assessment", "CEM"],
    dbsStatus: "verified",
    status: "approved",
    trainingCompleted: true,
    rating: 4.9,
    reviewCount: 128,
    bio: "Former grammar school teacher with 9 years' experience preparing children for 11+ entrance exams.",
  },
  {
    id: "u-tutor-2",
    name: "Mr. Aldous",
    email: "aldous@fennby.com",
    subjects: ["Maths", "Non-Verbal Reasoning"],
    ageGroups: ["Year 3", "Year 4", "Year 5"],
    experienceYears: 6,
    qualifications: "BSc Mathematics, QTS",
    examBoards: ["GL Assessment", "ISEB"],
    dbsStatus: "verified",
    status: "approved",
    trainingCompleted: true,
    rating: 4.8,
    reviewCount: 94,
    bio: "Maths specialist focused on building confidence with number and shape reasoning for ages 7-11.",
  },
  {
    id: "u-tutor-3",
    name: "Mrs. Oyelaran",
    email: "oyelaran@applicant.com",
    subjects: ["English", "Creative Writing"],
    ageGroups: ["Year 5", "Year 6"],
    experienceYears: 12,
    qualifications: "PGCE Primary English",
    examBoards: ["GL Assessment"],
    dbsStatus: "pending",
    status: "dbs_pending",
    trainingCompleted: false,
    rating: 0,
    reviewCount: 0,
    bio: "Primary English lead applying to join the Fennby tutor network.",
  },
];

export const schools: School[] = [
  {
    id: "school-1",
    name: "Trafford Grammar Prep",
    urn: "123456",
    localAuthority: "Trafford",
    address: "12 Grammar Lane, Trafford, M32",
    schoolType: "State Grammar",
    contactName: "Mrs. Bello",
    safeguardingLeadContact: "safeguarding@traffordgrammarprep.sch.uk",
    dataProtectionContact: "dpo@traffordgrammarprep.sch.uk",
    yearGroups: ["Year 4", "Year 5", "Year 6"],
    pupilCount: 15,
    approved: true,
  },
];

export const schoolClasses: SchoolClass[] = [
  { id: "class-y6", schoolId: "school-1", name: "6G", yearGroup: "Year 6", pupilIds: Array.from({ length: 5 }, (_, i) => `pupil-${i + 1}`), averageProgress: 68, homeworkCompletion: 82, mainWeakTopic: "Non-Verbal Reasoning", interventionCount: 2 },
  { id: "class-y5", schoolId: "school-1", name: "5G", yearGroup: "Year 5", pupilIds: Array.from({ length: 5 }, (_, i) => `pupil-${i + 6}`), averageProgress: 61, homeworkCompletion: 74, mainWeakTopic: "Codes", interventionCount: 3 },
  { id: "class-y4", schoolId: "school-1", name: "4G", yearGroup: "Year 4", pupilIds: Array.from({ length: 5 }, (_, i) => `pupil-${i + 11}`), averageProgress: 58, homeworkCompletion: 70, mainWeakTopic: "Reading Fluency", interventionCount: 1 },
];

export const subjects: Subject[] = [
  { key: "vr", name: "Verbal Reasoning" },
  { key: "nvr", name: "Non-Verbal Reasoning" },
  { key: "maths", name: "Maths" },
  { key: "english", name: "English" },
];

export const topics: Topic[] = [
  { key: "analogies", subjectKey: "vr", name: "Analogies" },
  { key: "codes", subjectKey: "vr", name: "Codes" },
  { key: "word-sequences", subjectKey: "vr", name: "Word Sequences" },
  { key: "shape-sequences", subjectKey: "nvr", name: "Shape Sequences" },
  { key: "number", subjectKey: "maths", name: "Number" },
  { key: "shape-space", subjectKey: "maths", name: "Shape & Space" },
  { key: "comprehension", subjectKey: "english", name: "Comprehension" },
];

export const questions: Question[] = [
  { id: "q1", subjectKey: "vr", topicKey: "analogies", examBoard: "GL Assessment", difficulty: "medium", type: "multiple_choice", text: "Book is to Read as Fork is to ___?", options: ["Eat", "Kitchen", "Plate", "Spoon"], correctAnswer: 0, explanation: "A fork is a tool used to eat, just as a book is read.", estimatedSeconds: 30, status: "published" },
  { id: "q2", subjectKey: "vr", topicKey: "codes", examBoard: "GL Assessment", difficulty: "hard", type: "multiple_choice", text: "If PEN = 16-5-14, what is INK?", options: ["9-14-11", "9-11-14", "8-14-11", "9-14-10"], correctAnswer: 0, explanation: "Each letter maps to its position in the alphabet.", estimatedSeconds: 45, status: "published" },
  { id: "q3", subjectKey: "vr", topicKey: "word-sequences", examBoard: "GL Assessment", difficulty: "medium", type: "multiple_choice", text: "Complete: one, two, four, eight, ___?", options: ["ten", "twelve", "sixteen", "fourteen"], correctAnswer: 2, explanation: "Each term doubles the previous one.", estimatedSeconds: 30, status: "published" },
  { id: "q4", subjectKey: "vr", topicKey: "analogies", examBoard: "GL Assessment", difficulty: "easy", type: "multiple_choice", text: "Bird is to Nest as Bee is to ___?", options: ["Sky", "Hive", "Flower", "Wing"], correctAnswer: 1, explanation: "A bee lives in a hive, as a bird lives in a nest.", estimatedSeconds: 25, status: "published" },
];

export const assessments: Assessment[] = [
  {
    id: "assess-1",
    title: "Verbal Reasoning Mock — Set 4",
    examBoard: "GL Assessment",
    ageGroup: "Year 5",
    durationMinutes: 20,
    subjectKeys: ["vr"],
    questionIds: ["q1", "q2", "q3", "q4"],
    difficultyMix: "Balanced",
    mode: "simulation",
    published: true,
  },
];

export const assessmentResults: AssessmentResult[] = [
  {
    id: "result-1",
    attemptId: "attempt-1",
    learnerId: "amara",
    assessmentTitle: "Verbal Reasoning Mock — Set 4",
    date: "2026-07-04",
    score: 78,
    prevScore: 65,
    percentile: 82,
    standardisedScore: 112,
    topicBreakdown: [
      { topic: "Analogies", score: 82 },
      { topic: "Codes", score: 70 },
      { topic: "Word Sequences", score: 80 },
    ],
  },
  {
    id: "result-2",
    attemptId: "attempt-2",
    learnerId: "kofi",
    assessmentTitle: "Maths Mock — Set 2",
    date: "2026-07-02",
    score: 58,
    prevScore: 50,
    percentile: 54,
    standardisedScore: 101,
    topicBreakdown: [
      { topic: "Number", score: 62 },
      { topic: "Shape & Space", score: 50 },
    ],
  },
];

export const revisionItems: RevisionItem[] = [
  { id: "rev-1", learnerId: "amara", subject: "Verbal Reasoning", topic: "Codes", reason: "Lowest topic score (70%) on the most recent mock.", priority: "high", recommendedActivity: "10-minute Codes drill + tutor session focus", dueDate: "2026-07-10", status: "in_progress" },
  { id: "rev-2", learnerId: "kofi", subject: "Maths", topic: "Shape & Space", reason: "Lowest topic score (50%) on the most recent mock.", priority: "high", recommendedActivity: "Shape & Space practice quiz", dueDate: "2026-07-09", status: "not_started" },
];

export const brainWarmups: BrainWarmup[] = [
  { id: "warm-1", learnerId: "amara", activityType: "Pattern Recognition", startedAt: "2026-07-05T08:55:00Z", completedAt: "2026-07-05T09:00:00Z", score: 90, moodBefore: "okay", moodAfter: "excited" },
];

export const moodCheckins: MoodCheckin[] = [
  { id: "mood-1", learnerId: "amara", mood: "excited", date: "2026-07-01" },
  { id: "mood-2", learnerId: "amara", mood: "happy", date: "2026-07-02" },
  { id: "mood-3", learnerId: "amara", mood: "okay", date: "2026-07-03" },
  { id: "mood-4", learnerId: "amara", mood: "happy", date: "2026-07-04" },
  { id: "mood-5", learnerId: "amara", mood: "excited", date: "2026-07-05" },
];

export const achievements: Achievement[] = [
  { id: "ach-1", name: "5-Day Streak", icon: "🔥", description: "Complete 5 days of warm-ups in a row.", category: "consistency" },
  { id: "ach-2", name: "Verbal Reasoning Ace", icon: "🧩", description: "Score 75%+ on a Verbal Reasoning mock.", category: "academic" },
  { id: "ach-3", name: "Brain Warm-Up Champion", icon: "⚡", description: "Complete 20 brain warm-ups.", category: "brain_training" },
  { id: "ach-4", name: "First Mock Exam", icon: "🎉", description: "Complete your very first mock exam.", category: "effort" },
  { id: "ach-5", name: "Craft Creator", icon: "🧵", description: "Complete your first vocational track session.", category: "craft" },
];

export const learnerAchievements: LearnerAchievement[] = [
  { learnerId: "amara", achievementId: "ach-1", awardedAt: "2026-07-03" },
  { learnerId: "amara", achievementId: "ach-2", awardedAt: "2026-06-28" },
  { learnerId: "amara", achievementId: "ach-3", awardedAt: "2026-06-20" },
  { learnerId: "kofi", achievementId: "ach-4", awardedAt: "2026-06-30" },
];

export const messageThreads: MessageThread[] = [
  {
    id: "thread-amara-reece",
    learnerId: "amara",
    participants: [
      { id: "u-tutor-1", name: "Ms. Reece", role: "tutor" },
      { id: "u-parent-1", name: "Ade Okafor", role: "parent" },
      { id: "amara", name: "Amara", role: "child" },
    ],
  },
];

export const messages: Message[] = [
  { id: "m1", threadId: "thread-amara-reece", senderId: "u-tutor-1", senderName: "Ms. Reece", senderRole: "tutor", content: "Hi Amara! Great work on today's Verbal Reasoning warm-up 🎉", timestamp: "2026-07-05T09:02:00Z", read: true },
  { id: "m2", threadId: "thread-amara-reece", senderId: "amara", senderName: "Amara", senderRole: "child", content: "Thank you Ms Reece! The codes ones were tricky", timestamp: "2026-07-05T09:03:00Z", read: true },
  { id: "m3", threadId: "thread-amara-reece", senderId: "u-tutor-1", senderName: "Ms. Reece", senderRole: "tutor", content: "Totally normal — we'll go through code strategies together on Thursday.", timestamp: "2026-07-05T09:04:00Z", read: true },
  { id: "m4", threadId: "thread-amara-reece", senderId: "u-parent-1", senderName: "Ade Okafor", senderRole: "parent", content: "Thanks Ms Reece, really appreciate the update.", timestamp: "2026-07-05T18:45:00Z", read: true },
  { id: "m5", threadId: "thread-amara-reece", senderId: "u-tutor-1", senderName: "Ms. Reece", senderRole: "tutor", content: "She's doing brilliantly. I've logged today's session notes on the dashboard for you.", timestamp: "2026-07-05T18:47:00Z", read: false },
];

export const lessonSessions: LessonSession[] = [
  { id: "sess-1", learnerId: "amara", tutorId: "u-tutor-1", subject: "Verbal Reasoning", scheduledAt: "2026-07-08T16:00:00Z", status: "upcoming" },
  { id: "sess-2", learnerId: "kofi", tutorId: "u-tutor-2", subject: "Maths", scheduledAt: "2026-07-09T17:00:00Z", status: "upcoming" },
  { id: "sess-3", learnerId: "amara", tutorId: "u-tutor-1", subject: "Verbal Reasoning", scheduledAt: "2026-07-01T16:00:00Z", status: "completed" },
];

export const lessonNotes: LessonNote[] = [
  {
    id: "note-1",
    sessionId: "sess-3",
    learnerId: "amara",
    tutorId: "u-tutor-1",
    subject: "Verbal Reasoning",
    topic: "Analogies & Codes",
    learningObjective: "Build speed and accuracy on analogy and code-based questions.",
    covered: "Worked through 20 analogy questions and introduced a 3-step strategy for codes.",
    strengths: "Very strong on analogies, spots patterns quickly.",
    weaknesses: "Codes strategy still needs consolidation — rushes the first step.",
    confidence: "high",
    homeworkAssigned: "10 codes questions using the 3-step strategy sheet.",
    parentSummary: "Amara had a strong session today — confident on analogies, and we're building her codes strategy step by step.",
    safeguardingConcern: false,
    createdAt: "2026-07-01T16:45:00Z",
  },
];

export const homework: Homework[] = [
  { id: "hw-1", learnerId: "amara", title: "Codes strategy sheet", subject: "Verbal Reasoning", assignedBy: "Ms. Reece", dueDate: "2026-07-08", status: "not_started" },
  { id: "hw-2", learnerId: "kofi", title: "Shape & Space practice", subject: "Maths", assignedBy: "Mr. Aldous", dueDate: "2026-07-09", status: "submitted" },
];

export const activities: Activity[] = [
  { id: "act-1", title: "Bag Making Craft Club", type: "craft_club", ageRange: "7-11", description: "Weekly supervised bag-making sessions building fine motor skill and patience.", startDate: "2026-07-14", endDate: "2026-09-01", location: "Trafford Community Hub", capacity: 12, safetyNotes: "DBS-checked craft supervisor, 1:6 adult ratio.", consentRequired: true, price: "£8/session", status: "open" },
  { id: "act-2", title: "Summer Camp — Week 1: Reasoning & Puzzles", type: "summer_camp", ageRange: "7-11", description: "Daily brain warm-ups and small-group mock exam practice.", startDate: "2026-07-27", endDate: "2026-07-31", location: "Trafford Grammar Prep", capacity: 30, safetyNotes: "Full DBS-checked staff, 1:8 ratio, daily sign-in/out.", consentRequired: true, price: "£120/week", status: "open" },
];

export const activityRegistrations: ActivityRegistration[] = [
  { id: "reg-1", activityId: "act-1", learnerId: "amara", consentStatus: "given", bookingStatus: "booked" },
  { id: "reg-2", activityId: "act-2", learnerId: "kofi", consentStatus: "pending", bookingStatus: "interested" },
];

export const safeguardingCases: SafeguardingCase[] = [
  {
    id: "case-1",
    title: "Message flagged for off-platform contact request",
    learnerId: "kofi",
    reportedBy: "Automated language monitoring",
    concernType: "Boundary-testing language",
    priority: "medium",
    description: "Automated monitoring flagged a message pattern for DSL review. No off-platform contact occurred.",
    status: "investigating",
    assignedTo: "Priya Shah",
    actionsTaken: "Reviewed full thread context; tutor contacted for clarification.",
    outcome: "",
    createdAt: "2026-07-03T10:00:00Z",
    updatedAt: "2026-07-04T09:00:00Z",
  },
];
