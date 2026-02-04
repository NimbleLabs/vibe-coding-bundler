/**
 * Dynamic import map generation from package.json
 *
 * Enables automatic creation of import maps from package.json dependencies,
 * supporting the "drop-in" use case where AI generates a project with package.json
 * and the bundler automatically resolves all dependencies via CDN.
 */

import type { ImportMapJson } from './types';

/**
 * Options for generating an import map from package.json
 */
export interface GenerateImportMapOptions {
  /**
   * CDN base URL (default: 'https://esm.sh')
   */
  cdn?: string;

  /**
   * Packages to explicitly mark as external in CDN URLs.
   * These will be added to the ?external= query parameter.
   * React packages are auto-detected if not specified.
   */
  externals?: string[];

  /**
   * Packages to exclude from the generated import map.
   * Useful for dev dependencies like vite, typescript, etc.
   */
  exclude?: string[];

  /**
   * Include devDependencies in the import map (default: false)
   */
  includeDevDependencies?: boolean;

  /**
   * Add subpath entries (e.g., 'pkg/' -> CDN URL with trailing slash)
   * Enables imports like `import debounce from 'lodash/debounce'`
   * (default: true)
   */
  includeSubpaths?: boolean;

  /**
   * Manual overrides for specific package URLs.
   * These take precedence over auto-generated entries.
   */
  overrides?: Record<string, string>;
}

/**
 * Minimal package.json structure for import map generation
 */
export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

/**
 * Packages known to have React as a peer dependency.
 * These will automatically get ?external=react or ?external=react,react-dom
 */
const REACT_PEER_PACKAGES: Record<string, string[]> = {
  // State management
  'zustand': ['react'],
  'jotai': ['react'],
  'recoil': ['react', 'react-dom'],
  'react-redux': ['react', 'react-dom'],
  '@reduxjs/toolkit': ['react'],

  // Routing
  'react-router-dom': ['react', 'react-dom'],
  'react-router': ['react'],
  '@tanstack/react-router': ['react', 'react-dom'],

  // UI Libraries
  '@xyflow/react': ['react', 'react-dom'],
  '@radix-ui/react-accordion': ['react', 'react-dom'],
  '@radix-ui/react-alert-dialog': ['react', 'react-dom'],
  '@radix-ui/react-avatar': ['react', 'react-dom'],
  '@radix-ui/react-checkbox': ['react', 'react-dom'],
  '@radix-ui/react-collapsible': ['react', 'react-dom'],
  '@radix-ui/react-context-menu': ['react', 'react-dom'],
  '@radix-ui/react-dialog': ['react', 'react-dom'],
  '@radix-ui/react-dropdown-menu': ['react', 'react-dom'],
  '@radix-ui/react-hover-card': ['react', 'react-dom'],
  '@radix-ui/react-label': ['react', 'react-dom'],
  '@radix-ui/react-menubar': ['react', 'react-dom'],
  '@radix-ui/react-navigation-menu': ['react', 'react-dom'],
  '@radix-ui/react-popover': ['react', 'react-dom'],
  '@radix-ui/react-progress': ['react', 'react-dom'],
  '@radix-ui/react-radio-group': ['react', 'react-dom'],
  '@radix-ui/react-scroll-area': ['react', 'react-dom'],
  '@radix-ui/react-select': ['react', 'react-dom'],
  '@radix-ui/react-separator': ['react', 'react-dom'],
  '@radix-ui/react-slider': ['react', 'react-dom'],
  '@radix-ui/react-slot': ['react', 'react-dom'],
  '@radix-ui/react-switch': ['react', 'react-dom'],
  '@radix-ui/react-tabs': ['react', 'react-dom'],
  '@radix-ui/react-toast': ['react', 'react-dom'],
  '@radix-ui/react-toggle': ['react', 'react-dom'],
  '@radix-ui/react-toggle-group': ['react', 'react-dom'],
  '@radix-ui/react-tooltip': ['react', 'react-dom'],

  // Forms
  'react-hook-form': ['react'],
  '@hookform/resolvers': ['react'],
  'formik': ['react'],

  // Data fetching
  '@tanstack/react-query': ['react'],
  'swr': ['react'],

  // Animation
  'framer-motion': ['react', 'react-dom'],
  'react-spring': ['react'],
  '@react-spring/web': ['react', 'react-dom'],

  // Charts/Visualization
  'recharts': ['react', 'react-dom'],
  '@tremor/react': ['react', 'react-dom'],
  'react-chartjs-2': ['react'],

  // DnD
  '@dnd-kit/core': ['react', 'react-dom'],
  '@dnd-kit/sortable': ['react', 'react-dom'],
  'react-beautiful-dnd': ['react', 'react-dom'],

  // Other common libraries
  'class-variance-authority': [],
  'clsx': [],
  'lucide-react': ['react'],
  '@heroicons/react': ['react'],
  'react-icons': ['react'],
  'react-hot-toast': ['react', 'react-dom'],
  'sonner': ['react', 'react-dom'],
  '@headlessui/react': ['react', 'react-dom'],
  'cmdk': ['react', 'react-dom'],
  'next-themes': ['react', 'react-dom'],
  'react-day-picker': ['react', 'react-dom'],
  'date-fns': [],
  'tailwind-merge': [],
  'tailwindcss-animate': [],
};

/**
 * Strips semver range prefixes from version strings
 *
 * @example
 * stripVersionRange('^18.2.0') // '18.2.0'
 * stripVersionRange('~4.4.7') // '4.4.7'
 * stripVersionRange('>=1.0.0') // '1.0.0'
 * stripVersionRange('1.0.0') // '1.0.0'
 */
