# 05 — Business Rules

Tài liệu liệt kê toàn bộ ràng buộc nghiệp vụ và mã lỗi tương ứng. Mọi rule phải được implement ở **service layer**.

## BR-1. Đăng ký lớp (`POST /api/classes/:classId/register`)

Thứ tự kiểm tra (fail-fast):

1. **Tồn tại**:
   - Class tồn tại → `CLASS_NOT_FOUND`
   - Student tồn tại → `STUDENT_NOT_FOUND`
   - Subscription tồn tại → `SUBSCRIPTION_NOT_FOUND`
2. **Liên kết hợp lệ**:
   - `subscription.studentId === studentId` → `SUBSCRIPTION_STUDENT_MISMATCH`
3. **Subscription hợp lệ**:
   - `today` (theo timezone server, mặc định UTC+7) phải nằm trong `[startDate, endDate]` → `SUBSCRIPTION_EXPIRED`
   - `usedSessions < totalSessions` → `SUBSCRIPTION_EXHAUSTED`
4. **Không double-register**:
   - Không tồn tại registration với `status="active"` cho cặp `(classId, studentId)` → `ALREADY_REGISTERED`
5. **Sĩ số**:
   - `count(active registrations cho classId) < class.maxStudents` → `CLASS_FULL`
6. **Trùng lịch**:
   - Không tồn tại class khác mà student đã đăng ký active có cùng `dayOfWeek` và `timeSlot` overlap với class hiện tại → `SCHEDULE_CONFLICT`

> **Định nghĩa overlap**: hai khoảng `[a1,a2)` và `[b1,b2)` overlap nếu `a1 < b2 && b1 < a2` (so sánh chuỗi `"HH:mm"` đủ vì format cố định).

> **Lưu ý concurrency**: capacity và double-register có thể bị race. Trong phạm vi bài test ta dùng kiểm tra tuần tự + unique partial index `(classId, studentId, status="active")`. Optional: dùng MongoDB transaction.

## BR-2. Hủy đăng ký (`DELETE /api/registrations/:id`)

1. Registration tồn tại → `REGISTRATION_NOT_FOUND`
2. `status === "active"` → `ALREADY_CANCELLED`
3. Tính `nextSessionDateTime`:
   - `nextDate` = ngày gần nhất ≥ hôm nay có `dayOfWeek === class.dayOfWeek` (hôm nay nếu match)
   - `nextSessionDateTime = nextDate + class.timeSlot.start` (timezone server)
4. Nếu `nextSessionDateTime - now >= 24h` → hoàn 1 buổi:
   - `subscription.usedSessions -= 1` (không cho âm)
   - `registration.refunded = true`
5. Else: `registration.refunded = false`
6. Set `status="cancelled"`, `cancelledAt = now`.

## BR-3. Subscription

- BR-3.1: Khi tạo subscription, `endDate >= startDate`, `totalSessions >= 1`, `usedSessions=0`.
- BR-3.2: `PATCH .../use` chỉ thực hiện được nếu:
  - `today ∈ [startDate, endDate]` → ngược lại `SUBSCRIPTION_EXPIRED`
  - `usedSessions < totalSessions` → ngược lại `SUBSCRIPTION_EXHAUSTED`
- BR-3.3: `usedSessions` không được nhỏ hơn 0 hoặc vượt `totalSessions` ở mọi thời điểm.

## BR-4. Class

- `maxStudents >= 1`
- `timeSlot.start < timeSlot.end`
- `dayOfWeek ∈ [0..6]`

## BR-5. Parent / Student

- Parent: `phone` unique, `email` unique nếu có giá trị.
- Student: `parentId` phải tồn tại.

## Bảng mã lỗi tổng hợp

| Code | HTTP | Khi nào |
|------|------|---------|
| `VALIDATION_ERROR` | 400 | Body sai schema |
| `PARENT_NOT_FOUND` | 404 | |
| `STUDENT_NOT_FOUND` | 404 | |
| `CLASS_NOT_FOUND` | 404 | |
| `SUBSCRIPTION_NOT_FOUND` | 404 | |
| `REGISTRATION_NOT_FOUND` | 404 | |
| `PARENT_PHONE_DUPLICATE` | 409 | |
| `PARENT_EMAIL_DUPLICATE` | 409 | |
| `CLASS_FULL` | 409 | |
| `SCHEDULE_CONFLICT` | 409 | |
| `SUBSCRIPTION_EXPIRED` | 409 | |
| `SUBSCRIPTION_EXHAUSTED` | 409 | |
| `ALREADY_REGISTERED` | 409 | |
| `ALREADY_CANCELLED` | 409 | |
| `SUBSCRIPTION_STUDENT_MISMATCH` | 400 | |

## Timezone

- Server giả định `Asia/Ho_Chi_Minh` (UTC+7) cho tính `today` và `nextSessionDateTime`.
- Cấu hình bằng env `APP_TIMEZONE` (mặc định `Asia/Ho_Chi_Minh`). Xem [`08-env-config.md`](./08-env-config.md).
