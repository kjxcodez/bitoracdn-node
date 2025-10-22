import type { Request, Response, NextFunction } from "express";

export function responseTimeMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime();

  res.on("header", () => {
    const diff = process.hrtime(start);
    const time = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);
    res.setHeader("X-Response-Time", `${time}ms`);
  });

  next();
}
