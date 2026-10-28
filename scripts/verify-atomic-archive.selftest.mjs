// Self-test for the atomic archive and module-boundary scanners. Every former bypass must be
// rejected, and the clean cases must still pass. Runs without building or touching the repository.
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { crc32, deflateRawSync, gzipSync } from 'node:zlib';
import { parseArchive } from './atomic-archive.mjs';
import { consumerImportProblems, outputImportProblems } from './atomic-imports.mjs';
import { EXEMPT_CONFIG, tsconfigPathProblems } from './atomic-tsconfig.mjs';
import { sanitizeAtomicDist } from './sanitize-atomic-dist.mjs';

// --- tar fixture writer ------------------------------------------------------------------------
const pad = (buffer) => Buffer.concat([buffer, Buffer.alloc((512 - (buffer.length % 512)) % 512)]);

function header(name, size, type = '0', overrides = {}) {
  const block = Buffer.alloc(512);
  const put = (text, from) => block.write(text, from, 'latin1');
  put(name, 0);
  put('0000644', 100);
  put('0000000', 108);
  put('0000000', 116);
  put((overrides.size ?? size.toString(8).padStart(11, '0')).slice(0, 12), 124);
  put('00000000000', 136);
  block.write(type, 156, 'latin1');
  put('ustar', 257);
  put('00', 263);
  if (overrides.linkname) put(overrides.linkname, 157);
  if (overrides.prefix) put(overrides.prefix, 345);
  // Mutations land before the checksum is computed, so the header stays checksum-valid and
  // reaches the validator the fixture is named for.
  overrides.mutate?.(block);
  put('        ', 148);
  let sum = 0;
  for (const byte of block) sum += byte;
  put(`${sum.toString(8).padStart(6, '0')}\0 `, 148);
  if (overrides.checksum) put(overrides.checksum, 148);
  return block;
}

const entry = (name, content, type = '0', overrides = {}) => {
  const data = Buffer.from(content);
  return Buffer.concat([header(name, data.length, type, overrides), pad(data)]);
};

const record = (key, value) => {
  const body = ` ${key}=${value}\n`;
  let length = body.length + 1;
  while (String(length).length + body.length !== length)
    length = String(length).length + body.length;
  return `${length}${body}`;
};
// An extended header as npm writes it: named after the entry it extends (`target`).
const pax = (target, records, overrides = {}) =>
  entry(
    `PaxHeader/${target.slice(target.lastIndexOf('/') + 1)}`.slice(0, 99),
    records.map(([k, v]) => record(k, v)).join(''),
    'x',
    overrides,
  );

const END = Buffer.alloc(1024);
const tgz = (...parts) => gzipSync(Buffer.concat([...parts, END]));
const file = (name, text = 'export {};\n') => entry(name, text);

// --- archive cases -----------------------------------------------------------------------------
// Every rejected case names the validator it must reach: header mutations are checksum-valid and
// gzip mutations are trailer-valid, so only the named validator can reject them.
const longName = `package/fesm2022/${'a'.repeat(120)}.mjs`;
const reseal = (block, tail = '\0 ') => {
  block.write('        ', 148, 'latin1');
  let sum = 0;
  for (const byte of block) sum += byte;
  block.write(`${sum.toString(8).padStart(6, '0')}${tail}`, 148, 'latin1');
  return block;
};
// A one-file archive whose entry header is mutated before its checksum is computed.
const mutated = (mutate, name = 'package/a.mjs') => tgz(entry(name, 'x', '0', { mutate }));
// A valid archive with one gzip header byte replaced (the CRC32/size trailer stays correct).
const gzipByte = (index, value) => () => {
  const data = tgz(file('package/a.mjs'));
  data[index] = value;
  return data;
};
// The gzip header and tar header fields exactly as the reviewed `npm pack` archive writes them.
const npmHeader = Buffer.from([0x1f, 0x8b, 8, 0, 0, 0, 0, 0, 2, 0xff]);
const gzipMember = (tar, between = Buffer.alloc(0)) => {
  const trailer = Buffer.alloc(8);
  trailer.writeUInt32LE(crc32(tar), 0);
  trailer.writeUInt32LE(tar.length, 4);
  return Buffer.concat([npmHeader, deflateRawSync(tar), between, trailer]);
};
const npmStyleEntry = () => {
  const block = entry('package/a.mjs', 'x', '0', {
    mutate: (header) => {
      header.fill(0, 100, 148);
      header.write('000644 ', 100, 'latin1');
      header.write('0000000001 ', 124, 'latin1');
      header.write('3560116604 ', 136, 'latin1');
      header.fill(0, 329, 345);
      header.write('000000 ', 329, 'latin1');
      header.write('000000 ', 337, 'latin1');
    },
  });
  reseal(block.subarray(0, 512), ' \0');
  return block;
};

