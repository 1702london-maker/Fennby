import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Activity } from "@/lib/types";

const typeLabel: Record<Activity["type"], string> = {
  summer_camp: "Summer Camp",
  craft_club: "Craft Club",
  vocational: "Vocational",
  competition: "Competition",
};

export function ActivityCard({ activity, registrationStatus }: { activity: Activity; registrationStatus?: string }) {
  return (
    <Card>
      <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-2">
        {typeLabel[activity.type]}
      </span>
      <p className="font-display font-bold text-lg">{activity.title}</p>
      <p className="text-sm text-charcoal-teal/70 mt-1">{activity.description}</p>
      <p className="text-xs text-charcoal-teal/60 mt-2">
        {activity.startDate} → {activity.endDate} · {activity.location}
      </p>
      <p className="text-sm font-semibold mt-2">{activity.price}</p>
      {registrationStatus && (
        <p className="text-xs text-sage-600 font-semibold mt-1">Status: {registrationStatus}</p>
      )}
      <Button variant="outline" className="mt-4">
        {registrationStatus ? "View registration" : "Register interest"}
      </Button>
    </Card>
  );
}
