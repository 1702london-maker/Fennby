"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/features/auth/actions";

export function AccountMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const onLogout = async () => {
    setLoggingOut(true);
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Account menu"
        className="rounded-full bg-teal-100 px-3 py-2 text-sm font-semibold min-h-[44px] flex items-center gap-1 hover:bg-teal-100/80"
      >
        Account ▾
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-lg border border-teal-100 py-2 z-50">
          <button
            onClick={onLogout}
            disabled={loggingOut}
            className="w-full text-left px-4 py-2.5 text-sm font-semibold text-brick-600 hover:bg-teal-100/50 min-h-[44px]"
          >
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      )}
    </div>
  );
}
