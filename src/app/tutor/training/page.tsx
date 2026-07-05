import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";

const steps = [
  { title: "Identity & DBS verification", body: "Enhanced DBS check with barred-list screening, plus identity verification." },
  { title: "Reference checks", body: "Prior work with children reviewed where applicable." },
  { title: "Signed agreement", body: "A clear conduct and safeguarding agreement, signed and timestamped." },
  { title: "Safeguarding & platform training", body: "Our training academy unlocks only after the agreement is signed." },
  { title: "Matching", body: "Once fully vetted, you're matched with families based on specialism and availability." },
];

export default function TutorTrainingPage() {
  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-4xl mb-4">Tutor training &amp; vetting</h1>
        <p className="text-charcoal-teal/80 leading-relaxed mb-10 max-w-2xl">
          Every tutor completes the same rigorous pipeline before ever meeting a child — no
          exceptions, no shortcuts.
        </p>
        <div className="space-y-4">
          {steps.map((s, i) => (
            <Card key={s.title} className="flex gap-4 items-start">
              <span className="font-display font-bold text-2xl text-teal-900 w-8 shrink-0">{i + 1}</span>
              <div>
                <h2 className="font-display font-bold text-lg">{s.title}</h2>
                <p className="text-charcoal-teal/80 mt-1">{s.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
