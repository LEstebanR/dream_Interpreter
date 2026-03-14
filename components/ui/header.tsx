import { LocaleSwitcher } from "./locale-switcher";
import { getLocale } from "next-intl/server";
import Link from "next/link";

export default async function Header() {
  const locale = await getLocale();

  return (
    <header className="flex justify-between items-center w-full px-4 py-3 sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
      <Link href={`/${locale}`} className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
        Oniric
      </Link>
      <LocaleSwitcher />
    </header>
  );
}
