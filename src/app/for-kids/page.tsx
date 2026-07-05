import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function ForKidsPage() {
  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="font-display font-bold text-4xl mb-4">Hey! This bit&apos;s for you.</h1>
        <p className="text-charcoal-teal/80 leading-relaxed mb-8 max-w-xl mx-auto">
          Fennby has brain warm-ups, mock exams that feel like mini-games, cool badges to earn,
          and a craft club where you make real things with your hands. Ready to see it?
        </p>
        <Card tint="coral" className="mb-8">
          <p className="font-display font-bold text-lg">Your grown-up can always see what you&apos;re up to — that&apos;s the deal that keeps everyone happy and safe.</p>
        </Card>
        <Button href="/child/today" variant="secondary">See what&apos;s inside</Button>
      </main>
    </PageShell>
  );
}
