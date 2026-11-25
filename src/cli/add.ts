import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import { multiSelect } from './prompts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS = [
  'Badge', 'Box', 'Card', 'CommandInput', 'DataTable',
  'FileTree', 'Markdown', 'NotificationProvider', 'Overlay',
  'Pane', 'ProgressBar', 'ScrollableList', 'SearchModal',
  'Select', 'Separator', 'Sparkline', 'Spinner', 'StepWizard', 'Text',
];

function findPackageSourceDir(): string {
  // CLI is at <pkg>/dist/cli/index.js → package root is ../../
  const sourceDir = path.join(__dirname, '../../src/components/ui');
  if (!fs.existsSync(sourceDir)) {
    throw new Error(
      'Cannot find caret-tui source files. Make sure "src" is included in the package files.',
    );
  }
  return sourceDir;
}

function findProjectRoot(): string {
  let dir = process.cwd();
  while (true) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as { name?: string };
      if (pkg.name === 'caret-tui') {
        throw new Error(
          'You are inside the caret-tui package itself. Run this command from your own project.',
        );
      }
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error('No package.json found. Run this command from inside your project.');
    }
    dir = parent;
  }
}

/** Whether the project's package.json lists this package. */
function isInstalled(projectRoot: string, name: string): boolean {
  const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8')) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  return Boolean(pkg.dependencies?.[name] ?? pkg.devDependencies?.[name]);
}

/**
 * Rewrites all parent-relative imports (../something) to 'caret-tui'.
 * Local sibling imports (./Something) are kept as-is so the copied file
 * can reference other components that were also added.
 */
function rewriteImports(content: string): string {
  return content
    .replace(/from '(\.\.[^']+)'/g, "from 'caret-tui'")
    .replace(/from "(\.\.[^"]+)"/g, 'from "caret-tui"');
}

// Packages every caret-tui project already has.
const PROVIDED = new Set(['react', 'ink', 'caret-tui']);

/**
 * Returns the npm packages a copied file imports and that the project may
 * not have, like ink-behaviors. "pkg/sub" and "@scope/pkg/sub" give the
 * package name only.
 */
function findPackageDeps(content: string): string[] {
  const names: string[] = [];
  const re = /from ['"]([^'"./][^'"]*)['"]/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const parts = m[1].split('/');
    const name = m[1].startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
    if (!PROVIDED.has(name) && !name.startsWith('node:')) {
      names.push(name);
    }
  }
  return [...new Set(names)];
}

/** Returns component names referenced via local sibling imports (./Name.js). */
function findLocalDeps(content: string): string[] {
  const names: string[] = [];
  const re = /from '\.\/([A-Z][^'.]*?)(?:\.js)?'/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    names.push(m[1]);
  }
  return [...new Set(names)];
}

function copyComponent(
  name: string,
  sourceDir: string,
  targetDir: string,
  copied: Set<string>,
  packages: Set<string>,
): void {
  if (copied.has(name)) return;
  copied.add(name);

  const sourcePath = path.join(sourceDir, `${name}.tsx`);
  if (!fs.existsSync(sourcePath)) {
    console.log(chalk.yellow(`  ⚠ Component "${name}" not found in source, skipping.`));
    return;
  }

  const raw = fs.readFileSync(sourcePath, 'utf-8');
  const content = rewriteImports(raw);
  for (const dep of findPackageDeps(content)) {
    packages.add(dep);
  }

  fs.mkdirSync(targetDir, { recursive: true });
  const targetPath = path.join(targetDir, `${name}.tsx`);
  const existed = fs.existsSync(targetPath);
  fs.writeFileSync(targetPath, content, 'utf-8');

  const tag = existed ? chalk.yellow('updated') : chalk.green('added');
  console.log(`  ${chalk.green('✔')} ${chalk.white(name + '.tsx')} ${chalk.dim(`(${tag})`)}`);

  // Recursively copy sibling components this file depends on
  for (const dep of findLocalDeps(content)) {
    copyComponent(dep, sourceDir, targetDir, copied, packages);
  }
}

export async function add(componentArgs: string[]) {
  console.log('');
  console.log('  ' + chalk.bold.white('caret-tui') + chalk.dim(' add'));
  console.log('  ' + chalk.dim('Copy component source into your project') + '\n');

  // Normalise to PascalCase (badge → Badge)
  let toAdd = componentArgs.map((c) => c.charAt(0).toUpperCase() + c.slice(1));

  if (toAdd.length === 0) {
    toAdd = await multiSelect('Select components to add', COMPONENTS);
    if (toAdd.length === 0) {
      console.log(chalk.dim('  No components selected.\n'));
      return;
    }
    console.log('');
  } else {
    const invalid = toAdd.filter((c) => !COMPONENTS.includes(c));
    if (invalid.length > 0) {
      console.log(chalk.red(`  ✖ Unknown: ${invalid.join(', ')}`));
      console.log(chalk.dim(`  Available: ${COMPONENTS.join(', ')}\n`));
      process.exit(1);
    }
  }

  let sourceDir: string;
  try {
    sourceDir = findPackageSourceDir();
  } catch (e) {
    console.log(chalk.red(`  ✖ ${(e as Error).message}\n`));
    process.exit(1);
  }

  let projectRoot: string;
  try {
    projectRoot = findProjectRoot();
  } catch (e) {
    console.log(chalk.red(`  ✖ ${(e as Error).message}\n`));
    process.exit(1);
  }

  const targetDir = path.join(projectRoot, 'src', 'components', 'ui');
  console.log(`  Copying to ${chalk.cyan(path.relative(process.cwd(), targetDir) || targetDir)}...\n`);

  const copied = new Set<string>();
  const packages = new Set<string>();
  for (const name of toAdd) {
    copyComponent(name, sourceDir, targetDir, copied, packages);
  }

  console.log('');
  console.log(`  ${chalk.green('✔')} ${copied.size} file(s) added.`);
  console.log('');

  // The copied files may import packages the project does not list yet
  const missing = [...packages].filter((name) => !isInstalled(projectRoot, name));
  if (missing.length > 0) {
    console.log('  ' + chalk.yellow('These components also need:'));
    console.log(`    ${chalk.cyan(`npm install ${missing.join(' ')}`)}`);
    console.log('');
  }

  // Show usage hint
  const primary = toAdd[0];
  console.log('  ' + chalk.dim('Update your imports:'));
  console.log(
    `    ${chalk.dim(`import { ${primary} } from './components/ui/${primary}.js';`)}`,
  );
  console.log('');
}
