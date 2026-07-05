import { PageShell } from "@/components/PageShell";
import { StatCard } from "@/components/StatCard";
import { SafeguardingAlertCard } from "@/components/SafeguardingAlertCard";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { Card } from "@/components/Card";
import { getAllCases } from "@/features/safeguarding/queries";

export default async function SafeguardingDashboard() {
  const cases = await getAllCases();
  const open = cases.filter((c) => c.status !== "resolved");
  const urgent = cases.filter((c) => c.priority === "urgent");
  const resolved = cases.filter((c) => c.status === "resolved");

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-3xl">Safeguarding dashboard</h1>
          <Button href="/report-concern" variant="outline" className="border-brick-600 text-brick-600">Report a concern</Button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <StatCard label="Open cases" value={open.length} tint="coral" />
          <StatCard label="Urgent cases" value={urgent.length} />
          <StatCard label="Resolved cases" value={resolved.length} tint="teal" />
        </div>

        <section>
          <h2 className="font-display font-bold text-lg mb-4">Active cases</h2>
          {open.length ? (
            <div className="space-y-4">
              {open.map((c) => (
                <SafeguardingAlertCard
                  key={c.id}
                  item={{
                    id: c.id,
                    title: c.title,
                    learnerId: c.learner_id,
                    reportedBy: c.reported_by ?? "Unknown",
                    concernType: c.concern_type ?? "",
                    priority: (c.priority as "urgent" | "high" | "medium" | "low") ?? "medium",
                    description: c.description ?? "",
                    status: c.status as "open" | "investigating" | "resolved",
                    assignedTo: c.assigned_to ?? "Unassigned",
                    actionsTaken: c.actions_taken ?? "",
                    outcome: c.outcome ?? "",
                    createdAt: c.created_at,
                    updatedAt: c.updated_at,
                  }}
                />
              ))}
            </div>
          ) : (
            <Card>
              <EmptyState emoji="🛡️" title="No open cases" description="Any concern reported across the platform will appear here." />
            </Card>
          )}
        </section>
      </main>
    </PageShell>
  );
}
