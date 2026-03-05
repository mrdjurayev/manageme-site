"use server";

import { timingSafeEqual } from "node:crypto";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getServerEnv } from "@/lib/env/server";
import { isRateLimited } from "@/lib/security/rate-limit";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { createClient } from "@/lib/supabase/server";

type LockedAuthConfig = {
  login: string;
  password: string;
  email: string;
};

function getValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

function secureEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}

function isInvalidCredentialsErrorMessage(message: string | undefined): boolean {
  return Boolean(message && /invalid login credentials/i.test(message));
}

function getSafeRedirectPath(value: string): string {
  if (value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return "/dashboard";
}

function toQueryMessage(basePath: string, key: "error", message: string): string {
  return `${basePath}?${key}=${encodeURIComponent(message)}`;
}

async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim();

  if (ip) {
    return ip;
  }

  return headersList.get("x-real-ip") ?? "unknown";
}

function getLockedAuthConfig(): LockedAuthConfig {
  const login = getServerEnv("APP_LOGIN_USERNAME").trim().toLowerCase();
  const password = getServerEnv("APP_LOGIN_PASSWORD").trim();
  const email = getServerEnv("APP_LOGIN_EMAIL").trim().toLowerCase();

  if (!login || !isValidPassword(password) || !isValidEmail(email)) {
    throw new Error("Invalid locked login configuration.");
  }

  return { login, password, email };
}

async function findLockedUserIdByEmail(email: string): Promise<string | null> {
  const serviceRole = createServiceRoleClient();
  const perPage = 200;

  for (let page = 1; page <= 50; page += 1) {
    const { data, error } = await serviceRole.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw new Error("Unable to read users.");
    }

    const users = data.users ?? [];
    const existingUser = users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return existingUser.id;
    }

    if (users.length < perPage) {
      break;
    }
  }

  return null;
}

async function ensureLockedUserExists(config: LockedAuthConfig): Promise<string> {
  const serviceRole = createServiceRoleClient();
  const existingUserId = await findLockedUserIdByEmail(config.email);

  if (existingUserId) {
    return existingUserId;
  }

  const { data, error } = await serviceRole.auth.admin.createUser({
    email: config.email,
    password: config.password,
    email_confirm: true,
    user_metadata: {
      login: config.login,
    },
  });

  if (error || !data.user) {
    const recoveredUserId = await findLockedUserIdByEmail(config.email);
    if (recoveredUserId) {
      return recoveredUserId;
    }
    throw new Error("Unable to create locked user.");
  }

  return data.user.id;
}

async function forceLockedPassword(userId: string, config: LockedAuthConfig) {
  const serviceRole = createServiceRoleClient();
  const { error } = await serviceRole.auth.admin.updateUserById(userId, {
    password: config.password,
    email_confirm: true,
    user_metadata: {
      login: config.login,
    },
  });

  if (error) {
    throw new Error("Unable to sync locked password.");
  }
}

export async function signInAction(formData: FormData) {
  const login = getValue(formData, "login").toLowerCase();
  const password = getValue(formData, "password");
  const redirectTo = getSafeRedirectPath(getValue(formData, "redirectTo"));
  const ip = await getClientIp();
  const loginErrorMessage = "Login failed. Incorrect login or password.";

  if (!login || login.length > 64 || !password || password.length > 256) {
    redirect(toQueryMessage("/login", "error", loginErrorMessage));
  }

  let lockedAuth: LockedAuthConfig;
  try {
    lockedAuth = getLockedAuthConfig();
  } catch {
    redirect(toQueryMessage("/login", "error", loginErrorMessage));
  }

  const rateLimitKey = `signin:${ip}`;

  if (!secureEqual(login, lockedAuth.login) || !secureEqual(password, lockedAuth.password)) {
    if (await isRateLimited(rateLimitKey, 8, 10 * 60 * 1000)) {
      redirect(toQueryMessage("/login", "error", loginErrorMessage));
    }
    redirect(toQueryMessage("/login", "error", loginErrorMessage));
  }

  const supabase = await createClient();
  const signInResult = await supabase.auth.signInWithPassword({
    email: lockedAuth.email,
    password: lockedAuth.password,
  });

  if (!signInResult.error) {
    redirect(redirectTo);
  }

  if (!isInvalidCredentialsErrorMessage(signInResult.error.message)) {
    redirect(toQueryMessage("/login", "error", loginErrorMessage));
  }

  let lockedUserId = "";

  try {
    lockedUserId = await ensureLockedUserExists(lockedAuth);
  } catch {
    redirect(toQueryMessage("/login", "error", loginErrorMessage));
  }

  try {
    await forceLockedPassword(lockedUserId, lockedAuth);
  } catch {
    redirect(toQueryMessage("/login", "error", loginErrorMessage));
  }

  const retryResult = await supabase.auth.signInWithPassword({
    email: lockedAuth.email,
    password: lockedAuth.password,
  });

  if (retryResult.error) {
    redirect(toQueryMessage("/login", "error", loginErrorMessage));
  }

  redirect(redirectTo);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/login");
}
