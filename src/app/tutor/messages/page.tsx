import { PageShell } from "@/components/PageShell";
import { EmptyState } from "@/components/EmptyState";
import { getMyTutorProfile } from "@/features/tutors/queries";
import { getThreadsForTutor, getMessages } from "@/features/messaging/queries";
import { ThreadClient } from "@/features/messaging/ThreadClient";

export default async function TutorMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ threadId?: string }>;
}) {
  const { threadId: requestedThreadId } = await searchParams;
  const tutorProfile = await getMyTutorProfile();

  if (!tutorProfile) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-16">
          <EmptyState emoji="💬" title="No tutor profile found" description="" />
        </main>
      </PageShell>
    );
  }

  const threads = await getThreadsForTutor(tutorProfile.id);

  if (!threads.length) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-16">
          <EmptyState emoji="💬" title="No conversations yet" description="Once you're matched with a family, their message thread will appear here." />
        </main>
      </PageShell>
    );
  }

  const activeThread = threads.find((t) => t.id === requestedThreadId) ?? threads[0];
  const messages = await getMessages(activeThread.id);

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        {threads.length > 1 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {threads.map((t) => (
              <a
                key={t.id}
                href={`/tutor/messages?threadId=${t.id}`}
                className={`px-4 py-2 rounded-full font-semibold text-sm min-h-[36px] flex items-center ${
                  t.id === activeThread.id ? "bg-teal-900 text-white" : "bg-teal-100 text-teal-900"
                }`}
              >
                {t.learners?.avatar_emoji} {t.learners?.preferred_name}
              </a>
            ))}
          </div>
        )}
        <h1 className="font-display font-bold text-3xl mb-1">{activeThread.learners?.preferred_name}</h1>
        <p className="text-charcoal-teal/70 mb-6">
          This thread is fully visible to the parent, always.
        </p>
        <ThreadClient
          threadId={activeThread.id}
          currentSenderId={tutorProfile.id}
          initialMessages={messages.map((m) => ({
            id: m.id,
            senderId: m.sender_id,
            senderName: m.profiles?.full_name ?? "Unknown",
            senderRole: m.profiles?.role ?? "",
            content: m.content,
            timestamp: m.created_at,
          }))}
          placeholder="Message the family..."
        />
      </main>
    </PageShell>
  );
}
