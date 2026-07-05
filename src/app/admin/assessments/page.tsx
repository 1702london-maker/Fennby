import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { assessments } from "@/lib/seed-data";

export default function AdminAssessmentsPage() {
  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-3xl">Assessments</h1>
          <Button variant="primary">Create assessment</Button>
        </div>
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
                {a.examBoard} · {a.ageGroup} · {a.durationMinutes} mins · {a.questionIds.length} questions · {a.mode}
              </p>
            </Card>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
