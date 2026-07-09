import { Role } from "@/lib/types";

export interface NavLink {
  href: string;
  label: string;
}

export interface NavDropdown {
  label: string;
  items: NavLink[];
}

export const publicNavDropdowns: NavDropdown[] = [
  {
    label: "For Families",
    items: [
      { href: "/for-families", label: "For Families" },
      { href: "/child/mock-exams", label: "Mock Exams" },
      { href: "/parent", label: "Parent Dashboard" },
      { href: "/vocational", label: "Vocational & Craft Track" },
      { href: "/summer-camps", label: "Summer Camps" },
      { href: "/home-ed-eotas", label: "Home Ed & EOTAS" },
      { href: "/send-accessibility", label: "SEND & Accessibility" },
      { href: "/#how-it-works", label: "How it works" },
    ],
  },
  {
    label: "For Education Providers",
    items: [
      { href: "/for-schools", label: "For Education Providers" },
      { href: "/school", label: "School Dashboard Overview" },
      { href: "/school/reports", label: "Pupil Premium Impact Reports" },
      { href: "/school/network", label: "Inter-School Network & Competitions" },
      { href: "/school/demo", label: "Book a Demo" },
    ],
  },
  {
    label: "Tutors",
    items: [
      { href: "/for-tutors", label: "For Tutors" },
      { href: "/parent/tutors", label: "Browse Tutors" },
      { href: "/apply-tutor", label: "Apply to Tutor" },
      { href: "/tutor/training", label: "Tutor Training & Vetting" },
    ],
  },
];

export const publicTopLinks: NavLink[] = [
  { href: "/trust", label: "Trust & Safeguarding" },
  { href: "/for-local-authorities", label: "For Local Authorities" },
  { href: "/pricing", label: "Pricing" },
];

export const roleNav: Record<Role, NavLink[]> = {
  child: [
    { href: "/child/today", label: "Today" },
    { href: "/child/practice", label: "Practice" },
    { href: "/child/mock-exams", label: "Mock Exams" },
    { href: "/child/workshop", label: "The Workshop" },
    { href: "/child/ai-tutor", label: "AI Tutor" },
    { href: "/child/games", label: "Games" },
    { href: "/child/badges", label: "Badges" },
    { href: "/child/messages", label: "Messages" },
    { href: "/child/craft-club", label: "Craft Club" },
    { href: "/child/camps", label: "Camps" },
  ],
  parent: [
    { href: "/parent", label: "Dashboard" },
    { href: "/parent/children", label: "Children" },
    { href: "/parent/exams", label: "Mock Exams" },
    { href: "/parent/tutors", label: "Tutors" },
    { href: "/parent/chat", label: "Messages" },
    { href: "/parent/activities", label: "Activities" },
    { href: "/parent/billing", label: "Billing" },
    { href: "/parent/settings", label: "Settings" },
  ],
  tutor: [
    { href: "/tutor", label: "Dashboard" },
    { href: "/tutor/students", label: "Students" },
    { href: "/tutor/schedule", label: "Schedule" },
    { href: "/tutor/lessons", label: "Lessons" },
    { href: "/tutor/messages", label: "Messages" },
    { href: "/tutor/training", label: "Training" },
    { href: "/tutor/profile", label: "Profile" },
    { href: "/tutor/earnings", label: "Earnings" },
  ],
  school_admin: [
    { href: "/school", label: "Dashboard" },
    { href: "/school/cohorts", label: "Cohorts" },
    { href: "/school/pupils", label: "Pupils" },
    { href: "/school/assignments", label: "Assignments" },
    { href: "/school/reports", label: "Reports" },
    { href: "/school/interventions", label: "Interventions" },
    { href: "/school/competitions", label: "Competitions" },
    { href: "/school/settings", label: "Settings" },
  ],
  teacher: [
    { href: "/teacher/dashboard", label: "Dashboard" },
    { href: "/school/pupils", label: "Pupils" },
    { href: "/school/assignments", label: "Assignments" },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/learners", label: "Learners" },
    { href: "/admin/tutors", label: "Tutors" },
    { href: "/admin/schools", label: "Schools" },
    { href: "/admin/questions", label: "Questions" },
    { href: "/admin/assessments", label: "Assessments" },
    { href: "/admin/content", label: "Content" },
    { href: "/admin/safeguarding", label: "Safeguarding" },
    { href: "/admin/reports", label: "Reports" },
    { href: "/admin/settings", label: "Settings" },
  ],
  safeguarding: [
    { href: "/safeguarding/dashboard", label: "Dashboard" },
    { href: "/safeguarding/cases", label: "Cases" },
    { href: "/safeguarding/reports", label: "Reports" },
    { href: "/safeguarding/message-review", label: "Message Review" },
    { href: "/safeguarding/policies", label: "Policies" },
  ],
  authority: [
    { href: "/authority/dashboard", label: "Regional Dashboard" },
    { href: "/authority/impact", label: "Impact Reports" },
    { href: "/trust", label: "Safeguarding Framework" },
    { href: "/contact", label: "Contact" },
  ],
};

export const publicPathPrefixes = [
  "/trust",
  "/pricing",
  "/vocational",
  "/summer-camps",
  "/apply-tutor",
  "/for-families",
  "/for-schools",
  "/for-tutors",
  "/for-kids",
  "/register",
  "/login",
  "/book-demo",
  "/about",
  "/careers",
  "/blog",
  "/contact",
  "/legal",
  "/send-accessibility",
  "/home-ed-eotas",
  "/for-local-authorities",
];
