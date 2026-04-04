import React, { useState, useEffect, useMemo } from 'react';
import { render, useInput } from 'ink';
import { CaretProvider, useCaret } from '../components/CaretProvider.js';
import { FocusProvider, useFocus } from '../components/FocusProvider.js';
import { Box } from '../components/ui/Box.js';
import { Text } from '../components/ui/Text.js';
import { Spinner } from '../components/ui/Spinner.js';
import { ProgressBar } from '../components/ui/ProgressBar.js';
import { CommandInput } from '../components/ui/CommandInput.js';
import { Badge } from '../components/ui/Badge.js';
import { DataTable } from '../components/ui/DataTable.js';
import { Select } from '../components/ui/Select.js';
import { Markdown } from '../components/ui/Markdown.js';
import { SearchModal } from '../components/ui/SearchModal.js';
import { ScrollableList } from '../components/ui/ScrollableList.js';
import { Pane } from '../components/ui/Pane.js';
import { FileTree, FileNode } from '../components/ui/FileTree.js';
import { Sparkline } from '../components/ui/Sparkline.js';
import { StepWizard } from '../components/ui/StepWizard.js';
import { NotificationProvider, useNotify } from '../components/ui/NotificationProvider.js';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { ThemeName, themes } from '../theme/themes.js';

// --- Dummy Data ---
const DUMMY_PROCESSES = Array.from({ length: 25 }, (_, i) => ({
  pid: String(1000 + i),
  command: ['aura', 'node', 'db', 'system'][i % 4],
  cpu: `${(Math.random() * 5).toFixed(1)}%`,
  status: i % 5 === 0 ? 'idle' : 'running'
}));

const FILE_NODES: FileNode[] = [
  {
    name: 'src',
    type: 'directory',
    children: [
      { name: 'main.cpp', type: 'file' },
      { name: 'network', type: 'directory', children: [{ name: 'server.cpp', type: 'file' }] }
    ]
  },
  { name: 'README.md', type: 'file' }
];

// --- Views ---

const DashboardView = ({ progress, cpuHistory }: { progress: number; cpuHistory: number[] }) => {
  const { theme } = useCaret();
  return (
    <Box flexDirection="row" width="100%" gap={4}>
      <Box flexDirection="column" width="60%">
        <Box marginBottom={1} gap={2}><Text bold color={theme.primary}>LIVE PERFORMANCE</Text></Box>
        <Box flexDirection="column" gap={1}>
          <Box justifyContent="space-between" width="100%">
            <Text variant="muted">CPU LOAD</Text>
            <Sparkline values={cpuHistory} width={20} variant="secondary" />
          </Box>
          <ProgressBar value={progress} width={30} variant="secondary" />
        </Box>
      </Box>
      <Pane title="Stats" width="30%">
        <Box flexDirection="column" gap={1}>
          <Box gap={1}><Text variant="success">●</Text><Text>ONLINE</Text></Box>
          <Spinner type="moon" label="Syncing..." />
        </Box>
      </Pane>
    </Box>
  );
};

const AdminView = () => (
  <Box flexDirection="column" width="100%">
    <Box marginBottom={1}><Text bold>SYSTEM PROCESSES (Sortable & Paginated)</Text></Box>
    <DataTable 
      id="admin-table"
      data={DUMMY_PROCESSES}
      pageSize={6}
      columns={[
        { header: 'PID', key: 'pid', width: 8, sortable: true },
        { header: 'Command', key: 'command', width: 15, sortable: true },
        { header: 'CPU', key: 'cpu', width: 10, align: 'right' },
        { 
          header: 'Status', 
          key: 'status', 
          width: 12,
          render: (val) => <Badge variant={val === 'running' ? 'success' : 'secondary'}>{val as string}</Badge>
        },
      ]}
    />
  </Box>
);

