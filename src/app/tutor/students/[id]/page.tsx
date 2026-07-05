import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { TopicHeatmap } from "@/components/TopicHeatmap";
import { RevisionItemCard } from "@/components/RevisionItemCard";
import { getMyTutorProfile, getStudentDetail } from "@/features/tutors/queries";

export default async function TutorStudentDetail({ params }: { params: { id: string } }) {
  const tutorProfile = await getMyTutorProfile();
  if (!tutorProfile) notFound();

  const detail = await getStudentDetail(tutorProfile.id, params.id);
  if (!detail) notFound();

  const { learner, results, revision, notes } = detail;
  const latestResult = results[0];

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-4xl" aria-hidden>{learner.avatar_emoji}</span>
          <div>
            <h1 className="font-display font-bold text-3xl">{learner.preferred_name}</h1>
            <p className="text-charcoal-teal/70">{learner.year_group} · {learner.target_exam ?? "No target exam set"}</p>
          </div>
        </div>

        <section className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Assessment history</h2>
          {results.length ? (
            results.map((r) => (
              <Card key={r.id} className="mb-3">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold">Mock result</p>
                  <p className="text-sm font-bold text-teal-900">{r.score}%</p>
                </div>
                {r.topic_performance?.length ? (
                  <TopicHeatmap topics={r.topic_performance.map((t) => ({ topic: t.topic_key ?? "Topic", score: t.score }))} />
                ) : (
                  <p className="text-sm text-charcoal-teal/60">No topic breakdown recorded.</p>
                )}
              </Card>
            ))
          ) : (
            <p className="text-sm text-charcoal-teal/70">No mock exams completed yet.</p>
          )}
        </section>

        <section className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Revision plan</h2>
          {revision.length ? (
            <div className="space-y-3">
              {revision.map((r) => (
                <RevisionItemCard
                  key={r.id}
                  item={{
                    id: r.id,
                    learnerId: r.learner_id,
                    subject: r.subject ?? "",
                    topic: r.topic ?? "",
                    reason: r.reason ?? "",
                    priority: (r.priority as "high" | "medium" | "low") ?? "medium",
                    recommendedActivity: r.recommended_activity ?? "",
                    dueDate: r.due_date ?? "",
                    status: r.status as "not_started" | "in_progress" | "done",
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-charcoal-teal/70">No revision items yet.</p>
          )}
        </section>

        <section className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Previous lesson notes</h2>
          {notes.length ? (
            notes.map((n) => (
              <Card key={n.id} className="mb-3">
                <p className="font-semibold">{n.topic ?? "Session"}</p>
                <p className="text-sm text-charcoal-teal/80 mt-1">{n.covered}</p>
              </Card>
            ))
          ) : (
            <p className="text-sm text-charcoal-teal/70">No lesson notes logged yet.</p>
          )}
        </section>

        {!latestResult && (
          <Card tint="teal">
            <p className="text-sm text-charcoal-teal/80">
              This learner hasn&apos;t completed a mock exam yet, so there&apos;s no AI-assisted lesson briefing to
              show. Once they do, strengths and focus areas will summarise here automatically.
            </p>
          </Card>
        )}
      </main>
    </PageShell>
  );
}
