import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { getMySchool, getPupilsForSchool } from "@/features/schools/queries";

export default async function SchoolPupilsPage() {
  const school = await getMySchool();
  if (!school) {
    return (
      <PageShell>
        <main className="max-w-5xl mx-auto px-6 py-10">
          <EmptyState emoji="🏫" title="No school account found" description="" />
        </main>
      </PageShell>
    );
  }

  const pupils = await getPupilsForSchool(school.id);

  return (
    <PageShell>
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Pupils</h1>
        <p className="text-charcoal-teal/70 mb-8">
          Educational data shown here is limited to what your school role is permitted to see.
        </p>
        {pupils.length ? (
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-charcoal-teal/60">
                  <th className="py-2 pr-4">Pupil</th>
                  <th className="py-2 pr-4">Year</th>
                  <th className="py-2">Latest score</th>
                </tr>
              </thead>
              <tbody>
                {pupils.map((p) => (
                  <tr key={p.learner.id} className="border-t border-teal-100">
                    <td className="py-2 pr-4 font-semibold">{p.learner.preferred_name}</td>
                    <td className="py-2 pr-4">{p.learner.year_group}</td>
                    <td className="py-2">{p.latestScore !== null ? `${p.latestScore}%` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : (
          <Card>
            <EmptyState emoji="🧑‍🎓" title="No enrolled pupils yet" description="Once families link their children to your school, they'll appear here." />
          </Card>
        )}
      </main>
    </PageShell>
  );
}
