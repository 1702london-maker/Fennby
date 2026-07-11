import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import { CalmBreathing } from "./CalmBreathing";

const tips = [
  { emoji: "🫁", title: "Slow breathing", body: "Follow the circle below, in as it grows, out as it shrinks. Do it as many times as you like." },
  { emoji: "🎧", title: "Read it out loud", body: "Any question or message on Fennby can be read to you instead. Look for the little speaker icon." },
  { emoji: "🐢", title: "There's no rush", body: "Extra time is already switched on for you where it helps. Nobody is watching a clock over your shoulder." },
  { emoji: "💬", title: "Tell a grown-up", body: "If anything feels too much, your parent can always see how you're doing and is only a message away." },
];

export default function CalmCornerPage() {
  return (
    <PageShell>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-display font-bold text-3xl">🌿 Calm Corner</h1>
          <ReadAloudButton text="Welcome to your Calm Corner. A quiet space to take a breath whenever you need one." label="Read aloud" />
        </div>
        <p className="text-charcoal-teal/70 mb-6">
          A quiet space just for you, whenever things feel like a lot.
        </p>

        <Card tint="sage" className="mb-6 text-center">
          <CalmBreathing />
        </Card>

        <div className="grid sm:grid-cols-2 gap-4">
          {tips.map((t) => (
            <Card key={t.title}>
              <span className="text-2xl" aria-hidden>{t.emoji}</span>
              <p className="font-display font-bold mt-2 mb-1">{t.title}</p>
              <p className="text-sm text-charcoal-teal/80">{t.body}</p>
            </Card>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
