# 07 — DevOps & CI/CD

## Docker

### `Dockerfile` (multi-stage, Next.js standalone)

Stages:
1. `deps`: cài dependencies dựa trên `package.json` + lockfile.
2. `builder`: copy source, `npm run build` → output `.next/standalone`.
3. `runner`: image runtime (`node:20-alpine`), copy standalone + `.next/static` + `public`.

Yêu cầu Next config bật:
```ts
// next.config.ts
output: "standalone"
```

### `docker-compose.yml`

Services:
- `mongo`: image `mongo:7`, volume `mongo-data`, port nội bộ `27017`.
- `app`: build từ `Dockerfile`, depends_on `mongo`, env `MONGODB_URI=mongodb://mongo:27017`, `MONGODB_DB_NAME=teenup_lms`, port `3000:3000`.
- `seed` (one-shot, `profiles: ["seed"]`): chạy `npm run seed`.

Lệnh:
```bash
docker compose up -d --build       # chạy app + mongo
docker compose --profile seed run --rm seed   # seed dữ liệu mẫu
```

## CI/CD — GitHub Actions

Workflow `.github/workflows/ci.yml`:

| Job | Trigger | Bước |
|-----|---------|------|
| `lint-test-build` | push, PR | checkout → setup-node 20 → `npm ci` → `npm run lint` → `npm run typecheck` → `npm test` → `npm run build` |
| `docker-build` | push tới `main` (sau khi job trên pass) | docker build, optionally push lên GHCR |

### Secrets cần cấu hình trên GitHub

> Cần USER tạo trong **Settings → Secrets and variables → Actions** của repo:

**Secrets bắt buộc cho CI test:**
- `MONGODB_URI_TEST` — connection string MongoDB cho job test (có thể dùng service container `mongo:7` thay vì secret).
- `MONGODB_DB_NAME_TEST` — vd `teenup_lms_test`.

**Secrets cần nếu push docker image lên GitHub Container Registry:**
- `GHCR_TOKEN` — token có quyền `write:packages` (hoặc dùng `GITHUB_TOKEN` mặc định + `permissions: packages: write`).

**Secrets cần nếu deploy (tùy chọn, ngoài scope đề bài):**
- `MONGODB_URI` — production
- `MONGODB_DB_NAME` — production
- Deploy host SSH key / Vercel token / etc.

> **Lưu ý**: trong workflow CI, ưu tiên dùng **MongoDB service container** thay cho secret URI để test isolated:
>
> ```yaml
> services:
>   mongo:
>     image: mongo:7
>     ports: ["27017:27017"]
> env:
>   MONGODB_URI: mongodb://localhost:27017
>   MONGODB_DB_NAME: teenup_lms_test
> ```

## Kiểm tra trước khi merge
- ✅ `npm run lint` không lỗi
- ✅ `npm run typecheck` pass
- ✅ `npm test` pass
- ✅ `npm run build` thành công
- ✅ Docker image build thành công

## Liên kết
- Env chi tiết: [`08-env-config.md`](./08-env-config.md)
- Seed script: [`10-testing-and-seed.md`](./10-testing-and-seed.md)
