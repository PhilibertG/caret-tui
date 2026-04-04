export const borderStyles = {
  single: {
    topLeft: '┌',
    topRight: '┐',
    bottomLeft: '└',
    bottomRight: '┘',
    top: '─',
    bottom: '─',
    left: '│',
    right: '│',
  },
  double: {
    topLeft: '╔',
    topRight: '╗',
    bottomLeft: '╚',
    bottomRight: '╝',
    top: '═',
    bottom: '═',
    left: '║',
    right: '║',
  },
  round: {
    topLeft: '╭',
    topRight: '╮',
    bottomLeft: '╰',
    bottomRight: '╯',
    top: '─',
    bottom: '─',
    left: '│',
    right: '│',
  },
  thick: {
    topLeft: '┏',
    topRight: '┓',
    bottomLeft: '┗',
    bottomRight: '┛',
    top: '━',
    bottom: '━',
    left: '┃',
    right: '┃',
  },
  bold: {
    topLeft: '▛',
    topRight: '▜',
    bottomLeft: '▙',
    bottomRight: '▟',
    top: '▀',
    bottom: '▄',
    left: '▌',
    right: '▐',
  }
};

export type BorderStyle = keyof typeof borderStyles;
