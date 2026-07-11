import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { getMyTutorApplication } from "@/features/tutors/applicationActions";
import { AgreementForm } from "@/app/apply-tutor/agreement/AgreementForm";

// The agreement is only reachable in any meaningful sense once an
// application has actually been reviewed and approved — checked here
// server-side against the real tutor_applications row, not assumed from
// which page the visitor clicked through from.
export default async function TutorAgreementPage() {
  const application = await getMyTutorApplication();

  if (!application) {
    return (
      <PageShell>
        <main className="max-w-xl mx-auto px-6 py-20 text-center">
          <Card>
            <p className="text-charcoal-teal/80">
              You&apos;ll need to submit a tutor application first.
            </p>
            <Button href="/apply-tutor" variant="primary" className="mt-4">Apply to become a tutor</Button>
          </Card>
        </main>
      </PageShell>
    );
  }

  if (application.status === "training_pending" || application.agreement_signed_at) {
    return (
      <PageShell>
        <main className="max-w-xl mx-auto px-6 py-20 text-center">
          <Card tint="coral">
            <span className="text-5xl" aria-hidden>✅</span>
            <h1 className="font-display font-bold text-2xl mt-4 mb-2">Agreement already signed</h1>
            <p className="text-charcoal-teal/80 leading-relaxed">Your training is unlocked.</p>
            <Button href="/tutor/training" variant="primary" className="mt-6">Go to training</Button>
          </Card>
        </main>
      </PageShell>
    );
  }

  if (application.onboarding_state === "password_reset_required") {
    return (
      <PageShell>
        <main className="max-w-xl mx-auto px-6 py-20 text-center">
          <Card tint="teal">
            <span className="text-5xl" aria-hidden>🔑</span>
            <h1 className="font-display font-bold text-2xl mt-4 mb-2">Set your password first</h1>
            <p className="text-charcoal-teal/80 leading-relaxed mb-6">
              Before you can sign the agreement, replace the temporary password we sent you.
            </p>
            <Button href="/apply-tutor/reset-password" variant="primary">Set your password</Button>
          </Card>
        </main>
      </PageShell>
    );
  }

  if (application.status !== "approved") {
    return (
      <PageShell>
        <main className="max-w-xl mx-auto px-6 py-20 text-center">
          <Card tint="teal">
            <span className="text-5xl" aria-hidden>⏳</span>
            <h1 className="font-display font-bold text-2xl mt-4 mb-2">Still under review</h1>
            <p className="text-charcoal-teal/80 leading-relaxed">
              Your application status is <strong>{application.status.replace("_", " ")}</strong>.
              The conduct agreement unlocks automatically once a member of our safeguarding team
              has approved your application — this page will update as soon as that happens.
            </p>
          </Card>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-14">
        <h1 className="font-display font-bold text-3xl mb-2">Your tutor conduct agreement</h1>
        <p className="text-charcoal-teal/70 mb-8">
          Plain English, no legal jargon — here&apos;s exactly what you&apos;re agreeing to.
        </p>
        <AgreementForm />
      </main>
    </PageShell>
  );
}
