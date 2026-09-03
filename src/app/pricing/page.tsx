import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { billingPlans } from "@/lib/billing-plans";

export default function PricingPage() {
  return (
    <PageShell>
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl mb-4">Simple, honest pricing</h1>
          <p className="text-charcoal-teal/80 max-w-xl mx-auto">
            One plan per family, no hidden add-ons. Cancel any time.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {billingPlans.map((p) => (
            <Card
              key={p.name}
              tint={p.highlighted ? "teal" : "white"}
              className={p.highlighted ? "ring-2 ring-teal-700" : ""}
            >
              {p.highlighted && (
                <span className="inline-block bg-teal-900 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  MOST POPULAR
                </span>
              )}
              <h2 className="font-display font-bold text-xl">{p.name}</h2>
              <p className="font-display font-bold text-3xl mt-2 mb-4">{p.price}</p>
              <ul className="space-y-2 text-sm text-charcoal-teal/80 mb-6">
                {p.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <Button href="/register/parent" variant={p.highlighted ? "primary" : "outline"} className="w-full justify-center">
                Choose plan
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
