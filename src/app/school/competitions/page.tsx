import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";

export default function SchoolCompetitionsPage() {
  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Inter-school competitions</h1>
        <p className="text-charcoal-teal/70 mb-8">Friendly, anonymised, school-level competitions across the network.</p>
        <Card>
          <EmptyState
            emoji="🏆"
            title="No competitions scheduled yet"
            description="This launches in Phase 2 of the build — once live, upcoming inter-school competitions will appear here."
          />
        </Card>
      </main>
    </PageShell>
  );
}
