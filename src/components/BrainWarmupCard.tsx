"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import type { WarmupQuestion } from "@/features/child/queries";

type WarmupAnswer = {
  questionId: string;
  subjectKey: string;
  topicKey: string;
  choiceIndex: number;
  correctAnswer: number;
  isCorrect: boolean;
};

export function BrainWarmupCard({
  questions,
  onComplete,
}: {
  questions: WarmupQuestion[];
  onComplete: (result: { score: number; total: number; answers: WarmupAnswer[] }) => void;
}) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<WarmupAnswer[]>([]);

  const answer = (choiceIndex: number) => {
    const question = questions[index];
    const isCorrect = choiceIndex === question.correctAnswer;
    const nextAnswer = {
      questionId: question.id,
      subjectKey: question.subjectKey,
      topicKey: question.topicKey,
      choiceIndex,
      correctAnswer: question.correctAnswer,
      isCorrect,
    };
    const nextAnswers = [...answers, nextAnswer];
    const nextScore = isCorrect ? score + 1 : score;
    setScore(nextScore);
    setAnswers(nextAnswers);
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
    } else {
      setDone(true);
      onComplete({ score: nextScore, total: questions.length, answers: nextAnswers });
    }
  };

  if (!questions.length) {
    return (
      <Card tint="coral" className="text-center py-8">
        <p className="font-display font-bold text-lg">Warm-up is resting for a moment.</p>
        <p className="text-sm text-charcoal-teal/70 mt-1">Try again shortly.</p>
      </Card>
    );
  }

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
