import { type ObjectId, type WithId } from "mongodb";
import { getDb, toObjectId } from "@/lib/mongo";
import { todayInAppTz, isWithinDateRange } from "@/lib/time";
import type { Subscription, SubscriptionCreateInput } from "./schema";

type SubDoc = {
  studentId: ObjectId;
  packageName: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  usedSessions: number;
  createdAt: Date;
  updatedAt: Date;
};

function map(doc: WithId<SubDoc>): Subscription {
  const remaining = doc.totalSessions - doc.usedSessions;
  const today = todayInAppTz();
  const inRange = isWithinDateRange(today, doc.startDate, doc.endDate);
  return {
    id: doc._id.toHexString(),
    studentId: doc.studentId.toHexString(),
    packageName: doc.packageName,
    startDate: doc.startDate,
    endDate: doc.endDate,
    totalSessions: doc.totalSessions,
    usedSessions: doc.usedSessions,
    remainingSessions: remaining,
    isActive: inRange && remaining > 0,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function createSubscription(
  input: SubscriptionCreateInput,
): Promise<Subscription> {
  const db = await getDb();
  const now = new Date();
  const doc: SubDoc = {
    studentId: toObjectId(input.studentId),
    packageName: input.packageName,
    startDate: input.startDate,
    endDate: input.endDate,
    totalSessions: input.totalSessions,
    usedSessions: 0,
    createdAt: now,
    updatedAt: now,
  };
  const res = await db.collection<SubDoc>("subscriptions").insertOne(doc);
  return map({ _id: res.insertedId, ...doc });
}

export async function findSubscriptionById(id: string): Promise<Subscription | null> {
  const db = await getDb();
  const doc = await db
    .collection<SubDoc>("subscriptions")
    .findOne({ _id: toObjectId(id) });
  return doc ? map(doc) : null;
}

export async function listSubscriptions(): Promise<Subscription[]> {
  const db = await getDb();
  const docs = await db
    .collection<SubDoc>("subscriptions")
    .find({}, { sort: { createdAt: -1 } })
    .toArray();
  return docs.map(map);
}

export async function incrementUsedSessions(
  id: string,
  delta: number,
): Promise<Subscription | null> {
  const db = await getDb();
  const res = await db.collection<SubDoc>("subscriptions").findOneAndUpdate(
    { _id: toObjectId(id) },
    { $inc: { usedSessions: delta }, $set: { updatedAt: new Date() } },
    { returnDocument: "after" },
  );
  return res ? map(res) : null;
}
