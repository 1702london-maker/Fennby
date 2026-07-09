import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const traits = [
  { icon: "🛡️", title: "You take safeguarding seriously, not as a checkbox", body: "We'd rather you slow a launch down to ask a hard question about a child's safety than ship something fast that skips it." },
  { icon: "🔍", title: "You're honest about what isn't working yet", body: "Fennby's whole premise is transparency for families — that has to start internally. We'd rather hear \"this feature is half-built\" than a confident status update that isn't true." },
  { icon: "🧩", title: "You think in systems, not one-off fixes", body: "A safeguarding promise only means something if it's enforced structurally — in the database, in the RLS policy, in the workflow — not just written in a policy document." },
  { icon: "🌱", title: "You care about the whole child, not just the metric", body: "Mock exam scores matter, but so does a child's confidence, wellbeing, and the craft skills that don't show up on a league table." },
];

export default function CareersPage() {
  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
          Company
        </span>
        <h1 className="font-display font-bold text-4xl mb-6">Careers at Fennby</h1>

        <p className="text-charcoal-teal/85 leading-relaxed mb-6 text-lg">
          We don&apos;t have open roles listed publicly yet — Fennby is early, and we&apos;re building
          deliberately rather than hiring fast. But we know what kind of people we&apos;re looking
          for when we do open roles, and we&apos;d rather tell you that honestly now than post a
          generic &quot;we&apos;re hiring&quot; page with nothing behind it.
        </p>

        <h2 className="font-display font-bold text-2xl mb-4 mt-10">What working here is actually like</h2>
        <p className="text-charcoal-teal/85 leading-relaxed mb-8">
          Fennby exists because families deserve to see exactly what&apos;s happening with their
          child&apos;s education — every message, every score, every session, always. That standard
          of accountability applies inside the company too. We build in the open with each other:
          real progress, real blockers, real safeguarding concerns raised immediately, not smoothed
          over for a status update.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {traits.map((t) => (
            <Card key={t.title}>
              <span className="text-3xl" aria-hidden>{t.icon}</span>
              <h3 className="font-display font-bold text-lg mt-3 mb-2">{t.title}</h3>
              <p className="text-sm text-charcoal-teal/80 leading-relaxed">{t.body}</p>
            </Card>
          ))}
        </div>

        <Card tint="coral">
          <p className="text-charcoal-teal/85 leading-relaxed">
            Want to be the first to know when a role opens — engineering, safeguarding, tutor
            operations, or otherwise? Get in touch and tell us what you&apos;d bring.
          </p>
        </Card>

        <div className="mt-8">
          <Button href="/contact" variant="primary">Get in touch</Button>
        </div>
      </main>
    </PageShell>
  );
}
