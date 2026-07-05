import { PageShell } from "@/components/PageShell";
import { EmptyState } from "@/components/EmptyState";
import { getMyTutorProfile, getMyTrainingProgress } from "@/features/tutors/queries";
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

  const modules = await getMyTrainingProgress(tutorProfile.id);

  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-16">
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
