import React from 'react';
import { Box } from './Box.js';
import { useCaret } from '../CaretProvider.js';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'border' | 'primary' | 'secondary' | 'muted';
}

export const Separator: React.FC<SeparatorProps> = ({ 
  orientation = 'horizontal',
  variant = 'border'
}) => {
  const { theme } = useCaret();
  
  const color = variant === 'border' ? theme.border : theme[variant as keyof typeof theme];

  if (orientation === 'vertical') {
    return (
      <Box 
        width={1} 
        height="100%" 
        borderStyle="single" 
        borderLeft 
        borderRight={false} 
        borderTop={false} 
        borderBottom={false} 
        borderColor={color}
      />
    );
  }

  return (
    <Box 
      width="100%" 
      height={1} 
      borderStyle="single" 
      borderTop 
      borderBottom={false} 
      borderLeft={false} 
      borderRight={false} 
      borderColor={color}
    />
  );
};
