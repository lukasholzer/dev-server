/**
 * Get a relative path to the root from the url
 * @param url The url that should be used to get the relative path
 */
export function getRelativeBase(url: string): string {
  // replace leading slash
  const parts = url.substr(1).split('/').slice(1).fill('..');

  if (parts.length === 0) {
    return './';
  }

  return `${parts.join('/')}/`;
}
