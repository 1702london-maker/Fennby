"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ReadAloudButton } from "@/components/ReadAloudButton";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// The same question is re-served after a wrong answer instead of moving on
// — the options are reshuffled each time (the "dynamics") so it isn't a
// static repeat, but the underlying question and correct concept stay the
// same until the child actually gets it.
function buildShuffledOptions(q: Question) {
  const indexed = q.options.map((label, i) => ({ label, isCorrect: i === q.correctAnswer }));
  return shuffle(indexed);
}

export function PracticeQuizClient({ topicKey, questions }: { topicKey: string; questions: Question[] }) {
  void topicKey;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[index];
  // attempts is in the dependency array deliberately — it's how a retry
  // triggers a fresh reshuffle of the same question's options.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const shuffledOptions = useMemo(() => buildShuffledOptions(question), [question, attempts]);

  const isAnswered = selected !== null;
  const isCorrect = isAnswered && shuffledOptions[selected].isCorrect;

  const onSelect = (i: number) => {
    if (isAnswered) return;
    setSelected(i);
    if (shuffledOptions[i].isCorrect) setCorrectCount((c) => c + 1);
  };

  const onContinue = () => {
    if (!isCorrect) {
      // Wrong: re-serve the exact same question, reshuffled, until correct.
      setSelected(null);
      setAttempts((a) => a + 1);
      return;
    }
    // Right: move on to the next question, or finish.
    if (index + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setAttempts(0);
  };

  if (finished) {
    return (
      <Card tint="teal" className="text-center">
        <span className="text-4xl" aria-hidden>🎉</span>
        <h1 className="font-display font-bold text-2xl mt-3 mb-2">Nice work, all done!</h1>
        <p className="text-charcoal-teal/80 mb-6">
          You got every question right, {correctCount > questions.length ? "even the ones you retried" : ""} — that&apos;s the whole point of practice.
        </p>
        <Button href="/child/practice" variant="primary">Back to Practice</Button>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display font-bold text-2xl">Practice</h1>
        <span className="text-sm font-semibold text-charcoal-teal/60">
          Question {index + 1} of {questions.length}
        </span>
      </div>
      {attempts > 0 && !isCorrect && (
        <p className="text-sm font-semibold text-brick-600 mb-4">
          Same question, try {attempts + 1} — take another look and give it another go.
        </p>
      )}

      <Card>
        <div className="flex items-start justify-between gap-2 mb-4">
          <p className="font-display font-bold text-lg">{question.text}</p>
          <ReadAloudButton text={question.text} label="Read aloud" />
        </div>

        <div className="grid gap-3">
          {shuffledOptions.map((opt, i) => {
            const showState = isAnswered;
            const isPicked = selected === i;
            const isRightAnswer = opt.isCorrect;
            let style = "border-teal-100 hover:border-teal-700";
            if (showState && isRightAnswer) style = "border-sage-600 bg-sage-600/10";
            else if (showState && isPicked && !isRightAnswer) style = "border-brick-600 bg-coral-100";

            return (
              <button
                key={i}
                onClick={() => onSelect(i)}
                disabled={isAnswered}
                className={`text-left rounded-2xl border-2 px-4 py-3 min-h-[44px] font-semibold transition-colors ${style}`}
              >
                {opt.label}
                {showState && isRightAnswer && <span className="ml-2 text-sage-600">✓ Correct answer</span>}
                {showState && isPicked && !isRightAnswer && <span className="ml-2 text-brick-600">✗ Your answer</span>}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className={`mt-5 rounded-2xl p-4 ${isCorrect ? "bg-sage-600/10" : "bg-coral-100"}`}>
            <p className={`font-display font-bold mb-1 ${isCorrect ? "text-sage-600" : "text-brick-600"}`}>
              {isCorrect ? "Correct!" : "Not quite, here's why and how to solve it:"}
            </p>
            <p className="text-sm text-charcoal-teal/85 leading-relaxed">{question.explanation}</p>
          </div>
        )}

        {isAnswered && (
          <Button variant="primary" className="mt-5 w-full justify-center" onClick={onContinue}>
            {isCorrect ? (index + 1 >= questions.length ? "Finish" : "Next question") : "Try this question again"}
          </Button>
        )}
      </Card>
    </>
  );
}
