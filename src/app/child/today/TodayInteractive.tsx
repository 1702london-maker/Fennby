"use client";

import { useState } from "react";
import { MoodCheckIn } from "@/components/MoodCheckIn";
import { BrainWarmupCard } from "@/components/BrainWarmupCard";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { submitMoodCheckin, completeBrainWarmup } from "@/features/child/actions";
import type { Mood } from "@/lib/mock-data";
import type { Database } from "@/types/database";

const moodToDbMood: Record<Mood, Database["public"]["Enums"]["mood_type"]> = {
  great: "excited",
  good: "happy",
  okay: "okay",
  low: "tired",
  tough: "frustrated",
};

export function TodayInteractive() {
  const [warmupDone, setWarmupDone] = useState(false);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card>
          <MoodCheckIn onSelect={(mood: Mood) => submitMoodCheckin(moodToDbMood[mood])} />
        </Card>
        <BrainWarmupCard
          onComplete={() => {
            setWarmupDone(true);
            completeBrainWarmup();
          }}
        />
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
    </>
  );
}
