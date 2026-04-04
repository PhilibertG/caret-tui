import React, { useState, useEffect, useMemo } from 'react';
import { useInput } from 'ink';
import { Box } from './Box.js';
import { Text } from './Text.js';
import { useCaret } from '../CaretProvider.js';
import { useFocus } from '../FocusProvider.js';

interface CommandInputProps {
  id?: string;
  placeholder?: string;
  prefix?: string;
  suggestions?: string[];
  onSubmit: (value: string) => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  type?: 'text' | 'password';
}

export const CommandInput: React.FC<CommandInputProps> = ({ 
  id = 'command-input',
  placeholder = 'Type a command...', 
  prefix = 'λ',
  suggestions = [],
  onSubmit,
  variant = 'primary',
  type = 'text'
}) => {
  const [value, setValue] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  
  const { theme } = useCaret();
  const { isFocused, requestFocus } = useFocus();
  const focused = isFocused(id);

  // Auto-focus only if nothing else is focused
  useEffect(() => {
    if (!isFocused(id)) {
      requestFocus(id);
    }
    // Only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(timer);
  }, []);

  const matchingSuggestions = useMemo(() => {
    if (!value || suggestions.length === 0) return [];
    return suggestions.filter(s => s.startsWith(value));
  }, [value, suggestions]);

  const ghostText = useMemo(() => {
    if (matchingSuggestions.length === 0 || suggestionIndex === -1) {
      return matchingSuggestions[0]?.slice(value.length) || '';
    }
    return matchingSuggestions[suggestionIndex].slice(value.length);
  }, [value, matchingSuggestions, suggestionIndex]);

  useInput((input, key) => {
    if (!focused) return;

    if (key.return) {
      if (value.trim()) {
        onSubmit(value);
        setHistory((prev) => [value, ...prev].slice(0, 50));
        setValue('');
        setCursorPosition(0);
        setHistoryIndex(-1);
        setSuggestionIndex(-1);
      }
      return;
    }

    if (key.tab) {
      if (matchingSuggestions.length > 0) {
        const nextIndex = (suggestionIndex + 1) % matchingSuggestions.length;
        setSuggestionIndex(nextIndex);
        const completion = matchingSuggestions[nextIndex];
        setValue(completion);
        setCursorPosition(completion.length);
      }
      return;
    }

    if (key.upArrow) {
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        const val = history[newIndex];
        setHistoryIndex(newIndex);
        setValue(val);
        setCursorPosition(val.length);
      }
      return;
    }

    if (key.downArrow) {
      if (historyIndex > -1) {
        const newIndex = historyIndex - 1;
        const val = newIndex === -1 ? '' : history[newIndex];
        setHistoryIndex(newIndex);
        setValue(val);
        setCursorPosition(val.length);
      }
      return;
    }

    if (key.leftArrow) {
      setCursorPosition((p) => Math.max(0, p - 1));
      return;
    }

    if (key.rightArrow) {
      if (cursorPosition < value.length) {
        setCursorPosition((p) => p + 1);
      } else if (ghostText) {
        setValue(value + ghostText);
        setCursorPosition(value.length + ghostText.length);
      }
      return;
    }

    if (key.backspace || key.delete) {
      if (cursorPosition > 0) {
        const newValue = value.slice(0, cursorPosition - 1) + value.slice(cursorPosition);
        setValue(newValue);
        setCursorPosition(cursorPosition - 1);
        setSuggestionIndex(-1);
      }
      return;
    }

    if (key.ctrl || key.meta || key.escape) return;

    const newValue = value.slice(0, cursorPosition) + input + value.slice(cursorPosition);
    setValue(newValue);
    setCursorPosition(cursorPosition + 1);
    setSuggestionIndex(-1);
  });

  const renderText = (str: string) => {
    if (type === 'password') return '*'.repeat(str.length);
    return str;
  };

  const renderContent = () => {
    if (value === '' && focused) {
      return (
        <Box>
          <Text backgroundColor={cursorVisible ? theme.active : 'transparent'} color="black"> </Text>
          <Text variant="muted">{placeholder}</Text>
        </Box>
      );
    }

    if (!focused) return <Text variant="muted">{value === '' ? placeholder : renderText(value)}</Text>;

    const beforeCursor = value.slice(0, cursorPosition);
    const atCursor = value[cursorPosition] || ' ';
    const afterCursor = value.slice(cursorPosition + 1);

    return (
      <Box>
        <Text>{renderText(beforeCursor)}</Text>
        <Text backgroundColor={cursorVisible ? theme.active : 'transparent'} color="black">
          {type === 'password' && atCursor !== ' ' ? '*' : atCursor}
        </Text>
        <Text>{renderText(afterCursor)}</Text>
        <Text color={theme.muted}>{ghostText}</Text>
      </Box>
    );
  };

  return (
    <Box flexDirection="column" width="100%">
      <Box width="100%" height={1} marginBottom={0}>
        <Text color={theme.border}>{"─".repeat((process.stdout.columns ?? 80) - 8)}</Text>
      </Box>
      
      <Box paddingX={1} gap={1}>
        <Text bold color={focused ? theme[variant] : theme.muted}>{prefix}</Text>
        <Box flexGrow={1}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};
