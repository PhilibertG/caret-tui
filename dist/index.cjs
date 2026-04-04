'use strict';

var chunk6TXL7YKR_cjs = require('./chunk-6TXL7YKR.cjs');
var ink = require('ink');
var React10 = require('react');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React10__default = /*#__PURE__*/_interopDefault(React10);

var CaretContext = React10.createContext(void 0);
var CaretProvider = ({ children, initialTheme = "shadcn" }) => {
  const [themeName, setThemeName] = React10.useState(initialTheme);
  const theme = chunk6TXL7YKR_cjs.themes[themeName];
  const setTheme = React10.useCallback((name) => {
    setThemeName(name);
  }, []);
  const value = React10.useMemo(() => ({
    theme,
    themeName,
    setTheme
  }), [theme, themeName, setTheme]);
  return /* @__PURE__ */ jsxRuntime.jsx(CaretContext.Provider, { value, children });
};
var useCaret = () => {
  const context = React10.useContext(CaretContext);
  if (!context) {
    throw new Error("useCaret must be used within a CaretProvider");
  }
  return context;
};
var Box = ({
  variant = "default",
  borderStyle,
  children,
  ...props
}) => {
  const { theme } = useCaret();
  const currentBorderStyle = borderStyle ? chunk6TXL7YKR_cjs.borderStyles[borderStyle] : void 0;
  let borderColor = props.borderColor || theme.border;
  if (variant !== "default") {
    borderColor = theme[variant];
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    ink.Box,
    {
      ...props,
      borderStyle: currentBorderStyle,
      borderColor,
      children
    }
  );
};
var Text = ({
  variant = "default",
  children,
  color,
  ...props
}) => {
  const { theme } = useCaret();
  let textColor = color;
  if (!color && variant !== "default") {
    textColor = theme[variant];
  }
  return /* @__PURE__ */ jsxRuntime.jsx(ink.Text, { ...props, color: textColor, children });
};
var Card = ({
  title,
  footer,
  children,
  variant = "default",
  borderStyle = "round",
  padding = 1,
  height
}) => {
  const { theme } = useCaret();
  return /* @__PURE__ */ jsxRuntime.jsxs(
    Box,
    {
      flexDirection: "column",
      borderStyle,
      variant,
      paddingX: padding,
      paddingY: 0,
      height,
      width: "100%",
      children: [
        title && /* @__PURE__ */ jsxRuntime.jsx(Box, { marginTop: -1, paddingX: 1, backgroundColor: theme.background, children: /* @__PURE__ */ jsxRuntime.jsx(Text, { bold: true, variant: variant === "default" ? "primary" : variant, children: ` ${title.toUpperCase()} ` }) }),
        /* @__PURE__ */ jsxRuntime.jsx(Box, { paddingY: 1, flexDirection: "column", width: "100%", children }),
        footer && /* @__PURE__ */ jsxRuntime.jsx(Box, { marginBottom: -1, paddingX: 1, backgroundColor: theme.background, alignSelf: "flex-end", children: /* @__PURE__ */ jsxRuntime.jsx(Text, { dimColor: true, italic: true, variant: "muted", children: ` ${footer} ` }) })
      ]
    }
  );
};
var Badge = ({
  children,
  variant = "secondary"
}) => {
  const { theme } = useCaret();
  const label = children.toUpperCase();
  if (variant === "outline") {
    return /* @__PURE__ */ jsxRuntime.jsx(Box, { borderStyle: "single", paddingX: 1, borderColor: theme.border, children: /* @__PURE__ */ jsxRuntime.jsx(Text, { variant: "muted", children: label }) });
  }
  const bgColor = variant === "secondary" ? theme.border : theme[variant];
  const isLight = variant === "primary" || variant === "warning";
  const paddedLabel = ` ${label} `;
  return /* @__PURE__ */ jsxRuntime.jsx(Box, { backgroundColor: bgColor, children: /* @__PURE__ */ jsxRuntime.jsx(Text, { bold: true, color: isLight ? "black" : "white", backgroundColor: bgColor, children: paddedLabel }) });
};
var spinners = {
  // --- Tes Classiques ---
  dots: ["\u280B", "\u2819", "\u2839", "\u2838", "\u283C", "\u2834", "\u2826", "\u2827", "\u2807", "\u280F"],
  arc: ["\u25DC", "\u25E0", "\u25DD", "\u25DE", "\u25E1", "\u25DF"],
  line: ["-", "\\", "|", "/"],
  // --- Nouveaux Styles ---
  // Phases de la lune (Ultra fluide)
  moon: ["\u{1F311}", "\u{1F312}", "\u{1F313}", "\u{1F314}", "\u{1F315}", "\u{1F316}", "\u{1F317}", "\u{1F318}"],
  // Terre qui tourne
  earth: ["\u{1F30D}", "\u{1F30E}", "\u{1F30F}"],
  // Croissance (Barres de hauteur croissante)
  grow: [" ", "\u2583", "\u2584", "\u2585", "\u2586", "\u2587", "\u2586", "\u2585", "\u2584", "\u2583"],
  // Balle qui rebondit
  bounce: ["\u2801", "\u2802", "\u2804", "\u2802"],
  // Flèche qui pointe
  arrow: ["\u2190", "\u2196", "\u2191", "\u2197", "\u2192", "\u2198", "\u2193", "\u2199"],
  // Triangle qui tourne
  triangle: ["\u25E2", "\u25E3", "\u25E4", "\u25E5"]
};
var SpinnerInner = ({
  type = "dots",
  variant = "default",
  label
}) => {
  const [frame, setFrame] = React10.useState(0);
  const frames = spinners[type] || spinners.dots;
  React10.useEffect(() => {
    const speed = type === "earth" ? 200 : 100;
    const timer = setInterval(() => {
      setFrame((v) => (v + 1) % frames.length);
    }, speed);
    return () => clearInterval(timer);
  }, [frames, type]);
  return /* @__PURE__ */ jsxRuntime.jsxs(Text, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(Text, { variant: variant === "default" ? "primary" : variant, bold: true, children: frames[frame] }),
    label && /* @__PURE__ */ jsxRuntime.jsxs(Text, { variant: "muted", children: [
      " ",
      label
    ] })
  ] });
};
var Spinner = React10.memo(SpinnerInner);
Spinner.displayName = "Spinner";
var ProgressBar = ({
  value,
  width = 30,
  variant = "primary",
  label,
  showValue = true
}) => {
  const progress = Math.min(Math.max(value, 0), 100);
  const filledLength = Math.max(0, Math.floor(progress / 100 * width));
  const emptyLength = Math.max(0, width - filledLength);
  const filled = "\u2588".repeat(filledLength);
  const empty = "\u2591".repeat(emptyLength);
  return /* @__PURE__ */ jsxRuntime.jsxs(Box, { flexDirection: "column", width: "100%", children: [
    label && /* @__PURE__ */ jsxRuntime.jsx(Box, { marginBottom: 0, children: /* @__PURE__ */ jsxRuntime.jsx(Text, { dimColor: true, children: label }) }),
    /* @__PURE__ */ jsxRuntime.jsxs(Box, { flexDirection: "row", width: "100%", flexWrap: "nowrap", children: [
      /* @__PURE__ */ jsxRuntime.jsx(Text, { variant, children: filled }),
      /* @__PURE__ */ jsxRuntime.jsx(Text, { variant: "muted", children: empty }),
      showValue && /* @__PURE__ */ jsxRuntime.jsxs(Text, { children: [
        " ",
        Math.round(progress),
        "%"
      ] })
    ] })
  ] });
};
function clampViewport(focusIndex, viewportStart, visibleCount, optionCount) {
  let vp = viewportStart;
  if (focusIndex < vp) {
    vp = focusIndex;
  } else if (focusIndex >= vp + visibleCount) {
    vp = focusIndex - visibleCount + 1;
  }
  vp = Math.max(0, Math.min(vp, optionCount - visibleCount));
  return { focusIndex, viewportStart: vp };
}
function selectReducer(state, action) {
  switch (action.type) {
    case "move_up": {
      const next = state.focusIndex <= 0 ? action.optionCount - 1 : state.focusIndex - 1;
      return clampViewport(next, state.viewportStart, action.visibleCount, action.optionCount);
    }
    case "move_down": {
      const next = state.focusIndex >= action.optionCount - 1 ? 0 : state.focusIndex + 1;
      return clampViewport(next, state.viewportStart, action.visibleCount, action.optionCount);
    }
    case "page_up": {
      const next = Math.max(0, state.focusIndex - action.visibleCount);
      return clampViewport(next, next, action.visibleCount, state.focusIndex + 1);
    }
    case "page_down": {
      const next = Math.min(action.optionCount - 1, state.focusIndex + action.visibleCount);
      return clampViewport(next, state.viewportStart, action.visibleCount, action.optionCount);
    }
    case "go_first":
      return { focusIndex: 0, viewportStart: 0 };
    case "go_last": {
      const focus = action.optionCount - 1;
      return clampViewport(focus, state.viewportStart, action.visibleCount, action.optionCount);
    }
    case "reset":
      return clampViewport(0, 0, action.visibleCount, action.optionCount);
    default:
      return state;
  }
}
function Select({
  options,
  onSelect,
  onCancel,
  label,
  visibleCount = 8,
  isActive = true
}) {
  const { theme } = useCaret();
  const effectiveVisible = Math.min(visibleCount, options.length);
  const prevLenRef = React10.useRef(options.length);
  const [state, dispatch] = React10.useReducer(selectReducer, {
    focusIndex: 0,
    viewportStart: 0
  });
  React10.useEffect(() => {
    if (options.length !== prevLenRef.current) {
      prevLenRef.current = options.length;
      dispatch({ type: "reset", optionCount: options.length, visibleCount: effectiveVisible });
    }
  }, [options.length, effectiveVisible]);
  ink.useInput((input, key) => {
    if (!isActive) return;
    if (key.upArrow || input === "k") {
      if (options.every((o) => o.disabled)) return;
      dispatch({ type: "move_up", optionCount: options.length, visibleCount: effectiveVisible });
      return;
    }
    if (key.downArrow || input === "j") {
      if (options.every((o) => o.disabled)) return;
      dispatch({ type: "move_down", optionCount: options.length, visibleCount: effectiveVisible });
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
    if (key.ctrl && input === "u") {
      dispatch({ type: "page_up", visibleCount: effectiveVisible });
      return;
    }
    if (key.ctrl && input === "d") {
      dispatch({ type: "page_down", optionCount: options.length, visibleCount: effectiveVisible });
      return;
    }
  }, { isActive });
  const visibleOptions = options.slice(state.viewportStart, state.viewportStart + effectiveVisible);
  const hasMoreAbove = state.viewportStart > 0;
  const hasMoreBelow = state.viewportStart + effectiveVisible < options.length;
  return /* @__PURE__ */ jsxRuntime.jsxs(Box, { flexDirection: "column", children: [
    label && /* @__PURE__ */ jsxRuntime.jsx(Box, { marginBottom: 1, children: /* @__PURE__ */ jsxRuntime.jsx(Text, { bold: true, variant: "primary", children: label.toUpperCase() }) }),
    /* @__PURE__ */ jsxRuntime.jsxs(Box, { flexDirection: "column", borderStyle: "single", borderColor: theme.border, paddingX: 1, children: [
      hasMoreAbove && /* @__PURE__ */ jsxRuntime.jsx(Box, { justifyContent: "center", children: /* @__PURE__ */ jsxRuntime.jsxs(Text, { color: theme.muted, children: [
        "\u25B2 ",
        state.viewportStart,
        " more"
      ] }) }),
      visibleOptions.map((option, i) => {
        const absoluteIndex = state.viewportStart + i;
        const isFocused = absoluteIndex === state.focusIndex;
        const isDisabled = option.disabled ?? false;
        return /* @__PURE__ */ jsxRuntime.jsxs(Box, { gap: 1, flexDirection: "column", children: [
          /* @__PURE__ */ jsxRuntime.jsxs(Box, { gap: 1, children: [
            /* @__PURE__ */ jsxRuntime.jsx(Text, { color: isFocused ? theme.primary : theme.muted, children: isFocused ? ">" : " " }),
            /* @__PURE__ */ jsxRuntime.jsx(
              Text,
              {
                bold: isFocused,
                backgroundColor: isFocused ? theme.border : void 0,
                color: isDisabled ? theme.muted : isFocused ? theme.foreground : void 0,
                dimColor: isDisabled,
                strikethrough: isDisabled,
                children: ` ${option.label} `
              }
            )
          ] }),
          option.description && isFocused && /* @__PURE__ */ jsxRuntime.jsx(Box, { paddingLeft: 4, children: /* @__PURE__ */ jsxRuntime.jsx(Text, { color: theme.muted, children: option.description }) })
        ] }, String(option.value));
      }),
      hasMoreBelow && /* @__PURE__ */ jsxRuntime.jsx(Box, { justifyContent: "center", children: /* @__PURE__ */ jsxRuntime.jsxs(Text, { color: theme.muted, children: [
        "\u25BC ",
        options.length - state.viewportStart - effectiveVisible,
        " more"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(Box, { marginTop: 0, paddingX: 1, children: /* @__PURE__ */ jsxRuntime.jsxs(Text, { dimColor: true, children: [
      "\u2191\u2193/jk navigate \xB7 Enter select",
      onCancel ? " \xB7 Esc cancel" : ""
    ] }) })
  ] });
}
var FocusContext = React10.createContext(void 0);
var FocusProvider = ({ children }) => {
  const [focusedId, setFocusedId] = React10.useState(null);
  const focusedRef = React10.useRef(null);
  const requestFocus = React10.useCallback((id) => {
    focusedRef.current = id;
    setFocusedId(id);
  }, []);
  const releaseFocus = React10.useCallback((id) => {
    if (focusedRef.current === id) {
      focusedRef.current = null;
      setFocusedId(null);
    }
  }, []);
  const isFocused = React10.useCallback((id) => {
    return focusedRef.current === id;
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsx(FocusContext.Provider, { value: { focusedId, requestFocus, releaseFocus, isFocused }, children });
};
var useFocus = () => {
  const context = React10.useContext(FocusContext);
  if (!context) {
    throw new Error("useFocus must be used within a FocusProvider");
  }
  return context;
};
function ScrollableList({
  id = "scrollable-list",
  items,
  height,
  renderItem,
  onSelect,
  autoScroll = false
}) {
  const [selectedIndex, setSelectedIndex] = React10.useState(0);
  const [scrollOffset, setScrollOffset] = React10.useState(0);
  const { theme } = useCaret();
  const { isFocused } = useFocus();
  const focused = isFocused(id);
  React10.useEffect(() => {
    if (autoScroll && items.length > height) {
      setScrollOffset(items.length - height);
      setSelectedIndex(items.length - 1);
    } else if (items.length > 0) {
      setSelectedIndex((prev) => Math.min(prev, items.length - 1));
      setScrollOffset((prev) => Math.min(prev, Math.max(0, items.length - height)));
    } else {
      setSelectedIndex(0);
      setScrollOffset(0);
    }
  }, [items.length, autoScroll, height]);
  ink.useInput((input, key) => {
    if (!focused || items.length === 0) return;
    if (key.upArrow) {
      const nextIndex = selectedIndex <= 0 ? items.length - 1 : selectedIndex - 1;
      setSelectedIndex(nextIndex);
      if (nextIndex < scrollOffset) {
        setScrollOffset(nextIndex);
      }
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
  const scrollbarInfo = React10.useMemo(() => {
    if (items.length <= height) return null;
    const thumbSize = Math.max(1, Math.round(height / items.length * height));
    const thumbPos = Math.round(scrollOffset / (items.length - height) * (height - thumbSize));
    return { thumbSize, thumbPos };
  }, [items.length, height, scrollOffset]);
  return /* @__PURE__ */ jsxRuntime.jsxs(Box, { flexDirection: "row", width: "100%", children: [
    /* @__PURE__ */ jsxRuntime.jsx(Box, { flexDirection: "column", flexGrow: 1, children: visibleItems.map((item, i) => {
      const absoluteIndex = scrollOffset + i;
      const isSelected = selectedIndex === absoluteIndex && focused;
      const bgColor = isSelected ? theme.border : absoluteIndex % 2 === 0 ? "#121212" : "transparent";
      return /* @__PURE__ */ jsxRuntime.jsxs(
        Box,
        {
          paddingX: 1,
          backgroundColor: bgColor,
          width: "100%",
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(Box, { marginRight: 1, children: /* @__PURE__ */ jsxRuntime.jsx(Text, { color: isSelected ? theme.primary : theme.muted, children: isSelected ? ">" : " " }) }),
            /* @__PURE__ */ jsxRuntime.jsx(Box, { flexGrow: 1, children: renderItem(item, isSelected) })
          ]
        },
        absoluteIndex
      );
    }) }),
    scrollbarInfo && /* @__PURE__ */ jsxRuntime.jsx(Box, { flexDirection: "column", width: 1, marginLeft: 1, children: Array.from({ length: height }).map((_, i) => {
      const isThumb = i >= scrollbarInfo.thumbPos && i < scrollbarInfo.thumbPos + scrollbarInfo.thumbSize;
      return /* @__PURE__ */ jsxRuntime.jsx(Text, { color: isThumb ? theme.secondary : theme.muted, children: isThumb ? "\u2588" : "\u2502" }, i);
    }) })
  ] });
}
function flattenTree(nodes, expandedPaths, parentPath = "", depth = 0) {
  const result = [];
  for (const node of nodes) {
    const path = parentPath ? `${parentPath}/${node.name}` : node.name;
    const isDir = node.type === "directory";
    const hasChildren = isDir && (node.children?.length ?? 0) > 0;
    result.push({ node, depth, path, isDir, hasChildren });
    if (isDir && hasChildren && expandedPaths.has(path)) {
      result.push(...flattenTree(node.children, expandedPaths, path, depth + 1));
    }
  }
  return result;
}
function treeReducer(state, action) {
  switch (action.type) {
    case "up": {
      const next = state.focusIndex <= 0 ? action.count - 1 : state.focusIndex - 1;
      let vp = state.viewportStart;
      if (next < vp) vp = next;
      if (next === action.count - 1) vp = Math.max(0, action.count - action.visible);
      return { focusIndex: next, viewportStart: vp };
    }
    case "down": {
      const next = state.focusIndex >= action.count - 1 ? 0 : state.focusIndex + 1;
      let vp = state.viewportStart;
      if (next >= vp + action.visible) vp = next - action.visible + 1;
      if (next === 0) vp = 0;
      return { focusIndex: next, viewportStart: vp };
    }
    case "clamp": {
      const focus = Math.min(state.focusIndex, action.count - 1);
      let vp = state.viewportStart;
      if (focus < vp) vp = focus;
      if (focus >= vp + action.visible) vp = focus - action.visible + 1;
      vp = Math.max(0, vp);
      return { focusIndex: Math.max(0, focus), viewportStart: vp };
    }
  }
}
var FileTree = ({
  nodes,
  onSelect,
  isActive = true,
  visibleCount = 15
}) => {
  const { theme } = useCaret();
  const [expandedPaths, setExpandedPaths] = React10.useState(() => /* @__PURE__ */ new Set());
  const flatNodes = React10.useMemo(
    () => flattenTree(nodes, expandedPaths),
    [nodes, expandedPaths]
  );
  const effective = Math.min(visibleCount, flatNodes.length);
  const [state, dispatch] = React10.useReducer(treeReducer, {
    focusIndex: 0,
    viewportStart: 0
  });
  React10.useEffect(() => {
    dispatch({ type: "clamp", count: flatNodes.length, visible: effective });
  }, [flatNodes.length, effective]);
  const toggleExpand = (path) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };
  ink.useInput((input, key) => {
    if (!isActive || flatNodes.length === 0) return;
    if (key.upArrow || input === "k") {
      dispatch({ type: "up", count: flatNodes.length, visible: effective });
      return;
    }
    if (key.downArrow || input === "j") {
      dispatch({ type: "down", count: flatNodes.length, visible: effective });
      return;
    }
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
    if (key.leftArrow) {
      const focused = flatNodes[state.focusIndex];
      if (!focused) return;
      if (focused.isDir && expandedPaths.has(focused.path)) {
        toggleExpand(focused.path);
      }
      return;
    }
    if (input === " ") {
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
  return /* @__PURE__ */ jsxRuntime.jsxs(Box, { flexDirection: "column", children: [
    hasAbove && /* @__PURE__ */ jsxRuntime.jsxs(Text, { color: theme.muted, children: [
      "  \u25B2 ",
      state.viewportStart,
      " more"
    ] }),
    visible.map((flat, i) => {
      const absIndex = state.viewportStart + i;
      const isFocused = absIndex === state.focusIndex;
      const indent = "  ".repeat(flat.depth);
      const prefix = flat.isDir ? expandedPaths.has(flat.path) ? "\u25BC " : "\u25B6 " : "  ";
      return /* @__PURE__ */ jsxRuntime.jsxs(Box, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(Text, { color: isFocused ? theme.primary : theme.muted, children: isFocused ? ">" : " " }),
        /* @__PURE__ */ jsxRuntime.jsxs(Text, { color: isFocused ? theme.foreground : theme.muted, children: [
          indent,
          prefix
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(
          Text,
          {
            bold: isFocused,
            color: flat.isDir ? theme.secondary : isFocused ? theme.foreground : void 0,
            backgroundColor: isFocused ? theme.border : void 0,
            children: flat.node.name
          }
        )
      ] }, flat.path);
    }),
    hasBelow && /* @__PURE__ */ jsxRuntime.jsxs(Text, { color: theme.muted, children: [
      "  \u25BC ",
      flatNodes.length - state.viewportStart - effective,
      " more"
    ] }),
    flatNodes.length > 0 && /* @__PURE__ */ jsxRuntime.jsx(Box, { marginTop: 0, paddingX: 1, children: /* @__PURE__ */ jsxRuntime.jsx(Text, { dimColor: true, children: "\u2191\u2193 navigate \xB7 \u2190\u2192/Space expand \xB7 Enter select" }) })
  ] });
};
function DataTable({
  id = "data-table",
  columns,
  data,
  pageSize = 10
}) {
  const [currentPage, setCurrentPage] = React10.useState(0);
  const [sortKey, setSortKey] = React10.useState(null);
  const [sortOrder, setSortOrder] = React10.useState("asc");
  const { theme } = useCaret();
  const { isFocused } = useFocus();
  const focused = isFocused(id);
  const sortedData = React10.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder]);
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );
  ink.useInput((input, key) => {
    if (!focused) return;
    if (key.leftArrow) {
      setCurrentPage((prev) => Math.max(0, prev - 1));
    }
    if (key.rightArrow) {
      setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
    }
    if (input === "s") {
      const sortableCols = columns.filter((c) => c.sortable);
      if (sortableCols.length > 0) {
        const currentIndex = sortableCols.findIndex((c) => c.key === sortKey);
        const nextCol = sortableCols[(currentIndex + 1) % sortableCols.length];
        if (nextCol.key === sortKey) {
          setSortOrder((prev) => prev === "asc" ? "desc" : "asc");
        } else {
          setSortKey(nextCol.key);
          setSortOrder("asc");
        }
      }
    }
  });
  const padText = (text, width, align = "left") => {
    const str = String(text);
    if (str.length >= width) return str.slice(0, width);
    const diff = width - str.length;
    const spaces = " ".repeat(diff);
    return align === "left" ? str + spaces : spaces + str;
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(Box, { flexDirection: "column", width: "100%", children: [
    /* @__PURE__ */ jsxRuntime.jsx(Box, { paddingX: 1, marginBottom: 0, children: columns.map((col) => /* @__PURE__ */ jsxRuntime.jsx(Box, { width: col.width || 15, marginRight: 2, children: /* @__PURE__ */ jsxRuntime.jsxs(Text, { bold: true, color: sortKey === col.key ? theme.primary : theme.muted, children: [
      col.header.toUpperCase(),
      sortKey === col.key && (sortOrder === "asc" ? " \u25B2" : " \u25BC")
    ] }) }, String(col.key))) }),
    /* @__PURE__ */ jsxRuntime.jsx(Box, { width: "100%", height: 1, children: /* @__PURE__ */ jsxRuntime.jsx(Text, { color: theme.border, children: "\u2500".repeat((process.stdout.columns ?? 80) - 10) }) }),
    /* @__PURE__ */ jsxRuntime.jsx(Box, { flexDirection: "column", width: "100%", children: paginatedData.map((item, rowIndex) => {
      const isEvenRow = rowIndex % 2 === 0;
      const bgColor = isEvenRow ? theme.border : void 0;
      return /* @__PURE__ */ jsxRuntime.jsxs(Box, { paddingX: 1, backgroundColor: bgColor, width: "100%", children: [
        columns.map((col) => /* @__PURE__ */ jsxRuntime.jsx(Box, { width: col.width || 15, marginRight: 2, children: col.render ? /* @__PURE__ */ jsxRuntime.jsx(Box, { backgroundColor: bgColor, width: "100%", children: col.render(item[col.key], item) }) : /* @__PURE__ */ jsxRuntime.jsx(Text, { backgroundColor: bgColor, color: isEvenRow ? theme.foreground : theme.muted, children: padText(String(item[col.key]), col.width || 15, col.align) }) }, String(col.key))),
        /* @__PURE__ */ jsxRuntime.jsx(Box, { flexGrow: 1, backgroundColor: bgColor, children: /* @__PURE__ */ jsxRuntime.jsx(Text, { children: " " }) })
      ] }, rowIndex);
    }) }),
    /* @__PURE__ */ jsxRuntime.jsxs(Box, { marginTop: 1, paddingX: 1, justifyContent: "space-between", width: "100%", children: [
      /* @__PURE__ */ jsxRuntime.jsxs(Box, { gap: 1, children: [
        /* @__PURE__ */ jsxRuntime.jsxs(Text, { variant: "muted", children: [
          "Page ",
          currentPage + 1,
          " of ",
          totalPages
        ] }),
        focused && /* @__PURE__ */ jsxRuntime.jsx(Text, { color: theme.primary, children: "[Use \u2190/\u2192 to navigate \u2022 's' to sort]" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs(Text, { variant: "muted", children: [
        "Total items: ",
        data.length
      ] })
    ] })
  ] });
}
var CommandInput = ({
  id = "command-input",
  placeholder = "Type a command...",
  prefix = "\u03BB",
  suggestions = [],
  onSubmit,
  variant = "primary",
  type = "text"
}) => {
  const [value, setValue] = React10.useState("");
  const [cursorPosition, setCursorPosition] = React10.useState(0);
  const [history, setHistory] = React10.useState([]);
  const [historyIndex, setHistoryIndex] = React10.useState(-1);
  const [cursorVisible, setCursorVisible] = React10.useState(true);
  const [suggestionIndex, setSuggestionIndex] = React10.useState(-1);
  const { theme } = useCaret();
  const { isFocused, requestFocus } = useFocus();
  const focused = isFocused(id);
  React10.useEffect(() => {
    if (!isFocused(id)) {
      requestFocus(id);
    }
  }, []);
  React10.useEffect(() => {
    const timer = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(timer);
  }, []);
  const matchingSuggestions = React10.useMemo(() => {
    if (!value || suggestions.length === 0) return [];
    return suggestions.filter((s) => s.startsWith(value));
  }, [value, suggestions]);
  const ghostText = React10.useMemo(() => {
    if (matchingSuggestions.length === 0 || suggestionIndex === -1) {
      return matchingSuggestions[0]?.slice(value.length) || "";
    }
    return matchingSuggestions[suggestionIndex].slice(value.length);
  }, [value, matchingSuggestions, suggestionIndex]);
  ink.useInput((input, key) => {
    if (!focused) return;
    if (key.return) {
      if (value.trim()) {
        onSubmit(value);
        setHistory((prev) => [value, ...prev].slice(0, 50));
        setValue("");
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
        const val = newIndex === -1 ? "" : history[newIndex];
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
        const newValue2 = value.slice(0, cursorPosition - 1) + value.slice(cursorPosition);
        setValue(newValue2);
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
  const renderText = (str) => {
    if (type === "password") return "*".repeat(str.length);
    return str;
  };
  const renderContent = () => {
    if (value === "" && focused) {
      return /* @__PURE__ */ jsxRuntime.jsxs(Box, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(Text, { backgroundColor: cursorVisible ? theme.active : "transparent", color: "black", children: " " }),
        /* @__PURE__ */ jsxRuntime.jsx(Text, { variant: "muted", children: placeholder })
      ] });
    }
    if (!focused) return /* @__PURE__ */ jsxRuntime.jsx(Text, { variant: "muted", children: value === "" ? placeholder : renderText(value) });
    const beforeCursor = value.slice(0, cursorPosition);
    const atCursor = value[cursorPosition] || " ";
    const afterCursor = value.slice(cursorPosition + 1);
    return /* @__PURE__ */ jsxRuntime.jsxs(Box, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(Text, { children: renderText(beforeCursor) }),
      /* @__PURE__ */ jsxRuntime.jsx(Text, { backgroundColor: cursorVisible ? theme.active : "transparent", color: "black", children: type === "password" && atCursor !== " " ? "*" : atCursor }),
      /* @__PURE__ */ jsxRuntime.jsx(Text, { children: renderText(afterCursor) }),
      /* @__PURE__ */ jsxRuntime.jsx(Text, { color: theme.muted, children: ghostText })
    ] });
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(Box, { flexDirection: "column", width: "100%", children: [
    /* @__PURE__ */ jsxRuntime.jsx(Box, { width: "100%", height: 1, marginBottom: 0, children: /* @__PURE__ */ jsxRuntime.jsx(Text, { color: theme.border, children: "\u2500".repeat((process.stdout.columns ?? 80) - 8) }) }),
    /* @__PURE__ */ jsxRuntime.jsxs(Box, { paddingX: 1, gap: 1, children: [
      /* @__PURE__ */ jsxRuntime.jsx(Text, { bold: true, color: focused ? theme[variant] : theme.muted, children: prefix }),
      /* @__PURE__ */ jsxRuntime.jsx(Box, { flexGrow: 1, children: renderContent() })
    ] })
  ] });
};
var Separator = ({
  orientation = "horizontal",
  variant = "border"
}) => {
  const { theme } = useCaret();
  const color = variant === "border" ? theme.border : theme[variant];
  if (orientation === "vertical") {
    return /* @__PURE__ */ jsxRuntime.jsx(
      Box,
      {
        width: 1,
        height: "100%",
        borderStyle: "single",
        borderLeft: true,
        borderRight: false,
        borderTop: false,
        borderBottom: false,
        borderColor: color
      }
    );
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    Box,
    {
      width: "100%",
      height: 1,
      borderStyle: "single",
      borderTop: true,
      borderBottom: false,
      borderLeft: false,
      borderRight: false,
      borderColor: color
    }
  );
};
var Sparkline = ({
  values,
  width = 20,
  variant = "primary",
  label
}) => {
  const history = values.slice(-width);
  const bars = [" ", "\u2582", "\u2583", "\u2584", "\u2585", "\u2586", "\u2587", "\u2588"];
  const renderBar = (val) => {
    const clamped = Math.max(0, Math.min(100, val));
    const index = Math.min(Math.floor(clamped / 100 * bars.length), bars.length - 1);
    return bars[index];
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(Box, { flexDirection: "column", children: [
    label && /* @__PURE__ */ jsxRuntime.jsx(Text, { variant: "muted", children: label.toUpperCase() }),
    /* @__PURE__ */ jsxRuntime.jsxs(Box, { gap: 0, children: [
      history.map((v, i) => /* @__PURE__ */ jsxRuntime.jsx(Text, { variant, children: renderBar(v) }, i)),
      history.length < width && /* @__PURE__ */ jsxRuntime.jsx(Text, { variant: "muted", children: " ".repeat(width - history.length) })
    ] })
  ] });
};
var Overlay = ({ children, isOpen }) => {
  const { theme } = useCaret();
  if (!isOpen) return null;
  const width = 60;
  const height = 14;
  return /* @__PURE__ */ jsxRuntime.jsx(
    Box,
    {
      position: "absolute",
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      children: /* @__PURE__ */ jsxRuntime.jsxs(
        Box,
        {
          flexDirection: "column",
          backgroundColor: theme.background,
          borderStyle: "double",
          borderColor: theme.primary,
          paddingX: 0,
          paddingY: 0,
          width,
          height,
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(Box, { position: "absolute", flexDirection: "column", width: width - 2, height: height - 2, children: Array.from({ length: height - 2 }).map((_, i) => /* @__PURE__ */ jsxRuntime.jsx(Text, { backgroundColor: theme.background, children: " ".repeat(width - 2) }, i)) }),
            /* @__PURE__ */ jsxRuntime.jsx(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, width: "100%", height: "100%", children })
          ]
        }
      )
    }
  );
};
var Pane = ({
  children,
  title,
  width = "100%",
  height,
  showBorder = true
}) => {
  const { theme } = useCaret();
  return /* @__PURE__ */ jsxRuntime.jsxs(
    Box,
    {
      flexDirection: "column",
      width,
      height,
      borderStyle: showBorder ? "single" : void 0,
      borderColor: theme.border,
      paddingX: showBorder ? 1 : 0,
      children: [
        title && /* @__PURE__ */ jsxRuntime.jsx(Box, { marginTop: -1, paddingX: 1, backgroundColor: theme.background, children: /* @__PURE__ */ jsxRuntime.jsx(Text, { bold: true, color: theme.secondary, children: ` ${title.toUpperCase()} ` }) }),
        /* @__PURE__ */ jsxRuntime.jsx(Box, { flexDirection: "column", flexGrow: 1, width: "100%", children })
      ]
    }
  );
};
var Markdown = ({ children }) => {
  const { theme } = useCaret();
  const lines = children.split("\n");
  const renderTextWithLinks = (text) => {
    const parts = text.split(/(\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        return /* @__PURE__ */ jsxRuntime.jsx(Text, { color: theme.secondary, underline: true, children: linkMatch[1] }, i);
      }
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return boldParts.map((bp, bi) => {
        if (bp.startsWith("**") && bp.endsWith("**")) {
          return /* @__PURE__ */ jsxRuntime.jsx(Text, { bold: true, children: bp.replace(/\*\*/g, "") }, bi);
        }
        return /* @__PURE__ */ jsxRuntime.jsx(Text, { children: bp }, bi);
      });
    });
  };
  return /* @__PURE__ */ jsxRuntime.jsx(Box, { flexDirection: "column", children: lines.map((line, i) => {
    if (line.startsWith("# ")) {
      return /* @__PURE__ */ jsxRuntime.jsx(Box, { marginBottom: 1, children: /* @__PURE__ */ jsxRuntime.jsx(Text, { bold: true, color: theme.primary, underline: true, children: line.replace("# ", "").toUpperCase() }) }, i);
    }
    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line.split("|").filter((c) => c.trim() !== "");
      if (cells.every((c) => c.trim().startsWith("-"))) return null;
      return /* @__PURE__ */ jsxRuntime.jsx(Box, { gap: 2, children: cells.map((cell, ci) => /* @__PURE__ */ jsxRuntime.jsx(Box, { width: 15, children: /* @__PURE__ */ jsxRuntime.jsx(Text, { children: cell.trim() }) }, ci)) }, i);
    }
    if (line.startsWith("- ")) {
      return /* @__PURE__ */ jsxRuntime.jsxs(Box, { paddingLeft: 2, children: [
        /* @__PURE__ */ jsxRuntime.jsx(Text, { color: theme.primary, children: "\u25CF " }),
        /* @__PURE__ */ jsxRuntime.jsx(Box, { flexGrow: 1, children: /* @__PURE__ */ jsxRuntime.jsx(Text, { children: renderTextWithLinks(line.replace("- ", "")) }) })
      ] }, i);
    }
    if (line.startsWith("`") && line.endsWith("`")) {
      return /* @__PURE__ */ jsxRuntime.jsx(Box, { backgroundColor: theme.border, paddingX: 1, children: /* @__PURE__ */ jsxRuntime.jsx(Text, { color: theme.secondary, children: line.replace(/`/g, "") }) }, i);
    }
    return /* @__PURE__ */ jsxRuntime.jsx(Box, { children: /* @__PURE__ */ jsxRuntime.jsx(Text, { children: renderTextWithLinks(line) }) }, i);
  }) });
};
var StepWizard = ({ steps, onComplete, isActive = true }) => {
  const [currentStep, setCurrentStep] = React10.useState(0);
  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };
  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  ink.useInput((input, key) => {
    if (!isActive) return;
    const cmd = input.toLowerCase();
    if (cmd === "n") next();
    if (cmd === "p") prev();
    if (key.rightArrow) next();
    if (key.leftArrow) prev();
  }, { isActive });
  return /* @__PURE__ */ jsxRuntime.jsxs(Box, { flexDirection: "column", gap: 1, children: [
    /* @__PURE__ */ jsxRuntime.jsx(Box, { gap: 2, marginBottom: 1, children: steps.map((step, i) => /* @__PURE__ */ jsxRuntime.jsxs(Box, { gap: 1, children: [
      /* @__PURE__ */ jsxRuntime.jsx(Badge, { variant: i === currentStep ? "primary" : i < currentStep ? "success" : "secondary", children: `${i + 1}` }),
      /* @__PURE__ */ jsxRuntime.jsx(Text, { bold: i === currentStep, color: i === currentStep ? "white" : void 0, children: step.title }),
      i < steps.length - 1 && /* @__PURE__ */ jsxRuntime.jsx(Text, { variant: "muted", children: "\u2192" })
    ] }, i)) }),
    /* @__PURE__ */ jsxRuntime.jsx(Box, { borderStyle: "single", borderColor: "#262626", padding: 1, minHeight: 6, children: steps[currentStep].content }),
    /* @__PURE__ */ jsxRuntime.jsxs(Box, { gap: 2, marginTop: 1, children: [
      currentStep > 0 && /* @__PURE__ */ jsxRuntime.jsxs(Box, { gap: 1, children: [
        /* @__PURE__ */ jsxRuntime.jsx(Text, { bold: true, color: "white", children: "[P]" }),
        /* @__PURE__ */ jsxRuntime.jsx(Text, { variant: "muted", children: "Previous" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs(Box, { gap: 1, children: [
        /* @__PURE__ */ jsxRuntime.jsx(Text, { bold: true, color: "white", children: "[N]" }),
        /* @__PURE__ */ jsxRuntime.jsx(Text, { variant: "muted", children: currentStep === steps.length - 1 ? "Finish" : "Next" })
      ] })
    ] })
  ] });
};
var SearchModal = ({
  isOpen,
  onClose,
  onSelect,
  items,
  placeholder = "Search commands..."
}) => {
  const [query, setQuery] = React10.useState("");
  const [selectedIndex, setSelectedIndex] = React10.useState(0);
  const filteredItems = React10.useMemo(() => {
    return items.filter(
      (item) => item.label.toLowerCase().includes(query.toLowerCase()) || item.category?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
  }, [query, items]);
  React10__default.default.useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);
  ink.useInput((input, key) => {
    if (key.escape) {
      onClose();
      return;
    }
    if (key.upArrow) {
      setSelectedIndex((prev) => prev > 0 ? prev - 1 : filteredItems.length - 1);
      return;
    }
    if (key.downArrow) {
      setSelectedIndex((prev) => prev < filteredItems.length - 1 ? prev + 1 : 0);
      return;
    }
    if (key.return) {
      if (filteredItems[selectedIndex]) {
        onSelect(filteredItems[selectedIndex].value);
        onClose();
      }
      return;
    }
    if (key.backspace || key.delete) {
      setQuery((prev) => prev.slice(0, -1));
      setSelectedIndex(0);
      return;
    }
    if (!key.ctrl && !key.meta && input) {
      setQuery((prev) => prev + input);
      setSelectedIndex(0);
    }
  }, { isActive: isOpen });
  const width = 54;
  return /* @__PURE__ */ jsxRuntime.jsx(Overlay, { isOpen, children: /* @__PURE__ */ jsxRuntime.jsxs(Box, { flexDirection: "column", width, children: [
    /* @__PURE__ */ jsxRuntime.jsxs(Box, { gap: 1, marginBottom: 1, children: [
      /* @__PURE__ */ jsxRuntime.jsx(Text, { bold: true, color: "white", children: "SEARCH:" }),
      /* @__PURE__ */ jsxRuntime.jsx(Text, { color: "white", children: query }),
      query === "" && /* @__PURE__ */ jsxRuntime.jsx(Text, { color: "#404040", children: placeholder })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(Box, { width: "100%", height: 1, marginBottom: 1, children: /* @__PURE__ */ jsxRuntime.jsx(Text, { color: "#404040", children: "\u2500".repeat(width) }) }),
    /* @__PURE__ */ jsxRuntime.jsx(Box, { flexDirection: "column", children: filteredItems.map((item, i) => {
      const isSelected = i === selectedIndex;
      const label = item.label.slice(0, 30);
      const category = item.category ? ` [${item.category}]` : "";
      const fullText = `${isSelected ? "\u2192 " : "  "}${label}${category}`;
      const paddedText = fullText + " ".repeat(Math.max(0, width - fullText.length));
      return /* @__PURE__ */ jsxRuntime.jsx(Box, { width: "100%", children: /* @__PURE__ */ jsxRuntime.jsx(
        Text,
        {
          backgroundColor: isSelected ? "#ffffff" : "transparent",
          color: isSelected ? "#000000" : "#a3a3a3",
          bold: isSelected,
          children: paddedText
        }
      ) }, item.value);
    }) }),
    /* @__PURE__ */ jsxRuntime.jsx(Box, { marginTop: 1, justifyContent: "center", width: "100%", children: /* @__PURE__ */ jsxRuntime.jsx(Text, { color: "#404040", children: "\u2191\u2193 NAVIGATE \xB7 ENTER SELECT \xB7 ESC CLOSE" }) })
  ] }) });
};
var NotificationContext = React10.createContext(void 0);
var nextId = 0;
var NotificationProvider = ({ children }) => {
  const [visible, setVisible] = React10.useState([]);
  const [queue, setQueue] = React10.useState([]);
  const { theme } = useCaret();
  const timersRef = React10.useRef(/* @__PURE__ */ new Set());
  const MAX_VISIBLE = 3;
  React10.useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const t of timers) clearTimeout(t);
      timers.clear();
    };
  }, []);
  const notify = React10.useCallback((message, type = "info") => {
    const id = String(++nextId);
    const newNotif = { id, message, type };
    setQueue((prev) => [...prev, newNotif]);
  }, []);
  React10.useEffect(() => {
    if (visible.length < MAX_VISIBLE && queue.length > 0) {
      const next = queue[0];
      setQueue((prev) => prev.slice(1));
      setVisible((prev) => [...prev, next]);
      const timer = setTimeout(() => {
        setVisible((prev) => prev.filter((n) => n.id !== next.id));
        timersRef.current.delete(timer);
      }, 3e3);
      timersRef.current.add(timer);
    }
  }, [visible.length, queue]);
  const width = 35;
  return /* @__PURE__ */ jsxRuntime.jsxs(NotificationContext.Provider, { value: { notify }, children: [
    /* @__PURE__ */ jsxRuntime.jsx(Box, { flexDirection: "column", width: "100%", children }),
    /* @__PURE__ */ jsxRuntime.jsx(
      Box,
      {
        position: "absolute",
        flexDirection: "column",
        alignItems: "flex-end",
        width: "100%",
        paddingRight: 2,
        marginTop: 1,
        children: visible.map((n) => {
          const color = n.type === "info" ? "#ffffff" : n.type === "success" ? theme.success : n.type === "error" ? theme.error : theme.warning;
          const icon = n.type === "success" ? "\u2714" : n.type === "error" ? "\u2718" : "\u2139";
          const text = ` ${icon} ${n.message}`;
          const paddedText = text + " ".repeat(Math.max(0, width - text.length));
          return /* @__PURE__ */ jsxRuntime.jsx(Box, { marginTop: 1, borderStyle: "single", borderColor: color, padding: 0, children: /* @__PURE__ */ jsxRuntime.jsx(Text, { backgroundColor: theme.border, color, bold: true, children: paddedText }) }, n.id);
        })
      }
    )
  ] });
};
var useNotify = () => {
  const context = React10.useContext(NotificationContext);
  if (!context) throw new Error("useNotify must be used within a NotificationProvider");
  return context;
};
var useKeyboard = (options) => {
  const { isActive = true } = options;
  ink.useInput((input, key) => {
    if (!isActive) return;
    if (key.upArrow) options.onUp?.();
    if (key.downArrow) options.onDown?.();
    if (key.leftArrow) options.onLeft?.();
    if (key.rightArrow) options.onRight?.();
    if (key.return) options.onEnter?.();
    if (key.escape) options.onEscape?.();
    if (key.tab) options.onTab?.();
    if (key.ctrl && input === "u") options.onPageUp?.();
    if (key.ctrl && input === "d") options.onPageDown?.();
    if (input && !key.ctrl && !key.meta) options.onKey?.(input);
  }, { isActive });
};

Object.defineProperty(exports, "borderStyles", {
  enumerable: true,
  get: function () { return chunk6TXL7YKR_cjs.borderStyles; }
});
Object.defineProperty(exports, "colors", {
  enumerable: true,
  get: function () { return chunk6TXL7YKR_cjs.colors; }
});
Object.defineProperty(exports, "themes", {
  enumerable: true,
  get: function () { return chunk6TXL7YKR_cjs.themes; }
});
exports.Badge = Badge;
exports.Box = Box;
exports.Card = Card;
exports.CaretProvider = CaretProvider;
exports.CommandInput = CommandInput;
exports.DataTable = DataTable;
exports.FileTree = FileTree;
exports.FocusProvider = FocusProvider;
exports.Markdown = Markdown;
exports.NotificationProvider = NotificationProvider;
exports.Overlay = Overlay;
exports.Pane = Pane;
exports.ProgressBar = ProgressBar;
exports.ScrollableList = ScrollableList;
exports.SearchModal = SearchModal;
exports.Select = Select;
exports.Separator = Separator;
exports.Sparkline = Sparkline;
exports.Spinner = Spinner;
exports.StepWizard = StepWizard;
exports.Text = Text;
exports.useCaret = useCaret;
exports.useFocus = useFocus;
exports.useKeyboard = useKeyboard;
exports.useNotify = useNotify;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map