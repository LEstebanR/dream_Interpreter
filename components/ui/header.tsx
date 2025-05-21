"use client";
import Link from "next/link";
import { Button } from "./button";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isSupportPage = pathname === "/support";

  return (
    <header className="flex justify-end w-full gap-x-2 p-4">
      <Link href={isSupportPage ? "/" : "/support"}>
        <Button>{isSupportPage ? "Inicio" : "Apoyar"}</Button>
      </Link>
    </header>
  );
}
