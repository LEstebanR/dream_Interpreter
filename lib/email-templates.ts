const copy = {
  es: {
    subject: "Recupera tu contraseña — OniricApp",
    preheader: "Solicitud para restablecer tu contraseña en OniricApp.",
    heading: "Recupera tu contraseña",
    body: "Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón de abajo para crear una nueva contraseña.",
    cta: "Restablecer contraseña",
    expiry: "Este enlace expira en 1 hora.",
    ignore: "Si no solicitaste este correo, ignóralo. Tu contraseña no cambiará.",
  },
  en: {
    subject: "Reset your password — OniricApp",
    preheader: "Request to reset your OniricApp password.",
    heading: "Reset your password",
    body: "We received a request to reset the password for your account. Click the button below to create a new password.",
    cta: "Reset password",
    expiry: "This link expires in 1 hour.",
    ignore: "If you didn't request this, you can safely ignore this email. Your password won't change.",
  },
};

export function resetPasswordEmailHtml(resetUrl: string, locale: string): string {
  const t = locale === "en" ? copy.en : copy.es;

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t.subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#09090b;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <!-- preheader (hidden) -->
  <span style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${t.preheader}</span>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#09090b;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px;">

          <!-- header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <span style="font-size:22px;font-weight:700;background:linear-gradient(135deg,#7c3aed,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;color:#a855f7;letter-spacing:-0.5px;">
                OniricApp
              </span>
            </td>
          </tr>

          <!-- card -->
          <tr>
            <td style="background-color:#18181b;border-radius:16px;padding:40px 36px;border:1px solid #27272a;">

              <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;color:#fafafa;letter-spacing:-0.3px;">
                ${t.heading}
              </h1>

              <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:#a1a1aa;">
                ${t.body}
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:32px;">
                <tr>
                  <td align="center" style="border-radius:50px;background:linear-gradient(135deg,#7c3aed,#a855f7);">
                    <a href="${resetUrl}"
                       target="_blank"
                       style="display:inline-block;padding:13px 32px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:50px;letter-spacing:0.1px;">
                      ${t.cta}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- expiry -->
              <p style="margin:0 0 24px;font-size:13px;color:#71717a;">
                ${t.expiry}
              </p>

              <!-- divider -->
              <hr style="border:none;border-top:1px solid #27272a;margin:0 0 24px;" />

              <!-- ignore note -->
              <p style="margin:0;font-size:12px;color:#52525b;line-height:1.5;">
                ${t.ignore}
              </p>

            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#3f3f46;">OniricApp &copy; ${new Date().getFullYear()}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function resetPasswordEmailSubject(locale: string): string {
  return locale === "en" ? copy.en.subject : copy.es.subject;
}
