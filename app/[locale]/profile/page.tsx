import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, session] = await Promise.all([getTranslations("Profile"), auth()]);

  if (!session?.user?.id) redirect(`/${locale}/sign-in`);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, image: true, password: true },
  });

  if (!user) redirect(`/${locale}/sign-in`);

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-background/90 backdrop-blur-md px-8 py-8 flex flex-col gap-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{t("title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
          </div>

          <ProfileForm
            user={{
              name: user.name,
              email: user.email,
              image: user.image,
              isPremium: session.user.isPremium,
              hasPassword: !!user.password,
            }}
          />
        </div>
      </div>
    </div>
  );
}
