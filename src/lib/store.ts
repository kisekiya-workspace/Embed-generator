import { Redis } from "@upstash/redis";
import type { EmbedRecord } from "./types";
import { EMBED_TTL_SECONDS } from "./constants";

const EMBED_KEY_PREFIX = "embed:";

type MemoryEntry = {
  data: EmbedRecord;
  expiresAt: number;
};

function getMemoryStore(): Map<string, MemoryEntry> {
  const globalStore = globalThis as typeof globalThis & {
    __embedMemoryStore?: Map<string, MemoryEntry>;
  };

  if (!globalStore.__embedMemoryStore) {
    globalStore.__embedMemoryStore = new Map();
  }

  return globalStore.__embedMemoryStore;
}

function hasRedisConfig(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

function getRedis(): Redis {
  return Redis.fromEnv();
}

function embedKey(id: string): string {
  return `${EMBED_KEY_PREFIX}${id}`;
}

function readFromMemory(id: string): EmbedRecord | null {
  const memoryStore = getMemoryStore();
  const entry = memoryStore.get(embedKey(id));
  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= Date.now()) {
    memoryStore.delete(embedKey(id));
    return null;
  }

  return entry.data;
}

export async function saveEmbed(
  id: string,
  record: EmbedRecord,
): Promise<void> {
  if (hasRedisConfig()) {
    const redis = getRedis();
    await redis.set(embedKey(id), record, { ex: EMBED_TTL_SECONDS });
    return;
  }

  getMemoryStore().set(embedKey(id), {
    data: record,
    expiresAt: Date.now() + EMBED_TTL_SECONDS * 1000,
  });
}

export async function getEmbed(id: string): Promise<EmbedRecord | null> {
  if (hasRedisConfig()) {
    const redis = getRedis();
    const record = await redis.get<EmbedRecord>(embedKey(id));
    return record ?? null;
  }

  return readFromMemory(id);
}

export function isStorageConfigured(): boolean {
  return hasRedisConfig() || process.env.NODE_ENV === "development";
}
