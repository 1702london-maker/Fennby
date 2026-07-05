import { Card } from "@/components/Card";
import { RevisionItem } from "@/lib/types";

const priorityColor: Record<RevisionItem["priority"], string> = {
  high: "bg-brick-600/10 text-brick-600",
  medium: "bg-coral-100 text-coral-600",
  low: "bg-teal-100 text-teal-900",
};

export function RevisionItemCard({ item }: { item: RevisionItem }) {
  return (
    <Card className="flex items-start justify-between gap-4">
      <div>
        <p className="font-display font-bold">{item.subject} · {item.topic}</p>
        <p className="text-sm text-charcoal-teal/70 mt-1">{item.reason}</p>
        <p className="text-sm text-charcoal-teal/80 mt-2">Recommended: {item.recommendedActivity}</p>
        <p className="text-xs text-charcoal-teal/50 mt-1">Due {item.dueDate}</p>
      </div>
      <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${priorityColor[item.priority]}`}>
        {item.priority.toUpperCase()}
      </span>
    </Card>
  );
}
