import React, { useState, useReducer, useEffect, useMemo } from 'react';
import { useInput } from 'ink';
import { Box } from './Box.js';
import { Text } from './Text.js';
import { useCaret } from '../CaretProvider.js';

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

interface FileTreeProps {
  nodes: FileNode[];
  onSelect?: (node: FileNode) => void;
  isActive?: boolean;
  visibleCount?: number;
}

// Flatten tree into a list respecting expand state

interface FlatNode {
  node: FileNode;
  depth: number;
  path: string; // unique key built from path
  isDir: boolean;
  hasChildren: boolean;
}

function flattenTree(
  nodes: FileNode[],
  expandedPaths: Set<string>,
  parentPath = '',
  depth = 0,
): FlatNode[] {
  const result: FlatNode[] = [];
  for (const node of nodes) {
    const path = parentPath ? `${parentPath}/${node.name}` : node.name;
    const isDir = node.type === 'directory';
    const hasChildren = isDir && (node.children?.length ?? 0) > 0;

    result.push({ node, depth, path, isDir, hasChildren });

    if (isDir && hasChildren && expandedPaths.has(path)) {
      result.push(...flattenTree(node.children!, expandedPaths, path, depth + 1));
    }
  }
  return result;
}

// Reducer for navigation

interface TreeState {
  focusIndex: number;
  viewportStart: number;
}

type TreeAction =
  | { type: 'up'; count: number; visible: number }
  | { type: 'down'; count: number; visible: number }
  | { type: 'clamp'; count: number; visible: number };

function treeReducer(state: TreeState, action: TreeAction): TreeState {
  switch (action.type) {
    case 'up': {
      const next = state.focusIndex <= 0 ? action.count - 1 : state.focusIndex - 1;
      let vp = state.viewportStart;
      if (next < vp) vp = next;
      if (next === action.count - 1) vp = Math.max(0, action.count - action.visible);
      return { focusIndex: next, viewportStart: vp };
    }
    case 'down': {
      const next = state.focusIndex >= action.count - 1 ? 0 : state.focusIndex + 1;
      let vp = state.viewportStart;
      if (next >= vp + action.visible) vp = next - action.visible + 1;
      if (next === 0) vp = 0;
      return { focusIndex: next, viewportStart: vp };
    }
    case 'clamp': {
      const focus = Math.min(state.focusIndex, action.count - 1);
      let vp = state.viewportStart;
      if (focus < vp) vp = focus;
      if (focus >= vp + action.visible) vp = focus - action.visible + 1;
      vp = Math.max(0, vp);
      return { focusIndex: Math.max(0, focus), viewportStart: vp };
    }
  }
}

export const FileTree: React.FC<FileTreeProps> = ({
  nodes,
  onSelect,
  isActive = true,
  visibleCount = 15,
}) => {
  const { theme } = useCaret();
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() => new Set());

  const flatNodes = useMemo(
    () => flattenTree(nodes, expandedPaths),
    [nodes, expandedPaths],
  );

  const effective = Math.min(visibleCount, flatNodes.length);

  const [state, dispatch] = useReducer(treeReducer, {
    focusIndex: 0,
    viewportStart: 0,
  });

  // Clamp when flat list changes (expand/collapse)
  useEffect(() => {
    dispatch({ type: 'clamp', count: flatNodes.length, visible: effective });
  }, [flatNodes.length, effective]);

  const toggleExpand = (path: string) => {
    setExpandedPaths(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  useInput((input, key) => {
    if (!isActive || flatNodes.length === 0) return;

    if (key.upArrow || input === 'k') {
      dispatch({ type: 'up', count: flatNodes.length, visible: effective });
      return;
    }
    if (key.downArrow || input === 'j') {
      dispatch({ type: 'down', count: flatNodes.length, visible: effective });
      return;
    }

    // Enter or right arrow: expand dir or select file
    if (key.return || key.rightArrow) {
      const focused = flatNodes[state.focusIndex];
      if (!focused) return;

      if (focused.isDir && focused.hasChildren) {
        if (!expandedPaths.has(focused.path)) {
          toggleExpand(focused.path);
        } else if (key.return && onSelect) {
          onSelect(focused.node);
        }
      } else if (onSelect) {
        onSelect(focused.node);
      }
      return;
    }

    // Left arrow: collapse dir or go to parent
    if (key.leftArrow) {
      const focused = flatNodes[state.focusIndex];
      if (!focused) return;

      if (focused.isDir && expandedPaths.has(focused.path)) {
        toggleExpand(focused.path);
      }
      return;
    }

    // Space to toggle expand
    if (input === ' ') {
      const focused = flatNodes[state.focusIndex];
      if (focused?.isDir && focused.hasChildren) {
        toggleExpand(focused.path);
      }
      return;
    }
  }, { isActive });

  const visible = flatNodes.slice(state.viewportStart, state.viewportStart + effective);
  const hasAbove = state.viewportStart > 0;
  const hasBelow = state.viewportStart + effective < flatNodes.length;

  return (
    <Box flexDirection="column">
      {hasAbove && (
        <Text color={theme.muted}>  ▲ {state.viewportStart} more</Text>
      )}

      {visible.map((flat, i) => {
        const absIndex = state.viewportStart + i;
        const isFocused = absIndex === state.focusIndex;
        const indent = '  '.repeat(flat.depth);
        const prefix = flat.isDir
          ? (expandedPaths.has(flat.path) ? '▼ ' : '▶ ')
          : '  ';

        return (
          <Box key={flat.path}>
            <Text color={isFocused ? theme.primary : theme.muted}>
              {isFocused ? '>' : ' '}
            </Text>
            <Text color={isFocused ? theme.foreground : theme.muted}>
              {indent}{prefix}
            </Text>
            <Text
              bold={isFocused}
              color={flat.isDir ? theme.secondary : (isFocused ? theme.foreground : undefined)}
              backgroundColor={isFocused ? theme.border : undefined}
            >
              {flat.node.name}
            </Text>
          </Box>
        );
      })}

      {hasBelow && (
        <Text color={theme.muted}>  ▼ {flatNodes.length - state.viewportStart - effective} more</Text>
      )}

      {flatNodes.length > 0 && (
        <Box marginTop={0} paddingX={1}>
          <Text dimColor>↑↓ navigate · ←→/Space expand · Enter select</Text>
        </Box>
      )}
    </Box>
  );
};
