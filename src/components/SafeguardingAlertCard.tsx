import { Card } from "@/components/Card";
import { SafeguardingCase } from "@/lib/types";

const priorityColor: Record<SafeguardingCase["priority"], string> = {
  urgent: "bg-brick-600 text-white",
  high: "bg-brick-600/10 text-brick-600",
  medium: "bg-coral-100 text-coral-600",
  low: "bg-teal-100 text-teal-900",
};

export function SafeguardingAlertCard({ item }: { item: SafeguardingCase }) {
  return (
    <Card className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${priorityColor[item.priority]}`}>
            {item.priority.toUpperCase()}
          </span>
          <span className="text-xs text-charcoal-teal/60">{item.status.replace("_", " ")}</span>
        </div>
        <p className="font-display font-bold">{item.title}</p>
        <p className="text-sm text-charcoal-teal/70 mt-1">{item.description}</p>
        <p className="text-xs text-charcoal-teal/50 mt-2">
          Reported by {item.reportedBy} · Assigned to {item.assignedTo}
        </p>
      </div>
    </Card>
  );
}
