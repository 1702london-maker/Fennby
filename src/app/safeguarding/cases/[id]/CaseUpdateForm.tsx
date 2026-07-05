"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { updateCase } from "@/features/safeguarding/actions";

export function CaseUpdateForm({
  caseId,
  initialStatus,
  initialActions,
  initialOutcome,
}: {
  caseId: string;
  initialStatus: string;
  initialActions: string;
  initialOutcome: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [actionsTaken, setActionsTaken] = useState(initialActions);
  const [outcome, setOutcome] = useState(initialOutcome);
  const [saved, setSaved] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCase({
      caseId,
      status: status as "open" | "investigating" | "resolved",
      actionsTaken,
      outcome,
    });
    setSaved(true);
    router.refresh();
  };

  return (
    <Card>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-semibold mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-2xl border-2 border-teal-100 px-4 py-3 min-h-[44px] focus:border-teal-700 outline-none">
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Actions taken</label>
          <textarea value={actionsTaken} onChange={(e) => setActionsTaken(e.target.value)} rows={3} className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Outcome</label>
          <textarea value={outcome} onChange={(e) => setOutcome(e.target.value)} rows={2} className="w-full rounded-2xl border-2 border-teal-100 p-4 focus:border-teal-700 outline-none" />
        </div>
        <Button type="submit" variant="primary" className="justify-center">Save update</Button>
        {saved && <p className="text-sm text-sage-600 font-semibold">Saved — this update is captured in the audit log.</p>}
      </form>
    </Card>
  );
}
