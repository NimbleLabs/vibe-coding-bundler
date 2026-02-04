/**
 * vibe-coding-bundler type definitions
 */

// ============================================
// LOADER AND FORMAT TYPES
// ============================================

/**
 * Supported esbuild loaders for different file types
 */
export type Loader =
  | 'js'
  | 'jsx'
  | 'ts'
  | 'tsx'
  | 'css'
  | 'json'
  | 'text'
  | 'binary'
  | 'base64'
  | 'dataurl'
  | 'file'
  | 'copy';

/**
 * Output format for bundled code
 */
export type Format = 'esm' | 'iife' | 'cjs';

/**
 * Target platform for the bundle
 */
export type Platform = 'browser' | 'node' | 'neutral';

/**
 * Import kind indicating how a module was imported
 */
export type ImportKind =
  | 'entry-point'
  | 'import-statement'
  | 'require-call'
  | 'dynamic-import'
  | 'require-resolve'
  | 'import-rule'
  | 'url-token';

// ============================================
// VIRTUAL FILE SYSTEM
// ============================================

/**
 * In-memory file system representation
 * Keys are file paths, values are file contents (string for text, Uint8Array for binary)
 */
export interface VirtualFileSystem {
  [path: string]: string | Uint8Array;
}

/**
 * A resolved file with contents, loader, and path information
 */
export interface ResolvedFile {
  contents: string | Uint8Array;
  loader: Loader;
  path: string;
}

// ============================================
// IMPORT MAP
// ============================================

/**
 * Standard import map JSON structure
 * @see https://github.com/WICG/import-maps
 */
export interface ImportMapJson {
  /**
   * Top-level import mappings
   * Maps bare specifiers to URLs or paths
   */
  imports?: Record<string, string>;

  /**
   * Scoped import mappings
   * Keys are URL prefixes, values are import mappings that apply when importing from that scope
   */
  scopes?: Record<string, Record<string, string>>;
}

/**
 * Parsed and normalized import map ready for resolution
 */
export interface ParsedImportMap {
  imports: Map<string, string>;
  scopes: Map<string, Map<string, string>>;
}

// ============================================
// PLUGIN SYSTEM
// ============================================

/**
 * Arguments passed to onResolve callbacks
 */
export interface OnResolveArgs {
  /** The import path being resolved */
  path: string;
  /** The file that contains this import */
  importer: string;
  /** The namespace of the importer */
  namespace: string;
  /** Directory to use for resolving relative paths */
  resolveDir: string;
  /** How the module was imported */
  kind: ImportKind;
  /** Custom data from previous plugin */
  pluginData?: unknown;
}

/**
 * Result returned from onResolve callbacks
 */
export interface OnResolveResult {
  /** Resolved path */
  path?: string;
  /** Mark as external (don't bundle) */
  external?: boolean;
  /** Namespace for the resolved path */
  namespace?: string;
  /** Custom data to pass to onLoad */
  pluginData?: unknown;
  /** Errors to report */
  errors?: PluginMessage[];
  /** Warnings to report */
  warnings?: PluginMessage[];
  /** Side effects hint for tree shaking */
  sideEffects?: boolean;
  /** URL suffix (query string, hash) */
  suffix?: string;
}

/**
 * Arguments passed to onLoad callbacks
 */
export interface OnLoadArgs {
  /** The resolved path to load */
  path: string;
  /** The namespace of the path */
  namespace: string;
  /** URL suffix from resolution */
  suffix: string;
  /** Custom data from onResolve */
  pluginData?: unknown;
}

/**
 * Result returned from onLoad callbacks
 */
export interface OnLoadResult {
  /** File contents */
  contents?: string | Uint8Array;
  /** Loader to use for the contents */
  loader?: Loader;
  /** Directory for resolving imports in this file */
  resolveDir?: string;
  /** Custom data to pass along */
  pluginData?: unknown;
  /** Errors to report */
  errors?: PluginMessage[];
  /** Warnings to report */
  warnings?: PluginMessage[];
  /** Files to watch for changes */
  watchFiles?: string[];
  /** Directories to watch for changes */
  watchDirs?: string[];
}

/**
 * Error or warning message from plugins
 */
export interface PluginMessage {
  /** Message text */
  text: string;
  /** Source location */
  location?: {
    file?: string;
    line?: number;
    column?: number;
    length?: number;
    lineText?: string;
  };
  /** Additional details */
  detail?: unknown;
}

/**
 * Callback for onResolve hooks
 */
export type OnResolveCallback = (
  args: OnResolveArgs
) => OnResolveResult | null | undefined | Promise<OnResolveResult | null | undefined>;

/**
 * Callback for onLoad hooks
 */
export type OnLoadCallback = (
  args: OnLoadArgs
) => OnLoadResult | null | undefined | Promise<OnLoadResult | null | undefined>;

/**
 * Plugin build interface for registering hooks
 */
export interface PluginBuild {
  /**
   * Register an onResolve hook
   * @param options Filter options for when the hook should run
   * @param callback Callback to execute
   */
  onResolve(
    options: { filter: RegExp; namespace?: string },
    callback: OnResolveCallback
  ): void;

  /**
   * Register an onLoad hook
   * @param options Filter options for when the hook should run
   * @param callback Callback to execute
   */
  onLoad(
    options: { filter: RegExp; namespace?: string },
    callback: OnLoadCallback
  ): void;
}

