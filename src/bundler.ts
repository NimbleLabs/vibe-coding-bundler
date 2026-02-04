/**
 * Core bundler implementation
 * Wraps esbuild-wasm and integrates import map resolution, virtual FS, and plugins
 */

import * as esbuild from 'esbuild-wasm';
import type {
  BundlerOptions,
  BuildOptions,
  BundleResult,
  VirtualFileSystem,
  ImportMapJson,
  ParsedImportMap,
  FetchResult,
  Loader,
  Bundler,
  InitOptions,
  PluginMessage,
  ImportKind,
} from './types';
import { parseImportMap, resolveImportMap, isBareSpecifier, isRemoteURL } from './importMap';
import { VirtualFS, normalizePath, resolvePath, detectLoader, getDirectory, contentsToString } from './fs';
import { LRUCache } from './cache';
import { PluginOrchestrator } from './plugins';
import {
  InitializationError,
  FileNotFoundError,
  createMissingImportMapError,
  createNoFetcherError,
} from './errors';

// ============================================
// INITIALIZATION
// ============================================

/** Promise for initialization (singleton) */
let initPromise: Promise<void> | null = null;

/** Whether esbuild has been initialized */
let isInitialized = false;

/** Default WASM URL from unpkg CDN */
const DEFAULT_WASM_URL = 'https://unpkg.com/esbuild-wasm@0.27.2/esbuild.wasm';

/**
 * Initialize esbuild-wasm
 * Safe to call multiple times - will only initialize once
 *
 * @param options Initialization options
 * @throws InitializationError if initialization fails
 */
export async function initialize(options: InitOptions = {}): Promise<void> {
  if (isInitialized) {
    return;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      const wasmURL = options.wasmURL ?? DEFAULT_WASM_URL;

      await esbuild.initialize({
        wasmURL,
        worker: typeof Worker !== 'undefined',
      });

      isInitialized = true;
    } catch (error) {
      // Reset promise so user can retry with different options
      initPromise = null;
      throw new InitializationError(
        `Failed to initialize esbuild-wasm: ${
          error instanceof Error ? error.message : String(error)
        }`,
        error instanceof Error ? error : undefined
      );
    }
  })();

  return initPromise;
}

/**
 * Check if esbuild-wasm has been initialized
 */
export function isEsbuildInitialized(): boolean {
  return isInitialized;
}

// ============================================
// BUNDLER FACTORY
// ============================================

/**
 * Creates a new bundler instance
 *
 * @param options Bundler configuration options
 * @returns Bundler instance
 *
 * @example
 * ```ts
 * const bundler = createBundler({
 *   fetcher: async (url) => {
 *     const res = await fetch(url);
 *     return { contents: await res.text() };
 *   }
 * });
 *
 * const result = await bundler.bundle(
 *   '/src/index.ts',
 *   { '/src/index.ts': 'console.log("hello")' },
 *   { imports: {} }
 * );
 * ```
 */
export function createBundler(options: BundlerOptions = {}): Bundler {
  return new BundlerInstance(options);
}

// ============================================
// BUNDLER IMPLEMENTATION
// ============================================

/**
 * Internal bundler instance implementation
 */
class BundlerInstance implements Bundler {
  private options: BundlerOptions;
  private cache: LRUCache<string, FetchResult>;
  private pluginOrchestrator: PluginOrchestrator;

  constructor(options: BundlerOptions) {
    this.options = options;
    this.cache = new LRUCache({
      maxSize: options.cache?.maxSize ?? 100,
      ttl: options.cache?.ttl,
    });
    this.pluginOrchestrator = new PluginOrchestrator();
  }

