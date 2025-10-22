import type { Request, Response, NextFunction } from "express";
import { getCache } from "@/app/services/cache.service.js";

export async function cacheValidationMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const key = req.originalUrl;

    const cached = await getCache<Buffer>(key);
    if (cached && cached.value) {
      console.log(`⚡ Cache HIT → ${key}`);
      res.setHeader("X-Cache-Status", "HIT");
      return res.send(cached.value);
    }

    console.log(`🌀 Cache MISS → ${key}`);
    res.setHeader("X-Cache-Status", "MISS");
    next(); // continue to origin fetch
  } catch (err) {
    console.error("❌ Cache middleware error:", err);
    next();
  }
}
