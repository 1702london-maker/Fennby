import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";

export default function TutorEarningsPage() {
  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Earnings</h1>
        <Card>
          <EmptyState
            emoji="💷"
            title="Earnings tracking is coming soon"
            description="Once payments are switched on, your session earnings and payout history will appear here."
          />
        </Card>
      </main>
    </PageShell>
  );
}
