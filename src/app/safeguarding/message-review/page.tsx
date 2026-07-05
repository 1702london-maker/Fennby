import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { messages, learners, messageThreads } from "@/lib/seed-data";

export default function MessageReviewPage() {
  const learnerName = (threadId: string) => {
    const thread = messageThreads.find((t) => t.id === threadId);
    return learners.find((l) => l.id === thread?.learnerId)?.preferredName ?? "Unknown";
  };

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Message review</h1>
        <p className="text-charcoal-teal/70 mb-8">
          Automated language monitoring flags concerning patterns here for DSL review — detection logic isn&apos;t published, in line with standard safeguarding practice.
        </p>
        <div className="space-y-3">
          {messages.map((m) => (
            <Card key={m.id} className="text-sm">
              <p className="font-semibold">{m.senderName} → thread for {learnerName(m.threadId)}</p>
              <p className="text-charcoal-teal/80 mt-1">{m.content}</p>
              <p className="text-xs text-charcoal-teal/50 mt-2">{new Date(m.timestamp).toLocaleString("en-GB")}</p>
            </Card>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
