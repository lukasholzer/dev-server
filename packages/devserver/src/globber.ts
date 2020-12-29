import { readdirSync, statSync } from 'fs';
import { extname, join } from 'path';

export function globber(directory, filepaths = []) {
  const files = readdirSync(directory);
  for (let filename of files) {
      const filepath = join(directory, filename);
      if (statSync(filepath).isDirectory()) {
          globber(filepath, filepaths);
      } else if (extname(filename) === '.json') {
          filepaths.push(filepath);
      }
  }
  return filepaths;
}



