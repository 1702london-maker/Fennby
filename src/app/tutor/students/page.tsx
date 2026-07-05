import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { learners, assessmentResults, lessonSessions, revisionItems } from "@/lib/seed-data";

export default function TutorStudentsPage() {
  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">My students</h1>
        <div className="grid md:grid-cols-2 gap-4">
          {learners.map((l) => {
            const latest = assessmentResults.find((r) => r.learnerId === l.id);
            const next = lessonSessions.find((s) => s.learnerId === l.id && s.status === "upcoming");
            const priority = revisionItems.find((r) => r.learnerId === l.id);
            return (
              <Card key={l.id}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl" aria-hidden>{l.avatarEmoji}</span>
                  <div>
                    <p className="font-display font-bold">{l.preferredName}</p>
                    <p className="text-sm text-charcoal-teal/70">{l.yearGroup} · {l.currentSchool}</p>
                  </div>
                </div>
                <p className="text-xs text-charcoal-teal/60 mt-3">Current priority</p>
                <p className="text-sm font-semibold">{priority?.topic ?? "None flagged"}</p>
                <p className="text-xs text-charcoal-teal/60 mt-3">Last score</p>
                <p className="text-sm font-semibold">{latest ? `${latest.score}%` : "—"}</p>
                <p className="text-xs text-charcoal-teal/60 mt-3">Next session</p>
                <p className="text-sm font-semibold">
                  {next ? new Date(next.scheduledAt).toLocaleDateString("en-GB", { day: "numeric", month: "long" }) : "—"}
                </p>
                <Button href={`/tutor/students/${l.id}`} variant="outline" className="mt-4">
                  Open learner profile
                </Button>
              </Card>
            );
          })}
        </div>
      </main>
    </PageShell>
  );
}
