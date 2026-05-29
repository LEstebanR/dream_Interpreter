import Link from "next/link";
import { Link as LocaleLink } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { AnimatedHeart } from "./animated-heart";

export async function Footer() {
  const [t, tLegal] = await Promise.all([
    getTranslations("Footer"),
    getTranslations("Legal"),
  ]);

  return (
    <footer className="w-full border-t border-border/40 bg-background/60 backdrop-blur-md">
      <div className="flex flex-col items-center gap-1.5 px-4 py-4 text-xs text-muted-foreground">
        {/* links row */}
        <div className="flex items-center gap-2">
          <LocaleLink href="/privacy" className="hover:text-foreground transition-colors">
            {tLegal("privacyLink")}
          </LocaleLink>
          <span className="text-border/60">·</span>
          <LocaleLink href="/terms" className="hover:text-foreground transition-colors">
            {tLegal("termsLink")}
          </LocaleLink>
          <span className="text-border/60">·</span>
          <LocaleLink href="/support" className="hover:text-foreground transition-colors">
            {tLegal("supportLink")}
          </LocaleLink>
        </div>

        {/* signature row */}
        <span className="flex items-center gap-1">
          {t("madeWith")} <AnimatedHeart /> {t("by")}
          <Link
            href="https://www.lesteban.dev"
            target="_blank"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            LEstebanR
          </Link>
        </span>
      </div>
    </footer>
  );
}
