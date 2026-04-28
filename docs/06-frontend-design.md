# 06 — Frontend Design

## Mục tiêu UX
Một admin console gọn nhẹ, dùng leftbar điều hướng (theo `templateUI.md`), main area hiển thị bảng / form. Phong cách hiện đại, dark/light tự nhiên, accent xanh.

## Layout chính

```
┌──────────┬───────────────────────────────────────────────┐
│          │  Topbar (breadcrumb + page title + actions)   │
│ Leftbar  ├───────────────────────────────────────────────┤
│ (264px)  │                                               │
│          │  Main content                                 │
│          │  - Tables                                     │
│          │  - Forms (modal hoặc inline)                  │
│          │  - Weekly schedule grid (Classes)             │
│          │                                               │
└──────────┴───────────────────────────────────────────────┘
```

## Information Architecture (Leftbar)

Adapt từ `templateUI.md`:

| Group | Item | Route | Icon (lucide) |
|-------|------|-------|---------------|
| **General** | Dashboard | `/` | `Home` |
| **Quản lý** | Phụ huynh | `/parents` | `Users` |
|  | Học sinh | `/students` | `GraduationCap` |
| **Lớp học** | Lớp & Lịch tuần | `/classes` | `CalendarDays` |
|  | Đăng ký lớp | `/registrations` | `ClipboardList` |
| **Gói học** | Subscriptions | `/subscriptions` | `Package` |
| **System** | Tài liệu | `/docs` (link ra README) | `BookOpen` |

## Các trang

### `/` Dashboard
- 4 KPI cards: Tổng phụ huynh / học sinh / lớp / subscription đang active.
- Bảng "Lớp hôm nay" (filter `dayOfWeek = today`).

### `/parents`
- Bảng list (name, phone, email, số học sinh).
- Nút "Thêm phụ huynh" → modal form (zod + react-hook-form).
- Click row → drawer chi tiết.

### `/students`
- Bảng list (name, dob, grade, parent).
- Form tạo: chọn parent qua combobox.

### `/classes`
- **Weekly Schedule Grid** 7 cột (CN..T7): mỗi cell hiển thị card lớp (subject, time, teacher, sĩ số).
- Toggle giữa "Grid" và "List".
- Filter `?day=`.
- Nút "Thêm lớp".

### `/registrations`
- Form: chọn class → chọn student → chọn subscription → đăng ký.
- Bảng đăng ký active, mỗi dòng có nút "Hủy" (confirm dialog hiện hoàn buổi hay không tùy thời gian).

### `/subscriptions`
- Bảng list, hiển thị progress bar `usedSessions / totalSessions`, badge active/expired.
- Action: "Use 1 session" (PATCH).
- Form tạo.

## Design tokens

Sử dụng Tailwind. CSS variables trong `globals.css`:

```css
:root {
  --bg-main: #0b0d12;
  --bg-secondary: #11141b;
  --border-main: #1f2430;
  --text-main: #e7eaf0;
  --text-muted: #8a93a6;
  --accent: #5b8cff;
}
```

Tailwind classes ánh xạ:
- `bg-main` → `bg-[var(--bg-main)]`
- `bg-secondary` → ...
- `text-main`, `text-muted`, `border-main`, `text-accent`...

(Cấu hình qua `@theme inline` trong Tailwind v4 hoặc `tailwind.config.ts` extend.)

## Components shared

- `<Leftbar />` — adapt từ `templateUI.md`, navigation thật bằng `next/link` + `usePathname()`.
- `<Topbar title actions />`
- `<DataTable />` (đơn giản, không cần TanStack ở scope này)
- `<Modal />`, `<Drawer />`, `<ConfirmDialog />`
- `<Field />` wrap react-hook-form + zod
- `<WeeklyScheduleGrid classes />`

## Animations
- `motion/react` cho mở/đóng leftbar group (đã có trong template), modal fade.

## Responsive
- ≥1024px: leftbar cố định.
- <1024px: leftbar collapse thành drawer (icon hamburger ở topbar).

## Liên kết
- Mẫu Leftbar: [`templateUI.md`](./templateUI.md)
- Routes: [`11-folder-structure.md`](./11-folder-structure.md)
