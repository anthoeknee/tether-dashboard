import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken, verifyRefreshToken } from '@/lib/auth/jwt';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Protected routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    const accessToken = req.cookies.get('access_token')?.value;
    const refreshToken = req.cookies.get('refresh_token')?.value;

    if (!accessToken) {
      if (!refreshToken) {
        const redirectUrl = new URL('/auth/signin', req.url);
        redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // Try to refresh the access token
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/refresh`, {
        headers: {
          Cookie: `refresh_token=${refreshToken}`
        }
      });

      if (!response.ok) {
        const redirectUrl = new URL('/auth/signin', req.url);
        redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }

      return response;
    }

    const payload = verifyAccessToken(accessToken);
    if (!payload) {
      const redirectUrl = new URL('/auth/signin', req.url);
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/signin']
};