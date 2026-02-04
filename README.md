# vibe-coding-bundler

A browser-based JavaScript bundler using [esbuild-wasm](https://esbuild.github.io/) with import map support. Bundle JavaScript and TypeScript applications entirely in the browser without requiring a server.

## Features

- **Browser-native bundling** - Uses esbuild-wasm for fast, in-browser compilation
- **Import maps support** - Resolve bare specifiers using the standard [import maps](https://github.com/WICG/import-maps) specification
- **Virtual file system** - Bundle from in-memory files without disk access
- **TypeScript & JSX** - Full support for .ts, .tsx, .jsx files (transpilation only)
- **Plugin system** - Extensible with onResolve and onLoad hooks
- **Multiple output formats** - ESM, IIFE, and CJS output
- **Sourcemaps** - Inline or external sourcemap generation
- **Tree shaking** - Dead code elimination enabled by default
- **CLI included** - Optional Node.js CLI for local development

## Installation

```bash
npm install vibe-coding-bundler
```

## Quick Start

### Browser Usage

```typescript
import { createBundler, initialize } from 'vibe-coding-bundler';

// Initialize esbuild-wasm (only needed once)
await initialize();

// Create a bundler instance
const bundler = createBundler({
  // Optional: fetcher for external URLs
  fetcher: async (url) => {
    const response = await fetch(url);
    return { contents: await response.text() };
  },
});

// Bundle your code
const result = await bundler.bundle(
  '/src/index.ts',
  {
    '/src/index.ts': `
      import { useState } from 'react';
      export function App() {
        const [count, setCount] = useState(0);
        return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
      }
    `,
  },
  {
    imports: {
      react: 'https://esm.sh/react@18',
      'react/': 'https://esm.sh/react@18/',
    },
  },
  {
    format: 'esm',
    minify: true,
    sourcemap: 'inline',
  }
);

console.log(result.outputFiles); // { 'index.js': '...' }
```

### CLI Usage

```bash
# Bundle a file
npx vibe-bundler bundle src/index.ts -o dist

# Watch mode
npx vibe-bundler watch src/index.ts -o dist

# With import map
npx vibe-bundler bundle src/index.ts --import-map import-map.json

# Minify and generate sourcemaps
npx vibe-bundler bundle src/index.ts -m --sourcemap
```

## Import Maps

Import maps allow you to control how bare specifiers (like `import 'react'`) are resolved.

### Basic Usage

```typescript
const importMap = {
  imports: {
    // Exact matches
    react: 'https://esm.sh/react@18',
    'react-dom': 'https://esm.sh/react-dom@18',

    // Prefix matches (note the trailing slash)
    'lodash/': 'https://esm.sh/lodash-es/',

    // Scoped packages
    '@scope/pkg': 'https://esm.sh/@scope/pkg',
  },
};
```

### Scopes

Scopes allow different import mappings for different parts of your codebase:

```typescript
const importMap = {
  imports: {
    lodash: 'https://esm.sh/lodash@4',
  },
  scopes: {
    '/legacy/': {
      // Files in /legacy/ use lodash v3
      lodash: 'https://esm.sh/lodash@3',
    },
  },
};
```

### With CDN Services

**Using esm.sh:**

```typescript
const importMap = {
  imports: {
    react: 'https://esm.sh/react@18',
    'react-dom': 'https://esm.sh/react-dom@18',
    'react-dom/client': 'https://esm.sh/react-dom@18/client',
  },
};
```

**Using unpkg:**

```typescript
const importMap = {
  imports: {
    lodash: 'https://unpkg.com/lodash-es@4/lodash.js',
  },
};
```

**Using Skypack:**

```typescript
const importMap = {
  imports: {
    preact: 'https://cdn.skypack.dev/preact',
  },
};
```

## Custom Fetcher

Provide a fetcher to load external URLs:

```typescript
const bundler = createBundler({
  fetcher: async (url) => {
    // Add custom headers, caching, etc.
    const response = await fetch(url, {
      headers: { 'X-Custom-Header': 'value' },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contents = await response.text();

    return {
      contents,
      // Optional: specify the loader
      loader: 'js',
      // Optional: base URL for relative imports in this module
      resolveDir: url.substring(0, url.lastIndexOf('/') + 1),
    };
  },
  cache: {
    maxSize: 100, // Max cached modules
    ttl: 60000, // Cache TTL in ms
  },
});
```

## Plugins

Extend the bundler with custom resolution and loading logic:

```typescript
const myPlugin = {
  name: 'my-plugin',
  setup(build) {
    // Custom resolution
    build.onResolve({ filter: /^virtual:/ }, (args) => ({
      path: args.path,
      namespace: 'virtual',
    }));

    // Custom loading
    build.onLoad({ filter: /.*/, namespace: 'virtual' }, (args) => ({
      contents: `export default "Hello from ${args.path}"`,
      loader: 'js',
    }));
  },
};

const bundler = createBundler({
  plugins: [myPlugin],
});
```

### Built-in Plugin Helpers

```typescript
import {
  createVirtualModulePlugin,
  createAliasPlugin,
  createExternalPlugin,
} from 'vibe-coding-bundler';

// Virtual modules
const virtualPlugin = createVirtualModulePlugin({
  'virtual:config': 'export default { debug: true };',
});

// Aliases
const aliasPlugin = createAliasPlugin({
  '@/utils': '/src/utils',
  lodash: 'lodash-es',
});

// Externals
const externalPlugin = createExternalPlugin(['fs', 'path', /^node:/]);
```

## API Reference

### `initialize(options?)`

Initialize esbuild-wasm. Safe to call multiple times.

```typescript
interface InitOptions {
  wasmURL?: string; // URL to esbuild.wasm (uses CDN by default)
}
```

### `createBundler(options?)`

Create a bundler instance.

```typescript
interface BundlerOptions {
  plugins?: Plugin[];
  fetcher?: (url: string) => Promise<FetchResult>;
  cache?: { maxSize?: number; ttl?: number };
  baseURL?: string; // Base URL for import map resolution
}
```

### `bundler.bundle(entryPoints, files, importMap, options?)`

Bundle entry points.

```typescript
interface BuildOptions {
  format?: 'esm' | 'iife' | 'cjs';
  platform?: 'browser' | 'node' | 'neutral';
  minify?: boolean;
  sourcemap?: boolean | 'inline' | 'external';
  splitting?: boolean;
  target?: string | string[];
  external?: string[];
  define?: Record<string, string>;
  jsxFactory?: string;
  jsxFragment?: string;
  jsx?: 'transform' | 'preserve' | 'automatic';
  jsxImportSource?: string;
}

interface BundleResult {
  outputFiles: Record<string, string>;
  metafile?: Metafile;
  warnings: PluginMessage[];
  errors: PluginMessage[];
}
```

### `bundler.dispose()`

Clean up resources and clear caches.

## Browser Demo

A browser demo is included in the `examples/browser` directory:

```bash
# Build the library first
npm run build

# Serve the examples directory
npx serve examples/browser
```

Open http://localhost:3000 to try the interactive bundler.

## CLI Configuration

Create a `vibe-bundler.config.js` file:

```javascript
export default {
  entry: ['src/index.ts'],
  outdir: 'dist',
  importMap: {
    imports: {
      react: 'https://esm.sh/react@18',
    },
  },
  buildOptions: {
    format: 'esm',
    minify: true,
    sourcemap: true,
  },
};
```

Or use JSON import map file:

```javascript
export default {
  entry: ['src/index.ts'],
  outdir: 'dist',
  importMap: './import-map.json',
};
```

## Security Notes

- **User Responsibility**: Executing bundled output (e.g., via `eval()` or `new Function()`) is the user's responsibility. This library does not execute code by default.
- **External URLs**: When using a fetcher, ensure you trust the sources being fetched.
- **Sandboxing**: For untrusted code, consider running in a sandboxed iframe or Web Worker.

## Browser Compatibility

- Chrome/Edge 80+
- Firefox 80+
- Safari 14+

Requires support for:

- ES2020
- WebAssembly
- Dynamic imports
- Web Workers (optional, for better performance)

## License

MIT

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting a PR.

## Acknowledgments

- [esbuild](https://esbuild.github.io/) - The incredibly fast bundler that powers this library
- [WICG Import Maps](https://github.com/WICG/import-maps) - The specification this library implements
