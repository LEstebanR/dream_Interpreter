import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getResend } from "@/lib/email";
import { checkForgotPasswordLimit } from "@/lib/ratelimit";

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = await checkForgotPasswordLimit(ip);
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { email } = parsed.data;

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
    const resetUrl = `${origin}/es/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    const from =
      process.env.NODE_ENV === "production"
        ? "OniricApp <noreply@oniricapp.com>"
        : "OniricApp <onboarding@resend.dev>";

    const { error: emailError } = await getResend().emails.send({
      from,
      to: process.env.NODE_ENV === "production" ? email : "lesteban.dev@gmail.com",
      subject: "Recupera tu contraseña / Reset your password",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
          <h2 style="margin:0 0 8px">Recupera tu contraseña</h2>
          <p style="color:#666;margin:0 0 24px">Haz clic en el enlace de abajo para crear una nueva contraseña. El enlace expira en 1 hora.</p>
          <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;text-decoration:none;border-radius:24px;padding:12px 28px;font-weight:500">
            Restablecer contraseña
          </a>
          <p style="color:#999;font-size:12px;margin:24px 0 0">Si no solicitaste este correo, ignóralo.</p>
        </div>
      `,
    });

    if (emailError) console.error("[forgot-password] Resend error:", emailError);
  }

  return NextResponse.json({ ok: true });
}
