import { fastify } from 'fastify';
import { existsSync, lstatSync, readFileSync } from 'fs';
import { extname, parse, sep } from 'path';
import { importTransformer } from './import-transformer';

export function startServer(config: {
  moduleDirs: string[];
  rootDir: string;
  index?: string;
}) {
  const server = fastify({
    // logger: true,
  });

  server.get('/', (request, reply) => {
    const index = readFileSync(
      `${config.rootDir}${sep}${config.index || 'index.html'}`,
      'utf-8'
    );
    reply.type('text/html').code(200).send(index);
  });

  server.get('/*', (request, reply) => {
    const resolved = resolveModule(request.url, [
      config.rootDir,
      ...config.moduleDirs,
    ]);
    console.log(resolved);

    if (!resolved) {
      reply.code(404);
      return;
    }

    if (resolved.contentType === 'text/javascript') {
      resolved.content = importTransformer(
        request.url,
        resolved.content,
        config.moduleDirs
      );
    }

    reply.code(200).type(resolved.contentType).send(resolved.content);
  });

  server.listen(3000, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    server.log.info(`Server listening at ${address}`);
  });
}

function resolveModule(moduleName: string, dirs: string[]) {
  let dir;

  for (let i = 0, max = dirs.length; i < max; i++) {
    const fullPath = `${dirs[i]}${sep}${moduleName.replace(/^\//, '')}`;
    const { ext } = parse(moduleName);
    if (existsSync(fullPath) && lstatSync(fullPath).isFile()) {
      dir = fullPath;
      break;
    }
    if (!ext.length) {
      dir = getFileForModuleName(fullPath);
      break;
    }
  }

  if (dir) {
    return {
      contentType: getContentType(extname(dir)),
      content: readFileSync(dir, 'utf-8'),
    };
  }
}

function getFileForModuleName(pathWithoutExt: string): string | null {
  const extensions = [
    `/index.mjs`,
    `/index.js`,
    '.js',
    '.mjs',
    '.html',
    '.css',
  ];
  for (const ext of extensions) {
    const pathWithExtension = `${pathWithoutExt}${ext}`;
    if (existsSync(pathWithExtension)) {
      return pathWithExtension;
    }
  }
  return null;
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 */
function getContentType(ext: string) {
  switch (ext) {
    case '.html':
      return 'text/html';
    case '.js':
    case '.mjs':
      return 'text/javascript';
    case '.css':
      return 'text/css';
    default:
      return 'text/plain';
  }
}
