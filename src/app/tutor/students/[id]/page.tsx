import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { TopicHeatmap } from "@/components/TopicHeatmap";
import { RevisionItemCard } from "@/components/RevisionItemCard";
import {
  learners,
  assessmentResults,
  revisionItems,
  lessonNotes,
  messages,
  messageThreads,
} from "@/lib/seed-data";

export default function TutorStudentDetail({ params }: { params: { id: string } }) {
  const learner = learners.find((l) => l.id === params.id);
  if (!learner) notFound();

  const results = assessmentResults.filter((r) => r.learnerId === learner.id);
  const revision = revisionItems.filter((r) => r.learnerId === learner.id);
  const notes = lessonNotes.filter((n) => n.learnerId === learner.id);
  const thread = messageThreads.find((t) => t.learnerId === learner.id);
  const threadMessages = messages.filter((m) => m.threadId === thread?.id);

  const strengths = results[0]?.topicBreakdown.filter((t) => t.score >= 75).map((t) => t.topic) ?? [];
  const weaknesses = results[0]?.topicBreakdown.filter((t) => t.score < 75).map((t) => t.topic) ?? [];

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-4xl" aria-hidden>{learner.avatarEmoji}</span>
          <div>
            <h1 className="font-display font-bold text-3xl">{learner.preferredName}</h1>
            <p className="text-charcoal-teal/70">{learner.yearGroup} · {learner.targetExam}</p>
          </div>
        </div>

        <Card tint="teal" className="mb-6">
          <h2 className="font-display font-bold text-lg mb-2">AI lesson briefing (placeholder)</h2>
          <p className="text-sm text-charcoal-teal/80">
            {learner.preferredName} is strongest in {strengths.join(", ") || "several areas"} and would benefit from
            focused time on {weaknesses.join(", ") || "consolidation practice"} this session.
          </p>
        </Card>

        <section className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Assessment history</h2>
          {results.map((r) => (
            <Card key={r.id} className="mb-3">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold">{r.assessmentTitle}</p>
                <p className="text-sm font-bold text-teal-900">{r.score}%</p>
              </div>
              <TopicHeatmap topics={r.topicBreakdown} />
            </Card>
          ))}
        </section>

        <section className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Revision plan</h2>
          <div className="space-y-3">
            {revision.map((r) => (
              <RevisionItemCard key={r.id} item={r} />
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Previous lesson notes</h2>
          {notes.map((n) => (
            <Card key={n.id} className="mb-3">
              <p className="font-semibold">{n.topic}</p>
              <p className="text-sm text-charcoal-teal/80 mt-1">{n.covered}</p>
            </Card>
          ))}
        </section>

        <section className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Parent messages</h2>
          <Card>
            <p className="text-sm text-charcoal-teal/70">{threadMessages.length} messages in this thread — full history visible to the parent at all times.</p>
          </Card>
        </section>

        <Button variant="outline" className="border-brick-600 text-brick-600">
          🛡️ Raise a safeguarding note
        </Button>
      </main>
    </PageShell>
  );
}
