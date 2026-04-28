# 09 — Development Guide

## Yêu cầu môi trường
- Node.js **20.x**
- npm **10.x** (hoặc pnpm/yarn — repo dùng npm mặc định)
- Docker Desktop (tùy chọn cho compose)
- MongoDB 7 (chạy local hoặc qua docker compose)

## Scripts npm

| Script | Mục đích |
|--------|----------|
| `npm run dev` | Next.js dev server (HMR) |
| `npm run build` | Build production |
| `npm start` | Chạy bản build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest |
| `npm run seed` | Seed dữ liệu mẫu vào MongoDB |

## Coding conventions

### TypeScript
- `strict: true`. Không dùng `any` — thay bằng `unknown` + narrow.
- Tên type/interface: `PascalCase`. Tên biến/hàm: `camelCase`. Hằng số: `SCREAMING_SNAKE_CASE`.

### File & folder
- Mỗi feature 1 folder trong `src/features/<feature>/`.
- Component 1 file 1 component, tên file `PascalCase.tsx`.
- Không default export ngoại trừ Next.js page/layout/route handlers.

### API conventions
- Validate input bằng zod ngay đầu route handler.
- Trả lỗi qua helper `httpError(code, status, message?, details?)`.
- Trả thành công qua `httpJson(data, status?)`.

### MongoDB access
- **Chỉ** repository được import `mongo client`.
- Connection cache module-level (`globalThis._mongoClient` để tránh double-connect khi HMR).
- `ensureIndexes()` gọi 1 lần ở `lib/mongo.ts` (lazy on first use).

### Git
- Branch: `feat/<short>`, `fix/<short>`, `docs/<short>`.
- Commit: Conventional Commits (`feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`).
- PR yêu cầu pass CI (lint + typecheck + test + build).

## Workflow phát triển feature mới

1. Cập nhật/tạo doc liên quan trong `docs/`.
2. Định nghĩa zod schema + types trong `features/<f>/schema.ts`.
3. Viết repository (truy cập DB) + service (business rule).
4. Viết route handler trong `app/api/...`.
5. Viết unit test cho service (rule logic).
6. Build UI page + form/table.
7. Update seed nếu cần.
8. PR.

## Debug
- Bật log MongoDB query: set `DEBUG=mongodb:*` (không bắt buộc).
- Next.js: dùng `console.log` trong route handler (xuất ra terminal dev).
