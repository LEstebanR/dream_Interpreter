import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Sparkles } from "lucide-react";

export default async function LocaleNotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20">
        <Sparkles className="w-6 h-6 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <p className="text-lg font-medium text-foreground">{t("title")}</p>
        <p className="text-sm text-muted-foreground max-w-xs">{t("description")}</p>
      </div>
      <Link
        href="/"
        className="rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-medium text-primary-foreground shadow-md hover:opacity-90 transition-opacity"
      >
        {t("back")}
      </Link>
    </div>
  );
}
