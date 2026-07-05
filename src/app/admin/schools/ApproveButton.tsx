"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { approveSchool } from "@/features/admin/actions";

export function ApproveButton({ schoolId }: { schoolId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="primary"
      className="mt-4 px-4 py-2 text-sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await approveSchool(schoolId);
          router.refresh();
        })
      }
    >
      {pending ? "Approving…" : "Approve school"}
    </Button>
  );
}
