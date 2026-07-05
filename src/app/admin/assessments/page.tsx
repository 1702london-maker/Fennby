import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { getAllAssessments } from "@/features/admin/queries";

export default async function AdminAssessmentsPage() {
  const assessments = await getAllAssessments();

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Assessments</h1>
        {assessments.length ? (
          <div className="space-y-4">
            {assessments.map((a) => (
              <Card key={a.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-display font-bold">{a.title}</p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${a.published ? "bg-sage-600/15 text-sage-600" : "bg-coral-100 text-coral-600"}`}>
                    {a.published ? "PUBLISHED" : "DRAFT"}
                  </span>
                </div>
                <p className="text-sm text-charcoal-teal/70 mt-1">
                  {a.exam_board ?? "—"} · {a.age_group ?? "—"} · {a.duration_minutes ?? "—"} mins · {a.mode ?? "—"}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState emoji="📝" title="No assessments configured yet" description="Assessments are authored directly against the database for now." />
          </Card>
        )}
      </main>
    </PageShell>
  );
}
