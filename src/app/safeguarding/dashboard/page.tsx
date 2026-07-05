import { PageShell } from "@/components/PageShell";
import { StatCard } from "@/components/StatCard";
import { SafeguardingAlertCard } from "@/components/SafeguardingAlertCard";
import { Button } from "@/components/Button";
import { safeguardingCases } from "@/lib/seed-data";

export default function SafeguardingDashboard() {
  const open = safeguardingCases.filter((c) => c.status !== "resolved");
  const urgent = safeguardingCases.filter((c) => c.priority === "urgent");
  const resolved = safeguardingCases.filter((c) => c.status === "resolved");

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-3xl">Safeguarding dashboard</h1>
          <Button variant="outline" className="border-brick-600 text-brick-600">Report a concern</Button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <StatCard label="Open cases" value={open.length} tint="coral" />
          <StatCard label="Urgent cases" value={urgent.length} />
          <StatCard label="Resolved cases" value={resolved.length} tint="teal" />
        </div>

        <section>
          <h2 className="font-display font-bold text-lg mb-4">Active cases</h2>
          <div className="space-y-4">
            {open.map((c) => (
              <SafeguardingAlertCard key={c.id} item={c} />
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
