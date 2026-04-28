# 02 — Kiến trúc & Tech stack

## Tổng thể

Ứng dụng dùng **Next.js 15 (App Router)** full-stack: UI ở phía client (React), API ở `/app/api/**` (Route Handlers). DB là **MongoDB**. Triển khai bằng Docker + docker-compose.

```
┌──────────────────────────────────────────────────────────────┐
│                      Browser (React UI)                       │
│  Pages: /dashboard /parents /students /classes /subscriptions │
└───────────────────────────▲──────────────────────────────────┘
                            │ fetch (JSON)
┌───────────────────────────┴──────────────────────────────────┐
│                Next.js Route Handlers (/api/*)                │
│  Controllers → Services → Repositories                        │
│  - Validation (zod)                                           │
│  - Business rules (overlap, capacity, subscription)           │
└───────────────────────────▲──────────────────────────────────┘
                            │ MongoDB driver
┌───────────────────────────┴──────────────────────────────────┐
│                          MongoDB                              │
└──────────────────────────────────────────────────────────────┘
```

## Tech stack

| Layer | Lựa chọn | Ghi chú |
|-------|----------|---------|
| Framework | **Next.js 15** App Router, TypeScript | Full-stack, deploy 1 container |
| UI | React 19, **TailwindCSS**, shadcn/ui-style components, **lucide-react**, **motion/react** | Đồng bộ với `templateUI.md` |
| Form/validation | **react-hook-form** + **zod** | Dùng chung schema cho FE + BE |
| Data layer | **mongodb** driver chính thức | Đơn giản, không cần ORM nặng |
| HTTP | Next.js Route Handlers (`route.ts`) | RESTful JSON |
| Testing | Vitest (unit) + Playwright (smoke, optional) | |
| Lint/Format | ESLint + Prettier | Cấu hình mặc định Next + custom |
| Container | Docker (multi-stage), docker-compose | Bao gồm MongoDB |
| CI/CD | GitHub Actions | Lint → test → build → docker push |

## Layering trong codebase

```
src/
├─ app/                # Next.js routes (UI + API)
├─ components/         # UI components, leftbar, layout
├─ features/           # Feature modules (parents, students, classes, subscriptions)
│   └─ <feature>/
│      ├─ schema.ts        # zod schema + types
│      ├─ repository.ts    # truy cập MongoDB
│      ├─ service.ts       # business rules
│      └─ http.ts          # helpers cho route handler (tùy chọn)
├─ lib/                # mongo client, time, errors, http response helpers
└─ styles/
```

> Quy tắc: **Route Handler chỉ gọi service**, **service gọi repository**. Repository không chứa business rule.

## Nguyên tắc thiết kế

- **Single source of truth**: schema zod ở `features/*/schema.ts` được dùng cho cả validate API request lẫn type của UI.
- **No leaky abstraction**: route handler không trực tiếp gọi MongoDB collection.
- **Idempotent + safe**: mọi mutation đều validate input trước; lỗi domain trả về 4xx có code rõ ràng.
- **Stateless server**: connection MongoDB được cache ở module-level (Next.js dev HMR-safe).

## Liên kết
- Cấu trúc thư mục cụ thể: [`11-folder-structure.md`](./11-folder-structure.md)
- API: [`04-api-spec.md`](./04-api-spec.md)
- DevOps: [`07-devops.md`](./07-devops.md)
