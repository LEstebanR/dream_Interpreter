import { LocaleSwitcher } from "./locale-switcher";
import { AuthButtons } from "./auth-buttons";
import { UserInfo } from "./user-info";

export default function Header() {
  return (
    <header className="flex h-12 items-center w-full px-4 sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
      {/* left: nombre de usuario (solo cuando hay sesión) */}
      <div className="flex-1 min-w-0">
        <UserInfo />
      </div>

      {/* right: sign-out (si autenticado) + locale switcher */}
      <div className="flex shrink-0 items-center gap-2">
        <AuthButtons showGuestLinks={false} />
        <LocaleSwitcher />
      </div>
    </header>
  );
}
