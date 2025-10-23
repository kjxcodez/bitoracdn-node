import express from "express";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import { config } from "./app/config/env.config.js";
import { createRedisClient } from "./app/services/redis-client.js";
import { loggerMiddleware } from "./app/middlewares/logger.middleware.js";
import { responseTimeMiddleware } from "./app/middlewares/response-time.middleware.js";
import { cacheValidationMiddleware } from "./app/middlewares/cache-validation.middleware.js";
import { contentRouter } from "./app/routes/content.route.js";
import { cacheRouter } from "./app/routes/cache.route.js";
import { uploadRouter } from "./app/routes/upload.route.js";

dotenv.config();

const app = express();
const PORT = config.PORT;

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(morgan("dev"));
app.use(responseTimeMiddleware);

await createRedisClient();

app.use("/content", cacheValidationMiddleware, contentRouter);
app.use("/cache", cacheRouter);
app.use("/upload", uploadRouter);

app.use(loggerMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 bitoracdn-node running on port ${PORT}`);
});

