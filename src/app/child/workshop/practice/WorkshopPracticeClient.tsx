"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { logReteach, startWorkshopSession, endWorkshopSession } from "@/features/workshop/actions";
import { submitAssessmentAttempt } from "@/features/assessments/actions";

interface ClientQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string | null;
}

const reteachApproaches = [
  { key: "worked_example" as const, label: "A worked example" },
  { key: "visual_approach" as const, label: "A visual approach" },
  { key: "different_analogy" as const, label: "A different analogy" },
  { key: "step_by_step" as const, label: "Step-by-step, slower" },
];

export function WorkshopPracticeClient({
  topicKey,
  questions,
}: {
  topicKey: string;
  subjectKey: string | null;
  questions: ClientQuestion[];
}) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showReteach, setShowReteach] = useState(false);
  const [approachIndex, setApproachIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; choiceIndex: number }[]>([]);
  const [wrapUpDone, setWrapUpDone] = useState<number | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  // Parent visibility (Part 4.4): every Workshop visit is tracked as a real
  // session, ended when the child leaves this page, not just implied by
  // reteach/wrap-up records.
  useEffect(() => {
    let active = true;
    startWorkshopSession({ topicKey }).then((r) => {
      if (active && r.ok) sessionIdRef.current = r.data.sessionId;
    });
    return () => {
      active = false;
      if (sessionIdRef.current) endWorkshopSession(sessionIdRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = questions[qIndex];
  const approach = reteachApproaches[approachIndex % reteachApproaches.length];

  const answer = (choiceIndex: number) => {
    setSelected(choiceIndex);
    if (choiceIndex !== q.correctAnswer) {
      setShowReteach(true);
      logReteach({ topicKey, questionId: q.id, approachUsed: approach.key });
    } else {
      next(choiceIndex);
    }
  };

  const next = (choiceIndex: number) => {
    setAnswers((a) => [...a, { questionId: q.id, choiceIndex }]);
    setSelected(null);
    setShowReteach(false);
    setApproachIndex((i) => i + 1);
    if (qIndex + 1 < questions.length) {
      setQIndex((i) => i + 1);
    } else {
      setQIndex(questions.length); // move to Wrap-Up screen
    }
  };

  const doWrapUp = async () => {
    const result = await submitAssessmentAttempt({
      mode: "practice",
      answers,
      sourceType: "wrap_up_workshop",
    });
    if (result.ok) setWrapUpDone(result.data.score);
  };

  if (qIndex >= questions.length) {
    return (
      <Card className="text-center py-12">
        <p className="text-5xl mb-4">✅</p>
        <p className="font-display font-bold text-xl mb-2">Nice work — topic practice complete</p>
        {wrapUpDone === null ? (
          <>
            <p className="text-charcoal-teal/70 mb-6 max-w-sm mx-auto">
              Want a quick 6-8 question Wrap-Up to check what stuck? It feeds straight into your
              parent&apos;s dashboard, same as everything else.
            </p>
            <Button variant="primary" onClick={doWrapUp}>Start Wrap-Up</Button>
          </>
        ) : (
          <p className="text-charcoal-teal/80">Wrap-Up complete — your progress has been updated.</p>
        )}
      </Card>
    );
  }

  return (
    <>
      <div className="flex gap-1 mb-6" aria-hidden>
        {questions.map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full ${i <= qIndex ? "bg-coral-600" : "bg-teal-100"}`} />
        ))}
      </div>
      <Card>
        <p className="font-display font-bold text-xl mb-6">{q.text}</p>
        <div className="grid gap-3">
          {q.options.map((opt, i) => (
            <button
              key={opt}
              onClick={() => answer(i)}
              disabled={selected !== null}
              className={`text-left px-5 py-4 rounded-2xl font-semibold min-h-[44px] transition-colors ${
                selected === i && i !== q.correctAnswer
                  ? "bg-brick-600/10 text-brick-600"
                  : "bg-teal-100 hover:bg-teal-100/70"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {showReteach && (
          <div className="mt-6 rounded-2xl bg-coral-100 p-5">
            <p className="text-xs font-bold text-coral-600 mb-2">LET&apos;S TRY IT {approach.label.toUpperCase()}</p>
            <p className="text-sm text-charcoal-teal/85 leading-relaxed mb-4">
              {q.explanation ?? "Here's another way to think about this one."}
            </p>
            <Button variant="primary" onClick={() => next(selected!)}>Got it — next question</Button>
          </div>
        )}
      </Card>
    </>
  );
}
