import axios from 'axios'
import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"


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
        // console.log("AUTHORIZE ###")
        const loginResponse = await axios.post(`${process.  env.NEXT_PUBLIC_BASE_API_URL}/auth/login`, credentials)
          // .then(response => console.log("RESPONSE ###### ", response))
          // .catch(error => console.log("error is ###### ", error))
        // console.log("LOGIN RESPONSE ##### ", loginResponse)
        // if (loginResponse && loginResponse.data) {
        //   return loginResponse.data
        // }

        console.log("loginResponse #############", loginResponse)

        return loginResponse.data || null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user , session }) {
      // console.log("JWT");

      // console.log("token ### ", token)
      // console.log("user ### ", user)
      // console.log("session ### ", session)
      if (user) {
        token.user = user
      }

      console.log(token)

      return token
    },
    async session({ session, token, user }) {
      // console.log("SESSION");
      if (session.user && token.user) {
        //  session.user.id = user.id
         session.user = token.user
      }
      // console.log("session ### ", session)
      // console.log("token ### ", token)
      // console.log("user ### ", user)

      return session
    },
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