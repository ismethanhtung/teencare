"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Select, TextInput } from "@/components/ui/Field";
import { WeeklyScheduleGrid } from "@/components/schedule/WeeklyScheduleGrid";
import { apiFetch, ApiError } from "@/lib/apiClient";
import type { ClassWithCount } from "@/features/classes/schema";

const DAY_OPTS = [
  { v: 1, l: "Thứ 2" },
  { v: 2, l: "Thứ 3" },
  { v: 3, l: "Thứ 4" },
  { v: 4, l: "Thứ 5" },
  { v: 5, l: "Thứ 6" },
  { v: 6, l: "Thứ 7" },
  { v: 0, l: "Chủ Nhật" },
];

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassWithCount[]>([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    subject: "",
    dayOfWeek: 1,
    start: "18:00",
    end: "19:30",
    teacherName: "",
    maxStudents: 15,
  });

  const load = () =>
    apiFetch<{ data: ClassWithCount[] }>("/api/classes").then((r) => setClasses(r.data));

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch("/api/classes", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          subject: form.subject,
          dayOfWeek: Number(form.dayOfWeek),
          timeSlot: { start: form.start, end: form.end },
          teacherName: form.teacherName,
          maxStudents: Number(form.maxStudents),
        }),
      });
      setOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không tạo được lớp");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Topbar title="Lớp & Lịch tuần" />
      <div className="thin-scrollbar flex-1 overflow-y-auto p-6">
        <PageHeader
          title="Lịch lớp theo tuần"
          description={`Tổng ${classes.length} lớp`}
          actions={
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> Thêm lớp
            </Button>
          }
        />
        <WeeklyScheduleGrid classes={classes} />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Thêm lớp">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Tên lớp">
            <TextInput
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Môn">
              <TextInput
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
            </Field>
            <Field label="Giáo viên">
              <TextInput
                value={form.teacherName}
                onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
                required
              />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Ngày">
              <Select
                value={form.dayOfWeek}
                onChange={(e) => setForm({ ...form, dayOfWeek: Number(e.target.value) })}
              >
                {DAY_OPTS.map((d) => (
                  <option key={d.v} value={d.v}>
                    {d.l}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Bắt đầu">
              <TextInput
                type="time"
                value={form.start}
                onChange={(e) => setForm({ ...form, start: e.target.value })}
                required
              />
            </Field>
            <Field label="Kết thúc">
              <TextInput
                type="time"
                value={form.end}
                onChange={(e) => setForm({ ...form, end: e.target.value })}
                required
              />
            </Field>
          </div>
          <Field label="Sĩ số tối đa">
            <TextInput
              type="number"
              min={1}
              value={form.maxStudents}
              onChange={(e) => setForm({ ...form, maxStudents: Number(e.target.value) })}
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
