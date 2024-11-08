'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import Link from 'next/link';
import { Bot } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { user, signIn } = useAuth();
  const router = useRouter();

  const handleGetStarted = async () => {
    if (user) {
      router.push('/dashboard');
    } else {
      await signIn();
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 shadow-custom-gray"
    >
      <div className="relative">
        <div className="bg-[#0a0020]/10 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-3">
                <Bot className="w-7 h-7 text-white" />
                <span className="text-lg font-medium text-white">Tether</span>
              </Link>

              <Button
                variant="solid"
                size="sm"
                onClick={handleGetStarted}
              >
                {user ? 'Dashboard' : 'Get Started'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
