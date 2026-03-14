import { LocaleSwitcher } from "./locale-switcher";
import { AuthButtons } from "./auth-buttons";
import { UserMenu } from "./user-menu";

export default function Header() {
  return (
    <header className="flex h-12 items-center w-full px-4 fixed top-0 left-0 right-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
      {/* left: menú de usuario (solo cuando hay sesión) */}
      <div className="flex-1 min-w-0">
        <UserMenu />
      </div>

      {/* right: sign-in/sign-up (si no autenticado) + locale switcher */}
      <div className="flex shrink-0 items-center gap-2">
        <AuthButtons showGuestLinks={false} />
        <LocaleSwitcher />
      </div>
    </header>
  );
}
