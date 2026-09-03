"use client";

import { useEffect, useRef, useState } from "react";

// Uses the device/browser's native SpeechRecognition API — no added cost,
// works on most modern devices. Shows a clear fallback on unsupported
// browsers rather than a silently broken button. This is a universal
// convenience available on every free-text field, not a SEND-only feature.
export function VoiceInputButton({
  onResult,
  label = "Dictate",
  autoStart = false,
  continuous = false,
  interimResults = false,
  onListeningChange,
}: {
  onResult: (text: string) => void;
  label?: string;
  autoStart?: boolean;
  continuous?: boolean;
  interimResults?: boolean;
  onListeningChange?: (listening: boolean) => void;
}) {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onResultRef = useRef(onResult);
  const onListeningChangeRef = useRef(onListeningChange);

  useEffect(() => {
    onResultRef.current = onResult;
    onListeningChangeRef.current = onListeningChange;
  }, [onResult, onListeningChange]);

  useEffect(() => {
    const SpeechRecognitionCtor =
      typeof window !== "undefined" ? window.SpeechRecognition ?? window.webkitSpeechRecognition : undefined;
    if (!SpeechRecognitionCtor) {
      const unsupportedTimer = setTimeout(() => setSupported(false), 0);
      return () => clearTimeout(unsupportedTimer);
    }
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = "en-GB";
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .slice(event.resultIndex)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();
      if (transcript) onResultRef.current(transcript);
    };
    recognition.onend = () => {
      setListening(false);
      onListeningChangeRef.current?.(false);
      if (autoStart && continuous) {
        setTimeout(() => {
          try {
            recognition.start();
            setListening(true);
            onListeningChangeRef.current?.(true);
          } catch {
            setListening(false);
            onListeningChangeRef.current?.(false);
          }
        }, 350);
      }
    };
    recognition.onerror = () => {
      setListening(false);
      onListeningChangeRef.current?.(false);
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
  }, [autoStart, continuous, interimResults]);

  useEffect(() => {
    if (!autoStart || !recognitionRef.current) return;
    const startTimer = setTimeout(() => {
      try {
        setError(null);
        recognitionRef.current?.start();
        setListening(true);
        onListeningChangeRef.current?.(true);
      } catch {
        setListening(false);
        onListeningChangeRef.current?.(false);
      }
    }, 0);
    return () => clearTimeout(startTimer);
  }, [autoStart]);

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
            onListeningChangeRef.current?.(true);
          } catch {
            setListening(false);
            onListeningChangeRef.current?.(false);
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
