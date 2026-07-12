import { SimplePage } from "@/components/SimplePage";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { getMySchool, getPupilsForSchool } from "@/features/schools/queries";

export default async function SchoolReportsPage() {
  const school = await getMySchool();
  if (!school) {
    return (
      <SimplePage eyebrow="For Schools" title="Pupil Premium impact reports" body="">
        <EmptyState emoji="🏫" title="No school linked yet" description="" />
      </SimplePage>
    );
  }

  const pupils = await getPupilsForSchool(school.id);
  const scored = pupils.filter((p) => p.latestScore !== null);
  const avgScore = scored.length ? Math.round(scored.reduce((sum, p) => sum + (p.latestScore ?? 0), 0) / scored.length) : null;

  return (
    <SimplePage
      eyebrow="For Schools"
      title="Pupil Premium impact reports"
      body="A plain-language link between Fennby usage and progress for your cohort — ready to use in your statutory Pupil Premium strategy statement."
    >
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Enrolled pupils" value={pupils.length} tint="teal" />
        <StatCard label="With a recorded mock score" value={scored.length} />
        <StatCard label="Average latest score" value={avgScore !== null ? `${avgScore}%` : "—"} />
      </div>

      {pupils.length ? (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-charcoal-teal/60">
                <th className="py-2 pr-4">Pupil</th>
                <th className="py-2 pr-4">Year group</th>
                <th className="py-2">Latest mock score</th>
              </tr>
            </thead>
            <tbody>
              {pupils.map((p) => (
                <tr key={p.learner.id} className="border-t border-teal-100">
                  <td className="py-2 pr-4 font-semibold">{p.learner.preferred_name}</td>
                  <td className="py-2 pr-4">{p.learner.year_group}</td>
                  <td className="py-2">{p.latestScore !== null ? `${p.latestScore}%` : "No mock taken yet"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <Card>
          <EmptyState emoji="🎓" title="No pupils enrolled yet" description="Link pupils from Cohorts to see progress data here." />
        </Card>
      )}
    </SimplePage>
  );
}
