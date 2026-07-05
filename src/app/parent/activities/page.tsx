import { PageShell } from "@/components/PageShell";
import { ActivityCard } from "@/components/ActivityCard";
import { activities, activityRegistrations, learners } from "@/lib/seed-data";

export default function ParentActivitiesPage() {
  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Activities</h1>
        <p className="text-charcoal-teal/70 mb-8">Summer camps, craft club, vocational workshops, and competitions.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {activities.map((a) => {
            const reg = activityRegistrations.find((r) => r.activityId === a.id);
            const learner = reg ? learners.find((l) => l.id === reg.learnerId) : undefined;
            return (
              <ActivityCard
                key={a.id}
                activity={a}
                registrationStatus={reg ? `${reg.bookingStatus} for ${learner?.preferredName}` : undefined}
              />
            );
          })}
        </div>
      </main>
    </PageShell>
  );
}
