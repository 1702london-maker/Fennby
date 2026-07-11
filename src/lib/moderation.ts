// Deliberately blunt substring matching, not a smart classifier — for a
// safeguarding trigger we want false positives (over-flagging) rather than
// false negatives (a real incident slipping through unflagged).
const BLOCKED_WORDS = [
  "fuck", "shit", "bitch", "asshole", "bastard", "crap", "dick", "cunt",
  "piss", "wanker", "twat", "slut", "whore", "prick", "bollocks", "arse",
  "damn", "bloody hell", "retard", "faggot", "nigger", "nigga",
];

const LEET_MAP: Record<string, string> = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s" };

function normalize(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((ch) => LEET_MAP[ch] ?? ch)
    .join("")
    .replace(/[^a-z\s]/g, "");
}

export function containsProfanity(text: string): boolean {
  const normalized = normalize(text);
  return BLOCKED_WORDS.some((word) => normalized.includes(word));
}

// A distinct, higher-severity category — sexual content from a child on an
// educational AI companion is a safeguarding escalation, not just a manners
// issue, and is routed to an active alert rather than a passive log line.
const SEXUAL_CONTENT_WORDS = [
  "sex", "sexy", "porn", "nude", "naked", "boob", "vagina", "penis", "dick pic",
  "blowjob", "handjob", "masturbat", "orgasm", "horny", "fetish", "kink",
  "nsfw", "onlyfans", "hookup", "sext",
];

export function containsSexualContent(text: string): boolean {
  const normalized = normalize(text);
  return SEXUAL_CONTENT_WORDS.some((word) => normalized.includes(word.replace(/[^a-z\s]/g, "")));
}
