import "server-only";

type ServerEnvKey =
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "OPENAI_API_KEY"
  | "APP_LOGIN_USERNAME"
  | "APP_LOGIN_PASSWORD"
  | "APP_LOGIN_EMAIL";

export function getServerEnv(key: ServerEnvKey): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing server environment variable: ${key}`);
  }

  return value;
}
