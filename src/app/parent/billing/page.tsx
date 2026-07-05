import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { billing } from "@/lib/mock-data";

export default function BillingPage() {
  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-8">Billing &amp; subscription</h1>

        <section className="grid sm:grid-cols-2 gap-6 mb-8">
          <Card tint="teal">
            <p className="text-sm font-semibold text-charcoal-teal/70">Current plan</p>
            <p className="font-display font-bold text-xl mt-1">{billing.plan}</p>
            <p className="text-charcoal-teal/80 mt-1">{billing.price}</p>
          </Card>
          <Card>
            <p className="text-sm font-semibold text-charcoal-teal/70">Payment method</p>
            <p className="font-display font-bold text-xl mt-1">{billing.paymentMethod}</p>
            <p className="text-charcoal-teal/70 text-sm mt-1">Next invoice: {billing.nextInvoiceDate}</p>
          </Card>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-bold text-lg mb-4">Invoice history</h2>
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
                {billing.invoices.map((inv) => (
                  <tr key={inv.id} className="border-t border-teal-100">
                    <td className="py-2 pr-4">{inv.date}</td>
                    <td className="py-2 pr-4">{inv.amount}</td>
                    <td className="py-2 text-sage-600 font-semibold">{inv.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>

        <section>
          <h2 className="font-display font-bold text-lg mb-4">Compare plans</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {billing.plans.map((p) => (
              <Card key={p.name} tint={p.current ? "teal" : "white"} className={p.current ? "ring-2 ring-teal-700" : ""}>
                <p className="font-display font-bold">{p.name}</p>
                <p className="font-display font-bold text-2xl mt-1 mb-3">{p.price}</p>
                <ul className="text-sm text-charcoal-teal/80 space-y-1 mb-4">
                  {p.features.map((f) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
                <Button variant={p.current ? "primary" : "outline"} className="w-full justify-center">
                  {p.current ? "Current plan" : "Switch plan"}
                </Button>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
