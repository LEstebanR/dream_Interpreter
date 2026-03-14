import { LocaleSwitcher } from "./locale-switcher";

export default function Header() {
  return (
    <header className="flex justify-end w-full p-4 sticky top-0 z-10 backdrop-blur-sm">
      <LocaleSwitcher />
    </header>
  );
}
