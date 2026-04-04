import React, { useState, useEffect } from 'react';
import { render, useInput } from 'ink';
import { CaretProvider, useCaret } from '../components/CaretProvider.js';
import { FocusProvider, useFocus } from '../components/FocusProvider.js';
import { Box } from '../components/ui/Box.js';
import { Text } from '../components/ui/Text.js';
import { CommandInput } from '../components/ui/CommandInput.js';
import { Badge } from '../components/ui/Badge.js';
import { ScrollableList } from '../components/ui/ScrollableList.js';
import { Pane } from '../components/ui/Pane.js';
import { FileTree, FileNode } from '../components/ui/FileTree.js';
import { SearchModal } from '../components/ui/SearchModal.js';
import { StepWizard } from '../components/ui/StepWizard.js';
import { Separator } from '../components/ui/Separator.js';
import { Markdown } from '../components/ui/Markdown.js';
import { NotificationProvider, useNotify } from '../components/ui/NotificationProvider.js';
import { useKeyboard } from '../hooks/useKeyboard.js';

// --- Mock Data ---
const TEAMS_DATA: FileNode[] = [
  { name: 'BDE Epitech', type: 'directory', children: [{ name: 'general', type: 'directory', children: [{ name: 'Welcome', type: 'file' }] }] },
  { name: 'Project X', type: 'directory', children: [{ name: 'dev', type: 'file' }] }
];

const INITIAL_MESSAGES = [
  { id: '1', user: 'System', text: 'Welcome to **My Teams** Bonus Interface.', time: '09:00' },
  { id: '2', user: 'phil', text: 'Interface is online.', time: '09:05' },
];

const USERS_LIST = [
  { name: 'phil', status: 'online' },
  { name: 'admin', status: 'online' },
  { name: 'bot', status: 'idle' },
];

// --- Sub-Views ---

const TeamsView = ({ messages, columns, rows }: { messages: any[], columns: number, rows: number }) => {
  const { theme } = useCaret();
  return (
    <Box flexDirection="row" flexGrow={1} gap={2}>
      <Pane title="Explorer" width={30}>
        <FileTree nodes={TEAMS_DATA} />
      </Pane>
      <Box flexDirection="column" flexGrow={1}>
        <Pane title="Chat: #general" height="100%">
          <ScrollableList 
            items={messages}
            height={rows - 16}
            autoScroll
            renderItem={(item) => (
              <Box gap={1}>
                <Text color={theme.muted}>[{item.time}]</Text>
                <Text bold color={item.user === 'phil' ? theme.primary : theme.secondary}>{item.user}:</Text>
                <Markdown>{item.text}</Markdown>
              </Box>
            )}
          />
        </Pane>
      </Box>
    </Box>
  );
};

const UsersView = () => {
  const { theme } = useCaret();
  return (
    <Box flexDirection="column" flexGrow={1}>
      <Pane title="Active Users">
        {USERS_LIST.map(u => (
          <Box key={u.name} gap={2} paddingY={0}>
            <Text color={u.status === 'online' ? theme.success : theme.warning}>●</Text>
            <Text bold>{u.name.toUpperCase()}</Text>
            <Text variant="muted">[{u.status}]</Text>
          </Box>
        ))}
      </Pane>
    </Box>
  );
};

// --- Main App ---

