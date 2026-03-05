"use server";

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
  const { data, error } = await serviceRole.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });

  if (error) {
    throw new Error("Unable to read users.");
  }

  const existingUser = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());

  return existingUser?.id ?? null;
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

  if (await isRateLimited(`signin:${ip}:${login}`, 8, 10 * 60 * 1000)) {
    redirect(toQueryMessage("/login", "error", loginErrorMessage));
  }

  if (login !== lockedAuth.login || password !== lockedAuth.password) {
    redirect(toQueryMessage("/login", "error", loginErrorMessage));
  }

  let lockedUserId = "";

  try {
    lockedUserId = await ensureLockedUserExists(lockedAuth);
  } catch {
    redirect(toQueryMessage("/login", "error", loginErrorMessage));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: lockedAuth.email,
    password: lockedAuth.password,
  });

  if (!error) {
    redirect(redirectTo);
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
