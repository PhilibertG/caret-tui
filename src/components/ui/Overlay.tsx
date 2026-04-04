import React from 'react';
import { Box } from './Box.js';
import { Text } from './Text.js';
import { useCaret } from '../CaretProvider.js';

interface OverlayProps {
  children: React.ReactNode;
  isOpen: boolean;
}

export const Overlay: React.FC<OverlayProps> = ({ children, isOpen }) => {
  const { theme } = useCaret();
  if (!isOpen) return null;

  const width = 60;
  const height = 14;

  return (
    <Box 
      position="absolute" 
      width="100%" 
      height="100%" 
      alignItems="center" 
      justifyContent="center"
    >
      {/* 
        LE FIX : Une boîte qui contient des lignes d'espaces colorés 
        pour créer une surface 100% opaque.
      */}
      <Box 
        flexDirection="column" 
        backgroundColor={theme.background} 
        borderStyle="double" 
        borderColor={theme.primary}
        paddingX={0}
        paddingY={0}
        width={width}
        height={height}
      >
        {/* On remplit le fond ligne par ligne avec des espaces */}
        <Box position="absolute" flexDirection="column" width={width-2} height={height-2}>
          {Array.from({ length: height - 2 }).map((_, i) => (
            <Text key={i} backgroundColor={theme.background}>
              {' '.repeat(width - 2)}
            </Text>
          ))}
        </Box>

        {/* Le contenu réel par-dessus le fond opaque */}
        <Box flexDirection="column" paddingX={2} paddingY={1} width="100%" height="100%">
          {children}
        </Box>
      </Box>
    </Box>
  );
};
