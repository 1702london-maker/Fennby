"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { markPrintShadeAttempt } from "@/features/assessments/adminActions";

export function MarkPrintShadeForm({ attemptId }: { attemptId: string }) {
  const [score, setScore] = useState("75");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  return (
    <form
      className="mt-4 grid gap-3 sm:grid-cols-[120px_1fr_auto] sm:items-end"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        setError(null);
        const result = await markPrintShadeAttempt({ attemptId, score, notes });
        setSaving(false);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setDone(true);
      }}
    >
      <label className="block">
        <span className="text-xs font-bold text-charcoal-teal/60">Score</span>
        <input
          value={score}
          onChange={(event) => setScore(event.target.value)}
          type="number"
          min="0"
          max="100"
          className="mt-1 w-full rounded-2xl border-2 border-teal-100 px-4 py-3 font-semibold outline-none focus:border-teal-700"
        />
      </label>
      <label className="block">
        <span className="text-xs font-bold text-charcoal-teal/60">Marking notes</span>
        <input
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="mt-1 w-full rounded-2xl border-2 border-teal-100 px-4 py-3 outline-none focus:border-teal-700"
          placeholder="Optional note for the record"
        />
      </label>
      <Button type="submit" variant="secondary" disabled={saving || done}>
        {done ? "Marked" : saving ? "Saving..." : "Publish score"}
      </Button>
      {error && <p className="sm:col-span-3 text-sm font-semibold text-brick-600">{error}</p>}
    </form>
  );
}
