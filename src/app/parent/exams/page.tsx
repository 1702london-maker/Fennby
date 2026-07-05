"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { ProgressRing } from "@/components/ProgressRing";
import { children } from "@/lib/mock-data";

export default function ParentExamsPage() {
  const [activeChildId, setActiveChildId] = useState(children[0].id);
  const child = children.find((c) => c.id === activeChildId)!;

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="font-display font-bold text-3xl">Mock exam history</h1>
          <div className="flex gap-2">
            {children.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveChildId(c.id)}
                className={`px-4 py-2 rounded-full font-semibold min-h-[44px] transition-colors ${
                  c.id === activeChildId ? "bg-teal-900 text-white" : "bg-teal-100 text-teal-900"
                }`}
              >
                {c.avatarEmoji} {c.name}
              </button>
            ))}
          </div>
        </div>

        {child.examHistory.length === 0 ? (
          <Card tint="teal">
            <EmptyState emoji="📝" title="No mock exams completed yet" description={`Once ${child.name} completes a mock exam, results will appear here.`} />
          </Card>
        ) : (
          <div className="space-y-4">
            {child.examHistory.map((e) => (
              <Card key={e.id}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-display font-bold text-lg">{e.subject}</p>
                    <p className="text-sm text-charcoal-teal/70">{e.date}</p>
                  </div>
                  <ProgressRing progress={e.score} size={72} color="teal" />
                </div>
                <div className="grid sm:grid-cols-3 gap-3 mt-4">
                  {e.topicBreakdown.map((t) => (
                    <div key={t.topic} className="bg-teal-100 rounded-2xl px-4 py-3 text-sm">
                      <p className="font-semibold">{t.topic}</p>
                      <p className="text-charcoal-teal/70">{t.score}%</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </PageShell>
  );
}
