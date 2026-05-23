import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_SETUP_MESSAGE =
  "Supabase is not configured. Copy .env.example to .env.local, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from your Supabase project (Settings → API), then restart the dev server.";

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return false;
  if (url.includes("YOUR_PROJECT_REF") || anonKey === "your-anon-key") {
    return false;
  }

  return true;
}

let client: SupabaseClient | undefined;

function createSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || !isSupabaseConfigured()) {
    throw new Error(SUPABASE_SETUP_MESSAGE);
  }

  return createClient(url, anonKey);
}

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    client = createSupabaseClient();
  }
  return client;
}

/** Lazy client so pages load before env is read on first auth call. */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const instance = getSupabaseClient();
    const value = instance[prop as keyof SupabaseClient];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(instance)
      : value;
  },
});