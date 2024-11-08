import React from 'react';

const AuthErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">Authentication Error</h1>
        <p className="mt-4 text-gray-400">
          Something went wrong during authentication. Please try signing in again.
        </p>
        <a href="/auth/signin" className="mt-6 inline-block px-4 py-2 bg-primary-500 text-white rounded">
          Try Again
        </a>
      </div>
    </div>
  );
};

export default AuthErrorPage; 