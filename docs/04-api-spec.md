# 04 — API Specification

> Base URL: `/api`. Mọi response là JSON. Quy ước:
> - Thành công: `2xx` + body domain object hoặc `{ data: ... }`.
> - Lỗi: HTTP status phù hợp + `{ error: { code, message, details? } }`.
> - Validation lỗi: `400` + `code: "VALIDATION_ERROR"`.
> - Vi phạm rule nghiệp vụ: `409` + `code` cụ thể (xem [`05-business-rules.md`](./05-business-rules.md)).

## 1. Parents

### `POST /api/parents`
Tạo phụ huynh.

**Body**
```json
{ "name": "Nguyen Van A", "phone": "0901234567", "email": "a@example.com" }
```
**201**
```json
{ "id": "...", "name": "...", "phone": "...", "email": "...", "createdAt": "..." }
```
Lỗi: `409 PARENT_PHONE_DUPLICATE` / `PARENT_EMAIL_DUPLICATE`.

### `GET /api/parents/:id`
Trả phụ huynh + danh sách `students` (cơ bản).

**200**
```json
{
  "id": "...", "name": "...", "phone": "...", "email": "...",
  "students": [{ "id": "...", "name": "...", "currentGrade": "6" }]
}
```
`404 PARENT_NOT_FOUND`.

## 2. Students

### `POST /api/students`
**Body**
```json
{
  "name": "Nguyen Van B",
  "dob": "2012-05-10",
  "gender": "male",
  "currentGrade": "6",
  "parentId": "<ObjectId hex>"
}
```
**201**: student object.
Lỗi: `404 PARENT_NOT_FOUND`.

### `GET /api/students/:id`
**200**
```json
{
  "id": "...", "name": "...", "dob": "...", "gender": "...", "currentGrade": "...",
  "parent": { "id": "...", "name": "...", "phone": "...", "email": "..." }
}
```

## 3. Classes

### `POST /api/classes`
**Body**
```json
{
  "name": "Toán 6 nâng cao",
  "subject": "Math",
  "dayOfWeek": 2,
  "timeSlot": { "start": "18:00", "end": "19:30" },
  "teacherName": "Mr. Khoa",
  "maxStudents": 15
}
```

### `GET /api/classes?day=<0..6>`
Liệt kê lớp theo ngày trong tuần. Nếu thiếu `day`, trả tất cả (group theo `dayOfWeek`).

**200**
```json
{
  "data": [
    {
      "id": "...", "name": "...", "subject": "...",
      "dayOfWeek": 2, "timeSlot": { "start": "18:00", "end": "19:30" },
      "teacherName": "...", "maxStudents": 15,
      "registeredCount": 8
    }
  ]
}
```

## 4. Class Registrations

### `POST /api/classes/:classId/register`
**Body**
```json
{ "studentId": "...", "subscriptionId": "..." }
```
**201**: registration object.

**Validate (xem chi tiết `05-business-rules.md`):**
- `404 CLASS_NOT_FOUND` / `STUDENT_NOT_FOUND` / `SUBSCRIPTION_NOT_FOUND`
- `409 CLASS_FULL` — đã đạt `maxStudents`
- `409 SCHEDULE_CONFLICT` — học sinh trùng `dayOfWeek` + overlap `timeSlot`
- `409 SUBSCRIPTION_EXPIRED` — `today > endDate` hoặc `today < startDate`
- `409 SUBSCRIPTION_EXHAUSTED` — `usedSessions >= totalSessions`
- `409 ALREADY_REGISTERED` — đã có registration `active` cho cặp (class, student)
- `400 SUBSCRIPTION_STUDENT_MISMATCH` — `subscription.studentId !== studentId`

### `DELETE /api/registrations/:id`
Hủy đăng ký:
- Nếu thời điểm hủy cách buổi học **kế tiếp** của lớp ≥ 24h → hoàn 1 buổi (`subscriptions.usedSessions -= 1`), set `refunded=true`.
- Nếu < 24h → không hoàn, `refunded=false`.
- Set `status="cancelled"`, `cancelledAt`.

**Buổi học kế tiếp** = ngày gần nhất ≥ hôm nay có `dayOfWeek` trùng class.

**200**
```json
{ "id": "...", "status": "cancelled", "refunded": true }
```
`404 REGISTRATION_NOT_FOUND`, `409 ALREADY_CANCELLED`.

## 5. Subscriptions

### `POST /api/subscriptions`
**Body**
```json
{
  "studentId": "...",
  "packageName": "Combo 12 buổi",
  "startDate": "2026-04-01",
  "endDate": "2026-07-01",
  "totalSessions": 12
}
```
**201**: subscription object (kèm `usedSessions=0`, `remainingSessions`, `isActive`).

### `PATCH /api/subscriptions/:id/use`
Tăng `usedSessions += 1`.
- `409 SUBSCRIPTION_EXHAUSTED` nếu đã hết.
- `409 SUBSCRIPTION_EXPIRED` nếu ngoài khoảng `[startDate, endDate]`.

**200**: subscription object cập nhật.

### `GET /api/subscriptions/:id`
**200**
```json
{
  "id": "...", "studentId": "...", "packageName": "...",
  "startDate": "...", "endDate": "...",
  "totalSessions": 12, "usedSessions": 3,
  "remainingSessions": 9, "isActive": true
}
```

## Error response format
```json
{ "error": { "code": "CLASS_FULL", "message": "Class has reached max students", "details": { "classId": "..." } } }
```

## Liên kết
- Business rules đầy đủ: [`05-business-rules.md`](./05-business-rules.md)
- Schema field mapping: [`03-database-schema.md`](./03-database-schema.md)
