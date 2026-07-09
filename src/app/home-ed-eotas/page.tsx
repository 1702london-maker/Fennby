import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const reasons = [
  { icon: "🧭", title: "Choice", body: "You've chosen to educate at home, and want the structure of a real curriculum without enrolling in a school." },
  { icon: "🧩", title: "SEND needs", body: "Mainstream school wasn't the right fit — Fennby's accommodations are built in, never gated behind a diagnosis." },
  { icon: "🚪", title: "Exclusion or transition", body: "Between schools, or navigating an exclusion — a structured education doesn't have to pause while that's sorted out." },
  { icon: "💚", title: "Anxiety or medical circumstances", body: "A calmer, flexible pace, without losing curriculum alignment or falling behind." },
];

const features = [
  { title: "Full subject range", body: "Maths, English, the sciences, and languages — Key Stage 1 right through to A-Level, not just an 11+ crammer." },
  { title: "Real mock exams", body: "Digital, print-and-shade, and full timed simulation modes, so progress is measured properly, not guessed at." },
  { title: "The AI Tutor", body: "Always-available practice support between sessions with a real vetted tutor — never a replacement for one." },
  { title: "Vetted human tutors", body: "Every tutor DBS-checked, trained, and signed before ever meeting your child, with every message visible to you." },
];

export default function HomeEdEotasPage() {
  return (
    <PageShell>
      <main className="max-w-5xl mx-auto px-6 py-16">
        <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
          FOR FAMILIES
        </span>
        <h1 className="font-display font-bold text-4xl mb-4 max-w-2xl">
          Home Ed &amp; EOTAS — a genuinely structured education, without school enrolment.
        </h1>
        <p className="text-charcoal-teal/80 max-w-2xl mb-10">
          Whatever brought you to educating outside mainstream school, Fennby gives you the full
          subject range, real mock exams, and tutor support to build a curriculum-aligned
          education you can actually track — not a collection of disconnected worksheets.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {reasons.map((r) => (
            <Card key={r.title}>
              <span className="text-3xl" aria-hidden>{r.icon}</span>
              <p className="font-display font-bold text-lg mt-2">{r.title}</p>
              <p className="text-sm text-charcoal-teal/80 mt-1">{r.body}</p>
            </Card>
          ))}
        </div>

        <h2 className="font-display font-bold text-2xl mb-6">What Fennby gives you</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {features.map((f) => (
            <Card key={f.title} tint="teal">
              <p className="font-display font-bold text-lg">{f.title}</p>
              <p className="text-sm text-charcoal-teal/80 mt-1">{f.body}</p>
            </Card>
          ))}
        </div>

        <Card tint="coral" className="mb-10">
          <p className="text-charcoal-teal/85 leading-relaxed">
            Fennby doesn&apos;t require school enrolment to use — every subject, mock exam mode,
            and accommodation is available to any parent registering a child directly, home
            educating or not.
          </p>
        </Card>

        <div className="flex flex-wrap gap-4">
          <Button href="/register/parent" variant="primary">Create a parent account</Button>
          <Button href="/send-accessibility" variant="outline">See SEND &amp; Accessibility</Button>
        </div>
      </main>
    </PageShell>
  );
}
