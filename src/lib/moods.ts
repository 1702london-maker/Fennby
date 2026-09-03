export type Mood = "great" | "good" | "okay" | "low" | "tough";

export const moodOptions: { key: Mood; emoji: string; label: string }[] = [
  { key: "great", emoji: "🤩", label: "Great" },
  { key: "good", emoji: "🙂", label: "Good" },
  { key: "okay", emoji: "😐", label: "Okay" },
  { key: "low", emoji: "😕", label: "A bit low" },
  { key: "tough", emoji: "😣", label: "Tough day" },
];
