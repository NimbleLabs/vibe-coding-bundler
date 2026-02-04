/**
 * React Flow Examples - Runtime Bundler Loader
 *
 * This script loads all React Flow example source files and compiles them
 * at runtime using vibe-coding-bundler (esbuild-wasm based).
 *
 * Import maps are dynamically generated from package.json dependencies,
 * showcasing how AI-generated projects can be bundled without manual
 * configuration.
 */

// =============================================================================
// FILE MANIFEST - All source files to load into VFS
// =============================================================================

// Base path for source files (relative to where HTML is served)
const BASE_PATH = './src';

// Virtual paths (used in VFS) mapped from real fetch paths
const FILE_MANIFEST = [
  // Core app files
  'main.tsx',
  'App/index.tsx',
  'App/header.tsx',
  'App/routes.ts',
  'index.css',
  'app.d.ts',
  'vite-env.d.ts',

  // Examples
  'examples/A11y/index.tsx',
  'examples/AddNodeOnEdgeDrop/index.tsx',
  'examples/Backgrounds/index.tsx',
  'examples/Backgrounds/style.module.css',
  'examples/Basic/index.tsx',
  'examples/BrokenNodes/index.tsx',
  'examples/CancelConnection/data.ts',
  'examples/CancelConnection/hooks/useCountdown.ts',
  'examples/CancelConnection/index.tsx',
  'examples/CancelConnection/Timer.module.css',
  'examples/CancelConnection/Timer.tsx',
  'examples/ClickDistance/index.tsx',
  'examples/ColorMode/index.tsx',
  'examples/ControlledUncontrolled/index.tsx',
  'examples/ControlledViewport/index.tsx',
  'examples/CustomConnectionLine/ConnectionLine.tsx',
  'examples/CustomConnectionLine/index.tsx',
  'examples/CustomMiniMapNode/index.tsx',
  'examples/CustomNode/ColorSelectorNode.tsx',
  'examples/CustomNode/index.tsx',
  'examples/DefaultEdgeOverwrite/index.tsx',
  'examples/DefaultNodeOverwrite/index.tsx',
  'examples/DefaultNodes/index.tsx',
  'examples/DetachedHandle/index.tsx',
  'examples/DetachedHandle/style.css',
  'examples/DevTools/DevTools/ChangeLogger.tsx',
  'examples/DevTools/DevTools/index.tsx',
  'examples/DevTools/DevTools/NodeInspector.tsx',
  'examples/DevTools/DevTools/style.css',
  'examples/DevTools/index.tsx',
  'examples/DragHandle/DragHandleNode.tsx',
  'examples/DragHandle/index.tsx',
  'examples/DragNDrop/dnd.module.css',
  'examples/DragNDrop/index.tsx',
  'examples/DragNDrop/Sidebar.tsx',
  'examples/EasyConnect/CustomConnectionLine.tsx',
  'examples/EasyConnect/CustomNode.tsx',
  'examples/EasyConnect/FloatingEdge.tsx',
  'examples/EasyConnect/index.tsx',
  'examples/EasyConnect/style.css',
  'examples/EasyConnect/utils.tsx',
  'examples/EdgeRenderer/CustomEdge.tsx',
  'examples/EdgeRenderer/CustomEdge2.tsx',
  'examples/EdgeRenderer/index.tsx',
  'examples/EdgeRouting/index.tsx',
  'examples/Edges/CustomEdge.tsx',
  'examples/Edges/CustomEdge2.tsx',
  'examples/Edges/CustomEdge3.css',
  'examples/Edges/CustomEdge3.tsx',
  'examples/Edges/index.tsx',
  'examples/EdgeToolbar/CustomEdge.tsx',
  'examples/EdgeToolbar/index.tsx',
  'examples/EdgeTypes/index.tsx',
  'examples/EdgeTypes/utils.ts',
  'examples/Empty/index.tsx',
  'examples/Figma/index.tsx',
  'examples/FloatingEdges/FloatingConnectionLine.tsx',
  'examples/FloatingEdges/FloatingEdge.tsx',
  'examples/FloatingEdges/index.tsx',
  'examples/FloatingEdges/style.module.css',
  'examples/FloatingEdges/utils.ts',
  'examples/Hidden/index.tsx',
  'examples/Interaction/index.tsx',
  'examples/InteractiveMinimap/index.tsx',
  'examples/Intersection/index.tsx',
  'examples/Intersection/style.css',
  'examples/Layouting/index.tsx',
  'examples/Layouting/initial-elements.ts',
  'examples/Layouting/layouting.module.css',
  'examples/Middlewares/index.tsx',
  'examples/Middlewares/RestrictExtent.tsx',
  'examples/MovingHandles/index.tsx',
  'examples/MovingHandles/MovingHandleNode.tsx',
  'examples/MultiFlows/index.tsx',
  'examples/MultiFlows/multiflows.module.css',
  'examples/MultiSetNodes/index.tsx',
  'examples/MultiSetNodes/style.css',
  'examples/NodeResizer/BottomRightResizer.tsx',
  'examples/NodeResizer/CustomResizer.tsx',
  'examples/NodeResizer/DefaultResizer.tsx',
  'examples/NodeResizer/HorizontalResizer.tsx',
  'examples/NodeResizer/index.tsx',
  'examples/NodeResizer/ResizeIcon.tsx',
  'examples/NodeResizer/VerticalResizer.tsx',
  'examples/NodeToolbar/CustomNode.tsx',
  'examples/NodeToolbar/index.tsx',
  'examples/NodeToolbar/SelectedNodesToolbar.tsx',
  'examples/NodeTypeChange/index.tsx',
  'examples/NodeTypesObjectChange/index.tsx',
  'examples/Overview/index.tsx',
  'examples/Provider/index.tsx',
  'examples/Provider/provider.module.css',
  'examples/Provider/Sidebar.tsx',
  'examples/ReconnectEdge/index.tsx',
  'examples/Redux/index.tsx',
  'examples/Redux/initial-elements.tsx',
  'examples/Redux/state.ts',
  'examples/SaveRestore/Controls.tsx',
  'examples/SaveRestore/index.tsx',
  'examples/SaveRestore/save.module.css',
  'examples/SetNodesBatching/index.tsx',
  'examples/Stress/index.tsx',
  'examples/Stress/performanceUtils.ts',
  'examples/Stress/utils.ts',
  'examples/Subflow/DebugNode.tsx',
  'examples/Subflow/index.tsx',
  'examples/Switch/index.tsx',
  'examples/TouchDevice/index.tsx',
  'examples/TouchDevice/touch-device.css',
  'examples/Undirectional/CustomNode.tsx',
  'examples/Undirectional/index.tsx',
  'examples/UpdateNode/index.tsx',
  'examples/UpdateNode/updatenode.module.css',
  'examples/UseConnection/index.tsx',
  'examples/UseKeyPress/index.tsx',
  'examples/UseNodeConnections/index.tsx',
  'examples/UseNodeConnections/MultiHandleNode.tsx',
  'examples/UseNodeConnections/SingleHandleNode.tsx',
  'examples/UseNodesData/index.tsx',
  'examples/UseNodesData/ResultNode.tsx',
  'examples/UseNodesData/TextNode.tsx',
  'examples/UseNodesData/UppercaseNode.tsx',
  'examples/UseNodesInit/index.tsx',
  'examples/UseOnSelectionChange/CustomNode.tsx',
  'examples/UseOnSelectionChange/index.tsx',
  'examples/UseReactFlow/index.tsx',
  'examples/UseUpdateNodeInternals/CustomNode.tsx',
  'examples/UseUpdateNodeInternals/index.tsx',
  'examples/Validation/ConnectionStatus.tsx',
  'examples/Validation/index.tsx',
  'examples/Validation/validation.module.css',
  'examples/ZIndexMode/index.tsx',
];

