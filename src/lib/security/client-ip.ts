import { isIP } from "node:net";

const TRUSTED_IP_HEADERS = [
  "x-real-ip",
  "cf-connecting-ip",
  "x-vercel-forwarded-for",
  "fly-client-ip",
  "x-client-ip",
] as const;

function stripIpPort(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("[") && trimmed.includes("]")) {
    return trimmed.slice(1, trimmed.indexOf("]"));
  }

  // IPv4 with port, e.g. 203.0.113.10:443.
  if (trimmed.includes(":") && trimmed.includes(".")) {
    const lastColon = trimmed.lastIndexOf(":");
    const maybePort = trimmed.slice(lastColon + 1);
    if (/^\d+$/.test(maybePort)) {
      return trimmed.slice(0, lastColon);
    }
  }

  return trimmed;
}

function normalizeIp(value: string): string | null {
  const candidate = stripIpPort(value);
  return isIP(candidate) ? candidate : null;
}

function getIpFromHeaderValue(value: string | null): string | null {
  if (!value) {
    return null;
  }

  for (const token of value.split(",")) {
    const ip = normalizeIp(token);
    if (ip) {
      return ip;
    }
  }

  return null;
}

function getIpFromXForwardedFor(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const parts = value.split(",").map((item) => item.trim()).filter(Boolean);

  // Only trust single-hop value; multi-hop chains can include spoofed user-provided entries.
  if (parts.length !== 1) {
    return null;
  }

  return normalizeIp(parts[0]);
}

export function resolveClientIp(getHeader: (name: string) => string | null): string {
  for (const header of TRUSTED_IP_HEADERS) {
    const ip = getIpFromHeaderValue(getHeader(header));
    if (ip) {
      return ip;
    }
  }

  const fromForwardedFor = getIpFromXForwardedFor(getHeader("x-forwarded-for"));
  if (fromForwardedFor) {
    return fromForwardedFor;
  }

  return "unknown";
}
