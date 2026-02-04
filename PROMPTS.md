Initial prompt

You are a senior JS tooling engineer. Build an NPM library that compiles and bundles JavaScript applications entirely in the browser using esbuild-wasm and import maps.

GOAL
Create a package named: vibe-coding-bundler.
It should:
1) Run esbuild in the browser via esbuild-wasm
2) Resolve bare module imports using an import map (standard import map JSON)
3) Support both:
    - Bundling to a single ESM output string (for <script type="module"> execution)
    - “Multi-file” output (optional) where chunks are returned as an in-memory map of filename -> contents
4) Provide a clean programmatic API and an optional small CLI for local dev (CLI may run in Node but must reuse the same core logic where possible)

RUNTIME + CONSTRAINTS
- Primary runtime: modern browsers (Chromium/Firefox/Safari current-ish)
- No network access required *except* optional dependency fetching if the user supplies a fetcher
- Default usage should work with:
    - user-provided source files (in-memory)
    - user-provided import map
- Must not require a server for compilation; all compilation happens client-side.

FEATURE REQUIREMENTS
A) Public API (TypeScript):
- createBundler(options) -> bundler
- bundler.bundle(entryPoints, files, importMap, buildOptions?) -> result
- result includes:
  { outputFiles: Record<string,string>, metafile?, warnings, errors }
- support sourcemaps (inline or external)
- support JSX/TS/TSX (transpile only; typechecking not required)
- allow plugins:
    - onResolve-like hooks
    - onLoad-like hooks
      B) Import map resolution:
- Follow import maps spec for "imports" and "scopes"
- Allow mapping to:
    - full URLs (https://cdn…)
    - relative URLs
    - “virtual” internal IDs (like /__deps/react.js) when user provides a fetcher/loader
- If an import is not found in import map:
    - throw a clear error that lists the missing specifier and suggests adding it
      C) File system abstraction:
- The library must accept an in-memory file system object:
  files: { [path: string]: string | Uint8Array }
- Provide a default loader that reads from this object
  D) Optional fetching (pluggable):
- options.fetcher(specifierOrUrl) -> Promise<{ contents, loader, resolveDir }>
- cache fetched modules (in-memory) with LRU or simple Map
  E) esbuild-wasm initialization:
- Provide initialize({ wasmURL? }) or lazy initialization inside createBundler
- Handle parallel calls safely (init once)
  F) Output formats:
- ESM output (format: 'esm')
- IIFE output optional (format: 'iife') for older embedding
  G) Diagnostics:
- Return structured errors and warnings
- Include “trace” info for resolution errors (who imported what)
  H) Security and sandbox notes:
- Document that executing bundled output is user responsibility; do not eval by default

DELIVERABLES
1) Repository structure
    - src/
        - index.ts (public API)
        - bundler.ts (core)
        - importMap.ts (resolution logic)
        - fs.ts (in-memory fs + loaders)
        - plugins.ts (plugin types and glue)
        - cache.ts
    - test/ with a minimal test suite (vitest)
    - examples/ (browser demo)
    - package.json, tsconfig, build config (tsup or rollup)
2) Provide the full TypeScript implementation (not pseudocode)
3) Provide README.md with:
    - installation
    - quickstart example
    - import map examples (imports + scopes)
    - “fetcher” example (e.g., using esm.sh or unpkg)
    - browser demo usage
    - API reference
4) Include a minimal working browser example:
    - index.html loads the library (via ESM build)
    - user enters code in a textarea
    - user supplies an import map JSON
    - click “Build” outputs bundled code and errors
5) Ensure the package is tree-shakeable and has proper ESM exports
6) Ensure code is written defensively with good error messages

IMPORTANT TECHNICAL DETAILS
- Use esbuild-wasm’s plugin API (build with plugins) to implement import map resolution and in-memory loading.
- Implement import map matching rules correctly:
    - exact matches and prefix matches ending with "/"
    - scopes take precedence based on referrer URL / path
- Use resolveDir to support relative imports within fetched modules.
- Support both text and binary loaders (e.g. wasm, png) at least by pass-through or data URL option.
- Avoid Node-only APIs in the browser bundle. Separate Node CLI into /cli using conditional exports.
- This library will be used by many other tools, so keep it small and focused.
- This library will be used by a Vibe coding platform where AI generates the applications and we will use a virutal file system of just file names and strings that will be compiled and bundled at runtime.

Here are 5 visually impressive open source React projects that would make great demos:

1. Excalidraw (Whiteboard/Drawing)

https://github.com/excalidraw/excalidraw
- Why: Beautiful hand-drawn style whiteboard. Very interactive and visually striking. Has a standalone package that can be embedded.
- Complexity: Medium - has some dependencies but well-documented API

2. Novel (Notion-style Editor)

- Repo: https://github.com/steven-tey/novel
- Why: Gorgeous WYSIWYG editor with Notion-like slash commands, bubble menus, and smooth animations. Very polished UI.
- Complexity: Medium - uses Tiptap/ProseMirror under the hood

3. Tremor (Dashboard Components)

- Repo: https://github.com/tremorlabs/tremor
- Why: Beautiful charts, KPI cards, and dashboard components. Great for showing data visualization capabilities.
- Complexity: Low-Medium - component library with nice examples

4. React Email (Email Templates)

- Repo: https://github.com/resend/react-email

