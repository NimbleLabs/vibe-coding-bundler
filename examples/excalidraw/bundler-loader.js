/**
 * Excalidraw Demo - Runtime Bundler Loader
 *
 * Loads Excalidraw whiteboard app and compiles it at runtime
 * using vibe-coding-bundler (esbuild-wasm based).
 */

// =============================================================================
// FILE MANIFEST
// =============================================================================

const BASE_PATH = './src';

const FILE_MANIFEST = [
  'index.tsx',
  'App.tsx',
];

// =============================================================================
// IMPORT MAP
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

    // Excalidraw - use bundle mode with external react
    '@excalidraw/excalidraw': 'https://esm.sh/@excalidraw/excalidraw@0.18.0?external=react,react-dom&bundle-deps',
    '@excalidraw/excalidraw/': 'https://esm.sh/@excalidraw/excalidraw@0.18.0&external=react,react-dom/',
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
// CSS LOADING
// =============================================================================

async function loadExcalidrawCSS() {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/@excalidraw/excalidraw@0.18.0/dist/prod/index.css';
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

// =============================================================================
// FILE LOADING
// =============================================================================

async function loadSourceFiles() {
  const files = {};
  const total = FILE_MANIFEST.length;
  let loaded = 0;

  const results = await Promise.all(
    FILE_MANIFEST.map(async (relativePath) => {
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
    updateProgress(Math.round((loaded / total) * 30) + 20, `Loading files... (${loaded}/${total})`);
  }

  return files;
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
      module = await import('/dist/index.browser.js');
    } catch (e1) {
      console.error('Failed to load from /dist/index.browser.js:', e1);
      loadError = e1;

      try {
        module = await import('../../dist/index.browser.js');
        loadError = null;
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

    updateProgress(15, 'Loading Excalidraw CSS...');
    try {
      await loadExcalidrawCSS();
    } catch (e) {
      console.warn('Failed to load Excalidraw CSS:', e);
    }

    updateProgress(20, 'Loading source files...');
    const files = await loadSourceFiles();

    updateProgress(55, 'Creating bundler...');
    const bundler = createBundler({
      fetcher: async (url) => {
        updateProgress(60, `Fetching ${url.split('/').pop()?.substring(0, 30)}...`);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const contents = await response.text();
        return { contents };
      },
    });

    updateProgress(65, 'Bundling application (this may take a moment)...');
    const result = await bundler.bundle(
      '/src/index.tsx',
      files,
      IMPORT_MAP,
      {
        format: 'esm',
        minify: false,
        sourcemap: 'inline',
        target: 'es2020',
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

    const outputFiles = result.outputFiles;
    const mainOutput = outputFiles['index.js'] || outputFiles['/src/index.js'] || Object.values(outputFiles)[0];

    if (!mainOutput) {
      showError('Build Error', 'No output file generated');
      return;
    }

    const blob = new Blob([mainOutput], { type: 'text/javascript' });
    const blobUrl = URL.createObjectURL(blob);

    updateProgress(95, 'Starting Excalidraw...');

    try {
      await import(blobUrl);
      updateProgress(100, 'Done!');
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
