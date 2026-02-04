/**
 * Custom error classes for vibe-coding-bundler
 * All errors include structured information for better debugging
 */

/**
 * Base error class for all vibe-bundler errors
 */
export class VibeBundlerError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'VibeBundlerError';
    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error thrown when import map parsing or resolution fails
 */
export class ImportMapError extends VibeBundlerError {
  constructor(
    message: string,
    public readonly specifier: string,
    public readonly importer?: string
  ) {
    super(message, 'IMPORT_MAP_ERROR');
    this.name = 'ImportMapError';
  }
}

/**
 * Error thrown when module resolution fails
 * Includes an import trace for debugging complex dependency chains
 */
export class ResolutionError extends VibeBundlerError {
  constructor(
    message: string,
    public readonly specifier: string,
    public readonly importer: string,
    public readonly trace: string[] = []
  ) {
    super(message, 'RESOLUTION_ERROR');
    this.name = 'ResolutionError';
  }

  /**
   * Returns a formatted error message including the import trace
   */
  toString(): string {
    const traceStr =
      this.trace.length > 0
        ? `\n\nImport trace:\n${this.trace.map((t) => `  -> ${t}`).join('\n')}`
        : '';
    return `${this.message}${traceStr}`;
  }
}

/**
 * Error thrown when a file is not found in the virtual file system
 */
export class FileNotFoundError extends VibeBundlerError {
  constructor(
    public readonly path: string,
    public readonly importer?: string
  ) {
    super(
      `File not found: "${path}"${importer ? ` (imported from "${importer}")` : ''}`,
      'FILE_NOT_FOUND'
    );
    this.name = 'FileNotFoundError';
  }
}

/**
 * Error thrown when esbuild-wasm initialization fails
 */
export class InitializationError extends VibeBundlerError {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message, 'INITIALIZATION_ERROR');
    this.name = 'InitializationError';
  }
}

/**
 * Error thrown when a plugin fails during setup or execution
 */
export class PluginError extends VibeBundlerError {
  constructor(
    message: string,
    public readonly pluginName: string,
    public readonly cause?: Error
  ) {
    super(`[${pluginName}] ${message}`, 'PLUGIN_ERROR');
    this.name = 'PluginError';
  }
}

/**
 * Error thrown when fetching an external URL fails
 */
export class FetchError extends VibeBundlerError {
  constructor(
    public readonly url: string,
    message: string,
    public readonly cause?: Error
  ) {
    super(`Failed to fetch "${url}": ${message}`, 'FETCH_ERROR');
    this.name = 'FetchError';
  }
}

/**
 * Creates a user-friendly error message for missing import map entries
 * Provides a suggestion for how to fix the issue
 */
export function createMissingImportMapError(
  specifier: string,
  importer: string
): ImportMapError {
  // Generate a suggested CDN URL based on the package name
  const packageName = specifier.split('/')[0].startsWith('@')
    ? specifier.split('/').slice(0, 2).join('/')
    : specifier.split('/')[0];

  return new ImportMapError(
    `Cannot resolve "${specifier}" - not found in import map.\n\n` +
      `The specifier "${specifier}" is a bare import that requires an entry in your import map.\n\n` +
      `Add it to your import map:\n` +
      `{\n` +
      `  "imports": {\n` +
      `    "${packageName}": "https://esm.sh/${packageName}"\n` +
      `  }\n` +
      `}\n\n` +
      `Or if you're using subpath imports:\n` +
      `{\n` +
      `  "imports": {\n` +
      `    "${packageName}/": "https://esm.sh/${packageName}/"\n` +
      `  }\n` +
      `}`,
    specifier,
    importer
  );
}

/**
 * Creates an error for when no fetcher is configured but external URLs are used
 */
export function createNoFetcherError(url: string): VibeBundlerError {
  return new VibeBundlerError(
    `Cannot fetch "${url}": no fetcher configured.\n\n` +
      `To fetch external URLs, provide a fetcher option when creating the bundler:\n\n` +
      `const bundler = createBundler({\n` +
      `  fetcher: async (url) => {\n` +
      `    const response = await fetch(url);\n` +
      `    const contents = await response.text();\n` +
      `    return { contents };\n` +
      `  }\n` +
      `});`,
    'NO_FETCHER'
  );
}

/**
 * Formats an error for display in CLI or UI
 */
export function formatError(error: Error): string {
  if (error instanceof ResolutionError) {
    return error.toString();
  }

  if (error instanceof VibeBundlerError) {
    return `[${error.code}] ${error.message}`;
  }

  return error.message;
}