const MyTeamsApp = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [selectedTab, setSelectedTab] = useState(1);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [creationContext, setCreationContext] = useState<string | null>(null);
  const [columns, setColumns] = useState(process.stdout.columns || 100);
  const [rows, setRows] = useState(process.stdout.rows || 24);
  
  const { notify } = useNotify();
  const { theme } = useCaret();
  const { requestFocus, focusedId } = useFocus();

  useEffect(() => {
    const handleResize = () => { setColumns(process.stdout.columns); setRows(process.stdout.rows); };
    process.stdout.on('resize', handleResize);
    return () => { process.stdout.off('resize', handleResize); };
  }, []);

  const tabs = ['Worktree', 'Teams', 'Users', 'Settings'];

  useKeyboard({
    onTab: () => setSelectedTab((v) => (v + 1) % tabs.length),
  });

  useInput((input, key) => {
    if (key.ctrl && input === 'q') process.exit(0);
    if (key.ctrl && input === 'k' && !creationContext) setSearchOpen(true);
    if (input === '/') requestFocus('teams-input');
  });

  const handleSendMessage = (text: string) => {
    const time = new Date().toLocaleTimeString().slice(0, 5);
    setMessages(prev => [...prev, { id: String(Date.now()), user: 'phil', text, time }]);
    notify('Message sent', 'success');
  };

  const handleCreation = (name: string) => {
    notify(`${creationContext?.split(':')[1].toUpperCase()} "${name}" created!`, 'success');
    setCreationContext(null);
    setSearchOpen(false);
  };

  if (!isLoggedIn) {
    return (
      <Box flexDirection="column" width={60} alignSelf="center" marginTop={2}>
        <Box marginBottom={1} justifyContent="center" gap={1}>
          <Text bold color={theme.primary}>MY TEAMS </Text>
          <Text variant="muted">| EPITECH</Text>
        </Box>
        <StepWizard 
          steps={[
            { title: 'Connect', content: <Markdown>Link to **localhost:4242**</Markdown> },
            { title: 'Identity', content: <Markdown>Authenticated as **phil**</Markdown> },
            { title: 'Launch', content: <Text variant="success">Environment Ready.</Text> }
          ]}
          onComplete={() => { setLoggedIn(true); notify('Welcome', 'info'); }}
        />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" width={columns - 4} height={rows - 2} paddingX={2} paddingY={1}>
      
      {/* Header */}
      <Box justifyContent="space-between" width="100%" marginBottom={1} alignItems="center">
        <Box gap={1} alignItems="center">
          <Text bold color={theme.primary}>MY TEAMS</Text>
          <Text variant="muted">/</Text>
          <Badge variant="outline">STABLE</Badge>
        </Box>
        <Box gap={2} alignItems="center">
          <Text variant="muted">Logged as:</Text>
          <Badge variant="primary">phil</Badge>
        </Box>
      </Box>

      {/* Tabs */}
      <Box marginBottom={1} width="100%" gap={4}>
        {tabs.map((tab, i) => (
          <Box key={tab} flexDirection="column" alignItems="center">
            <Text bold={i === selectedTab} color={i === selectedTab ? 'white' : theme.muted}>
              {tab.toUpperCase()}
            </Text>
            <Box height={1}>
              {i === selectedTab && <Text color="white">{"─".repeat(tab.length)}</Text>}
            </Box>
          </Box>
        ))}
      </Box>

      <Separator />

      {/* Content */}
      <Box flexDirection="column" flexGrow={1} marginTop={1} minHeight={10}>
        {selectedTab === 1 ? (
          <TeamsView messages={messages} columns={columns} rows={rows} />
        ) : selectedTab === 2 ? (
          <UsersView />
        ) : (
          <Box flexGrow={1} justifyContent="center" alignItems="center">
            <Text variant="muted">View {tabs[selectedTab]} coming soon...</Text>
          </Box>
        )}
      </Box>

      {/* Input Section */}
      <Box flexDirection="column" marginTop={1}>
        <CommandInput 
          id="teams-input"
          onSubmit={handleSendMessage}
          placeholder="Type message or Ctrl+K for actions..."
        />
        <Box justifyContent="space-between" paddingX={1}>
          <Text variant="muted">/ : Focus · Ctrl+K : Actions · Ctrl+Q : Exit</Text>
          <Text variant="muted">AURA v1.0</Text>
        </Box>
      </Box>

      {/* Action Modal */}
      <SearchModal 
        isOpen={isSearchOpen && !creationContext}
        onClose={() => setSearchOpen(false)}
        onSelect={(val) => { if(val.startsWith('create:')) setCreationContext(val); else notify(val); }}
        items={[
          { label: 'Create Team', value: 'create:team', category: 'Action' },
          { label: 'Create Channel', value: 'create:channel', category: 'Action' },
          { label: 'Logout', value: 'logout', category: 'System' },
        ]}
      />

      {/* Creation Overlay (FIXED OPACITY) */}
      {creationContext && (
        <Box position="absolute" width="100%" height="100%" alignItems="center" justifyContent="center">
          <Box flexDirection="column" width={50} height={10} borderStyle="double" borderColor={theme.primary}>
             {/* Fond Opaque Brute Force */}
             <Box position="absolute" flexDirection="column" width={48} height={8}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Text key={i} backgroundColor={theme.background}>{' '.repeat(48)}</Text>
                ))}
             </Box>
             {/* Contenu */}
             <Box flexDirection="column" paddingX={2} paddingY={1} width="100%" height="100%">
                <Text bold>NAME FOR {creationContext.split(':')[1].toUpperCase()}:</Text>
                <Box marginTop={1} borderStyle="single" borderColor={theme.border} paddingX={1}>
                  <CommandInput id="modal-input" onSubmit={handleCreation} placeholder="Enter name..." />
                </Box>
                <Text variant="muted">ENTER to confirm · ESC to cancel</Text>
             </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const App = () => (
  <CaretProvider initialTheme="shadcn">
    <FocusProvider>
      <NotificationProvider>
        <MyTeamsApp />
      </NotificationProvider>
    </FocusProvider>
  </CaretProvider>
);

render(<App />);
