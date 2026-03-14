import { getTranslations } from "next-intl/server";
import { SignInForm } from "@/components/auth/sign-in-form";

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Auth");

  return (
    <main className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold text-white">
          {t("signIn")}
        </h1>
        <SignInForm locale={locale} />
      </div>
    </main>
  );
}
