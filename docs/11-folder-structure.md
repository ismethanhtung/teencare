# 11 — Folder Structure

```
.
├─ .github/
│  └─ workflows/
│     └─ ci.yml
├─ .windsurf/
│  └─ rules/
│     ├─ project.md
│     ├─ api.md
│     ├─ frontend.md
│     └─ database.md
├─ docs/
│  ├─ 00-index.md ... 11-folder-structure.md
│  ├─ description.md
│  └─ templateUI.md
├─ public/
│  └─ logo.svg
├─ scripts/
│  └─ seed.ts
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                # root layout (Leftbar + Topbar)
│  │  ├─ page.tsx                  # Dashboard
│  │  ├─ globals.css
│  │  ├─ parents/
│  │  │  └─ page.tsx
│  │  ├─ students/
│  │  │  └─ page.tsx
│  │  ├─ classes/
│  │  │  └─ page.tsx
│  │  ├─ registrations/
│  │  │  └─ page.tsx
│  │  ├─ subscriptions/
│  │  │  └─ page.tsx
│  │  └─ api/
│  │     ├─ parents/
│  │     │  ├─ route.ts            # POST
│  │     │  └─ [id]/route.ts       # GET
│  │     ├─ students/
│  │     │  ├─ route.ts
│  │     │  └─ [id]/route.ts
│  │     ├─ classes/
│  │     │  ├─ route.ts            # POST, GET (?day=)
│  │     │  └─ [id]/
│  │     │     └─ register/route.ts # POST register
│  │     ├─ registrations/
│  │     │  └─ [id]/route.ts       # DELETE
│  │     └─ subscriptions/
│  │        ├─ route.ts            # POST
│  │        └─ [id]/
│  │           ├─ route.ts         # GET
│  │           └─ use/route.ts     # PATCH
│  ├─ components/
│  │  ├─ layout/
│  │  │  ├─ Leftbar.tsx            # adapt từ templateUI.md
│  │  │  ├─ Topbar.tsx
│  │  │  └─ AppShell.tsx
│  │  ├─ ui/
│  │  │  ├─ Button.tsx
│  │  │  ├─ Modal.tsx
│  │  │  ├─ Field.tsx
│  │  │  ├─ DataTable.tsx
│  │  │  └─ ConfirmDialog.tsx
│  │  └─ schedule/
│  │     └─ WeeklyScheduleGrid.tsx
│  ├─ features/
│  │  ├─ parents/
│  │  │  ├─ schema.ts
│  │  │  ├─ repository.ts
│  │  │  └─ service.ts
│  │  ├─ students/
│  │  ├─ classes/
│  │  ├─ registrations/
│  │  │  ├─ schema.ts
│  │  │  ├─ repository.ts
│  │  │  ├─ service.ts
│  │  │  └─ service.test.ts        # unit test rule
│  │  └─ subscriptions/
│  └─ lib/
│     ├─ env.ts                    # zod-validated env
│     ├─ mongo.ts                  # client + ensureIndexes
│     ├─ http.ts                   # httpJson, httpError
│     ├─ errors.ts                 # AppError class + codes
│     ├─ time.ts                   # overlap, today, nextSession
│     └─ cn.ts
├─ .env.example
├─ .eslintrc.json (hoặc eslint.config.mjs)
├─ .gitignore
├─ Dockerfile
├─ docker-compose.yml
├─ next.config.ts
├─ package.json
├─ postcss.config.mjs
├─ tailwind.config.ts (hoặc Tailwind v4 inline)
├─ tsconfig.json
├─ vitest.config.ts
└─ README.md
```

## Nguyên tắc đặt tên
- File component: `PascalCase.tsx`
- File util/lib: `camelCase.ts`
- Folder: `kebab-case` hoặc `camelCase` (theo cluster Next.js mặc định)
- Route handler: luôn là `route.ts`, page là `page.tsx`, layout là `layout.tsx`.

## Khi thêm feature mới
1. Tạo folder `src/features/<f>/` với `schema.ts`, `repository.ts`, `service.ts`.
2. Tạo route handler trong `src/app/api/<f>/`.
3. Tạo page UI trong `src/app/<f>/page.tsx`.
4. Cập nhật Leftbar nav.
5. Update doc tương ứng.
