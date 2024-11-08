import { HTMLMotionProps } from 'framer-motion';

export type CardVariant = 'flat' | 'elevated' | 'bordered';
export type CardSize = 'sm' | 'md' | 'lg';
export type CardRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  radius?: CardRadius;
  hoverable?: boolean;
  className?: string;
  animate?: boolean;
}

export const cardVariants = {
  flat: 'bg-white/5 backdrop-blur-sm',
  elevated: 'bg-white/10 backdrop-blur-md shadow-lg',
  bordered: 'border border-white/10 bg-white/5 backdrop-blur-sm'
};

export const cardSizes = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

export const cardRadius = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-2xl'
}; 