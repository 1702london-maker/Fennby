"use client";

import { useEffect, useRef, useState } from "react";

// Uses the device/browser's native SpeechRecognition API — no added cost,
// works on most modern devices. Shows a clear fallback on unsupported
// browsers rather than a silently broken button. This is a universal
// convenience available on every free-text field, not a SEND-only feature.
export function VoiceInputButton({
  onResult,
  label = "Dictate",
}: {
  onResult: (text: string) => void;
  label?: string;
}) {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const SpeechRecognitionCtor =
      typeof window !== "undefined" ? window.SpeechRecognition ?? window.webkitSpeechRecognition : undefined;
    if (!SpeechRecognitionCtor) {
      setSupported(false);
      return;
    }
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-GB";
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) onResult(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
  }, [onResult]);

  if (!supported) {
    return (
      <span className="text-xs text-charcoal-teal/50" title="Voice dictation isn't supported in this browser">
        🎙️ unavailable here
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (listening) {
          recognitionRef.current?.stop();
          setListening(false);
        } else {
          recognitionRef.current?.start();
          setListening(true);
        }
      }}
      aria-pressed={listening}
      aria-label={listening ? "Stop dictation" : label}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 min-h-[36px] rounded-full transition-colors ${
        listening ? "bg-brick-600 text-white" : "bg-teal-100 text-teal-900 hover:bg-teal-100/70"
      }`}
    >
      <span aria-hidden>{listening ? "⏹️" : "🎙️"}</span>
      {listening ? "Listening…" : label}
    </button>
  );
}
