"use client";

import { useState } from "react";

// Uses the browser's native SpeechSynthesis API. Reading speed is
// user-adjustable via `rate`. Framed as a universal convenience — visible
// on every account, all the time — not a SEND-only feature.
export function ReadAloudButton({
  text,
  label = "Read this aloud",
  rate = 1,
}: {
  text: string;
  label?: string;
  rate?: number;
}) {
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  if (!supported) return null;

  const toggle = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    utterance.rate = rate;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={speaking}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 min-h-[36px] rounded-full transition-colors ${
        speaking ? "bg-brick-600 text-white" : "bg-teal-100 text-teal-900 hover:bg-teal-100/70"
      }`}
    >
      <span aria-hidden>{speaking ? "⏹️" : "🔊"}</span>
      {speaking ? "Stop reading" : label}
    </button>
  );
}
