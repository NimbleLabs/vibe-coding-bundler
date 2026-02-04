/**
 * LRU (Least Recently Used) cache implementation
 * Used for caching fetched modules to avoid redundant network requests
 */

interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

/**
 * Configuration options for the LRU cache
 */
export interface LRUCacheOptions {
  /** Maximum number of entries to store (default: 100) */
  maxSize?: number;
  /** Time-to-live in milliseconds (optional, entries never expire if not set) */
  ttl?: number;
}

/**
 * Simple LRU cache implementation
 * - Entries are evicted when cache exceeds maxSize (oldest first)
 * - Optional TTL for automatic expiration
 * - O(1) get/set operations using Map's insertion order
 */
export class LRUCache<K, V> {
  private cache: Map<K, CacheEntry<V>>;
  private readonly maxSize: number;
  private readonly ttl: number | null;

  constructor(options: LRUCacheOptions = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize ?? 100;
    this.ttl = options.ttl ?? null;
  }

  /**
   * Gets a value from the cache
   * Returns undefined if not found or expired
   * Accessing a key moves it to the end (most recently used)
   */
  get(key: K): V | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    // Check TTL if configured
    if (this.ttl !== null && Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    // Move to end (most recently used)
    // Map maintains insertion order, so we delete and re-add
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value;
  }

  /**
   * Sets a value in the cache
   * If key already exists, it's updated and moved to most recently used
   * If cache is at capacity, oldest entry is evicted
   */
  set(key: K, value: V): void {
    // Delete first to ensure it goes to end
    this.cache.delete(key);

    // Evict oldest entries if at capacity
    while (this.cache.size >= this.maxSize) {
      const oldest = this.cache.keys().next().value;
      if (oldest !== undefined) {
        this.cache.delete(oldest);
      } else {
        break;
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  /**
   * Checks if a key exists and is not expired
   */
  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Deletes a key from the cache
   * @returns true if the key was found and deleted
   */
  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clears all entries from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Gets the current number of entries in the cache
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Gets all keys currently in the cache
   * Note: May include expired entries if TTL is set
   */
  keys(): IterableIterator<K> {
    return this.cache.keys();
  }

  /**
   * Iterates over all valid (non-expired) entries
   */
  *entries(): IterableIterator<[K, V]> {
    for (const [key, entry] of this.cache) {
      if (this.ttl === null || Date.now() - entry.timestamp <= this.ttl) {
        yield [key, entry.value];
      }
    }
  }

  /**
   * Removes all expired entries from the cache
   * Call this periodically if TTL is set and memory is a concern
   */
  prune(): number {
    if (this.ttl === null) {
      return 0;
    }

    let pruned = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
        pruned++;
      }
    }

    return pruned;
  }
}

/**
 * Creates a cache key from a URL and optional parameters
 * Useful for caching fetched resources with query parameters
 */
export function createCacheKey(url: string, params?: Record<string, string>): string {
  if (!params || Object.keys(params).length === 0) {
    return url;
  }

  // Sort parameters for consistent keys
  const sortedParams = Object.keys(params)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');

  return `${url}?${sortedParams}`;
}
