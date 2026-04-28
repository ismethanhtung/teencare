import type { ReactNode } from "react";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  emptyMessage = "Chưa có dữ liệu",
}: {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border-main">
      <table className="w-full text-[13px]">
        <thead className="bg-bg-secondary/60 text-left text-[11px] uppercase tracking-wider text-text-muted">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2 font-semibold">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-6 text-center text-text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-border-main hover:bg-bg-secondary/40"
              >
                {columns.map((c) => (
                  <td key={c.key} className={c.className ? c.className : "px-3 py-2 align-middle"}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
