import React, { useState, useEffect, useMemo } from 'react';
import { useInput } from 'ink';
import { Box } from './Box.js';
import { Text } from './Text.js';
import { useCaret } from '../CaretProvider.js';
import { useFocus } from '../FocusProvider.js';

interface ScrollableListProps<T> {
  id?: string;
  items: T[];
  height: number;
  renderItem: (item: T, isSelected: boolean) => React.ReactNode;
  onSelect?: (item: T) => void;
  autoScroll?: boolean;
}

export function ScrollableList<T>({
  id = 'scrollable-list',
  items,
  height,
  renderItem,
  onSelect,
  autoScroll = false
}: ScrollableListProps<T>) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const { theme } = useCaret();
  const { isFocused } = useFocus();
  const focused = isFocused(id);

  // Clamp selectedIndex when items change
  useEffect(() => {
    if (autoScroll && items.length > height) {
      setScrollOffset(items.length - height);
      setSelectedIndex(items.length - 1);
    } else if (items.length > 0) {
      setSelectedIndex(prev => Math.min(prev, items.length - 1));
      setScrollOffset(prev => Math.min(prev, Math.max(0, items.length - height)));
    } else {
      setSelectedIndex(0);
      setScrollOffset(0);
    }
  }, [items.length, autoScroll, height]);

  useInput((input, key) => {
    if (!focused || items.length === 0) return;

    if (key.upArrow) {
      const nextIndex = selectedIndex <= 0 ? items.length - 1 : selectedIndex - 1;
      setSelectedIndex(nextIndex);
      if (nextIndex < scrollOffset) {
        setScrollOffset(nextIndex);
      }
      // Wrap: jumped to bottom
      if (nextIndex === items.length - 1) {
        setScrollOffset(Math.max(0, items.length - height));
      }
      return;
    }

    if (key.downArrow) {
      const nextIndex = selectedIndex >= items.length - 1 ? 0 : selectedIndex + 1;
      setSelectedIndex(nextIndex);
      if (nextIndex >= scrollOffset + height) {
        setScrollOffset(nextIndex - height + 1);
      }
      // Wrap: jumped to top
      if (nextIndex === 0) {
        setScrollOffset(0);
      }
      return;
    }

    if (key.return && onSelect && items[selectedIndex]) {
      onSelect(items[selectedIndex]);
    }
  }, { isActive: focused });

  const visibleItems = items.slice(scrollOffset, scrollOffset + height);

  // Proportional scrollbar
  const scrollbarInfo = useMemo(() => {
    if (items.length <= height) return null;
    const thumbSize = Math.max(1, Math.round((height / items.length) * height));
    const thumbPos = Math.round((scrollOffset / (items.length - height)) * (height - thumbSize));
    return { thumbSize, thumbPos };
  }, [items.length, height, scrollOffset]);

  return (
    <Box flexDirection="row" width="100%">
      <Box flexDirection="column" flexGrow={1}>
        {visibleItems.map((item, i) => {
          const absoluteIndex = scrollOffset + i;
          const isSelected = selectedIndex === absoluteIndex && focused;

          const bgColor = isSelected
            ? theme.border
            : (absoluteIndex % 2 === 0 ? '#121212' : 'transparent');

          return (
            <Box
              key={absoluteIndex}
              paddingX={1}
              backgroundColor={bgColor}
              width="100%"
            >
              <Box marginRight={1}>
                <Text color={isSelected ? theme.primary : theme.muted}>
                  {isSelected ? '>' : ' '}
                </Text>
              </Box>
              <Box flexGrow={1}>
                {renderItem(item, isSelected)}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Proportional scrollbar */}
      {scrollbarInfo && (
        <Box flexDirection="column" width={1} marginLeft={1}>
          {Array.from({ length: height }).map((_, i) => {
            const isThumb = i >= scrollbarInfo.thumbPos && i < scrollbarInfo.thumbPos + scrollbarInfo.thumbSize;
            return (
              <Text key={i} color={isThumb ? theme.secondary : theme.muted}>
                {isThumb ? '█' : '│'}
              </Text>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
