import { PageShell } from "@/components/PageShell";
import { EmptyState } from "@/components/EmptyState";
import { getPublishedAssessment } from "@/features/assessments/queries";
import { DigitalMockClient } from "./DigitalMockClient";

export default async function DigitalMock() {
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
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <DigitalMockClient
          assessmentId={data.assessment.id}
          questions={data.questions.map((q) => ({
            id: q.id,
            topic: q.topic_key ?? "General",
            text: q.text,
            options: q.options,
          }))}
        />
      </main>
    </PageShell>
  );
}
