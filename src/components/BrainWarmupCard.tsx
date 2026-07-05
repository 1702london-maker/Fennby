"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { brainTeasers } from "@/lib/mock-data";

export function BrainWarmupCard({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  const answer = () => {
    if (index + 1 < brainTeasers.length) {
      setIndex((i) => i + 1);
    } else {
      setDone(true);
      onComplete();
    }
  };

  if (done) {
    return (
      <Card tint="coral" className="text-center py-8">
        <p className="text-4xl mb-2" aria-hidden>⚡</p>
        <p className="font-display font-bold text-lg">Your brain is warmed up!</p>
      </Card>
    );
  }

  const q = brainTeasers[index];
  return (
    <Card>
      <p className="text-xs font-semibold text-charcoal-teal/60 mb-2">
        Brain warm-up · {index + 1} of {brainTeasers.length}
      </p>
      <p className="font-display font-bold text-lg mb-4">{q.question}</p>
      <div className="grid grid-cols-2 gap-2">
        {q.options.map((opt) => (
          <Button key={opt} variant="outline" className="justify-center" onClick={() => answer()}>
            {opt}
          </Button>
        ))}
      </div>
    </Card>
  );
}
