# 01 — Tổng quan sản phẩm

## Mục tiêu
Xây dựng một **mini LMS** giúp trung tâm giáo dục quản lý:
1. Hồ sơ **Phụ huynh – Học sinh**
2. **Lớp học** (lịch theo tuần) và **đăng ký lớp** cho học sinh
3. **Gói học (Subscription)**: theo dõi số buổi đã dùng / còn lại

Phạm vi giới hạn theo đề bài (TeenUp test 60 phút), không phải LMS đầy đủ.

## Out of scope
- Authentication / Authorization (không yêu cầu trong đề bài).
- Thanh toán, hóa đơn, payroll giáo viên.
- Notification, email, SMS.
- Multi-tenant.

> Có thể mở rộng sau, kiến trúc & schema được thiết kế để dễ thêm các module này.

## Personas

| Persona | Nhu cầu chính |
|---------|---------------|
| **Admin trung tâm** | Tạo phụ huynh, học sinh, lớp; đăng ký lớp; quản lý gói học |
| **Giáo viên** (read-only, không thao tác trong scope) | Xem lịch dạy theo tuần |
| **Phụ huynh** (out of scope UI) | API có thể trả thông tin con học, gói học còn lại |

## Glossary

| Thuật ngữ | Định nghĩa |
|-----------|-----------|
| **Parent** | Phụ huynh, gắn với 1..n học sinh |
| **Student** | Học sinh, thuộc 1 phụ huynh |
| **Class** | Lớp học định kỳ hằng tuần (theo `day_of_week` + `time_slot`) |
| **ClassRegistration** | Bản ghi 1 học sinh đăng ký vào 1 lớp |
| **Subscription** | Gói học gồm `total_sessions`, `used_sessions`, `start_date`, `end_date` |
| **Time slot** | Khung giờ học, format `"HH:mm-HH:mm"` (vd `"18:00-19:30"`) |
| **Day of week** | Số 0..6, 0 = Chủ Nhật, 1 = Thứ 2, ..., 6 = Thứ 7 |

## User stories chính

1. Là admin, tôi tạo phụ huynh + học sinh để lưu hồ sơ.
2. Là admin, tôi tạo lớp học có giáo viên, môn, lịch tuần, sĩ số tối đa.
3. Là admin, tôi xem danh sách lớp theo ngày trong tuần.
4. Là admin, tôi đăng ký 1 học sinh vào 1 lớp; hệ thống chặn nếu:
   - Lớp đã đầy
   - Học sinh trùng giờ với lớp khác cùng ngày
   - Học sinh không có gói học còn hiệu lực / hết buổi
5. Là admin, tôi hủy đăng ký:
   - >24h trước giờ học → hoàn 1 buổi
   - <24h → không hoàn
6. Là admin, tôi tạo gói học cho học sinh, đánh dấu đã dùng 1 buổi, xem trạng thái.

## Liên kết
- Yêu cầu chi tiết: [`04-api-spec.md`](./04-api-spec.md), [`05-business-rules.md`](./05-business-rules.md)
- Mô hình dữ liệu: [`03-database-schema.md`](./03-database-schema.md)
