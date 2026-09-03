import { SimplePage } from "@/components/SimplePage";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { getRegionalImpactReport } from "@/features/authority/queries";

export default async function AuthorityImpactPage() {
  const report = await getRegionalImpactReport();

  return (
    <SimplePage
      eyebrow="Local Authority"
      title="Impact reports"
      body="Anonymised, aggregated regional attainment data — offered free to local authorities as a trust-building step, independent of any commercial relationship."
    >
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <StatCard label="Approved schools" value={report.approvedSchools} tint="teal" />
        <StatCard label="Learners represented" value={report.learners} />
        <StatCard label="SEND/accessibility profiles" value={report.sendLearners} />
        <StatCard label="Completed assessments" value={report.completedAssessments} />
        <StatCard label="Average assessment score" value={`${report.averageScore}%`} tint="coral" />
        <StatCard label="Open interventions" value={report.openInterventions} />
      </div>
      <Card>
        <h2 className="font-display font-bold text-lg mb-3">Safeguarding and intervention governance</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <p className="bg-teal-100 rounded-2xl p-4">
            <span className="block font-bold text-2xl">{report.highPriorityInterventions}</span>
            High-priority intervention items
          </p>
          <p className="bg-teal-100 rounded-2xl p-4">
            <span className="block font-bold text-2xl">{report.openSafeguardingCases}</span>
            Open safeguarding cases
          </p>
        </div>
      </Card>
    </SimplePage>
  );
}
