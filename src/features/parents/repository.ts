import { type Document, type WithId, MongoServerError } from "mongodb";
import { getDb, toObjectId } from "@/lib/mongo";
import { AppError } from "@/lib/errors";
import type { Parent, ParentCreateInput } from "./schema";

type ParentDoc = {
    name: string;
    phone: string;
    email?: string;
    createdAt: Date;
    updatedAt: Date;
};

function mapParent(doc: WithId<ParentDoc>): Parent {
    return {
        id: doc._id.toHexString(),
        name: doc.name,
        phone: doc.phone,
        email: doc.email,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
    };
}

export async function createParent(input: ParentCreateInput): Promise<Parent> {
    const db = await getDb();
    const now = new Date();
    const doc: ParentDoc = {
        name: input.name,
        phone: input.phone,
        email: input.email,
        createdAt: now,
        updatedAt: now,
    };
    try {
        const res = await db.collection<ParentDoc>("parents").insertOne(doc);
        return mapParent({ _id: res.insertedId, ...doc });
    } catch (err) {
        if (err instanceof MongoServerError && err.code === 11000) {
            const key = err.keyPattern ?? {};
            if ("phone" in key) {
                throw new AppError(
                    "PARENT_PHONE_DUPLICATE",
                    409,
                    "Phone already exists",
                );
            }
            if ("email" in key) {
                throw new AppError(
                    "PARENT_EMAIL_DUPLICATE",
                    409,
                    "Email already exists",
                );
            }
        }
        throw err;
    }
}

export async function findParentById(id: string): Promise<Parent | null> {
    const db = await getDb();
    const doc = await db
        .collection<ParentDoc>("parents")
        .findOne({ _id: toObjectId(id) });
    return doc ? mapParent(doc) : null;
}

export async function updateParent(
    id: string,
    patch: { name?: string; phone?: string; email?: string | null },
): Promise<Parent | null> {
    const db = await getDb();
    const set: Record<string, unknown> = { updatedAt: new Date() };
    const unset: Record<string, ""> = {};
    if (patch.name !== undefined) set.name = patch.name;
    if (patch.phone !== undefined) set.phone = patch.phone;
    if (patch.email === null || patch.email === "") {
        unset.email = "";
    } else if (patch.email !== undefined) {
        set.email = patch.email;
    }
    const update: Record<string, unknown> = { $set: set };
    if (Object.keys(unset).length > 0) update.$unset = unset;
    try {
        const res = await db
            .collection<ParentDoc>("parents")
            .findOneAndUpdate({ _id: toObjectId(id) }, update, {
                returnDocument: "after",
            });
        return res ? mapParent(res) : null;
    } catch (err) {
        if (err instanceof MongoServerError && err.code === 11000) {
            const key = err.keyPattern ?? {};
            if ("phone" in key) {
                throw new AppError(
                    "PARENT_PHONE_DUPLICATE",
                    409,
                    "Phone already exists",
                );
            }
            if ("email" in key) {
                throw new AppError(
                    "PARENT_EMAIL_DUPLICATE",
                    409,
                    "Email already exists",
                );
            }
        }
        throw err;
    }
}

export async function listParents(): Promise<Parent[]> {
    const db = await getDb();
    const docs = await db
        .collection<ParentDoc>("parents")
        .find({}, { sort: { createdAt: -1 } })
        .toArray();
    return docs.map(mapParent);
}

export type { Document };
