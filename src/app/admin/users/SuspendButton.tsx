"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { suspendUser } from "@/features/admin/actions";

export function SuspendButton({ userId, disabled }: { userId: string; disabled?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={disabled || pending}
      onClick={() =>
        startTransition(async () => {
          await suspendUser(userId);
          router.refresh();
        })
      }
      className="text-brick-600 font-semibold hover:underline disabled:opacity-40"
    >
      {disabled ? "Suspended" : pending ? "Suspending…" : "Suspend"}
    </button>
  );
}
