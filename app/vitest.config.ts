// Vitest's settings for the app's unit tests (`npm test`, after the contract
// gate). Kept apart from vite.config.ts so a test run loads none of the Spark
// or Tailwind build plugins; it only needs the `@/` alias the source uses.
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { alias: { '@': resolve(import.meta.dirname, 'src') } },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
