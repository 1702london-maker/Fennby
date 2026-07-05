import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { lessonSessions, learners } from "@/lib/seed-data";

export default function TutorSchedulePage() {
  const upcoming = lessonSessions.filter((s) => s.status === "upcoming");
  const completed = lessonSessions.filter((s) => s.status === "completed");
  const cancelled = lessonSessions.filter((s) => s.status === "cancelled");

  const learnerName = (id: string) => learners.find((l) => l.id === id)?.preferredName ?? id;

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Schedule</h1>

        {[
          { title: "Upcoming", list: upcoming },
          { title: "Completed", list: completed },
          { title: "Cancelled", list: cancelled },
        ].map((group) => (
          <section key={group.title} className="mb-8">
            <h2 className="font-display font-bold text-lg mb-3">{group.title}</h2>
            {group.list.length ? (
              <div className="space-y-3">
                {group.list.map((s) => (
                  <Card key={s.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{s.subject} with {learnerName(s.learnerId)}</p>
                      <p className="text-sm text-charcoal-teal/70">
                        {new Date(s.scheduledAt).toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {group.title === "Upcoming" && <Button variant="outline" className="px-4 py-2 text-sm">Reschedule</Button>}
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-charcoal-teal/60">Nothing here yet.</p>
            )}
          </section>
        ))}
      </main>
    </PageShell>
  );
}
