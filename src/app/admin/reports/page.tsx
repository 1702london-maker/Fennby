import { SimplePage } from "@/components/SimplePage";
import { Card } from "@/components/Card";

// No PDF export library or per-report queries exist yet — an "Export PDF"
// button here would be clickable but silently do nothing. Honestly labelled
// "Coming soon" instead, same convention as the brain games list.
const reports = [
  "Cohort progress",
  "Pupil Premium report",
  "SEND progress report",
  "Homework completion",
  "Assessment readiness",
  "Intervention impact",
];

export default function AdminReportsPage() {
  return (
    <SimplePage eyebrow="Admin" title="Reports" body="Generate operational reports across the platform.">
      <div className="grid sm:grid-cols-2 gap-4">
        {reports.map((r) => (
          <Card key={r} className="flex items-center justify-between">
            <span className="font-semibold">{r}</span>
            <span className="inline-block text-xs font-bold bg-teal-100 text-charcoal-teal/60 px-3 py-2 rounded-full">
              Coming soon
            </span>
          </Card>
        ))}
      </div>
    </SimplePage>
  );
}
