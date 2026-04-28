# 03 — Database Schema (MongoDB)

> Database: MongoDB. Tên DB lấy từ `MONGODB_DB_NAME`. Tất cả id dùng `ObjectId` của MongoDB; trên API expose dưới dạng chuỗi hex (`_id.toHexString()`).

## Quy ước chung

- Tên collection: **số nhiều, snake_case lowercase**: `parents`, `students`, `classes`, `class_registrations`, `subscriptions`.
- Mỗi document có:
  - `_id: ObjectId`
  - `createdAt: Date`
  - `updatedAt: Date`
- Trường ngày tháng (date-only) lưu dạng ISO string `YYYY-MM-DD` (đơn giản, tránh nhiễu timezone).
- Trường thời gian event (createdAt, etc.) lưu `Date` (UTC).

## Collections

### 1. `parents`
| Field | Type | Required | Note |
|-------|------|----------|------|
| `_id` | ObjectId | ✓ | |
| `name` | string | ✓ | |
| `phone` | string | ✓ | unique (sparse) |
| `email` | string | ✗ | unique nếu có |
| `createdAt` | Date | ✓ | |
| `updatedAt` | Date | ✓ | |

**Indexes**
- `{ phone: 1 }` unique
- `{ email: 1 }` unique, sparse

### 2. `students`
| Field | Type | Required | Note |
|-------|------|----------|------|
| `_id` | ObjectId | ✓ | |
| `name` | string | ✓ | |
| `dob` | string (`YYYY-MM-DD`) | ✓ | |
| `gender` | `"male" \| "female" \| "other"` | ✓ | |
| `currentGrade` | string | ✓ | vd `"6"`, `"10"` |
| `parentId` | ObjectId | ✓ | ref `parents._id` |
| `createdAt` | Date | ✓ | |
| `updatedAt` | Date | ✓ | |

**Indexes**
- `{ parentId: 1 }`

### 3. `classes`
| Field | Type | Required | Note |
|-------|------|----------|------|
| `_id` | ObjectId | ✓ | |
| `name` | string | ✓ | |
| `subject` | string | ✓ | |
| `dayOfWeek` | int 0..6 | ✓ | 0=CN, 1..6=T2..T7 |
| `timeSlot` | `{ start: "HH:mm", end: "HH:mm" }` | ✓ | end > start |
| `teacherName` | string | ✓ | |
| `maxStudents` | int >0 | ✓ | |
| `createdAt` | Date | ✓ | |
| `updatedAt` | Date | ✓ | |

**Indexes**
- `{ dayOfWeek: 1 }`

### 4. `class_registrations`
| Field | Type | Required | Note |
|-------|------|----------|------|
| `_id` | ObjectId | ✓ | |
| `classId` | ObjectId | ✓ | ref `classes._id` |
| `studentId` | ObjectId | ✓ | ref `students._id` |
| `subscriptionId` | ObjectId | ✓ | ref `subscriptions._id`, gói học dùng để đăng ký |
| `status` | `"active" \| "cancelled"` | ✓ | mặc định `"active"` |
| `cancelledAt` | Date | ✗ | |
| `refunded` | boolean | ✗ | true nếu hủy >24h được hoàn 1 buổi |
| `createdAt` | Date | ✓ | |
| `updatedAt` | Date | ✓ | |

**Indexes**
- `{ classId: 1, studentId: 1, status: 1 }` — tìm đăng ký active
- `{ studentId: 1, status: 1 }` — kiểm tra trùng giờ
- Unique partial: `{ classId: 1, studentId: 1 }` chỉ với `status = "active"` để chặn double-register

### 5. `subscriptions`
| Field | Type | Required | Note |
|-------|------|----------|------|
| `_id` | ObjectId | ✓ | |
| `studentId` | ObjectId | ✓ | ref `students._id` |
| `packageName` | string | ✓ | |
| `startDate` | string (`YYYY-MM-DD`) | ✓ | |
| `endDate` | string (`YYYY-MM-DD`) | ✓ | |
| `totalSessions` | int >0 | ✓ | |
| `usedSessions` | int ≥0 | ✓ | mặc định 0 |
| `createdAt` | Date | ✓ | |
| `updatedAt` | Date | ✓ | |

**Indexes**
- `{ studentId: 1 }`

**Derived (computed) fields** (không lưu DB, tính khi trả API):
- `remainingSessions = totalSessions - usedSessions`
- `isActive = today ∈ [startDate, endDate] && remainingSessions > 0`

## Quan hệ

```
parents (1) ──< students (1) ──< subscriptions
                       │
                       └──< class_registrations >── classes
                                  │
                            (subscriptionId → subscriptions)
```

## Migration / khởi tạo

Indexes được khởi tạo idempotent ở `lib/mongo.ts` (chạy `ensureIndexes()` lần đầu khi server boot). Xem [`09-development-guide.md`](./09-development-guide.md).

## Seed data
Xem [`10-testing-and-seed.md`](./10-testing-and-seed.md).
