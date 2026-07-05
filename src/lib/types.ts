// Type layer mirroring the eventual Supabase/Postgres schema.
// Local/mock-data only for now — this file is the contract the real DB will fulfil later.

export type Role =
  | "child"
  | "parent"
  | "tutor"
  | "school_admin"
  | "teacher"
  | "admin"
  | "safeguarding"
  | "authority";

export type TutorStatus =
  | "submitted"
  | "under_review"
  | "dbs_pending"
  | "contract_pending"
  | "training_pending"
  | "approved"
  | "rejected"
  | "suspended";

export type Mood = "happy" | "okay" | "tired" | "worried" | "excited" | "frustrated";

export interface Profile {
  id: string;
  role: Role;
  fullName: string;
  email: string;
}

export interface Learner {
  id: string;
  parentId: string;
  firstName: string;
  preferredName: string;
  dateOfBirth: string;
  yearGroup: string;
  currentSchool: string;
  targetExam: string;
  targetSchool: string;
  examBoard: string;
  learningGoals: string;
  sendNotes: string;
  accessibilityNeeds: string;
  avatarEmoji: string;
}

export interface TutorProfile {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  ageGroups: string[];
  experienceYears: number;
  qualifications: string;
  examBoards: string[];
  dbsStatus: "verified" | "pending" | "expired";
  status: TutorStatus;
  trainingCompleted: boolean;
  rating: number;
  reviewCount: number;
  bio: string;
}

export interface School {
  id: string;
  name: string;
  urn: string;
  localAuthority: string;
  address: string;
  schoolType: string;
  contactName: string;
  safeguardingLeadContact: string;
  dataProtectionContact: string;
  yearGroups: string[];
  pupilCount: number;
  approved: boolean;
}

export interface SchoolClass {
  id: string;
  schoolId: string;
  name: string;
  yearGroup: string;
  pupilIds: string[];
  averageProgress: number;
  homeworkCompletion: number;
  mainWeakTopic: string;
  interventionCount: number;
}

export interface Subject {
  key: string;
  name: string;
}

export interface Topic {
  key: string;
  subjectKey: string;
  name: string;
}

export interface Question {
  id: string;
  subjectKey: string;
  topicKey: string;
  examBoard: string;
  difficulty: "easy" | "medium" | "hard";
  type: "multiple_choice" | "short_answer" | "image";
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  estimatedSeconds: number;
  status: "draft" | "published";
}

export interface Assessment {
  id: string;
  title: string;
  examBoard: string;
  ageGroup: string;
  durationMinutes: number;
  subjectKeys: string[];
  questionIds: string[];
  difficultyMix: string;
  mode: "practice" | "timed" | "simulation" | "print_shade";
  published: boolean;
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  learnerId: string;
  mode: Assessment["mode"];
  startedAt: string;
  completedAt?: string;
  answers: { questionId: string; choiceIndex: number }[];
}

export interface AssessmentResult {
  id: string;
  attemptId: string;
  learnerId: string;
  assessmentTitle: string;
  date: string;
  score: number;
  prevScore?: number;
  percentile?: number;
  standardisedScore?: number;
  topicBreakdown: { topic: string; score: number }[];
}

export interface RevisionItem {
  id: string;
  learnerId: string;
  subject: string;
  topic: string;
  reason: string;
  priority: "high" | "medium" | "low";
  recommendedActivity: string;
  dueDate: string;
  status: "not_started" | "in_progress" | "done";
}

export interface BrainWarmup {
  id: string;
  learnerId: string;
  activityType: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  moodBefore?: Mood;
  moodAfter?: Mood;
}

export interface MoodCheckin {
  id: string;
  learnerId: string;
  mood: Mood;
  date: string;
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: "academic" | "effort" | "consistency" | "brain_training" | "craft" | "competition";
}

export interface LearnerAchievement {
  learnerId: string;
  achievementId: string;
  awardedAt: string;
}

export interface MessageThread {
  id: string;
  learnerId: string;
  participants: { id: string; name: string; role: Role }[];
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface LessonSession {
  id: string;
  learnerId: string;
  tutorId: string;
  subject: string;
  scheduledAt: string;
  status: "upcoming" | "completed" | "cancelled";
}

export interface LessonNote {
  id: string;
  sessionId: string;
  learnerId: string;
  tutorId: string;
  subject: string;
  topic: string;
  learningObjective: string;
  covered: string;
  strengths: string;
  weaknesses: string;
  confidence: "low" | "medium" | "high";
  homeworkAssigned: string;
  parentSummary: string;
  safeguardingConcern: boolean;
  createdAt: string;
}

export interface Homework {
  id: string;
  learnerId: string;
  title: string;
  subject: string;
  assignedBy: string;
  dueDate: string;
  status: "not_started" | "submitted" | "marked";
}

export interface Activity {
  id: string;
  title: string;
  type: "summer_camp" | "craft_club" | "vocational" | "competition";
  ageRange: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  safetyNotes: string;
  consentRequired: boolean;
  price: string;
  status: "open" | "full" | "closed";
}

export interface ActivityRegistration {
  id: string;
  activityId: string;
  learnerId: string;
  consentStatus: "pending" | "given";
  bookingStatus: "interested" | "booked";
}

export interface SafeguardingCase {
  id: string;
  title: string;
  learnerId: string;
  reportedBy: string;
  concernType: string;
  priority: "urgent" | "high" | "medium" | "low";
  description: string;
  status: "open" | "investigating" | "resolved";
  assignedTo: string;
  actionsTaken: string;
  outcome: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  entity: string;
  timestamp: string;
}
