import { getMyLearnerProfile } from "@/features/child/queries";
import { LearningPreferencesStyles } from "@/components/LearningPreferencesStyles";

export default async function ChildLayout({ children }: { children: React.ReactNode }) {
  const learner = await getMyLearnerProfile();

  return (
    <LearningPreferencesStyles preferences={learner?.learning_preferences ?? null}>
      {children}
    </LearningPreferencesStyles>
  );
}
