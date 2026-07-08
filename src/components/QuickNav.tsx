import Link from "next/link";

// Quick-access shortcuts to each audience's area. These are plain
// navigation links, not a role switcher — the middleware still enforces
// real sign-in for every one of these routes, so an unauthenticated click
// correctly lands on /login rather than faking access.
const destinations = [
  { label: "👪 Parents", href: "/parent" },
  { label: "🧒 Kids", href: "/child/today" },
  { label: "🎓 Tutors", href: "/tutor" },
  { label: "🏫 Schools", href: "/school" },
  { label: "🏛️ Council", href: "/authority/dashboard" },
];

export function QuickNav() {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex flex-wrap justify-center gap-1 bg-charcoal-teal/95 rounded-2xl p-1 shadow-lg max-w-[92vw]">
      {destinations.map((d) => (
        <Link
          key={d.href}
          href={d.href}
          className="text-xs font-semibold px-3 py-2 rounded-full min-h-[36px] flex items-center whitespace-nowrap text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          {d.label}
        </Link>
      ))}
    </div>
  );
}
