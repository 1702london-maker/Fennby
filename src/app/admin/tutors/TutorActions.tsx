"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { setTutorApplicationStatus } from "@/features/admin/actions";
import type { Database } from "@/types/database";

type TutorStatus = Database["public"]["Enums"]["tutor_status"];

export function TutorActions({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const setStatus = (status: TutorStatus) => {
    startTransition(async () => {
      await setTutorApplicationStatus(applicationId, status);
      router.refresh();
    });
  };

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
