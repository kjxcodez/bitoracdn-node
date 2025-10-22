import { createClient } from "redis";
import { config } from "@/app/config/env.config.js";

export async function createRedisClient() {
  const client = createClient({
    username: config.REDIS.username ?? "default",
    password: config.REDIS.password,
    socket: {
      host: config.REDIS.host,
      port: config.REDIS.port,
    //   tls: true, // enables TLS automatically
    },
  });

  client.on("connect", () => console.log("✅ Connected to Redis Cloud"));
  client.on("error", (err) => console.error("❌ Redis Client Error:", err));

  await client.connect();
  return client;
}
