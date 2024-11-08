'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { UserSession, AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have a valid session on mount
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (redirectTo: string = '/dashboard') => {
    try {
      const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        response_type: 'code',
        scope: 'identify email guilds',
        state: JSON.stringify({ redirectTo })
      });

      const url = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
      window.location.href = url;
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Signout failed');
      }
      
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  };

  const handleAddBot = async (guildId?: string) => {
    try {
      const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
        permissions: '8',
        scope: 'bot applications.commands',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/bot-callback`,
        response_type: 'code'
      });

      if (guildId) {
        params.append('guild_id', guildId);
      }

      const url = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
      window.location.href = url;
    } catch (error) {
      console.error('Error generating bot invite URL:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, handleAddBot }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};