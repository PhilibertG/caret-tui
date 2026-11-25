import React, { useEffect, useRef } from 'react';
import { useInput } from 'ink';
import { Box } from './Box.js';
import { Text } from './Text.js';
import { useCaret } from '../CaretProvider.js';
import { useListNavigation, useTypeahead } from 'ink-behaviors';

// --- Types ---

export interface SelectOption<T = string> {
  label: string;
  value: T;
  description?: string;
  disabled?: boolean;
}

interface SelectProps<T = string> {
  options: SelectOption<T>[];
  onSelect: (value: T) => void;
  onCancel?: () => void;
  label?: string;
  visibleCount?: number;
  isActive?: boolean;
  /**
   * Type letters to jump to the option that starts with them. When on,
   * `j` and `k` are letters like any other and no longer move the cursor.
   */
  typeahead?: boolean;
}

// --- Component ---

export function Select<T = string>({
  options,
  onSelect,
  onCancel,
  label,
  visibleCount = 8,
  isActive = true,
  typeahead = false,
}: SelectProps<T>) {
  const { theme } = useCaret();
  const prevLenRef = useRef(options.length);

  // Arrows, Home, End, Page Up/Down, the scrolling window and the skipping
  // of disabled options all come from ink-behaviors.
  const nav = useListNavigation({ items: options, visibleCount, loop: true, isActive });

  // Back to the top when the number of options changes
  useEffect(() => {
    if (options.length !== prevLenRef.current) {
      prevLenRef.current = options.length;
      nav.first();
    }
  }, [options.length, nav.first]);

  const search = useTypeahead({
    items: options,
    current: nav.current,
    isActive: isActive && typeahead,
    onMatch: nav.moveTo,
  });

  useInput((input, key) => {
    if (!isActive) return;

    // Letters go to the typeahead first; it leaves arrows, Enter and ctrl+key alone.
    if (search.handleInput(input, key)) return;
    if (nav.handleInput(input, key)) return;

    // Vim-style shortcuts on top of the standard keys
    if (input === 'k' && !key.ctrl && !key.meta) {
      nav.previous();
      return;
    }
    if (input === 'j' && !key.ctrl && !key.meta) {
      nav.next();
      return;
    }
    if (key.ctrl && input === 'u') {
      nav.pageUp();
      return;
    }
    if (key.ctrl && input === 'd') {
      nav.pageDown();
      return;
    }

    if (key.return) {
      const focused = options[nav.current];
      if (focused && nav.canSelect) {
        onSelect(focused.value);
      }
      return;
    }

    if (key.escape && onCancel) {
      onCancel();
      return;
    }
  }, { isActive });

  const effectiveVisible = nav.viewportEnd - nav.viewportStart;
  const visibleOptions = options.slice(nav.viewportStart, nav.viewportStart + effectiveVisible);
  const hasMoreAbove = nav.viewportStart > 0;
  const hasMoreBelow = nav.viewportStart + effectiveVisible < options.length;

  return (
    <Box flexDirection="column">
      {label && (
        <Box marginBottom={1}>
          <Text bold variant="primary">{label.toUpperCase()}</Text>
        </Box>
      )}

      <Box flexDirection="column" borderStyle="single" borderColor={theme.border} paddingX={1}>
        {hasMoreAbove && (
          <Box justifyContent="center">
            <Text color={theme.muted}>▲ {nav.viewportStart} more</Text>
          </Box>
        )}

        {visibleOptions.map((option, i) => {
          const absoluteIndex = nav.viewportStart + i;
          const isFocused = absoluteIndex === nav.current;
          const isDisabled = option.disabled ?? false;

          return (
            <Box key={String(option.value)} gap={1} flexDirection="column">
              <Box gap={1}>
                <Text color={isFocused ? theme.primary : theme.muted}>
                  {isFocused ? '>' : ' '}
                </Text>
                <Text
                  bold={isFocused}
                  backgroundColor={isFocused ? theme.border : undefined}
                  color={isDisabled ? theme.muted : (isFocused ? theme.foreground : undefined)}
                  dimColor={isDisabled}
                  strikethrough={isDisabled}
                >
                  {` ${option.label} `}
                </Text>
              </Box>
              {option.description && isFocused && (
                <Box paddingLeft={4}>
                  <Text color={theme.muted}>{option.description}</Text>
                </Box>
              )}
            </Box>
          );
        })}

        {hasMoreBelow && (
          <Box justifyContent="center">
            <Text color={theme.muted}>▼ {options.length - nav.viewportStart - effectiveVisible} more</Text>
          </Box>
        )}
      </Box>

      <Box marginTop={0} paddingX={1}>
        <Text dimColor>{typeahead ? '↑↓ navigate · type to search' : '↑↓/jk navigate'} · Enter select{onCancel ? ' · Esc cancel' : ''}</Text>
      </Box>
    </Box>
  );
}
