import { Redis } from "ioredis";

export async function createClient() {
  const client = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
    tls: {},
  });

  client.on("connect", () => console.log("✅ Connected to Redis Cloud"));
  client.on("error", (err) => console.error("❌ Redis error:", err));

  return client;
}
