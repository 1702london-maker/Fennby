"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { VoiceInputButton } from "@/components/VoiceInputButton";
import { submitLessonNote } from "@/features/tutors/actions";

interface SessionOption {
  id: string;
  learnerId: string;
  label: string;
}

export function LessonNoteClient({ sessions }: { sessions: SessionOption[] }) {
  const [sessionId, setSessionId] = useState(sessions[0]?.id ?? "");
  const [form, setForm] = useState({
    topic: "",
    learningObjective: "",
    covered: "",
    strengths: "",
    weaknesses: "",
    homeworkAssigned: "",
    parentSummary: "",
    safeguardingConcern: false,
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!sessions.length) {
    return (
      <Card>
        <p className="text-sm text-charcoal-teal/70">
          You don&apos;t have any sessions to log notes against yet.
        </p>
      </Card>
    );
  }

  const selectedLearnerId = sessions.find((s) => s.id === sessionId)?.learnerId;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLearnerId) return;
    setError(null);
    const result = await submitLessonNote({ sessionId, learnerId: selectedLearnerId, ...form });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSaved(true);
    setForm({
      topic: "",
      learningObjective: "",
      covered: "",
      strengths: "",
      weaknesses: "",
      homeworkAssigned: "",
      parentSummary: "",
      safeguardingConcern: false,
    });
  };

  return (
    <Card>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-semibold mb-1">Session</label>
          <select
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none"
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Topic</label>
          <input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Learning objective</label>
          <input value={form.learningObjective} onChange={(e) => setForm({ ...form, learningObjective: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-semibold">What was covered</label>
            <VoiceInputButton onResult={(text) => setForm((f) => ({ ...f, covered: f.covered ? `${f.covered} ${text}` : text }))} />
          </div>
          <textarea value={form.covered} onChange={(e) => setForm({ ...form, covered: e.target.value })} rows={3} className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Strengths</label>
            <textarea value={form.strengths} onChange={(e) => setForm({ ...form, strengths: e.target.value })} rows={2} className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Weaknesses</label>
            <textarea value={form.weaknesses} onChange={(e) => setForm({ ...form, weaknesses: e.target.value })} rows={2} className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Homework assigned</label>
          <input value={form.homeworkAssigned} onChange={(e) => setForm({ ...form, homeworkAssigned: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-semibold">Parent-facing summary</label>
            <VoiceInputButton onResult={(text) => setForm((f) => ({ ...f, parentSummary: f.parentSummary ? `${f.parentSummary} ${text}` : text }))} />
          </div>
          <textarea required value={form.parentSummary} onChange={(e) => setForm({ ...form, parentSummary: e.target.value })} rows={2} className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none" placeholder="Visible to the parent immediately." />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.safeguardingConcern} onChange={(e) => setForm({ ...form, safeguardingConcern: e.target.checked })} className="w-5 h-5 accent-brick-600" />
          <span className="text-sm font-semibold text-brick-600">Flag a safeguarding concern from this session</span>
        </label>
        {error && <p className="text-sm text-brick-600 font-semibold">{error}</p>}
        <Button type="submit" variant="primary" className="justify-center">Submit note</Button>
        {saved && <p className="text-sm text-sage-600 font-semibold">Saved — visible on the learner profile and to the parent immediately.</p>}
      </form>
    </Card>
  );
}
