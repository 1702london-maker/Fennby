import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { getMyTutorProfile, getMyTrainingProgress } from "@/features/tutors/queries";
import { getMyTutorApplication } from "@/features/tutors/applicationActions";
import { TrainingClient } from "./TrainingClient";

export default async function TutorTrainingPage() {
  const tutorProfile = await getMyTutorProfile();
  if (!tutorProfile) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-16">
          <EmptyState emoji="🎓" title="No tutor profile found" description="" />
        </main>
      </PageShell>
    );
  }

  // Training stays locked until the conduct agreement is signed — matches
  // the database-level DBS/agreement gating, not just a UI-level nudge.
  const application = await getMyTutorApplication();
  if (!application?.agreement_signed_at) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-16">
          <Card tint="teal">
            <span className="text-4xl" aria-hidden>🔒</span>
            <h1 className="font-display font-bold text-2xl mt-3 mb-2">Training unlocks after your conduct agreement</h1>
            <p className="text-charcoal-teal/80 leading-relaxed mb-4">
              Sign your tutor conduct agreement first — training content only ever becomes
              available once that step is complete.
            </p>
            <Button href="/apply-tutor/agreement" variant="primary">Go to the agreement</Button>
          </Card>
        </main>
      </PageShell>
    );
  }

  const modules = await getMyTrainingProgress(tutorProfile.id);

  return (
    <PageShell>
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-4xl mb-4">Tutor training &amp; vetting</h1>
        <p className="text-charcoal-teal/80 leading-relaxed mb-10 max-w-2xl">
          Every module below must be completed before you can be matched with a family — no
          exceptions, no shortcuts.
        </p>
        <TrainingClient modules={modules.map((m) => ({ id: m.id, title: m.title, description: m.description, completed: m.completed }))} />
      </main>
    </PageShell>
  );
}
