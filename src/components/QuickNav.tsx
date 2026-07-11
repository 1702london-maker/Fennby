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
      className="fixed bottom-6 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 flex flex-wrap justify-center gap-1 bg-charcoal-teal/95 rounded-2xl p-1.5 sm:p-1 shadow-lg max-w-[95vw]"
      style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
    >
      {destinations.map((d) => (
        <Link
          key={d.href}
          href={d.href}
          className="text-sm sm:text-xs font-semibold px-4 py-3 sm:px-3 sm:py-2 rounded-full min-h-[44px] flex items-center whitespace-nowrap text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          {d.label}
        </Link>
      ))}
    </div>
  );
}
