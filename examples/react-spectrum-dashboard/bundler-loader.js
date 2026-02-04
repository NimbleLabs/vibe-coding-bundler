/**
 * CloudMetrics Dashboard - Runtime Bundler Loader
 */

const BASE_PATH = './src';

const FILE_MANIFEST = [
  'index.js',
  'App.tsx',
  'data/mockData.ts',
  'tabs/OverviewTab.tsx',
  'tabs/ServicesTab.tsx',
  'tabs/AlertsTab.tsx',
  'tabs/TeamTab.tsx',
  'components/Header.tsx',
  'components/StatusLight.tsx',
  'components/Meter.tsx',
  'components/Badge.tsx',
  'components/Table.tsx',
];

const IMPORT_MAP = {
  imports: {
    'react': 'https://esm.sh/react@18.2.0',
    'react/': 'https://esm.sh/react@18.2.0/',
    'react/jsx-runtime': 'https://esm.sh/react@18.2.0/jsx-runtime',
    'react-dom': 'https://esm.sh/react-dom@18.2.0',
    'react-dom/': 'https://esm.sh/react-dom@18.2.0/',
    'react-dom/client': 'https://esm.sh/react-dom@18.2.0/client',
  }
};

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
    setTimeout(() => loadingOverlay.style.display = 'none', 300);
  }
}

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
        if (!response.ok) return { vfsPath, content: null };
        const content = await response.text();
        return { vfsPath, content };
      } catch {
        return { vfsPath, content: null };
      }
    })
  );

  for (const { vfsPath, content } of results) {
    if (content !== null) files[vfsPath] = content;
    loaded++;
    updateProgress(Math.round((loaded / total) * 50), `Loading files... (${loaded}/${total})`);
  }

  return files;
}

async function main() {
  try {
    updateProgress(5, 'Loading bundler...');

    let module;
    try {
      module = await import('/dist/index.browser.js');
    } catch {
      module = await import('../../dist/index.browser.js');
    }

    if (!module) {
      showError('Failed to Load Bundler', 'Could not load bundler module');
      return;
    }

    const { createBundler, initialize } = module;

    updateProgress(10, 'Initializing esbuild-wasm...');
    await initialize();

    updateProgress(15, 'Loading source files...');
    const files = await loadSourceFiles();

    updateProgress(65, 'Creating bundler...');
    const bundler = createBundler({
      fetcher: async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return { contents: await response.text() };
      },
    });

    updateProgress(70, 'Bundling application...');
    const result = await bundler.bundle('/src/index.js', files, IMPORT_MAP, {
      format: 'esm',
      minify: false,
      sourcemap: 'inline',
      target: 'es2020',
      jsx: 'automatic',
      jsxImportSource: 'react',
      loader: { '.js': 'jsx' },
    });

    if (result.errors?.length > 0) {
      showError('Build Failed', result.errors.map(e => e.text || e.message).join('\n\n'));
      return;
    }

    updateProgress(90, 'Executing bundle...');
    const mainOutput = result.outputFiles['index.js'] || Object.values(result.outputFiles)[0];
    if (!mainOutput) {
      showError('Build Error', 'No output file generated');
      return;
    }

    const blob = new Blob([mainOutput], { type: 'text/javascript' });
    const blobUrl = URL.createObjectURL(blob);

    updateProgress(95, 'Starting application...');
    await import(blobUrl);
    updateProgress(100, 'Done!');
    setTimeout(hideLoading, 300);
    URL.revokeObjectURL(blobUrl);

  } catch (error) {
    showError('Error', error.message + '\n\n' + (error.stack || ''));
  }
}

main();
