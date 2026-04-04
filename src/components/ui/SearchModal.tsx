import React, { useState, useMemo } from 'react';
import { useInput } from 'ink';
import { Box } from './Box.js';
import { Text } from './Text.js';
import { Overlay } from './Overlay.js';

interface SearchItem {
  label: string;
  value: string;
  category?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  items: SearchItem[];
  placeholder?: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  items,
  placeholder = "Search commands..."
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
  }, [query, items]);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useInput((input, key) => {
    if (key.escape) { onClose(); return; }
    if (key.upArrow) { setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1)); return; }
    if (key.downArrow) { setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0)); return; }
    if (key.return) {
      if (filteredItems[selectedIndex]) {
        onSelect(filteredItems[selectedIndex].value);
        onClose();
      }
      return;
    }
    if (key.backspace || key.delete) { setQuery(prev => prev.slice(0, -1)); setSelectedIndex(0); return; }
    if (!key.ctrl && !key.meta && input) { setQuery(prev => prev + input); setSelectedIndex(0); }
  }, { isActive: isOpen });

  const width = 54; // Largeur interne de la modale

  return (
    <Overlay isOpen={isOpen}>
      <Box flexDirection="column" width={width}>
        <Box gap={1} marginBottom={1}>
          <Text bold color="white">SEARCH:</Text>
          <Text color="white">{query}</Text>
          {query === '' && <Text color="#404040">{placeholder}</Text>}
        </Box>
        
        <Box width="100%" height={1} marginBottom={1}>
          <Text color="#404040">{"─".repeat(width)}</Text>
        </Box>

        <Box flexDirection="column">
          {filteredItems.map((item, i) => {
            const isSelected = i === selectedIndex;
            const label = item.label.slice(0, 30);
            const category = item.category ? ` [${item.category}]` : '';
            const fullText = `${isSelected ? '→ ' : '  '}${label}${category}`;
            const paddedText = fullText + ' '.repeat(Math.max(0, width - fullText.length));

            return (
              <Box key={item.value} width="100%">
                <Text 
                  backgroundColor={isSelected ? '#ffffff' : 'transparent'} 
                  color={isSelected ? '#000000' : '#a3a3a3'}
                  bold={isSelected}
                >
                  {paddedText}
                </Text>
              </Box>
            );
          })}
        </Box>

        <Box marginTop={1} justifyContent="center" width="100%">
          <Text color="#404040">↑↓ NAVIGATE · ENTER SELECT · ESC CLOSE</Text>
        </Box>
      </Box>
    </Overlay>
  );
};
