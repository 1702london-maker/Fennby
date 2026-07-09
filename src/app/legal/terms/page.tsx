import { PageShell } from "@/components/PageShell";
import { LegalDraftBanner } from "@/components/LegalDraftBanner";

export default function TermsPage() {
  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">Legal</span>
        <h1 className="font-display font-bold text-4xl mb-6">Terms of Service</h1>
        <LegalDraftBanner />

        <div className="prose-fennby space-y-6 text-charcoal-teal/85 leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-xl mb-2">1. What Fennby is</h2>
            <p>
              Fennby is a whole-child education platform providing 11+ mock exams, vetted tutoring,
              vocational and craft activities, and school reporting tools. By creating an account,
              you agree to these terms on behalf of yourself and, where you register a child, on
              their behalf as their parent or legal guardian.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl mb-2">2. Accounts and roles</h2>
            <p>
              Every account belongs to one role — parent, child, tutor, school, or local authority
              — each with access limited to what that role needs. Parents create and manage child
              accounts; a child never registers themselves. You&apos;re responsible for keeping your
              login details secure and for anything that happens under your account.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl mb-2">3. Tutors</h2>
            <p>
              Every tutor completes identity verification, an enhanced DBS check, and signs
              Fennby&apos;s conduct agreement before being matched with any child. Tutors agree to
              have no unsupervised, unlogged contact with a child outside the platform, and to keep
              their DBS status current. Breach of this agreement may result in immediate
              suspension.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl mb-2">4. Visibility and safeguarding</h2>
            <p>
              Every message involving a child, every session note, and every mock exam result is
              visible to that child&apos;s parent, always — this is a core promise of the platform,
              not an optional setting. Full detail lives in our{" "}
              <a href="/trust" className="font-semibold text-teal-900 hover:underline">Trust &amp; Safeguarding framework</a>.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl mb-2">5. Accessibility and accommodations</h2>
            <p>
              Learning Preferences — including extra time, read-aloud, dyslexia-friendly fonts, and
              related accommodations — are available on every plan and never require proof of a
              diagnosis. Details are in our{" "}
              <a href="/send-accessibility" className="font-semibold text-teal-900 hover:underline">SEND &amp; Accessibility</a> page.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl mb-2">6. Payment and cancellation</h2>
            <p>
              Subscription fees are billed as described at sign-up. You can cancel at any time from
              your account&apos;s billing settings; access continues until the end of the current
              billing period. We don&apos;t currently offer refunds for partial periods.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl mb-2">7. Changes to these terms</h2>
            <p>
              We may update these terms as Fennby grows. We&apos;ll notify account holders of
              material changes and, where required, ask for renewed consent.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl mb-2">8. Contact</h2>
            <p>
              Questions about these terms can be sent via our{" "}
              <a href="/contact" className="font-semibold text-teal-900 hover:underline">contact page</a>.
            </p>
          </section>
        </div>
      </main>
    </PageShell>
  );
}
