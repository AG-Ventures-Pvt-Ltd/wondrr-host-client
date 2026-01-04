import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: 'next-auth.session-token'
  });

  if (token && token?.type != 'Host') {
    return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`))
  }
  
  if (!token || token.error) {
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
    return NextResponse.next();
  }
  
  
  return NextResponse.next();
}