/**
 * Plugin system orchestration
 * Collects handlers from plugins and executes them in registration order
 */

import type {
  Plugin,
  PluginBuild,
  OnResolveArgs,
  OnResolveResult,
  OnResolveCallback,
  OnLoadArgs,
  OnLoadResult,
  OnLoadCallback,
} from './types';
import { PluginError } from './errors';

/**
 * Internal representation of a registered resolve handler
 */
interface ResolveHandler {
  filter: RegExp;
  namespace: string | undefined;
  callback: OnResolveCallback;
  pluginName: string;
}

/**
 * Internal representation of a registered load handler
 */
interface LoadHandler {
  filter: RegExp;
  namespace: string | undefined;
  callback: OnLoadCallback;
  pluginName: string;
}

/**
 * Plugin orchestrator
 * Manages plugin registration and hook execution
 */
export class PluginOrchestrator {
  private resolveHandlers: ResolveHandler[] = [];
  private loadHandlers: LoadHandler[] = [];

  /**
   * Registers a plugin and collects its handlers
   * Plugins are registered in order and their handlers execute in that order
   *
   * @param plugin Plugin to register
   * @throws PluginError if plugin setup fails
   */
  async register(plugin: Plugin): Promise<void> {
    const build: PluginBuild = {
      onResolve: (options, callback) => {
        this.resolveHandlers.push({
          filter: options.filter,
          namespace: options.namespace,
          callback,
          pluginName: plugin.name,
        });
      },
      onLoad: (options, callback) => {
        this.loadHandlers.push({
          filter: options.filter,
          namespace: options.namespace,
          callback,
          pluginName: plugin.name,
        });
      },
    };

    try {
      await plugin.setup(build);
    } catch (error) {
      throw new PluginError(
        `Plugin setup failed: ${error instanceof Error ? error.message : String(error)}`,
        plugin.name,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Runs all matching resolve handlers until one returns a result
   * Handlers are executed in registration order
   *
   * @param args Resolution arguments
   * @returns First non-null result, or null if no handler matched
   * @throws PluginError if a handler throws
   */
  async runResolve(args: OnResolveArgs): Promise<OnResolveResult | null> {
    for (const handler of this.resolveHandlers) {
      // Check namespace match
      if (handler.namespace !== undefined && handler.namespace !== args.namespace) {
        continue;
      }

      // Check filter match
      if (!handler.filter.test(args.path)) {
        continue;
      }

      try {
        const result = await handler.callback(args);
        if (result !== null && result !== undefined) {
          return result;
        }
      } catch (error) {
        throw new PluginError(
          `onResolve callback failed for "${args.path}": ${
            error instanceof Error ? error.message : String(error)
          }`,
          handler.pluginName,
          error instanceof Error ? error : undefined
        );
      }
    }

    return null;
  }

  /**
   * Runs all matching load handlers until one returns a result
   * Handlers are executed in registration order
   *
   * @param args Load arguments
   * @returns First non-null result, or null if no handler matched
   * @throws PluginError if a handler throws
   */
  async runLoad(args: OnLoadArgs): Promise<OnLoadResult | null> {
    for (const handler of this.loadHandlers) {
      // Check namespace match
      if (handler.namespace !== undefined && handler.namespace !== args.namespace) {
        continue;
      }

      // Check filter match
      if (!handler.filter.test(args.path)) {
        continue;
      }

      try {
        const result = await handler.callback(args);
        if (result !== null && result !== undefined) {
          return result;
        }
      } catch (error) {
        throw new PluginError(
          `onLoad callback failed for "${args.path}": ${
            error instanceof Error ? error.message : String(error)
          }`,
          handler.pluginName,
          error instanceof Error ? error : undefined
        );
      }
    }

    return null;
  }

  /**
   * Gets the count of registered handlers
   */
  get handlerCount(): { resolve: number; load: number } {
    return {
      resolve: this.resolveHandlers.length,
      load: this.loadHandlers.length,
    };
  }

  /**
   * Gets the names of all registered plugins (based on handlers)
   */
  get pluginNames(): string[] {
    const names = new Set<string>();
    for (const h of this.resolveHandlers) {
      names.add(h.pluginName);
    }
    for (const h of this.loadHandlers) {
      names.add(h.pluginName);
    }
    return Array.from(names);
  }

  /**
   * Clears all registered handlers
   */
  clear(): void {
    this.resolveHandlers = [];
    this.loadHandlers = [];
  }
}

/**
 * Creates a simple virtual module plugin
 * Useful for providing virtual modules that don't exist on disk
 *
 * @param modules Map of module names to their contents
 * @returns Plugin that provides the virtual modules
 *
 * @example
 * ```ts
 * const plugin = createVirtualModulePlugin({
 *   'virtual:config': 'export default { debug: true };',
 *   'virtual:env': 'export const NODE_ENV = "production";'
 * });
 * ```
 */
export function createVirtualModulePlugin(
  modules: Record<string, string>
): Plugin {
  const namespace = 'virtual-module';

  return {
    name: 'virtual-modules',
    setup(build) {
      // Resolve virtual module names
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.path in modules) {
          return {
            path: args.path,
            namespace,
          };
        }
        return null;
      });

      // Load virtual module contents
      build.onLoad({ filter: /.*/, namespace }, (args) => {
        const contents = modules[args.path];
        if (contents !== undefined) {
          return {
            contents,
            loader: 'js',
          };
        }
        return null;
      });
    },
  };
}

/**
 * Creates a plugin that replaces specific imports with different modules
 * Useful for aliasing or mocking dependencies
 *
 * @param aliases Map of import specifiers to their replacements
 * @returns Plugin that performs the aliasing
 *
 * @example
 * ```ts
 * const plugin = createAliasPlugin({
 *   'lodash': 'lodash-es',
 *   '@/utils': '/src/utils'
 * });
 * ```
 */
export function createAliasPlugin(aliases: Record<string, string>): Plugin {
  return {
    name: 'alias',
    setup(build) {
      // Create a filter that matches any of the alias keys
      const keys = Object.keys(aliases);
      if (keys.length === 0) return;

      const filter = new RegExp(`^(${keys.map(escapeRegExp).join('|')})$`);

      build.onResolve({ filter }, (args) => {
        const replacement = aliases[args.path];
        if (replacement !== undefined) {
          return {
            path: replacement,
            // Don't set external, let it be resolved normally
          };
        }
        return null;
      });
    },
  };
}

/**
 * Creates a plugin that marks specific modules as external
 * External modules won't be bundled and will remain as imports
 *
 * @param patterns Array of module names or RegExp patterns to externalize
 * @returns Plugin that marks modules as external
 */
export function createExternalPlugin(patterns: (string | RegExp)[]): Plugin {
  return {
    name: 'external',
    setup(build) {
      for (const pattern of patterns) {
        const filter = typeof pattern === 'string' ? new RegExp(`^${escapeRegExp(pattern)}$`) : pattern;

        build.onResolve({ filter }, (args) => {
          return {
            path: args.path,
            external: true,
          };
        });
      }
    },
  };
}

/**
 * Escapes special regex characters in a string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
