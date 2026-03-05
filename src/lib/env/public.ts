type PublicEnvKey =
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY";

export function getPublicEnv(key: PublicEnvKey): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing public environment variable: ${key}`);
  }

  return value;
}
