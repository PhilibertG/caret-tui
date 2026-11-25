import * as readline from 'node:readline';
import chalk from 'chalk';

type KeyHandler = (ch: string | undefined, key: readline.Key) => void;

function isTTY(): boolean {
  return !!(process.stdin.isTTY && process.stdout.isTTY);
}

function cleanup(handler: KeyHandler) {
  process.stdin.removeListener('keypress', handler);
  if (process.stdin.isTTY) process.stdin.setRawMode(false);
  process.stdin.pause();
}

function renderOptions(options: string[], current: number) {
  for (let i = 0; i < options.length; i++) {
    const active = i === current;
    const prefix = active ? chalk.cyan('  ❯') : '   ';
    const label = active ? chalk.white(options[i]) : chalk.dim(options[i]);
    process.stdout.write(`${prefix} ${label}\n`);
  }
}

function renderMultiOptions(options: string[], cursor: number, checked: Set<number>) {
  for (let i = 0; i < options.length; i++) {
    const active = i === cursor;
    const isChecked = checked.has(i);
    const prefix = active ? chalk.cyan('  ❯') : '   ';
    const check = isChecked ? chalk.green('◼') : chalk.dim('◻');
    const label = active ? chalk.white(options[i]) : chalk.dim(options[i]);
    process.stdout.write(`${prefix} ${check} ${label}\n`);
  }
}

/** Simple text input prompt. */
export function ask(label: string, defaultValue = ''): Promise<string> {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) {
      try { process.stdin.setRawMode(false); } catch { /* already off */ }
    }
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const hint = defaultValue ? chalk.dim(` (${defaultValue})`) : '';
    rl.question(`  ${chalk.cyan('◆')} ${label}${hint}: `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

/** Arrow-key single select. Falls back to numbered list in non-TTY. */
export function select(label: string, options: string[], defaultIndex = 0): Promise<string> {
  console.log(`  ${chalk.cyan('◆')} ${label}`);

  if (!isTTY()) {
    return selectFallback(options, defaultIndex);
  }

  let current = defaultIndex;
  renderOptions(options, current);

  return new Promise((resolve) => {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.resume();
    process.stdin.setRawMode(true);

    const handler: KeyHandler = (_ch, key) => {
      if (!key) return;
      if (key.name === 'up' || key.name === 'k') {
        current = Math.max(0, current - 1);
        process.stdout.write(`\x1b[${options.length}A`);
        renderOptions(options, current);
      } else if (key.name === 'down' || key.name === 'j') {
        current = Math.min(options.length - 1, current + 1);
        process.stdout.write(`\x1b[${options.length}A`);
        renderOptions(options, current);
      } else if (key.name === 'return') {
        cleanup(handler);
        process.stdout.write('\n');
        resolve(options[current]);
      } else if (key.ctrl && key.name === 'c') {
        cleanup(handler);
        process.exit(0);
      }
    };

    process.stdin.on('keypress', handler);
  });
}

/** Arrow-key + space multi-select. Falls back in non-TTY (selects all). */
export function multiSelect(label: string, options: string[]): Promise<string[]> {
  console.log(`  ${chalk.cyan('◆')} ${label}`);
  console.log(chalk.dim(`  ${chalk.cyan('↑↓')} navigate  ${chalk.cyan('Space')} toggle  ${chalk.cyan('a')} all  ${chalk.cyan('Enter')} confirm\n`));

  if (!isTTY()) {
    renderMultiOptions(options, -1, new Set(options.map((_, i) => i)));
    return Promise.resolve([...options]);
  }

  let cursor = 0;
  const checked = new Set<number>();
  renderMultiOptions(options, cursor, checked);

  return new Promise((resolve) => {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.resume();
    process.stdin.setRawMode(true);

    const handler: KeyHandler = (_ch, key) => {
      if (!key) return;
      if (key.name === 'up' || key.name === 'k') {
        cursor = Math.max(0, cursor - 1);
        process.stdout.write(`\x1b[${options.length}A`);
        renderMultiOptions(options, cursor, checked);
      } else if (key.name === 'down' || key.name === 'j') {
        cursor = Math.min(options.length - 1, cursor + 1);
        process.stdout.write(`\x1b[${options.length}A`);
        renderMultiOptions(options, cursor, checked);
      } else if (key.name === 'space') {
        if (checked.has(cursor)) checked.delete(cursor);
        else checked.add(cursor);
        process.stdout.write(`\x1b[${options.length}A`);
        renderMultiOptions(options, cursor, checked);
      } else if (key.name === 'a') {
        if (checked.size === options.length) checked.clear();
        else options.forEach((_, i) => checked.add(i));
        process.stdout.write(`\x1b[${options.length}A`);
        renderMultiOptions(options, cursor, checked);
      } else if (key.name === 'return') {
        cleanup(handler);
        process.stdout.write('\n');
        resolve([...checked].map((i) => options[i]));
      } else if (key.ctrl && key.name === 'c') {
        cleanup(handler);
        process.exit(0);
      }
    };

    process.stdin.on('keypress', handler);
  });
}

function selectFallback(options: string[], defaultIndex: number): Promise<string> {
  renderOptions(options, defaultIndex);
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(chalk.dim(`\n  Choice [1-${options.length}] (default ${defaultIndex + 1}): `), (answer) => {
      rl.close();
      const idx = parseInt(answer.trim(), 10) - 1;
      resolve(!isNaN(idx) && idx >= 0 && idx < options.length ? options[idx] : options[defaultIndex]);
    });
  });
}
