import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { activities, activityRegistrations, learners } from "@/lib/seed-data";

const activeLearner = learners[1];

export default function ChildCampsPage() {
  const camps = activities.filter((a) => a.type === "summer_camp");
  const myRegs = activityRegistrations.filter((r) => r.learnerId === activeLearner.id);

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Summer Camps</h1>
        <p className="text-charcoal-teal/70 mb-8">A summer that builds confidence, not just fills time.</p>
        <div className="space-y-4">
          {camps.map((a) => {
            const reg = myRegs.find((r) => r.activityId === a.id);
            return (
              <Card key={a.id} tint="coral">
                <p className="font-display font-bold text-lg">{a.title}</p>
                <p className="text-sm text-charcoal-teal/80 mt-1">{a.description}</p>
                <p className="text-xs text-charcoal-teal/60 mt-2">{a.startDate} → {a.endDate} · {a.location}</p>
                {reg ? (
                  <p className="text-sm font-semibold text-sage-600 mt-3">
                    You&apos;re {reg.bookingStatus}! Consent: {reg.consentStatus}
                  </p>
                ) : (
                  <p className="text-sm text-charcoal-teal/70 mt-3">Ask a grown-up to register your interest.</p>
                )}
              </Card>
            );
          })}
        </div>
      </main>
    </PageShell>
  );
}
