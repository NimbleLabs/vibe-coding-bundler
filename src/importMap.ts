/**
 * Import map parsing and resolution
 * Implements the WICG Import Maps specification
 * @see https://github.com/WICG/import-maps
 */

import type { ImportMapJson, ParsedImportMap } from './types';
import { ImportMapError } from './errors';

/**
 * Parses and validates an import map JSON object
 *
 * @param json Import map JSON object
 * @param baseURL Base URL for resolving relative URLs in the import map (default: 'file:///')
 * @returns Parsed import map ready for resolution
 * @throws ImportMapError if the import map is invalid
 */
export function parseImportMap(
  json: ImportMapJson,
  baseURL: string = 'file:///'
): ParsedImportMap {
  const result: ParsedImportMap = {
    imports: new Map(),
    scopes: new Map(),
  };

  // Parse top-level imports
  if (json.imports !== undefined) {
    if (typeof json.imports !== 'object' || json.imports === null || Array.isArray(json.imports)) {
      throw new ImportMapError('Import map "imports" must be an object', '<imports>');
    }

    for (const [key, value] of Object.entries(json.imports)) {
      const normalizedKey = normalizeSpecifierKey(key, baseURL);
      const resolvedValue = resolveImportMapValue(value, baseURL, key);
      if (resolvedValue !== null) {
        result.imports.set(normalizedKey, resolvedValue);
      }
    }
  }

  // Parse scopes
  if (json.scopes !== undefined) {
    if (typeof json.scopes !== 'object' || json.scopes === null || Array.isArray(json.scopes)) {
      throw new ImportMapError('Import map "scopes" must be an object', '<scopes>');
    }

    for (const [scopePrefix, scopeImports] of Object.entries(json.scopes)) {
      if (
        typeof scopeImports !== 'object' ||
        scopeImports === null ||
        Array.isArray(scopeImports)
      ) {
        throw new ImportMapError(
          `Import map scope "${scopePrefix}" must be an object`,
          scopePrefix
        );
      }

      const normalizedScope = normalizeURL(scopePrefix, baseURL);
      const scopeMap = new Map<string, string>();

      for (const [key, value] of Object.entries(scopeImports)) {
        const normalizedKey = normalizeSpecifierKey(key, baseURL);
        const resolvedValue = resolveImportMapValue(value, baseURL, key);
        if (resolvedValue !== null) {
          scopeMap.set(normalizedKey, resolvedValue);
        }
      }

      result.scopes.set(normalizedScope, scopeMap);
    }
  }

  return result;
}

/**
 * Resolves a specifier using the parsed import map
 *
 * Algorithm:
 * 1. If referrer matches a scope, try scope-specific mappings first (most specific scope wins)
 * 2. Fall back to top-level imports
 * 3. Return null if not found in import map (allows fallback to other resolution strategies)
 *
 * @param specifier The import specifier to resolve
 * @param referrer The URL/path of the file containing the import
 * @param importMap Parsed import map
 * @returns Resolved URL/path, or null if not found in import map
 */
export function resolveImportMap(
  specifier: string,
  referrer: string,
  importMap: ParsedImportMap
): string | null {
  // Normalize the referrer for consistent scope matching
  const normalizedReferrer = normalizeReferrer(referrer);

  // 1. Try scopes first (most specific scope wins)
  const scopeMatches = findMatchingScopes(normalizedReferrer, importMap.scopes);

  for (const scopePrefix of scopeMatches) {
    const scopeMap = importMap.scopes.get(scopePrefix)!;
    const resolved = resolveFromMap(specifier, scopeMap);
    if (resolved !== null) {
      return resolved;
    }
  }

  // 2. Try top-level imports
  return resolveFromMap(specifier, importMap.imports);
}

/**
 * Finds all matching scopes for a referrer, sorted by specificity (longest prefix first)
 */
function findMatchingScopes(
  referrer: string,
  scopes: Map<string, Map<string, string>>
): string[] {
  const matches: string[] = [];

  for (const scopePrefix of scopes.keys()) {
    if (referrer.startsWith(scopePrefix)) {
      matches.push(scopePrefix);
    }
  }

  // Sort by length descending (most specific first)
  return matches.sort((a, b) => b.length - a.length);
}

/**
 * Resolves a specifier from a single imports map
 *
 * Matching rules per the import maps spec:
 * 1. Exact match: "lodash" -> "https://cdn.example.com/lodash.js"
 * 2. Prefix match (keys ending with "/"):
 *    "lodash/" matches "lodash/debounce" -> resolves to mapped prefix + remainder
 *
 * @param specifier The specifier to resolve
 * @param map The imports map to search
 * @returns Resolved URL/path, or null if no match found
 */
