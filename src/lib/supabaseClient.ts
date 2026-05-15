import { createClient } from "@supabase/supabase-js";

// ===================== ENV VARIABLES =====================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ===================== SAFETY CHECK =====================
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase env missing. Check .env.local (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)"
  );
}

// ===================== SUPABASE CLIENT =====================
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});