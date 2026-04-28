import { MongoClient, type Db, ObjectId } from "mongodb";
import { getEnv } from "./env";
import { AppError } from "./errors";

type GlobalWithMongo = typeof globalThis & {
    __mongoClientPromise?: Promise<MongoClient>;
    __mongoIndexesEnsured?: boolean;
};

const g = globalThis as GlobalWithMongo;

function getClientPromise(): Promise<MongoClient> {
    let promise = g.__mongoClientPromise;
    if (!promise) {
        const env = getEnv();
        const client = new MongoClient(env.MONGODB_URI);
        promise = client.connect();
        g.__mongoClientPromise = promise;
    }
    return promise;
}

export async function getDb(): Promise<Db> {
    const env = getEnv();
    const client = await getClientPromise();
    const db = client.db(env.MONGODB_DB_NAME);
    if (!g.__mongoIndexesEnsured) {
        await ensureIndexes(db);
        g.__mongoIndexesEnsured = true;
    }
    return db;
}

async function ensureIndexes(db: Db): Promise<void> {
    await db.collection("parents").createIndexes([
        { key: { phone: 1 }, unique: true, name: "uniq_phone" },
        {
            key: { email: 1 },
            unique: true,
            name: "uniq_email_partial",
            partialFilterExpression: { email: { $type: "string" } },
        },
    ]);
    await db
        .collection("students")
        .createIndex({ parentId: 1 }, { name: "by_parent" });
    await db
        .collection("classes")
        .createIndex({ dayOfWeek: 1 }, { name: "by_day" });
    await db.collection("class_registrations").createIndexes([
        { key: { classId: 1, status: 1 }, name: "by_class_status" },
        { key: { studentId: 1, status: 1 }, name: "by_student_status" },
        {
            key: { classId: 1, studentId: 1 },
            unique: true,
            name: "uniq_active_registration",
            partialFilterExpression: { status: "active" },
        },
    ]);
    await db
        .collection("subscriptions")
        .createIndex({ studentId: 1 }, { name: "by_student" });
}

export function toObjectId(id: string): ObjectId {
    if (!ObjectId.isValid(id)) {
        throw new AppError("INVALID_ID", 400, `Invalid id: ${id}`);
    }
    return new ObjectId(id);
}

export { ObjectId };
