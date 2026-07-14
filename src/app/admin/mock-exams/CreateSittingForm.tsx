"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { createSitting } from "@/features/mockExamSittings/adminActions";

export function CreateSittingForm() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", subjectKey: "", examBoard: "", sittingDate: "", price: "", capacity: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await createSitting({
      title: form.title,
      sittingDate: form.sittingDate,
      price: form.price,
      subjectKey: form.subjectKey || undefined,
      examBoard: form.examBoard || undefined,
      capacity: form.capacity || undefined,
    });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setForm({ title: "", subjectKey: "", examBoard: "", sittingDate: "", price: "", capacity: "" });
    router.refresh();
  };

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Title</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="11+ Verbal Reasoning Simulation" className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Subject (optional)</label>
          <input value={form.subjectKey} onChange={(e) => setForm({ ...form, subjectKey: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Exam board / test provider (optional)</label>
        <input value={form.examBoard} onChange={(e) => setForm({ ...form, examBoard: e.target.value })} placeholder="e.g. GL Assessment, FSCE, CEM" className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Sitting date &amp; time</label>
          <input required type="datetime-local" value={form.sittingDate} onChange={(e) => setForm({ ...form, sittingDate: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Price (£)</label>
          <input required type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Capacity (optional)</label>
          <input type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
        </div>
      </div>
      {error && <p className="text-sm text-brick-600 font-semibold">{error}</p>}
      <Button type="submit" variant="primary" className="justify-center" disabled={loading}>
        {loading ? "Creating…" : "Announce sitting"}
      </Button>
    </form>
  );
}
