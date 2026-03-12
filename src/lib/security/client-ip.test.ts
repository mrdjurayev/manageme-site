import test from "node:test";
import assert from "node:assert/strict";

import { resolveClientIp } from "./client-ip.ts";

test("prefers trusted headers over x-forwarded-for", () => {
  const headers = new Map<string, string>([
    ["x-real-ip", "203.0.113.5"],
    ["x-forwarded-for", "198.51.100.10"],
  ]);

  const ip = resolveClientIp((name) => headers.get(name) ?? null);
  assert.equal(ip, "203.0.113.5");
});

test("parses ipv4 address with port from trusted headers", () => {
  const headers = new Map<string, string>([["x-real-ip", "203.0.113.10:443"]]);

  const ip = resolveClientIp((name) => headers.get(name) ?? null);
  assert.equal(ip, "203.0.113.10");
});

test("accepts single-hop x-forwarded-for when trusted headers are absent", () => {
  const headers = new Map<string, string>([["x-forwarded-for", "198.51.100.10"]]);

  const ip = resolveClientIp((name) => headers.get(name) ?? null);
  assert.equal(ip, "198.51.100.10");
});

test("ignores multi-hop x-forwarded-for chains", () => {
  const headers = new Map<string, string>([["x-forwarded-for", "198.51.100.10, 203.0.113.40"]]);

  const ip = resolveClientIp((name) => headers.get(name) ?? null);
  assert.equal(ip, "unknown");
});

test("returns unknown when all candidate headers are invalid", () => {
  const headers = new Map<string, string>([
    ["x-real-ip", "bad-value"],
    ["x-forwarded-for", "not-an-ip"],
  ]);

  const ip = resolveClientIp((name) => headers.get(name) ?? null);
  assert.equal(ip, "unknown");
});
