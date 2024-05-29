import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'

export function middleware(request: NextRequestWithAuth) {
  return withAuth(request, {
    pages: {
      signIn: "/login"
    }
  })
}