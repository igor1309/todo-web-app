import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// ADD these imports for vitest config type reference
import type { UserConfig as VitestUserConfigInterface } from 'vitest/config';

// Create a type alias for the config including the test property
type ExtendedUserConfig = import('vite').UserConfig & {
  test: VitestUserConfigInterface['test'];
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add the 'test' configuration block
  test: {
    globals: true, // Use global APIs like describe, it, expect
    environment: 'jsdom', // Simulate DOM environment
    setupFiles: './src/setupTests.ts', // Run this file before tests
    css: false, // Optional: disable CSS processing if not needed for tests
  },
} as ExtendedUserConfig); // Cast the config object to the extended type