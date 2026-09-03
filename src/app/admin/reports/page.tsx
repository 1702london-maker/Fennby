import { SimplePage } from "@/components/SimplePage";
import { Card } from "@/components/Card";
import { getAdminReportSummaries } from "@/features/admin/queries";

export default async function AdminReportsPage() {
  const reports = await getAdminReportSummaries();

  return (
    <SimplePage eyebrow="Admin" title="Reports" body="Live operational summaries across assessment, intervention, homework, SEND, and provider readiness.">
      <div className="grid sm:grid-cols-2 gap-4">
        {reports.map((r) => (
          <Card key={r.title}>
            <p className="text-sm font-semibold text-charcoal-teal/70">{r.title}</p>
            <p className="font-display font-bold text-2xl mt-1">{r.value}</p>
            <p className="text-sm text-charcoal-teal/70 mt-3">{r.detail}</p>
          </Card>
        ))}
      </div>
    </SimplePage>
  );
}
