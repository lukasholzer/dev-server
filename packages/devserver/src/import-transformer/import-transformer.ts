import { join } from 'path';
import { resolveModule } from '../resolve-module';
import { getRelativeBase } from './get-relative-base';

export function importTransformer(
  currentUrl: string,
  content: string,
  moduleDirs: string[]
): string {
  const replaceFn = replacer(moduleDirs, currentUrl);
  return content
    .replace(/from\s*["'`](\S+?)["'`]/gm, replaceFn)
    .replace(/require\(["'`](\S+?)["'`]\)/gm, replaceFn);
}

function replacer(
  moduleDirs: string[],
  currentUrl: string
): (match: string, group1: string) => string {
  return (match: string, group1: string) => {
    if (!group1.match(/^\.*\//gm)) {
      const resolved = join('node_modules', resolveModule(group1, moduleDirs));
      return match.replace(group1, `${getRelativeBase(currentUrl)}${resolved}`);
    }

    return match;
  };
}
