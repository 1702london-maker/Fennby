"use client";

import { usePreviewRole } from "@/lib/role-context";
import { Role } from "@/lib/types";

const roles: { key: Role; label: string; href: string }[] = [
  { key: "child", label: "🧒 Child", href: "/child/today" },
  { key: "parent", label: "👪 Parent", href: "/parent" },
  { key: "tutor", label: "🎓 Tutor", href: "/tutor" },
  { key: "school_admin", label: "🏫 School", href: "/school" },
  { key: "teacher", label: "📚 Teacher", href: "/teacher/dashboard" },
  { key: "admin", label: "🛠️ Admin", href: "/admin/dashboard" },
  { key: "safeguarding", label: "🛡️ DSL", href: "/safeguarding/dashboard" },
  { key: "authority", label: "🏛️ LA", href: "/authority/dashboard" },
];

export default function RoleSwitcher() {
  const { role, setRole } = usePreviewRole();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-wrap gap-1 bg-charcoal-teal/95 rounded-2xl p-1 shadow-lg max-w-[90vw]">
      {roles.map((r) => (
        <a
          key={r.key}
          href={r.href}
          onClick={() => setRole(r.key)}
          className={`text-xs font-semibold px-3 py-2 rounded-full min-h-[36px] flex items-center whitespace-nowrap transition-colors ${
            role === r.key ? "bg-coral-600 text-white" : "text-white/70 hover:text-white"
          }`}
        >
          {r.label}
        </a>
      ))}
    </div>
  );
}
