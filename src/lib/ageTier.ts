export type AgeTier = "7-9" | "10-11" | "12-16";

// Age is computed from the date of birth a parent set during registration
// — never a value the child (or anyone else) can override client-side.
export function getAgeFromDob(dateOfBirth: string | null | undefined): number | null {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

export function getAgeTier(dateOfBirth: string | null | undefined): AgeTier {
  const age = getAgeFromDob(dateOfBirth);
  if (age === null) return "10-11";
  if (age <= 9) return "7-9";
  if (age <= 11) return "10-11";
  return "12-16";
}

export const AGE_TIER_COPY: Record<AgeTier, { greeting: (name: string) => string; tone: string; badgeStyle: "playful" | "balanced" | "mature" }> = {
  "7-9": {
    greeting: (name) => `Ready to play and learn today, ${name}?`,
    tone: "playful",
    badgeStyle: "playful",
  },
  "10-11": {
    greeting: (name) => `Ready for today's challenge, ${name}?`,
    tone: "encouraging",
    badgeStyle: "balanced",
  },
  "12-16": {
    greeting: (name) => `Here's what's on your plate today, ${name}.`,
    tone: "direct",
    badgeStyle: "mature",
  },
};
