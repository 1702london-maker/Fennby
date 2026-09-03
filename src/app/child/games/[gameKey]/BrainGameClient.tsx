"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

type Challenge = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export function BrainGameClient({ gameName, challenges }: { gameName: string; challenges: Challenge[] }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);
  const challenge = challenges[index];

  const choose = (choice: number) => {
    if (selected !== null) return;
    setSelected(choice);
    if (choice === challenge.answer) setScore((current) => current + 1);
  };

  const next = () => {
    if (index + 1 >= challenges.length) {
      setComplete(true);
      return;
    }
    setIndex((current) => current + 1);
    setSelected(null);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setComplete(false);
  };

  if (complete) {
    return (
      <Card tint="teal" className="text-center py-10">
        <p className="font-display font-bold text-2xl mb-2">{gameName} complete</p>
        <p className="text-charcoal-teal/80 mb-6">
          You scored {score} out of {challenges.length}.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="primary" onClick={restart}>Play again</Button>
          <Button href="/child/games" variant="outline">All games</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="text-xs font-bold text-charcoal-teal/60">
          QUESTION {index + 1} OF {challenges.length}
        </p>
        <p className="text-xs font-bold text-charcoal-teal/60">Score {score}</p>
      </div>
      <p className="font-display font-bold text-xl mb-6">{challenge.prompt}</p>
      <div className="grid gap-3">
        {challenge.options.map((option, optionIndex) => {
          const isPicked = selected === optionIndex;
          const isAnswer = challenge.answer === optionIndex;
          return (
            <button
              key={option}
              onClick={() => choose(optionIndex)}
              className={`text-left px-5 py-4 rounded-2xl font-semibold min-h-[44px] transition-colors ${
                selected === null
                  ? "bg-teal-100 hover:bg-teal-100/70"
                  : isAnswer
                    ? "bg-sage-100 text-sage-600"
                    : isPicked
                      ? "bg-coral-100 text-brick-600"
                      : "bg-teal-100 text-charcoal-teal/60"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="mt-5">
          <p className="text-sm text-charcoal-teal/80 mb-4">{challenge.explanation}</p>
          <Button variant="primary" onClick={next}>
            {index + 1 >= challenges.length ? "Finish" : "Next"}
          </Button>
        </div>
      )}
    </Card>
  );
}
