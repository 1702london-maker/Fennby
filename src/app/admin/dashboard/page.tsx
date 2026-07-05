import { PageShell } from "@/components/PageShell";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/Card";
import {
  learners,
  profiles,
  tutorProfiles,
  schools,
  messages,
  safeguardingCases,
} from "@/lib/seed-data";

export default function AdminDashboard() {
  const pendingTutors = tutorProfiles.filter((t) => t.status !== "approved" && t.status !== "rejected");
  const parents = profiles.filter((p) => p.role === "parent");

  return (
    <PageShell>
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Platform admin</h1>

        <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Active learners" value={learners.length} tint="teal" />
          <StatCard label="Parents" value={parents.length} />
          <StatCard label="Tutors" value={tutorProfiles.length} />
          <StatCard label="Schools" value={schools.length} />
          <StatCard label="Pending tutor applications" value={pendingTutors.length} tint="coral" />
          <StatCard label="Pending school applications" value={schools.filter((s) => !s.approved).length} />
          <StatCard label="Messages sent" value={messages.length} />
          <StatCard label="Safeguarding cases" value={safeguardingCases.length} tint="coral" />
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
