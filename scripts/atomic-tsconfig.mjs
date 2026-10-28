// Structural `paths` verification for the @brand-ui/atomic installed-consumption boundary (AC-23).
//
// Configurations are parsed as JSONC with the TypeScript parser, never matched with patterns, and
// the `extends` chain is resolved with TypeScript semantics (the nearest definition of `paths` or
// `baseUrl` replaces its parent's). Outside the single approved producer-test configuration, no
// `paths` target of any key may resolve into atomic source, `dist/atomic`, or the installed
// package, and no key may shadow `@brand-ui/atomic`.
//
// Importable without side effects so the self-test can drive it with in-memory fixtures.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, posix, relative } from 'node:path';
import ts from 'typescript';

export const EXEMPT_CONFIG = 'projects/atomic/tsconfig.spec.json';
export const EXEMPT_STRUCTURE = {
  extends: '../../tsconfig.json',
  compilerOptions: {
    outDir: '../../out-tsc/atomic-spec',
    types: ['vitest/globals'],
    paths: {
      '@brand-ui/atomic/atoms': ['./atoms/src/public-api.ts'],
      '@brand-ui/atomic/molecules': ['./molecules/src/public-api.ts'],
      '@brand-ui/atomic/organisms': ['./organisms/src/public-api.ts'],
    },
  },
  include: ['src/**/*.d.ts', '**/*.spec.ts'],
};
const FORBIDDEN_ROOTS = ['projects/atomic', 'dist/atomic', 'node_modules/@brand-ui/atomic'];
const PACKAGE_KEY = '@brand-ui/atomic';

const lower = (path) => path.toLowerCase();
const within = (path, root) => lower(path) === root || lower(path).startsWith(`${root}/`);
const forbiddenRoot = (path) => FORBIDDEN_ROOTS.find((root) => within(path, root));
const hasTemplate = (value) => typeof value === 'string' && value.includes('${');

function deepEqual(a, b) {
  if (Array.isArray(a) || Array.isArray(b)) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((item, index) => deepEqual(item, b[index]))
    );
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const keys = Object.keys(a);
    return (
      keys.length === Object.keys(b).length &&
      keys.every((key) => Object.hasOwn(b, key) && deepEqual(a[key], b[key]))
    );
  }
  return a === b;
}

/**
 * @param {Map<string, string>} configs repository-relative forward-slash path -> JSONC text
 * @returns {string[]} problems; empty when the boundary holds
 */
