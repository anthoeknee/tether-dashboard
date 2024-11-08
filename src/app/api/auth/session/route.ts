import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = verifyAccessToken(accessToken);
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: payload });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
} 