"use client";

import { useEffect, useState } from "react";

const PHASES = [
  { label: "Breathe in…", scale: 1.4, duration: 4000 },
  { label: "Hold…", scale: 1.4, duration: 2000 },
  { label: "Breathe out…", scale: 0.8, duration: 4000 },
];

export function CalmBreathing() {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhaseIndex((i) => (i + 1) % PHASES.length);
    }, PHASES[phaseIndex].duration);
    return () => clearTimeout(timer);
  }, [phaseIndex]);

  const phase = PHASES[phaseIndex];

  return (
    <div className="flex flex-col items-center py-6">
      <div
        className="w-24 h-24 rounded-full bg-sage-600/40 border-2 border-sage-600 transition-transform ease-in-out"
        style={{ transform: `scale(${phase.scale})`, transitionDuration: `${phase.duration}ms` }}
        aria-hidden
      />
      <p className="font-display font-bold text-lg mt-6 text-charcoal-teal" aria-live="polite">
        {phase.label}
      </p>
    </div>
  );
}
