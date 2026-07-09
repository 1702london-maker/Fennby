import { PageShell } from "@/components/PageShell";
import { ActivityCard } from "@/components/ActivityCard";
import { EmptyState } from "@/components/EmptyState";
import { getMyLearners, getActivitiesForParent } from "@/features/parent/queries";

export default async function ParentActivitiesPage() {
  const learners = await getMyLearners();
  const activities = await getActivitiesForParent(learners.map((l) => l.id));

  return (
    <PageShell>
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Activities</h1>
        <p className="text-charcoal-teal/70 mb-8">Summer camps, craft club, vocational workshops, and competitions.</p>
        {activities.length ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {activities.map((a) => (
              <ActivityCard
                key={a.id}
                activity={a}
                registrationStatus={
                  a.myRegistration
                    ? `${a.myRegistration.booking_status} for ${a.myRegistration.learners?.preferred_name ?? "your child"}`
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState emoji="🎨" title="No activities open right now" description="Check back soon — new dates are added regularly." />
        )}
      </main>
    </PageShell>
  );
}
