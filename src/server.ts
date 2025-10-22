// src/server.ts
import express from "express";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import { config } from "@/app/config/env.config";

dotenv.config();

const app = express();
const PORT = config.PORT;

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(morgan("dev"));

app.listen(PORT, () => {
  console.log(`🚀 bitoracdn-node running on port ${PORT}`);
});
