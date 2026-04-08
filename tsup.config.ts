import { defineConfig } from 'tsup';

export default defineConfig([
  {
    // Library
    entry: {
      index: 'src/index.ts',
      themes: 'src/themes.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    splitting: true,
    clean: true,
    external: ['react', 'ink'],
    treeshake: true,
    sourcemap: true,
  },
  {
    // CLI
    entry: {
      'cli/index': 'src/cli/index.ts',
    },
    format: ['esm'],
    dts: false,
    splitting: false,
    clean: false,
    platform: 'node',
    banner: {
      js: '#!/usr/bin/env node',
    },
    external: ['react', 'ink'],
    treeshake: true,
  },
]);
