import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { getMyTutorProfile, getMyStudents } from "@/features/tutors/queries";

export default async function TutorStudentsPage() {
  const tutorProfile = await getMyTutorProfile();
  if (!tutorProfile || tutorProfile.status !== "approved") {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-16">
          <EmptyState emoji="🎓" title="Not available yet" description="This page unlocks once your tutor application is approved." />
        </main>
      </PageShell>
    );
  }

  const students = await getMyStudents(tutorProfile.id);

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">My students</h1>
        {students.length ? (
          <div className="grid md:grid-cols-2 gap-4">
            {students.map((s) => (
              <Card key={s.id}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl" aria-hidden>{s.avatar_emoji}</span>
                  <div>
                    <p className="font-display font-bold">{s.preferred_name}</p>
                    <p className="text-sm text-charcoal-teal/70">{s.year_group} · {s.current_school ?? "No school recorded"}</p>
                  </div>
                </div>
                <Button href={`/tutor/students/${s.id}`} variant="outline" className="mt-4">
                  Open learner profile
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState emoji="🧑‍🎓" title="No students assigned yet" description="Once you're matched with a family, they'll appear here." />
          </Card>
        )}
      </main>
    </PageShell>
  );
}
