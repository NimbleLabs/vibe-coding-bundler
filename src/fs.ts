/**
 * Virtual file system implementation
 * Provides an in-memory file system for bundling without disk access
 */

import type { VirtualFileSystem, Loader, ResolvedFile } from './types';
import { FileNotFoundError } from './errors';

/**
 * Map of file extensions to esbuild loaders
 */
const EXTENSION_TO_LOADER: Record<string, Loader> = {
  // JavaScript
  '.js': 'js',
  '.mjs': 'js',
  '.cjs': 'js',

  // JSX
  '.jsx': 'jsx',

  // TypeScript
  '.ts': 'ts',
  '.mts': 'ts',
  '.cts': 'ts',

  // TSX
  '.tsx': 'tsx',

  // Styles
  '.css': 'css',

  // Data
  '.json': 'json',

  // Text
  '.txt': 'text',
  '.text': 'text',
  '.md': 'text',
  '.markdown': 'text',
  '.html': 'text',
  '.htm': 'text',
  '.xml': 'text',
  '.svg': 'text',
  '.yaml': 'text',
  '.yml': 'text',
  '.toml': 'text',

  // Binary
  '.wasm': 'binary',
  '.png': 'binary',
  '.jpg': 'binary',
  '.jpeg': 'binary',
  '.gif': 'binary',
  '.webp': 'binary',
  '.avif': 'binary',
  '.ico': 'binary',
  '.bmp': 'binary',

  // Fonts
  '.woff': 'binary',
  '.woff2': 'binary',
  '.ttf': 'binary',
  '.otf': 'binary',
  '.eot': 'binary',

  // Other binary
  '.pdf': 'binary',
  '.zip': 'binary',
  '.tar': 'binary',
  '.gz': 'binary',
};

/**
 * Extensions to try when resolving imports without extension
 */
const RESOLVE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'];

/**
 * Index files to try when resolving directory imports
 */
const INDEX_FILES = ['index.ts', 'index.tsx', 'index.js', 'index.jsx', 'index.mjs'];

/**
 * Normalizes a file path for consistent lookup
 * - Removes leading ./
 * - Normalizes multiple slashes
 * - Ensures paths start with /
 */
