import { ReactNode } from "react";

export function Card({
  children,
  className = "",
  tint = "white",
  id,
}: {
  children: ReactNode;
  className?: string;
  tint?: "white" | "teal" | "coral" | "dark";
  id?: string;
}) {
  const tintClasses = {
    white: "bg-white",
    teal: "bg-teal-100",
    coral: "bg-coral-100",
    dark: "bg-charcoal-teal text-white",
  }[tint];
  return (
    <div id={id} className={`rounded-3xl ${tintClasses} p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
