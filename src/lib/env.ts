export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Add it to your .env.local file.`
    );
  }

  return value;
}

export function getSupabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL')
  );
}

export function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  );
}

export function getSupabaseServiceKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
}
