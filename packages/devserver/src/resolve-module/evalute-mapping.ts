
/**
 * Evaluate a Conditional Export Map.
 * @see https://nodejs.org/api/esm.html#esm_conditional_exports
 * @see https://github.com/jkrems/proposal-pkg-exports#2-conditional-mapping
 */
export function evaluateMapping(
  value: object | string | string[],
  conditions: string[]
): string | null {
  // value is a string: "./a.js"
  if (typeof value === 'string' && value.startsWith('./')) {
    return value;
  }

  // value is an array: ["not:valid", "./a.js"]
  if (Array.isArray(value)) {
    for (const mapped of value) {
      const result = evaluateMapping(mapped, conditions);
      if (result) {
        return result;
      }
    }
    return null;
  }

  // { "browser": "./browser.js", "node": "./a.js" }
  for (const env of conditions) {
    if (Object.prototype.hasOwnProperty.call(value, env)) {
      return value[env];
    }
  }

  return null;
}
