import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { getMyTutorProfile, getMySchedule, getMyRecentNotes } from "@/features/tutors/queries";
import { LessonNoteClient } from "./LessonNoteClient";

export default async function TutorLessonsPage() {
  const tutorProfile = await getMyTutorProfile();
  if (!tutorProfile) {
    return (
      <PageShell>
        <main className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-charcoal-teal/70">No tutor profile found.</p>
        </main>
      </PageShell>
    );
  }

  const [{ upcoming, completed }, notes] = await Promise.all([
    getMySchedule(tutorProfile.id),
    getMyRecentNotes(tutorProfile.id),
  ]);

  const sessionOptions = [...upcoming, ...completed].map((s) => ({
    id: s.id,
    learnerId: s.learner_id,
    label: `${s.learners?.preferred_name ?? "Learner"} — ${new Date(s.scheduled_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`,
  }));

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Lesson notes</h1>

        <section className="mb-10">
          <h2 className="font-display font-bold text-lg mb-4">Log a new note</h2>
          <LessonNoteClient sessions={sessionOptions} />
        </section>

        <section>
          <h2 className="font-display font-bold text-lg mb-4">Recent notes</h2>
          {notes.length ? (
            <div className="space-y-4">
              {notes.map((n) => (
                <Card key={n.id}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-display font-bold">{n.learners?.preferred_name ?? "Learner"} · {n.topic ?? "Session"}</p>
                    <p className="text-xs text-charcoal-teal/60">{new Date(n.created_at).toLocaleDateString("en-GB")}</p>
                  </div>
                  <p className="text-sm text-charcoal-teal/80">{n.parent_summary}</p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-charcoal-teal/70">No notes logged yet.</p>
          )}
        </section>
      </main>
    </PageShell>
  );
}
