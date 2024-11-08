import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { Pool } from 'pg';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const guildId = requestUrl.searchParams.get('guild_id');
    
    if (!code || !guildId) {
      throw new Error('Missing required parameters');
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
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/bot-callback`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(`Discord token exchange failed: ${tokenData.error_description || tokenResponse.statusText}`);
    }

    // Get user info from Discord
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();
    
    if (!userResponse.ok) {
      throw new Error('Failed to get Discord user data');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check if guild exists
      const checkQuery = 'SELECT id FROM bot_installations WHERE guild_id = $1';
      const checkResult = await client.query(checkQuery, [guildId]);

      let result;
      if (checkResult.rows.length > 0) {
        // Update existing record
        const updateQuery = `
          UPDATE bot_installations 
          SET bot_token = $2, 
              guild_name = $3, 
              guild_icon = $4, 
              installed_at = NOW(),
              discord_user_id = $5
          WHERE guild_id = $1
          RETURNING *
        `;
        result = await client.query(updateQuery, [
          guildId,
          tokenData.access_token,
          tokenData.guild?.name,
          tokenData.guild?.icon,
          userData.id
        ]);
      } else {
        // Insert new record
        const insertQuery = `
          INSERT INTO bot_installations 
          (guild_id, bot_token, guild_name, guild_icon, installed_at, discord_user_id)
          VALUES ($1, $2, $3, $4, NOW(), $5)
          RETURNING *
        `;
        result = await client.query(insertQuery, [
          guildId,
          tokenData.access_token,
          tokenData.guild?.name,
          tokenData.guild?.icon,
          userData.id
        ]);
      }
      
      await client.query('COMMIT');
      console.log('Successfully saved bot installation:', result.rows[0]);

      return NextResponse.redirect(
        new URL('/dashboard?message=bot_installed', 
        process.env.NEXT_PUBLIC_APP_URL)
      );

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Database operation failed:', error);
      throw error;
    } finally {
      client.release();
    }

  } catch (error: any) {
    console.error('Bot installation error:', error);
    return NextResponse.redirect(
      new URL(`/auth/error?error=${encodeURIComponent(error.message)}`, 
      process.env.NEXT_PUBLIC_APP_URL)
    );
  }
} 