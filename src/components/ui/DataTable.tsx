import React, { useState, useMemo } from 'react';
import { useInput } from 'ink';
import { Box } from './Box.js';
import { Text } from './Text.js';
import { useCaret } from '../CaretProvider.js';
import { useFocus } from '../FocusProvider.js';

interface Column<T> {
  header: string;
  key: keyof T;
  width?: number;
  align?: 'left' | 'right';
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  id?: string;
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
}

export function DataTable<T>({ 
  id = 'data-table',
  columns, 
  data, 
  pageSize = 10 
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(0);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const { theme } = useCaret();
  const { isFocused } = useFocus();
  const focused = isFocused(id);

  // Sorting Logic
  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    currentPage * pageSize, 
    (currentPage + 1) * pageSize
  );

  useInput((input, key) => {
    if (!focused) return;

    if (key.leftArrow) {
      setCurrentPage(prev => Math.max(0, prev - 1));
    }
    if (key.rightArrow) {
      setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    }
    // Sorting trigger (just cycle through sortable columns for demo)
    if (input === 's') {
      const sortableCols = columns.filter(c => c.sortable);
      if (sortableCols.length > 0) {
        const currentIndex = sortableCols.findIndex(c => c.key === sortKey);
        const nextCol = sortableCols[(currentIndex + 1) % sortableCols.length];
        if (nextCol.key === sortKey) {
          setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
          setSortKey(nextCol.key);
          setSortOrder('asc');
        }
      }
    }
  });

  const padText = (text: string, width: number, align: 'left' | 'right' = 'left') => {
    const str = String(text);
    if (str.length >= width) return str.slice(0, width);
    const diff = width - str.length;
    const spaces = ' '.repeat(diff);
    return align === 'left' ? str + spaces : spaces + str;
  };

  return (
    <Box flexDirection="column" width="100%">
      {/* Header */}
      <Box paddingX={1} marginBottom={0}>
        {columns.map((col) => (
          <Box key={String(col.key)} width={col.width || 15} marginRight={2}>
            <Text bold color={sortKey === col.key ? theme.primary : theme.muted}>
              {col.header.toUpperCase()}
              {sortKey === col.key && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
            </Text>
          </Box>
        ))}
      </Box>

      {/* Separator */}
      <Box width="100%" height={1}>
        <Text color={theme.border}>{"─".repeat((process.stdout.columns ?? 80) - 10)}</Text>
      </Box>

      {/* Rows */}
      <Box flexDirection="column" width="100%">
        {paginatedData.map((item, rowIndex) => {
          const isEvenRow = rowIndex % 2 === 0;
          const bgColor = isEvenRow ? theme.border : undefined;

          return (
            <Box key={rowIndex} paddingX={1} backgroundColor={bgColor} width="100%">
              {columns.map((col) => (
                <Box key={String(col.key)} width={col.width || 15} marginRight={2}>
                  {col.render ? (
                    <Box backgroundColor={bgColor} width="100%">
                      {col.render(item[col.key], item)}
                    </Box>
                  ) : (
                    <Text backgroundColor={bgColor} color={isEvenRow ? theme.foreground : theme.muted}>
                      {padText(String(item[col.key]), col.width || 15, col.align)}
                    </Text>
                  )}
                </Box>
              ))}
              <Box flexGrow={1} backgroundColor={bgColor}><Text> </Text></Box>
            </Box>
          );
        })}
      </Box>

      {/* Pagination Footer */}
      <Box marginTop={1} paddingX={1} justifyContent="space-between" width="100%">
        <Box gap={1}>
          <Text variant="muted">Page {currentPage + 1} of {totalPages}</Text>
          {focused && <Text color={theme.primary}>[Use ←/→ to navigate • 's' to sort]</Text>}
        </Box>
        <Text variant="muted">Total items: {data.length}</Text>
      </Box>
    </Box>
  );
}
