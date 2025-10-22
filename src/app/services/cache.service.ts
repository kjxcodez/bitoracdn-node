import { createRedisClient } from "./redis-client.js";
import { config } from "@/app/config/env.config.js";
import type {
    CacheEntry,
    GetCacheFn,
    SetCacheFn,
    HasCacheFn,
    DeleteCacheFn,
} from "@/types/cache.types.js";

const redis = await createRedisClient();
const DEFAULT_TTL = config.CACHE_DEFAULT_TTL;

// Get a cached value by key

export const getCache: GetCacheFn = async <T = unknown>(
    key: string
): Promise<CacheEntry<T> | null> => {
    if (!key) return null;

    try {
        const data = await redis.get(key);
        if (!data) return null;

        let value: T;
        try {
            value = JSON.parse(data) as T;
        } catch {
            value = data as unknown as T;
        }

        let ttl: number | undefined;
        try {
            const ttlValue = await redis.ttl(key);
            if (ttlValue >= 0) ttl = ttlValue;
        } catch {
            // ignore
        }

        return { key, value, ttl };
    } catch (error) {
        console.error(`[Cache] Failed to get key "${key}"`, error);
        return null;
    }
};

// Set a cached value with optional TTL

export const setCache: SetCacheFn = async <T = unknown>(
    key: string,
    value: T,
    ttl: number = DEFAULT_TTL
): Promise<boolean> => {
    if (!key) return false;

    try {
        const serialized =
            typeof value === "string" ? value : JSON.stringify(value);

        await redis.set(key, serialized, { EX: ttl });
        return true;
    } catch (error) {
        console.error(`[Cache] Failed to set key "${key}"`, error);
        return false;
    }
};

// Check if a key exists in cache

export const hasCache: HasCacheFn = async (key: string): Promise<boolean> => {
    if (!key) return false;

    try {
        const exists = await redis.exists(key);
        return exists === 1;
    } catch (error) {
        console.error(`[Cache] Failed to check key "${key}"`, error);
        return false;
    }
};

// Delete a specific cached key

export const deleteCache: DeleteCacheFn = async (
    key: string
): Promise<boolean> => {
    if (!key) return false;

    try {
        const result = await redis.del(key);
        return result > 0;
    } catch (error) {
        console.error(`[Cache] Failed to delete key "${key}"`, error);
        return false;
    }
};
