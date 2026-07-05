import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { getAllCases } from "@/features/safeguarding/queries";

export default async function SafeguardingCasesPage() {
  const cases = await getAllCases();

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Cases</h1>
        {cases.length ? (
          <div className="space-y-4">
            {cases.map((c) => (
              <Link key={c.id} href={`/safeguarding/cases/${c.id}`}>
                <Card className="hover:ring-2 hover:ring-teal-700 transition-shadow">
                  <p className="font-display font-bold">{c.title}</p>
                  <p className="text-sm text-charcoal-teal/70 mt-1">
                    Learner: {c.learners?.preferred_name ?? "Unknown"} · Priority: {c.priority} · Status: {c.status.replace("_", " ")}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState emoji="🛡️" title="No cases yet" description="Any concern reported across the platform will appear here." />
          </Card>
        )}
      </main>
    </PageShell>
  );
}
