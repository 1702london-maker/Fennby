import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { getMyEarnings } from "@/features/tutors/earningsQueries";

export default async function TutorEarningsPage() {
  const { sessions, totalGross, totalCommission, totalNet, unpaidNet } = await getMyEarnings();

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-1">Earnings</h1>
        <p className="text-charcoal-teal/70 mb-8">
          Fennby takes a flat 12.9% commission on every session, no sliding scale, and passes
          through the real card processing fee, nothing marked up.
        </p>

        {sessions.length ? (
          <>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <Card tint="teal">
                <p className="text-xs font-bold uppercase text-teal-900/70">Gross earned</p>
                <p className="font-display font-bold text-2xl mt-1">£{totalGross.toFixed(2)}</p>
              </Card>
              <Card>
                <p className="text-xs font-bold uppercase text-charcoal-teal/60">Commission (12.9%)</p>
                <p className="font-display font-bold text-2xl mt-1">£{totalCommission.toFixed(2)}</p>
              </Card>
              <Card tint="coral">
                <p className="text-xs font-bold uppercase text-brick-600">Owed to you</p>
                <p className="font-display font-bold text-2xl mt-1">£{unpaidNet.toFixed(2)}</p>
              </Card>
            </div>

            <h2 className="font-display font-bold text-lg mb-4">Session history</h2>
            <div className="space-y-3">
              {sessions.map((s) => (
                <Card key={s.id} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{s.subject ?? "Session"} with {s.learners?.preferred_name ?? "a student"}</p>
                    <p className="text-sm text-charcoal-teal/70">
                      {s.scheduled_at ? new Date(s.scheduled_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display font-bold">£{s.net.toFixed(2)}</p>
                    <p className="text-xs text-charcoal-teal/60">of £{(s.hourly_rate ?? 0).toFixed(2)} gross</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.payment_status === "paid" ? "bg-sage-600/15 text-sage-600" : "bg-coral-100 text-brick-600"}`}>
                      {s.payment_status === "paid" ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            <p className="text-sm text-charcoal-teal/60 mt-6">
              Total paid out to date: £{(totalNet - unpaidNet).toFixed(2)}
            </p>
          </>
        ) : (
          <Card>
            <EmptyState
              emoji="💷"
              title="No completed sessions yet"
              description="Once you complete a paid session, it will appear here with the flat 12.9% commission already worked out."
            />
          </Card>
        )}
      </main>
    </PageShell>
  );
}
