import { existsSync, readFileSync } from 'fs';
import { join, sep } from 'path';
import { evaluateMapping } from './evalute-mapping';

const cache = new Map<string, object>();

export function resolveModule(id: string, moduleDirs: string[]): string {
  const parts = id.split('/');
  const base = id.startsWith('@') ? `${parts[0]}${sep}${parts[1]}` : parts[0];

  const pkgPath = moduleDirs
    .map((dir) => [dir, 'node_modules', base, 'package.json'].join(sep))
    .find((path) => existsSync(path));

  if (pkgPath) {
    let pkg;

    if (cache.has(pkgPath)) {
      pkg = cache.get(pkgPath);
    } else {
      pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      cache.set(pkgPath, pkg);
    }

    const resolved = resolveModuleEntry(id, pkg);
    if (resolved) {
      return `.${sep}${join(base, resolved)}`;
    }
  }
  // fallback to require.resolve
  return require.resolve(id, { paths: moduleDirs });
}

export function resolveModuleEntry(id: string, pkg: any): string {
  const path = id.replace(pkg.name as string, '').replace(/^\//, '');

  if (Object.prototype.hasOwnProperty.call(pkg, 'exports')) {
    const entry = parseExportsMap(pkg.exports, path);
    if (entry) {
      return entry;
    }
  }

  for (const field of ['module', 'browser', 'umd', 'main']) {
    if (Object.prototype.hasOwnProperty.call(pkg, field)) {
      return pkg[field];
    }
  }

  return '';
}

/**
 * Parse the exports map of the package json
 * @param exportsMap The exports map field
 * @param path The path of the package (the sub-package path without leading slash)
 */
export function parseExportsMap(
  exportsMap: {
    [key: string]: object | string | string[];
  },
  path: string = ''
): string | null {
  for (const [key, value] of Object.entries(exportsMap)) {
    // remove the relative path from the export maps key.
    const cleanKey = key.replace(/^\.\/?/gm, '');
    if (cleanKey !== path) {
      continue;
    }

    return evaluateMapping(value, ['import', 'browser', 'default']);
  }
  return null;
}
