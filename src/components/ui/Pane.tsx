import React from 'react';
import { Box } from './Box.js';
import { Text } from './Text.js';
import { useCaret } from '../CaretProvider.js';

interface PaneProps {
  children: React.ReactNode;
  title?: string;
  width?: string | number;
  height?: string | number;
  showBorder?: boolean;
}

export const Pane: React.FC<PaneProps> = ({ 
  children, 
  title, 
  width = "100%", 
  height, 
  showBorder = true 
}) => {
  const { theme } = useCaret();
  
  return (
    <Box 
      flexDirection="column" 
      width={width} 
      height={height}
      borderStyle={showBorder ? 'single' : undefined}
      borderColor={theme.border}
      paddingX={showBorder ? 1 : 0}
    >
      {title && (
        <Box marginTop={-1} paddingX={1} backgroundColor={theme.background}>
          <Text bold color={theme.secondary}>{` ${title.toUpperCase()} `}</Text>
        </Box>
      )}
      <Box flexDirection="column" flexGrow={1} width="100%">
        {children}
      </Box>
    </Box>
  );
};
