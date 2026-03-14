import { LocaleSwitcher } from "./locale-switcher";
import { AuthButtons } from "./auth-buttons";
import { UserInfo } from "./user-info";

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full px-4 py-3 sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
      {/* left: nombre de usuario (solo cuando hay sesión) */}
      <UserInfo />

      {/* right: sign-out (si autenticado) + locale switcher */}
      <div className="flex items-center gap-2 ml-auto">
        <AuthButtons showGuestLinks={false} />
        <LocaleSwitcher />
      </div>
    </header>
  );
}
