import React, { useEffect, useMemo } from 'react';
import { useListNavigation } from 'ink-behaviors';
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
  const { theme } = useCaret();
  const { isFocused } = useFocus();
  const focused = isFocused(id);

  // Arrows, Home, End, Page Up/Down and the scrolling window come from
  // ink-behaviors. Every item can be selected here, whatever its fields:
  // focusDisabled keeps an item that happens to have `disabled: true` reachable.
  const nav = useListNavigation({
    items,
    visibleCount: height,
    loop: true,
    focusDisabled: true,
    isActive: focused,
  });
  const selectedIndex = nav.current;
  const scrollOffset = nav.viewportStart;

  // Follow the end of the list when items are added
  useEffect(() => {
    if (autoScroll && items.length > height) {
      nav.last();
    }
  }, [items.length, autoScroll, height, nav.last]);

  useInput((input, key) => {
    if (!focused || items.length === 0) return;

    if (nav.handleInput(input, key)) return;

    const selected = items[selectedIndex];
    if (key.return && onSelect && selected !== undefined) {
      onSelect(selected);
    }
  }, { isActive: focused });

  const visibleItems = items.slice(nav.viewportStart, nav.viewportEnd);

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
