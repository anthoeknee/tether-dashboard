import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { ButtonProps, buttonVariants, buttonSizes, buttonRadius } from './types';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'solid',
  size = 'md',
  radius = 'md',
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  animate = true,
  className,
  ...props
}, ref) => {
  const baseAnimation = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center font-medium transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        // Variant styles
        buttonVariants[variant],
        // Size styles
        buttonSizes[size],
        // Radius styles
        buttonRadius[radius],
        // Full width
        fullWidth && 'w-full',
        // Custom classes
        className
      )}
      disabled={isDisabled || isLoading}
      {...(animate ? baseAnimation : {})}
      {...props}
    >
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button; 