const cases = [
  ['accepted', 'plain archive', () => tgz(file('package/a.mjs')), true],
  [
    'accepted',
    'npm pack header format (gzip XFL 2/OS 255, padded octal fields, space-NUL terminators)',
    () => gzipMember(Buffer.concat([npmStyleEntry(), END])),
    (entries) => entries.get('package/a.mjs')?.toString() === 'x',
  ],
  [
    'accepted',
    'mode 0600 from the portable pack transform (checksum recomputed)',
    () => mutated((header) => header.write('0000600', 100, 'latin1')),
    (entries) => entries.has('package/a.mjs'),
  ],
  [
    'accepted',
    'mode 0755 from the portable pack transform (checksum recomputed)',
    () => mutated((header) => header.write('0000755', 100, 'latin1')),
    (entries) => entries.has('package/a.mjs'),
  ],
  [
    'accepted',
    'name and prefix split',
    () => tgz(entry('a.mjs', 'x', '0', { prefix: 'package' })),
    (entries) => entries.has('package/a.mjs'),
  ],
  [
    'accepted',
    'PAX path override',
    () => tgz(pax(longName, [['path', longName]]), file(longName.slice(0, 100))),
    (entries) => entries.has(longName) && entries.size === 1,
  ],
  [
    'accepted',
    'approved volatile PAX fields',
    () =>
      tgz(
        pax('package/a.mjs', [
          ['mtime', '1700000000.5'],
          ['uid', '0'],
          ['uname', 'npm'],
        ]),
        file('package/a.mjs'),
      ),
    (entries) => entries.has('package/a.mjs'),
  ],
  [
    'rejected',
    'global PAX metadata',
    () => tgz(entry('g', record('comment', 'secret'), 'g'), file('package/a.mjs')),
    /global PAX/,
  ],
  [
    'rejected',
    'unsupported PAX field',
    () => tgz(pax('package/a.mjs', [['comment', 'AKIAEXAMPLE']]), file('package/a.mjs')),
    /unsupported PAX field comment/,
  ],
  [
    'rejected',
    'unsupported PAX linkpath',
    () => tgz(pax('package/a.mjs', [['linkpath', '/etc/passwd']]), file('package/a.mjs')),
    /unsupported PAX field linkpath/,
  ],
  [
    'rejected',
    'PAX size override',
    () => tgz(pax('package/a.mjs', [['size', '0']]), file('package/a.mjs')),
    /unsupported PAX field size/,
  ],
  [
    'rejected',
    'volatile PAX field with free text',
    () => tgz(pax('package/a.mjs', [['uname', 'x'.repeat(40)]]), file('package/a.mjs')),
    /unsupported PAX field uname/,
  ],
  [
    'rejected',
    'duplicate PAX field',
    () =>
      tgz(
        pax('package/a.mjs', [
          ['mtime', '1'],
          ['mtime', '2'],
        ]),
        file('package/a.mjs'),
      ),
    /duplicate PAX field mtime/,
  ],
  [
    'rejected',
    'PAX record length lie',
    () => tgz(entry('PaxHeader/a.mjs', '99 path=package/x.mjs\n', 'x'), file('package/a.mjs')),
    /PAX record length is out of bounds/,
  ],
  [
    'rejected',
    'dangling PAX header',
    () => tgz(file('package/a.mjs'), pax('package/b.mjs', [['mtime', '1']])),
    /extended header is not followed by an entry/,
  ],
  [
    'rejected',
    'consecutive PAX headers',
    () =>
      tgz(
        pax('package/a.mjs', [['mtime', '1']]),
        pax('package/a.mjs', [['mtime', '1']]),
        file('package/a.mjs'),
      ),
    /consecutive extended headers/,
  ],
  [
    'rejected',
    'PAX carrier name hiding a source path',
    () =>
      tgz(entry('PaxHeader/projects/atomic/src', record('mtime', '1'), 'x'), file('package/a.mjs')),
    /PAX carrier header name "PaxHeader\/projects\/atomic\/src" does not match its entry/,
  ],
  [
    'rejected',
    'PAX carrier name hiding a secret',
    () => tgz(entry('PaxHeader/AKIAEXAMPLE', record('mtime', '1'), 'x'), file('package/a.mjs')),
    /PAX carrier header name "PaxHeader\/AKIAEXAMPLE" does not match its entry/,
  ],
  [
    'rejected',
    'PAX carrier name for a different entry',
    () => tgz(pax('package/other.mjs', [['mtime', '1']]), file('package/a.mjs')),
    /PAX carrier header name "PaxHeader\/other.mjs" does not match its entry/,
  ],
  [
    'rejected',
    'PAX carrier name with data after its terminator',
    () =>
      tgz(
        pax('package/a.mjs', [['mtime', '1']], {
          mutate: (header) => header.write('AKIAEXAMPLE', 30, 'latin1'),
        }),
        file('package/a.mjs'),
      ),
    /name field has data after its terminator/,
  ],
  [
    'rejected',
    'PAX carrier prefix hiding a source path',
    () =>
      tgz(
        pax('package/a.mjs', [['mtime', '1']], { prefix: 'projects/atomic/src' }),
        file('package/a.mjs'),
      ),
    /PAX carrier header prefix is not empty/,
  ],
  [
    'rejected',
    'PAX carrier owner name',
    () =>
      tgz(
        pax('package/a.mjs', [['mtime', '1']], {
          mutate: (header) => header.write('secret', 265, 'latin1'),
        }),
        file('package/a.mjs'),
      ),
    /tar header uname is not empty/,
  ],
  [
    'rejected',
    'entry name shadowed by a PAX path',
    () =>
      tgz(pax('package/a.mjs', [['path', 'package/a.mjs']]), file('projects/gallery/secret.mjs')),
    /entry header name is not a truncation of its PAX path/,
  ],
  [
    'rejected',
    'duplicate effective path',
    () => tgz(file('package/a.mjs'), file('package/a.mjs', 'export const x = 1;\n')),
    /duplicate effective path package\/a.mjs/,
  ],
  [
    'rejected',
    'duplicate via PAX path',
    () =>
      tgz(
        file('package/a.mjs'),
        pax('package/a.mjs', [['path', 'package/a.mjs']]),
        file('package/a'),
      ),
    /duplicate effective path package\/a.mjs/,
  ],
  [
    'rejected',
    'case-folded duplicate path',
    () => tgz(file('package/a.mjs'), file('package/A.mjs')),
    /duplicate effective path package\/A.mjs/,
  ],
  [
    'rejected',
    'non-zero payload after the terminator',
    () =>
      gzipSync(Buffer.concat([file('package/a.mjs'), END, entry('package/secret.txt', 'AKIA')])),
    /non-padding data after the archive terminator/,
  ],
  [
    'rejected',
    'payload between zero blocks',
    () =>
      gzipSync(
        Buffer.concat([
          file('package/a.mjs'),
          Buffer.alloc(512),
          entry('package/secret.txt', 'x'),
          Buffer.alloc(1024),
        ]),
      ),
    /non-padding data after the archive terminator/,
  ],
  [
    'rejected',
    'second gzip member',
    () => Buffer.concat([tgz(file('package/a.mjs')), tgz(file('package/b.mjs'))]),
    /data after the gzip member/,
  ],
  [
    'rejected',
    'bytes after the gzip member',
    () => Buffer.concat([tgz(file('package/a.mjs')), Buffer.alloc(16)]),
    /data after the gzip member/,
  ],
  [
    'rejected',
    'bytes between the deflate stream and the gzip trailer',
    () => gzipMember(Buffer.concat([file('package/a.mjs'), END]), Buffer.from('HIDDENSECRET')),
    /gzip trailer does not match the decompressed stream/,
  ],
  [
    'rejected',
    'truncated gzip trailer',
    () => tgz(file('package/a.mjs')).subarray(0, -4),
    /gzip trailer is truncated/,
  ],
  [
    'rejected',
    'missing terminator',
    () => gzipSync(file('package/a.mjs')),
    /archive ends without a terminator block/,
  ],
  [
    'rejected',
    'short terminator',
    () => gzipSync(Buffer.concat([file('package/a.mjs'), Buffer.alloc(512)])),
    /archive terminator is truncated/,
  ],
  [
    'rejected',
    'truncated entry',
    () => gzipSync(Buffer.concat([header('package/a.mjs', 2000), Buffer.alloc(700)])),
    /truncated archive entry/,
  ],
  [
    'rejected',
    'missing entry padding',
    () => gzipSync(Buffer.concat([header('package/a.mjs', 5), Buffer.from('hello')])),
    /truncated archive entry/,
  ],
  [
    'rejected',
    'non-zero entry padding',
    () => {
      const data = file('package/a.mjs');
      data[512 + 20] = 0x41;
      return tgz(data);
    },
    /entry padding is not zero/,
  ],
  [
    'rejected',
    'malformed size',
    () => tgz(entry('package/a.mjs', 'x', '0', { size: 'zzzz' })),
    /malformed entry size/,
  ],
  [
    'rejected',
    'base-256 size (checksum recomputed)',
    () =>
      mutated((header) => {
        header[124] = 0x80;
      }),
    /malformed entry size/,
  ],
  [
    'rejected',
    'size with a leading space',
    () => tgz(entry('package/a.mjs', 'x', '0', { size: ' 0000000001' })),
    /malformed entry size/,
  ],
  [
    'rejected',
    'bad header checksum',
    () => tgz(entry('package/a.mjs', 'x', '0', { checksum: '000001\0 ' })),
    /tar header checksum mismatch/,
  ],
  [
    'rejected',
    'noncanonical checksum field',
    () => tgz(entry('package/a.mjs', 'x', '0', { checksum: '0000001\0' })),
    /malformed checksum/,
  ],
  [
    'rejected',
    'data hidden in linkname',
    () => tgz(entry('package/a.mjs', 'x', '0', { linkname: 'AKIAEXAMPLE' })),
    /tar header linkname is not empty/,
  ],
  [
    'rejected',
    'data hidden in the header tail (checksum recomputed)',
    () =>
      mutated((header) => {
        header[505] = 1;
      }),
    /tar header tail is not empty/,
  ],
  [
    'rejected',
    'ustar magic terminator (checksum recomputed)',
    () =>
      mutated((header) => {
        header[262] = 0x58;
      }),
    /lacks canonical ustar magic/,
  ],
  [
    'rejected',
    'GNU space-padded ustar magic (checksum recomputed)',
    () =>
      mutated((header) => {
        header.write('  ', 262, 'latin1');
        header[264] = 0;
      }),
    /lacks canonical ustar magic/,
  ],
  [
    'rejected',
    'ustar version (checksum recomputed)',
    () => mutated((header) => header.write('ZZ', 263, 'latin1')),
    /noncanonical ustar version/,
  ],
  [
    'rejected',
    'unapproved mode (checksum recomputed)',
    () => mutated((header) => header.write('7777777', 100, 'latin1')),
    /tar header mode 7777777 is not approved/,
  ],
  [
    'rejected',
    'group-writable mode the pack transform removes (checksum recomputed)',
    () => mutated((header) => header.write('0000664', 100, 'latin1')),
    /tar header mode 664 is not approved/,
  ],
  [
    'rejected',
    'owner read-only mode the pack transform raises (checksum recomputed)',
    () => mutated((header) => header.write('0000400', 100, 'latin1')),
    /tar header mode 400 is not approved/,
  ],
  [
    'rejected',
    'non-octal mode (checksum recomputed)',
    () => mutated((header) => header.write('ABCDEFG', 100, 'latin1')),
    /malformed mode/,
  ],
  [
    'rejected',
    'data hidden in uid (checksum recomputed)',
    () => mutated((header) => header.write('0001750', 108, 'latin1')),
    /tar header uid is not zero/,
  ],
  [
    'rejected',
    'data hidden in gid (checksum recomputed)',
    () => mutated((header) => header.write('0000001', 116, 'latin1')),
    /tar header gid is not zero/,
  ],
  [
    'rejected',
    'data hidden in mtime (checksum recomputed)',
    () => mutated((header) => header.write('00000000123', 136, 'latin1')),
    /tar header mtime 83 is not approved/,
  ],
  [
    'rejected',
    'data hidden in uname (checksum recomputed)',
    () => mutated((header) => header.write('secret', 265, 'latin1')),
    /tar header uname is not empty/,
  ],
  [
    'rejected',
    'data hidden in gname (checksum recomputed)',
    () => mutated((header) => header.write('secret', 297, 'latin1')),
    /tar header gname is not empty/,
  ],
  [
    'rejected',
    'data hidden in devmajor (checksum recomputed)',
    () => mutated((header) => header.write('0000001', 329, 'latin1')),
    /tar header devmajor is not zero/,
  ],
  [
    'rejected',
    'data hidden in devminor (checksum recomputed)',
    () => mutated((header) => header.write('0000001', 337, 'latin1')),
    /tar header devminor is not zero/,
  ],
  [
    'rejected',
    'data after the name terminator (checksum recomputed)',
    () => mutated((header) => header.write('AKIAEXAMPLE', 20, 'latin1')),
    /tar header name field has data after its terminator/,
  ],
  [
    'rejected',
    'data after the prefix terminator (checksum recomputed)',
    () => mutated((header) => header.write('AKIAEXAMPLE', 360, 'latin1'), 'a.mjs'),
    /tar header prefix field has data after its terminator/,
  ],
  [
    'rejected',
    'unsafe parent path',
    () => tgz(file('package/../../x.mjs')),
    /not a safe relative archive path/,
  ],
  [
    'rejected',
    'absolute path',
    () => tgz(pax('package/a.mjs', [['path', '/etc/x']]), file('package/a.mjs')),
    /PAX path "\/etc\/x" is not a safe relative archive path/,
  ],
  [
    'rejected',
    'symlink entry',
    () => tgz(entry('package/a.mjs', '', '2')),
    /unexpected entry type "2"/,
  ],
  [
    'rejected',
    'GNU long name entry',
    () => tgz(entry('././@LongLink', 'x', 'L'), file('package/a.mjs')),
    /unexpected entry type "L"/,
  ],
  [
    'rejected',
    'gzip header name field',
    gzipByte(3, 8),
    /gzip header carries name, comment, extra or checksum fields/,
  ],
  ['rejected', 'gzip header MTIME (trailer valid)', gzipByte(4, 0x53), /gzip header MTIME/],
  ['rejected', 'gzip header MTIME high byte (trailer valid)', gzipByte(7, 0x53), /MTIME/],
  ['rejected', 'gzip header XFL (trailer valid)', gzipByte(8, 0x53), /gzip header XFL 83/],
  ['rejected', 'gzip header OS (trailer valid)', gzipByte(9, 0x53), /gzip header OS 83/],
  ['rejected', 'not gzip', () => Buffer.from('plain'), /not a gzip stream/],
];

