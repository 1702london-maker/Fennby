"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { examQuestions } from "@/lib/mock-data";

export default function DigitalMock() {
  const router = useRouter();
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const answer = (choiceIndex: number) => {
    const next = [...answers, choiceIndex];
    setAnswers(next);
    if (qIndex + 1 < examQuestions.length) {
      setQIndex((i) => i + 1);
    } else {
      const score = Math.round(
        (next.filter((a, i) => a === examQuestions[i]?.answer).length / examQuestions.length) * 100
      );
      router.push(`/child/mock-exams/results?mode=digital&score=${score}`);
    }
  };

  const q = examQuestions[qIndex];

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold bg-teal-100 text-teal-900 px-3 py-1 rounded-full">
            {q.topic}
          </span>
          <span className="text-xs text-charcoal-teal/60 bg-mist-50 border border-teal-100 px-2 py-1 rounded-full">
            Shuffled order · attempt #4
          </span>
        </div>

        {/* Progress-through-paper indicator */}
        <div className="flex gap-1 mb-6" aria-hidden>
          {examQuestions.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${i <= qIndex ? "bg-coral-600" : "bg-teal-100"}`}
            />
          ))}
        </div>
        <p className="text-sm text-charcoal-teal/70 mb-4">
          Question {qIndex + 1} of {examQuestions.length}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={qIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
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
      </main>
    </PageShell>
  );
}
