import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ReportConcernForm } from "@/components/ReportConcernForm";

export default function TrustPage() {
  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-14">
        <section className="grid md:grid-cols-2 gap-10 items-center mb-14">
          <div>
            <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">
              TRUST &amp; SAFEGUARDING
            </span>
            <h1 className="font-display font-bold text-4xl leading-tight text-charcoal-teal text-balance">
              How Fennby actually protects children, and how to report a concern.
            </h1>
            <p className="mt-6 text-charcoal-teal/80 leading-relaxed">
              This isn&apos;t a marketing page. It&apos;s a plain description of how Fennby
              protects children, enforced in the way the product is built, not just written in a
              policy filed away somewhere. If you have a concern right now, the form is further
              down this page, always reachable from here, nowhere else.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/school/demo" variant="primary">Book a safeguarding walkthrough</Button>
              <Button href="#report" variant="outline" className="border-brick-600 text-brick-600">Report a concern</Button>
            </div>
          </div>
          <div className="flex justify-center">
            <Card tint="coral" className="w-full max-w-sm">
              <p className="font-display font-bold text-sm text-brick-600 mb-3">If something&apos;s wrong, right now</p>
              <p className="text-sm text-charcoal-teal/85 mb-3">
                The report form below reaches our Designated Safeguarding Lead directly, not a
                queue.
              </p>
              <p className="text-sm text-charcoal-teal/85">
                If a child is in immediate danger, contact emergency services first.
              </p>
            </Card>
          </div>
        </section>

        <Card className="mb-6">
          <h2 className="font-display font-bold text-lg mb-2">Governed against recognised UK frameworks</h2>
          <p className="text-charcoal-teal/80 leading-relaxed mb-3">
            Our safeguarding approach is built with direct reference to <strong>Keeping Children
            Safe in Education (KCSIE)</strong>, <strong>Working Together to Safeguard Children</strong>,
            and the <strong>UK GDPR / ICO Children&apos;s Code (Age Appropriate Design Code)</strong>.
            We don&apos;t treat these as boxes to tick once — our safeguarding policy is reviewed
            at minimum annually, and immediately after any incident or relevant regulatory change.
          </p>
          <p className="text-charcoal-teal/70 text-sm">
            Schools and local authorities carrying out due diligence are welcome to request our
            full policy documents directly.
          </p>
        </Card>

        <Card className="mb-6">
          <h2 className="font-display font-bold text-lg mb-2">A named Designated Safeguarding Lead</h2>
          <p className="text-charcoal-teal/80 leading-relaxed">
            Fennby names a Designated Safeguarding Lead and at least one Deputy DSL before any
            tutor is matched with a child. The DSL is responsible for safeguarding policy,
            incident response, liaison with local authority Children&apos;s Services and the police
            where relevant, and an annual review of every safeguarding process we operate. Contact
            details for the DSL are visible from every chat interface and every logged-in screen
            on the platform — never buried in a settings menu.
          </p>
        </Card>

        <Card id="vetting" className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">How we vet every tutor, plainly explained</h2>
          <ol className="space-y-2 text-charcoal-teal/80 leading-relaxed list-decimal list-inside">
            <li>Identity verification against government-issued ID</li>
            <li>Enhanced DBS check, including a barred-list check for anyone working with children</li>
            <li>Reference checks covering prior work with children where applicable</li>
            <li>A signed agreement covering safeguarding responsibilities, confidentiality, IP, and conduct standards</li>
            <li>Completion of Fennby&apos;s safeguarding and platform-conduct training module (8 modules, tracked to completion)</li>
            <li>Ongoing DBS re-verification on a scheduled basis — an expired or overdue check automatically suspends new assignments</li>
          </ol>
          <p className="text-charcoal-teal/70 text-sm mt-4 mb-4">
            No tutor can be assigned a child until every one of these steps is complete — this is
            enforced as a database constraint, not just a process a human might forget to follow.
            A tutor whose status changes to &quot;suspended&quot; has every upcoming session
            automatically cancelled in the same transaction, so there is never a window where a
            suspended tutor still appears able to meet a child.
          </p>
          <Button href="/apply-tutor" variant="outline">See the full application &amp; training pipeline</Button>
        </Card>

        <Card className="mb-6">
          <h2 className="font-display font-bold text-lg mb-2">Our promise: every message, visible to you</h2>
          <p className="text-charcoal-teal/80 leading-relaxed">
            Any message involving your child is visible to you, in real time, without exception.
            There is no private channel between an adult and a child anywhere on Fennby. Every
            message is attached to a learner and a thread; row-level security in our database
            makes a parent-invisible child message architecturally impossible, not merely against
            policy. If a family opts into WhatsApp or email notifications, replies are bridged back
            into the same logged, parent-visible thread — the bridge never creates a blind spot.
            Automated language monitoring also flags concerning patterns for our safeguarding team
            to review, independent of what either party reports.
          </p>
        </Card>

        <Card className="mb-6">
          <h2 className="font-display font-bold text-lg mb-2">What happens when a concern is raised</h2>
          <ol className="space-y-2 text-charcoal-teal/80 leading-relaxed list-decimal list-inside">
            <li>Any parent, child, tutor, teacher, or platform user can report a concern from any screen</li>
            <li>The report reaches the DSL and Deputy DSL immediately — not on a scheduled batch</li>
            <li>The DSL opens a case, assesses priority, and begins the appropriate response</li>
            <li>Where required, we escalate to local authority Children&apos;s Services or the police</li>
            <li>Every action taken is logged in an immutable audit trail — nothing about a
                safeguarding case can be silently edited or deleted, by anyone, including admins</li>
            <li>Outcomes are recorded, and the case remains reviewable even after resolution</li>
          </ol>
        </Card>

        <Card id="data" className="mb-6">
          <h2 className="font-display font-bold text-lg mb-2">Data protection, in detail</h2>
          <p className="text-charcoal-teal/80 leading-relaxed mb-3">
            UK GDPR and the ICO Children&apos;s Code govern everything we collect. We practise data
            minimisation — only collecting what&apos;s necessary for safeguarding, academic
            progress, and safe service delivery. Chat logs, session notes, and uploaded images are
            retained only as long as necessary, then automatically deleted or anonymised on a
            defined schedule enforced by scheduled database jobs, not manual housekeeping.
          </p>
          <p className="text-charcoal-teal/80 leading-relaxed">
            Parents can request export or deletion of their child&apos;s data at any time, subject
            to safeguarding-record retention obligations that may require us to retain certain
            records even after a deletion request — this will always be stated clearly, never
            buried in small print.
          </p>
        </Card>

        <Card className="mb-6">
          <h2 className="font-display font-bold text-lg mb-2">Honest about our evidence</h2>
          <p className="text-charcoal-teal/80 leading-relaxed mb-3">
            We track academic progress, engagement, wellbeing signals, and safeguarding outcomes
            from day one, so that Fennby can eventually be independently evaluated — in the
            tradition of Education Endowment Foundation and Youth Endowment Fund evaluations —
            rather than asking anyone to simply take our word for impact.
          </p>
          <p className="text-charcoal-teal/80 leading-relaxed">
            Where evidence is early-stage or limited, our reporting says so plainly rather than
            overstating results. This restraint is itself part of what makes the evidence credible
            later — and it&apos;s the same discipline we bring to safeguarding: rigorous, not just reassuring.
          </p>
        </Card>

        <Card id="accessibility" className="mb-6">
          <h2 className="font-display font-bold text-lg mb-2">Accessibility statement</h2>
          <p className="text-charcoal-teal/80 leading-relaxed">
            Fennby is built to meet WCAG 2.2 AA as a minimum across every screen — keyboard
            navigable, screen-reader tested, visible focus states throughout, and full support
            for reduced-motion preferences. Our colour system avoids harsh contrast and
            high-saturation colour by design, in line with the ICO&apos;s Age Appropriate Design
            Code and to support neurodivergent children specifically.
          </p>
        </Card>

        <Card className="mb-6">
          <h2 className="font-display font-bold text-lg mb-3">Common questions</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold">Can a school request evidence of our safeguarding processes before signing up?</p>
              <p className="text-charcoal-teal/70 mt-1">Yes — book a walkthrough below and we&apos;ll share our full policy documents and DBS verification process directly.</p>
            </div>
            <div>
              <p className="font-semibold">What happens if a tutor&apos;s DBS check expires?</p>
              <p className="text-charcoal-teal/70 mt-1">New assignments are automatically blocked at the database level until it&apos;s renewed — this isn&apos;t a manual process that can be missed.</p>
            </div>
            <div>
              <p className="font-semibold">Can a local authority see aggregated, anonymised data?</p>
              <p className="text-charcoal-teal/70 mt-1">Yes — regional impact dashboards are offered free to local authorities as a trust-building step, independent of any commercial relationship.</p>
            </div>
          </div>
        </Card>

        <div id="report" className="mb-6 scroll-mt-24">
          <h2 className="font-display font-bold text-2xl mb-1">Report a concern</h2>
          <p className="text-charcoal-teal/70 mb-4">
            Every chat in Fennby also links straight back to this form, visible from every
            logged-in screen on the platform.
          </p>
          <ReportConcernForm />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Card tint="teal">
            <p className="font-display font-bold mb-2">Considering Fennby for your school?</p>
            <p className="text-sm text-charcoal-teal/80 mb-4">See the cohort dashboard and Pupil Premium reporting alongside our safeguarding evidence.</p>
            <Button href="/for-schools" variant="outline">Explore for schools</Button>
          </Card>
          <Card>
            <p className="font-display font-bold mb-2">Want to talk to our team directly?</p>
            <p className="text-sm text-charcoal-teal/80 mb-4">We&apos;re happy to answer detailed questions from safeguarding leads, DPOs, or local authority contacts.</p>
            <Button href="/contact" variant="outline">Contact us</Button>
          </Card>
        </div>
      </main>
    </PageShell>
  );
}
