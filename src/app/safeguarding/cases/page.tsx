import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { safeguardingCases, learners } from "@/lib/seed-data";

export default function SafeguardingCasesPage() {
  const learnerName = (id: string) => learners.find((l) => l.id === id)?.preferredName ?? id;

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-3xl">Cases</h1>
          <Button variant="primary">New case</Button>
        </div>
        <div className="space-y-4">
          {safeguardingCases.map((c) => (
            <Link key={c.id} href={`/safeguarding/cases/${c.id}`}>
              <Card className="hover:ring-2 hover:ring-teal-700 transition-shadow">
                <p className="font-display font-bold">{c.title}</p>
                <p className="text-sm text-charcoal-teal/70 mt-1">
                  Learner: {learnerName(c.learnerId)} · Priority: {c.priority} · Status: {c.status.replace("_", " ")}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
