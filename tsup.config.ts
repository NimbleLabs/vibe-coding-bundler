import { defineConfig } from 'tsup';

export default defineConfig([
  // Browser ESM build
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: 'dist',
    platform: 'browser',
    target: 'es2020',
    external: ['esbuild-wasm'],
    esbuildOptions(options) {
      options.conditions = ['browser'];
    },
    outExtension: () => ({ js: '.browser.js' }),
  },
  // Node ESM build
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: false, // Already generated above
    sourcemap: true,
    outDir: 'dist',
    platform: 'node',
    target: 'node18',
    external: ['esbuild-wasm'],
    outExtension: () => ({ js: '.js' }),
  },
  // Node CJS build
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    dts: false,
    sourcemap: true,
    outDir: 'dist',
    platform: 'node',
    target: 'node18',
    external: ['esbuild-wasm'],
    outExtension: () => ({ js: '.cjs' }),
  },
  // CLI build (Node ESM only)
  {
    entry: ['src/cli/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    outDir: 'dist/cli',
    platform: 'node',
    target: 'node18',
    external: ['esbuild-wasm', 'commander', 'glob'],
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
]);
