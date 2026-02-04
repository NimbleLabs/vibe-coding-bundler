/**
 * Watch command implementation
 * Watches files for changes and rebuilds automatically
 */

import { watch as fsWatch, type FSWatcher } from 'node:fs';
import { bundleCommand, type BundleCommandOptions } from './bundle';

/**
 * CLI options for the watch command
 */
export interface WatchCommandOptions {
  config?: string;
  outdir: string;
  format: 'esm' | 'iife' | 'cjs';
  importMap?: string;
}

/**
 * Executes the watch command
 */
export async function watchCommand(
  entries: string[],
  options: WatchCommandOptions
): Promise<void> {
  console.log('Starting watch mode...\n');

  // Initial build
  await runBuild(entries, options);

  // Debounce settings
  const DEBOUNCE_MS = 100;
  let rebuildTimeout: ReturnType<typeof setTimeout> | null = null;
  let isBuilding = false;

  /**
   * Triggers a rebuild with debouncing
   */
  const triggerRebuild = (filename: string) => {
    if (rebuildTimeout) {
      clearTimeout(rebuildTimeout);
    }

    rebuildTimeout = setTimeout(async () => {
      if (isBuilding) {
        return;
      }

      console.log(`\n\x1b[36mFile changed:\x1b[0m ${filename}`);
      console.log('Rebuilding...\n');

      isBuilding = true;
      await runBuild(entries, options);
      isBuilding = false;

      console.log('\nWatching for changes... (Ctrl+C to stop)');
    }, DEBOUNCE_MS);
  };

  // File extensions to watch
  const watchExtensions = new Set([
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.mjs',
    '.cjs',
    '.json',
    '.css',
  ]);

  // Patterns to ignore
  const ignorePatterns = [
    /node_modules/,
    /dist/,
    /\.config\./,
    /\.git/,
    /\.DS_Store/,
  ];

  /**
   * Checks if a file should be watched
   */
  const shouldWatch = (filename: string): boolean => {
    // Check ignore patterns
    for (const pattern of ignorePatterns) {
      if (pattern.test(filename)) {
        return false;
      }
    }

    // Check extension
    const ext = filename.substring(filename.lastIndexOf('.'));
    return watchExtensions.has(ext);
  };

  // Set up file watcher
  let watcher: FSWatcher | null = null;

  try {
    watcher = fsWatch(
      process.cwd(),
      { recursive: true },
      (_eventType, filename) => {
        if (!filename) return;

        if (shouldWatch(filename)) {
          triggerRebuild(filename);
        }
      }
    );

    watcher.on('error', (error) => {
      console.error('Watch error:', error);
    });
  } catch (error) {
    console.error('Failed to start file watcher:', error);
    console.log('Watch mode requires Node.js 18.11+ for recursive watching.');
    process.exit(1);
  }

  // Handle process termination
  const cleanup = () => {
    console.log('\n\nStopping watch mode...');
    if (rebuildTimeout) {
      clearTimeout(rebuildTimeout);
    }
    if (watcher) {
      watcher.close();
    }
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  console.log('Watching for changes... (Ctrl+C to stop)');

  // Keep the process running
  await new Promise(() => {});
}

/**
 * Runs a build, handling errors gracefully
 */
async function runBuild(entries: string[], options: WatchCommandOptions): Promise<void> {
  const buildOptions: BundleCommandOptions = {
    ...options,
    // In watch mode, always use inline sourcemaps for faster rebuilds
    sourcemap: 'inline',
    // Don't minify in watch mode for faster builds
    minify: false,
  };

  try {
    await bundleCommand(entries, buildOptions);
  } catch (error) {
    // Don't exit on error in watch mode
    console.error('\nBuild failed:', error instanceof Error ? error.message : String(error));
    console.log('\nFix the errors and save to trigger a rebuild.');
  }
}
