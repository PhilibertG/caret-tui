import { ColorTheme } from './colors.js';

export const themes = {
  shadcn: {
    primary: '#ffffff',
    secondary: '#9ca3af',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#000000',
    foreground: '#fafafa',
    muted: '#4b5563',
    border: '#262626',
    active: '#ffffff',
    inactive: '#404040',
  },
  matrix: {
    primary: '#00ff41',
    secondary: '#008f11',
    success: '#00ff41',
    warning: '#d1ff00',
    error: '#ff0000',
    background: '#000000',
    foreground: '#00ff41',
    muted: '#003b00',
    border: '#008f11',
    active: '#00ff41',
    inactive: '#003b00',
  },
  dracula: {
    primary: '#bd93f9', // Purple
    secondary: '#8be9fd', // Cyan
    success: '#50fa7b', // Green
    warning: '#f1fa8c', // Yellow
    error: '#ff5555', // Red
    background: '#282a36',
    foreground: '#f8f8f2',
    muted: '#6272a4',
    border: '#44475a',
    active: '#bd93f9',
    inactive: '#44475a',
  },
  cyberpunk: {
    primary: '#f3e600', // Yellow
    secondary: '#00ff9f', // Neon Green
    success: '#00ff9f',
    warning: '#ff003c', // Red/Pink
    error: '#ff003c',
    background: '#000000',
    foreground: '#f3e600',
    muted: '#333300',
    border: '#f3e600',
    active: '#f3e600',
    inactive: '#333300',
  }
};

export type ThemeName = keyof typeof themes;

// Runtime validation for dynamic theme access
export function getTheme(name: ThemeName): ColorTheme {
  return themes[name];
}
