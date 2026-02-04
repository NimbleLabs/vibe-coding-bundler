#!/usr/bin/env node

/**
 * vibe-bundler CLI
 *
 * Browser-based JavaScript bundler using esbuild-wasm
 */

import { Command } from 'commander';
import { bundleCommand } from './commands/bundle';
import { watchCommand } from './commands/watch';

// Read version from package.json
// Note: This will be inlined by the bundler
const VERSION = '1.0.0';

const program = new Command();

program
  .name('vibe-bundler')
  .description('Browser-based JavaScript bundler using esbuild-wasm with import map support')
  .version(VERSION);

// Bundle command
program
  .command('bundle')
  .description('Bundle JavaScript/TypeScript files')
  .argument('[entry...]', 'Entry point files')
  .option('-c, --config <file>', 'Path to config file')
  .option('-o, --outdir <dir>', 'Output directory', 'dist')
  .option('-f, --format <format>', 'Output format (esm|iife|cjs)', 'esm')
  .option('-m, --minify', 'Minify output')
  .option('--sourcemap [type]', 'Generate sourcemaps (inline|external|linked)')
  .option('--import-map <file>', 'Path to import map JSON file')
  .option('--target <target>', 'Target environment (e.g., es2020, chrome90)')
  .option('--external <modules...>', 'External modules (won\'t be bundled)')
  .action(async (entries, options) => {
    await bundleCommand(entries, {
      config: options.config,
      outdir: options.outdir,
      format: options.format as 'esm' | 'iife' | 'cjs',
      minify: options.minify,
      sourcemap: parseSourcemap(options.sourcemap),
      importMap: options.importMap,
      target: options.target,
      external: options.external,
    });
  });

// Watch command
program
  .command('watch')
  .description('Watch files and rebuild on changes')
  .argument('[entry...]', 'Entry point files')
  .option('-c, --config <file>', 'Path to config file')
  .option('-o, --outdir <dir>', 'Output directory', 'dist')
  .option('-f, --format <format>', 'Output format (esm|iife|cjs)', 'esm')
  .option('--import-map <file>', 'Path to import map JSON file')
  .action(async (entries, options) => {
    await watchCommand(entries, {
      config: options.config,
      outdir: options.outdir,
      format: options.format as 'esm' | 'iife' | 'cjs',
      importMap: options.importMap,
    });
  });

// Build command (alias for bundle)
program
  .command('build')
  .description('Alias for bundle command')
  .argument('[entry...]', 'Entry point files')
  .option('-c, --config <file>', 'Path to config file')
  .option('-o, --outdir <dir>', 'Output directory', 'dist')
  .option('-f, --format <format>', 'Output format (esm|iife|cjs)', 'esm')
  .option('-m, --minify', 'Minify output')
  .option('--sourcemap [type]', 'Generate sourcemaps')
  .option('--import-map <file>', 'Path to import map JSON file')
  .action(async (entries, options) => {
    await bundleCommand(entries, {
      config: options.config,
      outdir: options.outdir,
      format: options.format as 'esm' | 'iife' | 'cjs',
      minify: options.minify,
      sourcemap: parseSourcemap(options.sourcemap),
      importMap: options.importMap,
    });
  });

// Parse the program
program.parse();

/**
 * Parses the sourcemap option
 */
function parseSourcemap(
  value: boolean | string | undefined
): boolean | 'inline' | 'external' | 'linked' | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === true || value === 'true') {
    return true;
  }
  if (value === 'inline' || value === 'external' || value === 'linked') {
    return value;
  }
  return true;
}
