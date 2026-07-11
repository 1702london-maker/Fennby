import Link from "next/link";

// Fennby's real differentiator vs. competitors like GoStudent: audience
// segmentation lives here, not buried in header dropdowns. Each button leads
// to that audience's own landing page first (what you get, why it's safe),
// which then carries its own login/get-started route — not a bare login
// form, so a first-time visitor understands what they're signing up for.
const destinations = [
  { label: "👪 Parents", href: "/for-families" },
  { label: "🧒 Kids", href: "/for-kids" },
  { label: "🎓 Tutors", href: "/for-tutors" },
  { label: "🏫 Schools", href: "/for-schools" },
  { label: "🏛️ Council", href: "/for-local-authorities" },
  { label: "🧩 SEND", href: "/send-accessibility" },
];

export function QuickNav() {
  return (
    <div
      className="fixed bottom-8 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 flex flex-nowrap items-center justify-center gap-0.5 bg-charcoal-teal/95 rounded-full p-1 shadow-lg max-w-[96vw] overflow-x-auto"
      style={{ paddingBottom: "max(0.25rem, env(safe-area-inset-bottom))" }}
    >
      {destinations.map((d) => (
        <Link
          key={d.href}
          href={d.href}
          className="text-xs sm:text-xs font-semibold px-2.5 py-2.5 sm:px-3 sm:py-2 rounded-full min-h-[40px] flex items-center whitespace-nowrap shrink-0 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          {d.label}
        </Link>
      ))}
    </div>
  );
}
