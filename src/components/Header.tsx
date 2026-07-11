"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { publicTopLinks, campsDropdown, roleNav, publicPathPrefixes } from "@/lib/nav-config";
import { useHasSendProfile } from "@/lib/send-context";
import { Button } from "@/components/Button";
import type { Role } from "@/lib/types";

function isPublicPath(pathname: string) {
  return pathname === "/" || publicPathPrefixes.some((p) => pathname.startsWith(p));
}

// Derived from the actual URL section — matches the same prefixes the
// server-side middleware enforces, so the nav shown always matches which
// role-scoped area the signed-in user is really in.
function sectionRoleFromPath(pathname: string): Role {
  if (pathname.startsWith("/child")) return "child";
  if (pathname.startsWith("/tutor")) return "tutor";
  if (pathname.startsWith("/school")) return "school_admin";
  if (pathname.startsWith("/teacher")) return "teacher";
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/safeguarding")) return "safeguarding";
  if (pathname.startsWith("/authority")) return "authority";
  return "parent";
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [campsOpen, setCampsOpen] = useState(false);
  const publicMode = isPublicPath(pathname);
  const sectionRole = sectionRoleFromPath(pathname);
  const hasSend = useHasSendProfile();
  const links =
    sectionRole === "child" && hasSend
      ? [...roleNav[sectionRole], { href: "/child/calm-corner", label: "🌿 Calm Corner" }]
      : roleNav[sectionRole];

  return (
    <header className="sticky top-0 z-40 bg-mist-50/95 backdrop-blur border-b border-teal-100">
      <div className="w-full flex items-center justify-between px-6 py-3 gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/brand/fennby-logo-horizontal.svg" alt="Fennby" width={130} height={60} priority />
        </Link>

        {/* Desktop nav — kept deliberately minimal; audience segmentation
            (parents/kids/tutors/schools/council) lives in the floating bar.
            Once logged in, per-role navigation lives in the left sidebar,
            not here — this bar stays the same everywhere so Trust &
            Safeguarding and Report a concern are always in the same place.
            justify-between spreads links across the full width between the
            logo and the CTA, left to right, instead of clumping together. */}
        <nav className="hidden lg:flex items-center justify-between flex-1">
          {publicMode &&
            publicTopLinks.map((l, i) => (
              <span key={l.href} className="contents">
                <Link
                  href={l.href}
                  className={`px-2 py-2 rounded-full text-sm font-semibold min-h-[44px] flex items-center transition-colors whitespace-nowrap ${
                    l.href === "/trust" ? "text-brick-600" : "text-charcoal-teal hover:bg-teal-100"
                  }`}
                >
                  {l.label}
                </Link>
                {i === 1 && (
                  <div
                    className="relative"
                    onMouseEnter={() => setCampsOpen(true)}
                    onMouseLeave={() => setCampsOpen(false)}
                  >
                    <button
                      className="px-2 py-2 rounded-full text-sm font-semibold min-h-[44px] flex items-center whitespace-nowrap text-charcoal-teal hover:bg-teal-100"
                      aria-expanded={campsOpen}
                    >
                      {campsDropdown.label} ▾
                    </button>
                    {campsOpen && (
                      <div className="absolute top-full left-0 bg-white rounded-2xl shadow-lg border border-teal-100 py-2 min-w-[200px] z-50">
                        {campsDropdown.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-2.5 text-sm font-semibold text-charcoal-teal hover:bg-teal-100 whitespace-nowrap"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </span>
            ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {publicMode ? (
            <Button href="/get-started" variant="primary" className="px-5 py-2 text-sm">
              Get started
            </Button>
          ) : (
            <>
              <button aria-label="Notifications" className="rounded-full p-2 hover:bg-teal-100 min-h-[44px] min-w-[44px]">
                🔔
              </button>
              <span className="rounded-full bg-teal-100 px-3 py-2 text-sm font-semibold min-h-[44px] flex items-center">
                Account
              </span>
            </>
          )}
          {/* Public mode already has Safeguarding in the main nav — showing
              it again here would just be a duplicate link. */}
          {!publicMode && (
            <Link
              href="/trust#report"
              className="text-sm font-semibold text-brick-600 hover:underline min-h-[44px] flex items-center whitespace-nowrap"
            >
              Safeguarding
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden rounded-full p-2 hover:bg-teal-100 min-h-[44px] min-w-[44px]"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
            {mobileOpen ? (
              <path d="M5 5l14 14M19 5L5 19" stroke="#146B6B" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" stroke="#146B6B" strokeWidth="2" strokeLinecap="round" />
                <line x1="4" y1="12" x2="20" y2="12" stroke="#146B6B" strokeWidth="2" strokeLinecap="round" />
                <line x1="4" y1="17" x2="20" y2="17" stroke="#146B6B" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile accordion menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-teal-100 bg-mist-50 px-6 py-4 space-y-1">
          {publicMode ? (
            <>
              {publicTopLinks.map((l) => (
                <Link key={l.href} href={l.href} className="block font-semibold py-2 min-h-[44px] flex items-center" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              ))}
              <p className="text-xs font-bold text-charcoal-teal/50 pt-2">{campsDropdown.label.toUpperCase()}</p>
              {campsDropdown.items.map((item) => (
                <Link key={item.href} href={item.href} className="block font-semibold py-2 pl-3 min-h-[44px] flex items-center" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-3">
                <Button href="/get-started" variant="primary" className="flex-1 justify-center">Get started</Button>
              </div>
            </>
          ) : (
            <>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="block font-semibold py-2 min-h-[44px] flex items-center" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              ))}
              <Link href="/trust#report" className="block font-semibold text-brick-600 py-2 min-h-[44px] flex items-center" onClick={() => setMobileOpen(false)}>
                Safeguarding
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
