import { Github } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AnimatedHeart } from "./animated-heart";

export async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="w-full border-t border-border/40 bg-background/60 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 px-4 py-4 text-xs text-muted-foreground">
        <Link
          href="https://github.com/LEstebanR/dream_Interpreter"
          aria-label="Github project"
          target="_blank"
          className="hover:text-foreground transition-colors"
        >
          <Github className="h-4 w-4" />
        </Link>
        <div className="h-3 w-px bg-border/60" />
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
