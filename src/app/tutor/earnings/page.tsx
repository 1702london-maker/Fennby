import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";

const payouts = [
  { id: "p1", date: "2026-07-01", amount: "£420.00", status: "Paid" },
  { id: "p2", date: "2026-06-01", amount: "£380.00", status: "Paid" },
];

export default function TutorEarningsPage() {
  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Earnings</h1>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="This month" value="£420.00" tint="teal" />
          <StatCard label="Sessions taught" value="14" />
          <StatCard label="Next payout" value="1 Aug" tint="coral" />
        </div>
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-charcoal-teal/60">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p.id} className="border-t border-teal-100">
                  <td className="py-2 pr-4">{p.date}</td>
                  <td className="py-2 pr-4">{p.amount}</td>
                  <td className="py-2 text-sage-600 font-semibold">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </PageShell>
  );
}