function resolveFromMap(specifier: string, map: Map<string, string>): string | null {
  // 1. Try exact match first
  if (map.has(specifier)) {
    return map.get(specifier)!;
  }

  // 2. Try prefix matches (keys ending with "/")
  // Find the longest matching prefix for most specific match
  let longestMatch: string | null = null;
  let longestMatchLength = 0;

  for (const key of map.keys()) {
    // Only consider keys ending with "/" for prefix matching
    if (!key.endsWith('/')) continue;

    if (specifier.startsWith(key) && key.length > longestMatchLength) {
      longestMatch = key;
      longestMatchLength = key.length;
    }
  }

  if (longestMatch !== null) {
    const mappedPrefix = map.get(longestMatch)!;
    const remainder = specifier.slice(longestMatch.length);

    // Per spec: the mapped value must also end with "/" for prefix matching to work
    if (!mappedPrefix.endsWith('/')) {
      throw new ImportMapError(
        `Import map prefix key "${longestMatch}" maps to "${mappedPrefix}" which does not end with "/". ` +
          `Prefix mappings must map to URLs ending with "/".`,
        longestMatch
      );
    }

    return mappedPrefix + remainder;
  }

  return null;
}

/**
 * Normalizes a specifier key for consistent matching
 * - URLs are normalized
 * - Relative paths (./  ../) are resolved against baseURL
 * - Absolute paths (/) are resolved against baseURL
 * - Bare specifiers are kept as-is
 */
function normalizeSpecifierKey(key: string, baseURL: string): string {
  // If the key is a valid absolute URL, normalize it
  if (isAbsoluteURL(key)) {
    return normalizeURL(key, baseURL);
  }

  // If it starts with ./ or ../ or /, it's a relative/absolute path
  if (key.startsWith('./') || key.startsWith('../') || key.startsWith('/')) {
    return normalizeURL(key, baseURL);
  }

  // Otherwise it's a bare specifier, keep as-is
  return key;
}

/**
 * Resolves and validates an import map value
 * - Empty string means "do not resolve" (intentionally blocking)
 * - Non-strings are warned and ignored
 */
function resolveImportMapValue(value: unknown, baseURL: string, key: string): string | null {
  if (typeof value !== 'string') {
    console.warn(`Import map: value for "${key}" is not a string, ignoring`);
    return null;
  }

  // Empty string means "do not resolve" per spec
  if (value === '') {
    return null;
  }

  return normalizeURL(value, baseURL);
}

/**
 * Normalizes a URL relative to a base URL
 * Returns the input as-is if it's not a valid URL
 */
function normalizeURL(url: string, baseURL: string): string {
  try {
    return new URL(url, baseURL).href;
  } catch {
    // If URL parsing fails, return as-is (bare specifier)
    return url;
  }
}

/**
 * Normalizes a referrer path for scope matching
 * Ensures consistent format for path comparisons
 */
function normalizeReferrer(referrer: string): string {
  // If it's already a URL, normalize it
  if (isAbsoluteURL(referrer)) {
    try {
      return new URL(referrer).href;
    } catch {
      return referrer;
    }
  }

  // For file paths, ensure they start with file:// for consistent matching
  if (referrer.startsWith('/')) {
    return `file://${referrer}`;
  }

  // Relative paths - prepend file:///
  return `file:///${referrer.replace(/^\.\//, '')}`;
}

/**
 * Checks if a string is an absolute URL (has a scheme)
 */
function isAbsoluteURL(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Type guard for checking if a specifier is a bare specifier
 * A bare specifier is NOT:
 * - An absolute URL (https://, file://, etc.)
 * - An absolute path (/)
 * - A relative path (./, ../)
 */
export function isBareSpecifier(specifier: string): boolean {
  // Check for URL schemes
  if (isAbsoluteURL(specifier)) return false;

  // Check for absolute paths
  if (specifier.startsWith('/')) return false;

  // Check for relative paths (including "." and ".." alone)
  if (specifier === '.' || specifier === '..') return false;
  if (specifier.startsWith('./')) return false;
  if (specifier.startsWith('../')) return false;

  return true;
}

/**
 * Checks if a specifier looks like a URL (http:// or https://)
 */
export function isRemoteURL(specifier: string): boolean {
  return specifier.startsWith('http://') || specifier.startsWith('https://');
}

/**
 * Extracts the package name from a bare specifier
 * Handles scoped packages (@org/package)
 *
 * Examples:
 * - "lodash" -> "lodash"
 * - "lodash/debounce" -> "lodash"
 * - "@scope/pkg" -> "@scope/pkg"
 * - "@scope/pkg/sub" -> "@scope/pkg"
 */
export function extractPackageName(specifier: string): string {
  if (specifier.startsWith('@')) {
    // Scoped package: @scope/name or @scope/name/subpath
    const parts = specifier.split('/');
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : specifier;
  }

  // Regular package: name or name/subpath
  const slashIndex = specifier.indexOf('/');
  return slashIndex === -1 ? specifier : specifier.slice(0, slashIndex);
}
