"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ProgressRing } from "@/components/ProgressRing";
import { EmptyState } from "@/components/EmptyState";
import { MoodIcon } from "@/components/icons/MoodIcons";
import { children, chatThread, upcomingSessions } from "@/lib/mock-data";
import { revisionItems, learnerAchievements, achievements } from "@/lib/seed-data";
import { RevisionItemCard } from "@/components/RevisionItemCard";
import { AchievementBadge } from "@/components/AchievementBadge";
import Link from "next/link";

export default function ParentDashboard() {
  const [activeChildId, setActiveChildId] = useState<string | null>(children[0].id);
  const child = children.find((c) => c.id === activeChildId) ?? null;

  if (!child) {
    return (
      <PageShell>
        <main className="max-w-3xl mx-auto px-6 py-16">
          <EmptyState
            emoji="👪"
            title="No children linked to your account yet"
            description="Add your child's details to start seeing their mock exams, sessions, and progress here."
          />
          <div className="flex justify-center">
            <Button variant="primary">Add a child</Button>
          </div>
        </main>
      </PageShell>
    );
  }

  const latestExam = child.examHistory[0];
  const sessionsForChild = upcomingSessions.filter((s) => s.child === child.name);

  return (
    <PageShell>
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-charcoal-teal/70">Welcome back</p>
            <h1 className="font-display font-bold text-3xl">Family dashboard</h1>
          </div>
          <div className="flex gap-2">
            {children.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveChildId(c.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold min-h-[44px] transition-colors ${
                  c.id === activeChildId
                    ? "bg-teal-900 text-white"
                    : "bg-teal-100 text-teal-900 hover:bg-teal-100/70"
                }`}
              >
                <span aria-hidden>{c.avatarEmoji}</span> {c.name}
              </button>
            ))}
          </div>
        </div>

        {latestExam ? (
          <Card tint="coral" className="mb-8">
            <p className="font-semibold text-charcoal-teal/70 text-sm">Since last month</p>
            <p className="font-display font-bold text-xl mt-1">
              {child.name} completed her {latestExam.subject} mock today — {latestExam.score}%, up from{" "}
              {latestExam.prevScore}% last month.
            </p>
          </Card>
        ) : (
          <Card tint="teal" className="mb-8">
            <EmptyState
              emoji="📝"
              title="No mock exams completed yet"
              description={`Once ${child.name} completes a mock exam, results will appear here.`}
            />
          </Card>
        )}

        <section className="grid md:grid-cols-2 gap-6 mb-10">
          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Subject progress</h2>
            <div className="grid grid-cols-2 gap-4">
              {child.subjects.map((s) => (
                <div key={s.key} className="flex flex-col items-center gap-2">
                  <ProgressRing progress={s.progress} color={s.color} size={72} />
                  <span className="text-xs font-semibold text-center">{s.name}</span>
                  <span className="text-[11px] text-sage-600 font-semibold">
                    +{s.progress - s.lastWeekProgress} since last week
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Mood check-in trend</h2>
            <div className="flex justify-between items-end h-24">
              {child.moodTrend.map((m) => {
                const Icon = MoodIcon[m.mood];
                return (
                  <div key={m.date} className="flex flex-col items-center gap-2">
                    <Icon />
                    <span className="text-xs text-charcoal-teal/70">{m.date}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-charcoal-teal/70 mt-3">
              A calm, steady week — mostly good and great days.
            </p>
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
            {chatThread.length ? (
              <>
                <div className="space-y-3">
                  {chatThread.slice(0, 3).map((m) => (
                    <div key={m.id} className="text-sm">
                      <span className="font-semibold">{m.senderName}:</span>{" "}
                      <span className="text-charcoal-teal/80">{m.content}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-charcoal-teal/50 mt-4">
                  Every message involving {child.name} is visible here, in full, always.
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
              {sessionsForChild.length ? (
                sessionsForChild.map((s) => (
                  <div key={s.id} className="flex justify-between items-center text-sm">
                    <span className="font-semibold">{s.subject} with {s.tutor}</span>
                    <span className="text-charcoal-teal/70">{s.date}, {s.time}</span>
                  </div>
                ))
              ) : (
                <p className="text-charcoal-teal/70 text-sm">No sessions scheduled yet.</p>
              )}
            </div>
            <Button href="/parent/chat" variant="outline" className="mt-6">Message the tutor</Button>
          </Card>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mt-10">
          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Revision plan</h2>
            <div className="space-y-3">
              {revisionItems.filter((r) => r.learnerId === child.id).map((r) => (
                <RevisionItemCard key={r.id} item={r} />
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Achievements</h2>
            <div className="grid grid-cols-3 gap-3">
              {learnerAchievements
                .filter((la) => la.learnerId === child.id)
                .map((la) => achievements.find((a) => a.id === la.achievementId))
                .filter(Boolean)
                .map((a) => (
                  <AchievementBadge key={a!.id} achievement={a!} earned />
                ))}
            </div>
          </Card>
        </section>
      </main>
    </PageShell>
  );
}
