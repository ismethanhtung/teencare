"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Field, Select } from "@/components/ui/Field";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { apiFetch, ApiError } from "@/lib/apiClient";
import type { Registration } from "@/features/registrations/schema";
import type { ClassWithCount } from "@/features/classes/schema";
import type { Student } from "@/features/students/schema";
import type { Subscription } from "@/features/subscriptions/schema";

const DAY_LABEL = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export default function RegistrationsPage() {
    const [regs, setRegs] = useState<Registration[]>([]);
    const [classes, setClasses] = useState<ClassWithCount[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [subs, setSubs] = useState<Subscription[]>([]);
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState({
        classId: "",
        studentId: "",
        subscriptionId: "",
    });

    const reload = () =>
        Promise.all([
            apiFetch<{ data: Registration[] }>("/api/registrations"),
            apiFetch<{ data: ClassWithCount[] }>("/api/classes"),
            apiFetch<{ data: Student[] }>("/api/students"),
            apiFetch<{ data: Subscription[] }>("/api/subscriptions"),
        ]).then(([r, c, s, sb]) => {
            setRegs(r.data);
            setClasses(c.data);
            setStudents(s.data);
            setSubs(sb.data);
        });

    useEffect(() => {
        reload().catch(console.error);
    }, []);

    const classMap = useMemo(
        () => new Map(classes.map((c) => [c.id, c])),
        [classes],
    );
    const studentMap = useMemo(
        () => new Map(students.map((s) => [s.id, s])),
        [students],
    );

    // Show all subs of selected student. Each option carries a status hint and
    // is only disabled when the backend will surely reject it (so user can see
    // why a sub is greyed out instead of the dropdown silently being empty).
    const subsForStudent = subs.filter((s) => s.studentId === form.studentId);

    function subLabel(s: (typeof subs)[number]): {
        label: string;
        selectable: boolean;
    } {
        if (s.remainingSessions <= 0) {
            return {
                label: `${s.packageName} · hết buổi (${s.usedSessions}/${s.totalSessions})`,
                selectable: false,
            };
        }
        if (!s.isActive) {
            return {
                label: `${s.packageName} · ngoài hiệu lực (${s.startDate} → ${s.endDate})`,
                selectable: false,
            };
        }
        return {
            label: `${s.packageName} · còn ${s.remainingSessions}/${s.totalSessions}`,
            selectable: true,
        };
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await apiFetch(`/api/classes/${form.classId}/register`, {
                method: "POST",
                body: JSON.stringify({
                    studentId: form.studentId,
                    subscriptionId: form.subscriptionId,
                }),
            });
            setOpen(false);
            setForm({ classId: "", studentId: "", subscriptionId: "" });
            await reload();
        } catch (err) {
            setError(
                err instanceof ApiError ? err.message : "Không đăng ký được",
            );
        } finally {
            setSubmitting(false);
        }
    }

    async function cancel(id: string) {
        if (
            !confirm(
                "Hủy đăng ký này?\n(Hủy >24h trước giờ học sẽ hoàn 1 buổi.)",
            )
        )
            return;
        try {
            const res = await apiFetch<Registration>(
                `/api/registrations/${id}`,
                {
                    method: "DELETE",
                },
            );
            alert(
                res.refunded
                    ? "Đã hủy. Hoàn 1 buổi vào gói."
                    : "Đã hủy. Không hoàn buổi (<24h).",
            );
            await reload();
        } catch (err) {
            alert(err instanceof ApiError ? err.message : "Lỗi khi hủy");
        }
    }

    const columns: Column<Registration>[] = [
        {
            key: "student",
            header: "Học sinh",
            render: (r) => studentMap.get(r.studentId)?.name ?? r.studentId,
        },
        {
            key: "class",
            header: "Lớp",
            render: (r) => {
                const c = classMap.get(r.classId);
                if (!c) return r.classId;
                return (
                    <span>
                        {c.name}{" "}
                        <span className="text-text-muted">
                            · {DAY_LABEL[c.dayOfWeek]} {c.timeSlot.start}–
                            {c.timeSlot.end}
                        </span>
                    </span>
                );
            },
        },
        {
            key: "actions",
            header: "",
            className: "px-3 py-2 text-right",
            render: (r) => (
                <Button variant="danger" size="sm" onClick={() => cancel(r.id)}>
                    <Trash2 className="h-3.5 w-3.5" /> Hủy
                </Button>
            ),
        },
    ];

    return (
        <>
            <Topbar title="Đăng ký lớp" />
            <div className="thin-scrollbar flex-1 overflow-y-auto p-6">
                <PageHeader
                    title="Đăng ký lớp"
                    description={`${regs.length} đăng ký active`}
                    actions={
                        <Button onClick={() => setOpen(true)}>
                            <Plus className="h-4 w-4" /> Đăng ký mới
                        </Button>
                    }
                />
                <DataTable columns={columns} rows={regs} />
            </div>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title="Đăng ký học sinh vào lớp"
            >
                <form onSubmit={submit} className="space-y-4">
                    <Field label="Học sinh">
                        <Select
                            value={form.studentId}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    studentId: e.target.value,
                                    subscriptionId: "",
                                })
                            }
                            required
                        >
                            <option value="">-- Chọn học sinh --</option>
                            {students.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name} · Lớp {s.currentGrade}
                                </option>
                            ))}
                        </Select>
                    </Field>
                    <Field label="Gói học">
                        <Select
                            value={form.subscriptionId}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    subscriptionId: e.target.value,
                                })
                            }
                            required
                            disabled={!form.studentId}
                        >
                            <option value="">
                                {form.studentId && subsForStudent.length === 0
                                    ? "(Học sinh chưa có gói — tạo ở trang Subscriptions)"
                                    : "-- Chọn gói --"}
                            </option>
                            {subsForStudent.map((s) => {
                                const { label, selectable } = subLabel(s);
                                return (
                                    <option
                                        key={s.id}
                                        value={s.id}
                                        disabled={!selectable}
                                    >
                                        {label}
                                    </option>
                                );
                            })}
                        </Select>
                    </Field>
                    <Field label="Lớp học">
                        <Select
                            value={form.classId}
                            onChange={(e) =>
                                setForm({ ...form, classId: e.target.value })
                            }
                            required
                        >
                            <option value="">-- Chọn lớp --</option>
                            {classes.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} · {DAY_LABEL[c.dayOfWeek]}{" "}
                                    {c.timeSlot.start}–{c.timeSlot.end} ·{" "}
                                    {c.registeredCount}/{c.maxStudents}
                                </option>
                            ))}
                        </Select>
                    </Field>
                    {error && (
                        <p className="text-[12px] text-danger">{error}</p>
                    )}
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Đang lưu..." : "Đăng ký"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
