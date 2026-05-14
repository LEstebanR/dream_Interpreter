import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getResend } from "@/lib/email";
import { resetPasswordEmailHtml, resetPasswordEmailSubject } from "@/lib/email-templates";

const schema = z.object({
  email: z.string().email(),
  locale: z.enum(["es", "en"]).default("es"),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { email, locale } = parsed.data;

  // Always return success to avoid user enumeration
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, name: true, password: true } });

  if (user && user.password) {
    // Only send reset email if the account has a password (not OAuth-only accounts)
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Upsert: delete any existing token for this email, then create new
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    await prisma.verificationToken.create({ data: { identifier: email, token, expires } });

    const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const resetUrl = `${origin}/${locale}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    const from =
      process.env.NODE_ENV === "production"
        ? "OniricApp <noreply@oniricapp.com>"
        : "OniricApp <onboarding@resend.dev>";

    const { error: emailError } = await getResend().emails.send({
      from,
      to: process.env.NODE_ENV === "production" ? email : "lesteban.dev@gmail.com",
      subject: resetPasswordEmailSubject(locale),
      html: resetPasswordEmailHtml(resetUrl, locale),
    });

    if (emailError) console.error("[forgot-password] Resend error:", emailError);
  }

  return NextResponse.json({ ok: true });
}
