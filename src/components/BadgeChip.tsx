"use client";

import { motion } from "framer-motion";
import { Badge } from "@/lib/mock-data";

export function BadgeChip({ badge }: { badge: Badge }) {
  return (
    <motion.div
      initial={badge.isNew ? { scale: 0.7, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={`flex flex-col items-center gap-1 rounded-2xl px-4 py-3 min-w-[92px] ${
        badge.isNew ? "bg-coral-100" : "bg-teal-100"
      }`}
    >
      <span className="text-3xl" aria-hidden>
        {badge.icon}
      </span>
      <span className="text-xs font-semibold text-center text-charcoal-teal leading-tight">
        {badge.name}
      </span>
      {badge.isNew && (
        <span className="text-[10px] font-bold text-coral-600 uppercase tracking-wide">New!</span>
      )}
    </motion.div>
  );
}
