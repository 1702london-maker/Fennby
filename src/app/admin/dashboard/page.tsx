import { PageShell } from "@/components/PageShell";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/Card";
import { getDashboardStats, getOperationalMetrics } from "@/features/admin/queries";

function IntegrationStatus({ label, ready }: { label: string; ready: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-teal-100 py-2 last:border-0">
      <span className="font-semibold">{label}</span>
      <span className={`text-xs font-bold px-3 py-1 rounded-full ${ready ? "bg-sage-100 text-sage-600" : "bg-coral-100 text-brick-600"}`}>
        {ready ? "Ready" : "Needs key"}
      </span>
    </div>
  );
}

export default async function AdminDashboard() {
  const [stats, ops] = await Promise.all([getDashboardStats(), getOperationalMetrics()]);

  return (
    <PageShell>
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Platform admin</h1>

        <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Active learners" value={stats.learners} tint="teal" />
          <StatCard label="Parents" value={stats.parents} />
          <StatCard label="Tutors" value={stats.tutors} />
          <StatCard label="Schools" value={stats.schools} />
          <StatCard label="Pending tutor applications" value={stats.pendingTutors} tint="coral" />
          <StatCard label="Pending school applications" value={stats.pendingSchools} />
          <StatCard label="Messages sent" value={stats.messages} />
          <StatCard label="Safeguarding cases" value={stats.cases} tint="coral" />
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Revenue</h2>
            <p className="font-display font-bold text-3xl">£{ops.mockExamRevenue.toFixed(2)}</p>
            <p className="text-sm text-charcoal-teal/70 mt-1">Paid mock exam sitting revenue</p>
            <p className="text-sm text-charcoal-teal/70 mt-4">{ops.unpaidCheckouts} unpaid checkout{ops.unpaidCheckouts === 1 ? "" : "s"} pending</p>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Operations queue</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Homework help</span><strong>{ops.homeworkQueue}</strong></div>
              <div className="flex justify-between"><span>Active Cradle rooms</span><strong>{ops.activeCradle}</strong></div>
              <div className="flex justify-between"><span>Recorded sessions</span><strong>{ops.recordedCradle}</strong></div>
              <div className="flex justify-between"><span>Open safeguarding</span><strong>{ops.openSafeguarding}</strong></div>
              <div className="flex justify-between text-brick-600"><span>Urgent safeguarding</span><strong>{ops.urgentSafeguarding}</strong></div>
            </div>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Integrations</h2>
            <div className="text-sm">
              <IntegrationStatus label="AI Tutor provider" ready={ops.integrations.aiTutor} />
              <IntegrationStatus label="Stripe billing" ready={ops.integrations.stripe} />
              <IntegrationStatus label="Cradle video" ready={ops.integrations.cradleVideo} />
            </div>
          </Card>
        </div>
      </main>
    </PageShell>
  );
}
