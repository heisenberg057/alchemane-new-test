import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginWithPayloadCredentials } from "@/lib/auth/payloadCredentialsLogin";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const result = await loginWithPayloadCredentials(
          credentials.email,
          credentials.password
        );

        if (!result) {
          return null;
        }

        const { user, token, refreshToken } = result;

        const allowedAdminRoles = new Set(["ADMIN", "SUPER_ADMIN"]);
        if (!allowedAdminRoles.has(user.role)) {
          return null;
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.name || user.email,
          role: user.role,
          accessToken: token,
          refreshToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub as string) || session.user.email || "";
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
        session.user.refreshToken = token.refreshToken as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  // Removed custom cookie config to let NextAuth handle defaults
  secret: process.env.NEXTAUTH_SECRET,
};
