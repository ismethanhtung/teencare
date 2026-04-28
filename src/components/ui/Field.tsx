"use client";

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
      {children}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[11px] text-danger">{message}</p>;
}

const baseInput =
  "w-full rounded-md border border-border-main bg-bg-main px-3 py-2 text-[13px] text-text-main placeholder:text-text-muted/60 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/25";

export function TextInput({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...rest} className={cn(baseInput, className)} />;
}

export function Select({
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...rest} className={cn(baseInput, className)}>
      {children}
    </select>
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      {children}
      <FieldError message={error} />
    </div>
  );
}
