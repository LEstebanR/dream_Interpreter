import { LocaleSwitcher } from "./locale-switcher";
import { AuthButtons } from "./auth-buttons";
import { UserMenu } from "./user-menu";
import { Link } from "@/i18n/navigation";
import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-12 items-center w-full px-4 fixed top-0 left-0 right-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
      {/* left: menú de usuario (solo cuando hay sesión) */}
      <div className="flex-1 min-w-0">
        <UserMenu />
      </div>

      {/* center: logo / home link */}
      <Link
        href="/"
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 hover:opacity-70 transition-opacity"
      >
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          OniricApp
        </span>
      </Link>

      {/* right: sign-in/sign-up (si no autenticado) + locale switcher */}
      <div className="flex flex-1 justify-end shrink-0 items-center gap-2">
        <AuthButtons showGuestLinks={false} />
        <LocaleSwitcher />
      </div>
    </header>
  );
}
