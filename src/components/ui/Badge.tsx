import React from 'react';
import { Box } from './Box.js';
import { Text } from './Text.js';
import { useCaret } from '../CaretProvider.js';

interface BadgeProps {
  children: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'secondary' 
}) => {
  const { theme } = useCaret();

  const label = children.toUpperCase();

  if (variant === 'outline') {
    return (
      <Box borderStyle="single" paddingX={1} borderColor={theme.border}>
        <Text variant="muted">{label}</Text>
      </Box>
    );
  }

  const bgColor = variant === 'secondary' ? theme.border : theme[variant as keyof typeof theme];
  const isLight = variant === 'primary' || variant === 'warning';
  
  // Technique du padding manuel pour forcer le background
  const paddedLabel = ` ${label} `;

  return (
    <Box backgroundColor={bgColor as string}>
      <Text bold color={isLight ? 'black' : 'white'} backgroundColor={bgColor as string}>
        {paddedLabel}
      </Text>
    </Box>
  );
};
