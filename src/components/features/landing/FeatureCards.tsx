import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, MessageCircle, Sparkles } from 'lucide-react';

const features = [
  {
    title: "Long-Term Memory",
    description: "Remembers context from past conversations, building deeper connections over time.",
    icon: BrainCircuit,
    color: "from-blue-500 to-purple-500"
  },
  {
    title: "Adaptive Personality",
    description: "Evolves and grows through interactions, developing a unique character.",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Natural Conversations",
    description: "Engages in human-like dialogue with context awareness and emotional intelligence.",
    icon: MessageCircle,
    color: "from-pink-500 to-red-500"
  }
];

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      className="card glass-hover group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
    >
      <div className="relative p-6 rounded-xl backdrop-blur-sm bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] transition-all duration-300 shadow-lg shadow-black/5">
        <motion.div
          className="w-12 h-12 rounded-xl bg-gradient-to-r p-[1px]"
          style={{ background: `linear-gradient(to right, ${feature.color})` }}
          whileHover={{ scale: 1.1 }}
        >
          <div className="w-full h-full rounded-xl bg-gray-900/90 flex items-center justify-center">
            <feature.icon className="w-6 h-6 text-white" />
          </div>
        </motion.div>

        <motion.h3 
          className="mt-4 text-xl font-semibold bg-gradient-to-r bg-clip-text text-transparent"
          style={{ background: `linear-gradient(to right, ${feature.color})` }}
        >
          {feature.title}
        </motion.h3>

        <p className="mt-3 text-sm text-gray-400/90 leading-relaxed">
          {feature.description}
        </p>

        <motion.div
          className="mt-4 flex items-center text-sm font-medium"
          style={{ color: feature.color.split(' ')[1].replace('to-', '') }}
          whileHover={{ x: 5 }}
        >
          Learn more
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

const FeatureCards = () => {
  return (
    <div className="relative flex items-center">
      <div className="w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl font-bold">Powered by Intelligence</h2>
          <p className="mt-2 text-lg text-gray-400">
            Discover the features that make Tether unique
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCards; 