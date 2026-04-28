# TeenUp Mini LMS

Mini LMS quản lý **Phụ huynh – Học sinh – Lớp học – Subscription** theo đề bài TeenUp Product Builder.

- **Stack**: Next.js 15 (App Router) · TypeScript · MongoDB · TailwindCSS · zod · react-hook-form · lucide-react · motion
- **Tài liệu chi tiết**: xem thư mục [`docs/`](./docs/00-index.md)

## 1. Quickstart (Docker)

```bash
cp .env.example .env
docker compose up -d --build
# → http://localhost:3000
```

Seed dữ liệu mẫu (chạy trên host, không cần qua compose):

```bash
npm install
npm run seed
```

## 2. Quickstart (local Node)

```bash
cp .env.example .env.local   # điền MONGODB_URI, MONGODB_DB_NAME
npm install
npm run dev                  # http://localhost:3000
npm run seed                 # tạo 2 parents, 3 students, 3 classes, 3 subs
```

## 3. Scripts

| Command | Mô tả |
|--------|------|
| `npm run dev` | Next.js dev server |
| `npm run build` / `npm start` | Production build |
| `npm run lint` / `npm run typecheck` | Static checks |
| `npm test` | Vitest |
| `npm run seed [-- --reset]` | Seed dữ liệu (idempotent / drop-then-seed) |

## 4. Database schema (tóm tắt)

> Chi tiết: [`docs/03-database-schema.md`](./docs/03-database-schema.md)

- `parents` — id, name, phone (unique), email
- `students` — id, name, dob, gender, currentGrade, parentId
- `classes` — id, name, subject, dayOfWeek (0..6), timeSlot {start,end} "HH:mm", teacherName, maxStudents
- `class_registrations` — id, classId, studentId, subscriptionId, status, refunded, cancelledAt
- `subscriptions` — id, studentId, packageName, startDate, endDate, totalSessions, usedSessions

## 5. API endpoints

> Chi tiết + body & error codes: [`docs/04-api-spec.md`](./docs/04-api-spec.md), [`docs/05-business-rules.md`](./docs/05-business-rules.md)

| Method | Path |
|--------|------|
| POST | `/api/parents` |
| GET  | `/api/parents/:id` |
| POST | `/api/students` |
| GET  | `/api/students/:id` |
| POST | `/api/classes` |
| GET  | `/api/classes?day=0..6` |
| POST | `/api/classes/:classId/register` |
| DELETE | `/api/registrations/:id` |
| POST | `/api/subscriptions` |
| GET  | `/api/subscriptions/:id` |
| PATCH | `/api/subscriptions/:id/use` |

### Ví dụ curl

```bash
# Tạo parent
curl -X POST http://localhost:3000/api/parents \
  -H 'Content-Type: application/json' \
  -d '{"name":"Lan","phone":"0901111111","email":"lan@x.com"}'

# Đăng ký học sinh vào lớp
curl -X POST http://localhost:3000/api/classes/<classId>/register \
  -H 'Content-Type: application/json' \
  -d '{"studentId":"<sid>","subscriptionId":"<subId>"}'

# Hủy đăng ký
curl -X DELETE http://localhost:3000/api/registrations/<id>
```

## 6. Cấu trúc thư mục

```
src/
├─ app/         # Next.js routes (UI + /api)
├─ components/  # Leftbar, Topbar, AppShell, UI primitives
├─ features/    # parents | students | classes | registrations | subscriptions
│   └─ <f>/{schema,repository,service}.ts
└─ lib/         # env, mongo, http, errors, time, cn, apiClient
docs/           # 11 file tài liệu hệ thống
scripts/seed.ts
```

Chi tiết: [`docs/11-folder-structure.md`](./docs/11-folder-structure.md)

## 7. Business rules nổi bật

- **Sĩ số lớp**: chặn đăng ký nếu `count(active) >= maxStudents` (`CLASS_FULL`).
- **Trùng lịch**: chặn nếu học sinh có lớp khác cùng `dayOfWeek` với `timeSlot` overlap (`SCHEDULE_CONFLICT`).
- **Subscription**: chỉ đăng ký nếu trong khoảng `[startDate, endDate]` và `usedSessions < totalSessions`.
- **Hủy lớp**: ≥ 24h trước buổi kế tiếp → hoàn 1 buổi (`refunded=true`); < 24h → không hoàn.

Toàn bộ rule + error codes: [`docs/05-business-rules.md`](./docs/05-business-rules.md).

## 8. Environment variables

| Tên | Bắt buộc | Mặc định |
|-----|----------|----------|
| `MONGODB_URI` | ✓ | — |
| `MONGODB_DB_NAME` | ✓ | — |
| `APP_TIMEZONE` | ✗ | `Asia/Ho_Chi_Minh` |
| `PORT` | ✗ | `3000` |

Chi tiết & GitHub Secrets: [`docs/08-env-config.md`](./docs/08-env-config.md).

## 9. CI/CD

GitHub Actions ở `.github/workflows/ci.yml`:

- `lint-test-build`: lint → typecheck → test (Vitest, MongoDB service container) → build
- `docker-build` (chỉ trên `main`): build Docker image

Xem [`docs/07-devops.md`](./docs/07-devops.md).

## 10. License

Internal test exercise — TeenUp.
