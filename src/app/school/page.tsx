"use client";

import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ProgressRing } from "@/components/ProgressRing";
import { schoolCohort } from "@/lib/mock-data";

export default function SchoolDashboard() {
  const avg = Math.round(schoolCohort.reduce((a, p) => a + p.progress, 0) / schoolCohort.length);
  const ppCount = schoolCohort.filter((p) => p.pupilPremium).length;
  const topPerformers = [...schoolCohort].sort((a, b) => b.progress - a.progress).slice(0, 5);

  return (
    <PageShell>
      <main className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-charcoal-teal/70">Trafford Grammar Prep · Year 5/6 cohort</p>
        <h1 className="font-display font-bold text-3xl mb-8">Cohort dashboard</h1>

        <section className="grid sm:grid-cols-3 gap-4 mb-10">
          <Card tint="teal" className="flex items-center gap-4">
            <ProgressRing progress={100} size={64} strokeWidth={8} color="teal" showSpark={false} />
            <div>
              <p className="text-sm font-semibold text-charcoal-teal/70">Cohort size</p>
              <p className="font-display font-bold text-3xl">{schoolCohort.length}</p>
            </div>
          </Card>
          <Card tint="coral" className="flex items-center gap-4">
            <ProgressRing progress={avg} size={64} strokeWidth={8} color="coral" />
            <div>
              <p className="text-sm font-semibold text-charcoal-teal/70">Average progress</p>
              <p className="font-display font-bold text-3xl">{avg}%</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <ProgressRing progress={Math.round((ppCount / schoolCohort.length) * 100)} size={64} strokeWidth={8} color="plum" />
            <div>
              <p className="text-sm font-semibold text-charcoal-teal/70">Pupil Premium pupils</p>
              <p className="font-display font-bold text-3xl">{ppCount}</p>
            </div>
          </Card>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mb-10">
          <Card>
            <h2 className="font-display font-bold text-lg mb-4">Top performers this term</h2>
            <div className="space-y-3">
              {topPerformers.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{p.label} · {p.yearGroup}</span>
                  <span className="text-sm font-bold text-sage-600">{p.progress}%</span>
                </div>
              ))}
            </div>
          </Card>
          <Card tint="teal">
            <h2 className="font-display font-bold text-lg mb-3">Pupil Premium impact report</h2>
            <p className="text-sm text-charcoal-teal/80 mb-4">
              Export a plain-language report showing how Fennby usage links to progress for
              your Pupil Premium and FSM-eligible pupils — ready to use in your statutory
              Pupil Premium strategy statement.
            </p>
            <Button variant="primary">Export report</Button>
          </Card>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-bold text-lg mb-4">Anonymised pupil progress</h2>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-charcoal-teal/60">
                  <th className="py-2 pr-4">Pupil</th>
                  <th className="py-2 pr-4">Year</th>
                  <th className="py-2 pr-4">Pupil Premium</th>
                  <th className="py-2">Progress</th>
                </tr>
              </thead>
              <tbody>
                {schoolCohort.map((p) => (
                  <tr key={p.id} className="border-t border-teal-100">
                    <td className="py-2 pr-4 font-semibold">{p.label}</td>
                    <td className="py-2 pr-4">{p.yearGroup}</td>
                    <td className="py-2 pr-4">{p.pupilPremium ? "Yes" : "—"}</td>
                    <td className="py-2">{p.progress}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>

        <Card tint="coral">
          <p className="text-sm text-charcoal-teal/80">
            This is an early placeholder view. Full school B2B features — homework setting,
            auto-marking, and inter-school leaderboards — arrive in Phase 2 of the build.
          </p>
        </Card>
      </main>
    </PageShell>
  );
}
