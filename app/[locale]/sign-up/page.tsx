import { getTranslations } from "next-intl/server";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Auth");

  return (
    <main className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background/90 backdrop-blur-md px-8 py-10 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold text-foreground">
          {t("signUp")}
        </h1>
        <SignUpForm locale={locale} />
      </div>
    </main>
  );
}
