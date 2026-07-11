import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { getMySubscriptionStatus } from "@/features/billing/actions";
import { BillingCheckoutButton } from "./BillingCheckoutButton";

const STATUS_COPY: Record<string, { title: string; body: string; tint: "teal" | "coral" | "white" }> = {
  pending: {
    title: "One step left: set up your subscription",
    body: "Your account is created, but nothing unlocks until your family subscription is active. This covers every subject, the AI Tutor, The Workshop, and finding a tutor, all in one price.",
    tint: "coral",
  },
  active: {
    title: "Your subscription is active",
    body: "Everything is unlocked: full subject range, the AI Tutor, The Workshop, and tutor booking.",
    tint: "teal",
  },
  grace_period: {
    title: "There's an issue with your last payment",
    body: "Your card didn't go through. You still have access for a few more days while this gets sorted, update your payment details below before access pauses.",
    tint: "coral",
  },
  suspended: {
    title: "Your subscription has lapsed",
    body: "Access is paused until your subscription is reactivated. Nothing about your child's data or history has been lost.",
    tint: "coral",
  },
};

export default async function ParentBillingPage() {
  const status = (await getMySubscriptionStatus()) ?? "pending";
  const copy = STATUS_COPY[status] ?? STATUS_COPY.pending;

  return (
    <PageShell>
      <main className="max-w-xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-3xl mb-8">Billing</h1>
        <Card tint={copy.tint}>
          <p className="font-display font-bold text-lg mb-2">{copy.title}</p>
          <p className="text-charcoal-teal/80 leading-relaxed mb-6">{copy.body}</p>
          {status !== "active" && <BillingCheckoutButton />}
        </Card>
        <p className="text-sm text-charcoal-teal/60 mt-6">
          One family subscription unlocks everything: full subject and language range, the AI
          Tutor, The Workshop, brain warm-ups, and the ability to find and book vetted tutors.
          There&apos;s no separate paywall inside it.
        </p>
      </main>
    </PageShell>
  );
}
