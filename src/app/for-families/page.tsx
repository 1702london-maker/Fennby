import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ProgressRing } from "@/components/ProgressRing";

const features = [
  { title: "Mock exams", body: "Digital, print-and-shade, and full timed simulation modes, all auto-marked.", href: "/child/mock-exams" },
  { title: "Vetted tutors", body: "Every tutor DBS-checked, trained, and signed before ever meeting your child.", href: "/parent/tutors" },
  { title: "AI Tutor, with a summary sent to you", body: "Practice help any time of day, strictly educational, with a written recap after every session.", href: "/ai-tutor-safety" },
  { title: "Parent dashboard", body: "Real-time visibility into every score, message, and session.", href: "/parent" },
  { title: "Vocational & craft track", body: "Bag making, shoemaking, and sewing — supervised, structured mastery.", href: "/vocational" },
  { title: "Summer camps", body: "A summer that builds confidence, not just fills time.", href: "/summer-camps" },
  { title: "Home Ed & EOTAS", body: "A full curriculum-aligned education, without requiring school enrolment.", href: "/home-ed-eotas" },
  { title: "SEND & Accessibility", body: "Built in for every family, free on every plan, with 20% off for SEND children.", href: "/send-accessibility" },
];

const steps = [
  { title: "Register and add your child", body: "A few details about your child, their year group, and what they're working towards." },
  { title: "Set their learning preferences", body: "Font, text size, colour, extra time, whatever helps them, chosen once and applied everywhere." },
  { title: "Get matched with a vetted tutor", body: "DBS-checked, trained, and signed before they ever meet your child." },
  { title: "Watch progress happen in real time", body: "Every mock, message, and session lands on your dashboard as it happens." },
];

export default function ForFamiliesPage() {
  return (
    <PageShell>
      <main>
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-14 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
              FOR FAMILIES
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight text-charcoal-teal text-balance">
              Everything your child needs to prepare, and everything you need to see it happening.
            </h1>
            <p className="mt-6 text-lg text-charcoal-teal/80 leading-relaxed max-w-lg">
              11+ is where Fennby started, and it&apos;s still our anchor, but it&apos;s not the
              whole picture. Maths, English, the sciences, and French, Spanish, and German are
              all here too, spanning Key Stage 1 right through to A-Level.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/register/parent" variant="primary">Create a parent account</Button>
              <Button href="/login?as=parent" variant="outline">Log in</Button>
              <Button href="/pricing" variant="ghost">See pricing</Button>
            </div>
          </div>
          <div className="flex justify-center">
            <Card tint="teal" className="w-full max-w-sm">
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
                78% on today&apos;s mock, up from 65% last month, all visible to you as it happens.
              </p>
            </Card>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-8">
          <h2 className="font-display font-bold text-2xl mb-6">Everything included</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <Card key={f.title}>
                <p className="font-display font-bold text-lg">{f.title}</p>
                <p className="text-sm text-charcoal-teal/80 mt-1 mb-4">{f.body}</p>
                <Button href={f.href} variant="outline">Explore</Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-teal-100">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="font-display font-bold text-2xl mb-8 text-teal-900">Getting started takes four steps</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {steps.map((s, i) => (
                <div key={s.title}>
                  <span className="font-display font-bold text-3xl text-teal-900/40">{String(i + 1).padStart(2, "0")}</span>
                  <p className="font-display font-bold mt-2 mb-1">{s.title}</p>
                  <p className="text-sm text-charcoal-teal/75">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-16">
          <Card tint="coral">
            <p className="text-charcoal-teal/85 leading-relaxed">
              Fennby is built with SEND families in mind from the ground up, not as an add-on.
              Every accommodation is free on every plan, and any child with a SEND profile gets
              20% off their family subscription. See{" "}
              <a href="/send-accessibility" className="font-semibold text-brick-600 hover:underline">SEND &amp; Accessibility</a>.
            </p>
          </Card>
        </section>

        <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/register/parent" variant="primary">Create a parent account</Button>
            <Button href="/ai-tutor-safety" variant="outline">How the AI Tutor stays safe</Button>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
