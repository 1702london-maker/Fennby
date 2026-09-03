import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { getMyLearnerProfile } from "@/features/child/queries";
import type { ChildLearningPreferencesInput } from "@/features/child/actions";
import { hasSendProfile } from "@/lib/send";
import { ChildPreferencesForm } from "./ChildPreferencesForm";
import { SendToolkitClient } from "./SendToolkitClient";

type LoosePreferences = {
  extra_time_percent?: number;
  read_aloud_default?: boolean;
  dyslexia_font?: boolean;
  chunked_content?: boolean;
  low_stimulation_mode?: boolean;
  symbol_support?: boolean;
  sensory_break_reminders?: boolean;
  text_size?: string;
  colour_overlay?: string | null;
} | null;

function PreferenceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-teal-100 py-3 last:border-b-0">
      <dt className="text-sm text-charcoal-teal/70">{label}</dt>
      <dd className="text-right text-sm font-semibold text-charcoal-teal">{value}</dd>
    </div>
  );
}

export default async function ChildSendToolkitPage() {
  const learner = await getMyLearnerProfile();

  if (!learner) {
    return (
      <PageShell>
        <main className="max-w-2xl mx-auto px-6 py-16">
          <EmptyState emoji="🔒" title="Sign in required" description="Log in with your child username and PIN to open your SEND toolkit." />
        </main>
      </PageShell>
    );
  }

  const preferences = learner.learning_preferences as LoosePreferences;
  const formPreferences: Partial<ChildLearningPreferencesInput> = {
    dyslexia_font: preferences?.dyslexia_font ?? false,
    text_size: ["default", "large", "extra-large"].includes(preferences?.text_size ?? "")
      ? preferences?.text_size as ChildLearningPreferencesInput["text_size"]
      : "default",
    colour_overlay: ["cream", "blue", "green", "rose"].includes(preferences?.colour_overlay ?? "")
      ? preferences?.colour_overlay as ChildLearningPreferencesInput["colour_overlay"]
      : null,
    chunked_content: preferences?.chunked_content ?? false,
    extra_time_percent: [0, 25, 50].includes(preferences?.extra_time_percent ?? -1)
      ? preferences?.extra_time_percent as ChildLearningPreferencesInput["extra_time_percent"]
      : 0,
    low_stimulation_mode: preferences?.low_stimulation_mode ?? false,
    symbol_support: preferences?.symbol_support ?? false,
    sensory_break_reminders: preferences?.sensory_break_reminders ?? false,
    read_aloud_default: preferences?.read_aloud_default ?? false,
  };
  const hasProfile = hasSendProfile(learner);

  return (
    <PageShell>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-bold text-teal-900 mb-2">SEND Toolkit</p>
          <h1 className="font-display font-bold text-3xl mb-3">Your learning supports</h1>
          <p className="text-charcoal-teal/75 max-w-2xl leading-relaxed">
            Read aloud, dictation, symbol support, extra time, calm tools, and display preferences all live here as everyday tools.
          </p>
        </div>

        <section className="grid lg:grid-cols-[1fr_1.15fr] gap-6 mb-8">
          <Card tint={hasProfile ? "teal" : undefined}>
            <p className="text-xs font-bold text-teal-900 mb-2">PROFILE</p>
            <h2 className="font-display font-bold text-xl mb-4">{learner.preferred_name}&apos;s support profile</h2>
            <dl className="mb-5">
              <PreferenceRow label="SEND notes" value={learner.send_notes?.trim() || "None recorded"} />
              <PreferenceRow label="Accessibility needs" value={learner.accessibility_needs?.trim() || "None recorded"} />
            </dl>
            <ChildPreferencesForm initial={formPreferences} />
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href="/child/calm-corner" variant="primary" className="px-4 py-2 text-sm">
                Calm Corner
              </Button>
              <Button href="/child/practice" variant="outline" className="px-4 py-2 text-sm">
                Practice
              </Button>
            </div>
          </Card>

          <Card tint="coral">
            <p className="text-xs font-bold text-brick-600 mb-2">HOW IT WORKS</p>
            <h2 className="font-display font-bold text-xl mb-4">Not a separate track</h2>
            <div className="space-y-3 text-sm text-charcoal-teal/80 leading-relaxed">
              <p>
                These supports are part of the normal child portal, so a child can use them without being moved into a separate experience.
              </p>
              <p>
                Parents and tutors can see the recorded support needs, while the child gets practical tools right where they learn.
              </p>
              <p>
                Dictation uses the browser microphone. Read-aloud uses the browser&apos;s speech engine. Both work without adding a paid AI voice service.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href="/child/ai-tutor" variant="outline" className="px-4 py-2 text-sm">
                AI Tutor
              </Button>
              <Button href="/child/mock-exams" variant="outline" className="px-4 py-2 text-sm">
                Mock exams
              </Button>
            </div>
          </Card>
        </section>

        <SendToolkitClient />
      </main>
    </PageShell>
  );
}
