import { describe, it, expect } from 'vitest';
import {
  VirtualFS,
  normalizePath,
  resolvePath,
  detectLoader,
  getDirectory,
  getExtension,
  getFilename,
  contentsToString,
  contentsToBytes,
} from '../src/fs';
import { FileNotFoundError } from '../src/errors';

describe('normalizePath', () => {
  it('should remove leading ./', () => {
    expect(normalizePath('./foo/bar.js')).toBe('/foo/bar.js');
  });

  it('should normalize multiple slashes', () => {
    expect(normalizePath('foo//bar///baz.js')).toBe('/foo/bar/baz.js');
  });

  it('should add leading slash if missing', () => {
    expect(normalizePath('foo/bar.js')).toBe('/foo/bar.js');
  });

  it('should preserve absolute paths', () => {
    expect(normalizePath('/foo/bar.js')).toBe('/foo/bar.js');
  });

  it('should remove trailing slashes', () => {
    expect(normalizePath('/foo/bar/')).toBe('/foo/bar');
  });
});

describe('resolvePath', () => {
  it('should resolve relative paths', () => {
    expect(resolvePath('/src/utils/index.ts', './helper.ts')).toBe('/src/utils/helper.ts');
  });

  it('should resolve parent directory references', () => {
    expect(resolvePath('/src/utils/index.ts', '../lib/utils.ts')).toBe('/src/lib/utils.ts');
  });

  it('should handle multiple parent references', () => {
    expect(resolvePath('/src/deep/nested/file.ts', '../../other/file.ts')).toBe(
      '/src/other/file.ts'
    );
  });

  it('should handle absolute paths', () => {
    expect(resolvePath('/src/index.ts', '/lib/utils.ts')).toBe('/lib/utils.ts');
  });

  it('should handle . in paths', () => {
    expect(resolvePath('/src/index.ts', '././foo/./bar.ts')).toBe('/src/foo/bar.ts');
  });
});

describe('getDirectory', () => {
  it('should get directory from path', () => {
    expect(getDirectory('/src/utils/index.ts')).toBe('/src/utils');
  });

  it('should return / for root files', () => {
    expect(getDirectory('/index.ts')).toBe('/');
  });

  it('should handle deeply nested paths', () => {
    expect(getDirectory('/a/b/c/d/e.ts')).toBe('/a/b/c/d');
  });
});

describe('getExtension', () => {
  it('should get file extension', () => {
    expect(getExtension('/foo/bar.ts')).toBe('.ts');
    expect(getExtension('/foo/bar.min.js')).toBe('.js');
  });

  it('should return empty string for no extension', () => {
    expect(getExtension('/foo/bar')).toBe('');
    expect(getExtension('/foo/Makefile')).toBe('');
  });

  it('should handle hidden files', () => {
    expect(getExtension('/foo/.gitignore')).toBe('.gitignore');
  });
});

describe('getFilename', () => {
  it('should get filename from path', () => {
    expect(getFilename('/src/utils/index.ts')).toBe('index.ts');
  });

  it('should handle root-level files', () => {
    expect(getFilename('/package.json')).toBe('package.json');
  });
});

describe('detectLoader', () => {
  it('should detect JavaScript loaders', () => {
    expect(detectLoader('/foo.js')).toBe('js');
    expect(detectLoader('/foo.mjs')).toBe('js');
    expect(detectLoader('/foo.cjs')).toBe('js');
  });

  it('should detect TypeScript loaders', () => {
    expect(detectLoader('/foo.ts')).toBe('ts');
    expect(detectLoader('/foo.mts')).toBe('ts');
    expect(detectLoader('/foo.cts')).toBe('ts');
  });

  it('should detect JSX/TSX loaders', () => {
    expect(detectLoader('/foo.jsx')).toBe('jsx');
    expect(detectLoader('/foo.tsx')).toBe('tsx');
  });

  it('should detect CSS loader', () => {
    expect(detectLoader('/foo.css')).toBe('css');
  });

  it('should detect JSON loader', () => {
    expect(detectLoader('/foo.json')).toBe('json');
  });

  it('should detect binary loaders', () => {
    expect(detectLoader('/foo.png')).toBe('binary');
    expect(detectLoader('/foo.wasm')).toBe('binary');
    expect(detectLoader('/foo.woff2')).toBe('binary');
  });

  it('should default to js for unknown extensions', () => {
    expect(detectLoader('/foo.unknown')).toBe('js');
    expect(detectLoader('/foo')).toBe('js');
  });
});

