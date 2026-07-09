import { PageShell } from "@/components/PageShell";
import { LegalDraftBanner } from "@/components/LegalDraftBanner";

export default function PrivacyPage() {
  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <span className="inline-block bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full mb-4">Legal</span>
        <h1 className="font-display font-bold text-4xl mb-6">Privacy Policy</h1>
        <LegalDraftBanner />

        <div className="space-y-6 text-charcoal-teal/85 leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-xl mb-2">What we collect</h2>
            <p>
              Account details for parents, tutors, schools, and local authorities; a child&apos;s
              name, year group, and school (provided by their parent, never by the child directly);
              mock exam results and topic-level progress; messages sent through the platform; and,
              where a family chooses to share it, information about a child&apos;s SEND profile or
              learning preferences.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl mb-2">Special category data</h2>
            <p>
              Information about a child&apos;s special educational needs, disability, or diagnosis
              is treated as UK GDPR special category data — with extra care in storage, access
              logging, and retention beyond our baseline data rules. This information is visible
              only to the child&apos;s parent and their assigned tutor, is never required to access
              basic accessibility accommodations, and is never used to make diagnostic claims.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl mb-2">Why we collect it</h2>
            <p>
              To run the service you&apos;ve signed up for: matching tutors, running mock exams,
              tracking progress, keeping messages parent-visible, and enabling the accommodations a
              family chooses to switch on. We don&apos;t sell personal data, and we don&apos;t use a
              child&apos;s data for advertising.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl mb-2">Who can see it</h2>
            <p>
              A child&apos;s data is visible to their own parent, their assigned tutor (limited to
              what&apos;s relevant to teaching them), their school if the family has linked one, and
              Fennby&apos;s safeguarding team where a concern is raised. Every message a child sends
              or receives is visible to their parent — there is no private channel that excludes
              them.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl mb-2">How long we keep it</h2>
            <p>
              We retain account and progress data for as long as an account is active, and for a
              limited period after closure as required for safeguarding and legal record-keeping.
              Special category data is subject to stricter retention limits, reviewed regularly.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-xl mb-2">Your rights</h2>
            <p>
              Under UK GDPR, you can request access to, correction of, or deletion of personal data
              we hold. Parents can request this on behalf of a child. Contact us via our{" "}
              <a href="/contact" className="font-semibold text-teal-900 hover:underline">contact page</a>{" "}
              to make a request.
            </p>
          </section>
        </div>
      </main>
    </PageShell>
  );
}
