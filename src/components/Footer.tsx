import Image from "next/image";
import Link from "next/link";

// Order matters on mobile: For Families and Trust & Safety sit on the
// left of their row, which leaves School and Company enough width to sit
// beside them instead of the row overflowing or wrapping awkwardly.
const columns = [
  {
    title: "For Families",
    links: [
      { href: "/child/mock-exams", label: "Mock Exams" },
      { href: "/parent/tutors", label: "Vetted Tutors" },
      { href: "/parent", label: "Parent Dashboard" },
      { href: "/vocational", label: "Vocational & Craft" },
      { href: "/summer-camps", label: "Summer Camps" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Trust & Safety",
    links: [
      { href: "/trust", label: "Safeguarding Framework" },
      { href: "/trust#vetting", label: "Tutor Vetting & DBS" },
      { href: "/trust#data", label: "Data & Privacy" },
      { href: "/trust#report", label: "Report a Concern" },
      { href: "/trust#accessibility", label: "Accessibility" },
    ],
  },
  {
    title: "For Schools",
    links: [
      { href: "/school", label: "School Dashboard" },
      { href: "/school/reports", label: "Pupil Premium Reports" },
      { href: "/school/network", label: "School Network" },
      { href: "/school/demo", label: "Book a Demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Fennby" },
      { href: "/careers", label: "Careers" },
      { href: "/school/reports", label: "Impact Reports" },
      { href: "/contact", label: "Contact" },
      { href: "/blog", label: "Blog" },
    ],
  },
];

const socials = [
  { label: "Instagram", icon: "📷" },
  { label: "Facebook", icon: "📘" },
  { label: "LinkedIn", icon: "💼" },
  { label: "YouTube", icon: "▶️" },
];

export function Footer() {
  return (
    <footer className="bg-teal-100 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-3 gap-x-6 gap-y-10 lg:flex lg:items-start lg:justify-between lg:gap-10">
        {/* 3 columns on mobile: logo is its own column spanning both rows,
            then the four link groups auto-fill the remaining two columns
            two-deep each (For Families/For Schools stacked in one column,
            Trust & Safety/Company stacked in the other). On desktop this
            switches to a flex row so the logo sits fixed-width on the far
            left, at the same x-position as the header logo, with the four
            columns spread edge to edge across the rest of the width. */}
        <div className="row-span-2 lg:row-span-1 lg:w-52 lg:shrink-0">
          <Image src="/brand/fennby-logo-stacked.svg" alt="Fennby" width={80} height={88} />
          <p className="text-sm text-charcoal-teal/80 mt-4 max-w-[180px]">
            The only tutoring platform where nothing about your child is hidden from you.
          </p>
          <div className="flex gap-3 mt-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-teal-700 hover:text-white min-h-[36px]"
              >
                <span aria-hidden>{s.icon}</span>
              </a>
            ))}
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-display font-bold text-sm text-teal-900 mb-3">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-charcoal-teal/80 hover:text-teal-900 hover:underline min-h-[36px] inline-flex items-center">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* The floating QuickNav bar is fixed to the viewport, so at the very
          bottom of a page it would otherwise sit on top of this row —
          pb-24/pb-20 gives the page enough extra height to scroll this row
          fully clear of the bar instead of leaving it permanently covered. */}
      <div className="border-t border-teal-900/10 pb-24 sm:pb-20">
        <div className="max-w-7xl mx-auto px-6 pt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-charcoal-teal/70">
          <span>&copy; {2026} Fennby. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/legal/terms" className="hover:underline min-h-[36px] flex items-center">Terms</Link>
            <Link href="/legal/privacy" className="hover:underline min-h-[36px] flex items-center">Privacy Policy</Link>
            <Link href="/legal/cookies" className="hover:underline min-h-[36px] flex items-center">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
