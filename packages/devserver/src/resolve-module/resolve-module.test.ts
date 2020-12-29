import { parseExportsMap, resolveModuleEntry } from './resolve-module';

let withExportsMap;

beforeEach(() => {
  withExportsMap = {
    name: 'preact',
    main: 'dist/preact.js',
    module: 'dist/preact.module.js',
    exports: {
      '.': {
        browser: './dist/preact.module.js',
        umd: './dist/preact.umd.js',
        import: './dist/preact.mjs',
        require: './dist/preact.js',
      },
      './jsx-runtime': {
        browser: './jsx-runtime/dist/jsxRuntime.module.js',
        umd: './jsx-runtime/dist/jsxRuntime.umd.js',
        require: './jsx-runtime/dist/jsxRuntime.js',
        import: './jsx-runtime/dist/jsxRuntime.mjs',
      },
    },
  };
});

test('it should parse the export map for the main entry', () => {
  expect(parseExportsMap(withExportsMap.exports, '')).toBe('./dist/preact.mjs');
});

test('it should parse the export map for the jsx-runtime entry', () => {
  expect(parseExportsMap(withExportsMap.exports, 'jsx-runtime')).toBe(
    './jsx-runtime/dist/jsxRuntime.mjs'
  );
});

test('it should use the export map instead of the module entries for resolving', () => {
  expect(resolveModuleEntry('preact', withExportsMap)).toBe(
    './dist/preact.mjs'
  );
});

test('it should use the export map instead of the module entries for resolving', () => {
  expect(resolveModuleEntry('preact/jsx-runtime', withExportsMap)).toBe(
    './jsx-runtime/dist/jsxRuntime.mjs'
  );
});

test('it should use the module field if no export map is present', () => {
  delete withExportsMap.exports;

  expect(resolveModuleEntry('preact', withExportsMap)).toBe(
    'dist/preact.module.js'
  );
});

test('it should fallback to the main field if nothing else is present', () => {
  delete withExportsMap.exports;
  delete withExportsMap.module;

  expect(resolveModuleEntry('preact', withExportsMap)).toBe('dist/preact.js');
});
