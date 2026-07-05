import { PageShell } from "@/components/PageShell";
import { LearnerCard } from "@/components/LearnerCard";
import { Button } from "@/components/Button";
import { learners, assessmentResults, lessonSessions } from "@/lib/seed-data";

export default function ParentChildrenPage() {
  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-3xl">Children</h1>
          <Button variant="primary">Add a child</Button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {learners.map((l) => {
            const latest = [...assessmentResults].filter((r) => r.learnerId === l.id).sort((a, b) => (a.date < b.date ? 1 : -1))[0];
            const next = lessonSessions.find((s) => s.learnerId === l.id && s.status === "upcoming");
            return <LearnerCard key={l.id} learner={l} latestResult={latest} nextSession={next} href={`/parent/passport/${l.id}`} />;
          })}
        </div>
      </main>
    </PageShell>
  );
}
