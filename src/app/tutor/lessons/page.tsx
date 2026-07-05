import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { LessonNoteForm } from "@/components/LessonNoteForm";
import { lessonNotes, learners } from "@/lib/seed-data";

export default function TutorLessonsPage() {
  const learnerName = (id: string) => learners.find((l) => l.id === id)?.preferredName ?? id;

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Lesson notes</h1>

        <section className="mb-10">
          <h2 className="font-display font-bold text-lg mb-4">Log a new note</h2>
          <LessonNoteForm />
        </section>

        <section>
          <h2 className="font-display font-bold text-lg mb-4">Recent notes</h2>
          <div className="space-y-4">
            {lessonNotes.map((n) => (
              <Card key={n.id}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-display font-bold">{learnerName(n.learnerId)} · {n.subject}</p>
                  <p className="text-xs text-charcoal-teal/60">{new Date(n.createdAt).toLocaleDateString("en-GB")}</p>
                </div>
                <p className="text-sm text-charcoal-teal/80">{n.parentSummary}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
