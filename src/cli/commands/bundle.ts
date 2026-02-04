/**
 * Bundle command implementation
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { existsSync } from 'node:fs';
import { glob } from 'glob';
import { createBundler, initialize } from '../../bundler';
import { loadConfig, loadImportMap } from '../config';
import type { VirtualFileSystem, ImportMapJson, BuildOptions, PluginMessage } from '../../types';

/**
 * CLI options for the bundle command
 */
export interface BundleCommandOptions {
  config?: string;
  outdir: string;
  format: 'esm' | 'iife' | 'cjs';
  minify?: boolean;
  sourcemap?: boolean | 'inline' | 'external' | 'linked';
  importMap?: string;
  target?: string;
  external?: string[];
}

/**
 * Executes the bundle command
 */
export async function bundleCommand(
  entries: string[],
  options: BundleCommandOptions
): Promise<void> {
  const startTime = Date.now();

  console.log('Building...\n');

  try {
    // Load config file if exists
    const config = await loadConfig(options.config);

    // Merge entries from CLI and config
    let entryPoints = entries;
    if (entryPoints.length === 0 && config?.entry) {
      entryPoints = Array.isArray(config.entry) ? config.entry : [config.entry];
    }

    if (entryPoints.length === 0) {
      console.error('Error: No entry points specified');
      console.error('Usage: vibe-bundler bundle <entry...> [options]');
      process.exit(1);
    }

    // Load import map
    const importMap = await resolveImportMapCLI(options.importMap, config?.importMap);

    // Build virtual file system from disk
    const cwd = process.cwd();
    const files = await buildVirtualFS(cwd, config?.include, config?.exclude);

    // Merge with config files if provided
    if (config?.files) {
      for (const [path, contents] of Object.entries(config.files)) {
        const normalizedPath = path.startsWith('/') ? path : '/' + path;
        files[normalizedPath] = contents;
      }
    }

    // Initialize esbuild
    await initialize({
      wasmURL: resolveWasmPath(),
    });

    // Create bundler with fetcher for Node
    const bundler = createBundler({
      ...config?.bundlerOptions,
      fetcher: createNodeFetcher(),
    });

    // Merge build options (CLI takes precedence over config)
    const buildOptions: BuildOptions = {
      ...config?.buildOptions,
      format: options.format ?? config?.buildOptions?.format,
      minify: options.minify ?? config?.buildOptions?.minify,
      sourcemap: options.sourcemap ?? config?.buildOptions?.sourcemap,
      target: options.target ?? config?.buildOptions?.target,
      external: options.external ?? config?.buildOptions?.external,
    };

    // Normalize entry points to virtual paths
    const virtualEntries = entryPoints.map((e) => {
      const absolutePath = resolve(cwd, e);
      return '/' + relative(cwd, absolutePath);
    });

    // Run bundle
    const result = await bundler.bundle(virtualEntries, files, importMap, buildOptions);

    // Handle errors
    if (result.errors.length > 0) {
      console.error('Build failed with errors:\n');
      for (const error of result.errors) {
        formatMessage(error, 'error');
      }
      process.exit(1);
    }

    // Output warnings
    if (result.warnings.length > 0) {
      console.warn('Warnings:\n');
      for (const warning of result.warnings) {
        formatMessage(warning, 'warning');
      }
      console.log('');
    }

    // Write output files
    const outdir = resolve(cwd, options.outdir);
    await mkdir(outdir, { recursive: true });

    const outputCount = Object.keys(result.outputFiles).length;
    console.log(`Output (${outputCount} file${outputCount !== 1 ? 's' : ''}):`);

    for (const [filename, contents] of Object.entries(result.outputFiles)) {
      const outPath = resolve(outdir, filename);
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, contents);
      console.log(`  ${relative(cwd, outPath)}`);
    }

    const elapsed = Date.now() - startTime;
    console.log(`\nDone in ${elapsed}ms`);

    bundler.dispose();
  } catch (error) {
    console.error('\nBuild failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

/**
 * Resolves import map from CLI option or config
 */
async function resolveImportMapCLI(
  cliPath?: string,
  configImportMap?: ImportMapJson | string
): Promise<ImportMapJson> {
  if (cliPath) {
    return loadImportMap(cliPath);
  }

  if (configImportMap) {
    if (typeof configImportMap === 'string') {
      return loadImportMap(configImportMap);
    }
    return configImportMap;
  }

  return { imports: {} };
}

/**
 * Builds a virtual file system from disk files
 */
async function buildVirtualFS(
  cwd: string,
  include?: string[],
  exclude?: string[]
): Promise<VirtualFileSystem> {
  const files: VirtualFileSystem = {};

  // Default patterns
  const patterns = include ?? ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.json', '**/*.css'];

  const defaultExclude = ['node_modules/**', 'dist/**', '*.config.*', '.git/**'];
  const excludePatterns = exclude ?? defaultExclude;

  // Find all matching files
  const matchedFiles = await glob(patterns, {
    cwd,
    ignore: excludePatterns,
    nodir: true,
  });

  // Read all files
  for (const file of matchedFiles) {
    const absolutePath = resolve(cwd, file);
    try {
      const contents = await readFile(absolutePath, 'utf-8');
      files['/' + file] = contents;
    } catch (error) {
      // Skip files that can't be read
      console.warn(`Warning: Could not read ${file}`);
    }
  }

  return files;
}

/**
 * Resolves the path to esbuild.wasm
 */
function resolveWasmPath(): string {
  const possiblePaths = [
    'node_modules/esbuild-wasm/esbuild.wasm',
    '../node_modules/esbuild-wasm/esbuild.wasm',
    '../../node_modules/esbuild-wasm/esbuild.wasm',
  ];

  for (const p of possiblePaths) {
    const absolute = resolve(process.cwd(), p);
    if (existsSync(absolute)) {
      return `file://${absolute}`;
    }
  }

  // Fall back to CDN
  return 'https://unpkg.com/esbuild-wasm@0.20.2/esbuild.wasm';
}

/**
 * Creates a fetcher function for Node.js
 */
function createNodeFetcher() {
  return async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const contents = await response.text();
    return { contents };
  };
}

/**
 * Formats and prints an error or warning message
 */
function formatMessage(message: PluginMessage, type: 'error' | 'warning'): void {
  const prefix = type === 'error' ? '\x1b[31m✖\x1b[0m' : '\x1b[33m⚠\x1b[0m';

  if (message.location) {
    const { file, line, column, lineText } = message.location;
    console.log(`${prefix} ${file}:${line}:${column}`);
    console.log(`  ${message.text}`);
    if (lineText) {
      console.log(`  ${lineText}`);
      if (column !== undefined) {
        console.log(`  ${' '.repeat(column)}^`);
      }
    }
  } else {
    console.log(`${prefix} ${message.text}`);
  }
}
