import { type WithId } from "mongodb";
import { getDb, toObjectId } from "@/lib/mongo";
import type { ClassEntity, ClassCreateInput, TimeSlot, ClassWithCount } from "./schema";

type ClassDoc = {
  name: string;
  subject: string;
  dayOfWeek: number;
  timeSlot: TimeSlot;
  teacherName: string;
  maxStudents: number;
  createdAt: Date;
  updatedAt: Date;
};

function map(doc: WithId<ClassDoc>): ClassEntity {
  return {
    id: doc._id.toHexString(),
    name: doc.name,
    subject: doc.subject,
    dayOfWeek: doc.dayOfWeek,
    timeSlot: doc.timeSlot,
    teacherName: doc.teacherName,
    maxStudents: doc.maxStudents,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function createClass(input: ClassCreateInput): Promise<ClassEntity> {
  const db = await getDb();
  const now = new Date();
  const doc: ClassDoc = { ...input, createdAt: now, updatedAt: now };
  const res = await db.collection<ClassDoc>("classes").insertOne(doc);
  return map({ _id: res.insertedId, ...doc });
}

export async function findClassById(id: string): Promise<ClassEntity | null> {
  const db = await getDb();
  const doc = await db.collection<ClassDoc>("classes").findOne({ _id: toObjectId(id) });
  return doc ? map(doc) : null;
}

export async function listClasses(filter: { day?: number } = {}): Promise<ClassWithCount[]> {
  const db = await getDb();
  const query: Record<string, unknown> = {};
  if (typeof filter.day === "number") query.dayOfWeek = filter.day;
  const docs = await db
    .collection<ClassDoc>("classes")
    .find(query, { sort: { dayOfWeek: 1, "timeSlot.start": 1 } })
    .toArray();
  if (docs.length === 0) return [];

  const ids = docs.map((d) => d._id);
  const counts = await db
    .collection("class_registrations")
    .aggregate<{ _id: typeof ids[number]; count: number }>([
      { $match: { classId: { $in: ids }, status: "active" } },
      { $group: { _id: "$classId", count: { $sum: 1 } } },
    ])
    .toArray();
  const countMap = new Map(counts.map((c) => [c._id.toHexString(), c.count]));
  return docs.map((d) => ({ ...map(d), registeredCount: countMap.get(d._id.toHexString()) ?? 0 }));
}

export async function countActiveRegistrations(classId: string): Promise<number> {
  const db = await getDb();
  return db
    .collection("class_registrations")
    .countDocuments({ classId: toObjectId(classId), status: "active" });
}
