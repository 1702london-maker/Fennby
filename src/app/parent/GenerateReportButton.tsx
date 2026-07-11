"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { generateWeeklyReport } from "@/features/weeklyReports/actions";

export function GenerateReportButton({ learnerId }: { learnerId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <Button
        variant="outline"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          setError(null);
          const result = await generateWeeklyReport(learnerId);
          setLoading(false);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          router.refresh();
        }}
      >
        {loading ? "Generating…" : "Generate this week's report"}
      </Button>
      {error && <p className="text-xs text-brick-600 mt-1">{error}</p>}
    </div>
  );
}
