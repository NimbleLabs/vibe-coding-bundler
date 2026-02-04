/**
 * CLI configuration loading utilities
 */

import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import type { BundlerOptions, BuildOptions, ImportMapJson } from '../types';

/**
 * Configuration file structure
 */
export interface VibeConfig {
  /** Entry point file(s) */
  entry?: string | string[];

  /** Output directory */
  outdir?: string;

  /** Import map (object or path to JSON file) */
  importMap?: ImportMapJson | string;

  /** Bundler instance options */
  bundlerOptions?: BundlerOptions;

  /** Build options */
  buildOptions?: BuildOptions;

  /** Additional files to include in the virtual file system */
  files?: Record<string, string>;

  /** File patterns to include (glob) */
  include?: string[];

  /** File patterns to exclude (glob) */
  exclude?: string[];
}

/**
 * Default configuration file names to search for
 */
const CONFIG_FILES = [
  'vibe-bundler.config.js',
  'vibe-bundler.config.mjs',
  'vibe-bundler.config.ts',
  'vibe.config.js',
  'vibe.config.mjs',
  'vibe.config.ts',
];

/**
 * Loads a configuration file
 *
 * @param configPath Path to config file (optional, will search for default names)
 * @returns Loaded configuration or null if not found
 */
export async function loadConfig(configPath?: string): Promise<VibeConfig | null> {
  const cwd = process.cwd();

  // If a specific path is given, try to load it
  if (configPath) {
    const absolutePath = resolve(cwd, configPath);

    if (!existsSync(absolutePath)) {
      return null;
    }

    return loadConfigFile(absolutePath);
  }

  // Search for default config files
  for (const filename of CONFIG_FILES) {
    const absolutePath = resolve(cwd, filename);

    if (existsSync(absolutePath)) {
      return loadConfigFile(absolutePath);
    }
  }

  return null;
}

/**
 * Loads a configuration file by path
 */
async function loadConfigFile(absolutePath: string): Promise<VibeConfig> {
  try {
    // For TypeScript files, we need to handle differently
    // In a real implementation, you might want to use tsx or ts-node
    if (absolutePath.endsWith('.ts')) {
      throw new Error(
        `TypeScript config files require tsx or ts-node. ` +
          `Please use a .js or .mjs config file, or install tsx.`
      );
    }

    // Use dynamic import for ESM/CJS compatibility
    const configURL = pathToFileURL(absolutePath).href;
    const module = await import(configURL);
    return module.default ?? module;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load config from ${absolutePath}: ${message}`);
  }
}

/**
 * Loads an import map from a JSON file
 *
 * @param importMapPath Path to the import map JSON file
 * @returns Parsed import map
 */
export async function loadImportMap(importMapPath: string): Promise<ImportMapJson> {
  const absolutePath = resolve(process.cwd(), importMapPath);

  if (!existsSync(absolutePath)) {
    throw new Error(`Import map not found: ${importMapPath}`);
  }

  const contents = await readFile(absolutePath, 'utf-8');

  try {
    return JSON.parse(contents);
  } catch (error) {
    throw new Error(
      `Invalid JSON in import map: ${importMapPath}\n` +
        (error instanceof Error ? error.message : String(error))
    );
  }
}

/**
 * Resolves the import map from config or CLI option
 *
 * @param cliImportMap Import map path from CLI
 * @param config Loaded configuration
 * @returns Resolved import map
 */
export async function resolveImportMap(
  cliImportMap?: string,
  config?: VibeConfig | null
): Promise<ImportMapJson> {
  // CLI takes precedence
  if (cliImportMap) {
    return loadImportMap(cliImportMap);
  }

  // Check config
  if (config?.importMap) {
    if (typeof config.importMap === 'string') {
      return loadImportMap(config.importMap);
    }
    return config.importMap;
  }

  // Default empty import map
  return { imports: {} };
}

/**
 * Merges CLI options with config file options
 * CLI options take precedence
 */
export function mergeOptions<T extends Record<string, unknown>>(
  cliOptions: Partial<T>,
  configOptions?: Partial<T>
): Partial<T> {
  if (!configOptions) {
    return cliOptions;
  }

  const merged = { ...configOptions };

  for (const [key, value] of Object.entries(cliOptions)) {
    if (value !== undefined) {
      (merged as Record<string, unknown>)[key] = value;
    }
  }

  return merged as Partial<T>;
}

/**
 * Gets the base directory for a config file
 */
export function getConfigDir(configPath?: string): string {
  if (configPath) {
    return dirname(resolve(process.cwd(), configPath));
  }
  return process.cwd();
}
