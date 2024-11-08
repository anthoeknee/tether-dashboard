import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui';
import Background from '@/components/layout/Background';
import Hero from './Hero';
import FeatureCards from './FeatureCards';
import Header from './Header';

const CreatorLanding = () => {
  const containerAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5, staggerChildren: 0.2 }
  };

  return (
    <>
      <Background />
      <Header />
      
      {/* Shared background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[100px]"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeatType: "mirror"
          }}
        />
        <motion.div
          className="absolute right-0 w-[600px] h-[600px] bg-secondary-500/5 rounded-full blur-[100px]"
          animate={{
            x: [0, -50, 0],
            y: [0, 100, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
        />
      </div>

      <Container 
        size="2xl" 
        className="relative min-h-screen flex flex-col py-12 md:py-16"
        {...containerAnimation}
      >
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <Hero />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <FeatureCards />
          </motion.div>
        </div>
      </Container>
    </>
  );
};

export default CreatorLanding;