describe('VirtualFS', () => {
  const files = {
    '/src/index.ts': 'export const x = 1;',
    '/src/utils/helper.ts': 'export function help() {}',
    '/src/utils/index.ts': 'export * from "./helper";',
    'package.json': '{"name": "test"}', // Without leading slash
    './relative.js': 'console.log("relative");', // With ./
  };

  it('should normalize paths on construction', () => {
    const vfs = new VirtualFS(files);
    expect(vfs.exists('/package.json')).toBe(true);
    expect(vfs.exists('/relative.js')).toBe(true);
  });

  it('should check if files exist', () => {
    const vfs = new VirtualFS(files);
    expect(vfs.exists('/src/index.ts')).toBe(true);
    expect(vfs.exists('/nonexistent.ts')).toBe(false);
  });

  it('should read files', () => {
    const vfs = new VirtualFS(files);
    expect(vfs.read('/src/index.ts')).toBe('export const x = 1;');
  });

  it('should throw FileNotFoundError for missing files', () => {
    const vfs = new VirtualFS(files);
    expect(() => vfs.read('/nonexistent.ts')).toThrow(FileNotFoundError);
  });

  it('should resolve files with extension inference', () => {
    const vfs = new VirtualFS(files);
    // Without extension - basePath should be the importing file
    const result = vfs.resolveWithExtensions('/src/app.ts', './index');
    expect(result).not.toBeNull();
    expect(result?.path).toBe('/src/index.ts');
  });

  it('should resolve index files in directories', () => {
    const vfs = new VirtualFS(files);
    // basePath should be the importing file
    const result = vfs.resolveWithExtensions('/src/index.ts', './utils');
    expect(result).not.toBeNull();
    expect(result?.path).toBe('/src/utils/index.ts');
  });

  it('should return null for unresolvable paths', () => {
    const vfs = new VirtualFS(files);
    const result = vfs.resolveWithExtensions('/src', './nonexistent');
    expect(result).toBeNull();
  });

  it('should list all files', () => {
    const vfs = new VirtualFS(files);
    const list = vfs.list();
    expect(list).toContain('/src/index.ts');
    expect(list).toContain('/src/utils/helper.ts');
    expect(list.length).toBe(5);
  });

  it('should handle binary content', () => {
    const binary = new Uint8Array([0x00, 0x01, 0x02, 0x03]);
    const vfs = new VirtualFS({
      '/binary.dat': binary,
    });
    expect(vfs.read('/binary.dat')).toEqual(binary);
  });

  it('should write and delete files', () => {
    const vfs = new VirtualFS({});
    vfs.write('/new-file.ts', 'new content');
    expect(vfs.exists('/new-file.ts')).toBe(true);
    expect(vfs.read('/new-file.ts')).toBe('new content');

    vfs.delete('/new-file.ts');
    expect(vfs.exists('/new-file.ts')).toBe(false);
  });

  it('should clone the file system', () => {
    const vfs = new VirtualFS(files);
    const clone = vfs.clone();

    expect(clone.list()).toEqual(vfs.list());
    expect(clone.read('/src/index.ts')).toBe(vfs.read('/src/index.ts'));

    // Modifications to clone should not affect original
    clone.write('/new-file.ts', 'content');
    expect(clone.exists('/new-file.ts')).toBe(true);
    expect(vfs.exists('/new-file.ts')).toBe(false);
  });
});

describe('contentsToString', () => {
  it('should pass through strings', () => {
    expect(contentsToString('hello')).toBe('hello');
  });

  it('should decode Uint8Array', () => {
    const bytes = new TextEncoder().encode('hello');
    expect(contentsToString(bytes)).toBe('hello');
  });
});

describe('contentsToBytes', () => {
  it('should pass through Uint8Array', () => {
    const bytes = new Uint8Array([1, 2, 3]);
    expect(contentsToBytes(bytes)).toBe(bytes);
  });

  it('should encode strings', () => {
    const result = contentsToBytes('hello');
    expect(result).toBeInstanceOf(Uint8Array);
    expect(new TextDecoder().decode(result)).toBe('hello');
  });
});
