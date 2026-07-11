import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { getMyCurricula } from "@/features/curricula/actions";
import { CurriculumForm } from "./CurriculumForm";

const STATUS_TINT: Record<string, string> = {
  submitted: "bg-teal-100 text-teal-900",
  under_review: "bg-plum-700/10 text-plum-700",
  approved: "bg-sage-600/15 text-sage-600",
  changes_requested: "bg-coral-100 text-brick-600",
};

export default async function TutorCurriculumPage() {
  const curricula = await getMyCurricula();

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Curriculum</h1>
        <p className="text-charcoal-teal/70 mb-8">
          Submit your own curriculum for a subject — a Fennby reviewer checks it against our
          standards before it&apos;s approved.
        </p>

        <Card className="mb-10">
          <CurriculumForm />
        </Card>

        <h2 className="font-display font-bold text-lg mb-4">Your submissions</h2>
        {curricula.length ? (
          <div className="space-y-3">
            {curricula.map((c) => (
              <Card key={c.id}>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <p className="font-semibold">{c.title}</p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${STATUS_TINT[c.status]}`}>
                    {c.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-sm text-charcoal-teal/70">{c.subject_key}</p>
                {c.reviewer_notes && (
                  <p className="text-sm text-charcoal-teal/80 mt-2 bg-mist-50 rounded-xl p-3">
                    Reviewer notes: {c.reviewer_notes}
                  </p>
                )}
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
