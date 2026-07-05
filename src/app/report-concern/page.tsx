"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { reportConcern } from "@/features/safeguarding/actions";

export default function ReportConcernPage() {
  const [learnerId, setLearnerId] = useState("");
  const [concernType, setConcernType] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await reportConcern({ learnerId: learnerId || undefined, concernType, description });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <PageShell>
        <main className="max-w-xl mx-auto px-6 py-20 text-center">
          <Card tint="teal">
            <span className="text-5xl" aria-hidden>🛡️</span>
            <h1 className="font-display font-bold text-2xl mt-4 mb-2">Thank you for reporting this</h1>
            <p className="text-charcoal-teal/80">
              Our Designated Safeguarding Lead has been notified and will review this immediately.
            </p>
          </Card>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="max-w-xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-3xl mb-2">Report a concern</h1>
        <p className="text-charcoal-teal/70 mb-8">
          This goes directly to our Designated Safeguarding Lead. If a child is in immediate danger, contact
          emergency services first.
        </p>
        <Card>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-1">Child&apos;s learner ID</label>
              <input required value={learnerId} onChange={(e) => setLearnerId(e.target.value)} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="Found on the learner's profile page" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Type of concern</label>
              <input required value={concernType} onChange={(e) => setConcernType(e.target.value)} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="e.g. Message content, tutor conduct" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Description</label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none" />
            </div>
            {error && <p className="text-sm text-brick-600 font-semibold">{error}</p>}
            <Button type="submit" variant="primary" className="justify-center border-brick-600">Submit report</Button>
          </form>
        </Card>
      </main>
    </PageShell>
  );
}
