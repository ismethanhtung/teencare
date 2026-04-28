"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, TextInput } from "@/components/ui/Field";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { apiFetch, ApiError } from "@/lib/apiClient";
import type { Parent } from "@/features/parents/schema";

type FormState = { name: string; phone: string; email: string };
const EMPTY: FormState = { name: "", phone: "", email: "" };

export default function ParentsPage() {
  const [rows, setRows] = useState<Parent[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const load = () =>
    apiFetch<{ data: Parent[] }>("/api/parents").then((r) => setRows(r.data));

  useEffect(() => {
    load().catch(console.error);
  }, []);

  function openCreate() {
    setEditId(null);
    setForm(EMPTY);
    setError(null);
    setOpen(true);
  }
  function openEdit(p: Parent) {
    setEditId(p.id);
    setForm({ name: p.name, phone: p.phone, email: p.email ?? "" });
    setError(null);
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editId) {
        await apiFetch(`/api/parents/${editId}`, {
          method: "PATCH",
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            email: form.email ? form.email : null,
          }),
        });
      } else {
        await apiFetch("/api/parents", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            email: form.email || undefined,
          }),
        });
      }
      setOpen(false);
      setForm(EMPTY);
      setEditId(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không lưu được");
    } finally {
      setSubmitting(false);
    }
  }

  const columns: Column<Parent>[] = [
    { key: "name", header: "Tên", render: (r) => <span className="font-medium">{r.name}</span> },
    { key: "phone", header: "SĐT", render: (r) => r.phone },
    { key: "email", header: "Email", render: (r) => r.email ?? "—" },
    {
      key: "actions",
      header: "",
      className: "px-3 py-2 text-right",
      render: (r) => (
        <Button variant="secondary" size="sm" onClick={() => openEdit(r)}>
          <Pencil className="h-3.5 w-3.5" /> Sửa
        </Button>
      ),
    },
  ];

  return (
    <>
      <Topbar title="Phụ huynh" />
      <div className="thin-scrollbar flex-1 overflow-y-auto p-6">
        <PageHeader
          title="Danh sách phụ huynh"
          description={`Tổng ${rows.length} phụ huynh`}
          actions={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" /> Thêm phụ huynh
            </Button>
          }
        />
        <DataTable columns={columns} rows={rows} />
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editId ? "Sửa phụ huynh" : "Thêm phụ huynh"}
      >
        <form onSubmit={submit} className="space-y-4">
          <Field label="Họ tên">
            <TextInput
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </Field>
          <Field label="Số điện thoại">
            <TextInput
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </Field>
          <Field label="Email (tùy chọn)">
            <TextInput
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          {error && <p className="text-[12px] text-danger">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Đang lưu..." : editId ? "Cập nhật" : "Lưu"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
