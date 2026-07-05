"use client";

import { motion } from "framer-motion";

const colorMap = {
  teal: "#146B6B",
  coral: "#F2896B",
  plum: "#5B4B8A",
  sage: "#6E9B7A",
} as const;

export function ProgressRing({
  progress,
  size = 96,
  strokeWidth = 10,
  color = "teal",
  label,
  sublabel,
  showSpark = true,
}: {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: keyof typeof colorMap;
  label?: string;
  sublabel?: string;
  showSpark?: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Cradle motif: ring has a deliberate ~22deg gap at the top, opening upward
  const gapDeg = 22;
  const trackLength = circumference * (1 - gapDeg / 360);
  const fillLength = trackLength * (progress / 100);
  const rotation = -90 - gapDeg / 2; // center the gap at the top

  const sparkAngle = ((rotation + (gapDeg / 2) + (360 - gapDeg) * (progress / 100)) * Math.PI) / 180;
  const sparkX = size / 2 + radius * Math.cos(sparkAngle);
  const sparkY = size / 2 + radius * Math.sin(sparkAngle);

  const strokeColor = colorMap[color];

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label ?? "Progress"}: ${progress}%`}
    >
      <svg width={size} height={size} className="-rotate-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#DCEFEF"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${trackLength} ${circumference}`}
          transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${trackLength} ${circumference}`}
          initial={{ strokeDashoffset: trackLength }}
          animate={{ strokeDashoffset: trackLength - fillLength }}
          transition={{ duration: 1, ease: "easeOut" }}
          transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
        />
        {showSpark && progress > 2 && (
          <motion.circle
            cx={sparkX}
            cy={sparkY}
            r={strokeWidth / 2.2}
            fill="#F2896B"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.4, type: "spring" }}
          />
        )}
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="font-display font-bold text-charcoal-teal" style={{ fontSize: size * 0.22 }}>
          {progress}%
        </span>
        {sublabel && <span className="text-[10px] text-charcoal-teal/70">{sublabel}</span>}
      </div>
    </div>
  );
}
