import { Button } from "./button";

export default function Header() {
  return (
    <header className="flex justify-end w-full gap-x-2 py-4">
      <Button variant="outline">Login</Button>
      <Button>Sign up</Button>
    </header>
  );
}
