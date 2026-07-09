import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { RevisionItemCard } from "@/components/RevisionItemCard";
import { AchievementBadge } from "@/components/AchievementBadge";
import { MoodIcon } from "@/components/icons/MoodIcons";
import {
  getMyLearners,
  getLatestResult,
  getMoodTrend,
  getUpcomingSessions,
  getRecentMessages,
  getRevisionItems,
  getLearnerAchievements,
} from "@/features/parent/queries";
import { getWorkshopSummaryForLearner } from "@/features/parent/workshopQueries";
import { getAiTutorHistoryForLearner } from "@/features/ai-tutor/queries";

const dbMoodToIcon = {
  happy: "great",
  excited: "great",
  okay: "okay",
  tired: "low",
  worried: "tough",
  frustrated: "tough",
} as const;

export default async function ParentDashboard({
  searchParams,
}: {
  searchParams: Promise<{ childId?: string }>;
}) {
  const { childId } = await searchParams;
  const learners = await getMyLearners();

  if (learners.length === 0) {
    return (
      <PageShell>
        <main className="max-w-3xl mx-auto px-6 py-16">
          <EmptyState
            emoji="👪"
            title="No children linked to your account yet"
            description="Add your child's details to start seeing their mock exams, sessions, and progress here."
          />
          <div className="flex justify-center">
            <Button href="/register/parent" variant="primary">Add a child</Button>
          </div>
        </main>
      </PageShell>
    );
  }

  const child = learners.find((l) => l.id === childId) ?? learners[0];

  const [latestResult, moodTrend, sessions, messages, revisionItems, achievements, workshop, aiTutorHistory] = await Promise.all([
    getLatestResult(child.id),
    getMoodTrend(child.id),
    getUpcomingSessions(child.id),
    getRecentMessages(child.id),
    getRevisionItems(child.id),
    getLearnerAchievements(child.id),
    getWorkshopSummaryForLearner(child.id),
    getAiTutorHistoryForLearner(child.id),
  ]);

  return (
    <PageShell>
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-charcoal-teal/70">Welcome back</p>
            <h1 className="font-display font-bold text-3xl">Family dashboard</h1>
          </div>
          <div className="flex gap-2">
            {learners.map((l) => (
              <Link
                key={l.id}
                href={`/parent?childId=${l.id}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold min-h-[44px] transition-colors ${
                  l.id === child.id ? "bg-teal-900 text-white" : "bg-teal-100 text-teal-900 hover:bg-teal-100/70"
                }`}
              >
                <span aria-hidden>{l.avatar_emoji}</span> {l.preferred_name}
              </Link>
            ))}
          </div>
        </div>

        {latestResult ? (
          <Card tint="coral" className="mb-8">
            <p className="font-semibold text-charcoal-teal/70 text-sm">Latest result</p>
            <p className="font-display font-bold text-xl mt-1">
              {child.preferred_name} scored {latestResult.score}% on her most recent mock.
            </p>
          </Card>
        ) : (
          <Card tint="teal" className="mb-8">
            <EmptyState
              emoji="📝"
              title="No mock exams completed yet"
              description={`Once ${child.preferred_name} completes a mock exam, results will appear here.`}
            />
          </Card>
        )}

        <section className="grid md:grid-cols-2 gap-6 mb-10">
          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Topic performance</h2>
            {latestResult?.topic_performance?.length ? (
              <div className="grid grid-cols-2 gap-3 text-sm">
                {latestResult.topic_performance.map((t) => (
                  <div key={t.id} className="bg-teal-100 rounded-2xl px-4 py-3">
                    <p className="font-semibold">{t.topic_key}</p>
                    <p className="text-charcoal-teal/70">{t.score}%</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-charcoal-teal/70">No topic data yet.</p>
            )}
          </Card>

          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Mood check-in trend</h2>
            {moodTrend.length ? (
              <div className="flex justify-between items-end h-24">
                {moodTrend.map((m) => {
                  const Icon = MoodIcon[dbMoodToIcon[m.mood]];
                  return (
                    <div key={m.id} className="flex flex-col items-center gap-2">
                      <Icon />
                      <span className="text-xs text-charcoal-teal/70">
                        {new Date(m.created_at).toLocaleDateString("en-GB", { weekday: "short" })}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-charcoal-teal/70">No mood check-ins yet.</p>
            )}
          </Card>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg">Message log</h2>
              <Link href="/parent/chat" className="text-sm font-semibold text-teal-900 hover:underline">
                View full thread →
              </Link>
            </div>
            {messages.length ? (
              <>
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className="text-sm">
                      <span className="text-charcoal-teal/80">{m.content}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-charcoal-teal/50 mt-4">
                  Every message involving {child.preferred_name} is visible here, in full, always.
                </p>
              </>
            ) : (
              <EmptyState
                emoji="💬"
                title="No messages yet"
                description="Once a tutor is matched, every message with your child will show up here."
              />
            )}
          </Card>

          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Upcoming sessions</h2>
            <div className="space-y-3">
              {sessions.length ? (
                sessions.map((s) => (
                  <div key={s.id} className="flex justify-between items-center text-sm">
                    <span className="font-semibold">{s.subject ?? "Session"}</span>
                    <span className="text-charcoal-teal/70">
                      {new Date(s.scheduled_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-charcoal-teal/70 text-sm">No sessions scheduled yet.</p>
              )}
            </div>
            <Button href="/parent/tutors" variant="outline" className="mt-6">Browse tutors</Button>
          </Card>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mt-10">
          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Revision plan</h2>
            {revisionItems.length ? (
              <div className="space-y-3">
                {revisionItems.map((r) => (
                  <RevisionItemCard
                    key={r.id}
                    item={{
                      id: r.id,
                      learnerId: r.learner_id,
                      subject: r.subject ?? "",
                      topic: r.topic ?? "",
                      reason: r.reason ?? "",
                      priority: (r.priority as "high" | "medium" | "low") ?? "medium",
                      recommendedActivity: r.recommended_activity ?? "",
                      dueDate: r.due_date ?? "",
                      status: r.status as "not_started" | "in_progress" | "done",
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-charcoal-teal/70">Nothing to revise right now — all caught up!</p>
            )}
          </Card>
          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Achievements</h2>
            {achievements.length ? (
              <div className="grid grid-cols-3 gap-3">
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
              <p className="text-sm text-charcoal-teal/70">No achievements earned yet — keep going!</p>
            )}
          </Card>
        </section>

        <section className="mt-10">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg">The Workshop</h2>
              <span className="text-sm text-charcoal-teal/70">{workshop.totalMinutes} minutes recently</span>
            </div>
            {workshop.sessions.length ? (
              <div className="space-y-2 text-sm">
                {workshop.sessions.map((s) => (
                  <div key={s.id} className="flex justify-between items-center">
                    <span className="font-semibold">{s.topic_key ?? s.subject_key ?? "General practice"}</span>
                    <span className="text-charcoal-teal/70">
                      {s.minutes_spent ? `${s.minutes_spent} min` : "In progress"} ·{" "}
                      {new Date(s.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-charcoal-teal/70">No self-study sessions yet — this shows up here the moment {child.preferred_name} uses The Workshop.</p>
            )}
          </Card>
        </section>

        <section className="mt-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg">AI Tutor conversations</h2>
              <span className="text-xs font-semibold text-charcoal-teal/60">Supplementary practice tool, not a replacement for a real tutor</span>
            </div>
            {aiTutorHistory.length ? (
              <div className="space-y-3">
                {aiTutorHistory.map((c) => (
                  <div key={c.id} className="text-sm border-b border-teal-100 pb-2 last:border-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">{c.subject_key ?? "General"}</span>
                      <span className="text-charcoal-teal/60 text-xs">
                        {new Date(c.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {c.ai_tutor_messages?.length ?? 0} messages
                      </span>
                    </div>
                    {c.ai_tutor_messages?.[0] && (
                      <p className="text-charcoal-teal/70 truncate">{c.ai_tutor_messages[0].content}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-charcoal-teal/70">No AI Tutor conversations yet.</p>
            )}
          </Card>
        </section>
      </main>
    </PageShell>
  );
}
