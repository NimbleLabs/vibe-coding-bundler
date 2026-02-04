import { describe, it, expect } from 'vitest';
import {
  parseImportMap,
  resolveImportMap,
  isBareSpecifier,
  isRemoteURL,
  extractPackageName,
} from '../src/importMap';
import { ImportMapError } from '../src/errors';

describe('parseImportMap', () => {
  it('should parse empty import map', () => {
    const result = parseImportMap({});
    expect(result.imports.size).toBe(0);
    expect(result.scopes.size).toBe(0);
  });

  it('should parse simple imports', () => {
    const result = parseImportMap({
      imports: {
        lodash: 'https://cdn.example.com/lodash.js',
        react: 'https://cdn.example.com/react.js',
      },
    });

    expect(result.imports.get('lodash')).toBe('https://cdn.example.com/lodash.js');
    expect(result.imports.get('react')).toBe('https://cdn.example.com/react.js');
  });

  it('should parse prefix mappings', () => {
    const result = parseImportMap({
      imports: {
        'lodash/': 'https://cdn.example.com/lodash/',
      },
    });

    expect(result.imports.get('lodash/')).toBe('https://cdn.example.com/lodash/');
  });

  it('should parse scopes', () => {
    const result = parseImportMap({
      imports: {
        lodash: 'https://cdn.example.com/lodash@4.js',
      },
      scopes: {
        '/legacy/': {
          lodash: 'https://cdn.example.com/lodash@3.js',
        },
      },
    });

    expect(result.imports.get('lodash')).toBe('https://cdn.example.com/lodash@4.js');
    expect(result.scopes.get('file:///legacy/')?.get('lodash')).toBe(
      'https://cdn.example.com/lodash@3.js'
    );
  });

  it('should normalize relative URLs in values', () => {
    const result = parseImportMap(
      {
        imports: {
          // Bare specifier key stays as-is, value gets normalized
          utils: './lib/utils.js',
        },
      },
      'file:///app/'
    );

    // The key 'utils' is a bare specifier, so it stays as-is
    // The value './lib/utils.js' gets normalized relative to baseURL
    expect(result.imports.get('utils')).toBe('file:///app/lib/utils.js');
  });

  it('should throw on invalid imports type', () => {
    expect(() => parseImportMap({ imports: [] as unknown as Record<string, string> })).toThrow(
      ImportMapError
    );
    expect(() => parseImportMap({ imports: [] as unknown as Record<string, string> })).toThrow(
      'Import map "imports" must be an object'
    );
  });

  it('should throw on invalid scopes type', () => {
    expect(() =>
      parseImportMap({ scopes: [] as unknown as Record<string, Record<string, string>> })
    ).toThrow(ImportMapError);
  });

  it('should handle scoped packages', () => {
    const result = parseImportMap({
      imports: {
        '@scope/pkg': 'https://cdn.example.com/@scope/pkg.js',
        '@scope/pkg/': 'https://cdn.example.com/@scope/pkg/',
      },
    });

    expect(result.imports.get('@scope/pkg')).toBe('https://cdn.example.com/@scope/pkg.js');
    expect(result.imports.get('@scope/pkg/')).toBe('https://cdn.example.com/@scope/pkg/');
  });
});

