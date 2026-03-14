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
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold text-white">
          {t("signUp")}
        </h1>
        <SignUpForm locale={locale} />
      </div>
    </main>
  );
}
