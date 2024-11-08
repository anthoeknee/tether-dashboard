import React from 'react';
import { cn } from '@/utils/cn';
import { ButtonGroupProps, buttonGroupSpacing } from './types';

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  spacing = 'md',
  orientation = 'horizontal',
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'inline-flex',
        orientation === 'vertical' ? 'flex-col' : 'flex-row',
        orientation === 'horizontal' && buttonGroupSpacing[spacing],
        orientation === 'vertical' && spacing !== 'none' && `space-y-${spacing}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default ButtonGroup; 