import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ProgressRing } from "@/components/ProgressRing";
import Link from "next/link";

const pillars = [
  {
    title: "Mock exams that actually feel like preparation",
    body: "Digital, print-and-shade, and full timed simulation — every mode auto-marked, every topic tracked.",
    color: "teal" as const,
  },
  {
    title: "Every tutor vetted, DBS-checked, signed",
    body: "No tutor is ever matched with a child before identity checks, an enhanced DBS check, and a signed conduct agreement.",
    color: "plum" as const,
  },
  {
    title: "Nothing hidden from you",
    body: "Every message, every score, every session note — visible to parents, in real time, always.",
    color: "coral" as const,
  },
  {
    title: "A whole child, not just a test score",
    body: "Vocational and craft tracks — bag making, shoemaking, sewing — supervised, structured, building real mastery.",
    color: "sage" as const,
  },
  {
    title: "Built for schools, not just families",
    body: "Cohort dashboards, Pupil Premium impact reports, and inter-school quizzes that make the whole network stronger.",
    color: "teal" as const,
  },
];

export default function Home() {
  return (
    <PageShell>
      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight text-charcoal-teal text-balance">
              The only tutoring platform where nothing about your child is hidden from you.
            </h1>
            <p className="mt-6 text-lg text-charcoal-teal/80 leading-relaxed max-w-lg">
              Fennby is a whole-child ecosystem — mock exams, vetted tutors, real progress
              you can see happening — built so every message, every score, and every session
              is visible to you, always.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/parent" variant="primary">I&apos;m a parent</Button>
              <Button href="/apply-tutor" variant="outline">I&apos;m a tutor</Button>
              <Button href="/school" variant="ghost">I&apos;m a school</Button>
            </div>
          </div>
          <div className="flex justify-center">
            <Card tint="teal" className="relative w-full max-w-sm">
              <p className="font-display font-bold text-sm text-teal-900 mb-4">Amara&apos;s progress this week</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center gap-2">
                  <ProgressRing progress={78} size={88} color="teal" />
                  <span className="text-xs font-semibold text-center">Verbal Reasoning</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ProgressRing progress={84} size={88} color="sage" />
                  <span className="text-xs font-semibold text-center">English</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-charcoal-teal/70">
                78% on today&apos;s mock — up from 65% last month.
              </p>
            </Card>
          </div>
        </section>

        {/* Pillars */}
        <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-display font-bold text-3xl text-center mb-12">
            One ecosystem, five commitments
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <Card key={p.title} tint={p.color === "coral" ? "coral" : p.color === "sage" ? "white" : "teal"}>
                <h3 className="font-display font-bold text-lg mb-2">{p.title}</h3>
                <p className="text-charcoal-teal/80 leading-relaxed">{p.body}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Trust teaser — light tint, not a dark full-bleed block */}
        <section className="bg-teal-100">
          <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display font-bold text-3xl mb-4 text-teal-900">
                Safeguarding isn&apos;t a policy page. It&apos;s the architecture.
              </h2>
              <p className="text-charcoal-teal/80 leading-relaxed max-w-md">
                No adult on Fennby ever has unsupervised, unlogged contact with a child.
                Enhanced DBS checks, signed agreements, and full parent visibility are
                enforced at the database level — not just written down.
              </p>
              <Link
                href="/trust"
                className="inline-block mt-6 font-semibold underline underline-offset-4 text-teal-900 hover:text-coral-600"
              >
                Read our Trust &amp; Safeguarding framework →
              </Link>
            </div>
            <div className="rounded-3xl bg-white p-6">
              <ul className="space-y-3 text-charcoal-teal">
                <li>✓ Enhanced DBS + barred-list checks, re-verified on schedule</li>
                <li>✓ Every child-involved message visible to a parent, always</li>
                <li>✓ A named Designated Safeguarding Lead, contactable from every screen</li>
                <li>✓ UK GDPR + ICO Children&apos;s Code compliant by design</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="font-display font-bold text-3xl mb-4">Ready to see it for yourself?</h2>
          <p className="text-charcoal-teal/80 mb-8 max-w-xl mx-auto">
            Explore the parent dashboard, the kid experience, or the tutor workspace —
            this preview uses sample data so you can see exactly what a real family sees.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/parent" variant="primary">See the parent dashboard</Button>
            <Button href="/child/today" variant="secondary">See the child experience</Button>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