let failures = 0;
const report = (message) => {
  failures++;
  console.error(`verify-atomic-archive selftest: ${message}`);
};

for (const [expectation, label, build, check] of cases) {
  let outcome;
  try {
    outcome = { entries: parseArchive(build()) };
  } catch (error) {
    outcome = { error: error.message };
  }
  if (expectation === 'accepted') {
    if (outcome.error) report(`${label} should be accepted but failed: ${outcome.error}`);
    else if (typeof check === 'function' && !check(outcome.entries))
      report(`${label}: wrong inventory`);
  } else if (!outcome.error) report(`${label} should be rejected but was accepted`);
  else if (!check.test(outcome.error))
    report(`${label} rejected for the wrong reason: ${outcome.error}`);
}

// Normalization: the reviewed archive format must be readable and path-keyed.
{
  const entries = parseArchive(tgz(file('package/a.mjs', 'one\n'), file('package/b.mjs', 'two\n')));
  if ([...entries.keys()].join() !== 'package/a.mjs,package/b.mjs')
    report('inventory order or paths');
}

// --- module-boundary cases ---------------------------------------------------------------------
const root = resolve('/repo');
const consumer = join(root, 'projects', 'ui', 'src', 'x.ts');
const target = '../../atomic/src/public-api';
const consumerRejected = [
  ['static import', `import { A } from '${target}';`],
  ['re-export', `export * from '${target}';`],
  ['named re-export', `export { A } from '${target}';`],
  ['side-effect import', `import '${target}';`],
  ['dynamic import()', `const m = await import('${target}');`],
  ['import-equals', `import a = require('${target}');`],
  ['require()', `const a = require('${target}');`],
  ['require.resolve()', `require.resolve('${target}');`],
  ['import type', `let a: import('${target}').A;`],
  ['type-only import', `import type { A } from '${target}';`],
  ['triple-slash reference', `/// <reference path="${target}.ts" />`],
  ['atomic output', `import '../../../dist/atomic/fesm2022/brand-ui-atomic.mjs';`],
  ['bare workspace path', `import { A } from 'projects/atomic/src/public-api';`],
  ['non-literal dynamic import', `import(name);`],
  ['non-literal require', `require(name);`],
];
for (const [label, source] of consumerRejected) {
  if (consumerImportProblems(root, consumer, source).length === 0) {
    report(`consumer ${label} into atomic source should be rejected`);
  }
}
for (const [label, source] of [
  ['installed package', `import { Card } from '@brand-ui/atomic';`],
  ['installed secondary entry point', `import { Card } from '@brand-ui/atomic/atoms';`],
  ['sibling relative import', `import { x } from './y'; export * from '../lib/z';`],
  ['dynamic installed import', `await import('@brand-ui/atomic/molecules');`],
]) {
  const problems = consumerImportProblems(root, consumer, source);
  if (problems.length) report(`consumer ${label} should be clean: ${problems.join('; ')}`);
}

