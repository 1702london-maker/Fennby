import { SimplePage } from "@/components/SimplePage";
import { StatCard } from "@/components/StatCard";
import { safeguardingCases } from "@/lib/seed-data";

export default function SafeguardingReportsPage() {
  const byPriority = ["urgent", "high", "medium", "low"] as const;
  return (
    <SimplePage eyebrow="Safeguarding" title="Reports" body="Aggregated safeguarding governance metrics — never individually identifying outside the case management view.">
      <div className="grid sm:grid-cols-4 gap-4">
        {byPriority.map((p) => (
          <StatCard key={p} label={`${p} priority`} value={safeguardingCases.filter((c) => c.priority === p).length} />
        ))}
      </div>
    </SimplePage>
  );
}
