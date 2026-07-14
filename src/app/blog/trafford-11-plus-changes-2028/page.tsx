import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function TraffordChangesPost() {
  return (
    <PageShell>
      <main>
        <section className="max-w-3xl mx-auto px-6 pt-16 pb-10">
          <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
            11+ PREPARATION GUIDANCE
          </span>
          <p className="text-sm text-charcoal-teal/60 mb-2">Published 14 July 2026</p>
          <h1 className="font-display font-bold text-4xl leading-tight text-balance mb-6">
            Trafford grammar schools are changing the 11+ from 2028. Here&apos;s what it actually means.
          </h1>
          <p className="text-lg text-charcoal-teal/80 leading-relaxed">
            The Trafford Grammar School Consortium has confirmed it is replacing its long-standing
            GL Assessment test with a new provider, Future Stories Community Enterprise (FSCE),
            starting with 2028 entry. If you have a child in Year 4 or below, this genuinely
            changes how you should be preparing, and starting now rather than later matters more
            than it used to.
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-6">
          <Card tint="teal" className="mb-8">
            <p className="font-display font-bold mb-2">The short version</p>
            <ul className="space-y-2 text-sm text-charcoal-teal/85">
              <li>✓ Out: verbal reasoning, non-verbal reasoning, and mathematical reasoning papers</li>
              <li>✓ In: a test on the actual Key Stage 2 English and Maths curriculum, up to the end of Year 5</li>
              <li>✓ Timing moves earlier: from September of Year 6 to the summer term of Year 5</li>
              <li>✓ 2027 entry is unaffected — GL Assessment continues as normal for that cohort</li>
              <li>✓ The new format applies from 2028 entry (tested September 2027) and fully from 2029 entry (tested summer of Year 5)</li>
            </ul>
          </Card>

          <h2 className="font-display font-bold text-2xl mb-3">Why they&apos;re changing it</h2>
          <p className="text-charcoal-teal/85 leading-relaxed mb-6">
            FSCE has been explicit about the reasoning behind the switch: it wants a test that
            reflects a child&apos;s actual academic ability from ordinary schooling, not how many
            hours of specialist verbal and non-verbal reasoning drilling a family could afford.
            Reasoning-style papers reward pattern recognition that&apos;s taught almost nowhere in
            a normal Year 5 or Year 6 classroom, which is exactly why an entire industry of
            reasoning-specific crammers exists around them. A curriculum-based test closes that
            gap, at least in principle, by testing what schools are already meant to be teaching.
          </p>

          <h2 className="font-display font-bold text-2xl mb-3">What this means for your family</h2>
          <p className="text-charcoal-teal/85 leading-relaxed mb-4">
            Two things change at once, and they pull in different directions for how you should
            prepare.
          </p>
          <p className="text-charcoal-teal/85 leading-relaxed mb-4">
            First, the content itself shifts from an artificial reasoning skill toward something
            much closer to &quot;is my child solid on Year 5 Maths and English.&quot; That&apos;s
            good news if your child has always struggled with the strange logic-puzzle style of
            VR/NVR papers despite being genuinely strong academically. It&apos;s less good news if
            you were relying on reasoning tutoring specifically, since that specialism is about to
            matter far less than broad, solid subject mastery.
          </p>
          <p className="text-charcoal-teal/85 leading-relaxed mb-6">
            Second, and just as important, the test now sits a full year earlier in a child&apos;s
            school life. A family used to starting serious preparation in Year 6 now needs to be
            ready by the summer of Year 5, which in practice means starting meaningfully in Year 4.
            If your child is currently in Year 3 or Year 4, this is the moment to start building
            genuine subject fluency, not the moment to start memorising reasoning tricks that
            won&apos;t even be tested.
          </p>

          <h2 className="font-display font-bold text-2xl mb-3">How Fennby fits this shift</h2>
          <p className="text-charcoal-teal/85 leading-relaxed mb-4">
            This is, honestly, closer to what Fennby was built around than the old reasoning-heavy
            format was. 11+ has always been our anchor, not our ceiling — our subject coverage
            already spans Maths and English (plus the sciences and languages) from Key Stage 1
            right through to A-Level, taught and tracked the same way whether or not a child is
            sitting an 11+ at the end of it. A curriculum-based test rewards exactly that kind of
            steady, broad subject work over isolated reasoning drilling.
          </p>
          <p className="text-charcoal-teal/85 leading-relaxed mb-6">
            Practically, that means real Maths and English mock exams your child can sit digitally,
            on paper, or under full timed conditions, tutors matched on subject strength rather
            than reasoning-puzzle specialism, and a parent dashboard that shows you exactly which
            topics need more work, not just a single score to worry about.
          </p>

          <Card tint="coral" className="mb-8">
            <p className="font-display font-bold mb-2">If your child is in Year 3 or Year 4 right now</p>
            <p className="text-sm text-charcoal-teal/85 leading-relaxed">
              You have a genuine head start if you begin building solid Maths and English
              foundations now, well before the summer Year 5 test date arrives. Waiting until Year
              5 itself to start is exactly the gap this change is designed to close for everyone
              else, so starting early is a real, usable advantage.
            </p>
          </Card>

          <div className="flex flex-wrap gap-4">
            <Button href="/register/parent" variant="primary">Create a parent account</Button>
            <Button href="/subjects" variant="outline">See our full subject range</Button>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
