import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import { ask, select } from './prompts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getCaretTuiVersion(): string {
  try {
    const pkgPath = path.join(__dirname, '../../package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as { version: string };
    return `^${pkg.version}`;
  } catch {
    return 'latest';
  }
}

// ─── Templates ───────────────────────────────────────────────────────────────

function packageJsonTemplate(name: string, version: string): string {
  return JSON.stringify(
    {
      name,
      version: '0.1.0',
      type: 'module',
      scripts: {
        dev: 'tsx src/app.tsx',
        build: 'tsc --noEmit',
      },
      dependencies: {
        'caret-tui': version,
        ink: '^8.0.0',
        react: '^19.3.0',
      },
      engines: {
        node: '>=22',
      },
      devDependencies: {
        '@types/react': '^19.3.0',
        '@types/node': '^22.0.0',
        typescript: '^5.3.0',
        tsx: '^4.7.0',
      },
    },
    null,
    2,
  );
}

function tsconfigTemplate(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'bundler',
        jsx: 'react-jsx',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        types: ['node'],
      },
      include: ['src'],
    },
    null,
    2,
  );
}

function gitignoreTemplate(): string {
  return `node_modules/\ndist/\n.env\n`;
}

function appTemplate(projectName: string, theme: string): string {
  return `import React from 'react';
import { render } from 'ink';
import { CaretProvider, Box, Card, Text, Badge } from 'caret-tui';

function App() {
  return (
    <CaretProvider initialTheme="${theme}">
      <Box flexDirection="column" padding={1} gap={1}>
        <Card title="${projectName}">
          <Box flexDirection="column" gap={1}>
            <Text variant="primary">Your terminal app is ready!</Text>
            <Text variant="muted">Edit src/app.tsx to get started.</Text>
          </Box>
        </Card>
        <Box gap={2}>
          <Badge variant="success">Running</Badge>
          <Badge variant="primary">caret-tui</Badge>
        </Box>
      </Box>
    </CaretProvider>
  );
}

render(<App />);
`;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInstallCommand(pkgManager: string): string {
  switch (pkgManager) {
    case 'yarn': return 'yarn';
    case 'pnpm': return 'pnpm install';
    case 'bun':  return 'bun install';
    default:     return 'npm install';
  }
}

function getRunCommand(pkgManager: string): string {
  switch (pkgManager) {
    case 'yarn': return 'yarn dev';
    case 'pnpm': return 'pnpm dev';
    case 'bun':  return 'bun dev';
    default:     return 'npm run dev';
  }
}

function writeFile(dir: string, file: string, content: string) {
  fs.writeFileSync(path.join(dir, file), content, 'utf-8');
  console.log(`  ${chalk.green('✔')} ${chalk.dim(file)}`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

export async function init(nameArg?: string) {
  const version = getCaretTuiVersion();

  console.log('');
  console.log('  ' + chalk.bold.white('caret-tui') + chalk.dim(' init'));
  console.log('  ' + chalk.dim('Create a new terminal UI project') + '\n');

  const projectName = nameArg ?? (await ask('Project name', 'my-caret-app'));
  console.log('');

  const theme = await select('Theme', ['shadcn', 'matrix', 'dracula', 'cyberpunk'], 0);
  console.log('');

  const pkgManager = await select('Package manager', ['npm', 'yarn', 'pnpm', 'bun'], 0);
  console.log('');

  const projectDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectDir)) {
    console.log(chalk.red(`  ✖ Directory "${projectName}" already exists.\n`));
    process.exit(1);
  }

  console.log(`  Creating project in ${chalk.cyan(`./${projectName}`)}...\n`);

  fs.mkdirSync(path.join(projectDir, 'src'), { recursive: true });

  writeFile(projectDir, 'package.json', packageJsonTemplate(projectName, version));
  writeFile(projectDir, 'tsconfig.json', tsconfigTemplate());
  writeFile(projectDir, '.gitignore', gitignoreTemplate());
  writeFile(projectDir, 'src/app.tsx', appTemplate(projectName, theme));

  console.log('');
  console.log(`  Installing dependencies with ${chalk.cyan(pkgManager)}...\n`);

  try {
    execSync(getInstallCommand(pkgManager), { cwd: projectDir, stdio: 'inherit' });
  } catch {
    console.log(chalk.yellow('\n  ⚠ Installation failed. Run it manually inside the project folder.'));
  }

  console.log('');
  console.log(`  ${chalk.green('✔')} Done! Your project is ready.`);
  console.log('');
  console.log('  ' + chalk.dim('Next steps:'));
  console.log(`    ${chalk.cyan('cd')} ${projectName}`);
  console.log(`    ${chalk.cyan(getRunCommand(pkgManager))}`);
  console.log('');
  console.log('  ' + chalk.dim('Happy hacking! ♥'));
  console.log('');
}
