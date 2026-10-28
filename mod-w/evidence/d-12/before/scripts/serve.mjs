// D-12 measurement server: serves a production build under a base path over local HTTP.
// Usage: node serve.mjs <root-dir> <port> [base-path=/brand-ui/]
// Compression is dynamic gzip (zlib level 9) for text types when the client accepts gzip,
// mirroring a static host. Identical implementation must be reused for the after-measurement.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { extname, join, normalize, resolve, sep } from 'node:path';

const [rootArg, portArg, baseArg = '/brand-ui/'] = process.argv.slice(2);
if (!rootArg || !portArg) {
  console.error('usage: node serve.mjs <root-dir> <port> [base-path]');
  process.exit(2);
}

const root = resolve(rootArg);
const port = Number(portArg);
const base = baseArg.endsWith('/') ? baseArg : `${baseArg}/`;
const GZIP_LEVEL = 9;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};
const COMPRESSIBLE = new Set([
  '.html',
  '.js',
  '.mjs',
  '.css',
  '.json',
  '.webmanifest',
  '.svg',
  '.txt',
  '.map',
]);

async function fileOrNull(path) {
  try {
    return (await stat(path)).isFile() ? path : null;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://localhost:${port}`);
    if (url.pathname === base.slice(0, -1)) {
      res.writeHead(301, { Location: base }).end();
      return;
    }
    if (!url.pathname.startsWith(base)) {
      res.writeHead(404).end('not found');
      return;
    }

    const rel = decodeURIComponent(url.pathname.slice(base.length));
    const candidate = normalize(join(root, rel));
    if (candidate !== root && !candidate.startsWith(root + sep)) {
      res.writeHead(403).end('forbidden');
      return;
    }

    // Exact file, else (for extension-less routes) the SPA entry point.
    let file = rel === '' ? null : await fileOrNull(candidate);
    if (!file && extname(rel) === '') file = await fileOrNull(join(root, 'index.html'));
    if (!file) {
      res.writeHead(404).end('not found');
      return;
    }

    const ext = extname(file).toLowerCase();
    let body = await readFile(file);
    const headers = {
      'Content-Type': TYPES[ext] ?? 'application/octet-stream',
      'Cache-Control': 'no-cache',
    };
    if (COMPRESSIBLE.has(ext)) {
      headers['Vary'] = 'Accept-Encoding';
      if (/\bgzip\b/.test(String(req.headers['accept-encoding'] ?? ''))) {
        body = gzipSync(body, { level: GZIP_LEVEL });
        headers['Content-Encoding'] = 'gzip';
      }
    }
    headers['Content-Length'] = body.length;
    res.writeHead(200, headers).end(req.method === 'HEAD' ? undefined : body);
  } catch (error) {
    console.error(error);
    res.writeHead(500).end('error');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`listening pid=${process.pid} http://localhost:${port}${base} root=${root} gzip=level${GZIP_LEVEL}`);
});
