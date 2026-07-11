"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { reviewCurriculum } from "@/features/curricula/actions";

export function CurriculumReviewRow({ curriculumId, currentStatus }: { curriculumId: string; currentStatus: string }) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const act = async (status: "under_review" | "approved" | "changes_requested") => {
    setLoading(true);
    await reviewCurriculum({ curriculumId, status, reviewerNotes: notes || undefined });
    setLoading(false);
    router.refresh();
  };

  if (currentStatus === "approved") return <p className="text-sm text-sage-600 font-semibold">✓ Approved</p>;

  return (
    <div className="flex flex-col gap-2">
      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Reviewer notes (optional)"
        className="w-full rounded-2xl border-2 border-teal-100 px-4 py-2 text-sm focus:border-teal-700 outline-none"
      />
      <div className="flex flex-wrap gap-2">
        {currentStatus === "submitted" && (
          <Button variant="outline" disabled={loading} onClick={() => act("under_review")}>Start review</Button>
        )}
        <Button variant="primary" disabled={loading} onClick={() => act("approved")}>Approve</Button>
        <Button variant="outline" className="border-brick-600 text-brick-600" disabled={loading} onClick={() => act("changes_requested")}>
          Request changes
        </Button>
      </div>
    </div>
  );
}