const context = () => ({
  approved: ['tslib'],
  own: '@brand-ui/atomic',
  entryPoints: ['atoms', 'molecules', 'organisms'],
  inventory: new Set(['package/fesm2022/a.mjs', 'package/fesm2022/b.mjs']),
  used: new Set(),
});
const outputPath = 'package/fesm2022/a.mjs';
const outputRejected = [
  ['static ui import', `import { A } from 'ui';`],
  ['side-effect rxjs import', `import 'rxjs';`],
  ['dynamic router import', `import('@angular/router');`],
  ['undeclared Angular peer', `export { x } from '@angular/core';`],
  ['require of another package', `const a = require('left-pad');`],
  ['import-equals of another package', `import a = require('lodash');`],
  ['import type of another package', `export declare const a: import('rxjs').Observable<1>;`],
  ['node builtin', `import fs from 'node:fs';`],
  ['URL import', `import 'https://example.com/x.mjs';`],
  ['unapproved own entry', `import '@brand-ui/atomic/src';`],
  ['relative escape', `import '../../outside.mjs';`],
  ['non-literal dynamic import', `import(name);`],
];
for (const [label, source] of outputRejected) {
  if (outputImportProblems(outputPath, source, context()).length === 0) {
    report(`output ${label} should be rejected`);
  }
}
for (const [label, source] of [
  ['tslib', `import { __decorate } from 'tslib';`],
  ['tslib subpath', `import 'tslib/modules/index.js';`],
  ['own entry point', `export * from '@brand-ui/atomic/atoms';`],
  ['inventory sibling', `export * from './b.mjs';`],
  ['no imports', `export {};`],
]) {
  const problems = outputImportProblems(outputPath, source, context());
  if (problems.length) report(`output ${label} should be clean: ${problems.join('; ')}`);
}

