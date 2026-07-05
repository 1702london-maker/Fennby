import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { AchievementBadge } from "@/components/AchievementBadge";
import { TopicHeatmap } from "@/components/TopicHeatmap";
import {
  learners,
  assessmentResults,
  revisionItems,
  lessonNotes,
  achievements,
  learnerAchievements,
  activityRegistrations,
  activities,
  moodCheckins,
} from "@/lib/seed-data";

export default function LearningPassport({ params }: { params: { childId: string } }) {
  const learner = learners.find((l) => l.id === params.childId);
  if (!learner) notFound();

  const results = assessmentResults.filter((r) => r.learnerId === learner.id);
  const revision = revisionItems.filter((r) => r.learnerId === learner.id);
  const notes = lessonNotes.filter((n) => n.learnerId === learner.id);
  const earnedIds = learnerAchievements.filter((la) => la.learnerId === learner.id).map((la) => la.achievementId);
  const earned = achievements.filter((a) => earnedIds.includes(a.id));
  const regs = activityRegistrations.filter((r) => r.learnerId === learner.id);
  const moods = moodCheckins.filter((m) => m.learnerId === learner.id);

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden>{learner.avatarEmoji}</span>
            <div>
              <h1 className="font-display font-bold text-3xl">{learner.preferredName}&apos;s Learning Passport</h1>
              <p className="text-charcoal-teal/70">{learner.yearGroup} · {learner.currentSchool}</p>
            </div>
          </div>
          <Button variant="outline">Export passport (PDF)</Button>
        </div>

        <Card className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Personal details</h2>
          <dl className="grid sm:grid-cols-2 gap-3 text-sm">
            <div><dt className="text-charcoal-teal/60 text-xs">Target exam</dt><dd className="font-semibold">{learner.targetExam}</dd></div>
            <div><dt className="text-charcoal-teal/60 text-xs">Target school</dt><dd className="font-semibold">{learner.targetSchool}</dd></div>
            <div><dt className="text-charcoal-teal/60 text-xs">Learning goals</dt><dd className="font-semibold">{learner.learningGoals}</dd></div>
            <div><dt className="text-charcoal-teal/60 text-xs">SEND / accessibility</dt><dd className="font-semibold">{learner.sendNotes}</dd></div>
          </dl>
        </Card>

        <section className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Academic progress</h2>
          {results.map((r) => (
            <Card key={r.id} className="mb-3">
              <p className="font-semibold mb-2">{r.assessmentTitle} — {r.score}%</p>
              <TopicHeatmap topics={r.topicBreakdown} />
            </Card>
          ))}
        </section>

        <section className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Revision history</h2>
          <Card>
            <ul className="text-sm space-y-1">
              {revision.map((r) => (
                <li key={r.id}>{r.topic} — {r.status.replace("_", " ")}</li>
              ))}
            </ul>
          </Card>
        </section>

        <section className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Tutor history</h2>
          <Card>
            {notes.map((n) => (
              <p key={n.id} className="text-sm mb-2">{n.subject}: {n.parentSummary}</p>
            ))}
          </Card>
        </section>

        <section className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Achievements</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {earned.map((a) => <AchievementBadge key={a.id} achievement={a} earned />)}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Activities</h2>
          <Card>
            {regs.length ? regs.map((r) => {
              const act = activities.find((a) => a.id === r.activityId);
              return <p key={r.id} className="text-sm mb-1">{act?.title} — {r.bookingStatus}</p>;
            }) : <p className="text-sm text-charcoal-teal/70">No activities yet.</p>}
          </Card>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg mb-3">Wellbeing summary</h2>
          <Card>
            <p className="text-sm text-charcoal-teal/80">
              {moods.length} mood check-ins recorded this month — mostly positive, with no
              sustained low-mood patterns flagged for review.
            </p>
          </Card>
        </section>
      </main>
    </PageShell>
  );
}
