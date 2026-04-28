"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, XCircle, RefreshCw, Loader2 } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/apiClient";

type DbHealth = {
    ok: boolean;
    latencyMs: number;
    dbName: string;
    uriHost: string;
    collections?: string[];
    stats?: {
        collectionsCount: number;
        objects: number;
        dataSizeBytes: number;
        storageSizeBytes: number;
        indexesCount: number;
    };
    error?: string;
};

export default function HealthPage() {
    const [data, setData] = useState<DbHealth | null>(null);
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState<string | null>(null);

    const check = useCallback(async () => {
        setLoading(true);
        setErrMsg(null);
        try {
            const res = await fetch("/api/health/db", { cache: "no-store" });
            const body = (await res.json()) as DbHealth;
            setData(body);
        } catch (err) {
            setErrMsg(
                err instanceof ApiError
                    ? err.message
                    : "Không gọi được endpoint",
            );
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Mount fetch: check() updates state inside try/finally; safe single-shot.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void check();
    }, [check]);

    return (
        <>
            <Topbar title="Kiểm tra hệ thống" />
            <div className="thin-scrollbar flex-1 overflow-y-auto p-6">
                <PageHeader
                    title="Database health check"
                    description="Kiểm tra kết nối đến MongoDB và thống kê dung lượng."
                    actions={
                        <Button
                            onClick={check}
                            disabled={loading}
                            variant="secondary"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="h-4 w-4" />
                            )}
                            Kiểm tra lại
                        </Button>
                    }
                />

                {errMsg && (
                    <div className="mb-4 rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-[13px] text-danger">
                        {errMsg}
                    </div>
                )}

                {data && (
                    <>
                        <div
                            className={
                                data.ok
                                    ? "mb-4 flex items-start gap-3 rounded-md border border-success/40 bg-success/10 px-4 py-3 text-[13px]"
                                    : "mb-4 flex items-start gap-3 rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-[13px]"
                            }
                        >
                            {data.ok ? (
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                            ) : (
                                <XCircle className="h-5 w-5 shrink-0 text-danger" />
                            )}
                            <div className="min-w-0">
                                <p className="font-semibold">
                                    {data.ok
                                        ? "Kết nối thành công"
                                        : "Không kết nối được"}
                                </p>
                                <p className="mt-0.5 text-text-muted">
                                    Latency:{" "}
                                    <span className="font-mono">
                                        {data.latencyMs}ms
                                    </span>{" "}
                                    · Host:{" "}
                                    <span className="font-mono">
                                        {data.uriHost}
                                    </span>{" "}
                                    · DB:{" "}
                                    <span className="font-mono">
                                        {data.dbName}
                                    </span>
                                </p>
                                {data.error && (
                                    <p className="mt-2 break-all font-mono text-[12px] text-danger">
                                        {data.error}
                                    </p>
                                )}
                            </div>
                        </div>

                        {data.ok && data.stats && (
                            <>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    <Stat
                                        label="Collections"
                                        value={data.stats.collectionsCount}
                                    />
                                    <Stat
                                        label="Documents"
                                        value={data.stats.objects}
                                    />
                                    <Stat
                                        label="Indexes"
                                        value={data.stats.indexesCount}
                                    />
                                    <Stat
                                        label="Data size"
                                        value={fmtBytes(
                                            data.stats.dataSizeBytes,
                                        )}
                                    />
                                </div>

                                <h3 className="mt-6 mb-2 text-[12px] font-bold uppercase tracking-wider text-text-muted">
                                    Collections
                                </h3>
                                {data.collections &&
                                data.collections.length > 0 ? (
                                    <ul className="flex flex-wrap gap-2">
                                        {data.collections.map((c) => (
                                            <li
                                                key={c}
                                                className="rounded border border-border-main bg-bg-secondary/40 px-2 py-1 font-mono text-[12px]"
                                            >
                                                {c}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-[12px] text-text-muted">
                                        Chưa có collection nào.
                                    </p>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

function Stat({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-md border border-border-main bg-bg-secondary/40 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {label}
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
        </div>
    );
}

function fmtBytes(n: number): string {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
    return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
