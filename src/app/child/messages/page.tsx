import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { getMyLearnerProfile } from "@/features/child/queries";
import { getThreadForLearner, getMessages } from "@/features/messaging/queries";
import { ThreadClient } from "@/features/messaging/ThreadClient";
import { getSessionProfile } from "@/lib/auth/session";

export default async function ChildMessagesPage() {
  const [session, learner] = await Promise.all([getSessionProfile(), getMyLearnerProfile()]);

  if (!learner) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-10">
          <EmptyState emoji="🧒" title="No profile found" description="" />
        </main>
      </PageShell>
    );
  }

  const thread = await getThreadForLearner(learner.id);

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">My messages</h1>
        <Card tint="teal" className="mb-6">
          <p className="text-sm text-charcoal-teal/80">
            Your parent or guardian can see messages connected to your learning.
          </p>
        </Card>
        {thread ? (
          <ThreadClientWrapper threadId={thread.id} currentSenderId={session!.id} />
        ) : (
          <EmptyState emoji="💬" title="No messages yet" description="When your tutor sends a message, you'll see it here." />
        )}
      </main>
    </PageShell>
  );
}

async function ThreadClientWrapper({ threadId, currentSenderId }: { threadId: string; currentSenderId: string }) {
  const messages = await getMessages(threadId);
  return (
    <ThreadClient
      threadId={threadId}
      currentSenderId={currentSenderId}
      initialMessages={messages.map((m) => ({
        id: m.id,
        senderId: m.sender_id,
        senderName: m.profiles?.full_name ?? "Unknown",
        senderRole: m.profiles?.role ?? "",
        content: m.content,
        timestamp: m.created_at,
      }))}
    />
  );
}
