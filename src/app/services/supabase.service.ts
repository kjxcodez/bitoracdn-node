import { config } from "@/app/config/env.config.js";

export async function fetchFromSupabase(path: string): Promise<Response> {
  const fileUrl = `${config.SUPABASE.publicUrl}/${path}`;

  const res = await fetch(fileUrl);
  if (!res.ok) {
    throw new Error(`Supabase fetch failed (${res.status}): ${fileUrl}`);
  }

  return res;
}
