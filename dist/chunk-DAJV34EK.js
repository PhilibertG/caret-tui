// src/theme/themes.ts
var themes = {
  shadcn: {
    primary: "#ffffff",
    secondary: "#9ca3af",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    background: "#000000",
    foreground: "#fafafa",
    muted: "#4b5563",
    border: "#262626",
    active: "#ffffff",
    inactive: "#404040"
  },
  matrix: {
    primary: "#00ff41",
    secondary: "#008f11",
    success: "#00ff41",
    warning: "#d1ff00",
    error: "#ff0000",
    background: "#000000",
    foreground: "#00ff41",
    muted: "#003b00",
    border: "#008f11",
    active: "#00ff41",
    inactive: "#003b00"
  },
  dracula: {
    primary: "#bd93f9",
    // Purple
    secondary: "#8be9fd",
    // Cyan
    success: "#50fa7b",
    // Green
    warning: "#f1fa8c",
    // Yellow
    error: "#ff5555",
    // Red
    background: "#282a36",
    foreground: "#f8f8f2",
    muted: "#6272a4",
    border: "#44475a",
    active: "#bd93f9",
    inactive: "#44475a"
  },
  cyberpunk: {
    primary: "#f3e600",
    // Yellow
    secondary: "#00ff9f",
    // Neon Green
    success: "#00ff9f",
    warning: "#ff003c",
    // Red/Pink
    error: "#ff003c",
    background: "#000000",
    foreground: "#f3e600",
    muted: "#333300",
    border: "#f3e600",
    active: "#f3e600",
    inactive: "#333300"
  }
};
function getTheme(name) {
  return themes[name];
}

// src/theme/borders.ts
var borderStyles = {
  single: {
    topLeft: "\u250C",
    topRight: "\u2510",
    bottomLeft: "\u2514",
    bottomRight: "\u2518",
    top: "\u2500",
    bottom: "\u2500",
    left: "\u2502",
    right: "\u2502"
  },
  double: {
    topLeft: "\u2554",
    topRight: "\u2557",
    bottomLeft: "\u255A",
    bottomRight: "\u255D",
    top: "\u2550",
    bottom: "\u2550",
    left: "\u2551",
    right: "\u2551"
  },
  round: {
    topLeft: "\u256D",
    topRight: "\u256E",
    bottomLeft: "\u2570",
    bottomRight: "\u256F",
    top: "\u2500",
    bottom: "\u2500",
    left: "\u2502",
    right: "\u2502"
  },
  thick: {
    topLeft: "\u250F",
    topRight: "\u2513",
    bottomLeft: "\u2517",
    bottomRight: "\u251B",
    top: "\u2501",
    bottom: "\u2501",
    left: "\u2503",
    right: "\u2503"
  },
  bold: {
    topLeft: "\u259B",
    topRight: "\u259C",
    bottomLeft: "\u2599",
    bottomRight: "\u259F",
    top: "\u2580",
    bottom: "\u2584",
    left: "\u258C",
    right: "\u2590"
  }
};

// src/theme/colors.ts
var colors = {
  primary: "#ffffff",
  secondary: "#9ca3af",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  background: "#000000",
  foreground: "#fafafa",
  muted: "#4b5563",
  border: "#262626",
  active: "#ffffff",
  inactive: "#404040"
};

export { borderStyles, colors, getTheme, themes };
//# sourceMappingURL=chunk-DAJV34EK.js.map
//# sourceMappingURL=chunk-DAJV34EK.js.map