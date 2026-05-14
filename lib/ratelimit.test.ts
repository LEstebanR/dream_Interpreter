import { describe, test, expect, beforeAll } from "bun:test";

// Ensure Redis env vars are unset so the module uses the no-Redis fallback path.
// Unit tests must not hit real infrastructure.
beforeAll(() => {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
});

// Dynamic import so the module is loaded AFTER the env vars are cleared above.
const { checkAnonLimit, checkFreeLimit, checkRegisterLimit, checkForgotPasswordLimit } =
  await import("./ratelimit");

describe("ratelimit — no-Redis fallback", () => {
  test("checkAnonLimit always succeeds with full remaining count", async () => {
    const result = await checkAnonLimit("127.0.0.1");
    expect(result.success).toBe(true);
    expect(result.limit).toBe(3);
    expect(result.remaining).toBe(3);
  });

  test("checkFreeLimit always succeeds with full remaining count", async () => {
    const result = await checkFreeLimit("user-123");
    expect(result.success).toBe(true);
    expect(result.limit).toBe(5);
    expect(result.remaining).toBe(5);
  });

  test("checkRegisterLimit always succeeds", async () => {
    const result = await checkRegisterLimit("192.168.1.1");
    expect(result.success).toBe(true);
  });

  test("checkForgotPasswordLimit always succeeds", async () => {
    const result = await checkForgotPasswordLimit("10.0.0.1");
    expect(result.success).toBe(true);
  });

  test("checkAnonLimit different IPs are independent", async () => {
    const a = await checkAnonLimit("1.2.3.4");
    const b = await checkAnonLimit("5.6.7.8");
    expect(a.success).toBe(true);
    expect(b.success).toBe(true);
    expect(a.limit).toBe(b.limit);
  });
});
