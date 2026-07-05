"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { markTrainingModuleComplete } from "@/features/tutors/actions";

interface Module {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
}

export function TrainingClient({ modules }: { modules: Module[] }) {
  const [state, setState] = useState(modules);
  const [pending, startTransition] = useTransition();

  const complete = (id: string) => {
    startTransition(async () => {
      await markTrainingModuleComplete(id);
      setState((s) => s.map((m) => (m.id === id ? { ...m, completed: true } : m)));
    });
  };

  return (
    <div className="space-y-4">
      {state.map((m, i) => (
        <Card key={m.id} className="flex gap-4 items-start">
          <span className="font-display font-bold text-2xl text-teal-900 w-8 shrink-0">{i + 1}</span>
          <div className="flex-1">
            <h2 className="font-display font-bold text-lg">{m.title}</h2>
            <p className="text-charcoal-teal/80 mt-1">{m.description}</p>
          </div>
          {m.completed ? (
            <span className="text-sm font-bold text-sage-600 whitespace-nowrap">✓ Completed</span>
          ) : (
            <Button variant="outline" className="px-4 py-2 text-sm" disabled={pending} onClick={() => complete(m.id)}>
              Mark complete
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
}
