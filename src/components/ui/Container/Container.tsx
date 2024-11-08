import React from 'react';
import { cn } from '@/utils/cn';
import { ContainerProps, containerSizes, containerPadding } from './types';

const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  padding = 'md',
  center = true,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'w-full h-full',
        'overflow-y-auto overflow-x-hidden',
        containerSizes[size],
        containerPadding[padding],
        center && 'mx-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container; 