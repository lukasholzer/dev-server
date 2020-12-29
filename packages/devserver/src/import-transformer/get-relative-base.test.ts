import { getRelativeBase } from './get-relative-base';

test('should get the relative base for a base path', () => {
  expect(getRelativeBase('/main.js')).toBe('./');
});

test('should get the relative base for one level nested', () => {
  expect(getRelativeBase('/app/app.js')).toBe('../');
});

test('should get the relative base for a deep node_module', () => {
  expect(
    getRelativeBase('/node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs')
  ).toBe('../../../../');
});

