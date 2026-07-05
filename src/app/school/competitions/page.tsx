import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";

const competitions = [
  { id: "c1", name: "Trafford Reasoning Cup", schools: 6, status: "Registration open" },
  { id: "c2", name: "Greater Manchester Maths Challenge", schools: 12, status: "Upcoming" },
];

export default function SchoolCompetitionsPage() {
  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Inter-school competitions</h1>
        <p className="text-charcoal-teal/70 mb-8">Friendly, anonymised, school-level competitions across the network.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {competitions.map((c) => (
            <Card key={c.id} tint="teal">
              <p className="font-display font-bold">{c.name}</p>
              <p className="text-sm text-charcoal-teal/70 mt-1">{c.schools} schools taking part</p>
              <p className="text-xs text-charcoal-teal/60 mt-2">{c.status}</p>
            </Card>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
