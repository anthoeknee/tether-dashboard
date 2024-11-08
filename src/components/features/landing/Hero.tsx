import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { MessageCircle, BrainCircuit } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const { user, signIn } = useAuth();
  const router = useRouter();

  const handleStartChatting = async () => {
    if (user) {
      router.push('/chat');
    } else {
      await signIn('/chat');
    }
  };

  const handleLearnMore = () => {
    router.push('/features');
  };

  return (
    <div className="relative h-[45vh] flex items-center">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left Column - Text Content */}
        <motion.div
          className="lg:col-span-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block px-3 py-1 bg-primary-500/10 rounded-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-primary-400 text-sm font-medium">Introducing Tether AI</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="block bg-gradient-to-r from-primary-400 via-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Your AI Companion
            </span>
            <span className="block mt-1 text-white/90">
              With Memory
            </span>
          </h1>

          <p className="text-lg text-gray-400 max-w-xl">
            Experience conversations that evolve. Tether remembers your interactions, 
            learns your preferences, and grows alongside you.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button 
              size="md"
              className="group relative overflow-hidden"
              leftIcon={<MessageCircle className="w-4 h-4 transition-transform group-hover:rotate-12" />}
              onClick={handleStartChatting}
            >
              {user ? 'Continue Chatting' : 'Start Chatting'}
            </Button>
            <Button 
              size="md"
              variant="ghost" 
              leftIcon={<BrainCircuit className="w-4 h-4" />}
              className="border border-gray-700 hover:bg-gray-800/50"
              onClick={handleLearnMore}
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
