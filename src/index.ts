/**
 * vibe-coding-bundler
 *
 * Browser-based JavaScript bundler using esbuild-wasm with import map support.
 *
 * @example
 * ```ts
 * import { createBundler, initialize } from 'vibe-coding-bundler';
 *
 * // Initialize esbuild-wasm (optional, happens automatically on first bundle)
 * await initialize();
 *
 * // Create a bundler instance
 * const bundler = createBundler({
 *   fetcher: async (url) => {
 *     const response = await fetch(url);
 *     return { contents: await response.text() };
 *   }
 * });
 *
 * // Bundle your code
 * const result = await bundler.bundle(
 *   '/src/index.ts',
 *   {
 *     '/src/index.ts': `
 *       import React from 'react';
 *       console.log(React);
 *     `
 *   },
 *   {
 *     imports: {
 *       'react': 'https://esm.sh/react'
 *     }
 *   }
 * );
 *
 * console.log(result.outputFiles);
 * ```
 *
 * @packageDocumentation
 */

// ============================================
// CORE EXPORTS
// ============================================

export { createBundler, initialize, isEsbuildInitialized } from './bundler';

// ============================================
// TYPE EXPORTS
// ============================================

export type {
  // Bundler types
  Bundler,
  BundlerOptions,
  BuildOptions,
  BundleResult,
  InitOptions,
  Metafile,

  // File system types
  VirtualFileSystem,
  ResolvedFile,
  Loader,
  Format,
  Platform,

  // Import map types
  ImportMapJson,
  ParsedImportMap,

  // Plugin types
  Plugin,
  PluginBuild,
  OnResolveArgs,
  OnResolveResult,
  OnResolveCallback,
  OnLoadArgs,
  OnLoadResult,
  OnLoadCallback,
  ImportKind,
  PluginMessage,

  // Fetcher types
  Fetcher,
  FetchResult,
} from './types';

// ============================================
// UTILITY EXPORTS
// ============================================

// Import map utilities (for advanced users)
export {
  parseImportMap,
  resolveImportMap,
  isBareSpecifier,
  isRemoteURL,
  extractPackageName,
} from './importMap';

// Virtual file system utilities
export {
  VirtualFS,
  normalizePath,
  resolvePath,
  detectLoader,
  getDirectory,
  getExtension,
  getFilename,
  contentsToString,
  contentsToBytes,
} from './fs';

// Cache utilities
export { LRUCache, createCacheKey } from './cache';
export type { LRUCacheOptions } from './cache';

// Import map generation utilities
export {
  generateImportMap,
  generateCdnUrl,
  stripVersionRange,
} from './importMapGenerator';
export type { GenerateImportMapOptions, PackageJson } from './importMapGenerator';

// Plugin utilities
export {
  PluginOrchestrator,
  createVirtualModulePlugin,
  createAliasPlugin,
  createExternalPlugin,
} from './plugins';

// ============================================
// ERROR EXPORTS
// ============================================

export {
  VibeBundlerError,
  ImportMapError,
  ResolutionError,
  FileNotFoundError,
  InitializationError,
  PluginError,
  FetchError,
  formatError,
} from './errors';
