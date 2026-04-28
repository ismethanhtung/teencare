"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { PageHeader } from "@/components/ui/PageHeader";
import { apiFetch } from "@/lib/apiClient";
import { Users, GraduationCap, CalendarDays, Package } from "lucide-react";
import type { Parent } from "@/features/parents/schema";
import type { Student } from "@/features/students/schema";
import type { ClassWithCount } from "@/features/classes/schema";
import type { Subscription } from "@/features/subscriptions/schema";

const DAY_LABEL = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export default function DashboardPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassWithCount[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<{ data: Parent[] }>("/api/parents"),
      apiFetch<{ data: Student[] }>("/api/students"),
      apiFetch<{ data: ClassWithCount[] }>("/api/classes"),
      apiFetch<{ data: Subscription[] }>("/api/subscriptions"),
    ])
      .then(([p, s, c, sb]) => {
        setParents(p.data);
        setStudents(s.data);
        setClasses(c.data);
        setSubs(sb.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const todayDow = new Date().getDay();
  const todayClasses = classes.filter((c) => c.dayOfWeek === todayDow);
  const activeSubs = subs.filter((s) => s.isActive).length;

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="thin-scrollbar flex-1 overflow-y-auto p-6">
        <PageHeader
          title="Tổng quan"
          description={loading ? "Đang tải dữ liệu..." : "Tóm tắt dữ liệu hệ thống"}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard icon={<Users className="h-4 w-4" />} label="Phụ huynh" value={parents.length} />
          <KpiCard icon={<GraduationCap className="h-4 w-4" />} label="Học sinh" value={students.length} />
          <KpiCard icon={<CalendarDays className="h-4 w-4" />} label="Lớp học" value={classes.length} />
          <KpiCard icon={<Package className="h-4 w-4" />} label="Gói học active" value={activeSubs} />
        </div>

        <h3 className="mt-8 mb-3 text-[12px] font-bold uppercase tracking-wider text-text-muted">
          Lớp hôm nay ({DAY_LABEL[todayDow]})
        </h3>
        {todayClasses.length === 0 ? (
          <div className="rounded-md border border-border-main bg-bg-secondary/40 p-6 text-center text-[13px] text-text-muted">
            Không có lớp nào hôm nay
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {todayClasses.map((c) => (
              <div key={c.id} className="rounded-md border border-border-main bg-bg-secondary/40 p-4">
                <div className="flex items-baseline justify-between">
                  <p className="font-semibold">{c.name}</p>
                  <span className="text-[11px] text-text-muted">
                    {c.timeSlot.start}–{c.timeSlot.end}
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-text-muted">
                  {c.subject} · GV: {c.teacherName}
                </p>
                <p className="mt-2 text-[12px]">
                  <span className="font-semibold text-accent">{c.registeredCount}</span>
                  <span className="text-text-muted"> / {c.maxStudents} học sinh</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function KpiCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-md border border-border-main bg-bg-secondary/40 p-4">
      <div className="flex items-center gap-2 text-text-muted">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
