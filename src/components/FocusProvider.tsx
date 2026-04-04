import React, { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';

interface FocusContextType {
  focusedId: string | null;
  requestFocus: (id: string) => void;
  releaseFocus: (id: string) => void;
  isFocused: (id: string) => boolean;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export const FocusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const focusedRef = useRef<string | null>(null);

  const requestFocus = useCallback((id: string) => {
    focusedRef.current = id;
    setFocusedId(id);
  }, []);

  const releaseFocus = useCallback((id: string) => {
    if (focusedRef.current === id) {
      focusedRef.current = null;
      setFocusedId(null);
    }
  }, []);

  // Stable reference — reads from ref so it doesn't need focusedId in deps
  const isFocused = useCallback((id: string) => {
    return focusedRef.current === id;
  }, []);

  return (
    <FocusContext.Provider value={{ focusedId, requestFocus, releaseFocus, isFocused }}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
};
