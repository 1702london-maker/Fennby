"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/Card";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import { submitAssessmentAttempt } from "@/features/assessments/actions";

interface ClientQuestion {
  id: string;
  topic: string;
  text: string;
  options: string[];
}

export function DigitalMockClient({
  assessmentId,
  questions,
  readAloudDefault = false,
  chunkedContent = false,
  lowStimulation = false,
}: {
  assessmentId: string;
  questions: ClientQuestion[];
  readAloudDefault?: boolean;
  chunkedContent?: boolean;
  lowStimulation?: boolean;
}) {
  const router = useRouter();
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; choiceIndex: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  // Chunked content: reveal answer options one at a time instead of all at
  // once, when a learner's preference asks for smaller pieces.
  const [revealedOptions, setRevealedOptions] = useState(1);

  const answer = async (choiceIndex: number) => {
    const next = [...answers, { questionId: questions[qIndex].id, choiceIndex }];
    setAnswers(next);
    if (qIndex + 1 < questions.length) {
      setQIndex((i) => i + 1);
      setRevealedOptions(1);
      return;
    }
    const result = await submitAssessmentAttempt({ assessmentId, mode: "practice", answers: next });
    if (!result.ok) {
      if (result.error === "warmup_required") {
        router.push("/child/today");
        return;
      }
      setError(result.error);
      return;
    }
    router.push(`/child/mock-exams/results?mode=digital&score=${result.data.score}`);
  };

  const q = questions[qIndex];

  // Universal convenience for every learner whose profile requests it —
  // not just triggered on click. Browsers require the tab to already have
  // had some interaction before speech will play; that's a browser
  // limitation, not something Fennby can bypass.
  useEffect(() => {
    if (!readAloudDefault || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(`${q.topic}. ${q.text}. Options: ${q.options.join(", ")}`);
    utterance.lang = "en-GB";
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex]);

  if (error) {
    return (
      <Card>
        <p className="text-brick-600 font-semibold">{error}</p>
      </Card>
    );
  }

  const visibleOptions = chunkedContent ? q.options.slice(0, revealedOptions) : q.options;

  const content = (
    <Card>
      <div className="flex items-start justify-between gap-4 mb-6">
        <p className="font-display font-bold text-xl">{q.text}</p>
        <ReadAloudButton text={`${q.topic}. ${q.text}. Options: ${q.options.join(", ")}`} label="Read aloud" />
      </div>
      <div className="grid gap-3">
        {visibleOptions.map((opt, i) => (
          <button
            key={opt}
            onClick={() => answer(i)}
            className="text-left px-5 py-4 rounded-2xl bg-teal-100 hover:bg-teal-100/70 font-semibold min-h-[44px] transition-colors"
          >
            {opt}
          </button>
        ))}
        {chunkedContent && revealedOptions < q.options.length && (
          <button
            onClick={() => setRevealedOptions((n) => n + 1)}
            className="text-left px-5 py-3 rounded-2xl border-2 border-dashed border-teal-100 text-teal-900 font-semibold text-sm"
          >
            Show next option ({q.options.length - revealedOptions} more)
          </button>
        )}
      </div>
    </Card>
  );

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold bg-teal-100 text-teal-900 px-3 py-1 rounded-full">{q.topic}</span>
      </div>
      <div className="flex gap-1 mb-6" aria-hidden>
        {questions.map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full ${i <= qIndex ? "bg-coral-600" : "bg-teal-100"}`} />
        ))}
      </div>
      <p className="text-sm text-charcoal-teal/70 mb-4">Question {qIndex + 1} of {questions.length}</p>

      {lowStimulation ? (
        content
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={qIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            {content}
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
