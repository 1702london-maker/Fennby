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
    body: "Cohort dashboards, Pupil Premium impact reports, and inter-school visibility built in from day one.",
    color: "teal" as const,
  },
  {
    title: "Clarity should feel calm enough to trust",
    body: "A more luxurious interpretation of Fennby's original promise-led pattern.",
    color: "dark" as const,
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
              <Button href="/register/parent" variant="primary">I&apos;m a parent</Button>
              <Button href="/apply-tutor" variant="outline">I&apos;m a tutor</Button>
              <Button href="/for-schools" variant="ghost">I&apos;m a school</Button>
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
            One ecosystem, six commitments
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <Card
                key={p.title}
                tint={p.color === "coral" ? "coral" : p.color === "dark" ? "dark" : p.color === "sage" ? "white" : "teal"}
              >
                <h3 className="font-display font-bold text-lg mb-2">{p.title}</h3>
                <p className={`leading-relaxed ${p.color === "dark" ? "text-white/70" : "text-charcoal-teal/80"}`}>{p.body}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Mock exams detail */}
        <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">MOCK EXAMS</span>
            <h2 className="font-display font-bold text-3xl mb-4">Three ways to sit a mock — because children prepare differently</h2>
            <p className="text-charcoal-teal/80 leading-relaxed mb-4">
              A digital mode for children who prefer typing straight onto the screen. A
              print-and-shade mode for children who need to write by hand — print at home,
              complete on paper, photograph it, and our marking pipeline reads it. And a
              full timed simulation mode that replicates real exam conditions exactly:
              no pause, no hints, distraction-free.
            </p>
            <p className="text-charcoal-teal/80 leading-relaxed">
              Every mode feeds the same topic-level analysis, so a parent or tutor always
              sees one joined-up picture of progress, not three disconnected scorecards.
            </p>
            <Button href="/child/mock-exams" variant="outline" className="mt-6">See the mock exam flow</Button>
          </div>
          <Card tint="coral">
            <ul className="space-y-3 text-charcoal-teal/85">
              <li>✓ Shuffled question order, reproducible for audit</li>
              <li>✓ Auto-marked, instant topic-by-topic breakdown</li>
              <li>✓ Weak topics automatically become a revision plan</li>
              <li>✓ A mandatory 5-minute brain warm-up before every mock</li>
            </ul>
          </Card>
        </section>

        {/* Parent dashboard detail */}
        <section className="bg-teal-100">
          <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
            <Card className="order-2 md:order-1">
              <ul className="space-y-3 text-charcoal-teal/85">
                <li>✓ Every child&apos;s score, mood, and session in one place</li>
                <li>✓ A full, unedited message log — nothing hidden</li>
                <li>✓ Since-last-month comparisons that feel like real news</li>
                <li>✓ Revision plan and achievements, always up to date</li>
              </ul>
            </Card>
            <div className="order-1 md:order-2">
              <span className="inline-block bg-coral-100 text-coral-600 text-xs font-bold px-3 py-1 rounded-full mb-4">PARENT DASHBOARD</span>
              <h2 className="font-display font-bold text-3xl mb-4 text-teal-900">Watch your child visibly grow, not just get told they are</h2>
              <p className="text-charcoal-teal/80 leading-relaxed mb-6">
                Most tutoring apps show a parent a single number after weeks of silence.
                Fennby&apos;s parent dashboard updates the moment your child finishes a mock,
                sends a message, or completes a session — so &quot;how&apos;s it going&quot;
                stops being a guess.
              </p>
              <Button href="/register/parent" variant="primary">Create a parent account</Button>
            </div>
          </div>
        </section>

        {/* Tutor marketplace detail */}
        <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-plum-700/10 text-plum-700 text-xs font-bold px-3 py-1 rounded-full mb-4">TUTORS</span>
            <h2 className="font-display font-bold text-3xl mb-4">A tutor marketplace built on vetting, not just reviews</h2>
            <p className="text-charcoal-teal/80 leading-relaxed mb-4">
              Every tutor on Fennby completes the same rigorous pipeline before ever meeting a
              child: identity verification, an enhanced DBS check, a signed conduct agreement,
              and a full safeguarding training course — tracked module by module. A tutor whose
              DBS check lapses is automatically blocked from new assignments at the database
              level, not by someone remembering to check a spreadsheet.
            </p>
            <p className="text-charcoal-teal/80 leading-relaxed">
              Parents can browse tutors by subject and experience, message them directly, and
              see every lesson note the moment it&apos;s written.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Button href="/parent/tutors" variant="outline">Browse tutors</Button>
              <Button href="/apply-tutor" variant="ghost">Apply to tutor</Button>
            </div>
          </div>
          <Card tint="teal">
            <ul className="space-y-3 text-charcoal-teal/85">
              <li>✓ Enhanced DBS + barred-list check, every tutor, before assignment</li>
              <li>✓ 8-module safeguarding &amp; teaching standards training</li>
              <li>✓ Session notes are parent-visible immediately, never optional</li>
              <li>✓ Suspension cancels all future sessions instantly</li>
            </ul>
          </Card>
        </section>

        {/* School reporting detail */}
        <section className="bg-teal-100">
          <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block bg-white text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">FOR SCHOOLS</span>
              <h2 className="font-display font-bold text-3xl mb-4 text-teal-900">Cohort-level insight, without the spreadsheet wrangling</h2>
              <p className="text-charcoal-teal/80 leading-relaxed mb-6">
                Schools get a live view of class and year-group progress, homework completion,
                and pupils who need intervention — plus a Pupil Premium impact report ready to
                use in a statutory strategy statement, generated from real usage data rather than
                estimated.
              </p>
              <Button href="/for-schools" variant="primary">Explore for schools</Button>
            </div>
            <Card>
              <ul className="space-y-3 text-charcoal-teal/85">
                <li>✓ Class and year-group progress dashboards</li>
                <li>✓ Pupil Premium &amp; FSM impact reporting</li>
                <li>✓ High-priority intervention flagging</li>
                <li>✓ Homework assignment at pupil, class, or year-group level</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Trust teaser — light tint, not a dark full-bleed block */}
        <section>
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
            <div className="rounded-3xl bg-teal-100 p-6">
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
            Create a real account and see exactly what a family, tutor, or school sees —
            no sample data, no walkthrough required.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/register/parent" variant="primary">Create a parent account</Button>
            <Button href="/register/school" variant="secondary">Register your school</Button>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
