import { createClient } from "@supabase/supabase-js";
import { config } from "@/app/config/env.config.js";

export const supabase = createClient(
  config.SUPABASE.url!,
  config.SUPABASE.roleKey!
);
