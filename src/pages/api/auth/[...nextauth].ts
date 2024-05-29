import axios from 'axios'
import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"


declare module 'next-auth' {
  interface Session {
   user: TokenUser
 }
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-42',
  providers: [
    CredentialsProvider({
      name: "CredentialsLogin",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password", placeholder: "Password" }
      },
      async authorize(credentials) {
        const loginResponse = await axios.post(`${process.  env.NEXT_PUBLIC_BASE_API_URL}/auth/login`, credentials)
        return loginResponse.data || null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user , session }) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token, user }) {
      if (session.user && token.user) {
         session.user = token.user as TokenUser
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: "/",
    signOut: "/login",
    error: "/login"
  }
}

export default NextAuth(authOptions)