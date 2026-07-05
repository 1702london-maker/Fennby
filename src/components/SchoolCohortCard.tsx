import Link from "next/link";
import { Card } from "@/components/Card";
import { SchoolClass } from "@/lib/types";

export function SchoolCohortCard({ schoolClass, href }: { schoolClass: SchoolClass; href?: string }) {
  const content = (
    <Card className="hover:ring-2 hover:ring-teal-700 transition-shadow">
      <p className="font-display font-bold text-lg">{schoolClass.name}</p>
      <p className="text-sm text-charcoal-teal/70">{schoolClass.yearGroup} · {schoolClass.pupilIds.length} pupils</p>
      <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
        <div>
          <p className="text-charcoal-teal/60 text-xs">Avg. progress</p>
          <p className="font-semibold">{schoolClass.averageProgress}%</p>
        </div>
        <div>
          <p className="text-charcoal-teal/60 text-xs">Homework completion</p>
          <p className="font-semibold">{schoolClass.homeworkCompletion}%</p>
        </div>
        <div>
          <p className="text-charcoal-teal/60 text-xs">Main weak topic</p>
          <p className="font-semibold">{schoolClass.mainWeakTopic}</p>
        </div>
        <div>
          <p className="text-charcoal-teal/60 text-xs">Interventions</p>
          <p className="font-semibold">{schoolClass.interventionCount}</p>
        </div>
      </div>
    </Card>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}
