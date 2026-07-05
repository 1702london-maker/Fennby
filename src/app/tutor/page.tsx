"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { assignedChildren } from "@/lib/mock-data";

export default function TutorDashboard() {
  const [note, setNote] = useState("");
  const [savedFor, setSavedFor] = useState<string | null>(null);

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <p className="text-charcoal-teal/70">Welcome back</p>
        <h1 className="font-display font-bold text-3xl mb-8">Ms. Reece&apos;s workspace</h1>

        <section className="mb-10">
          <h2 className="font-display font-bold text-lg mb-4">Assigned children</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {assignedChildren.map((c) => (
              <Card key={c.id}>
                <p className="font-display font-bold">{c.name}</p>
                <p className="text-sm text-charcoal-teal/70">{c.yearGroup} · {c.subject}</p>
                <p className="text-xs text-charcoal-teal/60 mt-3">Next session</p>
                <p className="text-sm font-semibold">{c.nextSession}</p>
                <p className="text-xs text-charcoal-teal/60 mt-3">Last note</p>
                <p className="text-sm">{c.lastNote}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg mb-4">Log a session note</h2>
          <Card>
            <label htmlFor="tutor-note" className="block text-sm font-semibold mb-2">
              Notes are visible to the child&apos;s parent immediately.
            </label>
            <textarea
              id="tutor-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none"
              placeholder="e.g. Strong progress on analogies today, focus on codes next session."
            />
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => {
                setSavedFor(note);
                setNote("");
              }}
            >
              Save note
            </Button>
            {savedFor && (
              <p className="text-sm text-sage-600 font-semibold mt-3">
                Saved and shared with the parent.
              </p>
            )}
          </Card>
        </section>
      </main>
    </PageShell>
  );
}
