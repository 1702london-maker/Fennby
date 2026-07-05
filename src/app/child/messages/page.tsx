import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { MessageThreadView } from "@/components/MessageThreadView";
import { messages, messageThreads, learners } from "@/lib/seed-data";

const activeLearner = learners[0];

export default function ChildMessagesPage() {
  const thread = messageThreads.find((t) => t.learnerId === activeLearner.id);
  const threadMessages = messages.filter((m) => m.threadId === thread?.id);

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">My messages</h1>
        <Card tint="teal" className="mb-6">
          <p className="text-sm text-charcoal-teal/80">
            Your parent or guardian can see messages connected to your learning.
          </p>
        </Card>
        {threadMessages.length ? (
          <Card>
            <MessageThreadView messages={threadMessages} currentSenderId={activeLearner.id} />
          </Card>
        ) : (
          <EmptyState emoji="💬" title="No messages yet" description="When your tutor sends a message, you'll see it here." />
        )}
      </main>
    </PageShell>
  );
}
