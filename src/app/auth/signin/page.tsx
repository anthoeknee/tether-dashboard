'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth/AuthContext';

function SignInContent() {
  const { signIn } = useAuth();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const redirect = searchParams.get('redirect') || '/dashboard';
    signIn(redirect);
  }, [signIn, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          Redirecting to Discord...
        </h1>
        <p className="text-gray-400">
          You'll be redirected to Discord to complete the sign-in process.
        </p>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <AuthProvider>
      <SignInContent />
    </AuthProvider>
  );
} 