// =============================================================================
// IMPORT MAP CONFIGURATION
// =============================================================================

// Dev dependencies to exclude from import map (not needed at runtime)
const EXCLUDE_PACKAGES = [
  '@cypress/skip-test',
  '@types/dagre',
  '@types/react',
  '@types/react-dom',
  '@vitejs/plugin-react',
  '@vitejs/plugin-react-swc',
  'cypress',
  'cypress-real-events',
  'start-server-and-test',
  'typescript',
  'vite',
];

// Manual overrides for packages needing special handling
const IMPORT_MAP_OVERRIDES = {
  // @xyflow subpaths need externals in the URL
  '@xyflow/react/': 'https://esm.sh/@xyflow/react@12.10.0&external=react,react-dom/',
};

// =============================================================================
// UI HELPERS
// =============================================================================

const progressBar = document.getElementById('progress-bar');
const loadingStatus = document.getElementById('loading-status');
const loadingOverlay = document.getElementById('loading-overlay');

function updateProgress(percent, status) {
  if (progressBar) progressBar.style.width = `${percent}%`;
  if (loadingStatus) loadingStatus.textContent = status;
}

function showError(title, message) {
  if (loadingOverlay) {
    loadingOverlay.innerHTML = `
      <div class="error-container">
        <div class="error-title">${title}</div>
        <div class="error-message">${message}</div>
      </div>
    `;
  }
}

