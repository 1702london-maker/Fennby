import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const steps = [
  { num: "01", title: "Register and add your child", body: "A parent account first, then your child's profile: year group, subjects, and what they're working towards." },
  { num: "02", title: "Set learning preferences once", body: "Font, text size, colour, extra time, read-aloud, whatever helps them. Chosen once, applied everywhere automatically." },
  { num: "03", title: "Get matched with a vetted tutor", body: "DBS-checked, trained, and signed before they ever meet your child. SEND-experienced tutors weighted for children who benefit." },
  { num: "04", title: "Practise between sessions", body: "The Workshop for self-study, the AI Tutor for questions any time, real photo homework help, all strictly educational." },
  { num: "05", title: "Sit real mock exams", body: "Digital, print-and-shade, or full timed simulation, auto-marked, with accommodations applied automatically." },
  { num: "06", title: "Watch it all happen, live", body: "Every score, message, and session lands on your parent dashboard as it happens. Nothing delayed, nothing hidden." },
];

export default function HowItWorksPage() {
  return (
    <PageShell>
      <main>
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-14 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
              HOW IT WORKS
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight text-charcoal-teal text-balance">
              From registering to a real mock exam score, in six honest steps.
            </h1>
            <p className="mt-6 text-lg text-charcoal-teal/80 leading-relaxed max-w-lg">
              No hidden steps, no surprise upsells partway through. This is exactly what happens
              between creating an account and seeing your child&apos;s first result on your
              dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/register/parent" variant="primary">Create a parent account</Button>
              <Button href="/for-families" variant="outline">Explore for parents</Button>
            </div>
          </div>
          <div className="flex justify-center">
            <Card tint="teal" className="w-full max-w-sm">
              <p className="font-display font-bold text-sm text-teal-900 mb-3">Nothing hidden, ever</p>
              <ul className="space-y-2 text-sm text-charcoal-teal/85">
                <li>✓ No tutor meets a child unvetted</li>
                <li>✓ No AI Tutor message goes unseen by you</li>
                <li>✓ No accommodation costs extra</li>
                <li>✓ No progress update delayed to a report</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s) => (
              <Card key={s.num}>
                <span className="font-display font-bold text-3xl text-teal-900/30">{s.num}</span>
                <p className="font-display font-bold text-lg mt-2 mb-1">{s.title}</p>
                <p className="text-sm text-charcoal-teal/80 leading-relaxed">{s.body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-teal-100">
          <div className="max-w-4xl mx-auto px-6 py-14 text-center">
            <h2 className="font-display font-bold text-2xl mb-3 text-teal-900">Built for every subject and stage</h2>
            <p className="text-charcoal-teal/80 leading-relaxed max-w-xl mx-auto">
              11+ is our anchor, not our ceiling. Maths, English, the sciences, and French,
              Spanish, and German, from Key Stage 1 right through to A-Level.
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display font-bold text-3xl mb-4">Ready to see it for real?</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/register/parent" variant="primary">Get started as a parent</Button>
            <Button href="/trust" variant="outline">Read our safeguarding framework</Button>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
