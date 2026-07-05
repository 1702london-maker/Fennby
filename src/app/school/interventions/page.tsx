import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { getMySchool, getPupilsForSchool, getInterventionsForSchool } from "@/features/schools/queries";

export default async function SchoolInterventionsPage() {
  const school = await getMySchool();
  if (!school) {
    return (
      <PageShell>
        <main className="max-w-4xl mx-auto px-6 py-10">
          <EmptyState emoji="🏫" title="No school account found" description="" />
        </main>
      </PageShell>
    );
  }

  const pupils = await getPupilsForSchool(school.id);
  const interventions = await getInterventionsForSchool(pupils.map((p) => p.learner.id));

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Interventions</h1>
        <p className="text-charcoal-teal/70 mb-8">High-priority revision needs flagged across your pupils.</p>
        {interventions.length ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {interventions.map((i) => (
              <Card key={i.id}>
                <p className="font-display font-bold">{i.learners?.preferred_name}</p>
                <p className="text-sm text-charcoal-teal/70 mt-1">{i.subject} · {i.topic}</p>
                <p className="text-sm text-charcoal-teal/80 mt-2">{i.reason}</p>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState emoji="🎯" title="No active interventions" description="High-priority revision needs across your pupils will show up here." />
          </Card>
        )}
      </main>
    </PageShell>
  );
}