export function stripVersionRange(version: string): string {
  return version.replace(/^[\^~>=<]+/, '');
}

/**
 * Generates a CDN URL for a package
 *
 * @param packageName Package name (e.g., 'react', '@scope/pkg')
 * @param version Version string (will have range prefix stripped)
 * @param options Additional options
 * @returns CDN URL
 */
export function generateCdnUrl(
  packageName: string,
  version: string,
  options?: {
    cdn?: string;
    externals?: string[];
    subpath?: string;
  }
): string {
  const cdn = options?.cdn ?? 'https://esm.sh';
  const cleanVersion = stripVersionRange(version);
  const externals = options?.externals ?? [];
  const subpath = options?.subpath ?? '';

  // For subpaths with externals, the URL format is: pkg@version&external=x/
  // The trailing slash must come AFTER the external parameter
  let url = `${cdn}/${packageName}@${cleanVersion}`;

  if (externals.length > 0) {
    // Use & for subpaths (esm.sh convention), ? otherwise
    const separator = subpath ? '&' : '?';
    url += `${separator}external=${externals.join(',')}`;
  }

  // Add subpath at the end (trailing slash for prefix mappings)
  url += subpath;

  return url;
}

/**
 * Gets the externals for a package based on known peer dependencies
 */
function getPackageExternals(
  packageName: string,
  dependencies: Record<string, string>
): string[] {
  // Check if this package has known React peer deps
  const knownExternals = REACT_PEER_PACKAGES[packageName];

  if (knownExternals !== undefined) {
    // Filter to only include externals that are actually in dependencies
    return knownExternals.filter((ext) => ext in dependencies);
  }

  // For scoped packages we don't explicitly know, check if they start with @radix-ui/react-
  if (
    packageName.startsWith('@radix-ui/react-') &&
    'react' in dependencies &&
    'react-dom' in dependencies
  ) {
    return ['react', 'react-dom'];
  }

  return [];
}

/**
 * Generates an import map from package.json dependencies
 *
 * @param packageJson package.json object with dependencies
 * @param options Generation options
 * @returns Import map JSON ready to use with the bundler
 *
 * @example
 * const packageJson = {
 *   dependencies: {
 *     'react': '^18.2.0',
 *     'react-dom': '^18.2.0',
 *     'zustand': '^4.4.7'
 *   }
 * };
 *
 * const importMap = generateImportMap(packageJson, {
 *   cdn: 'https://esm.sh',
 *   exclude: ['typescript', 'vite']
 * });
 *
 * // Result:
 * // {
 * //   imports: {
 * //     'react': 'https://esm.sh/react@18.2.0',
 * //     'react/': 'https://esm.sh/react@18.2.0/',
 * //     'react/jsx-runtime': 'https://esm.sh/react@18.2.0/jsx-runtime',
 * //     'react/jsx-dev-runtime': 'https://esm.sh/react@18.2.0/jsx-dev-runtime',
 * //     'react-dom': 'https://esm.sh/react-dom@18.2.0',
 * //     'react-dom/': 'https://esm.sh/react-dom@18.2.0/',
 * //     'react-dom/client': 'https://esm.sh/react-dom@18.2.0/client',
 * //     'zustand': 'https://esm.sh/zustand@4.4.7?external=react',
 * //     'zustand/': 'https://esm.sh/zustand@4.4.7&external=react/'
 * //   }
 * // }
 */
export function generateImportMap(
  packageJson: PackageJson,
  options?: GenerateImportMapOptions
): ImportMapJson {
  const cdn = options?.cdn ?? 'https://esm.sh';
  const exclude = new Set(options?.exclude ?? []);
  const includeDevDeps = options?.includeDevDependencies ?? false;
  const includeSubpaths = options?.includeSubpaths ?? true;
  const overrides = options?.overrides ?? {};

  // Collect all dependencies to process
  const allDeps: Record<string, string> = {};

  if (packageJson.dependencies) {
    for (const [name, version] of Object.entries(packageJson.dependencies)) {
      if (!exclude.has(name)) {
        allDeps[name] = version;
      }
    }
  }

  if (includeDevDeps && packageJson.devDependencies) {
    for (const [name, version] of Object.entries(packageJson.devDependencies)) {
      if (!exclude.has(name) && !(name in allDeps)) {
        allDeps[name] = version;
      }
    }
  }

  const imports: Record<string, string> = {};

  // Process each dependency
  for (const [name, version] of Object.entries(allDeps)) {
    const cleanVersion = stripVersionRange(version);

    // Determine externals for this package
    const externals =
      options?.externals ?? getPackageExternals(name, allDeps);

    // Main entry
    imports[name] = generateCdnUrl(name, cleanVersion, { cdn, externals });

    // Subpath entry
    if (includeSubpaths) {
      imports[`${name}/`] = generateCdnUrl(name, cleanVersion, {
        cdn,
        externals,
        subpath: '/',
      });
    }

    // Special handling for React
    if (name === 'react') {
      imports['react/jsx-runtime'] = `${cdn}/react@${cleanVersion}/jsx-runtime`;
      imports['react/jsx-dev-runtime'] = `${cdn}/react@${cleanVersion}/jsx-dev-runtime`;
    }

    // Special handling for React DOM
    if (name === 'react-dom') {
      imports['react-dom/client'] = `${cdn}/react-dom@${cleanVersion}/client`;
    }
  }

  // Apply overrides last (they take precedence)
  for (const [key, value] of Object.entries(overrides)) {
    imports[key] = value;
  }

  return { imports };
}
