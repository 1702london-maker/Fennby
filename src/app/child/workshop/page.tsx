import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { getMyLearnerProfile, getSubjectsWithTopics } from "@/features/child/queries";

export default async function WorkshopPage() {
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

  const { subjects, topics } = await getSubjectsWithTopics();

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">The Workshop</h1>
        <p className="text-charcoal-teal/70 mb-8">
          Build understanding of a specific topic between live sessions — videos, practice
          questions, and explanations that adapt if something doesn&apos;t click the first time.
        </p>

        <Card tint="coral" className="mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-display font-bold text-lg">Stuck on homework right now?</p>
              <p className="text-sm text-charcoal-teal/80">Photograph the question and get help — same way you upload a print-and-shade mock.</p>
            </div>
            <Button href="/child/workshop/homework-help" variant="primary">Get homework help</Button>
          </div>
        </Card>

        <div className="grid sm:grid-cols-2 gap-4">
          {subjects.map((s) => (
            <Card key={s.key}>
              <p className="font-display font-bold">{s.name}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {topics.filter((t) => t.subject_key === s.key).map((t) => (
                  <Link
                    key={t.key}
                    href={`/child/workshop/practice?topic=${t.key}&subject=${s.key}`}
                    className="text-xs bg-teal-100 text-teal-900 px-3 py-1 rounded-full hover:bg-teal-100/70"
                  >
                    {t.name}
                  </Link>
                ))}
                {!topics.some((t) => t.subject_key === s.key) && (
                  <span className="text-xs text-charcoal-teal/50">Content coming soon</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
