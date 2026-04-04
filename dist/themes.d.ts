declare const borderStyles: {
    single: {
        topLeft: string;
        topRight: string;
        bottomLeft: string;
        bottomRight: string;
        top: string;
        bottom: string;
        left: string;
        right: string;
    };
    double: {
        topLeft: string;
        topRight: string;
        bottomLeft: string;
        bottomRight: string;
        top: string;
        bottom: string;
        left: string;
        right: string;
    };
    round: {
        topLeft: string;
        topRight: string;
        bottomLeft: string;
        bottomRight: string;
        top: string;
        bottom: string;
        left: string;
        right: string;
    };
    thick: {
        topLeft: string;
        topRight: string;
        bottomLeft: string;
        bottomRight: string;
        top: string;
        bottom: string;
        left: string;
        right: string;
    };
    bold: {
        topLeft: string;
        topRight: string;
        bottomLeft: string;
        bottomRight: string;
        top: string;
        bottom: string;
        left: string;
        right: string;
    };
};
type BorderStyle = keyof typeof borderStyles;

declare const colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
    active: string;
    inactive: string;
};
type ColorTheme = typeof colors;

declare const themes: {
    shadcn: {
        primary: string;
        secondary: string;
        success: string;
        warning: string;
        error: string;
        background: string;
        foreground: string;
        muted: string;
        border: string;
        active: string;
        inactive: string;
    };
    matrix: {
        primary: string;
        secondary: string;
        success: string;
        warning: string;
        error: string;
        background: string;
        foreground: string;
        muted: string;
        border: string;
        active: string;
        inactive: string;
    };
    dracula: {
        primary: string;
        secondary: string;
        success: string;
        warning: string;
        error: string;
        background: string;
        foreground: string;
        muted: string;
        border: string;
        active: string;
        inactive: string;
    };
    cyberpunk: {
        primary: string;
        secondary: string;
        success: string;
        warning: string;
        error: string;
        background: string;
        foreground: string;
        muted: string;
        border: string;
        active: string;
        inactive: string;
    };
};
type ThemeName = keyof typeof themes;
declare function getTheme(name: ThemeName): ColorTheme;

export { type BorderStyle, type ColorTheme, type ThemeName, borderStyles, colors, getTheme, themes };
