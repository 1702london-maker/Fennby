import { PageShell } from "@/components/PageShell";
import { EmptyState } from "@/components/EmptyState";
import { getQuestionsForTopic } from "@/features/workshop/queries";
import { WorkshopPracticeClient } from "./WorkshopPracticeClient";

export default async function WorkshopPracticePage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; subject?: string }>;
}) {
  const { topic, subject } = await searchParams;

  if (!topic) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-10">
          <EmptyState emoji="📚" title="No topic selected" description="Go back to The Workshop and pick a topic." />
        </main>
      </PageShell>
    );
  }

  const questions = await getQuestionsForTopic(topic);

  if (!questions.length) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-10">
          <EmptyState emoji="📚" title="No practice questions here yet" description="Content for this topic is coming soon — check back shortly." />
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <WorkshopPracticeClient
          topicKey={topic}
          subjectKey={subject ?? null}
          questions={questions.map((q) => ({
            id: q.id,
            text: q.text,
            options: q.options,
            correctAnswer: q.correct_answer,
            explanation: q.explanation,
          }))}
        />
      </main>
    </PageShell>
  );
}
