"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { createCradleSession } from "@/features/cradle/actions";

export function StartCradleButton({ lessonSessionId, sessionType }: { lessonSessionId: string; sessionType: "academic" | "vocational" }) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);

  const start = async () => {
    setStarting(true);
    const result = await createCradleSession({ lessonSessionId, sessionType, peerAnonymityEnabled: false });
    setStarting(false);
    if (result.ok) router.push(`/cradle/${result.data.sessionId}`);
  };

  return (
    <Button variant="primary" className="px-4 py-2 text-sm" disabled={starting} onClick={start}>
      {starting ? "Starting…" : "🎥 Start Cradle session"}
    </Button>
  );
}
