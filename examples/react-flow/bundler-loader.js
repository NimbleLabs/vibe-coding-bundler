/**
 * React Flow Examples - Runtime Bundler Loader
 *
 * This script loads all React Flow example source files and compiles them
 * at runtime using vibe-coding-bundler (esbuild-wasm based).
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
// IMPORT MAP - External dependencies mapped to CDN URLs
// =============================================================================

const IMPORT_MAP = {
  imports: {
    // React
    'react': 'https://esm.sh/react@18.2.0',
    'react/': 'https://esm.sh/react@18.2.0/',
    'react/jsx-runtime': 'https://esm.sh/react@18.2.0/jsx-runtime',
    'react/jsx-dev-runtime': 'https://esm.sh/react@18.2.0/jsx-dev-runtime',

    // React DOM
    'react-dom': 'https://esm.sh/react-dom@18.2.0',
    'react-dom/': 'https://esm.sh/react-dom@18.2.0/',
    'react-dom/client': 'https://esm.sh/react-dom@18.2.0/client',

    // React Router
    'react-router-dom': 'https://esm.sh/react-router-dom@6.18.0?external=react',

    // XYFlow / React Flow
    '@xyflow/react': 'https://esm.sh/@xyflow/react@12.10.0?external=react,react-dom',
    '@xyflow/react/': 'https://esm.sh/@xyflow/react@12.10.0&external=react,react-dom/',
    '@xyflow/system': 'https://esm.sh/@xyflow/system@0.0.74',

    // State management
    'zustand': 'https://esm.sh/zustand@4.4.6?external=react',
    'zustand/': 'https://esm.sh/zustand@4.4.6&external=react/',
    '@reduxjs/toolkit': 'https://esm.sh/@reduxjs/toolkit@2.2.3?external=react',
    'react-redux': 'https://esm.sh/react-redux@9.1.1?external=react,react-dom',
    'redux': 'https://esm.sh/redux@5.0.1',

    // Utilities
    'dagre': 'https://esm.sh/dagre@0.8.5',
    'classcat': 'https://esm.sh/classcat@5.0.4',
    'localforage': 'https://esm.sh/localforage@1.10.0',
  }
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
  // Replace main.tsx with a simpler version that doesn't use react-router
  // This avoids issues with BrowserRouter when loading from blob URLs
  files['/src/main.tsx'] = `
import { StrictMode, useState, Suspense, lazy } from 'react';
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

const examples = [
  { name: 'Basic', component: Basic },
  { name: 'Overview', component: Overview },
  { name: 'A11y (Accessibility)', component: A11y },
  { name: 'Add Node on Edge Drop', component: AddNodeOnEdgeDrop },
  { name: 'Backgrounds', component: Backgrounds },
  { name: 'Custom Node', component: CustomNode },
  { name: 'Drag and Drop', component: DragNDrop },
  { name: 'Easy Connect', component: EasyConnect },
  { name: 'Edges', component: Edges },
  { name: 'Edge Types', component: EdgeTypes },
  { name: 'Empty', component: Empty },
  { name: 'Floating Edges', component: FloatingEdges },
  { name: 'Hidden', component: Hidden },
  { name: 'Interaction', component: Interaction },
  { name: 'Layouting', component: Layouting },
  { name: 'Node Resizer', component: NodeResizer },
  { name: 'Node Toolbar', component: NodeToolbar },
  { name: 'Provider', component: Provider },
  { name: 'Save/Restore', component: SaveRestore },
  { name: 'Stress Test', component: Stress },
  { name: 'Subflow', component: Subflow },
  { name: 'Update Node', component: UpdateNode },
  { name: 'useReactFlow', component: UseReactFlow },
  { name: 'Validation', component: Validation },
];

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const CurrentExample = examples[selectedIndex].component;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header style={{
        padding: '10px 16px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: '#fff',
      }}>
        <strong style={{ fontSize: '14px' }}>React Flow Examples</strong>
        <select
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
          style={{
            padding: '6px 12px',
            fontSize: '14px',
            borderRadius: '4px',
            border: '1px solid #ddd',
          }}
        >
          {examples.map((ex, i) => (
            <option key={ex.name} value={i}>{ex.name}</option>
          ))}
        </select>
        <span style={{ color: '#666', fontSize: '12px' }}>
          Compiled at runtime with vibe-coding-bundler
        </span>
      </header>
      <div style={{ flex: 1, position: 'relative' }}>
        <CurrentExample />
      </div>
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
    updateProgress(5, 'Loading bundler...');

    // Import the bundler
    let module;
    let loadError = null;

    try {
      // Try absolute path first (when serving from project root)
      module = await import('/dist/index.browser.js');
    } catch (e1) {
      console.error('Failed to load from /dist/index.browser.js:', e1);
      loadError = e1;

      try {
        // Try relative path (when serving from examples/react-flow)
        module = await import('../../dist/index.browser.js');
        loadError = null; // Clear error if second attempt works
      } catch (e2) {
        console.error('Failed to load from ../../dist/index.browser.js:', e2);
        loadError = e2;
      }
    }

    if (!module) {
      const errorMsg = loadError ?
        `Error: ${loadError.message}\n\nStack: ${loadError.stack || 'N/A'}` :
        'Unknown error loading module';
      showError('Failed to Load Bundler', errorMsg);
      return;
    }

    const { createBundler, initialize } = module;

    updateProgress(10, 'Initializing esbuild-wasm...');
    await initialize();

    updateProgress(15, 'Loading source files...');
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
      IMPORT_MAP,
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
