// Strict reader for the reviewed `npm pack` archive of @brand-ui/atomic (AC-22, D-12).
//
// Accounts for the complete gzip and tar stream and returns the single effective file inventory
// that every archive gate uses. Anything it cannot account for is an error, never ignored:
//   - gzip: a ten-byte header whose every field is validated (no name/comment/extra fields, MTIME
//     zero, XFL and OS from the defined values), a deflate stream that ends exactly where the
//     CRC32/size trailer begins, and nothing after the trailer;
//   - tar: bounded entries; every byte of every 512-byte header is accounted for: canonical
//     numeric formats, approved mode and mtime, empty owner names and link name, zero device
//     numbers, canonical ustar magic and version, NUL-clean name and prefix, and a zero tail;
//     zero padding, a zero-block terminator and nothing but zeros after it;
//   - PAX: extended headers parsed by their declared record lengths, only `path` (the effective
//     path) and volatile timestamp/owner fields are approved; global headers and every other field
//     are rejected; the carrier header is itself constrained: empty prefix and the name npm
//     derives from the entry it extends, and the extended entry's own name must be a truncation of
//     the effective path;
//   - effective paths: safe, relative, and unique.
import { crc32, inflateRawSync } from 'node:zlib';

const BLOCK = 512;
const MAX_PAX_BYTES = 1 << 20;
const SAFE_PATH = /^[\w@.+-]+(?:\/[\w@.+-]+)*$/;
// Volatile PAX fields that are normalized away; each value must still match its strict shape.
const VOLATILE_PAX = {
  mtime: /^\d{1,12}(?:\.\d{1,9})?$/,
  atime: /^\d{1,12}(?:\.\d{1,9})?$/,
  ctime: /^\d{1,12}(?:\.\d{1,9})?$/,
  uid: /^\d{1,10}$/,
  gid: /^\d{1,10}$/,
  uname: /^[\w.-]{0,32}$/,
  gname: /^[\w.-]{0,32}$/,
};
// Normalized gzip header values: deflate "maximum"/"fastest" hints and any RFC 1952 OS code.
const GZIP_XFL = new Set([0, 2, 4]);
const GZIP_MAX_OS = 13;
const GZIP_UNKNOWN_OS = 255;
// Normalized tar header values: npm's portable pack transform `(mode | 0600) & ~0022` applied to
// every possible permission set (owner always rw, group/other never write), and npm's fixed
// 1985-10-26T08:15:00Z mtime.
const TAR_MODES = new Set(Array.from({ length: 0o1000 }, (_, mode) => (mode | 0o600) & ~0o022));
const TAR_MTIMES = new Set([0, 499162500]);

const fail = (message) => {
  throw new Error(message);
};

function gunzipStrict(buffer) {
  if (buffer.length < 18 || buffer[0] !== 0x1f || buffer[1] !== 0x8b || buffer[2] !== 8) {
    fail('not a gzip stream');
  }
  if (buffer[3] !== 0) fail('gzip header carries name, comment, extra or checksum fields');
  if (buffer.readUInt32LE(4) !== 0) fail('gzip header MTIME is not zero');
  if (!GZIP_XFL.has(buffer[8])) fail(`gzip header XFL ${buffer[8]} is not an approved value`);
  if (buffer[9] > GZIP_MAX_OS && buffer[9] !== GZIP_UNKNOWN_OS) {
    fail(`gzip header OS ${buffer[9]} is not a defined value`);
  }
  let result;
  try {
    result = inflateRawSync(buffer.subarray(10), { info: true });
  } catch (error) {
    fail(`gzip deflate stream is invalid: ${error.message}`);
  }
  const tar = result.buffer;
  // The deflate stream must end exactly where the 8-byte trailer begins.
  const trailer = 10 + result.engine.bytesWritten;
  if (trailer + 8 > buffer.length) fail('gzip trailer is truncated');
  if (
    buffer.readUInt32LE(trailer) !== crc32(tar) ||
    buffer.readUInt32LE(trailer + 4) !== tar.length % 2 ** 32
  ) {
    fail('gzip trailer does not match the decompressed stream (data between deflate and trailer)');
  }
  if (trailer + 8 !== buffer.length) fail('data after the gzip member (trailing data)');
  return tar;
}

