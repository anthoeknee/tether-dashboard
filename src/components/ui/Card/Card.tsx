import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { CardProps, cardVariants, cardSizes, cardRadius } from './types';

const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  size = 'md',
  radius = 'lg',
  hoverable = true,
  animate = true,
  className,
  ...props
}) => {
  const baseAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.3, ease: 'easeOut' }
  };

  const hoverAnimation = hoverable ? {
    whileHover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    whileTap: { 
      scale: 0.98 
    }
  } : {};

  return (
    <motion.div
      className={cn(
        // Base styles
        'relative overflow-hidden',
        // Variant styles
        cardVariants[variant],
        // Size styles
        cardSizes[size],
        // Radius styles
        cardRadius[radius],
        // Hover effects
        hoverable && 'transition-all duration-200',
        // Custom classes
        className
      )}
      {...(animate ? baseAnimation : {})}
      {...hoverAnimation}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card; 