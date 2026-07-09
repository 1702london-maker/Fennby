import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function AboutPage() {
  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
          Our story
        </span>
        <h1 className="font-display font-bold text-4xl mb-6">About Fennby</h1>

        <p className="text-charcoal-teal/85 leading-relaxed mb-6 text-lg">
          Fennby started with a single, ordinary frustration: a parent, checking in on a child&apos;s
          tutoring, being told &quot;it&apos;s going well&quot; and having no way to actually see that for
          themselves. No score history, no session notes, no record of what was covered — just a
          weekly invoice and a feeling of hoping for the best.
        </p>

        <p className="text-charcoal-teal/85 leading-relaxed mb-6">
          The 11+ tutoring industry in the UK is enormous and largely informal — a patchwork of
          independent tutors, small agencies, and franchise centres, most of them doing honest work,
          almost none of them giving families real visibility into it. Vetting varies wildly.
          Safeguarding is often a signature on a form rather than something enforced day to day.
          And a child&apos;s progress usually lives in one person&apos;s head, not in a record anyone
          else can check.
        </p>

        <p className="text-charcoal-teal/85 leading-relaxed mb-6">
          We built Fennby to close that gap — not with more marketing promises, but with
          architecture. Every tutor completes identity verification, an enhanced DBS check, and a
          signed conduct agreement before ever meeting a child, enforced at the database level, not
          by someone remembering to check a spreadsheet. Every message between a tutor and a child
          is visible to a parent, always, with no private thread that excludes them. Every mock
          exam, every session note, every score is recorded the moment it happens, not summarised
          into a vague update weeks later.
        </p>

        <p className="text-charcoal-teal/85 leading-relaxed mb-6">
          Fennby is a whole-child ecosystem, not just an 11+ crammer. Alongside mock exams and
          tutoring, we run a vocational and craft track — bag making, shoemaking, sewing — because
          we think a child&apos;s confidence shouldn&apos;t rest entirely on a single exam score. And
          accessibility isn&apos;t an add-on: extra time, read-aloud, dyslexia-friendly fonts, and
          other accommodations are available to every family from day one, never gated behind proof
          of a diagnosis.
        </p>

        <p className="text-charcoal-teal/85 leading-relaxed mb-10">
          We&apos;re still early. But everything we build starts from the same question: if a
          parent, a school, or a safeguarding lead looked closely at this feature right now, would
          they see exactly what&apos;s really happening? If the honest answer is no, we haven&apos;t
          finished building it yet.
        </p>

        <Card tint="teal">
          <p className="text-charcoal-teal/85 leading-relaxed">
            Curious how the visibility promise actually works underneath the product? Read our{" "}
            <a href="/trust" className="font-semibold text-teal-900 hover:underline">
              Trust &amp; Safeguarding framework
            </a>{" "}
            for the detail.
          </p>
        </Card>

        <div className="flex flex-wrap gap-4 mt-8">
          <Button href="/register/parent" variant="primary">Create a parent account</Button>
          <Button href="/careers" variant="outline">See open roles</Button>
        </div>
      </main>
    </PageShell>
  );
}
