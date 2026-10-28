// Removes the source maps ng-packagr always emits for the FESM bundles of `dist/atomic`, so that
// `npm pack ./dist/atomic` yields the approved nine-file archive with no source-path leakage.
//
// The manual pack flow and the archive verifier's rebuild both call this one helper:
//   node scripts/sanitize-atomic-dist.mjs [dist/atomic]
//
// It is deliberately strict. It requires exactly the three secondary-entry maps and, in each
// matching bundle, exactly one terminal `//# sourceMappingURL=<own map>` line. It removes only
// those lines (and the blank line before them), deletes the three maps, and then proves that no
// map file and no `sourceMappingURL` text remains anywhere under the directory. Anything missing,
// additional, malformed or non-terminal is an error and nothing is partially hidden.
import { readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ENTRY_POINTS = ['atoms', 'molecules', 'organisms'];
const BUNDLES = ENTRY_POINTS.map((entry) => `fesm2022/brand-ui-atomic-${entry}.mjs`);

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

/**
 * @param {string} dist the `dist/atomic` directory
 * @returns {{ removed: string[] }} the maps that were deleted (directory-relative, forward slashes)
 * @throws {Error} listing every problem found; the directory is untouched in that case
 */
export function sanitizeAtomicDist(dist) {
  const root = resolve(dist);
  const files = walk(root).map((path) => relative(root, path).split(sep).join('/'));
  const problems = [];

  const expectedMaps = BUNDLES.map((bundle) => `${bundle}.map`);
  const maps = files.filter((file) => /\.map$/i.test(file));
  for (const map of expectedMaps) if (!maps.includes(map)) problems.push(`missing ${map}`);
  for (const map of maps) if (!expectedMaps.includes(map)) problems.push(`unexpected ${map}`);

  const rewritten = new Map();
  for (const bundle of BUNDLES) {
    if (!files.includes(bundle)) {
      problems.push(`missing ${bundle}`);
      continue;
    }
    const text = readFileSync(join(root, bundle), 'utf8').replace(/\r\n/g, '\n');
    const references = text.match(/sourceMappingURL/g)?.length ?? 0;
    const terminal = /\n+\/\/# sourceMappingURL=([^\s]+)\n?$/.exec(text);
    if (references !== 1) {
      problems.push(`${bundle}: expected exactly one sourceMappingURL, found ${references}`);
    } else if (!terminal) {
      problems.push(`${bundle}: sourceMappingURL is malformed or not the terminal line`);
    } else if (terminal[1] !== `${bundle.slice(bundle.lastIndexOf('/') + 1)}.map`) {
      problems.push(`${bundle}: sourceMappingURL names ${terminal[1]}, not its own map`);
    } else {
      rewritten.set(bundle, `${text.slice(0, terminal.index).trimEnd()}\n`);
    }
  }

  // Every other file must already be free of source-map references.
  for (const file of files) {
    if (BUNDLES.includes(file) || expectedMaps.includes(file)) continue;
    if (/sourceMappingURL/.test(readFileSync(join(root, file)).toString('latin1'))) {
      problems.push(`${file}: contains a sourceMappingURL reference`);
    }
  }
  if (problems.length) {
    throw new Error(
      `sanitize-atomic-dist failed (${problems.length}):\n- ${problems.join('\n- ')}`,
    );
  }

  for (const [bundle, text] of rewritten) writeFileSync(join(root, bundle), text);
  for (const map of expectedMaps) rmSync(join(root, map));

  // Proof: nothing source-map related is left.
  const leftover = walk(root).filter(
    (path) =>
      /\.map$/i.test(path) || /sourceMappingURL/.test(readFileSync(path).toString('latin1')),
  );
  if (leftover.length) {
    throw new Error(
      `sanitize-atomic-dist: source-map content remains in ${leftover.map((p) => relative(root, p)).join(', ')}`,
    );
  }
  return { removed: expectedMaps };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dist = resolve(
    process.argv[2] ?? join(fileURLToPath(import.meta.url), '../../dist/atomic'),
  );
  try {
    const { removed } = sanitizeAtomicDist(dist);
    console.log(
      `sanitize-atomic-dist passed (removed ${removed.length} maps and their references).`,
    );
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
