import { describe, test, expect } from "bun:test";
import {
  interpretSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./schemas";

describe("interpretSchema", () => {
  test("accepts valid dream and locale", () => {
    const result = interpretSchema.safeParse({ dream: "Soñé con el mar", locale: "es" });
    expect(result.success).toBe(true);
  });

  test("defaults locale to es when omitted", () => {
    const result = interpretSchema.safeParse({ dream: "I flew" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.locale).toBe("es");
  });

  test("accepts en locale", () => {
    const result = interpretSchema.safeParse({ dream: "I flew", locale: "en" });
    expect(result.success).toBe(true);
  });

  test("rejects empty dream", () => {
    const result = interpretSchema.safeParse({ dream: "" });
    expect(result.success).toBe(false);
  });

  test("rejects dream longer than 2000 chars", () => {
    const result = interpretSchema.safeParse({ dream: "a".repeat(2001) });
    expect(result.success).toBe(false);
  });

  test("accepts dream exactly 2000 chars", () => {
    const result = interpretSchema.safeParse({ dream: "a".repeat(2000) });
    expect(result.success).toBe(true);
  });

  test("rejects unknown locale", () => {
    const result = interpretSchema.safeParse({ dream: "dream", locale: "fr" });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  test("accepts valid registration data", () => {
    const result = registerSchema.safeParse({
      name: "Test User",
      email: "user@example.com",
      password: "securepass",
    });
    expect(result.success).toBe(true);
  });

  test("rejects empty name", () => {
    const result = registerSchema.safeParse({
      name: "",
      email: "user@example.com",
      password: "securepass",
    });
    expect(result.success).toBe(false);
  });

  test("rejects invalid email", () => {
    const result = registerSchema.safeParse({
      name: "User",
      email: "not-an-email",
      password: "securepass",
    });
    expect(result.success).toBe(false);
  });

  test("rejects password shorter than 8 chars", () => {
    const result = registerSchema.safeParse({
      name: "User",
      email: "user@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  test("accepts password exactly 8 chars", () => {
    const result = registerSchema.safeParse({
      name: "User",
      email: "user@example.com",
      password: "12345678",
    });
    expect(result.success).toBe(true);
  });

  test("rejects missing fields", () => {
    const result = registerSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  test("accepts valid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "user@example.com" });
    expect(result.success).toBe(true);
  });

  test("defaults locale to es", () => {
    const result = forgotPasswordSchema.safeParse({ email: "user@example.com" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.locale).toBe("es");
  });

  test("accepts en locale", () => {
    const result = forgotPasswordSchema.safeParse({ email: "user@example.com", locale: "en" });
    expect(result.success).toBe(true);
  });

  test("rejects invalid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "bad" });
    expect(result.success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  test("accepts valid reset data", () => {
    const result = resetPasswordSchema.safeParse({
      email: "user@example.com",
      token: "abc123def456",
      password: "newpassword",
    });
    expect(result.success).toBe(true);
  });

  test("rejects empty token", () => {
    const result = resetPasswordSchema.safeParse({
      email: "user@example.com",
      token: "",
      password: "newpassword",
    });
    expect(result.success).toBe(false);
  });

  test("rejects password shorter than 8 chars", () => {
    const result = resetPasswordSchema.safeParse({
      email: "user@example.com",
      token: "tok",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  test("rejects invalid email", () => {
    const result = resetPasswordSchema.safeParse({
      email: "notvalid",
      token: "tok",
      password: "newpassword",
    });
    expect(result.success).toBe(false);
  });
});
