import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { schoolCohort } from "@/lib/mock-data";

export default function SchoolPupilsPage() {
  return (
    <PageShell>
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Pupils</h1>
        <p className="text-charcoal-teal/70 mb-8">
          Educational data shown here is limited to what your school role is permitted to see.
        </p>
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-charcoal-teal/60">
                <th className="py-2 pr-4">Pupil</th>
                <th className="py-2 pr-4">Year</th>
                <th className="py-2 pr-4">Pupil Premium</th>
                <th className="py-2">Progress</th>
              </tr>
            </thead>
            <tbody>
              {schoolCohort.map((p) => (
                <tr key={p.id} className="border-t border-teal-100">
                  <td className="py-2 pr-4 font-semibold">{p.label}</td>
                  <td className="py-2 pr-4">{p.yearGroup}</td>
                  <td className="py-2 pr-4">{p.pupilPremium ? "Yes" : "—"}</td>
                  <td className="py-2">{p.progress}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </PageShell>
  );
}
