import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { getInterSchoolEvents } from "@/features/schools/eventActions";
import { EventRegisterButton } from "./EventRegisterButton";

const EVENT_ICON: Record<string, string> = {
  quiz: "🧠",
  debate: "🗣️",
  competition: "🏆",
  sports_fixture: "⚽",
};

export default async function SchoolNetworkPage() {
  const events = await getInterSchoolEvents();

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Inter-school network</h1>
        <p className="text-charcoal-teal/70 mb-8">
          Quizzes, debates, academic competitions, and sports fixtures between partner schools —
          anonymised, school-level leaderboards that make the whole network stronger.
        </p>
        {events.length ? (
          <div className="space-y-4">
            {events.map((e) => (
              <Card key={e.id} className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-display font-bold">
                    {EVENT_ICON[e.event_type] ?? "🎉"} {e.title}
                  </p>
                  <p className="text-sm text-charcoal-teal/70">
                    {e.event_type.replace("_", " ")} · {e.inter_school_event_registrations?.length ?? 0} schools registered
                  </p>
                  {e.description && <p className="text-sm text-charcoal-teal/80 mt-1">{e.description}</p>}
                </div>
                <EventRegisterButton eventId={e.id} disabled={e.status !== "open_for_registration"} />
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState emoji="🏆" title="No inter-school events yet" description="Quizzes, debates, competitions, and sports fixtures will appear here once announced." />
          </Card>
        )}
      </main>
    </PageShell>
  );
}
