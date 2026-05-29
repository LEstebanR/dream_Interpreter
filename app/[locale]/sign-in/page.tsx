import { getTranslations } from "next-intl/server";
import { SignInForm } from "@/components/auth/sign-in-form";

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ reset?: string }>;
}) {
  const { locale } = await params;
  const { reset } = await searchParams;
  const t = await getTranslations("Auth");

  return (
    <main className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background/90 backdrop-blur-md px-8 py-10 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold text-foreground">
          {t("signIn")}
        </h1>
        <SignInForm locale={locale} resetSuccess={reset === "1"} />
      </div>
    </main>
  );
}
