import { PageShell } from "@/components/PageShell";
import { SchoolCohortCard } from "@/components/SchoolCohortCard";
import { Card } from "@/components/Card";
import { schoolClasses, homework } from "@/lib/seed-data";

export default function TeacherDashboard() {
  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <p className="text-charcoal-teal/70">Mrs. Bello · Trafford Grammar Prep</p>
        <h1 className="font-display font-bold text-3xl mb-8">My classes</h1>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {schoolClasses.map((c) => (
            <SchoolCohortCard key={c.id} schoolClass={c} href="/school/pupils" />
          ))}
        </div>

        <section>
          <h2 className="font-display font-bold text-lg mb-4">Homework to review</h2>
          <div className="space-y-3">
            {homework.map((h) => (
              <Card key={h.id} className="flex items-center justify-between text-sm">
                <span className="font-semibold">{h.title} · {h.subject}</span>
                <span className="text-charcoal-teal/70 capitalize">{h.status}</span>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
