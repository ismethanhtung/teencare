# 08 — Environment Configuration

## File env

| File | Mục đích | Commit? |
|------|----------|---------|
| `.env.example` | Mẫu, list tất cả biến với giá trị giả | ✓ |
| `.env.local` | Local dev | ✗ (gitignore) |
| `.env.test` | Khi chạy test | ✗ |
| `.env.production` | (không dùng — set qua docker-compose / GitHub secrets) | ✗ |

## Biến môi trường

| Tên | Bắt buộc | Mặc định | Mô tả |
|-----|----------|----------|-------|
| `MONGODB_URI` | ✓ | — | Connection string MongoDB. Vd `mongodb://localhost:27017` hoặc `mongodb+srv://...` |
| `MONGODB_DB_NAME` | ✓ | — | Tên database. Vd `teenup_lms` |
| `APP_TIMEZONE` | ✗ | `Asia/Ho_Chi_Minh` | Dùng cho tính `today`, hủy <24h |
| `NODE_ENV` | ✗ | `development` | `development` / `production` / `test` |
| `PORT` | ✗ | `3000` | Cổng Next.js |
| `NEXT_TELEMETRY_DISABLED` | ✗ | `1` | Tắt telemetry Next.js |

> Code đọc env qua `lib/env.ts` (validate bằng zod, fail-fast nếu thiếu).

## Local development

```bash
cp .env.example .env.local
# Sửa MONGODB_URI và MONGODB_DB_NAME
npm run dev
```

## Docker compose

`docker-compose.yml` set sẵn:
```
MONGODB_URI=mongodb://mongo:27017
MONGODB_DB_NAME=teenup_lms
```
Override qua `.env` ở root nếu cần (compose tự đọc `.env`).

## GitHub Actions Secrets

Cấu hình tại **repo Settings → Secrets and variables → Actions**:

### Bắt buộc (chỉ khi muốn test với cluster ngoài)
- `MONGODB_URI_TEST`
- `MONGODB_DB_NAME_TEST`

> Mặc định CI dùng MongoDB service container nên 2 secret trên **không bắt buộc**.

### Tùy chọn (deployment / publish image)
- `GHCR_TOKEN` (hoặc dùng `GITHUB_TOKEN` mặc định)
- `MONGODB_URI` (prod)
- `MONGODB_DB_NAME` (prod)
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (nếu deploy Vercel)

## Checklist khi onboard máy mới

- [ ] Cài Node.js 20+
- [ ] Cài Docker Desktop (nếu dùng compose)
- [ ] `cp .env.example .env.local`
- [ ] Điền `MONGODB_URI` + `MONGODB_DB_NAME`
- [ ] `npm install`
- [ ] `npm run dev`
