import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const crafts = [
  { name: "Bag Making", icon: "👜", body: "Children design and stitch their own bag from start to finish, learning planning, measuring, and fine motor skill." },
  { name: "Shoemaking", icon: "👟", body: "A structured introduction to shoemaking fundamentals — cutting, shaping, and assembling under close supervision." },
  { name: "Sewing", icon: "🧵", body: "Foundational sewing skills through fun, achievable projects that build real confidence and patience." },
];

export default function VocationalPage() {
  return (
    <PageShell>
      <main>
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-plum-700/10 text-plum-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
              AGES 7–11
            </span>
            <h1 className="font-display font-bold text-4xl leading-tight text-balance">
              A whole child isn&apos;t just a test score. Craft skills that build real mastery.
            </h1>
            <p className="mt-6 text-lg text-charcoal-teal/80 leading-relaxed max-w-lg">
              Fennby&apos;s vocational and craft track — bag making, shoemaking, and sewing —
              gives children a structured, supervised way to build patience, precision, and
              pride in something they made with their own hands.
            </p>
            <Button href="#enrol" variant="primary" className="mt-8">Enrol your child</Button>
          </div>
          <Card tint="teal" className="flex items-center justify-center h-64">
            <span className="text-6xl" aria-hidden>🧵👜👟</span>
          </Card>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid sm:grid-cols-3 gap-6">
            {crafts.map((c) => (
              <Card key={c.name}>
                <span className="text-4xl" aria-hidden>{c.icon}</span>
                <h2 className="font-display font-bold text-lg mt-3 mb-2">{c.name}</h2>
                <p className="text-charcoal-teal/80 leading-relaxed">{c.body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-teal-100">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <h2 className="font-display font-bold text-3xl mb-6 text-teal-900">Supervision and safety, taken seriously</h2>
            <ul className="space-y-3 text-charcoal-teal/85 leading-relaxed">
              <li>✓ Craft supervisors follow a distinct vetting pipeline — DBS, physical safety training, and first-aid certification, alongside the same identity and safeguarding checks every tutor completes.</li>
              <li>✓ Verified public and products liability insurance held before any physical session runs.</li>
              <li>✓ Session locations are pre-approved for safety and accessibility.</li>
              <li>✓ Parental consent specific to physical/vocational activity, separate from general platform consent.</li>
            </ul>
          </div>
        </section>

        <section id="enrol" className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display font-bold text-3xl mb-4">Ready to enrol?</h2>
          <p className="text-charcoal-teal/80 mb-8">
            Places are limited per supervised session to keep ratios safe and attention high.
            Create a parent account to register interest for your child.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/register/parent" variant="secondary">Create account &amp; enrol</Button>
            <Button href="/trust" variant="outline">Read our safety framework</Button>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
