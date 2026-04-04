import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import { ColorTheme } from '../theme/colors.js';
import { BorderStyle } from '../theme/borders.js';
import { themes, ThemeName } from '../theme/themes.js';

interface CaretContextType {
  theme: ColorTheme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
}

const CaretContext = createContext<CaretContextType | undefined>(undefined);

export const CaretProvider: React.FC<{
  children: ReactNode;
  initialTheme?: ThemeName;
}> = ({ children, initialTheme = 'shadcn' }) => {
  const [themeName, setThemeName] = useState<ThemeName>(initialTheme);
  const theme = themes[themeName];

  const setTheme = useCallback((name: ThemeName) => {
    setThemeName(name);
  }, []);

  const value = useMemo(() => ({
    theme,
    themeName,
    setTheme,
  }), [theme, themeName, setTheme]);

  return (
    <CaretContext.Provider value={value}>
      {children}
    </CaretContext.Provider>
  );
};

export const useCaret = () => {
  const context = useContext(CaretContext);
  if (!context) {
    throw new Error('useCaret must be used within a CaretProvider');
  }
  return context;
};
