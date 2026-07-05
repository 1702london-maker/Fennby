import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { getMyTutorProfile, getMyStudents, getMySchedule, getMyRecentNotes } from "@/features/tutors/queries";

export default async function TutorDashboard() {
  const tutorProfile = await getMyTutorProfile();

  if (!tutorProfile) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-16">
          <EmptyState emoji="🎓" title="No tutor profile found" description="Contact Fennby support if you believe this is an error." />
        </main>
      </PageShell>
    );
  }

  if (tutorProfile.status !== "approved") {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-16">
          <Card tint="teal">
            <p className="font-display font-bold text-xl mb-2">Application status: {tutorProfile.status.replace("_", " ")}</p>
            <p className="text-charcoal-teal/80">
              You&apos;ll get full access to students, scheduling, and messaging once your application is approved —
              this requires a completed enhanced DBS check, signed agreement, and safeguarding training.
            </p>
          </Card>
        </main>
      </PageShell>
    );
  }

  const [students, schedule, notes] = await Promise.all([
    getMyStudents(tutorProfile.id),
    getMySchedule(tutorProfile.id),
    getMyRecentNotes(tutorProfile.id),
  ]);

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <p className="text-charcoal-teal/70">Welcome back</p>
        <h1 className="font-display font-bold text-3xl mb-8">Your workspace</h1>

        <section className="grid sm:grid-cols-3 gap-4 mb-10">
          <Card tint="teal">
            <p className="text-sm font-semibold text-charcoal-teal/70">Students</p>
            <p className="font-display font-bold text-3xl mt-1">{students.length}</p>
          </Card>
          <Card tint="coral">
            <p className="text-sm font-semibold text-charcoal-teal/70">Upcoming sessions</p>
            <p className="font-display font-bold text-3xl mt-1">{schedule.upcoming.length}</p>
          </Card>
          <Card>
            <p className="text-sm font-semibold text-charcoal-teal/70">Notes logged</p>
            <p className="font-display font-bold text-3xl mt-1">{notes.length}</p>
          </Card>
        </section>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg">Your students</h2>
            <Link href="/tutor/students" className="text-sm font-semibold text-teal-900 hover:underline">View all →</Link>
          </div>
          {students.length ? (
            <div className="grid md:grid-cols-3 gap-4">
              {students.slice(0, 3).map((s) => (
                <Card key={s.id}>
                  <p className="font-display font-bold">{s.preferred_name}</p>
                  <p className="text-sm text-charcoal-teal/70">{s.year_group}</p>
                  <Button href={`/tutor/students/${s.id}`} variant="outline" className="mt-4 px-4 py-2 text-sm">
                    Open profile
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <EmptyState emoji="🧑‍🎓" title="No students assigned yet" description="Once you're matched with a family, they'll appear here." />
            </Card>
          )}
        </section>

        <section>
          <h2 className="font-display font-bold text-lg mb-4">Recent session notes</h2>
          {notes.length ? (
            <div className="space-y-3">
              {notes.map((n) => (
                <Card key={n.id}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold">{n.learners?.preferred_name ?? "Learner"} · {n.topic ?? "Session"}</p>
                    <p className="text-xs text-charcoal-teal/60">{new Date(n.created_at).toLocaleDateString("en-GB")}</p>
                  </div>
                  <p className="text-sm text-charcoal-teal/80">{n.parent_summary}</p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-charcoal-teal/70">No notes logged yet — visit a student profile to add one.</p>
          )}
        </section>
      </main>
    </PageShell>
  );
}
