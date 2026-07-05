import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { RevisionItemCard } from "@/components/RevisionItemCard";
import { subjects, topics, revisionItems, learners } from "@/lib/seed-data";

const activeLearner = learners[0];

export default function ChildPracticePage() {
  const myRevision = revisionItems.filter((r) => r.learnerId === activeLearner.id);

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Practice</h1>
        <p className="text-charcoal-teal/70 mb-8">Short quizzes on the topics that will help you most.</p>

        <section className="mb-10">
          <h2 className="font-display font-bold text-lg mb-4">Recommended for you</h2>
          <div className="space-y-4">
            {myRevision.map((r) => (
              <RevisionItemCard key={r.id} item={r} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg mb-4">All subjects</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {subjects.map((s) => (
              <Card key={s.key}>
                <p className="font-display font-bold">{s.name}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {topics.filter((t) => t.subjectKey === s.key).map((t) => (
                    <span key={t.key} className="text-xs bg-teal-100 text-teal-900 px-3 py-1 rounded-full">
                      {t.name}
                    </span>
                  ))}
                </div>
                <Button variant="outline" className="mt-4">Start a quick quiz</Button>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
