import { PageShell } from "@/components/PageShell";
import { LegalDraftBanner } from "@/components/LegalDraftBanner";

export default function CookiesPage() {
  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">Legal</span>
        <h1 className="font-display font-bold text-4xl mb-6">Cookie Policy</h1>
        <LegalDraftBanner />

        <div className="space-y-6 text-charcoal-teal/85 leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-xl mb-2">What cookies we use</h2>
            <p>
              Fennby uses a small number of strictly necessary cookies to keep you signed in and to
              remember settings like your Learning Preferences (font size, colour overlay, and
              similar accommodations) between visits. We don&apos;t use advertising or
              cross-site tracking cookies.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl mb-2">Strictly necessary cookies</h2>
            <p>
              These keep the platform working — signing you in, remembering which account
              you&apos;re using, and protecting against fraudulent requests. These can&apos;t be
              switched off, as the service won&apos;t function correctly without them.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl mb-2">Preference cookies</h2>
            <p>
              These remember choices like your Learning Preferences settings, so you don&apos;t
              have to reapply them on every visit. You can change or clear these at any time from
              your browser settings.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl mb-2">Analytics</h2>
            <p>
              Where we use analytics to understand how the platform is used and to fix problems, we
              aim to use privacy-respecting, aggregated tools rather than individually-identifying
              tracking — details will be finalised and published here alongside formal legal review.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl mb-2">Managing cookies</h2>
            <p>
              Most browsers let you view, delete, and block cookies through their settings. Blocking
              strictly necessary cookies will prevent you from being able to sign in.
            </p>
          </section>
        </div>
      </main>
    </PageShell>
  );
}
