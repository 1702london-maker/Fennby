import Link from "next/link";

// Fennby's real differentiator vs. competitors like GoStudent: audience
// segmentation lives here, not buried in header dropdowns. These route to
// /login pre-selected on the right role tab (or straight to the dedicated
// child login), not to the dashboard itself — the dashboard route requires
// a real session and would otherwise bounce through a confusing redirect.
const destinations = [
  { label: "👪 Parents", href: "/login?as=parent" },
  { label: "🧒 Kids", href: "/child-login" },
  { label: "🎓 Tutors", href: "/login?as=tutor" },
  { label: "🏫 Schools", href: "/login?as=school_admin" },
  { label: "🏛️ Council", href: "/login?as=authority" },
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
