# Caret-TUI

A lightweight and elegant React UI Kit for modern terminals.

Caret-TUI provides a set of polished components to build beautiful and interactive Terminal User Interfaces (TUI) using React and Ink. It focuses on aesthetics, ease of use, and a consistent developer experience inspired by modern web component libraries.

## Features

- Collection of ready-to-use terminal components
- Flexible layout system with Box and Pane
- Built-in focus management system
- Integrated notification system
- Dark-mode and high-contrast friendly themes
- Type-safe components with TypeScript support

## Installation

Install Caret-TUI and its peer dependencies:

```bash
npm install caret-tui ink react
```

## Quick Start

Here is a basic example of how to use Caret-TUI in your terminal application.

```tsx
import React from 'react';
import { render } from 'ink';
import { CaretProvider, Box, Text, Card, Badge } from 'caret-tui';

const App = () => (
  <CaretProvider initialTheme="shadcn">
    <Box padding={2} flexDirection="column">
      <Card title="Hello Terminal" width={40}>
        <Box flexDirection="column" gap={1}>
          <Text>Welcome to the future of TUI development.</Text>
          <Box gap={1}>
            <Badge label="React" variant="success" />
            <Badge label="Ink" variant="primary" />
            <Badge label="Caret" variant="secondary" />
          </Box>
        </Box>
      </Card>
    </Box>
  </CaretProvider>
);

render(<App />);
```

## Core Components

Caret-TUI includes a comprehensive set of components for building complex terminal interfaces:

### Layout
- **Box**: The fundamental building block for layout, using Flexbox.
- **Pane**: A container with optional borders and padding.
- **Separator**: A horizontal or vertical line to divide content.
- **Overlay**: Layering system for modals and notifications.

### Data Display
- **Badge**: Small status indicators or tags.
- **Card**: Box with a border and optional title.
- **DataTable**: Tabular data display with column headers.
- **FileTree**: Hierarchical file and directory explorer.
- **Markdown**: Formatted text rendering for markdown content.
- **Sparkline**: Minimalist line chart for trend visualization.

### Feedback and Interaction
- **CommandInput**: Text input for terminal commands.
- **ProgressBar**: Visual progress indicator.
- **Select**: Interactive selection list for menus.
- **ScrollableList**: List component with vertical scrolling support.
- **Spinner**: Animated loading indicator.
- **StepWizard**: Multi-step process orchestration.
- **SearchModal**: Full-screen searchable list interface.

## Theming

Caret-TUI comes with several built-in themes to match your terminal's aesthetic. You can easily switch themes or provide your own.

Available themes:
- **shadcn**: Modern and clean black and white theme.
- **matrix**: Classic green on black terminal look.
- **dracula**: Popular purple-toned dark theme.
- **cyberpunk**: High-contrast neon yellow and green theme.

To use a theme, wrap your application in the `CaretProvider`:

```tsx
<CaretProvider initialTheme="dracula">
  <App />
</CaretProvider>
```

## Focus Management

Caret-TUI includes a `FocusProvider` to handle keyboard navigation between interactive components effortlessly.

```tsx
<FocusProvider>
  <CaretProvider>
    <App />
  </CaretProvider>
</FocusProvider>
```

## Development

If you want to contribute or run the demo locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the showcase: `npm run dev`
4. Build the project: `npm run build`
