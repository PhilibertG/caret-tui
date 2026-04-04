import React from 'react';
import { Box } from './Box.js';
import { Text } from './Text.js';
import { useCaret } from '../CaretProvider.js';

interface MarkdownProps {
  children: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ children }) => {
  const { theme } = useCaret();
  const lines = children.split('\n');

  const renderTextWithLinks = (text: string) => {
    const parts = text.split(/(\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        return (
          <Text key={i} color={theme.secondary} underline>
            {linkMatch[1]}
          </Text>
        );
      }
      
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((bp, bi) => {
        if (bp.startsWith('**') && bp.endsWith('**')) {
          return <Text key={bi} bold>{bp.replace(/\*\*/g, '')}</Text>;
        }
        return <Text key={bi}>{bp}</Text>;
      });
    });
  };

  return (
    <Box flexDirection="column">
      {lines.map((line, i) => {
        // Headers
        if (line.startsWith('# ')) {
          return (
            <Box key={i} marginBottom={1}>
              <Text bold color={theme.primary} underline>{line.replace('# ', '').toUpperCase()}</Text>
            </Box>
          );
        }
        
        // Tables: | col | col |
        if (line.startsWith('|') && line.endsWith('|')) {
          const cells = line.split('|').filter(c => c.trim() !== '');
          // Ignore separator lines like |---|--- |
          if (cells.every(c => c.trim().startsWith('-'))) return null;

          return (
            <Box key={i} gap={2}>
              {cells.map((cell, ci) => (
                <Box key={ci} width={15}>
                  <Text>{cell.trim()}</Text>
                </Box>
              ))}
            </Box>
          );
        }

        // Lists
        if (line.startsWith('- ')) {
          return (
            <Box key={i} paddingLeft={2}>
              <Text color={theme.primary}>● </Text>
              <Box flexGrow={1}>
                <Text>{renderTextWithLinks(line.replace('- ', ''))}</Text>
              </Box>
            </Box>
          );
        }

        // Code blocks
        if (line.startsWith('`') && line.endsWith('`')) {
          return (
            <Box key={i} backgroundColor={theme.border} paddingX={1}>
              <Text color={theme.secondary}>{line.replace(/`/g, '')}</Text>
            </Box>
          );
        }

        return (
          <Box key={i}>
            <Text>{renderTextWithLinks(line)}</Text>
          </Box>
        );
      })}
    </Box>
  );
};