// A NUL-terminated header field; bytes after the first NUL must also be NUL.
function field(header, from, length, label) {
  const bytes = header.subarray(from, from + length);
  const end = bytes.indexOf(0);
  if (end >= 0 && bytes.subarray(end).some((byte) => byte !== 0)) {
    fail(`tar header ${label} field has data after its terminator`);
  }
  return bytes.toString('latin1', 0, end >= 0 ? end : length);
}

// A canonical octal field: `length - 1` digits and a NUL, or `length - 2` digits and one of the
// given two-byte terminators (`bare: false` drops the NUL-only form). `blank` additionally allows
// an entirely NUL field (value 0).
function numeric(
  header,
  from,
  length,
  label,
  { blank = false, terminators = [' \0'], bare = true } = {},
) {
  const bytes = header.subarray(from, from + length);
  if (blank && bytes.every((byte) => byte === 0)) return 0;
  const text = bytes.toString('latin1');
  const forms = [
    ...(bare ? [['\0', length - 1]] : []),
    ...terminators.map((end) => [end, length - 2]),
  ];
  for (const [end, digits] of forms) {
    if (text.endsWith(end) && new RegExp(`^[0-7]{${digits}}$`).test(text.slice(0, digits))) {
      return parseInt(text.slice(0, digits), 8);
    }
  }
  return fail(`malformed ${label}`);
}

function validatePath(path, label) {
  if (!SAFE_PATH.test(path) || path.split('/').some((part) => part === '.' || part === '..')) {
    fail(`${label} path ${JSON.stringify(path)} is not a safe relative archive path`);
  }
  return path;
}

function parsePax(data) {
  const records = new Map();
  let position = 0;
  while (position < data.length) {
    const prefix = /^([1-9]\d{0,6}) /.exec(data.toString('latin1', position, position + 9));
    if (!prefix) fail('malformed PAX record length');
    const length = Number(prefix[1]);
    if (length <= prefix[0].length + 1 || position + length > data.length) {
      fail('PAX record length is out of bounds');
    }
    if (data[position + length - 1] !== 0x0a)
      fail('PAX record does not end at its declared length');
    const body = data.toString('utf8', position + prefix[0].length, position + length - 1);
    const separator = body.indexOf('=');
    if (separator < 1) fail('malformed PAX record');
    const key = body.slice(0, separator);
    if (records.has(key)) fail(`duplicate PAX field ${key}`);
    records.set(key, body.slice(separator + 1));
    position += length;
  }
  return records;
}

function effectiveOverrides(records) {
  let path;
  for (const [key, value] of records) {
    if (key === 'path') path = validatePath(value, 'PAX');
    else if (VOLATILE_PAX[key]?.test(value) !== true) {
      fail(`unsupported PAX field ${key} (only path and volatile timestamp/owner fields)`);
    }
  }
  return { path };
}

