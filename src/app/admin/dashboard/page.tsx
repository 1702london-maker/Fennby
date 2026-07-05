import { PageShell } from "@/components/PageShell";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/Card";
import { getDashboardStats } from "@/features/admin/queries";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

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

        <Card>
          <p className="text-sm text-charcoal-teal/80">
            Revenue and system health metrics are placeholders until billing and infrastructure
            monitoring are wired to real data.
          </p>
        </Card>
      </main>
    </PageShell>
  );
}
