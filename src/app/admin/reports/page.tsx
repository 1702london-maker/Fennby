import { SimplePage } from "@/components/SimplePage";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

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
            <Button variant="outline" className="px-4 py-2 text-sm">Export PDF</Button>
          </Card>
        ))}
      </div>
    </SimplePage>
  );
}
