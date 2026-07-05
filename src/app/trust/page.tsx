import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";

export default function TrustPage() {
  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-14">
        <h1 className="font-display font-bold text-4xl mb-4">Trust &amp; Safeguarding</h1>
        <p className="text-charcoal-teal/80 leading-relaxed mb-10 max-w-2xl">
          This isn&apos;t a marketing page. It&apos;s a plain description of how Fennby actually
          protects children — enforced in the way the product is built, not just written
          in a policy filed away somewhere.
        </p>

        <Card className="mb-6">
          <h2 className="font-display font-bold text-lg mb-2">A named Designated Safeguarding Lead</h2>
          <p className="text-charcoal-teal/80 leading-relaxed">
            Fennby names a Designated Safeguarding Lead and at least one Deputy DSL before any
            tutor is matched with a child. The DSL is responsible for safeguarding policy,
            incident response, liaison with local authority Children&apos;s Services and the DBS,
            and an annual review of every safeguarding process we operate.
          </p>
        </Card>

        <Card id="vetting" className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">How we vet every tutor, plainly explained</h2>
          <ol className="space-y-2 text-charcoal-teal/80 leading-relaxed list-decimal list-inside">
            <li>Identity verification</li>
            <li>Enhanced DBS check, including a barred-list check</li>
            <li>Reference checks covering prior work with children where applicable</li>
            <li>A signed agreement covering safeguarding, confidentiality, and conduct standards</li>
            <li>Completion of Fennby&apos;s safeguarding and platform-conduct training module</li>
            <li>Ongoing DBS re-verification — an expired check automatically suspends new assignments</li>
          </ol>
          <p className="text-charcoal-teal/70 text-sm mt-4">
            No tutor can be assigned a child until every one of these steps is complete — this is
            enforced as a database constraint, not just a process a human might forget to follow.
          </p>
        </Card>

        <Card className="mb-6">
          <h2 className="font-display font-bold text-lg mb-2">Our promise: every message, visible to you</h2>
          <p className="text-charcoal-teal/80 leading-relaxed">
            Any message involving your child is visible to you, in real time, without exception.
            There is no private channel between an adult and a child anywhere on Fennby. If a
            family opts into WhatsApp or email notifications, replies are bridged back into the
            same logged, parent-visible thread — the bridge never creates a blind spot.
          </p>
        </Card>

        <Card id="data" className="mb-6">
          <h2 className="font-display font-bold text-lg mb-2">Data protection, in summary</h2>
          <p className="text-charcoal-teal/80 leading-relaxed">
            UK GDPR and the ICO Children&apos;s Code (Age Appropriate Design Code) govern everything
            we collect. We only ever collect what&apos;s necessary for safeguarding, academic
            progress, and safe service delivery. Chat logs, session notes, and uploaded images are
            retained only as long as necessary, then automatically deleted or anonymised. Parents
            can request export or deletion of their child&apos;s data at any time.
          </p>
        </Card>

        <Card className="mb-6">
          <h2 className="font-display font-bold text-lg mb-2">Honest about our evidence</h2>
          <p className="text-charcoal-teal/80 leading-relaxed">
            We track academic progress, engagement, wellbeing signals, and safeguarding outcomes
            from day one. Where evidence is early-stage, our reporting says so plainly — we don&apos;t
            publish impact claims we can&apos;t support with data.
          </p>
        </Card>

        <Card id="accessibility" className="mb-6">
          <h2 className="font-display font-bold text-lg mb-2">Accessibility statement</h2>
          <p className="text-charcoal-teal/80 leading-relaxed">
            Fennby is built to meet WCAG 2.2 AA as a minimum across every screen — keyboard
            navigable, screen-reader tested, visible focus states throughout, and full support
            for reduced-motion preferences. Our colour system avoids harsh contrast and
            high-saturation colour by design, for a genuinely sensory-friendly experience.
          </p>
        </Card>

        <Card id="report" tint="coral" className="text-center">
          <p className="font-display font-bold text-lg mb-2">Have a concern?</p>
          <p className="text-charcoal-teal/80">
            Every chat in Fennby has a &quot;Report a concern&quot; link that reaches our
            Designated Safeguarding Lead directly, and it&apos;s visible from every
            logged-in screen on the platform.
          </p>
        </Card>
      </main>
    </PageShell>
  );
}
