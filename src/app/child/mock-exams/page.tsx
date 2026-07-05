import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/Card";

const modes = [
  {
    href: "/child/mock-exams/digital",
    title: "Digital Mock",
    emoji: "💻",
    desc: "Answer questions straight on the screen, one at a time, and get your results instantly.",
  },
  {
    href: "/child/mock-exams/print-shade",
    title: "Print & Shade",
    emoji: "📷",
    desc: "Print your paper, complete it with a pencil, then snap a photo to upload — we'll mark it for you.",
  },
  {
    href: "/child/mock-exams/simulation",
    title: "Full Exam Simulation",
    emoji: "⏱️",
    desc: "A timed, distraction-free mock — just like sitting the real thing.",
  },
];

export default function ExamModeSelect() {
  return (
    <PageShell>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-3xl mb-2">Pick how you want to do today&apos;s mock</h1>
        <p className="text-charcoal-teal/70 mb-8">Choose whichever way feels best for you.</p>
        <div className="grid gap-4">
          {modes.map((m) => (
            <Link key={m.href} href={m.href} className="block">
              <Card className="flex items-center gap-4 hover:ring-2 hover:ring-teal-700 transition-shadow min-h-[44px]">
                <span className="text-4xl" aria-hidden>{m.emoji}</span>
                <div>
                  <p className="font-display font-bold text-lg">{m.title}</p>
                  <p className="text-charcoal-teal/70 text-sm">{m.desc}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </PageShell>
  );
}
