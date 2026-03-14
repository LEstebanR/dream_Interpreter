"use client";

import { useSession } from "next-auth/react";

export function UserInfo() {
  const { data: session, status } = useSession();

  if (status !== "authenticated" || !session?.user) return null;

  const name = session.user.name ?? session.user.email ?? "";

  return (
    <span className="text-sm font-medium text-foreground/80">
      {name}
    </span>
  );
}
