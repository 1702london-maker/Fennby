"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { moodOptions, Mood } from "@/lib/mock-data";
import { MoodIcon } from "@/components/icons/MoodIcons";

export function MoodCheckIn({ onSelect }: { onSelect?: (m: Mood) => void }) {
  const [selected, setSelected] = useState<Mood | null>(null);

  return (
    <div>
      <p className="font-display font-bold text-lg mb-3">How are you feeling today?</p>
      <div className="flex gap-3 flex-wrap">
        {moodOptions.map((m) => {
          const Icon = MoodIcon[m.key];
          return (
            <motion.button
              key={m.key}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setSelected(m.key);
                onSelect?.(m.key);
              }}
              aria-pressed={selected === m.key}
              aria-label={m.label}
              className={`flex flex-col items-center gap-1 rounded-2xl px-4 py-3 min-h-[44px] min-w-[64px] border-2 transition-colors ${
                selected === m.key
                  ? "border-coral-600 bg-coral-100"
                  : "border-transparent bg-teal-100 hover:bg-teal-100/70"
              }`}
            >
              <Icon />
              <span className="text-xs font-semibold">{m.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
