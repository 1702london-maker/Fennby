import { PageShell } from "@/components/PageShell";
import { EmptyState } from "@/components/EmptyState";
import { getPublishedAssessment } from "@/features/assessments/queries";
import { PrintShadeClient } from "./PrintShadeClient";

export default async function PrintShadeFlow() {
  const data = await getPublishedAssessment();

  if (!data || !data.questions.length) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-10">
          <EmptyState emoji="📝" title="No mock exam available yet" description="Check back soon — new mocks are added regularly." />
        </main>
      </PageShell>
    );
  }

  return (
    <PrintShadeClient
      assessmentTitle={data.assessment.title}
      durationMinutes={data.assessment.duration_minutes}
      questions={data.questions.map((q, index) => ({
        id: q.id,
        number: index + 1,
        topic: q.topic_key ?? "General",
        text: q.text,
        options: q.options,
      }))}
    />
  );
}
