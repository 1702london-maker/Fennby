import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <PageShell>
      <main className="max-w-xl mx-auto px-6 py-24 text-center">
        <Card tint="teal">
          <span className="text-6xl" aria-hidden>🧭</span>
          <h1 className="font-display font-bold text-3xl mt-4 mb-2">This page wandered off</h1>
          <p className="text-charcoal-teal/80 leading-relaxed mb-6">
            We couldn&apos;t find what you were looking for — but there&apos;s plenty to explore
            back on Fennby.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button href="/" variant="primary">Back to home</Button>
            <Button href="/trust" variant="outline">Trust &amp; Safeguarding</Button>
          </div>
        </Card>
      </main>
    </PageShell>
  );
}
