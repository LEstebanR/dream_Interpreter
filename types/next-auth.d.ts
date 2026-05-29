import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isPremium: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    isPremium?: boolean;
    password?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isPremium: boolean;
  }
}
