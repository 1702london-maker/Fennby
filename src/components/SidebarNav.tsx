"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { roleNav, publicPathPrefixes } from "@/lib/nav-config";
import { useHasSendProfile } from "@/lib/send-context";
import type { Role } from "@/lib/types";

function isPublicPath(pathname: string) {
  return pathname === "/" || publicPathPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

// A plain startsWith("/child") also matches "/child-login" — a sibling
// public route, not a segment of the child dashboard. isSection checks the
// prefix is followed by "/" or the end of the string, a real path segment.
function isSection(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function sectionRoleFromPath(pathname: string): Role {
  if (isSection(pathname, "/child")) return "child";
  if (isSection(pathname, "/tutor")) return "tutor";
  if (isSection(pathname, "/school")) return "school_admin";
  if (isSection(pathname, "/teacher")) return "teacher";
  if (isSection(pathname, "/admin")) return "admin";
  if (isSection(pathname, "/safeguarding")) return "safeguarding";
  if (isSection(pathname, "/authority")) return "authority";
  return "parent";
}

// The real, per-role dashboard menu — lives on the left once someone is
// logged in, instead of crowding the top bar. Trust & Safeguarding and
// Report a concern stay in the header above, unchanged, on every page.
export function SidebarNav() {
  const pathname = usePathname();
  const hasSend = useHasSendProfile();
  if (isPublicPath(pathname)) return null;

  const role = sectionRoleFromPath(pathname);
  // Same menu as every other child, plus one extra item — the SEND portal
  // is additive, never a different, separated experience.
  const links =
    role === "child" && hasSend
      ? [...roleNav[role], { href: "/child/calm-corner", label: "🌿 Calm Corner" }]
      : roleNav[role];

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
