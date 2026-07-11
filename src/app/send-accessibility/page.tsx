import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const accommodations = [
  { icon: "🔤", name: "Dyslexia-friendly font", body: "A validated dyslexia-friendly typeface, available at the flick of a switch — independent of the rest of the site's design." },
  { icon: "🔍", name: "Adjustable text size", body: "Every screen reflows properly at a larger size, nothing breaks or overlaps." },
  { icon: "🎨", name: "Colour overlays", body: "A small set of soft tint overlays for children who experience visual stress or Irlen-type sensitivity." },
  { icon: "🧩", name: "Content in smaller pieces", body: "Mock exam questions and instructions can be shown in more manageable chunks instead of dense blocks." },
  { icon: "⏱️", name: "Extra time, automatically applied", body: "Set 25% or 50% extra time once, and it applies across digital, print-and-shade, and simulation modes — no need to remember to switch it on each time." },
  { icon: "🌿", name: "Low stimulation mode", body: "Turns down animation, badge-celebration intensity, and background decoration beyond our already-calm defaults." },
  { icon: "🗣️", name: "Symbol-supported communication", body: "Simple instructions and messages with symbol support, for children who benefit from it." },
  { icon: "☕", name: "Sensory break reminders", body: "A gentle, optional prompt during longer sessions, suggesting a short break." },
  { icon: "🔊", name: "Read-aloud, everywhere", body: "Every mock exam question, every message, and long pages like this one can be read aloud — reading speed and voice are yours to adjust." },
];

export default function SendAccessibilityPage() {
  return (
    <PageShell>
      <main>
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
          <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
            SEND &amp; ACCESSIBILITY
          </span>
          <h1 className="font-display font-bold text-4xl leading-tight text-balance max-w-3xl mx-auto">
            Accommodation isn&apos;t a special mode. It&apos;s built into the ordinary settings every family can open.
          </h1>
          <p className="mt-6 text-lg text-charcoal-teal/80 leading-relaxed max-w-2xl mx-auto">
            Over 1.6 million children in England have an identified special educational need. Fennby
            never asks a family to prove a diagnosis before switching on font size, extra time, or
            read-aloud — these are available to everyone, on every plan, always.
          </p>
          <Button href="/register/parent" variant="primary" className="mt-8">Get started</Button>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="font-display font-bold text-2xl mb-6 text-center">Every accommodation, available to every family</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {accommodations.map((a) => (
              <Card key={a.name}>
                <span className="text-3xl" aria-hidden>{a.icon}</span>
                <h3 className="font-display font-bold text-lg mt-3 mb-2">{a.name}</h3>
                <p className="text-sm text-charcoal-teal/80 leading-relaxed">{a.body}</p>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-charcoal-teal/60 mt-6">
            Find all of these under <strong>Settings → Learning Preferences</strong> once you&apos;re signed in — never behind a menu item labelled &quot;SEND.&quot;
          </p>
        </section>

        <section className="bg-teal-100">
          <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block bg-white text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">MOCK EXAMS</span>
              <h2 className="font-display font-bold text-3xl mb-4 text-teal-900">Print-and-shade is already an accommodation</h2>
              <p className="text-charcoal-teal/80 leading-relaxed mb-4">
                Our print-and-shade mock exam mode — print at home, complete on paper, photograph
                it — was designed as one of three equal ways to sit a mock, but for many children
                who find screen-based assessment harder, it&apos;s a meaningful accommodation in
                its own right, not an afterthought.
              </p>
              <p className="text-charcoal-teal/80 leading-relaxed">
                Every result clearly shows whether a mock was taken with accommodations, so parents
                and tutors can read progress honestly, not misleadingly.
              </p>
            </div>
            <Card>
              <ul className="space-y-3 text-charcoal-teal/85">
                <li>✓ Extra time applies automatically once set, across all three modes</li>
                <li>✓ Read-aloud on by default for any profile that requests it</li>
                <li>✓ Available as an option for any child, regardless of profile</li>
                <li>✓ Accommodated attempts are always clearly labelled</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <Card tint="coral">
            <p className="text-xs font-bold text-brick-600 mb-2">A CLEAR PROMISE</p>
            <ul className="space-y-3 text-charcoal-teal/85">
              <li>✓ No diagnosis or EHCP required to switch on any accommodation</li>
              <li>✓ Nothing in Learning Preferences sits behind a paid tier</li>
              <li>✓ Your child&apos;s profile is visible to you and their assigned tutor — never hidden</li>
              <li>✓ We never make diagnostic claims — only ever &quot;you may wish to discuss this with your child&apos;s school or GP&quot;</li>
            </ul>
          </Card>
          <div>
            <h2 className="font-display font-bold text-3xl mb-4">Tutors who understand, not just software that adapts</h2>
            <p className="text-charcoal-teal/80 leading-relaxed mb-4">
              Tutors can indicate SEND experience — dyslexia, autism, ADHD, speech and language
              needs — during their application, verified where possible alongside their DBS and
              reference checks. Where a family&apos;s profile indicates a need, our matching gives
              weight to experienced tutors, without narrowing options unfairly in areas where
              fewer tutors are available.
            </p>
            <p className="text-charcoal-teal/80 leading-relaxed">
              Our tutor training academy includes practical, plain-language SEND content —
              unlocked once a tutor&apos;s agreement is signed, same as every other module.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="font-display font-bold text-3xl mb-4">A child should never have to ask for the basics</h2>
          <p className="text-charcoal-teal/80 mb-8 max-w-xl mx-auto">
            Create a real account and open Settings → Learning Preferences to see exactly what&apos;s available — no sample data, no walkthrough required.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/register/parent" variant="primary">Create a parent account</Button>
            <Button href="/trust" variant="outline">Read our Trust &amp; Safeguarding framework</Button>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
