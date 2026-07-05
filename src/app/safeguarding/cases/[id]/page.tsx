import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { safeguardingCases, learners } from "@/lib/seed-data";

export default function SafeguardingCaseDetail({ params }: { params: { id: string } }) {
  const item = safeguardingCases.find((c) => c.id === params.id);
  if (!item) notFound();
  const learner = learners.find((l) => l.id === item.learnerId);

  const fields: [string, string][] = [
    ["Learner", learner?.preferredName ?? item.learnerId],
    ["Reported by", item.reportedBy],
    ["Concern type", item.concernType],
    ["Priority", item.priority],
    ["Status", item.status.replace("_", " ")],
    ["Assigned to", item.assignedTo],
    ["Actions taken", item.actionsTaken || "None recorded yet"],
    ["Outcome", item.outcome || "Not yet resolved"],
    ["Created", new Date(item.createdAt).toLocaleString("en-GB")],
    ["Last updated", new Date(item.updatedAt).toLocaleString("en-GB")],
  ];

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-2">{item.title}</h1>
        <p className="text-charcoal-teal/80 mb-8">{item.description}</p>
        <Card>
          <dl className="grid sm:grid-cols-2 gap-4 text-sm">
            {fields.map(([label, value]) => (
              <div key={label}>
                <dt className="text-charcoal-teal/60 text-xs">{label}</dt>
                <dd className="font-semibold capitalize">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </main>
    </PageShell>
  );
}
