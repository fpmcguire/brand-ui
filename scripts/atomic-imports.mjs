// Module-boundary scanning for the @brand-ui/atomic gates (AC-23, D-12).
//
// Specifiers come from the TypeScript parser, not from patterns, so every import form is seen:
// static imports, re-exports, side-effect imports, dynamic import(), import-equals, require(),
// require.resolve(), import types, and triple-slash references. A specifier that is not a string
// literal cannot be analyzed and is reported as a problem.
import { dirname, isAbsolute, posix, relative, resolve } from 'node:path';
import ts from 'typescript';

/** @returns {{ specifiers: string[], problems: string[] }} */
export function moduleSpecifiers(fileName, source) {
  const file = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true);
  const specifiers = [];
  const problems = [];
  if (file.parseDiagnostics?.length) problems.push(`${fileName}: does not parse`);

  const literal = (node, form) => {
    if (node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))) {
      specifiers.push(node.text);
    } else problems.push(`${fileName}: ${form} with a non-literal specifier cannot be analyzed`);
  };
  const isRequire = (node) =>
    ts.isIdentifier(node) ? node.text === 'require' : isRequireResolve(node);
  const isRequireResolve = (node) =>
    ts.isPropertyAccessExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === 'require' &&
    node.name.text === 'resolve';

  const visit = (node) => {
    if (ts.isImportDeclaration(node)) literal(node.moduleSpecifier, 'import');
    else if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      literal(node.moduleSpecifier, 'export-from');
    } else if (ts.isImportEqualsDeclaration(node)) {
      if (ts.isExternalModuleReference(node.moduleReference)) {
        literal(node.moduleReference.expression, 'import-equals');
      }
    } else if (ts.isCallExpression(node)) {
      if (node.expression.kind === ts.SyntaxKind.ImportKeyword) {
        literal(node.arguments[0], 'dynamic import()');
      } else if (isRequire(node.expression)) literal(node.arguments[0], 'require()');
    } else if (ts.isImportTypeNode(node)) {
      const argument = node.argument;
      literal(ts.isLiteralTypeNode(argument) ? argument.literal : undefined, 'import type');
    }
    ts.forEachChild(node, visit);
  };
  visit(file);

  for (const reference of [
    ...file.referencedFiles,
    ...file.typeReferenceDirectives,
    ...file.libReferenceDirectives,
  ]) {
    specifiers.push(reference.fileName);
  }
  return { specifiers, problems };
}

const isRelativeSpecifier = (specifier) =>
  /^\.{1,2}(?:[\\/]|$)/.test(specifier) || isAbsolute(specifier) || /^file:/i.test(specifier);

const inside = (parent, child) => {
  const path = relative(parent.toLowerCase(), child.toLowerCase());
  return path === '' || (!path.startsWith('..') && !isAbsolute(path));
};

/** Problems for one consumer source file (`file` is absolute): nothing may reach atomic source. */
export function consumerImportProblems(rootDir, file, source) {
  const forbidden = [resolve(rootDir, 'projects/atomic'), resolve(rootDir, 'dist/atomic')];
  const name = relative(rootDir, file);
  const { specifiers, problems } = moduleSpecifiers(name, source);
  for (const specifier of specifiers) {
    if (isRelativeSpecifier(specifier)) {
      const target = resolve(dirname(file), specifier.replace(/^file:\/*/i, ''));
      if (forbidden.some((dir) => inside(dir, target))) {
        problems.push(`${name}: imports atomic source or output through ${specifier}`);
      }
    } else if (/(?:^|[\\/])(?:projects|dist)[\\/]atomic(?:[\\/]|$)/.test(specifier)) {
      problems.push(`${name}: imports atomic source or output through ${specifier}`);
    }
  }
  return problems;
}

const packageName = (specifier) =>
  specifier.split('/', specifier.startsWith('@') ? 2 : 1).join('/');

/**
 * Problems for one built package file. Bare specifiers must name an approved package (the exact
 * manifest dependency/peer set, or the package's own entry points); relative specifiers must stay
 * inside the archive inventory. Returns the approved bare package names it imported in `used`.
 */
export function outputImportProblems(
  path,
  source,
  { approved, own, entryPoints, inventory, used },
) {
  const { specifiers, problems } = moduleSpecifiers(path, source);
  for (const specifier of specifiers) {
    if (/^\.{1,2}\//.test(specifier)) {
      if (!inventory.has(posix.join(posix.dirname(path), specifier))) {
        problems.push(`${path}: relative import ${specifier} leaves the archive inventory`);
      }
      continue;
    }
    const name = packageName(specifier);
    const subpath = specifier.slice(name.length + 1);
    if (name === own) {
      if (subpath && !entryPoints.includes(subpath)) {
        problems.push(`${path}: imports unapproved package entry ${specifier}`);
      }
    } else if (
      /^[@a-z0-9]/i.test(specifier) &&
      !/^[a-z]+:/i.test(specifier) &&
      approved.includes(name)
    ) {
      used?.add(name);
    } else
      problems.push(`${path}: imports ${specifier}, which is not in the approved manifest set`);
  }
  return problems;
}
