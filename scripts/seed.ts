/**
 * Seed script for TeenUp Mini LMS.
 * Usage:
 *   npm run seed             # idempotent upsert
 *   npm run seed -- --reset  # drop collections first
 *
 * Reads MONGODB_URI / MONGODB_DB_NAME from process.env (loaded by node from --env-file).
 */
import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME;
if (!URI || !DB_NAME) {
  console.error("MONGODB_URI and MONGODB_DB_NAME must be set");
  process.exit(1);
}

const reset = process.argv.includes("--reset");

async function main() {
  const client = new MongoClient(URI!);
  await client.connect();
  const db = client.db(DB_NAME);

  if (reset) {
    console.log("Dropping collections...");
    for (const name of ["parents", "students", "classes", "class_registrations", "subscriptions"]) {
      await db.collection(name).drop().catch(() => undefined);
    }
  }

  const now = new Date();
  const today = new Date();
  const future = new Date();
  future.setMonth(future.getMonth() + 3);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  // Parents
  const parents = [
    { name: "Nguyễn Thị Lan", phone: "0901111111", email: "lan@example.com" },
    { name: "Trần Văn Bình", phone: "0902222222", email: "binh@example.com" },
  ];
  const parentIds: Record<string, ObjectId> = {};
  for (const p of parents) {
    const res = await db.collection("parents").findOneAndUpdate(
      { phone: p.phone },
      { $setOnInsert: { ...p, createdAt: now, updatedAt: now } },
      { upsert: true, returnDocument: "after" },
    );
    parentIds[p.phone] = res!._id as ObjectId;
  }

  // Students
  const students = [
    { name: "Nguyễn Minh An", dob: "2012-03-15", gender: "male", currentGrade: "6", parentPhone: "0901111111" },
    { name: "Nguyễn Thu Hà", dob: "2014-09-20", gender: "female", currentGrade: "4", parentPhone: "0901111111" },
    { name: "Trần Quốc Bảo", dob: "2010-05-01", gender: "male", currentGrade: "8", parentPhone: "0902222222" },
  ];
  const studentIds: Record<string, ObjectId> = {};
  for (const s of students) {
    const parentId = parentIds[s.parentPhone];
    const res = await db.collection("students").findOneAndUpdate(
      { name: s.name, dob: s.dob },
      {
        $setOnInsert: {
          name: s.name,
          dob: s.dob,
          gender: s.gender,
          currentGrade: s.currentGrade,
          parentId,
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true, returnDocument: "after" },
    );
    studentIds[s.name] = res!._id as ObjectId;
  }

  // Classes
  const classes = [
    {
      name: "Toán 6 nâng cao",
      subject: "Math",
      dayOfWeek: 1,
      timeSlot: { start: "18:00", end: "19:30" },
      teacherName: "Mr. Khoa",
      maxStudents: 15,
    },
    {
      name: "Tiếng Anh giao tiếp",
      subject: "English",
      dayOfWeek: 3,
      timeSlot: { start: "19:00", end: "20:30" },
      teacherName: "Ms. Linh",
      maxStudents: 12,
    },
    {
      name: "Vật lý 8",
      subject: "Physics",
      dayOfWeek: 6,
      timeSlot: { start: "09:00", end: "10:30" },
      teacherName: "Mr. Hùng",
      maxStudents: 10,
    },
  ];
  for (const c of classes) {
    await db.collection("classes").updateOne(
      { name: c.name },
      { $setOnInsert: { ...c, createdAt: now, updatedAt: now } },
      { upsert: true },
    );
  }

  // Subscriptions
  const subs = [
    { studentName: "Nguyễn Minh An", packageName: "Combo 12 buổi - Toán" },
    { studentName: "Nguyễn Thu Hà", packageName: "Combo 12 buổi - Anh văn" },
    { studentName: "Trần Quốc Bảo", packageName: "Combo 12 buổi - Lý" },
  ];
  for (const s of subs) {
    await db.collection("subscriptions").updateOne(
      { studentId: studentIds[s.studentName], packageName: s.packageName },
      {
        $setOnInsert: {
          studentId: studentIds[s.studentName],
          packageName: s.packageName,
          startDate: fmt(today),
          endDate: fmt(future),
          totalSessions: 12,
          usedSessions: 0,
          createdAt: now,
          updatedAt: now,
        },
      },
      { upsert: true },
    );
  }

  console.log("Seed complete.");
  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
