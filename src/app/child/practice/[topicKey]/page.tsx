import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { getQuestionsForTopic } from "@/features/workshop/queries";
import { PracticeQuizClient } from "./PracticeQuizClient";

export default async function TopicPracticePage({ params }: { params: Promise<{ topicKey: string }> }) {
  const { topicKey } = await params;
  const questions = await getQuestionsForTopic(topicKey, 8);

  return (
    <PageShell>
      <main className="max-w-xl mx-auto px-6 py-10">
        {questions.length ? (
          <PracticeQuizClient
            topicKey={topicKey}
            questions={questions.map((q) => ({
              id: q.id,
              text: q.text,
              options: (q.options ?? []) as string[],
              correctAnswer: q.correct_answer ?? 0,
              explanation: q.explanation ?? "",
            }))}
          />
        ) : (
          <Card>
            <EmptyState emoji="🧠" title="No questions here yet" description="We're still adding practice questions for this topic — check back soon." />
          </Card>
        )}
      </main>
    </PageShell>
  );
}
