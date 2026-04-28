import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Topbar({
    title,
    actions,
}: {
    title: string;
    actions?: ReactNode;
}) {
    return (
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-main bg-bg-secondary/40 px-6">
            <h1 className="text-[14px] font-semibold tracking-tight text-text-main">
                {title}
            </h1>
            <div className="flex items-center gap-2">
                {actions}
                <ThemeToggle />
            </div>
        </header>
    );
}
