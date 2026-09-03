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
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    const SpeechRecognitionCtor =
      typeof window !== "undefined" ? window.SpeechRecognition ?? window.webkitSpeechRecognition : undefined;
    if (!SpeechRecognitionCtor) {
      const unsupportedTimer = setTimeout(() => setSupported(false), 0);
      return () => clearTimeout(unsupportedTimer);
    }
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-GB";
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) onResultRef.current(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      setError("Voice dictation could not start. Check microphone permission and try again.");
    };
    recognitionRef.current = recognition;
    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      try {
        recognition.abort();
      } catch {
        // Some browsers throw if recognition was never started.
      }
    };
  }, []);

  if (!supported) {
    return (
      <span className="text-xs text-charcoal-teal/50" title="Voice dictation isn't supported in this browser">
        🎙️ unavailable here
      </span>
    );
  }

  return (
    <>
    <button
      type="button"
      onClick={() => {
        if (listening) {
          recognitionRef.current?.stop();
          setListening(false);
        } else {
          try {
            setError(null);
            recognitionRef.current?.start();
            setListening(true);
          } catch {
            setListening(false);
            setError("Voice dictation could not start. Check microphone permission and try again.");
          }
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
    {error && <span className="text-xs font-semibold text-brick-600">{error}</span>}
    </>
  );
}
