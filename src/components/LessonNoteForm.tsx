"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export function LessonNoteForm({ onSubmit }: { onSubmit?: (note: Record<string, string | boolean>) => void }) {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    topic: "",
    objective: "",
    covered: "",
    strengths: "",
    weaknesses: "",
    homework: "",
    parentSummary: "",
    safeguardingConcern: false,
  });

  return (
    <Card>
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(form);
          setSaved(true);
        }}
      >
        <div>
          <label htmlFor="ln-topic" className="block text-sm font-semibold mb-1">Topic</label>
          <input id="ln-topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="e.g. Codes strategy" />
        </div>
        <div>
          <label htmlFor="ln-objective" className="block text-sm font-semibold mb-1">Learning objective</label>
          <input id="ln-objective" value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
        </div>
        <div>
          <label htmlFor="ln-covered" className="block text-sm font-semibold mb-1">What was covered</label>
          <textarea id="ln-covered" value={form.covered} onChange={(e) => setForm({ ...form, covered: e.target.value })} rows={3} className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ln-strengths" className="block text-sm font-semibold mb-1">Strengths</label>
            <textarea id="ln-strengths" value={form.strengths} onChange={(e) => setForm({ ...form, strengths: e.target.value })} rows={2} className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none" />
          </div>
          <div>
            <label htmlFor="ln-weaknesses" className="block text-sm font-semibold mb-1">Weaknesses</label>
            <textarea id="ln-weaknesses" value={form.weaknesses} onChange={(e) => setForm({ ...form, weaknesses: e.target.value })} rows={2} className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none" />
          </div>
        </div>
        <div>
          <label htmlFor="ln-homework" className="block text-sm font-semibold mb-1">Homework assigned</label>
          <input id="ln-homework" value={form.homework} onChange={(e) => setForm({ ...form, homework: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
        </div>
        <div>
          <label htmlFor="ln-parent-summary" className="block text-sm font-semibold mb-1">Parent-facing summary</label>
          <textarea id="ln-parent-summary" value={form.parentSummary} onChange={(e) => setForm({ ...form, parentSummary: e.target.value })} rows={2} className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none" placeholder="Visible to the parent immediately." />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.safeguardingConcern}
            onChange={(e) => setForm({ ...form, safeguardingConcern: e.target.checked })}
            className="w-5 h-5 accent-brick-600"
          />
          <span className="text-sm font-semibold text-brick-600">Flag a safeguarding concern from this session</span>
        </label>
        <Button type="submit" variant="primary" className="justify-center">Submit note</Button>
        {saved && (
          <p className="text-sm text-sage-600 font-semibold">
            Saved — visible on the learner profile and to the parent immediately.
          </p>
        )}
      </form>
    </Card>
  );
}
