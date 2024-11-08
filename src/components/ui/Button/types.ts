import { HTMLMotionProps } from 'framer-motion';

export type ButtonVariant = 
  | 'solid' 
  | 'outline' 
  | 'ghost' 
  | 'link' 
  | 'subtle';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: ButtonRadius;
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  animate?: boolean;
  className?: string;
}

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const buttonVariants: Record<ButtonVariant, string> = {
  solid: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30',
  outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100',
  ghost: 'text-primary-500 hover:bg-primary-50 active:bg-primary-100',
  link: 'text-primary-500 hover:underline',
  subtle: 'bg-primary-50 text-primary-700 hover:bg-primary-100 active:bg-primary-200'
};

export const buttonSizes: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-2.5 text-lg',
  xl: 'px-6 py-3 text-xl'
};

export const buttonRadius: Record<ButtonRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full'
};

export const buttonGroupSpacing = {
  none: 'space-x-0',
  sm: 'space-x-2',
  md: 'space-x-3',
  lg: 'space-x-4'
}; 