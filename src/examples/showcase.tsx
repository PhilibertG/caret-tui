import React, { useState, useEffect } from 'react';
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
import { Separator } from '../components/ui/Separator.js';
import { NotificationProvider, useNotify } from '../components/ui/NotificationProvider.js';
import { useKeyboard } from '../hooks/useKeyboard.js';
import { ThemeName, themes } from '../theme/themes.js';

// --- Simulation Data ---
const SERVERS = [
  { id: 'srv-01', name: 'Frontend Edge', status: 'online', load: 45, region: 'EU-West' },
  { id: 'srv-02', name: 'Backend API', status: 'online', load: 82, region: 'US-East' },
  { id: 'srv-03', name: 'Database Master', status: 'online', load: 12, region: 'EU-Central' },
  { id: 'srv-04', name: 'Redis Cache', status: 'online', load: 24, region: 'US-West' },
  { id: 'srv-05', name: 'Auth Service', status: 'error', load: 0, region: 'Global' },
  { id: 'srv-06', name: 'Worker Queue', status: 'online', load: 67, region: 'EU-West' },
  { id: 'srv-07', name: 'Metrics DB', status: 'idle', load: 5, region: 'ASIA-East' },
];

const FILE_STRUCTURE: FileNode[] = [
  {
    name: 'infrastructure',
    type: 'directory',
    children: [
      { name: 'kubernetes.yaml', type: 'file' },
      { name: 'docker-compose.dev.yml', type: 'file' },
    ]
  },
  {
    name: 'services',
    type: 'directory',
    children: [
      { name: 'gateway.js', type: 'file' },
      { name: 'auth.ts', type: 'file' },
    ]
  },
  { name: 'package.json', type: 'file' },
  { name: 'SECURITY.md', type: 'file' }
];

// --- Sub-Views ---

const Sidebar = () => (
  <Pane title="Infrastructure" width={25}>
    <FileTree nodes={FILE_STRUCTURE} />
    <Box marginTop={1} flexDirection="column">
      <Text bold variant="muted">QUICK STATS</Text>
      <Box justifyContent="space-between">
        <Text>Uptime</Text>
        <Text variant="success">99.9%</Text>
      </Box>
      <Box justifyContent="space-between">
        <Text>Alerts</Text>
        <Text variant="error">1 Active</Text>
      </Box>
    </Box>
  </Pane>
);

const MainDashboard = ({ cpuHistory, progress }: { cpuHistory: number[], progress: number }) => {
  const { theme } = useCaret();
  return (
    <Box flexDirection="column" flexGrow={1} gap={1}>
      <Box flexDirection="row" gap={2}>
        <Pane title="Compute Engine" width="50%">
          <Box flexDirection="column" gap={1}>
            <Box justifyContent="space-between">
              <Text>Global Load</Text>
              <Sparkline values={cpuHistory} variant="primary" width={20} />
            </Box>
            <ProgressBar value={progress} variant="primary" />
          </Box>
        </Pane>
        <Pane title="Network Traffic" width="50%">
          <Box flexDirection="column" gap={1}>
            <Box justifyContent="space-between">
              <Text>Inbound</Text>
              <Text variant="success">1.2 Gbps</Text>
            </Box>
            <Sparkline values={[10, 20, 40, 30, 25, 60, 80, 40, 20, 10]} variant="success" width={25} />
          </Box>
        </Pane>
      </Box>

      <Pane title="Active Deployments" height={10}>
        <DataTable 
          id="showcase-table"
          data={SERVERS}
          pageSize={4}
          columns={[
            { header: 'ID', key: 'id', width: 8 },
            { header: 'Service Name', key: 'name', width: 20, sortable: true },
            { header: 'Region', key: 'region', width: 12 },
            { 
              header: 'Load', 
              key: 'load', 
              width: 10, 
              align: 'right',
              render: (val) => <Text color={val > 80 ? '#ef4444' : '#10b981'}>{val}%</Text>
            },
            { 
              header: 'Status', 
              key: 'status', 
              width: 12,
              render: (val) => (
                <Badge variant={val === 'online' ? 'success' : val === 'error' ? 'error' : 'secondary'}>
                  {val as string}
                </Badge>
              )
            },
          ]}
        />
      </Pane>
    </Box>
  );
};

const AppContent = () => {
  const [progress, setProgress] = useState(0);
  const [cpuHistory, setCpuHistory] = useState<number[]>([]);
  const [columns, setColumns] = useState(process.stdout.columns || 100);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const { theme, themeName, setTheme } = useCaret();
  const { notify } = useNotify();
  const { focusedId, requestFocus } = useFocus();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((v) => (v < 100 ? v + 1 : 0));
      setCpuHistory(prev => [...prev, Math.random() * 100].slice(-30));
    }, 300);
    return () => clearInterval(timer);
  }, []);

  useKeyboard({
    onEscape: () => { if (!isSearchOpen) process.exit(0); },
  });

  useInput((input, key) => {
    if (key.ctrl && input === 'k') setSearchOpen(true);
    if (input === '/') requestFocus('cmd-main');
    if (input === 't') requestFocus('showcase-table');
  });

  const handleAction = (cmd: string) => {
    const parts = cmd.toLowerCase().split(' ');
    if (parts[0] === 'theme' && parts[1]) {
      const t = parts[1] as ThemeName;
      if (themes[t]) { setTheme(t); notify(`Theme: ${t}`, 'success'); }
    } else {
      notify(`Executing: ${cmd}`, 'info');
    }
  };

  return (
    <Box flexDirection="column" width={columns - 4} paddingX={2} paddingY={1} height={24}>
      
      {/* Top Header */}
      <Box justifyContent="space-between" width="100%" marginBottom={1}>
        <Box gap={1}>
          <Text bold color={theme.primary}>AURA SHOWCASE</Text>
          <Text color={theme.border}>|</Text>
          <Text variant="muted">{themeName.toUpperCase()} MODE</Text>
        </Box>
        <Box gap={2}>
          <Spinner type="dots" variant="primary" />
          <Badge variant="outline">STABLE CONNECTION</Badge>
          <Text variant="muted">{new Date().toLocaleTimeString()}</Text>
        </Box>
      </Box>

      <Separator variant="primary" />

      {/* Main Layout Area */}
      <Box flexDirection="row" flexGrow={1} marginTop={1} gap={2}>
        <Sidebar />
        <MainDashboard cpuHistory={cpuHistory} progress={progress} />
      </Box>

      {/* Interactive Command Area */}
      <Box marginTop={1} flexDirection="column">
        <Box paddingX={1} marginBottom={0}>
          <Text dimColor>FOCUS: {focusedId || 'none'} · PRESS '/' TO COMMAND · 'T' FOR TABLE · CTRL+K FOR QUICK SEARCH</Text>
        </Box>
        <CommandInput 
          id="cmd-main"
          onSubmit={handleAction}
          suggestions={['theme dracula', 'theme matrix', 'theme cyberpunk', 'theme shadcn', 'reboot', 'status']}
          placeholder="System command..."
        />
      </Box>

      {/* Modals & Overlays */}
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={handleAction}
        items={[
          { label: 'Switch to Matrix Theme', value: 'theme matrix', category: 'UI' },
          { label: 'Switch to Dracula Theme', value: 'theme dracula', category: 'UI' },
          { label: 'System Reboot', value: 'reboot', category: 'System' },
          { label: 'Flush Cache', value: 'flush', category: 'System' },
        ]}
      />
    </Box>
  );
};

const App = () => (
  <CaretProvider initialTheme="cyberpunk">
    <FocusProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </FocusProvider>
  </CaretProvider>
);

render(<App />);
