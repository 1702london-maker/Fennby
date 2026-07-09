import Link from "next/link";
import { Button } from "@/components/Button";
import { ProgressRing } from "@/components/ProgressRing";

// Alternate visual take on the homepage — same brand tokens (teal/coral/mist/
// plum/sage), different layout philosophy: bento grid instead of stacked
// sections, bolder oversized type, asymmetric hero. Local comparison only,
// not linked from the real nav, not committed anywhere.

const bento = [
  { title: "Mock exams that actually feel like preparation", body: "Digital, print-and-shade, and full timed simulation — every mode auto-marked, every topic tracked.", tint: "bg-teal-100", span: "sm:col-span-2", dark: false },
  { title: "Every tutor vetted, DBS-checked, signed", body: "No tutor is ever matched with a child before identity checks, an enhanced DBS check, and a signed conduct agreement.", tint: "bg-coral-100", span: "", dark: false },
  { title: "A whole child, not just a test score", body: "Vocational and craft tracks — bag making, shoemaking, sewing — supervised, structured, building real mastery.", tint: "bg-white border-2 border-teal-100", span: "", dark: false },
  { title: "Built for schools, not just families", body: "Cohort dashboards, Pupil Premium impact reports, and inter-school visibility built in from day one.", tint: "bg-plum-700/10", span: "sm:col-span-2", dark: false },
  { title: "Clarity should feel calm enough to trust", body: "A more luxurious interpretation of Fennby's original promise-led pattern.", tint: "bg-charcoal-teal text-white", span: "sm:col-span-3", dark: true },
];

export default function CompareHome() {
  return (
    <div className="min-h-screen bg-mist-50 text-charcoal-teal">
      {/* Rounded pill nav, lifted from the Framer luxury concept */}
      <header className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between bg-white rounded-full shadow-sm px-6 py-3 border border-teal-100">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-teal-900 flex items-center justify-center text-white text-xs font-bold">f</span>
            <span className="font-display font-bold text-lg">fennby</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-semibold text-charcoal-teal/70">
            <span>For Families</span>
            <span>For Schools</span>
            <span>Tutors</span>
            <span className="text-brick-600">Trust &amp; Safeguarding</span>
          </nav>
          <Button href="/register/parent" variant="primary" className="!rounded-full !px-5 !py-2 text-sm">
            Get started
          </Button>
        </div>
        <div className="flex justify-end mt-3">
          <span className="text-xs font-bold bg-coral-600 text-white px-3 py-1 rounded-full">COMPARE VARIANT</span>
          <Link href="/" className="text-sm font-semibold text-teal-900 hover:underline ml-3">View live site →</Link>
        </div>
      </header>

      {/* Editorial serif hero with a live progress card, lifted from the Framer concept */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div>
          <span className="inline-block text-xs font-bold text-teal-900 bg-teal-100 px-3 py-1 rounded-full mb-5">
            WHOLE-CHILD CLARITY, REDESIGNED
          </span>
          <h1 className="font-display font-bold text-5xl sm:text-6xl leading-[1.05] tracking-tight text-teal-900">
            The tutoring platform where nothing important is hidden.
          </h1>
          <p className="mt-6 text-lg text-charcoal-teal/70 max-w-md">
            A premium whole-child ecosystem for mock exams, vetted tutors, and
            visible progress — so every score, message, and session note feels
            beautifully accountable.
          </p>
          <div className="mt-8 flex gap-3">
            <Button href="/register/parent" variant="primary" className="!rounded-full">I&apos;m a parent</Button>
            <Button href="/apply-tutor" variant="outline" className="!rounded-full">I&apos;m a tutor</Button>
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-white shadow-lg border border-teal-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-charcoal-teal/70">Amara&apos;s progress this week</p>
            <span className="text-xs font-bold text-brick-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brick-600 inline-block" /> LIVE
            </span>
          </div>
          <div className="flex justify-around">
            <div className="flex flex-col items-center gap-2">
              <ProgressRing progress={78} size={80} color="teal" />
              <span className="text-xs font-semibold text-center">Verbal Reasoning</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ProgressRing progress={84} size={80} color="coral" />
              <span className="text-xs font-semibold text-center">English</span>
            </div>
          </div>
          <p className="text-xs text-charcoal-teal/60 mt-5 text-center">
            78% on today&apos;s mock — up from 65% last month, with the revision plan already adjusted.
          </p>
        </div>
      </section>

      {/* Bento grid with a dark accent tile, lifted from the Framer concept's feature grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-3 gap-4">
          {bento.map((b) => (
            <div key={b.title} className={`rounded-[2rem] p-8 ${b.tint} ${b.span}`}>
              <p className="font-display font-bold text-2xl mb-2">{b.title}</p>
              <p className={b.dark ? "text-white/70" : "text-charcoal-teal/70"}>{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dark teal CTA band + refined footer, lifted from the Framer concept */}
      <section className="bg-teal-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4">Watch your child&apos;s progress, not just grades.</h2>
          <p className="text-teal-100/80 max-w-xl mx-auto mb-8">
            Join families and schools already using Fennby for 11+ prep, tutoring, and progress you can see happening.
          </p>
          <div className="flex justify-center gap-3">
            <Button href="/register/parent" variant="primary" className="!bg-coral-600 !rounded-full">Register as a parent</Button>
            <Button href="/apply-tutor" variant="outline" className="!rounded-full !border-white !text-white">Apply as a tutor</Button>
          </div>
        </div>
      </section>

      <footer className="bg-charcoal-teal text-white/60">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-wrap items-center justify-between gap-4 text-sm">
          <span>© Fennby — comparison variant, localhost only, not part of the live site.</span>
          <Link href="/" className="text-white font-semibold hover:underline">View live site →</Link>
        </div>
      </footer>
    </div>
  );
}
