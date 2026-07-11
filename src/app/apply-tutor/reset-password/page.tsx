import { redirect } from "next/navigation";
import { getMyTutorApplication } from "@/features/tutors/applicationActions";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";

export default async function TutorResetPasswordPage() {
  const application = await getMyTutorApplication();
  if (!application) redirect("/login");
  if (application.onboarding_state !== "password_reset_required") {
    redirect(application.onboarding_state === "agreement_pending" ? "/apply-tutor/agreement" : "/tutor");
  }

  return (
    <PageShell hideFooter>
      <main className="max-w-md mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-3xl mb-2">Set your own password</h1>
        <p className="text-charcoal-teal/70 mb-8">
          You&apos;re approved. Before anything else, replace the temporary password we sent you
          with one only you know.
        </p>
        <Card>
          <ResetPasswordForm />
        </Card>
      </main>
    </PageShell>
  );
}
