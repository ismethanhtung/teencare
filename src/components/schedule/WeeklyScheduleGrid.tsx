import { cn } from "@/lib/cn";
import type { ClassWithCount } from "@/features/classes/schema";

const DAYS = [
  { dow: 1, label: "T2" },
  { dow: 2, label: "T3" },
  { dow: 3, label: "T4" },
  { dow: 4, label: "T5" },
  { dow: 5, label: "T6" },
  { dow: 6, label: "T7" },
  { dow: 0, label: "CN" },
];

export function WeeklyScheduleGrid({ classes }: { classes: ClassWithCount[] }) {
  const byDay = new Map<number, ClassWithCount[]>();
  for (const c of classes) {
    const arr = byDay.get(c.dayOfWeek) ?? [];
    arr.push(c);
    byDay.set(c.dayOfWeek, arr);
  }
  for (const arr of byDay.values()) {
    arr.sort((a, b) => a.timeSlot.start.localeCompare(b.timeSlot.start));
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      {DAYS.map(({ dow, label }) => {
        const items = byDay.get(dow) ?? [];
        return (
          <div
            key={dow}
            className="flex min-h-[200px] flex-col gap-2 rounded-md border border-border-main bg-bg-secondary/40 p-2"
          >
            <div className="text-center text-[11px] font-bold uppercase tracking-wider text-text-muted">
              {label}
            </div>
            {items.length === 0 ? (
              <div className="flex flex-1 items-center justify-center text-[11px] text-text-muted/60">
                —
              </div>
            ) : (
              items.map((c) => (
                <div
                  key={c.id}
                  className={cn(
                    "rounded border border-border-main bg-bg-main px-2 py-1.5 text-[11px] leading-tight",
                  )}
                  title={`${c.name} · ${c.subject} · ${c.teacherName}`}
                >
                  <p className="font-semibold text-accent">
                    {c.timeSlot.start}–{c.timeSlot.end}
                  </p>
                  <p className="mt-0.5 truncate font-medium">{c.name}</p>
                  <p className="mt-0.5 truncate text-text-muted">
                    {c.teacherName} · {c.registeredCount}/{c.maxStudents}
                  </p>
                </div>
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}
