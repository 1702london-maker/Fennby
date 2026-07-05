import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const dates = [
  { week: "Week 1", dates: "27–31 July 2026", theme: "Reasoning & Puzzles" },
  { week: "Week 2", dates: "3–7 August 2026", theme: "Craft & Making" },
  { week: "Week 3", dates: "10–14 August 2026", theme: "Confidence & Exam Skills" },
];

const included = [
  "Daily brain warm-ups and small-group mock exam practice",
  "A craft/vocational taster session each week",
  "Supervised free play and wellbeing check-ins",
  "A end-of-week progress note home to parents",
  "Nutritious snacks included",
];

export default function SummerCampsPage() {
  return (
    <PageShell>
      <main>
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-coral-100 text-coral-600 text-xs font-bold px-3 py-1 rounded-full mb-4">
              SUMMER 2026 · TRAFFORD
            </span>
            <h1 className="font-display font-bold text-4xl leading-tight text-balance">
              A summer that builds confidence, not just fills time.
            </h1>
            <p className="mt-6 text-lg text-charcoal-teal/80 leading-relaxed max-w-lg">
              Fennby Summer Camps blend academic warm-ups, craft sessions, and supervised play —
              structured, safe, and genuinely enjoyable for children aged 7–11.
            </p>
            <Button href="#enrol" variant="primary" className="mt-8">Book a place</Button>
          </div>
          <Card tint="coral" className="flex items-center justify-center h-64">
            <span className="text-6xl" aria-hidden>☀️🎒🧩</span>
          </Card>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="font-display font-bold text-2xl mb-6">This summer&apos;s dates</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {dates.map((d) => (
              <Card key={d.week} tint="teal">
                <p className="text-sm font-semibold text-teal-900">{d.week}</p>
                <p className="font-display font-bold text-lg mt-1">{d.dates}</p>
                <p className="text-charcoal-teal/80 mt-2">{d.theme}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-12">
          <Card>
            <h2 className="font-display font-bold text-lg mb-4">What&apos;s included</h2>
            <ul className="space-y-2 text-charcoal-teal/80">
              {included.map((i) => (
                <li key={i}>✓ {i}</li>
              ))}
            </ul>
          </Card>
        </section>

        <section id="enrol" className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display font-bold text-3xl mb-4">Book your child&apos;s place</h2>
          <p className="text-charcoal-teal/80 mb-8">
            Spaces are limited to keep supervision ratios safe and personal.
            Create a parent account to register interest for your child.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/register/parent" variant="secondary">Create account &amp; book</Button>
            <Button href="/parent/activities" variant="outline">View activities dashboard</Button>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
