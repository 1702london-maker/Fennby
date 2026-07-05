import { PageShell } from "@/components/PageShell";
import { AchievementBadge } from "@/components/AchievementBadge";
import { EmptyState } from "@/components/EmptyState";
import { getMyLearnerProfile } from "@/features/child/queries";
import { createClient } from "@/lib/supabase/server";

export default async function ChildBadgesPage() {
  const learner = await getMyLearnerProfile();
  if (!learner) {
    return (
      <PageShell>
        <main className="max-w-4xl mx-auto px-6 py-10">
          <EmptyState emoji="🧒" title="No profile found" description="" />
        </main>
      </PageShell>
    );
  }

  const supabase = await createClient();
  const [{ data: allAchievements }, { data: earnedRows }] = await Promise.all([
    supabase.from("achievements").select("*"),
    supabase.from("learner_achievements").select("achievement_id").eq("learner_id", learner.id),
  ]);

  const earnedIds = new Set((earnedRows ?? []).map((r) => r.achievement_id));
  const earned = (allAchievements ?? []).filter((a) => earnedIds.has(a.id));
  const locked = (allAchievements ?? []).filter((a) => !earnedIds.has(a.id));

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Your badges</h1>
        <p className="text-charcoal-teal/70 mb-8">{earned.length} earned so far — keep going to unlock the rest!</p>

        <section className="mb-10">
          <h2 className="font-display font-bold text-lg mb-4">Earned</h2>
          {earned.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {earned.map((a) => (
                <AchievementBadge
                  key={a.id}
                  achievement={{ id: a.id, name: a.name, icon: a.icon ?? "🏅", description: a.description ?? "", category: (a.category as "academic" | "effort" | "consistency" | "brain_training" | "craft" | "competition") ?? "effort" }}
                  earned
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-charcoal-teal/70">No badges earned yet — keep going!</p>
          )}
        </section>

        <section>
          <h2 className="font-display font-bold text-lg mb-4">Still to unlock</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {locked.map((a) => (
              <AchievementBadge
                key={a.id}
                achievement={{ id: a.id, name: a.name, icon: a.icon ?? "🏅", description: a.description ?? "", category: (a.category as "academic" | "effort" | "consistency" | "brain_training" | "craft" | "competition") ?? "effort" }}
                earned={false}
              />
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
