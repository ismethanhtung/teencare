import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { PageHeader } from "@/components/ui/PageHeader";

const DOCS = [
  { f: "00-index.md", t: "Mục lục" },
  { f: "01-overview.md", t: "Tổng quan sản phẩm" },
  { f: "02-architecture.md", t: "Kiến trúc & tech stack" },
  { f: "03-database-schema.md", t: "Database schema" },
  { f: "04-api-spec.md", t: "API specification" },
  { f: "05-business-rules.md", t: "Business rules" },
  { f: "06-frontend-design.md", t: "Frontend design" },
  { f: "07-devops.md", t: "DevOps & CI/CD" },
  { f: "08-env-config.md", t: "Environment config" },
  { f: "09-development-guide.md", t: "Development guide" },
  { f: "10-testing-and-seed.md", t: "Testing & seed" },
  { f: "11-folder-structure.md", t: "Folder structure" },
];

export default function DocsPage() {
  return (
    <>
      <Topbar title="Tài liệu" />
      <div className="thin-scrollbar flex-1 overflow-y-auto p-6">
        <PageHeader
          title="Tài liệu hệ thống"
          description="Toàn bộ docs nằm trong thư mục docs/ ở repository."
        />
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {DOCS.map((d) => (
            <li key={d.f}>
              <Link
                href={`https://github.com/`}
                className="block rounded-md border border-border-main bg-bg-secondary/40 px-4 py-3 text-[13px] hover:border-accent/40"
              >
                <span className="font-mono text-text-muted">{d.f}</span>
                <span className="mx-2 text-text-muted">·</span>
                <span className="font-medium">{d.t}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[12px] text-text-muted">
          Tip: mở các file trong thư mục <code className="text-accent">docs/</code> tại repository để xem chi tiết.
        </p>
      </div>
    </>
  );
}
