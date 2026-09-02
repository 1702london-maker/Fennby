"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import type { WarmupQuestion } from "@/features/child/queries";

export function BrainWarmupCard({
  questions,
  onComplete,
}: {
  questions: WarmupQuestion[];
  onComplete: (result: { score: number; total: number }) => void;
}) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  const answer = (choiceIndex: number) => {
    const nextScore = choiceIndex === questions[index].correctAnswer ? score + 1 : score;
    setScore(nextScore);
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
    } else {
      setDone(true);
      onComplete({ score: nextScore, total: questions.length });
    }
  };

  if (done) {
    return (
      <Card tint="coral" className="text-center py-8">
        <p className="text-4xl mb-2" aria-hidden>⚡</p>
        <p className="font-display font-bold text-lg">Your brain is warmed up!</p>
        <p className="text-sm text-charcoal-teal/70 mt-1">
          {score} of {questions.length} quick sparks landed.
        </p>
      </Card>
    );
  }

  const q = questions[index];
  return (
    <Card>
      <p className="text-xs font-semibold text-charcoal-teal/60 mb-2">
        Brain warm-up · {index + 1} of {questions.length} · {q.subjectKey.replace("-", " ")}
      </p>
      <p className="font-display font-bold text-lg mb-4">{q.question}</p>
      <div className="grid grid-cols-2 gap-2">
        {q.options.map((opt, choiceIndex) => (
          <Button key={opt} variant="outline" className="justify-center" onClick={() => answer(choiceIndex)}>
            {opt}
          </Button>
        ))}
      </div>
    </Card>
  );
}
