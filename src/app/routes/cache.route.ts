import { Router, Request, Response } from "express";
import { deleteCache } from "@/app/services/cache.service.js";
import { createRedisClient } from "@/app/services/redis-client.js";

export const cacheRouter = Router();
const redis = await createRedisClient();

/**
 * DELETE /cache/{*key}
 * DELETE /cache?pattern=a.png,b.png
 */
cacheRouter.delete("/{*key}", async (req: Request, res: Response) => {
    try {
        // Express 5: wildcard params are arrays
        const keyParam = req.params.key;
        const key = Array.isArray(keyParam) ? keyParam.join("/") : keyParam;

        const patternQuery = req.query.pattern as string | undefined;
        const patterns = patternQuery
            ? patternQuery.split(",").map((p) => p.trim()).filter(Boolean)
            : [];

        let deletedKeys: string[] = [];
        let deletedCount = 0;

        if (key) {
            const success = await deleteCache(key);
            if (success) {
                deletedKeys.push(key);
                deletedCount++;
            }
        } else if (patterns.length > 0) {
            // Loop through each comma-separated pattern
            for (const pattern of patterns) {
                const keys = await redis.keys(pattern);
                if (keys.length > 0) {
                    if (keys.length === 1) {
                        await redis.del(keys[0]);
                    } else {
                        for (const key of keys) {
                            await redis.del(key);
                        }
                    }
                    deletedKeys.push(...keys);
                    deletedCount += keys.length;
                }
            }
        } else {
            return res
                .status(400)
                .json({ error: "Provide a path (/cache/{*key}) or ?pattern=" });
        }

        return res.status(200).json({
            success: true,
            deleted: deletedCount,
            keys: deletedKeys,
        });
    } catch (err: any) {
        console.error("❌ Cache purge error:", err.message);
        res.status(500).json({ error: "Failed to purge cache" });
    }
});