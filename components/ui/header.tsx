import { LocaleSwitcher } from "./locale-switcher";
import { AuthButtons } from "./auth-buttons";
import { getLocale } from "next-intl/server";
import Link from "next/link";

export default async function Header() {
  const locale = await getLocale();

  return (
    <header className="flex justify-between items-center w-full px-4 py-3 sticky top-0 z-10 border-b border-white/5 bg-background/80 backdrop-blur-sm">
      <Link href={`/${locale}`} className="text-sm font-medium text-white/70 hover:text-white transition-colors">
        Oniric
      </Link>

      <div className="flex items-center gap-3">
        <AuthButtons />
        <LocaleSwitcher />
      </div>
    </header>
  );
}
