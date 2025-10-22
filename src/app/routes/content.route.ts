import { Router, Request, Response } from "express";
import { fetchFromSupabase } from "@/app/services/supabase.service.js";
import { setCache } from "@/app/services/cache.service.js";

export const contentRouter = Router();

/**
 * CDN content fetcher route
 * Flow: check cache → fetch from origin → store → return response
 */
contentRouter.get("/{*path}", async (req: Request, res: Response) => {
    try {
        const path = req.params.path; 
        if (!path) return res.status(400).json({ error: "Missing content path" });

        // 1️⃣ Fetch file from Supabase origin
        const originRes = await fetchFromSupabase(path);

        // 2️⃣ Read response as buffer (binary)
        const buffer = Buffer.from(await originRes.arrayBuffer());

        // 3️⃣ Cache file in Redis
        await setCache(req.originalUrl, buffer, 300); // cache for 5 minutes
        res.setHeader("X-Cache-Status", "MISS");

        // 4️⃣ Set response headers
        res.setHeader("Content-Type", originRes.headers.get("Content-Type") || "application/octet-stream");
        res.setHeader("Cache-Control", "public, max-age=300");
        res.setHeader("X-CDN-Origin", "Supabase");

        // 5️⃣ Send the file to the user
        res.status(200).send(buffer);

    } catch (err: any) {
        console.error("❌ CDN Fetch Error:", err.message);
        res.status(404).json({ error: "File not found on origin" });
    }
});
