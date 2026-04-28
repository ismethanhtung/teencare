import { httpJson, withErrorHandler } from "@/lib/http";
import { getDb } from "@/lib/mongo";
import { getEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export const GET = withErrorHandler(async () => {
  const env = getEnv();
  const startedAt = Date.now();
  try {
    const db = await getDb();
    const ping = await db.command({ ping: 1 });
    const stats = await db.stats();
    const collections = await db.listCollections({}, { nameOnly: true }).toArray();
    return httpJson({
      ok: ping.ok === 1,
      latencyMs: Date.now() - startedAt,
      dbName: env.MONGODB_DB_NAME,
      uriHost: safeHost(env.MONGODB_URI),
      collections: collections.map((c) => c.name).sort(),
      stats: {
        collectionsCount: stats.collections,
        objects: stats.objects,
        dataSizeBytes: stats.dataSize,
        storageSizeBytes: stats.storageSize,
        indexesCount: stats.indexes,
      },
    });
  } catch (err) {
    return httpJson(
      {
        ok: false,
        latencyMs: Date.now() - startedAt,
        dbName: env.MONGODB_DB_NAME,
        uriHost: safeHost(env.MONGODB_URI),
        error: err instanceof Error ? err.message : String(err),
      },
      503,
    );
  }
});

function safeHost(uri: string): string {
  try {
    const u = new URL(uri);
    return `${u.protocol}//${u.hostname}${u.port ? ":" + u.port : ""}`;
  } catch {
    return "unknown";
  }
}
