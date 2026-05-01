import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { locale } = await params;
  const { token, email } = await searchParams;
  const t = await getTranslations("Auth");

  if (!token || !email) {
    redirect(`/${locale}/sign-in`);
  }

  return (
    <main className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background/90 backdrop-blur-md px-8 py-10 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-semibold text-foreground">
          {t("resetPasswordTitle")}
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          {t("resetPasswordSubtitle")}
        </p>
        <ResetPasswordForm locale={locale} token={token} email={email} />
      </div>
    </main>
  );
}
