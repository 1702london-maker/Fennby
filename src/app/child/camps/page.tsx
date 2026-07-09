import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { getMyLearnerProfile, getActivitiesForLearner } from "@/features/child/queries";

export default async function ChildCampsPage() {
  const learner = await getMyLearnerProfile();

  if (!learner) {
    return (
      <PageShell>
        <main className="max-w-3xl mx-auto px-6 py-10">
          <EmptyState emoji="🧒" title="No profile found" description="" />
        </main>
      </PageShell>
    );
  }

  const camps = await getActivitiesForLearner(learner.id, ["summer_camp"]);

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Summer Camps</h1>
        <p className="text-charcoal-teal/70 mb-8">A summer that builds confidence, not just fills time.</p>
        {camps.length ? (
          <div className="space-y-4">
            {camps.map((a) => (
              <Card key={a.id} tint="coral">
                <p className="font-display font-bold text-lg">{a.title}</p>
                {a.description && <p className="text-sm text-charcoal-teal/80 mt-1">{a.description}</p>}
                <p className="text-xs text-charcoal-teal/60 mt-2">{a.start_date} → {a.end_date} · {a.location}</p>
                {a.myRegistration ? (
                  <p className="text-sm font-semibold text-sage-600 mt-3">
                    You&apos;re {a.myRegistration.booking_status}! Consent: {a.myRegistration.consent_status}
                  </p>
                ) : (
                  <p className="text-sm text-charcoal-teal/70 mt-3">Ask a grown-up to register your interest.</p>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState emoji="☀️" title="No summer camps open right now" description="Check back soon — new dates are added regularly." />
        )}
      </main>
    </PageShell>
  );
}
