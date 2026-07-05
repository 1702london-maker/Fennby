import { PageShell } from "@/components/PageShell";
import { SchoolCohortCard } from "@/components/SchoolCohortCard";
import { schoolClasses } from "@/lib/seed-data";

export default function SchoolCohortsPage() {
  return (
    <PageShell>
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Cohorts</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schoolClasses.map((c) => (
            <SchoolCohortCard key={c.id} schoolClass={c} href="/school/pupils" />
          ))}
        </div>
      </main>
    </PageShell>
  );
}
