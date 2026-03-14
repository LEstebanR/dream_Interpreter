import { getTranslations } from "next-intl/server";
import { Sparkles } from "lucide-react";
import { DreamSection } from "@/components/dream-section";

export default async function Home() {
  const t = await getTranslations("Home");

  return (
    <div className="relative flex flex-col items-center justify-between w-full">
      <div className="relative z-10 flex-1 flex items-center w-full">
        <div className="flex flex-col items-center gap-3 w-full px-4">

          {/* icon */}
          <div
            className="opacity-0"
            style={{ animation: "fade-up 0.6s ease-out 0.1s both" }}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* title */}
          <h1
            className="opacity-0 text-5xl md:text-6xl font-bold text-center bg-gradient-to-br from-primary via-primary/80 to-secondary bg-clip-text text-transparent leading-tight"
            style={{ animation: "fade-up 0.6s ease-out 0.2s both" }}
          >
            {t("title")}
          </h1>

          {/* client island */}
          <DreamSection subtitle={t("subtitle")} />

        </div>
      </div>
    </div>
  );
}
