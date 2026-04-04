import React from 'react';
import { Box } from './Box.js';
import { Text } from './Text.js';

interface SparklineProps {
  values: number[]; // 0 to 100
  width?: number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  label?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({ 
  values, 
  width = 20, 
  variant = 'primary',
  label 
}) => {
  // On ne garde que les 'width' dernières valeurs
  const history = values.slice(-width);
  const bars = [' ', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

  const renderBar = (val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    const index = Math.min(Math.floor((clamped / 100) * bars.length), bars.length - 1);
    return bars[index];
  };

  return (
    <Box flexDirection="column">
      {label && <Text variant="muted">{label.toUpperCase()}</Text>}
      <Box gap={0}>
        {history.map((v, i) => (
          <Text key={i} variant={variant}>{renderBar(v)}</Text>
        ))}
        {/* Remplissage si pas assez de données */}
        {history.length < width && (
          <Text variant="muted">{' '.repeat(width - history.length)}</Text>
        )}
      </Box>
    </Box>
  );
};
