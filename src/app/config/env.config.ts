// src/app/config/index.ts
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// Define the schema of required environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.string().default("3000"),

  // Redis
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_USER: z.string(),
  REDIS_PASSWORD: z.string(),

  // Supabase
  SUPABASE_BUCKET: z.string(),
  SUPABASE_PUBLIC_URL: z.string().url(),

  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_ROLE_KEY: z.string(),

  // Optional defaults
  CACHE_DEFAULT_TTL: z.string().default("300"),
});

// Validate process.env against schema
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration");
  console.error(parsed.error.format());
  process.exit(1);
}

// Convert certain values to correct types
const env = parsed.data;
export const config = {
  NODE_ENV: env.NODE_ENV,
  PORT: Number(env.PORT),
  CACHE_DEFAULT_TTL: Number(env.CACHE_DEFAULT_TTL),
  REDIS: {
    host: env.REDIS_HOST,
    port: Number(env.REDIS_PORT),
    username: env.REDIS_USER,
    password: env.REDIS_PASSWORD,
  },
  SUPABASE: {
    bucket: env.SUPABASE_BUCKET,
    publicUrl: env.SUPABASE_PUBLIC_URL,
    url: env.SUPABASE_URL,
    roleKey: env.SUPABASE_ROLE_KEY,
    anonKey: env.SUPABASE_ANON_KEY
  },
} as const;
