# 10 — Testing & Seed Data

## Test strategy

| Loại | Tool | Phạm vi |
|------|------|---------|
| Unit | **Vitest** | Service layer (business rules), helpers (overlap, time, env) |
| Integration | Vitest + `mongodb-memory-server` (tùy chọn) | Repository + service end-to-end |
| Smoke E2E | Playwright (tùy chọn) | UI quan trọng (tạo parent → student → register) |

Trong scope đề bài 60 phút: tối thiểu **unit test cho overlap & business rules** trong `features/registrations/service.test.ts`.

### Test commands

```bash
npm test                # vitest run
npm run test:watch      # vitest watch
```

## Seed data

Script: `scripts/seed.ts` — chạy bằng `npm run seed`.

### Nội dung tối thiểu (theo đề bài)

**Parents (2)**
1. Nguyễn Thị Lan — `0901111111` — `lan@example.com`
2. Trần Văn Bình — `0902222222` — `binh@example.com`

**Students (3)**
1. Nguyễn Minh An (con Lan), 2012-03-15, male, lớp 6
2. Nguyễn Thu Hà (con Lan), 2014-09-20, female, lớp 4
3. Trần Quốc Bảo (con Bình), 2010-05-01, male, lớp 8

**Classes (3)**
1. Toán 6 nâng cao — Math — Thứ 2 (1) — 18:00–19:30 — Mr. Khoa — max 15
2. Tiếng Anh giao tiếp — English — Thứ 4 (3) — 19:00–20:30 — Ms. Linh — max 12
3. Vật lý 8 — Physics — Thứ 7 (6) — 09:00–10:30 — Mr. Hùng — max 10

**Subscriptions (3)** — mỗi student 1 gói 12 buổi, hiệu lực 3 tháng từ hôm nay.

**Class Registrations (mẫu, optional)**: An đăng ký lớp Toán 6 (consumes 0 sessions ban đầu).

### Behavior

- Seed **idempotent**: chạy nhiều lần không lỗi (dùng `phone` / `name+dob` làm khóa upsert).
- Mặc định không xóa dữ liệu hiện có. Cờ `--reset` để drop trước khi seed.

```bash
npm run seed              # upsert
npm run seed -- --reset   # drop + insert
```

## Postman collection (tùy chọn)

File `docs/postman_collection.json` (sẽ tạo sau khi API ổn định) liệt kê toàn bộ endpoint kèm body mẫu.