export function tsconfigPathProblems(configs) {
  const problems = [];
  const parsed = new Map();
  for (const [path, text] of configs) {
    const { config, error } = ts.parseConfigFileTextToJson(path, text);
    if (error || !config || typeof config !== 'object') {
      problems.push(`${path}: unanalyzable (does not parse as JSONC)`);
    } else parsed.set(path, config);
  }

  const resolveExtends = (from, entry) => {
    if (typeof entry !== 'string' || !/^\.\.?\//.test(entry) || hasTemplate(entry)) return null;
    const base = posix.normalize(posix.join(posix.dirname(from), entry));
    return [base, `${base}.json`].find((candidate) => parsed.has(candidate)) ?? null;
  };

  // Effective `paths` / `baseUrl` with TypeScript inheritance; also every ancestor config.
  const effective = new Map();
  const effectiveOf = (path, stack = []) => {
    if (effective.has(path)) return effective.get(path);
    const config = parsed.get(path);
    const result = { paths: null, baseUrl: null, ancestors: new Set(), problems: [] };
    if (stack.includes(path)) {
      result.problems.push(`${path}: unanalyzable (cyclic extends)`);
      return result;
    }
    const parents = config.extends === undefined ? [] : [].concat(config.extends);
    for (const entry of parents) {
      const parent = resolveExtends(path, entry);
      if (!parent) {
        result.problems.push(
          `${path}: unanalyzable extends ${JSON.stringify(entry)} (must be an existing relative in-repo file)`,
        );
        continue;
      }
      const inherited = effectiveOf(parent, [...stack, path]);
      result.problems.push(...inherited.problems);
      result.ancestors.add(parent);
      for (const ancestor of inherited.ancestors) result.ancestors.add(ancestor);
      result.paths = inherited.paths ?? result.paths;
      result.baseUrl = inherited.baseUrl ?? result.baseUrl;
    }
    const options = config.compilerOptions ?? {};
    if (options.baseUrl !== undefined) {
      if (typeof options.baseUrl !== 'string' || hasTemplate(options.baseUrl)) {
        result.problems.push(`${path}: unanalyzable baseUrl (template or non-string)`);
      } else {
        result.baseUrl = posix.normalize(posix.join(posix.dirname(path), options.baseUrl));
      }
    }
    if (options.paths !== undefined) {
      result.paths = { map: options.paths, dir: posix.dirname(path) };
    }
    if (stack.length === 0) effective.set(path, result);
    return result;
  };

  for (const path of [...parsed.keys()].sort()) {
    const config = parsed.get(path);
    const inherited = effectiveOf(path);
    problems.push(...inherited.problems);

    if (path === EXEMPT_CONFIG) {
      if (!deepEqual(config, EXEMPT_STRUCTURE)) {
        problems.push(
          `${path}: exact-structure violation; the producer-test configuration must match the approved content exactly`,
        );
      }
      continue;
    }
    if (inherited.ancestors.has(EXEMPT_CONFIG)) {
      problems.push(
        `${path}: inheritance of ${EXEMPT_CONFIG}, which only the producer tests may use`,
      );
    }
    if (inherited.baseUrl !== null && forbiddenRoot(inherited.baseUrl)) {
      problems.push(
        `${path}: baseUrl ${inherited.baseUrl} resolves into ${forbiddenRoot(inherited.baseUrl)}`,
      );
    }
    if (!inherited.paths) continue;
    const { map, dir } = inherited.paths;
    if (!map || typeof map !== 'object' || Array.isArray(map)) {
      problems.push(`${path}: paths must be an object`);
      continue;
    }
    for (const [key, targets] of Object.entries(map)) {
      if (hasTemplate(key) || (Array.isArray(targets) && targets.some(hasTemplate))) {
        problems.push(`${path}: unanalyzable template in paths entry ${JSON.stringify(key)}`);
        continue;
      }
      if (!Array.isArray(targets) || !targets.every((target) => typeof target === 'string')) {
        problems.push(`${path}: paths entry ${JSON.stringify(key)} must be an array of strings`);
        continue;
      }
      if (lower(key) === PACKAGE_KEY || lower(key).startsWith(`${PACKAGE_KEY}/`)) {
        problems.push(
          `${path}: paths key ${JSON.stringify(key)} shadows ${PACKAGE_KEY} (key shadowing; only ${EXEMPT_CONFIG} may, non-exempt config)`,
        );
      }
      for (const target of targets) {
        const cut = target.split('*')[0];
        const base = inherited.baseUrl ?? dir;
        const resolved = posix
          .normalize(posix.join(base, cut === '' ? '.' : cut))
          .replace(/\/$/, '');
        const hit = forbiddenRoot(resolved);
        if (hit) {
          problems.push(
            `${path}: paths target ${JSON.stringify(target)} resolves into ${hit} (target); only ${EXEMPT_CONFIG} may map atomic source (non-exempt config)`,
          );
        }
      }
    }
  }
  return problems;
}

/** Reads the configurations the gate covers: root, every tsconfig*.json under projects/, e2e. */
export function collectConfigs(root) {
  const walk = (dir) =>
    readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      return statSync(path).isDirectory() ? walk(path) : [path];
    });
  const found = [
    'tsconfig.json',
    'e2e/tsconfig.json',
    ...walk(join(root, 'projects')).map((path) => relative(root, path).split('\\').join('/')),
  ].filter((path) => /(?:^|\/)tsconfig[\w.]*\.json$/.test(path) && existsSync(join(root, path)));
  return new Map(found.map((path) => [path, readFileSync(join(root, path), 'utf8')]));
}
