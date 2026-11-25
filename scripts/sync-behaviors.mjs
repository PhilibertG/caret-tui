// Keeps node_modules/ink-behaviors identical to ../ink-behaviors.
//
// caret-tui uses a copy of the folder next to it (see README). This script
// rebuilds ink-behaviors when its sources changed, then refreshes the copy
// when it differs. It runs before the tests (vitest global setup) and before
// `dev`, `build` and `typecheck`, so they never use an old copy.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, '..', 'ink-behaviors');
const copy = join(root, 'node_modules', 'ink-behaviors');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(cwd, ...args) {
  execFileSync(npm, args, { cwd, stdio: ['ignore', 'pipe', 'inherit'] });
}

/** Every file under a path, sorted. A missing path gives nothing. */
function filesUnder(path) {
  if (!existsSync(path)) {
    return [];
  }
  if (!statSync(path).isDirectory()) {
    return [path];
  }
  return readdirSync(path)
    .sort()
    .flatMap((name) => filesUnder(join(path, name)));
}

/** The files npm puts in the package: package.json and its `files` list. */
function publishedFiles(folder) {
  const manifest = join(folder, 'package.json');
  if (!existsSync(manifest)) {
    return [];
  }
  const { files = [] } = JSON.parse(readFileSync(manifest, 'utf8'));
  return [manifest, ...files.flatMap((entry) => filesUnder(join(folder, entry)))];
}

/** One hash for the names and contents of the published files. */
function fingerprint(folder) {
  const hash = createHash('sha256');
  for (const file of publishedFiles(folder)) {
    hash.update(relative(folder, file)).update('\0').update(readFileSync(file)).update('\0');
  }
  return hash.digest('hex');
}

const newest = (paths) =>
  Math.max(0, ...paths.flatMap(filesUnder).map((file) => statSync(file).mtimeMs));

export function syncBehaviors({ log = console.log } = {}) {
  if (!existsSync(join(source, 'package.json'))) {
    throw new Error(
      `ink-behaviors not found at ${source}. caret-tui needs that folder next to it (see README).`,
    );
  }
  if (!existsSync(join(source, 'node_modules'))) {
    log('[sync:behaviors] installing ink-behaviors dependencies');
    run(source, 'install', '--no-audit', '--no-fund');
  }

  const sources = ['src', 'package.json', 'tsup.config.ts', 'tsconfig.json'].map((name) =>
    join(source, name),
  );
  const built = newest([join(source, 'dist')]);
  if (built === 0 || newest(sources) > built) {
    log('[sync:behaviors] building ink-behaviors');
    run(source, 'run', 'build');
  }

  if (fingerprint(source) === fingerprint(copy)) {
    return false;
  }
  log('[sync:behaviors] refreshing node_modules/ink-behaviors');
  rmSync(copy, { recursive: true, force: true });
  run(root, 'install', '--no-audit', '--no-fund');
  if (fingerprint(source) !== fingerprint(copy)) {
    throw new Error('node_modules/ink-behaviors still differs from ../ink-behaviors after npm install.');
  }
  return true;
}

// Vitest global setup: runs once before the tests.
export default function setup() {
  syncBehaviors();
}

// `node scripts/sync-behaviors.mjs`
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const changed = syncBehaviors();
  if (!changed) {
    console.log('[sync:behaviors] node_modules/ink-behaviors is up to date');
  }
}
