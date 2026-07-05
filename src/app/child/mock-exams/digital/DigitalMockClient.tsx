"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/Card";
import { submitAssessmentAttempt } from "@/features/assessments/actions";

interface ClientQuestion {
  id: string;
  topic: string;
  text: string;
  options: string[];
}

export function DigitalMockClient({ assessmentId, questions }: { assessmentId: string; questions: ClientQuestion[] }) {
  const router = useRouter();
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; choiceIndex: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const answer = async (choiceIndex: number) => {
    const next = [...answers, { questionId: questions[qIndex].id, choiceIndex }];
    setAnswers(next);
    if (qIndex + 1 < questions.length) {
      setQIndex((i) => i + 1);
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

  if (error) {
    return (
      <Card>
        <p className="text-brick-600 font-semibold">{error}</p>
      </Card>
    );
  }

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

      <AnimatePresence mode="wait">
        <motion.div key={qIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
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
    </>
  );
}
