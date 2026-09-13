import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim().toLowerCase();
        const password = credentials?.password ?? "";
        if (!username || !password) return null;
        if (!["couple", "sree", "dhanush"].includes(username)) return null;

        const expected = "dhanush123";

        let user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
          if (password !== expected) return null;
          user = await prisma.user.create({
            data: {
              username,
              displayName: username === "couple" ? "Sree & Dhanush" : username === "sree" ? "Sree" : "Dhanush",
              passwordHash: await bcrypt.hash(expected, 12),
            },
          });
        }
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          name: user.displayName,
          email: `${user.username}@memory-book.local`,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.email?.split("@")[0];
        token.displayName = user.name ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.displayName = (token.displayName as string) ?? session.user.name ?? "";
      }
      return session;
    },
  },
};