// Validates every byte of a header block and returns its name and prefix.
function checkHeader(header) {
  let sum = 0;
  for (let index = 0; index < BLOCK; index++) {
    sum += index >= 148 && index < 156 ? 0x20 : header[index];
  }
  // The checksum field is conventionally `NNNNNN\0 `; some writers emit `NNNNNN \0`.
  const stored = numeric(header, 148, 8, 'checksum', {
    terminators: ['\0 ', ' \0'],
    bare: false,
  });
  if (stored !== sum) fail('tar header checksum mismatch');
  if (header.toString('latin1', 257, 263) !== 'ustar\0') {
    fail('tar header lacks canonical ustar magic (ustar and NUL)');
  }
  if (header.toString('latin1', 263, 265) !== '00')
    fail('tar header has noncanonical ustar version');

  const mode = numeric(header, 100, 8, 'mode');
  if (!TAR_MODES.has(mode)) fail(`tar header mode ${mode.toString(8)} is not approved`);
  const mtime = numeric(header, 136, 12, 'mtime');
  if (!TAR_MTIMES.has(mtime)) fail(`tar header mtime ${mtime} is not approved`);
  for (const [from, length, label] of [
    [108, 8, 'uid'],
    [116, 8, 'gid'],
    [329, 8, 'devmajor'],
    [337, 8, 'devminor'],
  ]) {
    if (numeric(header, from, length, label, { blank: true }) !== 0) {
      fail(`tar header ${label} is not zero`);
    }
  }
  for (const [from, length, label] of [
    [157, 100, 'linkname'],
    [265, 32, 'uname'],
    [297, 32, 'gname'],
  ]) {
    if (header.subarray(from, from + length).some((byte) => byte !== 0)) {
      fail(`tar header ${label} is not empty`);
    }
  }
  if (header.subarray(500, BLOCK).some((byte) => byte !== 0)) fail('tar header tail is not empty');
  return {
    name: field(header, 0, 100, 'name'),
    prefix: field(header, 345, 155, 'prefix'),
  };
}

/** Parses an archive into Map<effective path, content>. Throws on anything unaccounted for. */
export function parseArchive(buffer) {
  const tar = gunzipStrict(buffer);
  const entries = new Map();
  const folded = new Set();
  let offset = 0;
  let pending;
  for (;;) {
    if (offset + BLOCK > tar.length) fail('archive ends without a terminator block');
    const header = tar.subarray(offset, offset + BLOCK);
    if (header.every((byte) => byte === 0)) {
      const rest = tar.subarray(offset);
      if (rest.some((byte) => byte !== 0)) fail('non-padding data after the archive terminator');
      if (rest.length < 2 * BLOCK) fail('archive terminator is truncated');
      if (pending) fail('extended header is not followed by an entry');
      return entries;
    }
    const { name, prefix } = checkHeader(header);
    const size = numeric(header, 124, 12, 'entry size');
    const start = offset + BLOCK;
    const padded = start + Math.ceil(size / BLOCK) * BLOCK;
    if (padded > tar.length) fail('truncated archive entry');
    if (tar.subarray(start + size, padded).some((byte) => byte !== 0)) {
      fail('entry padding is not zero');
    }
    const data = tar.subarray(start, start + size);
    const type = header[156];
    offset = padded;

    if (type === 0x67) fail('global PAX metadata is not approved');
    if (type === 0x78) {
      if (pending) fail('consecutive extended headers');
      if (size > MAX_PAX_BYTES) fail('extended header is too large');
      if (prefix) fail('PAX carrier header prefix is not empty');
      pending = { ...effectiveOverrides(parsePax(data)), carrier: name };
      continue;
    }
    if (type !== 0x30 && type !== 0) {
      fail(`unexpected entry type ${JSON.stringify(String.fromCharCode(type))}`);
    }
    const headerPath = prefix ? `${prefix}/${name}` : name;
    let path;
    if (pending?.path !== undefined) {
      // The entry's own name is shadowed by the PAX path, so it may only be a truncation of it.
      if (!headerPath || !pending.path.startsWith(headerPath)) {
        fail('entry header name is not a truncation of its PAX path');
      }
      path = pending.path;
    } else {
      path = validatePath(headerPath, 'entry');
    }
    if (pending) {
      // npm names the carrier after the entry it extends (cut to fit the 100-byte name field).
      const expected = `PaxHeader/${path.slice(path.lastIndexOf('/') + 1)}`;
      if (pending.carrier !== expected.slice(0, 99) && pending.carrier !== expected.slice(0, 100)) {
        fail(`PAX carrier header name ${JSON.stringify(pending.carrier)} does not match its entry`);
      }
    }
    pending = undefined;
    if (entries.has(path) || folded.has(path.toLowerCase()))
      fail(`duplicate effective path ${path}`);
    folded.add(path.toLowerCase());
    entries.set(path, Buffer.from(data));
  }
}
