import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Refreshes the local copy of ink-behaviors before any test runs.
    globalSetup: ['./scripts/sync-behaviors.mjs'],
  },
});
