// A small, deliberately limited word→symbol lookup for simple instructions
// and messages. Not a full AAC (Augmentative and Alternative Communication)
// system — a first, honest pass covering common words in Fennby's own
// messages and instructions. Words not in the map are left as plain text.
const SYMBOLS: Record<string, string> = {
  hello: "👋", hi: "👋", thanks: "🙏", thank: "🙏",
  yes: "✅", no: "❌", ok: "👍", okay: "👍",
  good: "👍", great: "🌟", well: "🌟", done: "✅",
  today: "📅", tomorrow: "📅", time: "⏰",
  mock: "📝", exam: "📝", question: "❓", questions: "❓",
  score: "📊", topic: "📚", practice: "🎯",
  message: "💬", messages: "💬", session: "🎓", lesson: "🎓",
  help: "🆘", tutor: "🧑‍🏫", parent: "👪", teacher: "🧑‍🏫",
  break: "☕", rest: "☕", tired: "😴", happy: "😊", worried: "😟",
  start: "▶️", finish: "🏁", stop: "⏹️", next: "➡️",
};

export function toSymbolSupported(text: string): { word: string; symbol: string | null }[] {
  return text
    .split(/(\s+)/)
    .filter((w) => w.trim().length > 0)
    .map((word) => ({
      word,
      symbol: SYMBOLS[word.toLowerCase().replace(/[^a-z]/g, "")] ?? null,
    }));
}
