type PublicEnvKey =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY";

const PUBLIC_ENV: Record<PublicEnvKey, string | undefined> = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

export function getPublicEnv(key: PublicEnvKey): string {
  const value = PUBLIC_ENV[key]?.trim();

  if (!value) {
    throw new Error(`Missing public environment variable: ${key}`);
  }

  return value;
}
