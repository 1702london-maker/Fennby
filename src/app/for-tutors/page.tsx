import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const parentReasons = [
  { title: "Enhanced DBS, every single tutor", body: "No one meets your child before their check clears, no exceptions." },
  { title: "Every message, session, and note is visible to you", body: "Nothing happens off the record, ever." },
  { title: "Trained, not just checked", body: "Safeguarding and SEND training before they take a single lesson." },
  { title: "Verified examiner history, where it's real", body: "Clearly marked as verified, never treated the same as an unchecked claim." },
];

const steps = [
  "Apply with your experience, subjects, and DBS status",
  "We verify your identity and enhanced DBS check",
  "Sign our conduct and safeguarding agreement",
  "Complete safeguarding and platform training",
  "Get matched with families based on your specialism",
];

export default function ForTutorsPage() {
  return (
    <PageShell>
      <main>
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-10 text-center">
          <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
            VETTED TUTORS
          </span>
          <h1 className="font-display font-bold text-4xl leading-tight max-w-2xl mx-auto">
            Every tutor on Fennby is checked, trained, and visible, so you never have to wonder.
          </h1>
          <p className="mt-6 text-lg text-charcoal-teal/80 leading-relaxed max-w-2xl mx-auto">
            You&apos;re trusting someone with your child&apos;s learning, and sometimes their
            confidence too. Here&apos;s exactly how we make sure that trust is deserved, not just
            promised.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid sm:grid-cols-2 gap-5">
            {parentReasons.map((r) => (
              <Card key={r.title}>
                <p className="font-display font-bold text-lg">{r.title}</p>
                <p className="text-sm text-charcoal-teal/80 mt-1">{r.body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-6">
          <Card tint="teal">
            <p className="text-charcoal-teal/85 leading-relaxed">
              Tutors can also let us know about their own experience with dyslexia, autism, ADHD,
              or speech and language needs, and where a family&apos;s child benefits from that
              experience, our matching gives it real weight. And because we mean it about SEND,
              any family with a SEND child gets 20% off their subscription too. Read more on our{" "}
              <a href="/send-accessibility" className="font-semibold text-teal-900 hover:underline">
                SEND &amp; Accessibility
              </a>{" "}
              page.
            </p>
          </Card>
        </section>

        <section className="bg-teal-100">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <h2 className="font-display font-bold text-2xl mb-4 text-teal-900">
              If you&apos;re thinking of tutoring with us, this bit&apos;s for you
            </h2>
            <div className="space-y-4 text-charcoal-teal/85 leading-relaxed">
              <p>
                Happy tutors make happy, successful kids, so looking after you properly isn&apos;t
                a nice-to-have for us, it&apos;s the whole point. No bullying, harassment, or abuse
                from anyone on this platform, parent or child, will ever be tolerated. If something
                goes wrong, there&apos;s a real person you can reach, and we&apos;ll back you.
              </p>
              <p>
                And unlike most tutoring platforms, we don&apos;t take a commission out of your
                earnings. Fennby makes its money from family subscriptions, mock exam simulations,
                summer camps, and vocational workshops, not from a cut of your session fees. What
                you earn tutoring is yours.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="font-display font-bold text-2xl mb-6 text-center">How it works</h2>
          <Card className="mb-8">
            <ol className="space-y-2 list-decimal list-inside text-charcoal-teal/85">
              {steps.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </Card>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/apply-tutor" variant="primary">Apply to tutor</Button>
            <Button href="/login?as=tutor" variant="outline">Log in</Button>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