const AppContent = () => {
  const [progress, setProgress] = useState(0);
  const [cpuHistory, setCpuHistory] = useState<number[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [columns, setColumns] = useState(process.stdout.columns || 80);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [messages, setMessages] = useState<{id: string, user: string, text: string, time: string}[]>([]);
  
  const { notify } = useNotify();
  const { themeName, setTheme, theme } = useCaret();
  const { requestFocus, focusedId } = useFocus();
  
  const tabs = ['Dashboard', 'Files', 'Admin', 'Chat'];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((v) => (v < 100 ? v + 1 : 0));
      setCpuHistory(prev => [...prev, Math.random() * 100].slice(-20));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // Simulate incoming messages for auto-scroll test
  useEffect(() => {
    const timer = setInterval(() => {
      setMessages(prev => [
        ...prev, 
        { id: String(prev.length), user: 'bot', text: `Automated pulse #${prev.length}`, time: new Date().toLocaleTimeString() }
      ].slice(-50));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useKeyboard({
    onTab: () => {
      // Cycle focus between components or tabs
      if (focusedId === 'command-input') {
        requestFocus('main-nav');
      } else {
        setSelectedTab((v) => (v + 1) % tabs.length);
      }
    },
    onEscape: () => {
      if (!isSearchOpen) process.exit(0);
    },
  });

  useInput((input, key) => {
    if (key.ctrl && input === 'k') setSearchOpen(true);
    if (input === '/') requestFocus('command-input');
  });

  const handleCommand = (cmd: string) => {
    const [action, arg] = cmd.toLowerCase().split(' ');
    if (action === 'theme' && arg in themes) {
      setTheme(arg as ThemeName);
      notify(`Theme: ${arg}`, 'success');
    } else if (cmd === 'login') {
      notify('Password mode active', 'info');
    } else {
      notify(`Action: ${cmd}`);
    }
  };

  return (
    <Box flexDirection="column" width={columns - 4} paddingX={2} paddingY={1}>
      
      {/* Header */}
      <Box justifyContent="space-between" width="100%" marginBottom={1}>
        <Box gap={1}>
          <Text bold color={theme.primary}>AURA</Text>
          <Text variant="muted">{themeName.toUpperCase()}</Text>
        </Box>
        <Box gap={2}>
          <Text variant="muted">Focus: {focusedId}</Text>
          <Badge variant="primary">INDUSTRIAL</Badge>
        </Box>
      </Box>

      {/* Tabs */}
      <Box marginBottom={1} width="100%" gap={4}>
        {tabs.map((tab, i) => (
          <Box key={tab} flexDirection="column" alignItems="center">
            <Text bold={i === selectedTab} color={i === selectedTab ? theme.active : theme.inactive}>
              {tab.toUpperCase()}
            </Text>
            <Box height={1}>
              {i === selectedTab && <Text color={theme.active}>{"─".repeat(tab.length)}</Text>}
            </Box>
          </Box>
        ))}
      </Box>

      <Box width="100%" height={1} marginBottom={1} marginTop={-1}>
        <Text color={theme.border}>{"─".repeat(columns - 8)}</Text>
      </Box>

      {/* Content */}
      <Box height={14} width="100%">
        {selectedTab === 0 && <DashboardView progress={progress} cpuHistory={cpuHistory} />}
        {selectedTab === 1 && (
          <Box flexDirection="row" gap={4}>
            <Pane title="Files" width="30%"><FileTree nodes={FILE_NODES} /></Pane>
            <Box flexGrow={1} borderStyle="single" borderColor={theme.border} padding={1}>
              <Markdown>{`# Industrial Aura\n- **Virtualization**: Enabled\n- **Focus**: Managed\n- **Sorting**: Active`}</Markdown>
            </Box>
          </Box>
        )}
        {selectedTab === 2 && <AdminView />}
        {selectedTab === 3 && (
          <Box flexDirection="column" width="100%">
            <ScrollableList 
              id="chat-list"
              items={messages}
              height={10}
              autoScroll
              renderItem={(item, isSelected) => (
                <Box gap={1}>
                  <Text color={theme.muted}>[{item.time}]</Text>
                  <Text bold color="primary">{item.user}:</Text>
                  <Text>{item.text}</Text>
                </Box>
              )}
            />
          </Box>
        )}
      </Box>

      {/* Command Input */}
      <Box marginTop={1} width="100%">
        <CommandInput 
          id="command-input"
          onSubmit={handleCommand} 
          suggestions={['theme matrix', 'theme dracula', 'login', 'reboot']}
          placeholder="Press '/' to focus input..." 
        />
      </Box>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setSearchOpen(false)}
        onSelect={handleCommand}
        items={[{ label: 'Matrix', value: 'theme matrix' }, { label: 'Dracula', value: 'theme dracula' }]}
      />
    </Box>
  );
};

const App = () => (
  <CaretProvider>
    <FocusProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </FocusProvider>
  </CaretProvider>
);

render(<App />);
