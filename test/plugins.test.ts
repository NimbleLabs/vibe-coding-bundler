import { describe, it, expect } from 'vitest';
import {
  PluginOrchestrator,
  createVirtualModulePlugin,
  createAliasPlugin,
  createExternalPlugin,
} from '../src/plugins';
import type { Plugin } from '../src/types';

describe('PluginOrchestrator', () => {
  it('should register plugins', async () => {
    const orchestrator = new PluginOrchestrator();

    const plugin: Plugin = {
      name: 'test-plugin',
      setup(build) {
        build.onResolve({ filter: /.*/ }, () => null);
        build.onLoad({ filter: /.*/ }, () => null);
      },
    };

    await orchestrator.register(plugin);

    expect(orchestrator.handlerCount.resolve).toBe(1);
    expect(orchestrator.handlerCount.load).toBe(1);
    expect(orchestrator.pluginNames).toContain('test-plugin');
  });

  it('should run resolve handlers in registration order', async () => {
    const orchestrator = new PluginOrchestrator();
    const calls: string[] = [];

    await orchestrator.register({
      name: 'first',
      setup(build) {
        build.onResolve({ filter: /.*/ }, () => {
          calls.push('first');
          return null; // Continue to next
        });
      },
    });

    await orchestrator.register({
      name: 'second',
      setup(build) {
        build.onResolve({ filter: /.*/ }, () => {
          calls.push('second');
          return { path: '/resolved' };
        });
      },
    });

    const result = await orchestrator.runResolve({
      path: 'test',
      importer: '',
      namespace: 'file',
      resolveDir: '',
      kind: 'import-statement',
    });

    expect(calls).toEqual(['first', 'second']);
    expect(result?.path).toBe('/resolved');
  });

  it('should stop at first non-null result', async () => {
    const orchestrator = new PluginOrchestrator();
    const calls: string[] = [];

    await orchestrator.register({
      name: 'first',
      setup(build) {
        build.onResolve({ filter: /.*/ }, () => {
          calls.push('first');
          return { path: '/first-result' };
        });
      },
    });

    await orchestrator.register({
      name: 'second',
      setup(build) {
        build.onResolve({ filter: /.*/ }, () => {
          calls.push('second');
          return { path: '/second-result' };
        });
      },
    });

    const result = await orchestrator.runResolve({
      path: 'test',
      importer: '',
      namespace: 'file',
      resolveDir: '',
      kind: 'import-statement',
    });

    expect(calls).toEqual(['first']); // Second should not be called
    expect(result?.path).toBe('/first-result');
  });

  it('should filter by regex pattern', async () => {
    const orchestrator = new PluginOrchestrator();

    await orchestrator.register({
      name: 'ts-only',
      setup(build) {
        build.onResolve({ filter: /\.ts$/ }, (args) => ({
          path: `/resolved/${args.path}`,
        }));
      },
    });

    const tsResult = await orchestrator.runResolve({
      path: 'foo.ts',
      importer: '',
      namespace: 'file',
      resolveDir: '',
      kind: 'import-statement',
    });

    const jsResult = await orchestrator.runResolve({
      path: 'foo.js',
      importer: '',
      namespace: 'file',
      resolveDir: '',
      kind: 'import-statement',
    });

    expect(tsResult?.path).toBe('/resolved/foo.ts');
    expect(jsResult).toBeNull();
  });

  it('should filter by namespace', async () => {
    const orchestrator = new PluginOrchestrator();

    await orchestrator.register({
      name: 'special-namespace',
      setup(build) {
        build.onLoad({ filter: /.*/, namespace: 'special' }, () => ({
          contents: 'special content',
        }));
      },
    });

    const noMatch = await orchestrator.runLoad({
      path: 'test',
      namespace: 'file',
      suffix: '',
    });

    const match = await orchestrator.runLoad({
      path: 'test',
      namespace: 'special',
      suffix: '',
    });

    expect(noMatch).toBeNull();
    expect(match?.contents).toBe('special content');
  });

  it('should handle async plugin setup', async () => {
    const orchestrator = new PluginOrchestrator();

    await orchestrator.register({
      name: 'async-plugin',
      async setup(build) {
        // Simulate async setup
        await new Promise((resolve) => setTimeout(resolve, 10));
        build.onResolve({ filter: /.*/ }, () => ({ path: '/async-resolved' }));
      },
    });

    const result = await orchestrator.runResolve({
      path: 'test',
      importer: '',
      namespace: 'file',
      resolveDir: '',
      kind: 'import-statement',
    });

    expect(result?.path).toBe('/async-resolved');
  });

  it('should handle async callbacks', async () => {
    const orchestrator = new PluginOrchestrator();

    await orchestrator.register({
      name: 'async-callback',
      setup(build) {
        build.onResolve({ filter: /.*/ }, async () => {
          await new Promise((resolve) => setTimeout(resolve, 10));
          return { path: '/async-result' };
        });
      },
    });

    const result = await orchestrator.runResolve({
      path: 'test',
      importer: '',
      namespace: 'file',
      resolveDir: '',
      kind: 'import-statement',
    });

    expect(result?.path).toBe('/async-result');
  });

  it('should clear handlers', async () => {
    const orchestrator = new PluginOrchestrator();

    await orchestrator.register({
      name: 'test',
      setup(build) {
        build.onResolve({ filter: /.*/ }, () => ({ path: '/test' }));
      },
    });

    expect(orchestrator.handlerCount.resolve).toBe(1);

    orchestrator.clear();

    expect(orchestrator.handlerCount.resolve).toBe(0);
    expect(orchestrator.pluginNames).toEqual([]);
  });
});

