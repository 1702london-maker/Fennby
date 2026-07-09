import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ProgressRing } from "@/components/ProgressRing";
import { EmptyState } from "@/components/EmptyState";
import { getMyLearnerProfile, getLatestResultWithTopics } from "@/features/child/queries";

const modeLabels: Record<string, string> = {
  digital: "Digital Mock",
  "print-shade": "Print & Shade",
  simulation: "Full Exam Simulation",
};

export default async function ExamResults({
  searchParams,
}: {
  searchParams: Promise<{ score?: string; mode?: string }>;
}) {
  const { score: scoreParam, mode = "digital" } = await searchParams;
  const learner = await getMyLearnerProfile();

  if (!learner) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-16">
          <EmptyState emoji="🧒" title="No profile found" description="" />
        </main>
      </PageShell>
    );
  }

  const result = await getLatestResultWithTopics(learner.id);
  const score = result?.score ?? Number(scoreParam ?? 0);
  const topics = result?.topic_performance ?? [];
  const weakest = topics.length ? [...topics].sort((a, b) => a.score - b.score)[0] : null;
  const accommodations = result?.assessment_attempts?.accommodations_used as {
    extra_time_percent?: number;
    read_aloud?: boolean;
    dyslexia_font?: boolean;
    chunked_content?: boolean;
  } | null;

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <Card tint="coral" className="text-center py-10">
          <p className="text-6xl mb-4">🎉</p>
          <p className="font-display font-bold text-2xl">You did it!</p>
          <p className="text-sm text-charcoal-teal/60 mt-1">{modeLabels[mode] ?? "Mock Exam"}</p>
          {accommodations && (
            <p className="text-xs font-bold text-plum-700 bg-plum-700/10 inline-block px-3 py-1 rounded-full mt-3">
              Taken with accommodations
              {accommodations.extra_time_percent ? ` · +${accommodations.extra_time_percent}% time` : ""}
              {accommodations.read_aloud ? " · read-aloud" : ""}
            </p>
          )}
          <div className="flex justify-center mt-4">
            <ProgressRing progress={score} size={120} color="coral" />
          </div>
          <p className="text-charcoal-teal/70 mt-4">Your brain worked hard today. Nice one.</p>
        </Card>

        {topics.length > 0 && (
          <section className="mt-8">
            <h2 className="font-display font-bold text-lg mb-4">Topic-by-topic breakdown</h2>
            <div className="grid grid-cols-3 gap-4">
              {topics.map((t) => (
                <Card key={t.id} className="flex flex-col items-center gap-2">
                  <ProgressRing progress={t.score} size={72} color="teal" />
                  <span className="text-xs font-semibold text-center">{t.topic_key}</span>
                </Card>
              ))}
            </div>
          </section>
        )}

        {weakest && (
          <Card tint="teal" className="mt-8 text-center">
            <p className="font-display font-bold text-lg mb-2">What&apos;s next?</p>
            <p className="text-charcoal-teal/80 mb-4">{weakest.topic_key} looks like a good place to focus next time.</p>
            <Button href="/child/mock-exams" variant="primary">Practice again</Button>
          </Card>
        )}

        <div className="mt-6 text-center">
          <Button href="/child/today" variant="ghost">Back to my dashboard</Button>
        </div>
      </main>
    </PageShell>
  );
}
