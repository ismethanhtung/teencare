---
trigger: always_on
description: Project-wide conventions for TeenUp Mini LMS
---

# Project rules

- Đây là Next.js 15 (App Router) + TypeScript + MongoDB. Không thêm framework khác (Express, Nest, Prisma, Mongoose) trừ khi user yêu cầu rõ.
- Tất cả tài liệu nằm trong `docs/`. Nếu thay đổi business logic, schema, API → cập nhật doc tương ứng cùng PR.
- Source code dưới `src/`. Không tạo file ở root khác ngoài config chuẩn (`next.config.ts`, `package.json`, `Dockerfile`, ...).
- Tên file:
  - Component React: `PascalCase.tsx`
  - Util / lib / hook / service / repo: `camelCase.ts`
  - Route handler: `route.ts`; page: `page.tsx`; layout: `layout.tsx`
- Không dùng `any`. Dùng `unknown` + narrow / zod parse.
- Validate mọi input API bằng zod ngay đầu route handler.
- Không hardcode secrets. Đọc env qua `src/lib/env.ts` (validated).
- Comment chỉ thêm khi thật sự cần giải thích "vì sao", không thêm comment hiển nhiên.
- Conventional Commits cho commit message.
