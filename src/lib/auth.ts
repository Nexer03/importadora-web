import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { UserRole } from "@prisma/client";

import {
  getActiveUserByEmail,
  upsertGoogleUser,
  validateUserCredentials,
} from "@/services/auth.service";

export const isGoogleLoginEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

const providers: NextAuthConfig["providers"] = [
  Credentials({
    name: "Admin credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      return validateUserCredentials(credentials);
    },
  }),
];

if (isGoogleLoginEnabled) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      // Para Google, persistimos el cliente en la BD (rol CUSTOMER) para poder
      // enlazar pedidos. Sin email no podemos identificarlo.
      if (account?.provider === "google") {
        if (!user.email) {
          return false;
        }
        await upsertGoogleUser({
          email: user.email,
          name: user.name,
          image: user.image,
        });
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google" && user.email) {
          const dbUser = await getActiveUserByEmail(user.email);
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.isActive = dbUser.isActive;
          }
        } else {
          token.id = user.id;
          token.role = user.role;
          token.isActive = user.isActive;
        }
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.role =
          token.role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.CUSTOMER;
        session.user.isActive = token.isActive === true;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  // Necesario al auto-hospedar (Hostinger, no Vercel): confia en el host del
  // request. Sin esto Auth.js lanza UntrustedHost y bloquea /api/auth/*.
  trustHost: true,
} satisfies NextAuthConfig;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
