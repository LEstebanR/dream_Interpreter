"use client";

import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, CreditCard, LogOut, ChevronDown } from "lucide-react";

export function UserMenu() {
  const { data: session, status } = useSession();
  const t = useTranslations("Auth");
  const params = useParams();
  const locale = (params.locale as string) ?? "es";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (status !== "authenticated" || !session?.user) return null;

  const name = session.user.name ?? session.user.email ?? "";
  const image = session.user.image;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-muted transition-colors cursor-pointer min-w-0"
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            width={24}
            height={24}
            className="rounded-full shrink-0"
          />
        ) : (
          <span className="flex shrink-0 items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-[10px] font-semibold uppercase">
            {name.charAt(0)}
          </span>
        )}
        <span className="text-sm font-medium text-foreground/80 capitalize truncate max-w-[120px]">
          {name}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-48 rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-lg py-1 z-50">
          <Link
            href={`/${locale}/profile`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
          >
            <User className="w-4 h-4 shrink-0 text-muted-foreground" />
            {t("profile")}
          </Link>
          <Link
            href={`/${locale}/billing`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
          >
            <CreditCard className="w-4 h-4 shrink-0 text-muted-foreground" />
            {t("billing")}
          </Link>
          <div className="my-1 h-px bg-border" />
          <button
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: `/${locale}` });
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0 text-muted-foreground" />
            {t("signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
