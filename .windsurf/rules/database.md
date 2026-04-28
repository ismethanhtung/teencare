---
trigger: glob
globs: src/features/**/repository.ts,src/lib/mongo.ts,scripts/**/*.ts
description: Database (MongoDB) rules
---

# Database rules

- Driver duy nhất: `mongodb` package (chính thức). Không dùng Mongoose.
- Tên collection: số nhiều, snake_case lowercase (`parents`, `students`, `classes`, `class_registrations`, `subscriptions`).
- Mỗi document có `_id: ObjectId`, `createdAt: Date`, `updatedAt: Date`.
- Trường `dob`, `startDate`, `endDate` lưu chuỗi `YYYY-MM-DD`. Trường timestamp lưu `Date` (UTC).
- Connection client cache module-level (`globalThis._mongoClient`) để HMR-safe.
- `ensureIndexes()` được gọi lazy lần đầu khi resolve client; idempotent.
- Khi thêm collection mới: cập nhật `docs/03-database-schema.md` và thêm index trong `ensureIndexes`.
- Repository function trả về **plain domain objects** (đã map `_id → id`), không trả document raw có ObjectId ra ngoài.
