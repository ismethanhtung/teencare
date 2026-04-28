---
trigger: glob
globs: src/app/api/**/*.ts,src/features/**/*.ts
description: API & service layer rules
---

# API & Service rules

- Layering bắt buộc: **Route handler → Service → Repository**. Route handler KHÔNG truy cập MongoDB trực tiếp. Repository KHÔNG chứa business rule.
- Mỗi feature có folder riêng trong `src/features/<feature>/` với:
  - `schema.ts` — zod schema + types
  - `repository.ts` — chỉ truy cập DB
  - `service.ts` — business rules
- Lỗi domain: `throw new AppError(code, status, message?, details?)`. Helper `httpError` xử lý ở route handler.
- Trả response thành công bằng `httpJson(data, status?)`.
- Mọi mã lỗi phải có trong bảng `docs/05-business-rules.md`. Khi thêm code mới, cập nhật doc.
- ID expose qua API là chuỗi hex của ObjectId (`._id.toHexString()`), tên field là `id` (không `_id`).
- Tên field domain dùng `camelCase` (vd `parentId`, `dayOfWeek`, `timeSlot`, `usedSessions`).
