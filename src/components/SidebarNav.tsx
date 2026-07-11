"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { roleNav, publicPathPrefixes } from "@/lib/nav-config";
import type { Role } from "@/lib/types";

function isPublicPath(pathname: string) {
  return pathname === "/" || publicPathPrefixes.some((p) => pathname.startsWith(p));
}

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

// The real, per-role dashboard menu — lives on the left once someone is
// logged in, instead of crowding the top bar. Trust & Safeguarding and
// Report a concern stay in the header above, unchanged, on every page.
export function SidebarNav() {
  const pathname = usePathname();
  if (isPublicPath(pathname)) return null;

  const role = sectionRoleFromPath(pathname);
  const links = roleNav[role];

  return (
    <aside className="hidden lg:block w-56 shrink-0 border-r border-teal-100 bg-mist-50 px-3 py-6">
      <nav className="space-y-1 sticky top-20">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`block px-4 py-2.5 rounded-2xl text-sm font-semibold min-h-[44px] flex items-center transition-colors ${
              pathname === l.href ? "bg-teal-900 text-white" : "text-teal-900 hover:bg-teal-100"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
