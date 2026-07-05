import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { learners, assessmentResults } from "@/lib/seed-data";

export default function AdminLearnersPage() {
  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Learners</h1>
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-charcoal-teal/60">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Year group</th>
                <th className="py-2 pr-4">School</th>
                <th className="py-2">Latest score</th>
              </tr>
            </thead>
            <tbody>
              {learners.map((l) => {
                const latest = assessmentResults.find((r) => r.learnerId === l.id);
                return (
                  <tr key={l.id} className="border-t border-teal-100">
                    <td className="py-2 pr-4 font-semibold">{l.preferredName}</td>
                    <td className="py-2 pr-4">{l.yearGroup}</td>
                    <td className="py-2 pr-4">{l.currentSchool}</td>
                    <td className="py-2">{latest ? `${latest.score}%` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </main>
    </PageShell>
  );
}
