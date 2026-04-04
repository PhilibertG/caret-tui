import React, { useReducer, useEffect, useRef } from 'react';
import { useInput } from 'ink';
import { Box } from './Box.js';
import { Text } from './Text.js';
import { useCaret } from '../CaretProvider.js';

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
}

// --- Reducer ---

interface SelectState {
  focusIndex: number;
  viewportStart: number;
}

type SelectAction =
  | { type: 'move_up'; optionCount: number; visibleCount: number }
  | { type: 'move_down'; optionCount: number; visibleCount: number }
  | { type: 'page_up'; visibleCount: number }
  | { type: 'page_down'; optionCount: number; visibleCount: number }
  | { type: 'go_first' }
  | { type: 'go_last'; optionCount: number; visibleCount: number }
  | { type: 'reset'; optionCount: number; visibleCount: number };

function clampViewport(focusIndex: number, viewportStart: number, visibleCount: number, optionCount: number): SelectState {
  let vp = viewportStart;
  if (focusIndex < vp) {
    vp = focusIndex;
  } else if (focusIndex >= vp + visibleCount) {
    vp = focusIndex - visibleCount + 1;
  }
  vp = Math.max(0, Math.min(vp, optionCount - visibleCount));
  return { focusIndex, viewportStart: vp };
}

function selectReducer(state: SelectState, action: SelectAction): SelectState {
  switch (action.type) {
    case 'move_up': {
      const next = state.focusIndex <= 0 ? action.optionCount - 1 : state.focusIndex - 1;
      return clampViewport(next, state.viewportStart, action.visibleCount, action.optionCount);
    }
    case 'move_down': {
      const next = state.focusIndex >= action.optionCount - 1 ? 0 : state.focusIndex + 1;
      return clampViewport(next, state.viewportStart, action.visibleCount, action.optionCount);
    }
    case 'page_up': {
      const next = Math.max(0, state.focusIndex - action.visibleCount);
      return clampViewport(next, next, action.visibleCount, state.focusIndex + 1);
    }
    case 'page_down': {
      const next = Math.min(action.optionCount - 1, state.focusIndex + action.visibleCount);
      return clampViewport(next, state.viewportStart, action.visibleCount, action.optionCount);
    }
    case 'go_first':
      return { focusIndex: 0, viewportStart: 0 };
    case 'go_last': {
      const focus = action.optionCount - 1;
      return clampViewport(focus, state.viewportStart, action.visibleCount, action.optionCount);
    }
    case 'reset':
      return clampViewport(0, 0, action.visibleCount, action.optionCount);
    default:
      return state;
  }
}

// --- Component ---

export function Select<T = string>({
  options,
  onSelect,
  onCancel,
  label,
  visibleCount = 8,
  isActive = true,
}: SelectProps<T>) {
  const { theme } = useCaret();
  const effectiveVisible = Math.min(visibleCount, options.length);
  const prevLenRef = useRef(options.length);

  const [state, dispatch] = useReducer(selectReducer, {
    focusIndex: 0,
    viewportStart: 0,
  });

  // Reset when options change length
  useEffect(() => {
    if (options.length !== prevLenRef.current) {
      prevLenRef.current = options.length;
      dispatch({ type: 'reset', optionCount: options.length, visibleCount: effectiveVisible });
    }
  }, [options.length, effectiveVisible]);

  useInput((input, key) => {
    if (!isActive) return;

    if (key.upArrow || input === 'k') {
      if (options.every(o => o.disabled)) return;
      dispatch({ type: 'move_up', optionCount: options.length, visibleCount: effectiveVisible });
      return;
    }

    if (key.downArrow || input === 'j') {
      if (options.every(o => o.disabled)) return;
      dispatch({ type: 'move_down', optionCount: options.length, visibleCount: effectiveVisible });
      return;
    }

    if (key.return) {
      const focused = options[state.focusIndex];
      if (focused && !focused.disabled) {
        onSelect(focused.value);
      }
      return;
    }

    if (key.escape && onCancel) {
      onCancel();
      return;
    }

    // Page navigation
    if (key.ctrl && input === 'u') {
      dispatch({ type: 'page_up', visibleCount: effectiveVisible });
      return;
    }
    if (key.ctrl && input === 'd') {
      dispatch({ type: 'page_down', optionCount: options.length, visibleCount: effectiveVisible });
      return;
    }
  }, { isActive });

  const visibleOptions = options.slice(state.viewportStart, state.viewportStart + effectiveVisible);
  const hasMoreAbove = state.viewportStart > 0;
  const hasMoreBelow = state.viewportStart + effectiveVisible < options.length;

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
            <Text color={theme.muted}>▲ {state.viewportStart} more</Text>
          </Box>
        )}

        {visibleOptions.map((option, i) => {
          const absoluteIndex = state.viewportStart + i;
          const isFocused = absoluteIndex === state.focusIndex;
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
            <Text color={theme.muted}>▼ {options.length - state.viewportStart - effectiveVisible} more</Text>
          </Box>
        )}
      </Box>

      <Box marginTop={0} paddingX={1}>
        <Text dimColor>↑↓/jk navigate · Enter select{onCancel ? ' · Esc cancel' : ''}</Text>
      </Box>
    </Box>
  );
}
