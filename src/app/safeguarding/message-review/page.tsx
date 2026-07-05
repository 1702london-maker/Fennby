import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { getFlaggedMessages } from "@/features/safeguarding/queries";

export default async function MessageReviewPage() {
  const messages = await getFlaggedMessages();

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Message review</h1>
        <p className="text-charcoal-teal/70 mb-8">
          Automated language monitoring flags concerning patterns here for DSL review — detection logic isn&apos;t published, in line with standard safeguarding practice.
        </p>
        {messages.length ? (
          <div className="space-y-3">
            {messages.map((m) => (
              <Card key={m.id} className="text-sm">
                <p className="font-semibold">{m.profiles?.full_name ?? "Unknown"} → thread for {m.message_threads?.learners?.preferred_name ?? "Unknown"}</p>
                <p className="text-charcoal-teal/80 mt-1">{m.content}</p>
                {m.flagged_reason && <p className="text-xs text-brick-600 mt-1">Flagged: {m.flagged_reason}</p>}
                <p className="text-xs text-charcoal-teal/50 mt-2">{new Date(m.created_at).toLocaleString("en-GB")}</p>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState emoji="✅" title="Nothing flagged" description="No messages have been flagged by automated monitoring." />
          </Card>
        )}
      </main>
    </PageShell>
  );
}
