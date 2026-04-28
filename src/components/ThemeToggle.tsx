"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

type Theme = "light" | "dark";
const STORAGE_KEY = "teenup-theme";

function applyTheme(theme: Theme) {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
}

function readInitialTheme(): Theme {
    if (typeof document === "undefined") return "light";
    const fromAttr = document.documentElement.dataset.theme;
    if (fromAttr === "light" || fromAttr === "dark") return fromAttr;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark") return stored;
    } catch {
        // ignore
    }
    return "light";
}

export function ThemeToggle({ className }: { className?: string }) {
    const [theme, setTheme] = useState<Theme>(readInitialTheme);
    const [mounted, setMounted] = useState(false);

    // One-shot flag to render the correct icon after hydration without flash.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMounted(true), []);

    function toggle() {
        const next: Theme = theme === "dark" ? "light" : "dark";
        setTheme(next);
        applyTheme(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // ignore
        }
    }

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label="Đổi theme"
            title={theme === "dark" ? "Sang light mode" : "Sang dark mode"}
            className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-md border border-border-main bg-bg-secondary text-text-muted transition-colors hover:border-accent/40 hover:text-text-main",
                className,
            )}
        >
            {mounted && theme === "dark" ? (
                <Sun className="h-4 w-4" />
            ) : (
                <Moon className="h-4 w-4" />
            )}
        </button>
    );
}

/**
 * Inline script to set data-theme before React hydration to avoid flash.
 */
export const themeBootstrapScript = `
try {
  var t = localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
  if (t !== 'light' && t !== 'dark') t = 'light';
  document.documentElement.dataset.theme = t;
  document.documentElement.style.colorScheme = t;
} catch (_) {}
`;
