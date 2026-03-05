import { NextResponse } from "next/server";

function isSet(key: string): boolean {
  return Boolean(process.env[key]);
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    app: "manageme",
    timestamp: new Date().toISOString(),
    stack: {
      nextjs: "ready",
      vercel: "ready",
      supabase: {
        url: isSet("NEXT_PUBLIC_SUPABASE_URL"),
        anonKey: isSet("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
        serviceRoleKey: isSet("SUPABASE_SERVICE_ROLE_KEY"),
      },
      openai: {
        apiKey: isSet("OPENAI_API_KEY"),
      },
      appAuth: {
        loginUsername: isSet("APP_LOGIN_USERNAME"),
        loginPassword: isSet("APP_LOGIN_PASSWORD"),
        loginEmail: isSet("APP_LOGIN_EMAIL"),
      },
      rateLimit: {
        upstashUrl: isSet("UPSTASH_REDIS_REST_URL"),
        upstashToken: isSet("UPSTASH_REDIS_REST_TOKEN"),
      },
    },
  });
}
