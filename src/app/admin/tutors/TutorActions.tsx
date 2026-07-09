"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { setTutorApplicationStatus, verifyExaminerHistory } from "@/features/admin/actions";
import type { Database } from "@/types/database";

type TutorStatus = Database["public"]["Enums"]["tutor_status"];

export function TutorActions({
  applicationId,
  tutorProfileId,
  examinerClaim,
}: {
  applicationId: string;
  tutorProfileId?: string;
  examinerClaim?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const setStatus = (status: TutorStatus) => {
    startTransition(async () => {
      await setTutorApplicationStatus(applicationId, status);
      router.refresh();
    });
  };

  const verify = () => {
    if (!tutorProfileId || !examinerClaim) return;
    startTransition(async () => {
      // The claim text isn't structured board-by-board — an admin reads
      // it and confirms verification here rather than us guessing which
      // boards to mark verified from free text.
      await verifyExaminerHistory(tutorProfileId, [examinerClaim]);
      router.refresh();
    });
  };

  if (tutorProfileId && examinerClaim) {
    return (
      <div className="flex gap-2 mt-4">
        <Button variant="primary" className="px-4 py-2 text-sm" disabled={pending} onClick={verify}>
          Verify examiner history
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 mt-4">
      <Button variant="primary" className="px-4 py-2 text-sm" disabled={pending} onClick={() => setStatus("approved")}>
        Approve
      </Button>
      <Button variant="outline" className="px-4 py-2 text-sm" disabled={pending} onClick={() => setStatus("rejected")}>
        Reject
      </Button>
      <Button variant="ghost" className="px-4 py-2 text-sm" disabled={pending} onClick={() => setStatus("suspended")}>
        Suspend
      </Button>
    </div>
  );
}
