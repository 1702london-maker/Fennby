import { SimplePage } from "@/components/SimplePage";
import { StatCard } from "@/components/StatCard";
import { getAllCases } from "@/features/safeguarding/queries";

export default async function SafeguardingReportsPage() {
  const cases = await getAllCases();
  const byPriority = ["urgent", "high", "medium", "low"] as const;

  return (
    <SimplePage eyebrow="Safeguarding" title="Reports" body="Aggregated safeguarding governance metrics — never individually identifying outside the case management view.">
      <div className="grid sm:grid-cols-4 gap-4">
        {byPriority.map((p) => (
          <StatCard key={p} label={`${p} priority`} value={cases.filter((c) => c.priority === p).length} />
        ))}
      </div>
    </SimplePage>
  );
}