/**
 * Plugin interface
 */
export interface Plugin {
  /** Unique name for the plugin */
  name: string;
  /**
   * Setup function called to register hooks
   * @param build Build interface for registering hooks
   */
  setup(build: PluginBuild): void | Promise<void>;
}

// ============================================
// FETCHER
// ============================================

/**
 * Result from fetching a URL
 */
export interface FetchResult {
  /** Fetched contents */
  contents: string | Uint8Array;
  /** Loader to use (inferred from URL if not provided) */
  loader?: Loader;
  /** Base directory for resolving relative imports in this module */
  resolveDir?: string;
}

/**
 * Fetcher function for loading external modules
 * @param specifierOrUrl URL or specifier to fetch
 * @returns Fetched content and metadata
 */
export type Fetcher = (specifierOrUrl: string) => Promise<FetchResult>;

// ============================================
// BUNDLER OPTIONS
// ============================================

/**
 * Options for creating a bundler instance
 */
export interface BundlerOptions {
  /**
   * Custom plugins to extend bundler functionality
   */
  plugins?: Plugin[];

  /**
   * Optional fetcher for loading external URLs
   * If not provided, external URLs will cause errors
   */
  fetcher?: Fetcher;

  /**
   * Cache configuration for fetched modules
   */
  cache?: {
    /** Maximum number of cached entries (default: 100) */
    maxSize?: number;
    /** Time-to-live in milliseconds (optional) */
    ttl?: number;
  };

  /**
   * Base URL for resolving relative imports in import map
   * Defaults to 'file:///'
   */
  baseURL?: string;
}

/**
 * Options for a build operation
 */
export interface BuildOptions {
  /** Output format (default: 'esm') */
  format?: Format;

  /** Target platform (default: 'browser') */
  platform?: Platform;

  /** Enable minification (default: false) */
  minify?: boolean;

  /** Sourcemap generation (default: false) */
  sourcemap?: boolean | 'inline' | 'external' | 'linked';

  /** Enable code splitting (default: false) */
  splitting?: boolean;

  /** Target environment(s) (default: 'esnext') */
  target?: string | string[];

  /** External modules that should not be bundled */
  external?: string[];

  /** Global constant definitions */
  define?: Record<string, string>;

  /** Banner to prepend to output files */
  banner?: { js?: string; css?: string };

  /** Footer to append to output files */
  footer?: { js?: string; css?: string };

  /** Enable tree shaking (default: true) */
  treeShaking?: boolean;

  /** JSX factory function (default: 'React.createElement') */
  jsxFactory?: string;

  /** JSX fragment (default: 'React.Fragment') */
  jsxFragment?: string;

  /** JSX mode */
  jsx?: 'transform' | 'preserve' | 'automatic';

  /** JSX import source for automatic mode */
  jsxImportSource?: string;

  /** Log level (default: 'silent') */
  logLevel?: 'verbose' | 'debug' | 'info' | 'warning' | 'error' | 'silent';

  /** Generate metafile with dependency info (default: true) */
  metafile?: boolean;

  /** Map file extensions to loaders (e.g., { '.js': 'jsx' } to treat .js as JSX) */
  loader?: Record<string, Loader>;
}

// ============================================
// BUNDLE RESULT
// ============================================

/**
 * Metafile containing bundle dependency information
 */
export interface Metafile {
  inputs: Record<
    string,
    {
      bytes: number;
      imports: { path: string; kind: ImportKind; external?: boolean }[];
    }
  >;
  outputs: Record<
    string,
    {
      bytes: number;
      inputs: Record<string, { bytesInOutput: number }>;
      imports: { path: string; kind: ImportKind; external?: boolean }[];
      exports: string[];
      entryPoint?: string;
    }
  >;
}

/**
 * Result from a bundle operation
 */
export interface BundleResult {
  /**
   * Map of output filename to contents
   * Filenames are relative paths like 'index.js' or 'chunk-ABC123.js'
   */
  outputFiles: Record<string, string>;

  /**
   * Metafile with dependency information (if metafile option was true)
   */
  metafile?: Metafile;

  /**
   * Build warnings
   */
  warnings: PluginMessage[];

  /**
   * Build errors (empty if build succeeded)
   */
  errors: PluginMessage[];
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Options for initializing esbuild-wasm
 */
export interface InitOptions {
  /**
   * URL to the esbuild.wasm file
   * If not provided, uses a CDN URL
   */
  wasmURL?: string;

  /**
   * URL to the worker file (optional)
   * If not provided, uses inline worker
   */
  workerURL?: string;
}

// ============================================
// BUNDLER INSTANCE
// ============================================

/**
 * Bundler instance interface
 */
export interface Bundler {
  /**
   * Bundle entry points with given files and import map
   *
   * @param entryPoints Entry point file path(s)
   * @param files Virtual file system containing source files
   * @param importMap Import map for resolving bare specifiers
   * @param options Build options
   * @returns Bundle result with output files and diagnostics
   */
  bundle(
    entryPoints: string | string[],
    files: VirtualFileSystem,
    importMap: ImportMapJson,
    options?: BuildOptions
  ): Promise<BundleResult>;

  /**
   * Dispose of bundler resources and clear caches
   */
  dispose(): void;
}
