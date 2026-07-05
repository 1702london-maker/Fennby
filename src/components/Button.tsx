import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary: "bg-teal-900 text-white hover:bg-teal-700",
  secondary: "bg-coral-600 text-white hover:bg-[#e17352]",
  outline: "border-2 border-teal-900 text-teal-900 hover:bg-teal-100",
  ghost: "text-teal-900 hover:bg-teal-100",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-bold px-6 py-3 text-base transition-colors duration-150 min-h-[44px] disabled:opacity-50 disabled:pointer-events-none";

export function Button({
  variant = "primary",
  href,
  children,
  className = "",
  ...props
}: {
  variant?: Variant;
  href?: string;
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = `${base} ${variantClasses[variant]} ${className}`;
  if (href && !props.disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  if (href && props.disabled) {
    return (
      <span className={`${classes} opacity-50 pointer-events-none`} aria-disabled="true">
        {children}
      </span>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
