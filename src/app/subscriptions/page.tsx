"use client";

import { useEffect, useState } from "react";
import { Plus, MinusCircle } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Select, TextInput } from "@/components/ui/Field";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { apiFetch, ApiError } from "@/lib/apiClient";
import type { Subscription } from "@/features/subscriptions/schema";
import type { Student } from "@/features/students/schema";

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    studentId: "",
    packageName: "",
    startDate: "",
    endDate: "",
    totalSessions: 12,
  });

  const reload = () =>
    Promise.all([
      apiFetch<{ data: Subscription[] }>("/api/subscriptions"),
      apiFetch<{ data: Student[] }>("/api/students"),
    ]).then(([s, st]) => {
      setSubs(s.data);
      setStudents(st.data);
    });

  useEffect(() => {
    reload().catch(console.error);
  }, []);

  const studentMap = new Map(students.map((s) => [s.id, s.name]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch("/api/subscriptions", {
        method: "POST",
        body: JSON.stringify({ ...form, totalSessions: Number(form.totalSessions) }),
      });
      setOpen(false);
      await reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không tạo được gói");
    } finally {
      setSubmitting(false);
    }
  }

  async function useOne(id: string) {
    try {
      await apiFetch(`/api/subscriptions/${id}/use`, { method: "PATCH" });
      await reload();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Lỗi");
    }
  }

  const columns: Column<Subscription>[] = [
    { key: "student", header: "Học sinh", render: (r) => studentMap.get(r.studentId) ?? "—" },
    { key: "pkg", header: "Gói", render: (r) => r.packageName },
    {
      key: "range",
      header: "Hiệu lực",
      render: (r) => `${r.startDate} → ${r.endDate}`,
    },
    {
      key: "progress",
      header: "Tiến độ",
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-bg-main">
            <div
              className="h-full bg-accent"
              style={{ width: `${(r.usedSessions / r.totalSessions) * 100}%` }}
            />
          </div>
          <span className="text-[12px]">
            {r.usedSessions}/{r.totalSessions}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (r) =>
        r.isActive ? (
          <span className="rounded bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
            Active
          </span>
        ) : (
          <span className="rounded bg-bg-main px-2 py-0.5 text-[11px] font-semibold text-text-muted">
            Inactive
          </span>
        ),
    },
    {
      key: "actions",
      header: "",
      className: "px-3 py-2 text-right",
      render: (r) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => useOne(r.id)}
          disabled={!r.isActive || r.remainingSessions <= 0}
        >
          <MinusCircle className="h-3.5 w-3.5" /> Dùng 1 buổi
        </Button>
      ),
    },
  ];

  return (
    <>
      <Topbar title="Subscriptions" />
      <div className="thin-scrollbar flex-1 overflow-y-auto p-6">
        <PageHeader
          title="Gói học"
          description={`Tổng ${subs.length} gói`}
          actions={
            <Button onClick={() => setOpen(true)} disabled={students.length === 0}>
              <Plus className="h-4 w-4" /> Thêm gói
            </Button>
          }
        />
        <DataTable columns={columns} rows={subs} />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Tạo gói học">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Học sinh">
            <Select
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
              required
            >
              <option value="">-- Chọn --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Tên gói">
            <TextInput
              value={form.packageName}
              onChange={(e) => setForm({ ...form, packageName: e.target.value })}
              placeholder="Combo 12 buổi"
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Bắt đầu">
              <TextInput
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                required
              />
            </Field>
            <Field label="Kết thúc">
              <TextInput
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                required
              />
            </Field>
          </div>
          <Field label="Tổng số buổi">
            <TextInput
              type="number"
              min={1}
              value={form.totalSessions}
              onChange={(e) => setForm({ ...form, totalSessions: Number(e.target.value) })}
              required
            />
          </Field>
          {error && <p className="text-[12px] text-danger">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
