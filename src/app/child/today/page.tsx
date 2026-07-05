"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { MoodCheckIn } from "@/components/MoodCheckIn";
import { BrainWarmupCard } from "@/components/BrainWarmupCard";
import { AchievementBadge } from "@/components/AchievementBadge";
import {
  learners,
  achievements,
  learnerAchievements,
  revisionItems,
  lessonSessions,
} from "@/lib/seed-data";

const activeLearner = learners[0];

export default function ChildToday() {
  const [warmupDone, setWarmupDone] = useState(false);

  const learnerRevision = revisionItems.filter((r) => r.learnerId === activeLearner.id);
  const nextSession = lessonSessions.find((s) => s.learnerId === activeLearner.id && s.status === "upcoming");
  const latestBadge = achievements.find(
    (a) => a.id === learnerAchievements.filter((la) => la.learnerId === activeLearner.id).slice(-1)[0]?.achievementId
  );

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <p className="text-lg text-charcoal-teal/70">Hiya {activeLearner.avatarEmoji}</p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl mt-1">
          Ready for today&apos;s challenge, {activeLearner.preferredName}?
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card>
            <MoodCheckIn />
          </Card>
          <BrainWarmupCard onComplete={() => setWarmupDone(true)} />
        </div>

        <Card tint="coral" className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-lg">Today&apos;s mock exam</p>
            <p className="text-charcoal-teal/70 text-sm mt-1">
              {warmupDone
                ? "Your brain is warmed up — you're ready to go!"
                : "Complete your brain warm-up above first — it's a quick step before every mock."}
            </p>
          </div>
          <Button href="/child/mock-exams" variant="secondary" disabled={!warmupDone}>
            Start today&apos;s challenge ⚡
          </Button>
        </Card>

        <section className="grid md:grid-cols-2 gap-6 mt-8">
          <Card>
            <h2 className="font-display font-bold text-lg mb-3">Your revision today</h2>
            {learnerRevision.length ? (
              <ul className="space-y-2 text-sm">
                {learnerRevision.map((r) => (
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
                {nextSession.subject} session on{" "}
                {new Date(nextSession.scheduledAt).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            ) : (
              <p className="text-sm text-charcoal-teal/70">No sessions scheduled yet.</p>
            )}
            {latestBadge && (
              <div className="mt-4 max-w-[160px]">
                <AchievementBadge achievement={latestBadge} earned />
              </div>
            )}
          </Card>
        </section>

        <Card tint="teal" className="mt-8 text-center">
          <p className="font-display font-bold">You&apos;re doing brilliantly, {activeLearner.preferredName}. Keep it up! 🌟</p>
        </Card>
      </main>
    </PageShell>
  );
}
