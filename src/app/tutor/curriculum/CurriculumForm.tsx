"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { submitCurriculum, type SubmitCurriculumInput } from "@/features/curricula/actions";

export function CurriculumForm() {
  const router = useRouter();
  const [form, setForm] = useState<SubmitCurriculumInput>({ subjectKey: "", title: "", content: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await submitCurriculum(form);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setForm({ subjectKey: "", title: "", content: "" });
    router.refresh();
  };

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Subject</label>
          <input required value={form.subjectKey} onChange={(e) => setForm({ ...form, subjectKey: e.target.value })} placeholder="e.g. maths" className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Title</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Curriculum content</label>
        <textarea required rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none" />
      </div>
      {error && <p className="text-sm text-brick-600 font-semibold">{error}</p>}
      <Button type="submit" variant="primary" className="justify-center" disabled={loading}>
        {loading ? "Submitting…" : "Submit for review"}
      </Button>
    </form>
  );
}
