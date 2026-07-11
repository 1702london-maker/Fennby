import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const guardrails = [
  { title: "Strictly educational, nothing else", body: "The AI Tutor only helps with schoolwork: explaining concepts, working through problems, and language practice. It's built to refuse anything outside that, not just discouraged from it." },
  { title: "Off-topic questions get redirected to you", body: "If your child asks something outside schoolwork, or seems distressed, the AI Tutor doesn't guess at an answer. It tells them to speak to a trusted adult and stops the conversation there." },
  { title: "Profanity is caught automatically", body: "If inappropriate language comes up, the AI never engages with it. It responds with a calm redirect, and a safeguarding case opens straight away, with you notified." },
  { title: "A session summary comes to you, every time", body: "At the end of every AI Tutor session, you get a clear summary of what your child asked and discussed. No surprises, no digging through message history to find out." },
];

export default function AiTutorSafetyPage() {
  return (
    <PageShell>
      <main>
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-14 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
              AI TUTOR
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight text-charcoal-teal text-balance">
              A practice companion your child can talk to, that never once talks to them unsupervised.
            </h1>
            <p className="mt-6 text-lg text-charcoal-teal/80 leading-relaxed max-w-lg">
              The AI Tutor helps with schoolwork whenever your child wants to practise, any time
              of day. It is never a replacement for their real, vetted tutor, and everything it
              says and hears is built to stay firmly inside safe, educational ground.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/register/parent" variant="primary">Create a parent account</Button>
              <Button href="/for-families" variant="outline">Explore for parents</Button>
            </div>
          </div>
          <div className="flex justify-center">
            <Card tint="teal" className="w-full max-w-sm">
              <p className="font-display font-bold text-sm text-teal-900 mb-3">What you get, every session</p>
              <ul className="space-y-2 text-sm text-charcoal-teal/85">
                <li>✓ A written summary sent to you when it ends</li>
                <li>✓ Full message history, visible any time</li>
                <li>✓ Automatic language flagging, never silent</li>
                <li>✓ Strictly schoolwork, nothing else</li>
              </ul>
            </Card>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid sm:grid-cols-2 gap-5">
            {guardrails.map((g) => (
              <Card key={g.title}>
                <p className="font-display font-bold text-lg">{g.title}</p>
                <p className="text-sm text-charcoal-teal/80 mt-1 leading-relaxed">{g.body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-teal-100">
          <div className="max-w-4xl mx-auto px-6 py-14 text-center">
            <h2 className="font-display font-bold text-2xl mb-3 text-teal-900">No nudity, no unsafe content, no exceptions</h2>
            <p className="text-charcoal-teal/80 leading-relaxed max-w-xl mx-auto">
              The AI Tutor is bounded to education at the system level, not left to good
              judgement in the moment. It cannot discuss anything unrelated to schoolwork, and
              every message your child sends or receives is written to their record for you to
              see, exactly like every other part of Fennby.
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display font-bold text-3xl mb-4">See it for yourself</h2>
          <p className="text-charcoal-teal/80 mb-8">
            Once your child is set up, every AI Tutor conversation is visible on your parent
            dashboard, alongside their mock exams and messages.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/register/parent" variant="primary">Get started as a parent</Button>
            <Button href="/send-accessibility" variant="outline">See SEND &amp; Accessibility</Button>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
