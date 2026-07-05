import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { getCase } from "@/features/safeguarding/queries";
import { CaseUpdateForm } from "./CaseUpdateForm";

export default async function SafeguardingCaseDetail({ params }: { params: { id: string } }) {
  const item = await getCase(params.id);
  if (!item) notFound();

  const fields: [string, string][] = [
    ["Learner", item.learners?.preferred_name ?? "Unknown"],
    ["Reported by", item.reported_by ?? "Unknown"],
    ["Concern type", item.concern_type ?? "—"],
    ["Priority", item.priority ?? "—"],
    ["Created", new Date(item.created_at).toLocaleString("en-GB")],
    ["Last updated", new Date(item.updated_at).toLocaleString("en-GB")],
  ];

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-2">{item.title}</h1>
        <p className="text-charcoal-teal/80 mb-6">{item.description}</p>
        <Card className="mb-6">
          <dl className="grid sm:grid-cols-2 gap-4 text-sm">
            {fields.map(([label, value]) => (
              <div key={label}>
                <dt className="text-charcoal-teal/60 text-xs">{label}</dt>
                <dd className="font-semibold capitalize">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <CaseUpdateForm
          caseId={item.id}
          initialStatus={item.status}
          initialActions={item.actions_taken ?? ""}
          initialOutcome={item.outcome ?? ""}
        />
      </main>
    </PageShell>
  );
}
