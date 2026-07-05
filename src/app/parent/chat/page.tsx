import { PageShell } from "@/components/PageShell";
import { EmptyState } from "@/components/EmptyState";
import { getMyLearners } from "@/features/parent/queries";
import { getOrCreateThreadForLearner, getMessages } from "@/features/messaging/queries";
import { ThreadClient } from "@/features/messaging/ThreadClient";
import { getSessionProfile } from "@/lib/auth/session";

export default async function ParentChat({
  searchParams,
}: {
  searchParams: Promise<{ childId?: string }>;
}) {
  const { childId } = await searchParams;
  const [session, learners] = await Promise.all([getSessionProfile(), getMyLearners()]);

  if (!learners.length) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-16">
          <EmptyState emoji="👪" title="No children linked yet" description="Add a child to start messaging their tutor." />
        </main>
      </PageShell>
    );
  }

  const child = learners.find((l) => l.id === childId) ?? learners[0];
  const thread = await getOrCreateThreadForLearner(child.id);
  const messages = await getMessages(thread.id);

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        {learners.length > 1 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {learners.map((l) => (
              <a
                key={l.id}
                href={`/parent/chat?childId=${l.id}`}
                className={`px-4 py-2 rounded-full font-semibold text-sm min-h-[36px] flex items-center ${
                  l.id === child.id ? "bg-teal-900 text-white" : "bg-teal-100 text-teal-900"
                }`}
              >
                {l.avatar_emoji} {l.preferred_name}
              </a>
            ))}
          </div>
        )}
        <h1 className="font-display font-bold text-3xl mb-1">{child.preferred_name}&apos;s messages</h1>
        <p className="text-charcoal-teal/70 mb-6">
          This thread includes {child.preferred_name}. Everything here is visible to you, in full, always.
        </p>
        <ThreadClient
          threadId={thread.id}
          currentSenderId={session!.id}
          initialMessages={messages.map((m) => ({
            id: m.id,
            senderId: m.sender_id,
            senderName: m.profiles?.full_name ?? "Unknown",
            senderRole: m.profiles?.role ?? "",
            content: m.content,
            timestamp: m.created_at,
          }))}
          placeholder="Message the tutor..."
        />
      </main>
    </PageShell>
  );
}
