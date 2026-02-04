/**
 * Tremor Dashboard Demo - Runtime Bundler Loader
 *
 * Loads Tremor components and compiles them at runtime
 * using vibe-coding-bundler (esbuild-wasm based).
 *
 * This example demonstrates loading a real component library
 * structure with multiple files into the virtual file system.
 */

// =============================================================================
// FILE MANIFEST - All source files to load into VFS
// =============================================================================

const BASE_PATH = './src';

const FILE_MANIFEST = [
  // Entry point and App
  'index.tsx',
  'App.tsx',

  // Utils
  'utils/cx.ts',
  'utils/focusRing.ts',
  'utils/chartColors.ts',

  // Components index
  'components/index.ts',

  // Layout & Containers
  'components/Card/Card.tsx',
  'components/Divider/Divider.tsx',
  'components/Callout/Callout.tsx',

  // Accordion
  'components/Accordion/Accordion.tsx',

  // Buttons & Actions
  'components/Button/Button.tsx',
  'components/Toggle/Toggle.tsx',

  // Form Inputs
  'components/Input/Input.tsx',
  'components/Label/Label.tsx',
  'components/Textarea/Textarea.tsx',
  'components/Checkbox/Checkbox.tsx',
  'components/Switch/Switch.tsx',
  'components/Slider/Slider.tsx',

  // Select & Dropdowns
  'components/Select/Select.tsx',
  'components/SelectNative/SelectNative.tsx',
  'components/DropdownMenu/DropdownMenu.tsx',

  // Radio Groups
  'components/RadioGroup/RadioGroup.tsx',
  'components/RadioCardGroup/RadioCardGroup.tsx',

  // Navigation & Tabs
  'components/Tabs/Tabs.tsx',
  'components/TabNavigation/TabNavigation.tsx',

  // Overlays & Dialogs
  'components/Dialog/Dialog.tsx',
  'components/Drawer/Drawer.tsx',
  'components/Popover/Popover.tsx',
  'components/Tooltip/Tooltip.tsx',

  // Badges & Indicators
  'components/Badge/Badge.tsx',
  'components/ProgressBar/ProgressBar.tsx',
  'components/ProgressCircle/ProgressCircle.tsx',
  'components/CategoryBar/CategoryBar.tsx',
  'components/Tracker/Tracker.tsx',

  // Data Display
  'components/BarList/BarList.tsx',
  'components/Table/Table.tsx',

  // Charts
  'components/SparkChart/SparkChart.tsx',
  'components/AreaChart/AreaChart.tsx',
  'components/BarChart/BarChart.tsx',
  'components/LineChart/LineChart.tsx',
  'components/DonutChart/DonutChart.tsx',
  'components/ComboChart/ComboChart.tsx',

  // Date & Time
  'components/Calendar/Calendar.tsx',
  'components/DatePicker/DatePicker.tsx',

  // Notifications
  'components/Toast/Toast.tsx',
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

    // Radix UI Primitives
    '@radix-ui/react-slot': 'https://esm.sh/@radix-ui/react-slot@1.0.2?external=react,react-dom',
    '@radix-ui/react-label': 'https://esm.sh/@radix-ui/react-label@2.0.2?external=react,react-dom',
    '@radix-ui/react-checkbox': 'https://esm.sh/@radix-ui/react-checkbox@1.0.4?external=react,react-dom',
    '@radix-ui/react-switch': 'https://esm.sh/@radix-ui/react-switch@1.0.3?external=react,react-dom',
    '@radix-ui/react-toggle': 'https://esm.sh/@radix-ui/react-toggle@1.0.3?external=react,react-dom',
    '@radix-ui/react-accordion': 'https://esm.sh/@radix-ui/react-accordion@1.1.2?external=react,react-dom',
    '@radix-ui/react-tabs': 'https://esm.sh/@radix-ui/react-tabs@1.0.4?external=react,react-dom',
    '@radix-ui/react-dialog': 'https://esm.sh/@radix-ui/react-dialog@1.0.5?external=react,react-dom',
    '@radix-ui/react-popover': 'https://esm.sh/@radix-ui/react-popover@1.0.7?external=react,react-dom',
    '@radix-ui/react-tooltip': 'https://esm.sh/@radix-ui/react-tooltip@1.0.7?external=react,react-dom',
    '@radix-ui/react-select': 'https://esm.sh/@radix-ui/react-select@2.0.0?external=react,react-dom',
    '@radix-ui/react-dropdown-menu': 'https://esm.sh/@radix-ui/react-dropdown-menu@2.0.6?external=react,react-dom',
    '@radix-ui/react-radio-group': 'https://esm.sh/@radix-ui/react-radio-group@1.1.3?external=react,react-dom',
    '@radix-ui/react-slider': 'https://esm.sh/@radix-ui/react-slider@1.1.2?external=react,react-dom',
    '@radix-ui/react-toast': 'https://esm.sh/@radix-ui/react-toast@1.1.5?external=react,react-dom',

    // Styling utilities
    'clsx': 'https://esm.sh/clsx@2.1.0',
    'tailwind-merge': 'https://esm.sh/tailwind-merge@2.2.0',
    'tailwind-variants': 'https://esm.sh/tailwind-variants@0.2.0?external=tailwind-merge',
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

    updateProgress(15, 'Loading source files...');
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

    updateProgress(70, 'Bundling Tremor components...');
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

    updateProgress(95, 'Starting Tremor dashboard...');

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
