"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ProgressRing } from "@/components/ProgressRing";
import { children } from "@/lib/mock-data";

const modeLabels: Record<string, string> = {
  digital: "Digital Mock",
  "print-shade": "Print & Shade",
  simulation: "Full Exam Simulation",
};

function ResultsContent() {
  const params = useSearchParams();
  const score = Number(params.get("score") ?? 78);
  const mode = params.get("mode") ?? "digital";
  const topics = children[0].examHistory[0].topicBreakdown;
  const weakest = [...topics].sort((a, b) => a.score - b.score)[0];

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <Card tint="coral" className="text-center py-10">
        <motion.p
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 12 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.p>
        <p className="font-display font-bold text-2xl">You did it!</p>
        <p className="text-sm text-charcoal-teal/60 mt-1">{modeLabels[mode] ?? "Mock Exam"}</p>
        <div className="flex justify-center mt-4">
          <ProgressRing progress={score} size={120} color="coral" />
        </div>
        <p className="text-charcoal-teal/70 mt-4">Your brain worked hard today. Nice one.</p>
      </Card>

      <section className="mt-8">
        <h2 className="font-display font-bold text-lg mb-4">Topic-by-topic breakdown</h2>
        <div className="grid grid-cols-3 gap-4">
          {topics.map((t) => (
            <Card key={t.topic} className="flex flex-col items-center gap-2">
              <ProgressRing progress={t.score} size={72} color="teal" />
              <span className="text-xs font-semibold text-center">{t.topic}</span>
            </Card>
          ))}
        </div>
      </section>

      <Card tint="teal" className="mt-8 text-center">
        <p className="font-display font-bold text-lg mb-2">What&apos;s next?</p>
        <p className="text-charcoal-teal/80 mb-4">
          {weakest.topic} looks like a good place to focus next time.
        </p>
        <Button href="/child/mock-exams" variant="primary">Practice {weakest.topic}</Button>
      </Card>

      <div className="mt-6 text-center">
        <Button href="/child/today" variant="ghost">Back to my dashboard</Button>
      </div>
    </main>
  );
}

export default function ExamResults() {
  return (
    <PageShell>
      <Suspense fallback={null}>
        <ResultsContent />
      </Suspense>
    </PageShell>
  );
}