function hideLoading() {
  if (loadingOverlay) {
    loadingOverlay.classList.add('hidden');
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 300);
  }
}

// =============================================================================
// CSS HANDLING
// =============================================================================

/**
 * Extracts class names from CSS content for CSS modules
 */
function extractCSSClassNames(cssContent) {
  const classNames = new Set();
  // Match class selectors like .className or .class-name
  const classRegex = /\.([a-zA-Z_][a-zA-Z0-9_-]*)\s*[,\{:]/g;
  let match;
  while ((match = classRegex.exec(cssContent)) !== null) {
    // Skip pseudo-classes and common CSS classes we don't want to export
    const className = match[1];
    if (!className.startsWith('react-flow') && !className.startsWith('xy-')) {
      classNames.add(className);
    }
  }
  return [...classNames];
}

/**
 * Generates a JS module that exports CSS class names as an object
 * This simulates CSS modules behavior (without scoping)
 */
function generateCSSModuleJS(classNames) {
  if (classNames.length === 0) {
    return 'export default {};';
  }
  const exports = classNames.map(c => `  "${c}": "${c}"`).join(',\n');
  return `export default {\n${exports}\n};`;
}

/**
 * Injects CSS into the document head
 */
function injectCSS(cssContent, id) {
  const existing = document.getElementById(id);
  if (existing) {
    existing.textContent = cssContent;
    return;
  }
  const style = document.createElement('style');
  style.id = id;
  style.textContent = cssContent;
  document.head.appendChild(style);
}

// =============================================================================
// FILE LOADING
// =============================================================================

/**
 * Loads all source files from the server
 * Fetches from BASE_PATH but stores in VFS with /src/ prefix
 */
async function loadSourceFiles() {
  const files = {};
  const total = FILE_MANIFEST.length;
  let loaded = 0;

  // Load files in parallel with concurrency limit
  const CONCURRENCY = 10;
  const chunks = [];
  for (let i = 0; i < FILE_MANIFEST.length; i += CONCURRENCY) {
    chunks.push(FILE_MANIFEST.slice(i, i + CONCURRENCY));
  }

  for (const chunk of chunks) {
    const results = await Promise.all(
      chunk.map(async (relativePath) => {
        const fetchUrl = `${BASE_PATH}/${relativePath}`;
        const vfsPath = `/src/${relativePath}`;
        try {
          const response = await fetch(fetchUrl);
          if (!response.ok) {
            console.warn(`Failed to load ${fetchUrl}: ${response.status}`);
            return { vfsPath, content: null };
          }
          const content = await response.text();
          return { vfsPath, content };
        } catch (error) {
          console.warn(`Error loading ${fetchUrl}:`, error);
          return { vfsPath, content: null };
        }
      })
    );

    for (const { vfsPath, content } of results) {
      if (content !== null) {
        files[vfsPath] = content;
      }
      loaded++;
      updateProgress(Math.round((loaded / total) * 50), `Loading files... (${loaded}/${total})`);
    }
  }

  return files;
}

// =============================================================================
// SOURCE PATCHING
// =============================================================================

/**
 * Applies necessary patches to source files
 */
function patchSourceFiles(files) {
  // Replace main.tsx with a sidebar-based UI using Tailwind classes
  files['/src/main.tsx'] = `
import { StrictMode, useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Import all examples
import Basic from './examples/Basic';
import Overview from './examples/Overview';
import Backgrounds from './examples/Backgrounds';
import CustomNode from './examples/CustomNode';
import Edges from './examples/Edges';
import EdgeTypes from './examples/EdgeTypes';
import Empty from './examples/Empty';
import Hidden from './examples/Hidden';
import Interaction from './examples/Interaction';
import Layouting from './examples/Layouting';
import NodeResizer from './examples/NodeResizer';
import NodeToolbar from './examples/NodeToolbar';
import Subflow from './examples/Subflow';
import Stress from './examples/Stress';
import UpdateNode from './examples/UpdateNode';
import Validation from './examples/Validation';
import DragNDrop from './examples/DragNDrop';
import EasyConnect from './examples/EasyConnect';
import SaveRestore from './examples/SaveRestore';
import FloatingEdges from './examples/FloatingEdges';
import UseReactFlow from './examples/UseReactFlow';
import Provider from './examples/Provider';
import A11y from './examples/A11y';
import AddNodeOnEdgeDrop from './examples/AddNodeOnEdgeDrop';

// Categorized examples for better organization
const categories = [
  {
    name: 'Getting Started',
    examples: [
      { id: 'basic', name: 'Basic', component: Basic },
      { id: 'overview', name: 'Overview', component: Overview },
      { id: 'empty', name: 'Empty', component: Empty },
    ]
  },
  {
    name: 'Nodes',
    examples: [
      { id: 'custom-node', name: 'Custom Node', component: CustomNode },
      { id: 'node-resizer', name: 'Node Resizer', component: NodeResizer },
      { id: 'node-toolbar', name: 'Node Toolbar', component: NodeToolbar },
      { id: 'update-node', name: 'Update Node', component: UpdateNode },
      { id: 'hidden', name: 'Hidden Nodes', component: Hidden },
    ]
  },
  {
    name: 'Edges',
    examples: [
      { id: 'edges', name: 'Custom Edges', component: Edges },
      { id: 'edge-types', name: 'Edge Types', component: EdgeTypes },
      { id: 'floating-edges', name: 'Floating Edges', component: FloatingEdges },
    ]
  },
  {
    name: 'Interaction',
    examples: [
      { id: 'interaction', name: 'Interaction', component: Interaction },
      { id: 'drag-n-drop', name: 'Drag and Drop', component: DragNDrop },
      { id: 'easy-connect', name: 'Easy Connect', component: EasyConnect },
      { id: 'add-node-edge', name: 'Add Node on Edge Drop', component: AddNodeOnEdgeDrop },
      { id: 'validation', name: 'Validation', component: Validation },
    ]
  },
  {
    name: 'Layout & Styling',
    examples: [
      { id: 'backgrounds', name: 'Backgrounds', component: Backgrounds },
      { id: 'layouting', name: 'Layouting (Dagre)', component: Layouting },
      { id: 'subflow', name: 'Subflows', component: Subflow },
    ]
  },
  {
    name: 'State & Data',
    examples: [
      { id: 'save-restore', name: 'Save & Restore', component: SaveRestore },
      { id: 'provider', name: 'Provider', component: Provider },
      { id: 'use-reactflow', name: 'useReactFlow Hook', component: UseReactFlow },
    ]
  },
  {
    name: 'Other',
    examples: [
      { id: 'a11y', name: 'Accessibility (A11y)', component: A11y },
      { id: 'stress', name: 'Stress Test', component: Stress },
    ]
  }
];

// Flatten for lookup
const allExamples = categories.flatMap(c => c.examples);

function Sidebar({ selectedId, onSelect, searchQuery, onSearchChange }) {
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase();
    return categories
      .map(cat => ({
        ...cat,
        examples: cat.examples.filter(ex =>
          ex.name.toLowerCase().includes(query)
        )
      }))
      .filter(cat => cat.examples.length > 0);
  }, [searchQuery]);

  return (
    <aside className="w-64 h-full bg-zinc-50 border-r border-zinc-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <h1 className="font-semibold text-zinc-900 text-sm">React Flow</h1>
        </div>
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search examples..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-300 placeholder-zinc-400"
          />
        </div>
      </div>

      {/* Example List */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll p-2">
        {filteredCategories.map((category) => (
          <div key={category.name} className="mb-3">
            <h2 className="px-2 py-1 text-xs font-medium text-zinc-500 uppercase tracking-wide">
              {category.name}
            </h2>
            <ul className="space-y-0.5">
              {category.examples.map((example) => (
                <li key={example.id}>
                  <button
                    onClick={() => onSelect(example.id)}
                    className={\`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors \${
                      selectedId === example.id
                        ? 'bg-zinc-200 text-zinc-900 font-medium'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                    }\`}
                  >
                    {example.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {filteredCategories.length === 0 && (
          <p className="px-2 py-4 text-sm text-zinc-400 text-center">No examples found</p>
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-zinc-200 bg-zinc-100/50">
        <p className="text-xs text-zinc-400 text-center">
          Compiled at runtime with{' '}
          <a href="https://github.com/NimbleLabs/vibe-coding-bundler" target="_blank" rel="noopener" className="text-zinc-500 hover:text-zinc-700 underline">
            vibe-coding-bundler
          </a>
        </p>
      </div>
    </aside>
  );
}

function App() {
  const [selectedId, setSelectedId] = useState('basic');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedExample = allExamples.find(ex => ex.id === selectedId) || allExamples[0];
  const CurrentExample = selectedExample.component;

  return (
    <div className="flex h-full">
      <Sidebar
        selectedId={selectedId}
        onSelect={setSelectedId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="flex-1 flex flex-col min-w-0">
        {/* Example Header */}
        <header className="h-12 px-4 flex items-center justify-between border-b border-zinc-200 bg-white flex-shrink-0">
          <h2 className="font-medium text-zinc-900">{selectedExample.name}</h2>
          <span className="text-xs text-zinc-400">
            {allExamples.length} examples
          </span>
        </header>
        {/* Example Content */}
        <div className="flex-1 relative">
          <CurrentExample />
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`;

  return files;
}

/**
 * Processes CSS files - injects them and converts CSS modules to JS
 */
function processCSSFiles(files) {
  const processedFiles = {};

  for (const [path, content] of Object.entries(files)) {
    if (path.endsWith('.css')) {
      // Inject the CSS into the document
      const cssId = `css-${path.replace(/[^a-zA-Z0-9]/g, '-')}`;
      injectCSS(content, cssId);

      if (path.endsWith('.module.css')) {
        // For CSS modules, generate a JS module with class name exports
        const classNames = extractCSSClassNames(content);
        processedFiles[path] = generateCSSModuleJS(classNames);
      } else {
        // For regular CSS, just export empty (CSS is already injected)
        processedFiles[path] = 'export default {};';
      }
    } else if (path.endsWith('.d.ts')) {
      // Type definition files - export empty (not needed at runtime)
      processedFiles[path] = '// Type definitions not needed at runtime\nexport {};';
    } else {
      processedFiles[path] = content;
    }
  }

  return processedFiles;
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  try {
    updateProgress(5, 'Loading bundler and package.json...');

    // Import the bundler and load package.json in parallel
    let module;
    let packageJson;
    let loadError = null;

    const [moduleResult, packageJsonResult] = await Promise.allSettled([
      // Try to import the bundler
      (async () => {
        try {
          return await import('/dist/index.browser.js');
        } catch (e1) {
          console.error('Failed to load from /dist/index.browser.js:', e1);
          try {
            return await import('../../dist/index.browser.js');
          } catch (e2) {
            console.error('Failed to load from ../../dist/index.browser.js:', e2);
            throw e2;
          }
        }
      })(),
      // Load package.json
      fetch('./package.json').then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
    ]);

    if (moduleResult.status === 'rejected') {
      loadError = moduleResult.reason;
      const errorMsg = `Error: ${loadError.message}\n\nStack: ${loadError.stack || 'N/A'}`;
      showError('Failed to Load Bundler', errorMsg);
      return;
    }
    module = moduleResult.value;

    if (packageJsonResult.status === 'rejected') {
      const errorMsg = `Error: ${packageJsonResult.reason.message}`;
      showError('Failed to Load package.json', errorMsg);
      return;
    }
    packageJson = packageJsonResult.value;

    const { createBundler, initialize, generateImportMap } = module;

    updateProgress(10, 'Initializing esbuild-wasm...');
    await initialize();

    updateProgress(15, 'Generating import map...');
    const importMap = generateImportMap(packageJson, {
      cdn: 'https://esm.sh',
      exclude: EXCLUDE_PACKAGES,
      overrides: IMPORT_MAP_OVERRIDES,
    });
    console.log('Generated import map:', importMap);

    updateProgress(20, 'Loading source files...');
    let files = await loadSourceFiles();

    updateProgress(55, 'Patching source files...');
    files = patchSourceFiles(files);

    updateProgress(60, 'Processing CSS...');
    files = processCSSFiles(files);

    updateProgress(65, 'Creating bundler...');
    const bundler = createBundler({
      fetcher: async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const contents = await response.text();
        return { contents };
      },
    });

    updateProgress(70, 'Bundling application...');
    const result = await bundler.bundle(
      '/src/main.tsx',
      files,
      importMap,
      {
        format: 'esm',
        minify: false,
        sourcemap: 'inline',
        target: 'es2020',
        // Use automatic JSX runtime (React 17+) so React doesn't need to be in scope
        jsx: 'automatic',
        jsxImportSource: 'react',
      }
    );

    if (result.errors && result.errors.length > 0) {
      const errorMessages = result.errors.map(e => e.text || e.message || String(e)).join('\n\n');
      showError('Build Failed', errorMessages);
      return;
    }

    updateProgress(90, 'Executing bundle...');

    // Get the main output file
    const outputFiles = result.outputFiles;
    const mainOutput = outputFiles['main.js'] || outputFiles['/src/main.js'] || Object.values(outputFiles)[0];

    if (!mainOutput) {
      showError('Build Error', 'No output file generated');
      return;
    }

    // Create a blob URL and execute
    const blob = new Blob([mainOutput], { type: 'text/javascript' });
    const blobUrl = URL.createObjectURL(blob);

    updateProgress(95, 'Starting application...');

    try {
      await import(blobUrl);
      updateProgress(100, 'Done!');

      // Hide loading overlay after a short delay
      setTimeout(hideLoading, 300);
    } catch (error) {
      showError('Runtime Error', error.message + '\n\n' + error.stack);
    } finally {
      URL.revokeObjectURL(blobUrl);
    }

  } catch (error) {
    showError('Error', error.message + '\n\n' + (error.stack || ''));
  }
}

// Start the application
main();
