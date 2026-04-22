import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

let supabaseInstance = null;

export const getSupabase = () => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = env.supabaseUrl;
  const supabaseKey = env.supabaseAnonKey;

  if (!supabaseUrl || !supabaseKey) {
    throw new ApiError(
      500,
      "Supabase client is missing SUPABASE_URL or SUPABASE_ANON_KEY",
    );
  }

  supabaseInstance = createClient(supabaseUrl, supabaseKey);
  return supabaseInstance;
};
