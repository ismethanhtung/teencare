"use client";

import { useMemo, useState } from "react";
import type { ElementType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ChevronDown,
    ChevronRight,
    Search,
    SlidersHorizontal,
    Sparkles,
    FolderKanban,
    PlugZap,
    Home,
    Users,
    GraduationCap,
    CalendarDays,
    ClipboardList,
    Package,
    BookOpen,
    GanttChartSquare,
    Activity,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type NavItem = {
    id: string;
    label: string;
    icon: ElementType;
    href: string;
    badge?: string;
};

type LeftbarNavGroup = {
    sectionId: string;
    groupLabel: string;
    sectionIcon: ElementType;
    items: NavItem[];
};

const LEFTBAR_NAV: LeftbarNavGroup[] = [
    {
        sectionId: "general",
        groupLabel: "General",
        sectionIcon: SlidersHorizontal,
        items: [{ id: "dashboard", label: "Dashboard", icon: Home, href: "/" }],
    },
    {
        sectionId: "people",
        groupLabel: "Quản lý",
        sectionIcon: Sparkles,
        items: [
            {
                id: "parents",
                label: "Phụ huynh",
                icon: Users,
                href: "/parents",
            },
            {
                id: "students",
                label: "Học sinh",
                icon: GraduationCap,
                href: "/students",
            },
        ],
    },
    {
        sectionId: "schedule",
        groupLabel: "Lớp học",
        sectionIcon: GanttChartSquare,
        items: [
            {
                id: "classes",
                label: "Lớp & Lịch tuần",
                icon: CalendarDays,
                href: "/classes",
            },
            {
                id: "registrations",
                label: "Đăng ký lớp",
                icon: ClipboardList,
                href: "/registrations",
            },
        ],
    },
    {
        sectionId: "billing",
        groupLabel: "Gói học",
        sectionIcon: FolderKanban,
        items: [
            {
                id: "subscriptions",
                label: "Subscriptions",
                icon: Package,
                href: "/subscriptions",
            },
        ],
    },
    {
        sectionId: "system",
        groupLabel: "System",
        sectionIcon: PlugZap,
        items: [
            {
                id: "health",
                label: "Health check",
                icon: Activity,
                href: "/health",
            },
            { id: "docs", label: "Tài liệu", icon: BookOpen, href: "/docs" },
        ],
    },
];

function filterNav(
    groups: LeftbarNavGroup[],
    query: string,
): LeftbarNavGroup[] {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
        .map((g) => ({
            ...g,
            items: g.items.filter((i) => i.label.toLowerCase().includes(q)),
        }))
        .filter((g) => g.items.length > 0);
}

function SectionHeader({
    label,
    icon: Icon,
    isOpen,
    onToggle,
}: {
    label: string;
    icon: ElementType;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="group flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors hover:bg-bg-secondary/80"
        >
            <div className="flex min-w-0 items-center gap-2.5">
                <Icon className="h-3.5 w-3.5 shrink-0 text-text-muted group-hover:text-text-main" />
                <span className="text-[10px] font-black uppercase tracking-[0.12em] text-text-muted group-hover:text-text-main">
                    {label}
                </span>
            </div>
            {isOpen ? (
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-text-muted group-hover:text-text-main" />
            ) : (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-text-muted group-hover:text-text-main" />
            )}
        </button>
    );
}

export function Leftbar({ appVersion = "0.1.0" }: { appVersion?: string }) {
    const pathname = usePathname();
    const [navQuery, setNavQuery] = useState("");
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        general: true,
        people: true,
        schedule: true,
        billing: true,
        system: true,
    });

    const filteredGroups = useMemo(
        () => filterNav(LEFTBAR_NAV, navQuery),
        [navQuery],
    );
    const toggle = (id: string) =>
        setOpenSections((p) => ({ ...p, [id]: !p[id] }));

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname?.startsWith(href);

    return (
        <aside className="flex h-full min-h-0 w-[264px] shrink-0 select-none flex-col overflow-hidden border-r border-border-main bg-bg-secondary/40">
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-border-main px-4">
                <Link
                    href="/"
                    className="flex min-w-0 items-center gap-2.5"
                    title="Home"
                >
                    <span className="truncate text-[14px] font-bold tracking-tight text-text-main">
                        TeenUp LMS
                    </span>
                </Link>
            </div>

            <div className="shrink-0 px-3 py-2.5">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
                    <input
                        type="search"
                        value={navQuery}
                        onChange={(e) => setNavQuery(e.target.value)}
                        placeholder="Tìm kiếm..."
                        className="w-full rounded-md border border-border-main bg-bg-main py-1.5 pl-8 pr-3 text-[12px] text-text-main placeholder:text-text-muted/60 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/25"
                    />
                </div>
            </div>

            <nav className="thin-scrollbar flex-1 min-h-0 overflow-y-auto px-2 pb-6 pt-1">
                {filteredGroups.map((group) => {
                    const isOpen = openSections[group.sectionId] ?? true;
                    return (
                        <div key={group.sectionId} className="mt-1 first:mt-0">
                            <SectionHeader
                                label={group.groupLabel}
                                icon={group.sectionIcon}
                                isOpen={isOpen}
                                onToggle={() => toggle(group.sectionId)}
                            />
                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                            duration: 0.2,
                                            ease: "easeInOut",
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <div className="space-y-0.5 py-1">
                                            {group.items.map((item) => {
                                                const active = !!isActive(
                                                    item.href,
                                                );
                                                const Icon = item.icon;
                                                return (
                                                    <Link
                                                        key={item.id}
                                                        href={item.href}
                                                        className={cn(
                                                            "group flex w-full items-center gap-2.5 border-l-2 py-1.5 pl-2.5 pr-2 text-left transition-all duration-150",
                                                            active
                                                                ? "border-l-accent bg-accent/10"
                                                                : "border-l-transparent hover:bg-bg-secondary/90",
                                                        )}
                                                    >
                                                        <Icon
                                                            className={cn(
                                                                "h-3.5 w-3.5 shrink-0",
                                                                active
                                                                    ? "text-accent"
                                                                    : "text-text-muted group-hover:text-text-main",
                                                            )}
                                                            strokeWidth={
                                                                active
                                                                    ? 2.2
                                                                    : 1.8
                                                            }
                                                        />
                                                        <span
                                                            className={cn(
                                                                "min-w-0 flex-1 truncate text-[12px]",
                                                                active
                                                                    ? "font-semibold text-text-main"
                                                                    : "text-text-muted group-hover:text-text-main",
                                                            )}
                                                        >
                                                            {item.label}
                                                        </span>
                                                        {item.badge ? (
                                                            <span className="rounded bg-bg-secondary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-text-muted">
                                                                {item.badge}
                                                            </span>
                                                        ) : null}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </nav>

            <div className="shrink-0 border-t border-border-main bg-bg-secondary/30 px-3 py-3">
                <p className="text-center text-[10px] font-medium text-text-muted">
                    TeenUp LMS · v{appVersion}
                </p>
            </div>
        </aside>
    );
}
