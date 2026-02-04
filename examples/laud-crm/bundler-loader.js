/**
 * Laud CRM - Runtime Bundler Loader
 *
 * Loads CRM source files and compiles them at runtime
 * using vibe-coding-bundler (esbuild-wasm based).
 *
 * This demonstrates the use case where AI generates applications
 * and the platform compiles/bundles them at runtime in the browser.
 *
 * Import maps are dynamically generated from package.json dependencies,
 * showcasing how AI-generated projects can be bundled without manual
 * configuration.
 */

// =============================================================================
// FILE MANIFEST - All source files to load into VFS
// =============================================================================

const BASE_PATH = './src';

const FILE_MANIFEST = [
  // Entry point
  'main.tsx',
  'App.tsx',
  'router.tsx',

  // Core
  'types.ts',
  'store.ts',

  // Data
  'data/mockData.ts',

  // Layout Components
  'components/Layout.tsx',
  'components/Sidebar.tsx',
  'components/Header.tsx',

  // UI Components
  'components/Button.tsx',
  'components/Badge.tsx',
  'components/Input.tsx',
  'components/Modal.tsx',
  'components/StatCard.tsx',
  'components/ContactCard.tsx',
  'components/DealCard.tsx',
  'components/ActivityItem.tsx',

  // Pages
  'pages/Dashboard.tsx',
  'pages/Contacts.tsx',
  'pages/ContactDetail.tsx',
  'pages/Deals.tsx',
  'pages/Pipeline.tsx',
  'pages/Activities.tsx',
];

// Dev dependencies to exclude from import map (not needed at runtime)
const EXCLUDE_PACKAGES = [
  '@types/react',
  '@types/react-dom',
  '@vitejs/plugin-react',
  'autoprefixer',
  'postcss',
  'tailwindcss',
  'typescript',
  'vite',
];

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
    loadingOverlay.classList.add('opacity-0');
    loadingOverlay.classList.add('pointer-events-none');
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 300);
  }
}

// =============================================================================
// FILE LOADING
// =============================================================================

async function loadSourceFiles() {
  const files = {};
  const total = FILE_MANIFEST.length;
  let loaded = 0;

  // Load files in parallel with progress updates
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
    updateProgress(Math.round((loaded / total) * 40) + 15, `Loading files... (${loaded}/${total})`);
  }

  console.log(`Loaded ${Object.keys(files).length} files into VFS`);
  return files;
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
    });
    console.log('Generated import map:', importMap);

    updateProgress(20, 'Loading source files...');
    const files = await loadSourceFiles();

    updateProgress(60, 'Creating bundler...');
    const bundler = createBundler({
      fetcher: async (url) => {
        updateProgress(65, `Fetching ${url.split('/').pop()?.substring(0, 30)}...`);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const contents = await response.text();
        return { contents };
      },
    });

    updateProgress(70, 'Bundling CRM application...');
    const result = await bundler.bundle(
      '/src/main.tsx',
      files,
      importMap,
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
    const mainOutput = outputFiles['main.js'] || outputFiles['/src/main.js'] || Object.values(outputFiles)[0];

    if (!mainOutput) {
      showError('Build Error', 'No output file generated');
      return;
    }

    const blob = new Blob([mainOutput], { type: 'text/javascript' });
    const blobUrl = URL.createObjectURL(blob);

    updateProgress(95, 'Starting Laud CRM...');

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
