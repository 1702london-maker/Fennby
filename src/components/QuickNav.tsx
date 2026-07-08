import Link from "next/link";

// Quick-access shortcuts to each audience's sign-in screen. These route to
// /login pre-selected on the right role tab (or straight to the dedicated
// child login), not to the dashboard itself — the dashboard route requires
// a real session and would otherwise bounce through a confusing redirect.
const destinations = [
  { label: "👪 Parents", href: "/login?as=parent" },
  { label: "🧒 Kids", href: "/child-login" },
  { label: "🎓 Tutors", href: "/login?as=tutor" },
  { label: "🏫 Schools", href: "/login?as=school_admin" },
  { label: "🏛️ Council", href: "/login?as=authority" },
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
