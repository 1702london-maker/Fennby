import Link from "next/link";
import Image from "next/image";
import { ProgressRing } from "@/components/ProgressRing";

// Alternate parent dashboard: sticky left sidebar instead of top nav,
// denser info-card grid, no page chrome from PageShell. Same tokens,
// different structure — for visual comparison only.

const subjects = [
  { name: "Verbal Reasoning", progress: 78, color: "teal" as const },
  { name: "Non-Verbal Reasoning", progress: 62, color: "plum" as const },
  { name: "Maths", progress: 71, color: "coral" as const },
  { name: "English", progress: 84, color: "sage" as const },
];

export default function CompareParent() {
  return (
    <div className="min-h-screen bg-mist-50 text-charcoal-teal flex">
      <aside className="w-64 shrink-0 bg-white border-r border-teal-100 min-h-screen p-6 hidden md:flex flex-col">
        <Image src="/brand/fennby-icon.svg" alt="Fennby" width={36} height={36} />
        <nav className="mt-10 flex flex-col gap-1">
          {["Overview", "Children", "Mock Exams", "Tutors", "Messages", "Activities", "Billing", "Settings"].map((l, i) => (
            <span key={l} className={`px-4 py-3 rounded-2xl text-sm font-semibold ${i === 0 ? "bg-teal-900 text-white" : "text-charcoal-teal/70 hover:bg-teal-100"}`}>
              {l}
            </span>
          ))}
        </nav>
        <Link href="/" className="mt-auto text-xs text-teal-900 font-semibold hover:underline">← View live site</Link>
      </aside>

      <main className="flex-1 p-6 sm:p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold bg-coral-600 text-white px-3 py-1 rounded-full mb-2 inline-block">COMPARE VARIANT</span>
            <h1 className="font-display font-bold text-3xl">Good afternoon, Ade</h1>
          </div>
          <div className="w-11 h-11 rounded-full bg-teal-100 flex items-center justify-center text-xl">🦊</div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-[2rem] bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-charcoal-teal/60 mb-6">Amara&apos;s subject progress</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {subjects.map((s) => (
                <div key={s.name} className="flex flex-col items-center gap-3 text-center">
                  <ProgressRing progress={s.progress} size={80} color={s.color} />
                  <span className="text-xs font-semibold">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-teal-900 text-white p-8 flex flex-col justify-between">
            <div>
              <p className="text-sm font-semibold text-teal-100/80 mb-2">Since last month</p>
              <p className="font-display font-bold text-xl leading-snug">
                Amara scored 78% on today&apos;s mock — up from 65%.
              </p>
            </div>
            <span className="text-4xl mt-6">🎉</span>
          </div>

          <div className="lg:col-span-2 rounded-[2rem] bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-charcoal-teal/60 mb-4">Message log</p>
            <div className="space-y-3 text-sm">
              <p><strong>Ms. Reece:</strong> Great work on today&apos;s warm-up 🎉</p>
              <p><strong>Amara:</strong> Thank you! The codes ones were tricky.</p>
              <p><strong>Ms. Reece:</strong> Totally normal — we&apos;ll work on strategies together.</p>
            </div>
          </div>
          <div className="rounded-[2rem] bg-coral-100 p-8">
            <p className="text-sm font-semibold text-charcoal-teal/70 mb-2">Upcoming session</p>
            <p className="font-display font-bold text-lg">Verbal Reasoning</p>
            <p className="text-sm text-charcoal-teal/70">with Ms. Reece, Wed 4:00pm</p>
          </div>
        </div>
      </main>
    </div>
  );
}
