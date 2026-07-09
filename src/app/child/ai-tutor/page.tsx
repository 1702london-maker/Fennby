import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { getMyLearnerProfile } from "@/features/child/queries";
import { AiTutorClient } from "./AiTutorClient";

export default async function AiTutorPage() {
  const learner = await getMyLearnerProfile();
  if (!learner) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-10">
          <EmptyState emoji="🧒" title="No profile found" description="" />
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">AI Tutor</h1>
        <Card tint="teal" className="mb-6">
          <p className="text-sm text-charcoal-teal/85">
            A practice helper you can chat with any time — not a replacement for your real
            tutor, and every message here is visible to your parent, just like everything
            else on Fennby.
          </p>
        </Card>
        <AiTutorClient />
      </main>
    </PageShell>
  );
}
