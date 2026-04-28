import { type ObjectId, type WithId, MongoServerError } from "mongodb";
import { getDb, toObjectId } from "@/lib/mongo";
import { AppError } from "@/lib/errors";
import type { Registration } from "./schema";

type RegDoc = {
  classId: ObjectId;
  studentId: ObjectId;
  subscriptionId: ObjectId;
  status: "active" | "cancelled";
  cancelledAt?: Date;
  refunded?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function map(doc: WithId<RegDoc>): Registration {
  return {
    id: doc._id.toHexString(),
    classId: doc.classId.toHexString(),
    studentId: doc.studentId.toHexString(),
    subscriptionId: doc.subscriptionId.toHexString(),
    status: doc.status,
    cancelledAt: doc.cancelledAt?.toISOString(),
    refunded: doc.refunded,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function createRegistration(input: {
  classId: string;
  studentId: string;
  subscriptionId: string;
}): Promise<Registration> {
  const db = await getDb();
  const now = new Date();
  const doc: RegDoc = {
    classId: toObjectId(input.classId),
    studentId: toObjectId(input.studentId),
    subscriptionId: toObjectId(input.subscriptionId),
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
  try {
    const res = await db.collection<RegDoc>("class_registrations").insertOne(doc);
    return map({ _id: res.insertedId, ...doc });
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      throw new AppError("ALREADY_REGISTERED", 409, "Already registered to this class");
    }
    throw err;
  }
}

export async function findRegistrationById(id: string): Promise<Registration | null> {
  const db = await getDb();
  const doc = await db
    .collection<RegDoc>("class_registrations")
    .findOne({ _id: toObjectId(id) });
  return doc ? map(doc) : null;
}

export async function listActiveByStudent(studentId: string): Promise<Registration[]> {
  const db = await getDb();
  const docs = await db
    .collection<RegDoc>("class_registrations")
    .find({ studentId: toObjectId(studentId), status: "active" })
    .toArray();
  return docs.map(map);
}

export async function listActiveByClass(classId: string): Promise<Registration[]> {
  const db = await getDb();
  const docs = await db
    .collection<RegDoc>("class_registrations")
    .find({ classId: toObjectId(classId), status: "active" })
    .toArray();
  return docs.map(map);
}

export async function listAllActive(): Promise<Registration[]> {
  const db = await getDb();
  const docs = await db
    .collection<RegDoc>("class_registrations")
    .find({ status: "active" }, { sort: { createdAt: -1 } })
    .toArray();
  return docs.map(map);
}

export async function markCancelled(
  id: string,
  refunded: boolean,
): Promise<Registration | null> {
  const db = await getDb();
  const now = new Date();
  const res = await db.collection<RegDoc>("class_registrations").findOneAndUpdate(
    { _id: toObjectId(id), status: "active" },
    { $set: { status: "cancelled", cancelledAt: now, refunded, updatedAt: now } },
    { returnDocument: "after" },
  );
  return res ? map(res) : null;
}
