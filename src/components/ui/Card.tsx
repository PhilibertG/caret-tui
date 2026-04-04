import React from 'react';
import { Box } from './Box.js';
import { Text } from './Text.js';
import { useCaret } from '../CaretProvider.js';
import { BorderStyle } from '../../theme/borders.js';

interface CardProps {
  title?: string;
  footer?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'default';
  borderStyle?: BorderStyle;
  padding?: number;
  height?: number | string;
}

export const Card: React.FC<CardProps> = ({
  title,
  footer,
  children,
  variant = 'default',
  borderStyle = 'round',
  padding = 1,
  height
}) => {
  const { theme } = useCaret();

  return (
    <Box
      flexDirection="column"
      borderStyle={borderStyle}
      variant={variant}
      paddingX={padding}
      paddingY={0}
      height={height}
      width="100%"
    >
      {title && (
        <Box marginTop={-1} paddingX={1} backgroundColor={theme.background}>
          <Text bold variant={variant === 'default' ? 'primary' : variant}>
            {` ${title.toUpperCase()} `}
          </Text>
        </Box>
      )}

      <Box paddingY={1} flexDirection="column" width="100%">
        {children}
      </Box>

      {footer && (
        <Box marginBottom={-1} paddingX={1} backgroundColor={theme.background} alignSelf="flex-end">
          <Text dimColor italic variant="muted">
            {` ${footer} `}
          </Text>
        </Box>
      )}
    </Box>
  );
};
