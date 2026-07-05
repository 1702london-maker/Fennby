"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/Card";
import { submitAssessmentAttempt } from "@/features/assessments/actions";

interface ClientQuestion {
  id: string;
  topic: string;
  text: string;
  options: string[];
}

const TOTAL_SECONDS = 20 * 60;

export function SimulationClient({ assessmentId, questions }: { assessmentId: string; questions: ClientQuestion[] }) {
  const router = useRouter();
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; choiceIndex: number }[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [error, setError] = useState<string | null>(null);

  const finish = async (finalAnswers: { questionId: string; choiceIndex: number }[]) => {
    if (!finalAnswers.length) return;
    const result = await submitAssessmentAttempt({ assessmentId, mode: "simulation", answers: finalAnswers });
    if (!result.ok) {
      if (result.error === "warmup_required") {
        router.push("/child/today");
        return;
      }
      setError(result.error);
      return;
    }
    router.push(`/child/mock-exams/results?mode=simulation&score=${result.data.score}`);
  };

  useEffect(() => {
    if (secondsLeft <= 0) {
      finish(answers);
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const answer = (choiceIndex: number) => {
    const next = [...answers, { questionId: questions[qIndex].id, choiceIndex }];
    setAnswers(next);
    if (qIndex + 1 < questions.length) {
      setQIndex((i) => i + 1);
    } else {
      finish(next);
    }
  };

  const q = questions[qIndex];
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  if (error) {
    return (
      <div className="min-h-screen bg-mist-50 flex items-center justify-center px-6">
        <Card><p className="text-brick-600 font-semibold">{error}</p></Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist-50 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-teal-100">
        <span className="text-sm font-semibold text-charcoal-teal/70">Full Exam Simulation</span>
        <span
          role="timer"
          aria-live="polite"
          className={`font-display font-bold text-lg px-4 py-1 rounded-full ${
            secondsLeft < 60 ? "bg-brick-600 text-white" : "bg-teal-100 text-teal-900"
          }`}
        >
          {mins}:{secs.toString().padStart(2, "0")}
        </span>
      </div>

      <main className="flex-1 max-w-2xl mx-auto px-6 py-10 w-full">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold bg-teal-100 text-teal-900 px-3 py-1 rounded-full">{q.topic}</span>
          <span className="text-sm text-charcoal-teal/70">Question {qIndex + 1} of {questions.length}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={qIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <p className="font-display font-bold text-xl mb-6">{q.text}</p>
              <div className="grid gap-3">
                {q.options.map((opt, i) => (
                  <button
                    key={opt}
                    onClick={() => answer(i)}
                    className="text-left px-5 py-4 rounded-2xl bg-teal-100 hover:bg-teal-100/70 font-semibold min-h-[44px] transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
        <p className="text-xs text-charcoal-teal/50 mt-6 text-center">
          There&apos;s no pause in exam simulation mode — just like the real thing.
        </p>
      </main>
    </div>
  );
}
