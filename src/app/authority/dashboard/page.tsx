import { PageShell } from "@/components/PageShell";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/Card";
import { schoolClasses, schools } from "@/lib/seed-data";

export default function AuthorityDashboard() {
  const avgProgress = Math.round(schoolClasses.reduce((a, c) => a + c.averageProgress, 0) / schoolClasses.length);

  return (
    <PageShell>
      <main className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-charcoal-teal/70">Trafford Local Authority</p>
        <h1 className="font-display font-bold text-3xl mb-8">Regional dashboard</h1>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <StatCard label="Participating schools" value={schools.length} tint="teal" />
          <StatCard label="Average regional progress" value={`${avgProgress}%`} tint="coral" />
          <StatCard label="Cohorts reporting" value={schoolClasses.length} />
        </div>

        <Card tint="teal">
          <p className="text-sm text-charcoal-teal/80">
            All data shown to local authority viewers is anonymised and aggregated at school/cohort
            level — no individual pupil data is ever exposed at this level of access.
          </p>
        </Card>
      </main>
    </PageShell>
  );
}
