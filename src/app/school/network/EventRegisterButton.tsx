"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { registerSchoolForEvent } from "@/features/schools/eventActions";

export function EventRegisterButton({ eventId, disabled }: { eventId: string; disabled: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  if (state === "done") return <span className="text-sm font-semibold text-sage-600 shrink-0">✓ Registered</span>;

  return (
    <div className="shrink-0 text-right">
      <Button
        variant="outline"
        disabled={disabled || state === "loading"}
        onClick={async () => {
          setState("loading");
          const result = await registerSchoolForEvent(eventId);
          setState(result.ok ? "done" : "error");
        }}
      >
        {disabled ? "Not open yet" : state === "loading" ? "Registering…" : "Register school"}
      </Button>
      {state === "error" && <p className="text-xs text-brick-600 mt-1">Couldn&apos;t register — try again.</p>}
    </div>
  );
}
