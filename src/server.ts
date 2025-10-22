// src/server.ts
import express from "express";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(morgan("dev"));

app.listen(PORT, () => {
  console.log(`🚀 bitoracdn-node running on port ${PORT}`);
});
