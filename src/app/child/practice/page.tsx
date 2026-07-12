import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { RevisionItemCard } from "@/components/RevisionItemCard";
import { getMyLearnerProfile, getRevisionItemsForLearner, getSubjectsWithTopics } from "@/features/child/queries";

export default async function ChildPracticePage() {
  const learner = await getMyLearnerProfile();

  if (!learner) {
    return (
      <PageShell>
        <main className="max-w-4xl mx-auto px-6 py-10">
          <EmptyState emoji="🧒" title="No profile found" description="" />
        </main>
      </PageShell>
    );
  }

  const [revisionItems, { subjects, topics }] = await Promise.all([
    getRevisionItemsForLearner(learner.id),
    getSubjectsWithTopics(),
  ]);

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Practice</h1>
        <p className="text-charcoal-teal/70 mb-8">Short quizzes on the topics that will help you most.</p>

        {revisionItems.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display font-bold text-lg mb-4">Recommended for you</h2>
            <div className="space-y-4">
              {revisionItems.map((r) => (
                <RevisionItemCard
                  key={r.id}
                  item={{
                    id: r.id,
                    learnerId: r.learner_id,
                    subject: r.subject ?? "",
                    topic: r.topic ?? "",
                    reason: r.reason ?? "",
                    priority: (r.priority ?? "low") as "high" | "medium" | "low",
                    recommendedActivity: r.recommended_activity ?? "",
                    dueDate: r.due_date ?? "",
                    status: r.status as "not_started" | "in_progress" | "done",
                  }}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-display font-bold text-lg mb-4">All subjects</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {subjects.map((s) => {
              const subjectTopics = topics.filter((t) => t.subject_key === s.key);
              const firstTopic = subjectTopics[0];
              return (
                <Card key={s.key}>
                  <p className="font-display font-bold">{s.name}</p>
                  <div className="flex flex-wrap gap-2 mt-2 mb-4">
                    {subjectTopics.map((t) => (
                      <a
                        key={t.key}
                        href={`/child/practice/${t.key}`}
                        className="text-xs bg-teal-100 text-teal-900 px-3 py-1 rounded-full hover:bg-teal-900 hover:text-white transition-colors"
                      >
                        {t.name}
                      </a>
                    ))}
                  </div>
                  {firstTopic ? (
                    <Button href={`/child/practice/${firstTopic.key}`} variant="outline">Start a quick quiz</Button>
                  ) : (
                    <p className="text-xs text-charcoal-teal/50">More questions coming soon for this subject.</p>
                  )}
                </Card>
              );
            })}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
