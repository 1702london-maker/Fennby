"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NavDropdown } from "@/lib/nav-config";

export function NavDropdownMenu({ dropdown }: { dropdown: NavDropdown }) {
  const [open, setOpen] = useState(false);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  // Close on outside click or Escape — NOT on mouseleave, which was closing
  // the menu while the cursor crossed the gap between the button and panel.
  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const onButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => itemRefs.current[0]?.focus());
    } else if (e.key === "Escape") {
      close();
    }
  };

  const onItemKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      itemRefs.current[(i + 1) % dropdown.items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      itemRefs.current[(i - 1 + dropdown.items.length) % dropdown.items.length]?.focus();
    } else if (e.key === "Escape") {
      close();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        ref={buttonRef}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onButtonKeyDown}
        className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-semibold text-charcoal-teal hover:bg-teal-100 min-h-[44px]"
      >
        {dropdown.label}
        <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full pt-2 min-w-[220px] z-50"
        >
          <div className="rounded-2xl bg-white shadow-lg border border-teal-100 p-2">
            {dropdown.items.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                onKeyDown={(e) => onItemKeyDown(e, i)}
                onClick={close}
                className="block px-4 py-2 rounded-xl text-sm font-medium text-charcoal-teal hover:bg-teal-100 min-h-[40px] flex items-center"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
