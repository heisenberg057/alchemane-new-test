import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      role: string
      accessToken: string
      refreshToken?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    accessToken: string
    refreshToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    accessToken: string
    refreshToken?: string
  }
}
