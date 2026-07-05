import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { ProgressRing } from "@/components/ProgressRing";
import { getMySchool, getClasses, getPupilsForSchool } from "@/features/schools/queries";

export default async function SchoolDashboard() {
  const school = await getMySchool();

  if (!school) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-16">
          <EmptyState emoji="🏫" title="No school account found" description="Contact Fennby support if you believe this is an error." />
        </main>
      </PageShell>
    );
  }

  if (!school.approved) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-16">
          <Card tint="teal">
            <p className="font-display font-bold text-xl mb-2">Registration pending approval</p>
            <p className="text-charcoal-teal/80">
              {school.name} is registered but hasn&apos;t been approved for live access yet. A Fennby
              platform admin will review your registration shortly.
            </p>
          </Card>
        </main>
      </PageShell>
    );
  }

  const [classes, pupils] = await Promise.all([getClasses(school.id), getPupilsForSchool(school.id)]);
  const withScore = pupils.filter((p) => p.latestScore !== null);
  const avgProgress = withScore.length
    ? Math.round(withScore.reduce((a, p) => a + (p.latestScore ?? 0), 0) / withScore.length)
    : 0;

  return (
    <PageShell>
      <main className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-charcoal-teal/70">{school.local_authority ?? "—"}</p>
        <h1 className="font-display font-bold text-3xl mb-8">{school.name}</h1>

        <section className="grid sm:grid-cols-3 gap-4 mb-10">
          <Card tint="teal" className="flex items-center gap-4">
            <ProgressRing progress={100} size={64} strokeWidth={8} color="teal" showSpark={false} />
            <div>
              <p className="text-sm font-semibold text-charcoal-teal/70">Pupils</p>
              <p className="font-display font-bold text-3xl">{pupils.length}</p>
            </div>
          </Card>
          <Card tint="coral" className="flex items-center gap-4">
            <ProgressRing progress={avgProgress} size={64} strokeWidth={8} color="coral" />
            <div>
              <p className="text-sm font-semibold text-charcoal-teal/70">Average progress</p>
              <p className="font-display font-bold text-3xl">{avgProgress}%</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <ProgressRing progress={100} size={64} strokeWidth={8} color="plum" showSpark={false} />
            <div>
              <p className="text-sm font-semibold text-charcoal-teal/70">Classes</p>
              <p className="font-display font-bold text-3xl">{classes.length}</p>
            </div>
          </Card>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mb-10">
          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Classes</h2>
            {classes.length ? (
              <div className="space-y-3">
                {classes.map((c) => (
                  <div key={c.id} className="flex justify-between items-center text-sm">
                    <span className="font-semibold">{c.name} · {c.year_group}</span>
                    <span className="text-charcoal-teal/60">{c.pupilCount} pupils</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-charcoal-teal/70">No classes set up yet.</p>
            )}
            <Button href="/school/cohorts" variant="outline" className="mt-4">Manage cohorts</Button>
          </Card>
          <Card tint="teal">
            <h2 className="font-display font-bold text-lg mb-3">Pupil Premium impact report</h2>
            <p className="text-sm text-charcoal-teal/80 mb-4">
              Export a plain-language report linking Fennby usage to progress for your
              Pupil Premium and FSM-eligible pupils.
            </p>
            <Button href="/school/reports" variant="primary">View reports</Button>
          </Card>
        </section>
      </main>
    </PageShell>
  );
}
