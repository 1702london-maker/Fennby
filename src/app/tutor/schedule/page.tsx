import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { getMyTutorProfile, getMySchedule } from "@/features/tutors/queries";
import { StartCradleButton } from "./StartCradleButton";

export default async function TutorSchedulePage() {
  const tutorProfile = await getMyTutorProfile();
  if (!tutorProfile) {
    return (
      <PageShell>
        <main className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-charcoal-teal/70">No tutor profile found.</p>
        </main>
      </PageShell>
    );
  }

  const { upcoming, completed, cancelled } = await getMySchedule(tutorProfile.id);

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Schedule</h1>

        {[
          { title: "Upcoming", list: upcoming, showCradle: true },
          { title: "Completed", list: completed, showCradle: false },
          { title: "Cancelled", list: cancelled, showCradle: false },
        ].map((group) => (
          <section key={group.title} className="mb-8">
            <h2 className="font-display font-bold text-lg mb-3">{group.title}</h2>
            {group.list.length ? (
              <div className="space-y-3">
                {group.list.map((s) => (
                  <Card key={s.id} className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="font-semibold">{s.subject ?? "Session"} with {s.learners?.preferred_name ?? "learner"}</p>
                      <p className="text-sm text-charcoal-teal/70">
                        {new Date(s.scheduled_at).toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {group.showCradle && <StartCradleButton lessonSessionId={s.id} sessionType="academic" />}
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
