import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { ProgressRing } from "@/components/ProgressRing";
import { getMyLearners, getExamHistory } from "@/features/parent/queries";

export default async function ParentExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ childId?: string }>;
}) {
  const { childId } = await searchParams;
  const learners = await getMyLearners();

  if (!learners.length) {
    return (
      <PageShell>
        <main className="max-w-4xl mx-auto px-6 py-10">
          <EmptyState emoji="👪" title="No children linked yet" description="" />
        </main>
      </PageShell>
    );
  }

  const child = learners.find((l) => l.id === childId) ?? learners[0];
  const history = await getExamHistory(child.id);

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="font-display font-bold text-3xl">Mock exam history</h1>
          <div className="flex gap-2">
            {learners.map((l) => (
              <a
                key={l.id}
                href={`/parent/exams?childId=${l.id}`}
                className={`px-4 py-2 rounded-full font-semibold min-h-[44px] flex items-center transition-colors ${
                  l.id === child.id ? "bg-teal-900 text-white" : "bg-teal-100 text-teal-900"
                }`}
              >
                {l.avatar_emoji} {l.preferred_name}
              </a>
            ))}
          </div>
        </div>

        {history.length === 0 ? (
          <Card tint="teal">
            <EmptyState emoji="📝" title="No mock exams completed yet" description={`Once ${child.preferred_name} completes a mock exam, results will appear here.`} />
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((e) => (
              <Card key={e.id}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-display font-bold text-lg">Mock exam</p>
                    <p className="text-sm text-charcoal-teal/70">{new Date(e.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <ProgressRing progress={e.score} size={72} color="teal" />
                </div>
                {e.topic_performance?.length ? (
                  <div className="grid sm:grid-cols-3 gap-3 mt-4">
                    {e.topic_performance.map((t) => (
                      <div key={t.id} className="bg-teal-100 rounded-2xl px-4 py-3 text-sm">
                        <p className="font-semibold">{t.topic_key}</p>
                        <p className="text-charcoal-teal/70">{t.score}%</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        )}
      </main>
    </PageShell>
  );
}
