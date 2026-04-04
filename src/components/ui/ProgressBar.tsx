import React from 'react';
import { Box } from './Box.js';
import { Text } from './Text.js';

interface ProgressBarProps {
  value: number; // 0 to 100
  width?: number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  label?: string;
  showValue?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  width = 30, 
  variant = 'primary',
  label,
  showValue = true
}) => {
  const progress = Math.min(Math.max(value, 0), 100);
  const filledLength = Math.max(0, Math.floor((progress / 100) * width));
  const emptyLength = Math.max(0, width - filledLength);

  const filled = '█'.repeat(filledLength);
  const empty = '░'.repeat(emptyLength);

  return (
    <Box flexDirection="column" width="100%">
      {label && <Box marginBottom={0}><Text dimColor>{label}</Text></Box>}
      <Box flexDirection="row" width="100%" flexWrap="nowrap">
        <Text variant={variant}>{filled}</Text>
        <Text variant="muted">{empty}</Text>
        {showValue && <Text> {Math.round(progress)}%</Text>}
      </Box>
    </Box>
  );
};
