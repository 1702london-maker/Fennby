"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { createAssignment } from "@/features/schools/actions";

interface ClassOption {
  id: string;
  name: string;
}

const types = [
  { value: "homework", label: "Homework" },
  { value: "quiz", label: "Topic quiz" },
  { value: "mock", label: "Mock assessment" },
  { value: "reading", label: "Reading task" },
  { value: "revision", label: "Revision task" },
] as const;

export function AssignmentForm({ classes }: { classes: ClassOption[] }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<(typeof types)[number]["value"]>("homework");
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [dueDate, setDueDate] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!classId) {
      setError("No class available to assign to.");
      return;
    }
    const result = await createAssignment({ title, type, targetType: "class", targetId: classId, dueDate });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSaved(true);
    setTitle("");
  };

  return (
    <Card>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-semibold mb-1">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none">
            {types.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" placeholder="e.g. Codes practice sheet" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Assign to class</label>
          <select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none">
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Due date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none" />
        </div>
        {error && <p className="text-sm text-brick-600 font-semibold">{error}</p>}
        <Button type="submit" variant="primary" className="justify-center">Assign</Button>
        {saved && <p className="text-sm text-sage-600 font-semibold">Assigned successfully.</p>}
      </form>
    </Card>
  );
}
