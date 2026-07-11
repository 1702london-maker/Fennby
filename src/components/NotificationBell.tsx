"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { fetchMyNotifications, markNotificationRead } from "@/features/notifications/actions";

interface NotificationRow {
  id: string;
  type: string;
  payload: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
}

const LABELS: Record<string, { title: string; tint: string; href: (n: NotificationRow) => string }> = {
  ai_tutor_safeguarding_alert: {
    title: "Urgent: flagged content in AI Tutor",
    tint: "bg-brick-600 text-white",
    href: () => `/parent/chat`,
  },
  ai_tutor_language_flag: {
    title: "Language flagged in AI Tutor",
    tint: "bg-coral-100 text-brick-600",
    href: () => `/parent/chat`,
  },
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const load = async () => {
    const result = await fetchMyNotifications();
    if (result.ok) setNotifications(result.data as unknown as NotificationRow[]);
    setLoaded(true);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        className="relative rounded-full p-2 hover:bg-teal-100 min-h-[44px] min-w-[44px]"
        onClick={() => {
          setOpen((o) => !o);
          if (!loaded) load();
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-brick-600" aria-hidden />
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] bg-white rounded-2xl shadow-lg border border-teal-100 py-2 z-50 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-charcoal-teal/60 px-4 py-6 text-center">No notifications yet.</p>
          ) : (
            notifications.map((n) => {
              const meta = LABELS[n.type] ?? { title: n.type, tint: "bg-teal-100 text-teal-900", href: () => "#" };
              const name = (n.payload as { learnerName?: string } | null)?.learnerName;
              return (
                <Link
                  key={n.id}
                  href={meta.href(n)}
                  onClick={() => {
                    if (!n.read_at) markNotificationRead(n.id);
                    setOpen(false);
                  }}
                  className={`block px-4 py-3 border-b border-teal-100 last:border-0 hover:bg-teal-100/50 ${!n.read_at ? "font-semibold" : "opacity-70"}`}
                >
                  <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-1 ${meta.tint}`}>
                    {meta.title}
                  </span>
                  <p className="text-sm text-charcoal-teal">
                    {name ? `Involving ${name}. ` : ""}Tap to review the conversation.
                  </p>
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
