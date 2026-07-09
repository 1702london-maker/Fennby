import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { getMyTutorApplication } from "@/features/tutors/applicationActions";

export default async function ApplyTutorConfirmation() {
  const application = await getMyTutorApplication();
  const approved = application?.status === "approved";

  return (
    <PageShell>
      <main className="max-w-xl mx-auto px-6 py-20 text-center">
        <Card tint="teal">
          <span className="text-5xl" aria-hidden>📨</span>
          <h1 className="font-display font-bold text-2xl mt-4 mb-2">
            Thank you — we&apos;re reviewing your application
          </h1>
          <p className="text-charcoal-teal/80 leading-relaxed mb-6">
            Our safeguarding team will verify your identity, DBS status, and references before
            we&apos;re able to move forward. This usually takes 3–5 working days. We&apos;ll email you
            as soon as your application has been reviewed.
          </p>
          {approved ? (
            <Button href="/apply-tutor/agreement" variant="primary">
              Continue to the tutor agreement
            </Button>
          ) : (
            <p className="text-sm font-semibold text-charcoal-teal/60">
              Current status: {application?.status.replace("_", " ") ?? "under review"} — the
              conduct agreement unlocks automatically once your application is approved.
            </p>
          )}
        </Card>
      </main>
    </PageShell>
  );
}
