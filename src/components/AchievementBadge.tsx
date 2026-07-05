import { Card } from "@/components/Card";
import { Achievement } from "@/lib/types";

export function AchievementBadge({ achievement, earned = true }: { achievement: Achievement; earned?: boolean }) {
  return (
    <Card
      tint={earned ? "coral" : "white"}
      className={`flex flex-col items-center text-center gap-2 ${!earned ? "opacity-60 border-2 border-dashed border-teal-100" : ""}`}
    >
      <span className={`text-4xl ${!earned ? "grayscale" : ""}`} aria-hidden>{achievement.icon}</span>
      <p className="font-display font-bold text-sm">{achievement.name}</p>
      <p className="text-xs text-charcoal-teal/70">{achievement.description}</p>
    </Card>
  );
}
