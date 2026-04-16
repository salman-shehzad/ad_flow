import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

const supabaseUrl = env.supabaseUrl;
const supabaseKey = env.supabaseAnonKey;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase client is missing SUPABASE_URL or SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
