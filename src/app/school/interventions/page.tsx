import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { schoolClasses } from "@/lib/seed-data";

export default function SchoolInterventionsPage() {
  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Interventions</h1>
        <p className="text-charcoal-teal/70 mb-8">Active support plans for pupils who need extra attention.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {schoolClasses.map((c) => (
            <Card key={c.id}>
              <p className="font-display font-bold">{c.name} · {c.yearGroup}</p>
              <p className="text-sm text-charcoal-teal/70 mt-1">
                {c.interventionCount} active intervention{c.interventionCount === 1 ? "" : "s"} — focus area: {c.mainWeakTopic}
              </p>
            </Card>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