describe('createVirtualModulePlugin', () => {
  it('should resolve and load virtual modules', async () => {
    const plugin = createVirtualModulePlugin({
      'virtual:config': 'export default { debug: true };',
      'virtual:env': 'export const NODE_ENV = "production";',
    });

    const orchestrator = new PluginOrchestrator();
    await orchestrator.register(plugin);

    // Test resolution
    const resolved = await orchestrator.runResolve({
      path: 'virtual:config',
      importer: '',
      namespace: 'file',
      resolveDir: '',
      kind: 'import-statement',
    });

    expect(resolved?.path).toBe('virtual:config');
    expect(resolved?.namespace).toBe('virtual-module');

    // Test loading
    const loaded = await orchestrator.runLoad({
      path: 'virtual:config',
      namespace: 'virtual-module',
      suffix: '',
    });

    expect(loaded?.contents).toBe('export default { debug: true };');
    expect(loaded?.loader).toBe('js');
  });

  it('should not resolve non-virtual modules', async () => {
    const plugin = createVirtualModulePlugin({
      'virtual:config': 'export default {};',
    });

    const orchestrator = new PluginOrchestrator();
    await orchestrator.register(plugin);

    const resolved = await orchestrator.runResolve({
      path: 'lodash',
      importer: '',
      namespace: 'file',
      resolveDir: '',
      kind: 'import-statement',
    });

    expect(resolved).toBeNull();
  });
});

describe('createAliasPlugin', () => {
  it('should resolve aliased modules', async () => {
    const plugin = createAliasPlugin({
      lodash: 'lodash-es',
      '@/utils': '/src/utils',
    });

    const orchestrator = new PluginOrchestrator();
    await orchestrator.register(plugin);

    const lodashResult = await orchestrator.runResolve({
      path: 'lodash',
      importer: '',
      namespace: 'file',
      resolveDir: '',
      kind: 'import-statement',
    });

    const utilsResult = await orchestrator.runResolve({
      path: '@/utils',
      importer: '',
      namespace: 'file',
      resolveDir: '',
      kind: 'import-statement',
    });

    expect(lodashResult?.path).toBe('lodash-es');
    expect(utilsResult?.path).toBe('/src/utils');
  });

  it('should not resolve non-aliased modules', async () => {
    const plugin = createAliasPlugin({
      lodash: 'lodash-es',
    });

    const orchestrator = new PluginOrchestrator();
    await orchestrator.register(plugin);

    const result = await orchestrator.runResolve({
      path: 'react',
      importer: '',
      namespace: 'file',
      resolveDir: '',
      kind: 'import-statement',
    });

    expect(result).toBeNull();
  });
});

describe('createExternalPlugin', () => {
  it('should mark string patterns as external', async () => {
    const plugin = createExternalPlugin(['lodash', 'react']);

    const orchestrator = new PluginOrchestrator();
    await orchestrator.register(plugin);

    const lodashResult = await orchestrator.runResolve({
      path: 'lodash',
      importer: '',
      namespace: 'file',
      resolveDir: '',
      kind: 'import-statement',
    });

    expect(lodashResult?.external).toBe(true);
    expect(lodashResult?.path).toBe('lodash');
  });

  it('should mark regex patterns as external', async () => {
    const plugin = createExternalPlugin([/^node:.*/]);

    const orchestrator = new PluginOrchestrator();
    await orchestrator.register(plugin);

    const result = await orchestrator.runResolve({
      path: 'node:fs',
      importer: '',
      namespace: 'file',
      resolveDir: '',
      kind: 'import-statement',
    });

    expect(result?.external).toBe(true);
  });

  it('should not affect non-matching modules', async () => {
    const plugin = createExternalPlugin(['lodash']);

    const orchestrator = new PluginOrchestrator();
    await orchestrator.register(plugin);

    const result = await orchestrator.runResolve({
      path: 'react',
      importer: '',
      namespace: 'file',
      resolveDir: '',
      kind: 'import-statement',
    });

    expect(result).toBeNull();
  });
});
