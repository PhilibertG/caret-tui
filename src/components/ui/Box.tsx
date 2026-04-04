import React from 'react';
import { Box as InkBox, BoxProps as InkBoxProps } from 'ink';
import { useCaret } from '../CaretProvider.js';
import { borderStyles, BorderStyle } from '../../theme/borders.js';

export interface BoxProps extends Omit<InkBoxProps, 'borderStyle' | 'backgroundColor'> {
  backgroundColor?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'muted';
  borderStyle?: BorderStyle;
  children?: React.ReactNode;
}

export const Box: React.FC<BoxProps> = ({ 
  variant = 'default', 
  borderStyle, 
  children, 
  ...props 
}) => {
  const { theme } = useCaret();
  
  // N'afficher de bordure que si borderStyle est passé
  const currentBorderStyle = borderStyle ? borderStyles[borderStyle] : undefined;
  
  let borderColor = props.borderColor || theme.border;
  if (variant !== 'default') {
    borderColor = theme[variant];
  }

  return (
    <InkBox 
      {...props} 
      borderStyle={currentBorderStyle} 
      borderColor={borderColor}
    >
      {children}
    </InkBox>
  );
};
