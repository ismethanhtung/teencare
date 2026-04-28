---
trigger: glob
globs: src/app/**/*.tsx,src/components/**/*.tsx
description: Frontend / UI rules
---

# Frontend rules

- TailwindCSS + shadcn-style primitives + `lucide-react` + `motion/react`. Không thêm UI lib lớn khác (MUI, antd) trừ khi user yêu cầu.
- Layout chính: `<AppShell>` bọc Leftbar (264px) + Topbar + main. Leftbar adapt từ `docs/templateUI.md`, dùng `next/link` + `usePathname()` cho active state.
- Form: `react-hook-form` + `zod` (resolver `@hookform/resolvers/zod`). Tái sử dụng zod schema từ `src/features/<f>/schema.ts`.
- Mọi gọi API client-side đi qua hàm trong `src/features/<f>/api.ts` (fetcher), không gọi `fetch` rải rác trong component.
- Không inline color hex; dùng CSS vars (`--bg-main`, `--accent`, ...) qua Tailwind classes (`bg-main`, `text-accent`, ...).
- Page (`page.tsx`): nên là Server Component nếu chỉ render. Component có state/event mới `"use client"`.
- Không tạo state global lớn. Dùng React state hoặc `useSWR`/RSC fetch.
