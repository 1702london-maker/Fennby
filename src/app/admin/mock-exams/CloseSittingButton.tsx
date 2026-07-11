"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { closeSitting } from "@/features/mockExamSittings/adminActions";

export function CloseSittingButton({ sittingId }: { sittingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      variant="outline"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await closeSitting(sittingId);
        setLoading(false);
        router.refresh();
      }}
    >
      Close
    </Button>
  );
}
