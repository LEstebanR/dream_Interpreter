"use client";

import { useSession, signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { User, CreditCard, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const { data: session, status } = useSession();
  const t = useTranslations("Auth");
  const locale = useLocale();

  if (status !== "authenticated" || !session?.user) return null;

  const name = session.user.name ?? session.user.email ?? "";
  const image = session.user.image;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-muted transition-colors cursor-pointer min-w-0">
          {image ? (
            <Image src={image} alt={name} width={24} height={24} className="rounded-full shrink-0" />
          ) : (
            <span className="flex shrink-0 items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-[10px] font-semibold uppercase">
              {name.charAt(0)}
            </span>
          )}
          <span className="text-sm font-medium text-foreground/80 capitalize truncate max-w-[120px]">
            {name}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2.5 cursor-pointer">
            <User className="w-4 h-4 text-muted-foreground" />
            {t("profile")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/billing" className="flex items-center gap-2.5 cursor-pointer">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span className="flex items-center gap-2 min-w-0">
              {t("billing")}
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none ${
                session.user.isPremium
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                  : "bg-muted text-muted-foreground border border-border"
              }`}>
                {session.user.isPremium ? "Premium" : t("freePlan")}
              </span>
            </span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: `/${locale}` })}
          className="flex items-center gap-2.5 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
