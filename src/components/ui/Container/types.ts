export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  center?: boolean;
  className?: string;
}

export const containerSizes = {
  sm: 'max-w-2xl',    // 672px
  md: 'max-w-4xl',    // 896px
  lg: 'max-w-6xl',    // 1152px
  xl: 'max-w-7xl',    // 1280px
  '2xl': 'max-w-8xl', // 1440px
  full: 'max-w-full'  // 100%
};

export const containerPadding = {
  none: 'px-0',
  sm: 'px-4',
  md: 'px-6',
  lg: 'px-8'
}; 