  /**
   * Bundle entry points with given files and import map
   */
  async bundle(
    entryPoints: string | string[],
    files: VirtualFileSystem,
    importMap: ImportMapJson,
    buildOptions: BuildOptions = {}
  ): Promise<BundleResult> {
    // Ensure esbuild is initialized
    await initialize();

    // Normalize entry points
    const entries = Array.isArray(entryPoints) ? entryPoints : [entryPoints];
    const normalizedEntries = entries.map((e) => normalizePath(e));

    // Create virtual FS
    const vfs = new VirtualFS(files);

    // Parse import map
    const baseURL = this.options.baseURL ?? 'file:///';
    const parsedImportMap = parseImportMap(importMap, baseURL);

    // Reset and register plugins
    this.pluginOrchestrator.clear();
    if (this.options.plugins) {
      for (const plugin of this.options.plugins) {
        await this.pluginOrchestrator.register(plugin);
      }
    }

    // Create the internal esbuild plugin
    const vibePlugin = this.createEsbuildPlugin(vfs, parsedImportMap, baseURL, buildOptions.loader);

    // Build esbuild options
    const esbuildOptions: esbuild.BuildOptions = {
      entryPoints: normalizedEntries,
      bundle: true,
      write: false,
      format: buildOptions.format ?? 'esm',
      platform: buildOptions.platform ?? 'browser',
      minify: buildOptions.minify ?? false,
      sourcemap: buildOptions.sourcemap ?? false,
      splitting: buildOptions.splitting ?? false,
      target: buildOptions.target ?? 'esnext',
      external: buildOptions.external,
      define: buildOptions.define,
      banner: buildOptions.banner,
      footer: buildOptions.footer,
      treeShaking: buildOptions.treeShaking ?? true,
      jsxFactory: buildOptions.jsxFactory,
      jsxFragment: buildOptions.jsxFragment,
      jsx: buildOptions.jsx,
      jsxImportSource: buildOptions.jsxImportSource,
      logLevel: buildOptions.logLevel ?? 'silent',
      metafile: buildOptions.metafile ?? true,
      loader: buildOptions.loader,
      plugins: [vibePlugin],
      // Required for splitting to work
      outdir: buildOptions.splitting ? 'out' : undefined,
    };

    // Run esbuild
    try {
      const result = await esbuild.build(esbuildOptions);

      // Convert output files to our format
      const outputFiles: Record<string, string> = {};
      for (const file of result.outputFiles ?? []) {
        // Extract just the filename from the path
        const filename = file.path.split('/').pop() || file.path;
        outputFiles[filename] = file.text;
      }

      return {
        outputFiles,
        metafile: result.metafile as BundleResult['metafile'],
        warnings: convertMessages(result.warnings),
        errors: [],
      };
    } catch (error) {
      // Handle esbuild build failures
      if (this.isBuildFailure(error)) {
        return {
          outputFiles: {},
          warnings: convertMessages(error.warnings),
          errors: convertMessages(error.errors),
        };
      }

      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Dispose of bundler resources
   */
  dispose(): void {
    this.cache.clear();
    this.pluginOrchestrator.clear();
  }

  /**
   * Creates the internal esbuild plugin that handles resolution and loading
   */
  private createEsbuildPlugin(
    vfs: VirtualFS,
    importMap: ParsedImportMap,
    baseURL: string,
    loaderMap?: Record<string, Loader>
  ): esbuild.Plugin {
    return {
      name: 'vibe-bundler',
      setup: (build) => {
        // ============================================
        // RESOLVE HOOK
        // ============================================
        build.onResolve({ filter: /.*/ }, async (args) => {
          const { path: specifier, importer, resolveDir, kind, namespace } = args;

          // Convert esbuild's kind to our ImportKind
          const importKind = kind as ImportKind;

          // 1. Run user plugins first
          const pluginResult = await this.pluginOrchestrator.runResolve({
            path: specifier,
            importer: importer || '',
            namespace: namespace || 'file',
            resolveDir: resolveDir || '',
            kind: importKind,
          });

          if (pluginResult) {
            return {
              path: pluginResult.path ?? specifier,
              namespace: pluginResult.namespace ?? 'file',
              external: pluginResult.external,
              pluginData: pluginResult.pluginData,
              sideEffects: pluginResult.sideEffects,
            };
          }

          // 2. Handle URLs (http:// or https://)
          if (isRemoteURL(specifier)) {
            return {
              path: specifier,
              namespace: 'url',
            };
          }

          // 2.5. Handle paths from remote URLs
          // When importer is a URL, resolve paths relative to that URL
          if (importer && isRemoteURL(importer)) {
            try {
              // Absolute path: /other-pkg -> https://origin/other-pkg
              if (specifier.startsWith('/')) {
                const importerUrl = new URL(importer);
                const resolvedUrl = `${importerUrl.origin}${specifier}`;
                return {
                  path: resolvedUrl,
                  namespace: 'url',
                };
              }

              // Relative path: ./foo or ../foo -> resolve relative to importer
              if (specifier.startsWith('./') || specifier.startsWith('../')) {
                const resolvedUrl = new URL(specifier, importer).href;
                return {
                  path: resolvedUrl,
                  namespace: 'url',
                };
              }
            } catch {
              // If URL parsing fails, fall through to other handlers
            }
          }

          // 3. Try import map for bare specifiers
          if (isBareSpecifier(specifier)) {
            const resolved = resolveImportMap(
              specifier,
              importer || baseURL,
              importMap
            );

            if (resolved) {
              // If resolved to URL, use url namespace
              if (isRemoteURL(resolved)) {
                return {
                  path: resolved,
                  namespace: 'url',
                };
              }

              // Check if it's a virtual file path
              const normalizedResolved = normalizePath(resolved.replace('file://', ''));
              if (vfs.exists(normalizedResolved)) {
                return {
                  path: normalizedResolved,
                  namespace: 'vfs',
                };
              }

              // Try with extensions
              const resolvedFile = vfs.resolveWithExtensions('/', normalizedResolved);
              if (resolvedFile) {
                return {
                  path: resolvedFile.path,
                  namespace: 'vfs',
                };
              }

              // Path from import map doesn't exist
              return {
                errors: [
                  {
                    text: `Import map resolved "${specifier}" to "${resolved}", but that file was not found in the virtual file system.`,
                  },
                ],
              };
            }

            // Bare specifier not in import map - error with helpful message
            const error = createMissingImportMapError(specifier, importer || '<entry>');
            return {
              errors: [{ text: error.message }],
            };
          }

          // 4. Handle relative imports
          const basePath = importer ? importer : '/';
          const file = vfs.resolveWithExtensions(basePath, specifier);

          if (file) {
            return {
              path: file.path,
              namespace: 'vfs',
            };
          }

          // File not found - provide helpful error
          const resolvedPath = resolvePath(basePath, specifier);
          return {
            errors: [
              {
                text: `Could not resolve "${specifier}"${importer ? ` from "${importer}"` : ''}. ` +
                  `The resolved path "${resolvedPath}" was not found in the virtual file system.\n\n` +
                  `Available files:\n${vfs.list().slice(0, 10).map(f => `  - ${f}`).join('\n')}` +
                  (vfs.list().length > 10 ? `\n  ... and ${vfs.list().length - 10} more` : ''),
              },
            ],
          };
        });

        // ============================================
        // LOAD FROM VIRTUAL FILE SYSTEM
        // ============================================
        build.onLoad({ filter: /.*/, namespace: 'vfs' }, async (args) => {
          // Run user plugins first
          const pluginResult = await this.pluginOrchestrator.runLoad({
            path: args.path,
            namespace: args.namespace,
            suffix: '',
            pluginData: args.pluginData,
          });

          if (pluginResult) {
            return {
              contents: pluginResult.contents,
              loader: pluginResult.loader,
              resolveDir: pluginResult.resolveDir ?? getDirectory(args.path),
            };
          }

          // Load from VFS
          try {
            const file = vfs.resolve(args.path);
            const contents = contentsToString(file.contents);

            // Determine the loader:
            // 1. Check for custom loader mapping (e.g., { '.js': 'jsx' })
            // 2. Detect if CSS file has been transformed to JS (e.g., CSS modules)
            // 3. Use the default loader from VFS
            let loader = file.loader;

            // Check for custom loader mapping based on file extension
            if (loaderMap) {
              const ext = args.path.substring(args.path.lastIndexOf('.'));
              if (ext && loaderMap[ext]) {
                loader = loaderMap[ext];
              }
            }

            // Detect if CSS file has been transformed to JS (e.g., CSS modules)
            // If the content starts with 'export', it's been transformed to JS
            if (loader === 'css' && contents.trimStart().startsWith('export')) {
              loader = 'js';
            }

            return {
              contents,
              loader,
              resolveDir: getDirectory(args.path),
            };
          } catch (error) {
            if (error instanceof FileNotFoundError) {
              return {
                errors: [
                  {
                    text: error.message,
                    location: { file: args.path },
                  },
                ],
              };
            }
            throw error;
          }
        });

        // ============================================
        // LOAD FROM URLs (using fetcher)
        // ============================================
        build.onLoad({ filter: /.*/, namespace: 'url' }, async (args) => {
          const url = args.path;

          // Check cache first
          let fetchResult = this.cache.get(url);

          if (!fetchResult) {
            if (!this.options.fetcher) {
              const error = createNoFetcherError(url);
              return {
                errors: [{ text: error.message }],
              };
            }

            try {
              fetchResult = await this.options.fetcher(url);
              this.cache.set(url, fetchResult);
            } catch (error) {
              return {
                errors: [
                  {
                    text: `Failed to fetch "${url}": ${
                      error instanceof Error ? error.message : String(error)
                    }`,
                    location: { file: url },
                  },
                ],
              };
            }
          }

          const contents = contentsToString(fetchResult.contents);

          // Determine resolveDir for relative imports within fetched module
          const resolveDir =
            fetchResult.resolveDir ?? url.substring(0, url.lastIndexOf('/') + 1);

          return {
            contents,
            loader: fetchResult.loader ?? detectLoaderFromURL(url),
            resolveDir,
          };
        });
      },
    };
  }

  /**
   * Type guard for esbuild build failures
   */
  private isBuildFailure(error: unknown): error is esbuild.BuildFailure {
    return (
      typeof error === 'object' &&
      error !== null &&
      'errors' in error &&
      'warnings' in error &&
      Array.isArray((error as esbuild.BuildFailure).errors)
    );
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Detects loader from URL extension
 */
function detectLoaderFromURL(url: string): Loader {
  try {
    const pathname = new URL(url).pathname;
    return detectLoader(pathname);
  } catch {
    return 'js';
  }
}

/**
 * Converts esbuild messages to our PluginMessage format
 */
function convertMessages(messages: esbuild.Message[]): PluginMessage[] {
  return messages.map((m) => ({
    text: m.text,
    location: m.location
      ? {
          file: m.location.file,
          line: m.location.line,
          column: m.location.column,
          length: m.location.length,
          lineText: m.location.lineText,
        }
      : undefined,
    detail: m.detail,
  }));
}