describe('resolveImportMap', () => {
  const importMap = parseImportMap({
    imports: {
      react: 'https://esm.sh/react',
      'react-dom': 'https://esm.sh/react-dom',
      'lodash/': 'https://esm.sh/lodash/',
      '@scope/pkg': 'https://esm.sh/@scope/pkg',
    },
    scopes: {
      '/src/legacy/': {
        react: 'https://esm.sh/react@17',
      },
      '/src/': {
        lodash: 'https://esm.sh/lodash@4',
      },
    },
  });

  it('should resolve exact matches', () => {
    expect(resolveImportMap('react', '/src/app.ts', importMap)).toBe('https://esm.sh/react');
  });

  it('should resolve prefix matches', () => {
    expect(resolveImportMap('lodash/debounce', '/src/app.ts', importMap)).toBe(
      'https://esm.sh/lodash/debounce'
    );
  });

  it('should resolve scoped packages', () => {
    expect(resolveImportMap('@scope/pkg', '/src/app.ts', importMap)).toBe(
      'https://esm.sh/@scope/pkg'
    );
  });

  it('should use scope-specific mapping when referrer matches', () => {
    expect(resolveImportMap('react', '/src/legacy/old.ts', importMap)).toBe(
      'https://esm.sh/react@17'
    );
  });

  it('should use more specific scope over less specific', () => {
    // /src/legacy/ is more specific than /src/
    expect(resolveImportMap('react', '/src/legacy/component.ts', importMap)).toBe(
      'https://esm.sh/react@17'
    );
  });

  it('should fall back to top-level when scope has no match', () => {
    // /src/ scope doesn't have react-dom, should use top-level
    expect(resolveImportMap('react-dom', '/src/app.ts', importMap)).toBe(
      'https://esm.sh/react-dom'
    );
  });

  it('should return null for unmapped specifiers', () => {
    expect(resolveImportMap('unknown-package', '/src/app.ts', importMap)).toBeNull();
  });

  it('should handle referrer with file:// prefix', () => {
    expect(resolveImportMap('react', 'file:///src/app.ts', importMap)).toBe('https://esm.sh/react');
  });
});

describe('isBareSpecifier', () => {
  it('should identify bare specifiers', () => {
    expect(isBareSpecifier('lodash')).toBe(true);
    expect(isBareSpecifier('@scope/pkg')).toBe(true);
    expect(isBareSpecifier('lodash/debounce')).toBe(true);
    expect(isBareSpecifier('@scope/pkg/utils')).toBe(true);
  });

  it('should reject relative paths', () => {
    expect(isBareSpecifier('./foo')).toBe(false);
    expect(isBareSpecifier('../foo')).toBe(false);
    expect(isBareSpecifier('./foo/bar')).toBe(false);
  });

  it('should reject absolute paths', () => {
    expect(isBareSpecifier('/foo')).toBe(false);
    expect(isBareSpecifier('/foo/bar')).toBe(false);
  });

  it('should reject URLs', () => {
    expect(isBareSpecifier('https://example.com/foo.js')).toBe(false);
    expect(isBareSpecifier('http://example.com/foo.js')).toBe(false);
    expect(isBareSpecifier('file:///foo.js')).toBe(false);
  });
});

describe('isRemoteURL', () => {
  it('should identify remote URLs', () => {
    expect(isRemoteURL('https://example.com/foo.js')).toBe(true);
    expect(isRemoteURL('http://example.com/foo.js')).toBe(true);
  });

  it('should reject non-remote URLs', () => {
    expect(isRemoteURL('file:///foo.js')).toBe(false);
    expect(isRemoteURL('/foo.js')).toBe(false);
    expect(isRemoteURL('./foo.js')).toBe(false);
    expect(isRemoteURL('lodash')).toBe(false);
  });
});

describe('extractPackageName', () => {
  it('should extract simple package names', () => {
    expect(extractPackageName('lodash')).toBe('lodash');
    expect(extractPackageName('react')).toBe('react');
  });

  it('should extract package name from subpaths', () => {
    expect(extractPackageName('lodash/debounce')).toBe('lodash');
    expect(extractPackageName('react/jsx-runtime')).toBe('react');
  });

  it('should handle scoped packages', () => {
    expect(extractPackageName('@scope/pkg')).toBe('@scope/pkg');
    expect(extractPackageName('@babel/core')).toBe('@babel/core');
  });

  it('should handle scoped packages with subpaths', () => {
    expect(extractPackageName('@scope/pkg/utils')).toBe('@scope/pkg');
    expect(extractPackageName('@babel/core/lib/parser')).toBe('@babel/core');
  });
});
