import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { AchievementBadge } from "@/components/AchievementBadge";
import { EmptyState } from "@/components/EmptyState";
import {
  getMyLearnerProfile,
  getRevisionItemsForLearner,
  getNextSession,
  getLatestBadge,
} from "@/features/child/queries";
import { TodayInteractive } from "./TodayInteractive";

export default async function ChildToday() {
  const learner = await getMyLearnerProfile();

  if (!learner) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-16">
          <EmptyState emoji="🧒" title="No profile found" description="Ask your parent to check your account." />
        </main>
      </PageShell>
    );
  }

  const [revisionItems, nextSession, latestBadge] = await Promise.all([
    getRevisionItemsForLearner(learner.id),
    getNextSession(learner.id),
    getLatestBadge(learner.id),
  ]);

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <p className="text-lg text-charcoal-teal/70">Hiya {learner.avatar_emoji}</p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl mt-1">
          Ready for today&apos;s challenge, {learner.preferred_name}?
        </h1>

        <TodayInteractive />

        <section className="grid md:grid-cols-2 gap-6 mt-8">
          <Card>
            <h2 className="font-display font-bold text-lg mb-3">Your revision today</h2>
            {revisionItems.length ? (
              <ul className="space-y-2 text-sm">
                {revisionItems.map((r) => (
                  <li key={r.id} className="flex justify-between">
                    <span className="font-semibold">{r.topic}</span>
                    <span className="text-charcoal-teal/60">{r.status.replace("_", " ")}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-charcoal-teal/70 text-sm">No revision items yet — nice and clear today!</p>
            )}
            <Button href="/child/practice" variant="outline" className="mt-4">Continue learning</Button>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-lg mb-3">Coming up</h2>
            {nextSession ? (
              <p className="text-sm text-charcoal-teal/80">
                {nextSession.subject ?? "Session"} on{" "}
                {new Date(nextSession.scheduled_at).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            ) : (
              <p className="text-sm text-charcoal-teal/70">No sessions scheduled yet.</p>
            )}
            {latestBadge?.achievements && (
              <div className="mt-4 max-w-[160px]">
                <AchievementBadge
                  achievement={{
                    id: latestBadge.achievements.id,
                    name: latestBadge.achievements.name,
                    icon: latestBadge.achievements.icon ?? "🏅",
                    description: latestBadge.achievements.description ?? "",
                    category: (latestBadge.achievements.category as "academic" | "effort" | "consistency" | "brain_training" | "craft" | "competition") ?? "effort",
                  }}
                  earned
                />
              </div>
            )}
          </Card>
        </section>

        <Card tint="teal" className="mt-8 text-center">
          <p className="font-display font-bold">You&apos;re doing brilliantly, {learner.preferred_name}. Keep it up! 🌟</p>
        </Card>
      </main>
    </PageShell>
  );
}
