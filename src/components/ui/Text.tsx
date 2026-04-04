import React from 'react';
import { Text as InkText, TextProps as InkTextProps } from 'ink';
import { useCaret } from '../CaretProvider.js';

export interface TextProps extends InkTextProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'muted' | 'default';
  children?: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({ 
  variant = 'default', 
  children, 
  color,
  ...props 
}) => {
  const { theme } = useCaret();
  
  let textColor = color;
  if (!color && variant !== 'default') {
    textColor = theme[variant];
  }

  return (
    <InkText {...props} color={textColor}>
      {children}
    </InkText>
  );
};
