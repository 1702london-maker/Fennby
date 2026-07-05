import { PageShell } from "@/components/PageShell";
import { AchievementBadge } from "@/components/AchievementBadge";
import { achievements, learnerAchievements, learners } from "@/lib/seed-data";

const activeLearner = learners[0];

export default function ChildBadgesPage() {
  const earnedIds = learnerAchievements.filter((la) => la.learnerId === activeLearner.id).map((la) => la.achievementId);
  const earned = achievements.filter((a) => earnedIds.includes(a.id));
  const locked = achievements.filter((a) => !earnedIds.includes(a.id));

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Your badges</h1>
        <p className="text-charcoal-teal/70 mb-8">{earned.length} earned so far — keep going to unlock the rest!</p>

        <section className="mb-10">
          <h2 className="font-display font-bold text-lg mb-4">Earned</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {earned.map((a) => (
              <AchievementBadge key={a.id} achievement={a} earned />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg mb-4">Still to unlock</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {locked.map((a) => (
              <AchievementBadge key={a.id} achievement={a} earned={false} />
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
