import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { getMySchool, getClasses } from "@/features/schools/queries";

export default async function SchoolCohortsPage() {
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

  const classes = await getClasses(school.id);

  return (
    <PageShell>
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Cohorts</h1>
        {classes.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((c) => (
              <Card key={c.id}>
                <p className="font-display font-bold text-lg">{c.name}</p>
                <p className="text-sm text-charcoal-teal/70">{c.year_group} · {c.pupilCount} pupils</p>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState emoji="📚" title="No classes set up yet" description="Ask a Fennby admin to add your school's classes." />
          </Card>
        )}
      </main>
    </PageShell>
  );
}
