"use server";

import { timingSafeEqual } from "node:crypto";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getServerEnv } from "@/lib/env/server";
import { resolveClientIp } from "@/lib/security/client-ip";
import { blockKey, isRateLimited, isTemporarilyBlocked } from "@/lib/security/rate-limit";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { createClient } from "@/lib/supabase/server";

type LockedAuthConfig = {
  login: string;
  password: string;
  email: string;
};

const FAST_USER_SCAN_PAGES = 3;
const FULL_USER_SCAN_PAGES = 50;
const LOCKED_USER_ID_CACHE = new Map<string, string>();
const SIGN_IN_RETRY_DELAYS_MS = [0, 200, 500] as const;

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

async function sleep(ms: number): Promise<void> {
  if (ms <= 0) {
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function signInWithRetry(
  email: string,
  password: string,
  delays: readonly number[] = SIGN_IN_RETRY_DELAYS_MS,
) {
  let lastError: { message?: string } | null = null;

  for (const delayMs of delays) {
    await sleep(delayMs);

    // Recreate client on each retry to avoid stale auth state between attempts.
    const supabase = await createClient();
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!result.error) {
      return { ok: true as const };
    }

    lastError = result.error;
  }

  return { ok: false as const, error: lastError };
}

async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return resolveClientIp((headerName) => headersList.get(headerName));
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

function cacheLockedUserId(email: string, userId: string): string {
  LOCKED_USER_ID_CACHE.set(email.toLowerCase(), userId);
  return userId;
}

async function findLockedUserIdByEmail(
  email: string,
  maxPages: number = FULL_USER_SCAN_PAGES,
): Promise<string | null> {
  const normalizedEmail = email.toLowerCase();
  const cachedUserId = LOCKED_USER_ID_CACHE.get(normalizedEmail);
  if (cachedUserId) {
    return cachedUserId;
  }

  const serviceRole = createServiceRoleClient();
  const perPage = 200;
  let page = 1;

  for (let scannedPages = 0; scannedPages < maxPages; scannedPages += 1) {
    const { data, error } = await serviceRole.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw new Error("Unable to read users.");
    }

    const users = data.users ?? [];
    const existingUser = users.find((user) => user.email?.toLowerCase() === normalizedEmail);
    if (existingUser) {
      return cacheLockedUserId(normalizedEmail, existingUser.id);
    }

    const nextPage = data.nextPage;
    if (!nextPage || nextPage <= page) {
      break;
    }

    page = nextPage;
  }

  return null;
}

async function ensureLockedUserExists(config: LockedAuthConfig): Promise<string> {
  const serviceRole = createServiceRoleClient();
  const existingUserId = await findLockedUserIdByEmail(config.email, FAST_USER_SCAN_PAGES);

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
    const recoveredUserId = await findLockedUserIdByEmail(config.email, FULL_USER_SCAN_PAGES);
    if (recoveredUserId) {
      return recoveredUserId;
    }
    throw new Error("Unable to create locked user.");
  }

  return cacheLockedUserId(config.email, data.user.id);
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
  const ipAttemptKey = `signin:attempt:${ip}`;
  const ipFailureKey = `signin:failure:${ip}`;
  const ipBlockKey = `signin:blocked:${ip}`;

  if (!login || login.length > 64 || !password || password.length > 256) {
    redirect(toQueryMessage("/login", "error", loginErrorMessage));
  }

  if (await isTemporarilyBlocked(ipBlockKey)) {
    redirect(toQueryMessage("/login", "error", loginErrorMessage));
  }

  if (await isRateLimited(ipAttemptKey, 15, 10 * 60 * 1000)) {
    await blockKey(ipBlockKey, 15 * 60 * 1000);
    redirect(toQueryMessage("/login", "error", loginErrorMessage));
  }

  let lockedAuth: LockedAuthConfig;
  try {
    lockedAuth = getLockedAuthConfig();
  } catch {
    redirect(toQueryMessage("/login", "error", loginErrorMessage));
  }

  if (!secureEqual(login, lockedAuth.login) || !secureEqual(password, lockedAuth.password)) {
    if (await isRateLimited(ipFailureKey, 5, 10 * 60 * 1000)) {
      await blockKey(ipBlockKey, 15 * 60 * 1000);
      redirect(toQueryMessage("/login", "error", loginErrorMessage));
    }
    redirect(toQueryMessage("/login", "error", loginErrorMessage));
  }

  const signInResult = await signInWithRetry(lockedAuth.email, lockedAuth.password, [0, 200]);

  if (signInResult.ok) {
    redirect(redirectTo);
  }

  if (!isInvalidCredentialsErrorMessage(signInResult.error?.message)) {
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

  const retryResult = await signInWithRetry(lockedAuth.email, lockedAuth.password);

  if (!retryResult.ok) {
    redirect(toQueryMessage("/login", "error", loginErrorMessage));
  }

  redirect(redirectTo);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/login");
}
