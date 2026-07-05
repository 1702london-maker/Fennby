"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/Card";
import { examQuestions } from "@/lib/mock-data";

const TOTAL_SECONDS = 20 * 60;

export default function FullSimulation() {
  const router = useRouter();
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);

  const finish = (finalAnswers: number[]) => {
    const score = Math.round(
      (finalAnswers.filter((a, i) => a === examQuestions[i]?.answer).length / examQuestions.length) * 100
    );
    router.push(`/child/mock-exams/results?mode=simulation&score=${score}`);
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
    const next = [...answers, choiceIndex];
    setAnswers(next);
    if (qIndex + 1 < examQuestions.length) {
      setQIndex((i) => i + 1);
    } else {
      finish(next);
    }
  };

  const q = examQuestions[qIndex];
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="min-h-screen bg-mist-50 flex flex-col">
      {/* Minimised, distraction-free header: timer only, no nav/footer */}
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
          <span className="text-sm font-semibold bg-teal-100 text-teal-900 px-3 py-1 rounded-full">
            {q.topic}
          </span>
          <span className="text-sm text-charcoal-teal/70">
            Question {qIndex + 1} of {examQuestions.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={qIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <p className="font-display font-bold text-xl mb-6">{q.question}</p>
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
