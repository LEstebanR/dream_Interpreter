import { z } from "zod";

export const interpretSchema = z.object({
  dream: z.string().min(1).max(2000),
  locale: z.enum(["es", "en"]).default("es"),
});

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
  locale: z.enum(["es", "en"]).default("es"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
  password: z.string().min(8),
});
