import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import supabase from '@/lib/db/client';
import { generateTokens } from '@/lib/auth/jwt';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    
    if (!code) {
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }

    // Exchange code for Discord token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange error:', tokenData);
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }

    // Get Discord user data
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error('User data error:', userData);
      return NextResponse.redirect(new URL('/auth/error', request.url));
    }

    // Instead of using pg client transaction, use supabase
    const { data, error } = await supabase
      .from('your_table')
      .upsert([
        {
          // your data
        }
      ]);

    if (error) throw error;

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(userData);

    // Store refresh token
    await supabase
      .from('auth_tokens')
      .insert({
        user_id: userData.id,
        refresh_token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      });

    // Get cookie store and await it
    const cookieStore = await cookies();
    
    // Create cookie options objects
    const accessTokenOptions = {
      name: 'access_token',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    };

    const refreshTokenOptions = {
      name: 'refresh_token',
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    };

    // Set cookies and await both operations
    await cookieStore.set(accessTokenOptions);
    await cookieStore.set(refreshTokenOptions);

    // Use request.url for base URL or fallback to env variable
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    
    // Use baseUrl for redirect
    return NextResponse.redirect(new URL('/dashboard', baseUrl));
  } catch (error: any) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(
      new URL(`/auth/error?error=${encodeURIComponent(error.message)}`, 
      process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin)
    );
  }
}
