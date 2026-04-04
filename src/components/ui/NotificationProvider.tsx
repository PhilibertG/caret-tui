import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { Box } from './Box.js';
import { Text } from './Text.js';
import { useCaret } from '../CaretProvider.js';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationContextType {
  notify: (message: string, type?: Notification['type']) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

let nextId = 0;

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState<Notification[]>([]);
  const [queue, setQueue] = useState<Notification[]>([]);
  const { theme } = useCaret();
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const MAX_VISIBLE = 3;

  // Cleanup timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const t of timers) clearTimeout(t);
      timers.clear();
    };
  }, []);

  const notify = useCallback((message: string, type: Notification['type'] = 'info') => {
    const id = String(++nextId);
    const newNotif = { id, message, type };
    setQueue(prev => [...prev, newNotif]);
  }, []);

  // Process queue
  useEffect(() => {
    if (visible.length < MAX_VISIBLE && queue.length > 0) {
      const next = queue[0];
      setQueue(prev => prev.slice(1));
      setVisible(prev => [...prev, next]);

      const timer = setTimeout(() => {
        setVisible(prev => prev.filter(n => n.id !== next.id));
        timersRef.current.delete(timer);
      }, 3000);
      timersRef.current.add(timer);
    }
  }, [visible.length, queue]);

  const width = 35;

  return (
    <NotificationContext.Provider value={{ notify }}>
      <Box flexDirection="column" width="100%">
        {children}
      </Box>
      
      <Box 
        position="absolute" 
        flexDirection="column" 
        alignItems="flex-end" 
        width="100%" 
        paddingRight={2}
        marginTop={1}
      >
        {visible.map((n) => {
          const color = n.type === 'info' ? '#ffffff' : (n.type === 'success' ? theme.success : (n.type === 'error' ? theme.error : theme.warning));
          const icon = n.type === 'success' ? '✔' : n.type === 'error' ? '✘' : 'ℹ';
          const text = ` ${icon} ${n.message}`;
          const paddedText = text + ' '.repeat(Math.max(0, width - text.length));

          return (
            <Box key={n.id} marginTop={1} borderStyle="single" borderColor={color as string} padding={0}>
              <Text backgroundColor={theme.border} color={color as string} bold>
                {paddedText}
              </Text>
            </Box>
          );
        })}
      </Box>
    </NotificationContext.Provider>
  );
};

export const useNotify = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotify must be used within a NotificationProvider');
  return context;
};
