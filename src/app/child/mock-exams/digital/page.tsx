import { PageShell } from "@/components/PageShell";
import { EmptyState } from "@/components/EmptyState";
import { getPublishedAssessment } from "@/features/assessments/queries";
import { getMyLearnerProfile } from "@/features/child/queries";
import { DigitalMockClient } from "./DigitalMockClient";

export default async function DigitalMock() {
  const [data, learner] = await Promise.all([getPublishedAssessment(), getMyLearnerProfile()]);

  if (!data || !data.questions.length) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-10">
          <EmptyState emoji="📝" title="No mock exam available yet" description="Check back soon — new mocks are added regularly." />
        </main>
      </PageShell>
    );
  }

  const prefs = learner?.learning_preferences as {
    read_aloud_default?: boolean;
    chunked_content?: boolean;
    low_stimulation_mode?: boolean;
  } | null;

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <DigitalMockClient
          assessmentId={data.assessment.id}
          readAloudDefault={!!prefs?.read_aloud_default}
          chunkedContent={!!prefs?.chunked_content}
          lowStimulation={!!prefs?.low_stimulation_mode}
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
