import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { getAllSchools } from "@/features/admin/queries";
import { ApproveButton } from "./ApproveButton";

export default async function AdminSchoolsPage() {
  const schools = await getAllSchools();

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Schools</h1>
        {schools.length ? (
          <div className="space-y-4">
            {schools.map((s) => (
              <Card key={s.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display font-bold text-lg">{s.name}</p>
                    <p className="text-sm text-charcoal-teal/70">URN {s.urn ?? "—"} · {s.local_authority ?? "—"} · {s.pupil_count ?? 0} pupils</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${s.approved ? "bg-sage-600/15 text-sage-600" : "bg-coral-100 text-coral-600"}`}>
                    {s.approved ? "APPROVED" : "PENDING"}
                  </span>
                </div>
                {!s.approved && <ApproveButton schoolId={s.id} />}
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState emoji="🏫" title="No schools registered yet" description="Schools that register via /register/school will appear here." />
          </Card>
        )}
      </main>
    </PageShell>
  );
}