export function normalizePath(path: string): string {
  // Remove leading ./
  let normalized = path.replace(/^\.\//, '');

  // Normalize multiple slashes to single
  normalized = normalized.replace(/\/+/g, '/');

  // Remove trailing slash (files don't have trailing slashes)
  normalized = normalized.replace(/\/$/, '');

  // Ensure consistent leading / for absolute paths
  if (!normalized.startsWith('/') && !normalized.startsWith('.')) {
    normalized = '/' + normalized;
  }

  return normalized;
}

/**
 * Resolves a relative path against a base path
 * Handles .. and . path segments
 *
 * @param basePath The base file path (the importing file)
 * @param relativePath The path to resolve
 * @returns Normalized absolute path
 */
export function resolvePath(basePath: string, relativePath: string): string {
  // Absolute paths don't need resolution
  if (relativePath.startsWith('/')) {
    return normalizePath(relativePath);
  }

  // Get directory of base path
  const baseDir = getDirectory(basePath);

  // Combine paths
  const combined = baseDir + '/' + relativePath;

  // Split into segments and resolve . and ..
  const parts = combined.split('/').filter((p) => p !== '');
  const resolved: string[] = [];

  for (const part of parts) {
    if (part === '..') {
      // Go up one directory
      resolved.pop();
    } else if (part !== '.') {
      // Add normal segments (skip .)
      resolved.push(part);
    }
  }

  return '/' + resolved.join('/');
}

/**
 * Gets the directory portion of a path
 */
export function getDirectory(path: string): string {
  const normalized = normalizePath(path);
  const lastSlash = normalized.lastIndexOf('/');
  return lastSlash > 0 ? normalized.substring(0, lastSlash) : '/';
}

/**
 * Gets the file extension from a path (including the dot)
 */
export function getExtension(path: string): string {
  const lastDot = path.lastIndexOf('.');
  const lastSlash = path.lastIndexOf('/');

  // Dot must come after the last slash and not be the first character
  if (lastDot > lastSlash && lastDot !== -1) {
    return path.substring(lastDot);
  }

  return '';
}

/**
 * Gets the filename from a path (without directory)
 */
export function getFilename(path: string): string {
  const lastSlash = path.lastIndexOf('/');
  return lastSlash >= 0 ? path.substring(lastSlash + 1) : path;
}

/**
 * Detects the appropriate esbuild loader for a file based on its extension
 */
export function detectLoader(path: string): Loader {
  const ext = getExtension(path).toLowerCase();
  return EXTENSION_TO_LOADER[ext] || 'js';
}

/**
 * Virtual file system class
 * Wraps a file map and provides path-normalized access
 */
export class VirtualFS {
  private files: Map<string, string | Uint8Array>;

  /**
   * Creates a new VirtualFS from a file system object
   * Paths are normalized on construction for consistent lookup
   */
  constructor(files: VirtualFileSystem) {
    this.files = new Map();

    // Normalize all paths on construction
    for (const [path, contents] of Object.entries(files)) {
      const normalizedPath = normalizePath(path);
      this.files.set(normalizedPath, contents);
    }
  }

  /**
   * Checks if a file exists in the virtual file system
   */
  exists(path: string): boolean {
    const normalized = normalizePath(path);
    return this.files.has(normalized);
  }

  /**
   * Reads a file from the virtual file system
   * @throws FileNotFoundError if the file doesn't exist
   */
  read(path: string): string | Uint8Array {
    const normalized = normalizePath(path);

    if (!this.files.has(normalized)) {
      throw new FileNotFoundError(path);
    }

    return this.files.get(normalized)!;
  }

  /**
   * Reads a file and returns it with loader information
   * @throws FileNotFoundError if the file doesn't exist
   */
  resolve(path: string): ResolvedFile {
    const normalized = normalizePath(path);
    const contents = this.read(normalized);
    const loader = detectLoader(normalized);

    return {
      contents,
      loader,
      path: normalized,
    };
  }

  /**
   * Resolves a path with automatic extension and index file resolution
   * Tries the path as-is, then with various extensions, then as a directory with index files
   *
   * @param basePath The importing file's path
   * @param importPath The import specifier (e.g., './utils' or './utils/index')
   * @returns Resolved file or null if not found
   */
  resolveWithExtensions(basePath: string, importPath: string): ResolvedFile | null {
    const resolved = resolvePath(basePath, importPath);

    // 1. Try exact path first
    if (this.exists(resolved)) {
      return this.resolve(resolved);
    }

    // 2. Try adding extensions
    for (const ext of RESOLVE_EXTENSIONS) {
      const withExt = resolved + ext;
      if (this.exists(withExt)) {
        return this.resolve(withExt);
      }
    }

    // 3. Try swapping extensions (e.g., ./utils.js -> ./utils.ts, ./utils.tsx)
    // This handles cases where imports use .js but actual file is .ts/.tsx
    const currentExt = getExtension(resolved);
    if (currentExt) {
      const withoutExt = resolved.slice(0, -currentExt.length);
      for (const ext of RESOLVE_EXTENSIONS) {
        if (ext !== currentExt) {
          const swapped = withoutExt + ext;
          if (this.exists(swapped)) {
            return this.resolve(swapped);
          }
        }
      }
    }

    // 4. Try as directory with index file
    for (const indexFile of INDEX_FILES) {
      const indexPath = resolved + '/' + indexFile;
      if (this.exists(indexPath)) {
        return this.resolve(indexPath);
      }
    }

    return null;
  }

  /**
   * Lists all files in the virtual file system
   */
  list(): string[] {
    return Array.from(this.files.keys());
  }

  /**
   * Gets the directory of a path
   */
  dirname(path: string): string {
    return getDirectory(path);
  }

  /**
   * Writes a file to the virtual file system
   * Used internally or for dynamic file generation
   */
  write(path: string, contents: string | Uint8Array): void {
    const normalized = normalizePath(path);
    this.files.set(normalized, contents);
  }

  /**
   * Deletes a file from the virtual file system
   */
  delete(path: string): boolean {
    const normalized = normalizePath(path);
    return this.files.delete(normalized);
  }

  /**
   * Gets the number of files in the virtual file system
   */
  get size(): number {
    return this.files.size;
  }

  /**
   * Creates a new VirtualFS with the same files (shallow copy of contents)
   */
  clone(): VirtualFS {
    const newFs = new VirtualFS({});
    for (const [path, contents] of this.files) {
      newFs.files.set(path, contents);
    }
    return newFs;
  }
}

/**
 * Converts file contents to a string
 * Handles both string and Uint8Array contents
 */
export function contentsToString(contents: string | Uint8Array): string {
  if (typeof contents === 'string') {
    return contents;
  }
  return new TextDecoder().decode(contents);
}

/**
 * Converts file contents to Uint8Array
 * Handles both string and Uint8Array contents
 */
export function contentsToBytes(contents: string | Uint8Array): Uint8Array {
  if (contents instanceof Uint8Array) {
    return contents;
  }
  return new TextEncoder().encode(contents);
}
