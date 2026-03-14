"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

export function UserInfo() {
  const { data: session, status } = useSession();

  if (status !== "authenticated" || !session?.user) return null;

  const name = session.user.name ?? session.user.email ?? "";
  const image = session.user.image;

  return (
    <div className="flex items-center gap-2 min-w-0">
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
      <span className="text-sm font-medium text-foreground/80 capitalize truncate">
        {name}
      </span>
    </div>
  );
}
