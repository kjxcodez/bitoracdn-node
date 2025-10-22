import express from "express";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import { config } from "./app/config/env.config.js";
import { createRedisClient } from "./app/services/redis-client.js";
import { loggerMiddleware } from "./app/middlewares/logger.middleware.js";
import { responseTimeMiddleware } from "./app/middlewares/response-time.middleware.js";

dotenv.config();

const app = express();
const PORT = config.PORT;

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(morgan("dev"));
app.use(responseTimeMiddleware);

const redis = await createRedisClient();

app.get("/health", async (_req, res) => {
  try {
    const pong = await redis.ping();
    res.json({
      status: "ok",
      redis: pong,
      uptime: process.uptime(),
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: String(err) });
  }
});
app.use(loggerMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 bitoracdn-node running on port ${PORT}`);
});
