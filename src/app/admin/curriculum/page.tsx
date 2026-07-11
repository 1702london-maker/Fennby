import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { getAllCurricula } from "@/features/curricula/actions";
import { CurriculumReviewRow } from "./CurriculumReviewRow";

export default async function AdminCurriculumPage() {
  const curricula = await getAllCurricula();

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Curriculum standards review</h1>
        <p className="text-charcoal-teal/70 mb-8">
          Submitted → under review → approved / changes requested. Every submission moves
          through exactly this pipeline.
        </p>
        {curricula.length ? (
          <div className="space-y-4">
            {curricula.map((c) => (
              <Card key={c.id}>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div>
                    <p className="font-display font-bold">{c.title}</p>
                    <p className="text-sm text-charcoal-teal/70">
                      {c.subject_key} · by {c.tutor?.profiles?.full_name ?? "Tutor"}
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-teal-100 text-teal-900 px-3 py-1 rounded-full shrink-0">
                    {c.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-sm text-charcoal-teal/80 whitespace-pre-wrap mb-4">{c.content}</p>
                <CurriculumReviewRow curriculumId={c.id} currentStatus={c.status} />
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-charcoal-teal/60">No curriculum submitted yet.</p>
        )}
      </main>
    </PageShell>
  );
}
