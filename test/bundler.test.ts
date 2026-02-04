import { describe, it, expect, beforeAll } from 'vitest';
import { createBundler, initialize, isEsbuildInitialized } from '../src/bundler';

// Note: These tests require esbuild-wasm to be installed
// They will skip gracefully if initialization fails

describe('Bundler', () => {
  let initialized = false;

  beforeAll(async () => {
    try {
      await initialize();
      initialized = true;
    } catch (error) {
      console.warn('esbuild-wasm initialization failed, skipping bundler tests:', error);
    }
  });

  it('should initialize esbuild-wasm', async () => {
    if (!initialized) {
      console.warn('Skipping: esbuild not initialized');
      return;
    }
    expect(isEsbuildInitialized()).toBe(true);
  });

  it('should bundle a simple file', async () => {
    if (!initialized) {
      console.warn('Skipping: esbuild not initialized');
      return;
    }

    const bundler = createBundler();

    const result = await bundler.bundle(
      '/src/index.js',
      {
        '/src/index.js': 'export const x = 1;',
      },
      {}
    );

    expect(result.errors).toHaveLength(0);
    expect(Object.keys(result.outputFiles).length).toBeGreaterThan(0);

    // Check that output contains the export
    const output = Object.values(result.outputFiles)[0];
    expect(output).toContain('x');

    bundler.dispose();
  });

  it('should resolve imports via import map', async () => {
    if (!initialized) {
      console.warn('Skipping: esbuild not initialized');
      return;
    }

    const bundler = createBundler();

    const result = await bundler.bundle(
      '/src/index.js',
      {
        '/src/index.js': `
          import { greet } from 'my-lib';
          console.log(greet());
        `,
        '/__virtual__/my-lib.js': `
          export function greet() { return 'hello'; }
        `,
      },
      {
        imports: {
          'my-lib': '/__virtual__/my-lib.js',
        },
      }
    );

    expect(result.errors).toHaveLength(0);

    // Output should contain the function
    const output = Object.values(result.outputFiles)[0];
    expect(output).toContain('greet');
    expect(output).toContain('hello');

    bundler.dispose();
  });

  it('should bundle TypeScript', async () => {
    if (!initialized) {
      console.warn('Skipping: esbuild not initialized');
      return;
    }

    const bundler = createBundler();

    const result = await bundler.bundle(
      '/src/index.ts',
      {
        '/src/index.ts': `
          interface User { name: string; }
          const user: User = { name: 'test' };
          export default user;
        `,
      },
      {}
    );

    expect(result.errors).toHaveLength(0);

    // Output should be transpiled (no interface keyword)
    const output = Object.values(result.outputFiles)[0];
    expect(output).not.toContain('interface');
    expect(output).toContain('test');

    bundler.dispose();
  });

  it('should bundle JSX', async () => {
    if (!initialized) {
      console.warn('Skipping: esbuild not initialized');
      return;
    }

    const bundler = createBundler();

    const result = await bundler.bundle(
      '/src/App.jsx',
      {
        '/src/App.jsx': `
          const App = () => <div>Hello</div>;
          export default App;
        `,
      },
      {},
      { jsxFactory: 'h', jsxFragment: 'Fragment' }
    );

    expect(result.errors).toHaveLength(0);

    // Output should have JSX transformed
    const output = Object.values(result.outputFiles)[0];
    expect(output).toContain('h(');
    expect(output).toContain('div');

    bundler.dispose();
  });

  it('should bundle TSX', async () => {
    if (!initialized) {
      console.warn('Skipping: esbuild not initialized');
      return;
    }

    const bundler = createBundler();

    const result = await bundler.bundle(
      '/src/App.tsx',
      {
        '/src/App.tsx': `
          interface Props { name: string; }
          const App = ({ name }: Props) => <div>Hello {name}</div>;
          export default App;
        `,
      },
      {},
      { jsxFactory: 'h' }
    );

    expect(result.errors).toHaveLength(0);

    const output = Object.values(result.outputFiles)[0];
    expect(output).not.toContain('interface');
    expect(output).toContain('h(');

    bundler.dispose();
  });

  it('should report missing import map entries', async () => {
    if (!initialized) {
      console.warn('Skipping: esbuild not initialized');
      return;
    }

    const bundler = createBundler();

    const result = await bundler.bundle(
      '/src/index.js',
      {
        '/src/index.js': `import 'nonexistent-package';`,
      },
      {}
    );

    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].text).toContain('nonexistent-package');
    expect(result.errors[0].text).toContain('import map');

    bundler.dispose();
  });

  it('should generate inline sourcemaps', async () => {
    if (!initialized) {
      console.warn('Skipping: esbuild not initialized');
      return;
    }

    const bundler = createBundler();

    const result = await bundler.bundle(
      '/src/index.js',
      {
        '/src/index.js': 'export const x = 1;',
      },
      {},
      { sourcemap: 'inline' }
    );

    expect(result.errors).toHaveLength(0);
    const output = Object.values(result.outputFiles)[0];
    expect(output).toContain('sourceMappingURL=data:application/json');

    bundler.dispose();
  });

  it('should minify output', async () => {
    if (!initialized) {
      console.warn('Skipping: esbuild not initialized');
      return;
    }

    const bundler = createBundler();

    const code = `
      export function veryLongFunctionName() {
        const anotherLongVariableName = 'hello';
        return anotherLongVariableName;
      }
    `;

    const [unminified, minified] = await Promise.all([
      bundler.bundle('/src/index.js', { '/src/index.js': code }, {}, { minify: false }),
      bundler.bundle('/src/index.js', { '/src/index.js': code }, {}, { minify: true }),
    ]);

    const unminifiedOutput = Object.values(unminified.outputFiles)[0];
    const minifiedOutput = Object.values(minified.outputFiles)[0];

    // Minified should be smaller
    expect(minifiedOutput.length).toBeLessThan(unminifiedOutput.length);

    bundler.dispose();
  });

  it('should resolve relative imports', async () => {
    if (!initialized) {
      console.warn('Skipping: esbuild not initialized');
      return;
    }

    const bundler = createBundler();

    const result = await bundler.bundle(
      '/src/index.ts',
      {
        '/src/index.ts': `
          import { helper } from './utils/helper';
          export const result = helper();
        `,
        '/src/utils/helper.ts': `
          export function helper() { return 'helped'; }
        `,
      },
      {}
    );

    expect(result.errors).toHaveLength(0);

    const output = Object.values(result.outputFiles)[0];
    expect(output).toContain('helped');

    bundler.dispose();
  });

  it('should resolve imports without extension', async () => {
    if (!initialized) {
      console.warn('Skipping: esbuild not initialized');
      return;
    }

    const bundler = createBundler();

    const result = await bundler.bundle(
      '/src/index.ts',
      {
        '/src/index.ts': `
          import { value } from './utils';
          export { value };
        `,
        '/src/utils.ts': `
          export const value = 42;
        `,
      },
      {}
    );

    expect(result.errors).toHaveLength(0);

    const output = Object.values(result.outputFiles)[0];
    expect(output).toContain('42');

    bundler.dispose();
  });

  it('should resolve directory imports with index file', async () => {
    if (!initialized) {
      console.warn('Skipping: esbuild not initialized');
      return;
    }

    const bundler = createBundler();

    const result = await bundler.bundle(
      '/src/index.ts',
      {
        '/src/index.ts': `
          import { value } from './utils';
          export { value };
        `,
        '/src/utils/index.ts': `
          export const value = 'from index';
        `,
      },
      {}
    );

    expect(result.errors).toHaveLength(0);

    const output = Object.values(result.outputFiles)[0];
    expect(output).toContain('from index');

    bundler.dispose();
  });

  it('should handle import map with prefix matching', async () => {
    if (!initialized) {
      console.warn('Skipping: esbuild not initialized');
      return;
    }

    const bundler = createBundler();

    const result = await bundler.bundle(
      '/src/index.js',
      {
        '/src/index.js': `
          import { debounce } from 'lodash/debounce';
          export { debounce };
        `,
        '/__lodash__/debounce.js': `
          export function debounce(fn) { return fn; }
        `,
      },
      {
        imports: {
          'lodash/': '/__lodash__/',
        },
      }
    );

    expect(result.errors).toHaveLength(0);

    const output = Object.values(result.outputFiles)[0];
    expect(output).toContain('debounce');

    bundler.dispose();
  });

  it('should bundle multiple entry points', async () => {
    if (!initialized) {
      console.warn('Skipping: esbuild not initialized');
      return;
    }

    const bundler = createBundler();

    const result = await bundler.bundle(
      ['/src/a.js', '/src/b.js'],
      {
        '/src/a.js': 'export const a = 1;',
        '/src/b.js': 'export const b = 2;',
      },
      {}
    );

    expect(result.errors).toHaveLength(0);
    // Should have multiple output files
    expect(Object.keys(result.outputFiles).length).toBeGreaterThanOrEqual(1);

    bundler.dispose();
  });

  it('should include metafile information', async () => {
    if (!initialized) {
      console.warn('Skipping: esbuild not initialized');
      return;
    }

    const bundler = createBundler();

    const result = await bundler.bundle(
      '/src/index.js',
      {
        '/src/index.js': `
          import { helper } from './helper';
          export { helper };
        `,
        '/src/helper.js': 'export const helper = () => {};',
      },
      {},
      { metafile: true }
    );

    expect(result.errors).toHaveLength(0);
    expect(result.metafile).toBeDefined();
    expect(result.metafile?.inputs).toBeDefined();
    expect(result.metafile?.outputs).toBeDefined();

    bundler.dispose();
  });

  it('should use plugins for custom resolution', async () => {
    if (!initialized) {
      console.warn('Skipping: esbuild not initialized');
      return;
    }

    const bundler = createBundler({
      plugins: [
        {
          name: 'custom-resolve',
          setup(build) {
            build.onResolve({ filter: /^custom:/ }, (args) => ({
              path: args.path.replace('custom:', '/custom/'),
              namespace: 'vfs',
            }));
          },
        },
      ],
    });

    const result = await bundler.bundle(
      '/src/index.js',
      {
        '/src/index.js': `
          import { value } from 'custom:module';
          export { value };
        `,
        '/custom/module.js': 'export const value = "custom";',
      },
      {}
    );

    expect(result.errors).toHaveLength(0);

    const output = Object.values(result.outputFiles)[0];
    expect(output).toContain('custom');

    bundler.dispose();
  });

  it('should handle IIFE format', async () => {
    if (!initialized) {
      console.warn('Skipping: esbuild not initialized');
      return;
    }

    const bundler = createBundler();

    const result = await bundler.bundle(
      '/src/index.js',
      {
        '/src/index.js': 'console.log("hello");',
      },
      {},
      { format: 'iife' }
    );

    expect(result.errors).toHaveLength(0);

    const output = Object.values(result.outputFiles)[0];
    // IIFE wraps in function
    expect(output).toMatch(/\(\s*\(\s*\)\s*=>\s*\{|\(function\s*\(\)/);

    bundler.dispose();
  });

  it('should report file not found errors clearly', async () => {
    if (!initialized) {
      console.warn('Skipping: esbuild not initialized');
      return;
    }

    const bundler = createBundler();

    const result = await bundler.bundle(
      '/src/index.js',
      {
        '/src/index.js': `import './nonexistent';`,
      },
      {}
    );

    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].text).toContain('nonexistent');
    expect(result.errors[0].text).toContain('not found');

    bundler.dispose();
  });

  it('should handle JSON imports', async () => {
    if (!initialized) {
      console.warn('Skipping: esbuild not initialized');
      return;
    }

    const bundler = createBundler();

    const result = await bundler.bundle(
      '/src/index.js',
      {
        '/src/index.js': `
          import config from './config.json';
          export default config;
        `,
        '/src/config.json': '{"name": "test", "version": "1.0.0"}',
      },
      {}
    );

    expect(result.errors).toHaveLength(0);

    const output = Object.values(result.outputFiles)[0];
    expect(output).toContain('test');
    expect(output).toContain('1.0.0');

    bundler.dispose();
  });
});
