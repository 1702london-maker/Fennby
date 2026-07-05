"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { publicNavDropdowns, publicTopLinks, roleNav, publicPathPrefixes } from "@/lib/nav-config";
import { NavDropdownMenu } from "@/components/NavDropdownMenu";
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
  const publicMode = isPublicPath(pathname);
  const links = roleNav[sectionRoleFromPath(pathname)];

  return (
    <header className="sticky top-0 z-40 bg-mist-50/95 backdrop-blur border-b border-teal-100">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3 gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/brand/fennby-logo-horizontal.svg" alt="Fennby" width={130} height={60} priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {publicMode ? (
            <>
              {publicNavDropdowns.map((d) => (
                <NavDropdownMenu key={d.label} dropdown={d} />
              ))}
              {publicTopLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 py-2 rounded-full text-sm font-semibold min-h-[44px] flex items-center transition-colors ${
                    l.href === "/trust" ? "text-brick-600" : "text-charcoal-teal hover:bg-teal-100"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </>
          ) : (
            links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-full text-sm font-semibold min-h-[44px] flex items-center transition-colors ${
                  pathname === l.href ? "bg-teal-900 text-white" : "text-teal-900 hover:bg-teal-100"
                }`}
              >
                {l.label}
              </Link>
            ))
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {publicMode ? (
            <>
              <Link href="/parent" className="text-sm font-semibold text-teal-900 hover:underline px-2 min-h-[44px] flex items-center">
                Log in
              </Link>
              <Button href="/parent" variant="primary" className="px-5 py-2 text-sm">
                Get started
              </Button>
            </>
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
          <Link
            href={publicMode ? "/trust" : "/report-concern"}
            className="text-sm font-semibold text-brick-600 hover:underline min-h-[44px] flex items-center whitespace-nowrap"
          >
            Report a concern
          </Link>
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
        <div className="lg:hidden border-t border-teal-100 bg-mist-50 px-6 py-4 space-y-4">
          {publicMode ? (
            <>
              {publicNavDropdowns.map((d) => (
                <details key={d.label} className="group">
                  <summary className="font-semibold py-2 cursor-pointer list-none flex items-center justify-between min-h-[44px]">
                    {d.label}
                    <span aria-hidden>+</span>
                  </summary>
                  <div className="pl-4 flex flex-col gap-1 pb-2">
                    {d.items.map((item) => (
                      <Link key={item.href} href={item.href} className="py-2 text-sm min-h-[44px] flex items-center" onClick={() => setMobileOpen(false)}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
              {publicTopLinks.map((l) => (
                <Link key={l.href} href={l.href} className="block font-semibold py-2 min-h-[44px] flex items-center" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-2">
                <Button href="/parent" variant="outline" className="flex-1 justify-center">Log in</Button>
                <Button href="/parent" variant="primary" className="flex-1 justify-center">Get started</Button>
              </div>
            </>
          ) : (
            <>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="block font-semibold py-2 min-h-[44px] flex items-center" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              ))}
              <Link href="/report-concern" className="block font-semibold text-brick-600 py-2 min-h-[44px] flex items-center" onClick={() => setMobileOpen(false)}>
                Report a concern
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
