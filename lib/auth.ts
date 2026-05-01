import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { AdapterUser } from "@auth/core/adapters";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const baseAdapter = PrismaAdapter(prisma);

// Override createUser to link OAuth accounts to existing email/password users
const adapter = {
  ...baseAdapter,
  async createUser(user: AdapterUser) {
    const existing = await prisma.user.findUnique({ where: { email: user.email } });
    if (existing) return existing as AdapterUser;
    return baseAdapter.createUser!(user);
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id!;
        token.isPremium = (user as { isPremium?: boolean }).isPremium ?? false;
        // Store image URL in JWT to avoid extra DB queries, but cap to avoid 431 errors
        token.picture = (user as { image?: string | null }).image ?? null;
      }
      if (trigger === "update" && session) {
        if (typeof session.name === "string") token.name = session.name;
        if (typeof session.image === "string") token.picture = session.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        if (token.picture) session.user.image = token.picture as string;
        // Always read isPremium fresh from DB to avoid stale JWT after Stripe webhook
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { isPremium: true },
        });
        session.user.isPremium = dbUser?.isPremium ?? false;
      }
      return session;
    },
  },
});
