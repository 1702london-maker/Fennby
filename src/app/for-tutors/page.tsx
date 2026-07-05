import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const steps = [
  "Apply with your experience, subjects, and DBS status",
  "We verify your identity and enhanced DBS check",
  "Sign our conduct and safeguarding agreement",
  "Complete safeguarding and platform training",
  "Get matched with families based on your specialism",
];

export default function ForTutorsPage() {
  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-4xl mb-4">For tutors</h1>
        <p className="text-charcoal-teal/80 mb-8 max-w-xl">
          Join a network built on trust — every family you work with can see your notes,
          your sessions, and every message, which means every family trusts you from day one.
        </p>
        <Card className="mb-8">
          <ol className="space-y-2 list-decimal list-inside text-charcoal-teal/85">
            {steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
        </Card>
        <Button href="/apply-tutor" variant="primary">Apply to tutor</Button>
      </main>
    </PageShell>
  );
}
