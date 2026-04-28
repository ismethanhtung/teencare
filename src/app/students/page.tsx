"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Select, TextInput } from "@/components/ui/Field";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { apiFetch, ApiError } from "@/lib/apiClient";
import type { Student } from "@/features/students/schema";
import type { Parent } from "@/features/parents/schema";

export default function StudentsPage() {
  const [rows, setRows] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "male" as "male" | "female" | "other",
    currentGrade: "",
    parentId: "",
  });

  const reload = () =>
    Promise.all([
      apiFetch<{ data: Student[] }>("/api/students"),
      apiFetch<{ data: Parent[] }>("/api/parents"),
    ]).then(([s, p]) => {
      setRows(s.data);
      setParents(p.data);
    });

  useEffect(() => {
    reload().catch(console.error);
  }, []);

  const parentMap = new Map(parents.map((p) => [p.id, p.name]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch("/api/students", { method: "POST", body: JSON.stringify(form) });
      setOpen(false);
      setForm({ name: "", dob: "", gender: "male", currentGrade: "", parentId: "" });
      await reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không tạo được học sinh");
    } finally {
      setSubmitting(false);
    }
  }

  const columns: Column<Student>[] = [
    { key: "name", header: "Tên", render: (r) => <span className="font-medium">{r.name}</span> },
    { key: "dob", header: "Ngày sinh", render: (r) => r.dob },
    { key: "gender", header: "Giới tính", render: (r) => r.gender },
    { key: "currentGrade", header: "Lớp", render: (r) => r.currentGrade },
    { key: "parent", header: "Phụ huynh", render: (r) => parentMap.get(r.parentId) ?? "—" },
  ];

  return (
    <>
      <Topbar title="Học sinh" />
      <div className="thin-scrollbar flex-1 overflow-y-auto p-6">
        <PageHeader
          title="Danh sách học sinh"
          description={`Tổng ${rows.length} học sinh`}
          actions={
            <Button onClick={() => setOpen(true)} disabled={parents.length === 0}>
              <Plus className="h-4 w-4" /> Thêm học sinh
            </Button>
          }
        />
        {parents.length === 0 && (
          <p className="mb-3 text-[12px] text-warning">
            Bạn cần tạo ít nhất 1 phụ huynh trước.
          </p>
        )}
        <DataTable columns={columns} rows={rows} />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Thêm học sinh">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Họ tên">
            <TextInput
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ngày sinh">
              <TextInput
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                required
              />
            </Field>
            <Field label="Lớp">
              <TextInput
                value={form.currentGrade}
                onChange={(e) => setForm({ ...form, currentGrade: e.target.value })}
                placeholder="6"
                required
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Giới tính">
              <Select
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value as typeof form.gender })
                }
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </Select>
            </Field>
            <Field label="Phụ huynh">
              <Select
                value={form.parentId}
                onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                required
              >
                <option value="">-- Chọn --</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {p.phone}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
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
