import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { AchievementBadge } from "@/components/AchievementBadge";
import { TopicHeatmap } from "@/components/TopicHeatmap";
import { createClient } from "@/lib/supabase/server";
import { getExamHistory, getRevisionItems, getLearnerAchievements } from "@/features/parent/queries";

export default async function LearningPassport({ params }: { params: { childId: string } }) {
  const supabase = await createClient();
  const { data: learner } = await supabase.from("learners").select("*").eq("id", params.childId).maybeSingle();
  if (!learner) notFound();

  const [results, revision, achievements, { data: notes }, { data: regs }] = await Promise.all([
    getExamHistory(learner.id),
    getRevisionItems(learner.id),
    getLearnerAchievements(learner.id),
    supabase.from("lesson_notes").select("*").eq("learner_id", learner.id).order("created_at", { ascending: false }),
    supabase.from("activity_registrations").select("*, activities(title)").eq("learner_id", learner.id),
  ]);

  const { count: moodCount } = await supabase
    .from("mood_checkins")
    .select("id", { count: "exact", head: true })
    .eq("learner_id", learner.id);

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden>{learner.avatar_emoji}</span>
            <div>
              <h1 className="font-display font-bold text-3xl">{learner.preferred_name}&apos;s Learning Passport</h1>
              <p className="text-charcoal-teal/70">{learner.year_group} · {learner.current_school ?? "No school recorded"}</p>
            </div>
          </div>
          <Button variant="outline">Export passport (PDF)</Button>
        </div>

        <Card className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Personal details</h2>
          <dl className="grid sm:grid-cols-2 gap-3 text-sm">
            <div><dt className="text-charcoal-teal/60 text-xs">Target exam</dt><dd className="font-semibold">{learner.target_exam ?? "—"}</dd></div>
            <div><dt className="text-charcoal-teal/60 text-xs">Target school</dt><dd className="font-semibold">{learner.target_school ?? "—"}</dd></div>
            <div><dt className="text-charcoal-teal/60 text-xs">Learning goals</dt><dd className="font-semibold">{learner.learning_goals ?? "—"}</dd></div>
            <div><dt className="text-charcoal-teal/60 text-xs">SEND / accessibility</dt><dd className="font-semibold">{learner.send_notes ?? "—"}</dd></div>
          </dl>
        </Card>

        <section className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Academic progress</h2>
          {results.length ? (
            results.map((r) => (
              <Card key={r.id} className="mb-3">
                <p className="font-semibold mb-2">Mock exam — {r.score}%</p>
                {r.topic_performance?.length ? (
                  <TopicHeatmap topics={r.topic_performance.map((t) => ({ topic: t.topic_key ?? "Topic", score: t.score }))} />
                ) : null}
              </Card>
            ))
          ) : (
            <p className="text-sm text-charcoal-teal/70">No mock exams completed yet.</p>
          )}
        </section>

        <section className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Revision history</h2>
          <Card>
            {revision.length ? (
              <ul className="text-sm space-y-1">
                {revision.map((r) => (
                  <li key={r.id}>{r.topic} — {r.status.replace("_", " ")}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-charcoal-teal/70">No revision items yet.</p>
            )}
          </Card>
        </section>

        <section className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Tutor history</h2>
          <Card>
            {notes?.length ? (
              notes.map((n) => (
                <p key={n.id} className="text-sm mb-2">{n.topic ?? "Session"}: {n.parent_summary}</p>
              ))
            ) : (
              <p className="text-sm text-charcoal-teal/70">No tutor sessions logged yet.</p>
            )}
          </Card>
        </section>

        <section className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Achievements</h2>
          {achievements.length ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {achievements.map((la) =>
                la.achievements ? (
                  <AchievementBadge
                    key={la.id}
                    achievement={{
                      id: la.achievements.id,
                      name: la.achievements.name,
                      icon: la.achievements.icon ?? "🏅",
                      description: la.achievements.description ?? "",
                      category: (la.achievements.category as "academic" | "effort" | "consistency" | "brain_training" | "craft" | "competition") ?? "effort",
                    }}
                    earned
                  />
                ) : null
              )}
            </div>
          ) : (
            <p className="text-sm text-charcoal-teal/70">No achievements earned yet.</p>
          )}
        </section>

        <section className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Activities</h2>
          <Card>
            {regs?.length ? (
              regs.map((r) => (
                <p key={r.id} className="text-sm mb-1">{r.activities?.title} — {r.booking_status}</p>
              ))
            ) : (
              <p className="text-sm text-charcoal-teal/70">No activities yet.</p>
            )}
          </Card>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg mb-3">Wellbeing summary</h2>
          <Card>
            <p className="text-sm text-charcoal-teal/80">
              {moodCount ?? 0} mood check-ins recorded so far.
            </p>
          </Card>
        </section>
      </main>
    </PageShell>
  );
}
