import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export default async function proxy (request: NextRequest) {

  const { pathname } = request.nextUrl;

  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: 'next-auth.session-token'
  });

  if (pathname === '/') {
    if (token && !token.error) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  if (!token || token.error) {
    return NextResponse.redirect(`${process.env.MAIN_AUTH_URL!}/auth?redirectUrl=${encodeURIComponent(request.url)}`);
  }

  return NextResponse.next()
}