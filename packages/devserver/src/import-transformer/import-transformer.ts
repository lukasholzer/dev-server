import { dirname, join } from 'path';
import { resolveModule } from '../resolve-module';
import { getRelativeBase } from './get-relative-base';

/**
 * Transform all module identifiers from import and require statements to relative paths,
 * that the browser can resolve them.
 * @param currentUrl The current path of the file that should be transformed
 * @param content The file content of the javascript file
 * @param moduleDirs A list of node_modules directories to look for the packages.
 */
export function importTransformer(
  currentUrl: string,
  content: string,
  moduleDirs: string[]
): string {
  const nodeModuleReplaceFn = resolveNodeModulesReplacer(
    moduleDirs,
    currentUrl
  );
  const cssImportReplaceFn = cssImportReplacer(currentUrl);

  // replace all imports require statements of node_modules in the provided javascript file.
  // they are replaced to a relative path instead of a module identifier.
  return content
    .replace(/from\s*["'`](?!\.*\/)(\S+?)["'`]/gm, nodeModuleReplaceFn)
    .replace(/require\(["'`](?!\.*\/)(\S+?)["'`]\)/gm, nodeModuleReplaceFn)
    .replace(/import\s*["'`](\S+?\.css)["'`]/gm, cssImportReplaceFn);
}

/**
 * Factory function that creates a replace function for string.prototype.replace,
 * that is used to resolve the node modules name to a relative path.
 * It will try to resolve to a ECMA script file through respecting export maps
 * and preferring module and browser entry points over default commonjs.
 * @param moduleDirs An array of node_modules directories
 * @param currentUrl The current path of the file that has the import.
 * Needed to generate relative urls to the root.
 */
function resolveNodeModulesReplacer(
  moduleDirs: string[],
  currentUrl: string
): (match: string, group1: string) => string {
  return (match: string, group1: string) => {
    // create a url that starts with node_modules to identify it is a node_module and not a src.
    const resolved = join('node_modules', resolveModule(group1, moduleDirs));
    return match.replace(group1, `${getRelativeBase(currentUrl)}${resolved}`);
  };
}

/**
 * Factory function that creates a replace function for string.prototype.replace,
 * that is used to replace css imports `import 'style.css' with a function that injects the styles.
 * @param currentUrl The current path of the file that should be transformed
 */
function cssImportReplacer(
  currentUrl: string
): (match: string, group1: string) => string {
  return (_: string, group1: string) => {
    return `injectCssFile('${dirname(currentUrl)}/${group1.replace(/^\.*\//, '')}')`;
  };
}