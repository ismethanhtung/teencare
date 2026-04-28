import { type ObjectId, type WithId } from "mongodb";
import { getDb, toObjectId } from "@/lib/mongo";
import type { Student, StudentCreateInput } from "./schema";

type StudentDoc = {
  name: string;
  dob: string;
  gender: "male" | "female" | "other";
  currentGrade: string;
  parentId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

function map(doc: WithId<StudentDoc>): Student {
  return {
    id: doc._id.toHexString(),
    name: doc.name,
    dob: doc.dob,
    gender: doc.gender,
    currentGrade: doc.currentGrade,
    parentId: doc.parentId.toHexString(),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function createStudent(input: StudentCreateInput): Promise<Student> {
  const db = await getDb();
  const now = new Date();
  const doc: StudentDoc = {
    name: input.name,
    dob: input.dob,
    gender: input.gender,
    currentGrade: input.currentGrade,
    parentId: toObjectId(input.parentId),
    createdAt: now,
    updatedAt: now,
  };
  const res = await db.collection<StudentDoc>("students").insertOne(doc);
  return map({ _id: res.insertedId, ...doc });
}

export async function findStudentById(id: string): Promise<Student | null> {
  const db = await getDb();
  const doc = await db.collection<StudentDoc>("students").findOne({ _id: toObjectId(id) });
  return doc ? map(doc) : null;
}

export async function listStudentsByParent(parentId: string): Promise<Student[]> {
  const db = await getDb();
  const docs = await db
    .collection<StudentDoc>("students")
    .find({ parentId: toObjectId(parentId) }, { sort: { createdAt: -1 } })
    .toArray();
  return docs.map(map);
}

export async function listStudents(): Promise<Student[]> {
  const db = await getDb();
  const docs = await db
    .collection<StudentDoc>("students")
    .find({}, { sort: { createdAt: -1 } })
    .toArray();
  return docs.map(map);
}
