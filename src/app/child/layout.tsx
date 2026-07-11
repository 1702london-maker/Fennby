import { getMyLearnerProfile } from "@/features/child/queries";
import { LearningPreferencesStyles } from "@/components/LearningPreferencesStyles";
import { SendProvider } from "@/lib/send-context";
import { hasSendProfile } from "@/lib/send";

export default async function ChildLayout({ children }: { children: React.ReactNode }) {
  const learner = await getMyLearnerProfile();

  return (
    <SendProvider hasSend={hasSendProfile(learner)}>
      <LearningPreferencesStyles preferences={learner?.learning_preferences ?? null}>
        {children}
      </LearningPreferencesStyles>
    </SendProvider>
  );
}
