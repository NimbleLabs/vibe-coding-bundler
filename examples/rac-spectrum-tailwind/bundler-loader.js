/**
 * RAC + Spectrum + Tailwind - Runtime Bundler Loader
 *
 * This script loads all source files and compiles them
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
  'index.js',
  'App.js',
  'ThemeSwitcher.js',
  'style.css',

  // Components
  'components/GenInputField.tsx',
  'components/NavigationBox.tsx',
  'components/PlanSwitcher.tsx',
  'components/SelectBoxGroup.tsx',
  'components/SentimentRatingGroup.tsx',
  'components/StarRatingGroup.tsx',
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

    // Adobe React Spectrum (use latest)
    '@adobe/react-spectrum': 'https://esm.sh/@adobe/react-spectrum?external=react,react-dom',

    // React Aria Components
    'react-aria-components': 'https://esm.sh/react-aria-components?external=react,react-dom',
    'react-aria-components/': 'https://esm.sh/react-aria-components&external=react,react-dom/',

    // React Stately (may be needed by some components)
    'react-stately': 'https://esm.sh/react-stately?external=react',
    'react-stately/': 'https://esm.sh/react-stately&external=react/',

    // Spectrum Icons - Workflow (use prefix pattern for any icon)
    '@spectrum-icons/workflow/User': 'https://esm.sh/@spectrum-icons/workflow/User?external=react',
    '@spectrum-icons/workflow/UserGroup': 'https://esm.sh/@spectrum-icons/workflow/UserGroup?external=react',
    '@spectrum-icons/workflow/Building': 'https://esm.sh/@spectrum-icons/workflow/Building?external=react',
    '@spectrum-icons/workflow/Moon': 'https://esm.sh/@spectrum-icons/workflow/Moon?external=react',
    '@spectrum-icons/workflow/Light': 'https://esm.sh/@spectrum-icons/workflow/Light?external=react',
    '@spectrum-icons/workflow/Star': 'https://esm.sh/@spectrum-icons/workflow/Star?external=react',
    '@spectrum-icons/workflow/StarOutline': 'https://esm.sh/@spectrum-icons/workflow/StarOutline?external=react',
    '@spectrum-icons/workflow/Home': 'https://esm.sh/@spectrum-icons/workflow/Home?external=react',
    '@spectrum-icons/workflow/': 'https://esm.sh/@spectrum-icons/workflow&external=react/',

    // Spectrum Icons - Illustrations (for empty states, etc.)
    '@spectrum-icons/illustrations/': 'https://esm.sh/@spectrum-icons/illustrations&external=react/',
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
  // The style.css uses Tailwind directives that won't work directly
  // We'll just export empty since Tailwind Play CDN handles styles at runtime
  if (files['/src/style.css']) {
    files['/src/style.css'] = '/* Tailwind handled by CDN */';
  }

  // Rename .js files to .jsx so esbuild knows they contain JSX
  const renamedFiles = {};
  for (const [path, content] of Object.entries(files)) {
    if (path.endsWith('.js') && content.includes('<')) {
      // This .js file likely contains JSX, rename to .jsx
      const newPath = path.replace(/\.js$/, '.jsx');
      renamedFiles[newPath] = content;

      // Also update imports in other files that reference this file
      // We'll handle this by keeping both paths pointing to same content
      renamedFiles[path] = content;
    } else {
      renamedFiles[path] = content;
    }
  }

  return renamedFiles;
}

/**
 * Processes CSS files - converts to empty JS modules
 * (Tailwind is handled by the Play CDN at runtime)
 */
function processCSSFiles(files) {
  const processedFiles = {};

  for (const [path, content] of Object.entries(files)) {
    if (path.endsWith('.css')) {
      // For CSS files, just export empty (Tailwind CDN handles styling)
      processedFiles[path] = 'export default {};';
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
        // Try relative path (when serving from examples/rac-spectrum-tailwind)
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
      '/src/index.js',
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
        // Treat .js files as JSX (this project uses JSX syntax in .js files)
        loader: { '.js': 'jsx' },
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
    const mainOutput = outputFiles['index.js'] || outputFiles['/src/index.js'] || Object.values(outputFiles)[0];

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
