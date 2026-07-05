import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { getAllLearners } from "@/features/admin/queries";

export default async function AdminLearnersPage() {
  const learners = await getAllLearners();

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Learners</h1>
        {learners.length ? (
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-charcoal-teal/60">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Year group</th>
                  <th className="py-2 pr-4">School</th>
                  <th className="py-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {learners.map((l) => (
                  <tr key={l.id} className="border-t border-teal-100">
                    <td className="py-2 pr-4 font-semibold">{l.preferred_name}</td>
                    <td className="py-2 pr-4">{l.year_group}</td>
                    <td className="py-2 pr-4">{l.current_school ?? "—"}</td>
                    <td className="py-2">{new Date(l.created_at).toLocaleDateString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        ) : (
          <Card>
            <EmptyState emoji="🧑‍🎓" title="No learners yet" description="Children added by parents will appear here." />
          </Card>
        )}
      </main>
    </PageShell>
  );
}
