# TeenUp Mini LMS — Documentation Index

Bộ tài liệu chính thức cho ứng dụng quản lý học sinh – phụ huynh – lớp học – gói học (subscriptions). Tài liệu được tổ chức theo từng "domain" để dễ tra cứu và bảo trì.

## Cấu trúc tài liệu

| # | File | Nội dung |
|---|------|----------|
| 00 | [`00-index.md`](./00-index.md) | Mục lục (file này) |
| 01 | [`01-overview.md`](./01-overview.md) | Mục tiêu sản phẩm, scope, personas, glossary |
| 02 | [`02-architecture.md`](./02-architecture.md) | Kiến trúc tổng thể, tech stack, layering |
| 03 | [`03-database-schema.md`](./03-database-schema.md) | Schema MongoDB (collections, indexes, relations) |
| 04 | [`04-api-spec.md`](./04-api-spec.md) | RESTful API spec chi tiết |
| 05 | [`05-business-rules.md`](./05-business-rules.md) | Toàn bộ business rules & edge cases |
| 06 | [`06-frontend-design.md`](./06-frontend-design.md) | Information architecture, layout, navigation, design system |
| 07 | [`07-devops.md`](./07-devops.md) | Dockerfile, docker-compose, CI/CD GitHub Actions |
| 08 | [`08-env-config.md`](./08-env-config.md) | Biến môi trường (local, docker, GitHub Actions secrets) |
| 09 | [`09-development-guide.md`](./09-development-guide.md) | Conventions, scripts, workflow phát triển |
| 10 | [`10-testing-and-seed.md`](./10-testing-and-seed.md) | Test strategy & seed data |
| 11 | [`11-folder-structure.md`](./11-folder-structure.md) | Cấu trúc thư mục Next.js của project |

## Tài liệu nguồn

- [`description.md`](./description.md): đề bài gốc từ TeenUp
- [`templateUI.md`](./templateUI.md): mẫu Leftbar UI

## Quy ước tài liệu

- Tất cả tài liệu viết bằng tiếng Việt (xen kẽ thuật ngữ tiếng Anh khi cần).
- Mỗi tài liệu đều có: **Mục tiêu**, **Nội dung chính**, **Liên kết liên quan**.
- Khi thay đổi business logic, **bắt buộc** cập nhật `05-business-rules.md` và `04-api-spec.md` đồng thời với code.
- Schema thay đổi → cập nhật `03-database-schema.md` + migration note.
