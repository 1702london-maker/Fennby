import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { getMySchool, getClasses, getPupilsForSchool, getHomeworkForSchool } from "@/features/schools/queries";

export default async function TeacherDashboard() {
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

  const [classes, pupils] = await Promise.all([getClasses(school.id), getPupilsForSchool(school.id)]);
  const homework = await getHomeworkForSchool(pupils.map((p) => p.learner.id));

  return (
    <PageShell>
      <main className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-charcoal-teal/70">{school.name}</p>
        <h1 className="font-display font-bold text-3xl mb-8">My classes</h1>

        {classes.length ? (
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {classes.map((c) => (
              <Link key={c.id} href="/school/pupils">
                <Card className="hover:ring-2 hover:ring-teal-700 transition-shadow">
                  <p className="font-display font-bold text-lg">{c.name}</p>
                  <p className="text-sm text-charcoal-teal/70">{c.year_group} · {c.pupilCount} pupils</p>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="mb-10">
            <EmptyState emoji="📚" title="No classes set up yet" description="Ask a Fennby admin to add your school's classes." />
          </Card>
        )}

        <section>
          <h2 className="font-display font-bold text-lg mb-4">Homework to review</h2>
          {homework.length ? (
            <div className="space-y-3">
              {homework.map((h) => (
                <Card key={h.id} className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{h.title} · {h.subject} — {h.learners?.preferred_name}</span>
                  <span className="text-charcoal-teal/70 capitalize">{h.status}</span>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-charcoal-teal/60">No homework assigned yet.</p>
          )}
        </section>
      </main>
    </PageShell>
  );
}
