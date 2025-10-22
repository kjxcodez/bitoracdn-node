import type { Request, Response, NextFunction } from "express";

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const durationMs = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);
    const cacheStatus = res.getHeader("X-Cache-Status") || "MISS";

    const log = [
      `[${new Date().toISOString()}]`,
      req.method,
      req.originalUrl,
      `→ ${res.statusCode}`,
      `(${durationMs}ms, ${cacheStatus})`,
    ].join(" ");

    console.log(log);
  });

  next();
}
