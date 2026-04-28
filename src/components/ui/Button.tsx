"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const variantClass: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent/90 focus:ring-accent/40",
  secondary:
    "border border-border-main bg-bg-secondary text-text-main hover:bg-bg-secondary/80 focus:ring-accent/30",
  ghost: "text-text-muted hover:bg-bg-secondary/80 hover:text-text-main",
  danger: "bg-danger text-white hover:bg-danger/90 focus:ring-danger/40",
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-[12px]",
  md: "h-9 px-4 text-[13px]",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
    >
      {children}
    </button>
  );
}
