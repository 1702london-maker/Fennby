"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { registerForSitting } from "@/features/mockExamSittings/actions";

export function SittingRegisterButton({ sittingId, learnerId }: { sittingId: string; learnerId: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  if (state === "done") return <span className="text-sm font-semibold text-sage-600 shrink-0">✓ Registered</span>;

  return (
    <div className="shrink-0 text-right">
      <Button
        variant="outline"
        disabled={state === "loading"}
        onClick={async () => {
          setState("loading");
          setError(null);
          const result = await registerForSitting({ sittingId, learnerId });
          if (!result.ok) {
            setState("error");
            setError(
              result.error === "billing_not_configured"
                ? "Registered — payment collection isn't switched on in this environment yet."
                : result.error
            );
            return;
          }
          if (result.data.checkoutUrl) {
            window.location.href = result.data.checkoutUrl;
            return;
          }
          setState("done");
        }}
      >
        {state === "loading" ? "Registering…" : "Register & pay"}
      </Button>
      {error && <p className="text-xs text-brick-600 mt-1 max-w-[180px]">{error}</p>}
    </div>
  );
}