// --- dist sanitizer cases ----------------------------------------------------------------------
const bundleNames = ['atoms', 'molecules', 'organisms'].map(
  (e) => `fesm2022/brand-ui-atomic-${e}.mjs`,
);
const bundleText = (name) =>
  `export {};\n\n//# sourceMappingURL=${name.slice(name.lastIndexOf('/') + 1)}.map`;
// Builds a dist directory from the clean layout, then lets the case change it.
function distFixture(change = () => {}) {
  const dir = mkdtempSync(join(tmpdir(), 'sanitize-selftest-'));
  const put = (name, text) => {
    mkdirSync(join(dir, name, '..'), { recursive: true });
    writeFileSync(join(dir, name), text);
  };
  put('package.json', '{}\n');
  put('fesm2022/brand-ui-atomic.mjs', 'export {};\n');
  put('types/brand-ui-atomic.d.ts', 'export {};\n');
  for (const name of bundleNames) {
    put(name, bundleText(name));
    put(`${name}.map`, '{}');
  }
  change({ dir, put });
  return dir;
}
const sanitizeCases = [
  [
    'missing map',
    ({ dir }) => rmSync(join(dir, `${bundleNames[0]}.map`)),
    /missing .*atoms\.mjs\.map/,
  ],
  [
    'additional map',
    ({ put }) => put('types/extra.d.ts.map', '{}'),
    /unexpected types\/extra\.d\.ts\.map/,
  ],
  [
    'missing reference',
    ({ put }) => put(bundleNames[1], 'export {};\n'),
    /expected exactly one sourceMappingURL, found 0/,
  ],
  [
    'duplicate reference',
    ({ put }) =>
      put(bundleNames[1], `${bundleText(bundleNames[1])}\n${bundleText(bundleNames[1])}`),
    /found 2/,
  ],
  [
    'non-terminal reference',
    ({ put }) => put(bundleNames[2], `${bundleText(bundleNames[2])}\nexport const a = 1;\n`),
    /malformed or not the terminal line/,
  ],
  [
    'malformed reference',
    ({ put }) =>
      put(bundleNames[0], 'export {};\n\n// sourceMappingURL=brand-ui-atomic-atoms.mjs.map'),
    /malformed or not the terminal line/,
  ],
  [
    'reference to another map',
    ({ put }) => put(bundleNames[0], 'export {};\n\n//# sourceMappingURL=other.mjs.map'),
    /not its own map/,
  ],
  [
    'reference in another file',
    ({ put }) => put('fesm2022/brand-ui-atomic.mjs', 'export {};\n//# sourceMappingURL=x.map\n'),
    /brand-ui-atomic\.mjs: contains a sourceMappingURL/,
  ],
];
for (const [label, change, expected] of sanitizeCases) {
  const dir = distFixture(change);
  try {
    sanitizeAtomicDist(dir);
    report(`sanitizer ${label} should be rejected`);
  } catch (error) {
    if (!expected.test(error.message))
      report(`sanitizer ${label} rejected for the wrong reason: ${error.message}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
{
  const dir = distFixture();
  try {
    const { removed } = sanitizeAtomicDist(dir);
    const left = readdirSync(join(dir, 'fesm2022')).sort().join();
    if (
      removed.length !== 3 ||
      left !==
        'brand-ui-atomic-atoms.mjs,brand-ui-atomic-molecules.mjs,brand-ui-atomic-organisms.mjs,brand-ui-atomic.mjs'
    ) {
      report(`sanitizer clean case left ${left}`);
    }
    for (const name of bundleNames) {
      if (readFileSync(join(dir, name), 'utf8') !== 'export {};\n')
        report(`sanitizer rewrote ${name} wrongly`);
    }
    if (readFileSync(join(dir, 'fesm2022/brand-ui-atomic.mjs'), 'utf8') !== 'export {};\n') {
      report('sanitizer touched an unrelated file');
    }
  } catch (error) {
    report(`sanitizer clean case should pass: ${error.message}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// --- tsconfig `paths` cases --------------------------------------------------------------------
const repoFile = (name) => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');
const rootConfig = repoFile('tsconfig.json');
const exemptConfig = repoFile(EXEMPT_CONFIG);
const pathsConfig = (paths, extra = {}, extend = '../../tsconfig.json') =>
  JSON.stringify({ extends: extend, compilerOptions: { paths, ...extra } });
const configs = (extra = {}) =>
  new Map([
    ['tsconfig.json', rootConfig],
    [EXEMPT_CONFIG, exemptConfig],
    ['projects/ui/tsconfig.lib.json', '{ "extends": "../../tsconfig.json" }'],
    ...Object.entries(extra),
  ]);
const exempt = JSON.parse(exemptConfig.replace(/\/\*[\s\S]*?\*\//g, ''));
const withExempt = (change) => {
  const copy = structuredClone(exempt);
  change(copy);
  return JSON.stringify(copy);
};
const tsconfigRejected = [
  [
    'N1 key shadowing with an atomic source target',
    {
      'projects/ui/tsconfig.x.json': pathsConfig({
        '@brand-ui/atomic/atoms': ['../atomic/atoms/src/public-api.ts'],
      }),
    },
    /key shadowing/,
  ],
  [
    'N1b the same key also reports its target',
    {
      'projects/ui/tsconfig.x.json': pathsConfig({
        '@brand-ui/atomic/atoms': ['../atomic/atoms/src/public-api.ts'],
      }),
    },
    /resolves into projects\/atomic/,
  ],
  [
    'N2 key shadowing with a harmless target',
    { 'projects/ui/tsconfig.x.json': pathsConfig({ '@brand-ui/atomic': ['./stubs/x.ts'] }) },
    /key shadowing/,
  ],
  [
    'N3 non-brand key to atomic source',
    {
      'projects/ui/tsconfig.x.json': pathsConfig({
        'atomic-parts': ['../../projects/atomic/atoms/src/public-api.ts'],
      }),
    },
    /resolves into projects\/atomic/,
    /key shadowing/,
  ],
  [
    'N4 wildcard to dist/atomic',
    { 'projects/ui/tsconfig.x.json': pathsConfig({ 'parts/*': ['../../dist/atomic/*'] }) },
    /resolves into dist\/atomic/,
  ],
  [
    'N5 non-brand key to the installed package',
    {
      'projects/ui/tsconfig.x.json': pathsConfig({
        'installed-atomic': ['../../node_modules/@brand-ui/atomic/types/brand-ui-atomic.d.ts'],
      }),
    },
    /"\.\.\/\.\.\/node_modules\/@brand-ui\/atomic\/types\/brand-ui-atomic\.d\.ts" resolves into node_modules\/@brand-ui\/atomic/,
    /key shadowing/,
  ],
  [
    'N5a wildcard to the installed package',
    {
      'projects/ui/tsconfig.x.json': pathsConfig({
        'installed-atomic/*': ['../../node_modules/@brand-ui/atomic/*'],
      }),
    },
    /resolves into node_modules\/@brand-ui\/atomic/,
  ],
  [
    'N5b nested config with a .. escape',
    {
      'projects/ui/tsconfig.x.json': pathsConfig({ a: ['../../node_modules/@brand-ui/atomic'] }),
    },
    /resolves into node_modules\/@brand-ui\/atomic/,
  ],
  [
    'N5c case variation',
    {
      'projects/ui/tsconfig.x.json': pathsConfig({ a: ['../../Node_Modules/@Brand-UI/Atomic'] }),
    },
    /resolves into node_modules\/@brand-ui\/atomic/,
  ],
  [
    'N5d baseUrl into the installed package',
    {
      'tsconfig.y.json': pathsConfig(
        { a: ['@brand-ui/atomic'] },
        { baseUrl: 'node_modules' },
        './tsconfig.json',
      ),
    },
    /resolves into node_modules\/@brand-ui\/atomic/,
  ],
  [
    'N5e inherited effective values',
    {
      'projects/ui/tsconfig.parent.json': pathsConfig({
        a: ['../../node_modules/@brand-ui/atomic'],
      }),
      'projects/ui/tsconfig.child.json': '{ "extends": "./tsconfig.parent.json" }',
    },
    /projects\/ui\/tsconfig\.child\.json: paths target .*resolves into node_modules/,
  ],
  [
    'N6 exempt file with a 4th key',
    {
      [EXEMPT_CONFIG]: withExempt((c) => {
        c.compilerOptions.paths['@brand-ui/atomic'] = ['./src/public-api.ts'];
      }),
    },
    /exact-structure/,
  ],
  [
    'N7 exempt file with a second target',
    {
      [EXEMPT_CONFIG]: withExempt((c) => {
        c.compilerOptions.paths['@brand-ui/atomic/atoms'].push('./x.ts');
      }),
    },
    /exact-structure/,
  ],
  [
    'N8 exempt file with baseUrl',
    {
      [EXEMPT_CONFIG]: withExempt((c) => {
        c.compilerOptions.baseUrl = '.';
      }),
    },
    /exact-structure/,
  ],
  [
    'N9 exempt file with an array extends',
    {
      [EXEMPT_CONFIG]: withExempt((c) => {
        c.extends = ['../../tsconfig.json'];
      }),
    },
    /exact-structure/,
  ],
  [
    'N10 exempt content copied elsewhere',
    { 'projects/ui/tsconfig.spec.json': exemptConfig },
    /non-exempt config/,
  ],
  [
    'N11 non-exempt config extending the exempt file',
    { 'projects/ui/tsconfig.z.json': '{ "extends": "../atomic/tsconfig.spec.json" }' },
    /inheritance/,
  ],
  [
    'N12 configDir template target',
    {
      'projects/ui/tsconfig.x.json': pathsConfig({
        a: ['$' + '{configDir}/../atomic/atoms/src/x.ts'],
      }),
    },
    /unanalyzable template/,
  ],
  [
    'N13 comments, trailing commas and a unicode-escaped key',
    {
      'projects/ui/tsconfig.x.json':
        '{ // "paths": {} is not here\n "compilerOptions": { /* "paths" */ "paths": { "\\u0040brand-ui/atomic/atoms": ["./a.ts",], }, }, }',
    },
    /key shadowing/,
  ],
  [
    'N14a missing extends',
    { 'projects/ui/tsconfig.x.json': '{ "extends": "./nope.json" }' },
    /unanalyzable extends/,
  ],
  [
    'N14b package-style extends',
    { 'projects/ui/tsconfig.x.json': '{ "extends": "@angular/x/tsconfig" }' },
    /unanalyzable extends/,
  ],
  [
    'N14c cyclic extends',
    {
      'projects/ui/tsconfig.a.json': '{ "extends": "./tsconfig.b.json" }',
      'projects/ui/tsconfig.b.json': '{ "extends": "./tsconfig.a.json" }',
    },
    /cyclic extends/,
  ],
];
for (const [label, extra, expected, notExpected] of tsconfigRejected) {
  const problems = tsconfigPathProblems(configs(extra));
  if (!problems.some((problem) => expected.test(problem))) {
    report(`tsconfig ${label} should be rejected for ${expected}: ${problems.join('; ')}`);
  } else if (notExpected && problems.some((problem) => notExpected.test(problem))) {
    report(`tsconfig ${label} must not be reported with ${notExpected}`);
  }
}
for (const [label, extra] of [
  ['the real root, the real exempt config and the real ui mapping', {}],
  [
    'configs without paths',
    { 'projects/ui/tsconfig.n.json': '{ "compilerOptions": { "strict": true } }' },
  ],
  [
    'a harmless local mapping',
    { 'projects/ui/tsconfig.m.json': pathsConfig({ '@app/*': ['./src/app/*'] }, { baseUrl: '.' }) },
  ],
]) {
  const problems = tsconfigPathProblems(configs(extra));
  if (problems.length) report(`tsconfig ${label} should be clean: ${problems.join('; ')}`);
}

if (failures) {
  console.error(`verify-atomic-archive selftest failed (${failures}).`);
  process.exit(1);
}
console.log(
  `verify-atomic-archive selftest passed (${cases.length} archive, ` +
    `${consumerRejected.length + 4} consumer, ${outputRejected.length + 5} output, ` +
    `${sanitizeCases.length + 1} sanitizer and ${tsconfigRejected.length + 3} tsconfig fixtures).`,
);
