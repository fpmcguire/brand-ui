# ui

This is the `ui` library of the `brand-ui` reference spike: four standalone Angular components (`Button`, `TextInput`, `Card`, `Navigation`) and a small theme facility (`ThemeService`, `ThemeScopeDirective`) driven by `--bui-*` CSS custom properties.

## Atomic Design in the Card

The `Card` is built with **Atomic Design**, a way of organizing a user interface from small parts into larger compositions: atoms combine into molecules, and atoms and molecules combine into an organism, a distinct section that owns its behaviour.

- **Atoms:** `Tag`, `SkeletonBlock` and `CodeWell`.
- **Molecules:** `MediaArea` and `LoadingSkeleton`.
- **Organism:** `Card`, the existing `bui-card`. It composes the atoms and molecules and keeps its inputs, title heading, single link and loading state.

These parts come from the separately built and installed `@brand-ui/atomic` package, imported from its `@brand-ui/atomic/atoms`, `@brand-ui/atomic/molecules` and `@brand-ui/atomic/organisms` entry points. `ui` imports `Card` from `@brand-ui/atomic/organisms` and re-exports that same class from its public entry point, so `import { Card } from 'ui'` is unchanged and `Card` does not exist as two separate implementations.

`ui` still exports four components. `Button`, `TextInput` and `Navigation` are established `ui` components defined here and were not moved. The atomic parts are public through `@brand-ui/atomic`, not through `ui`. This describes how the `Card` is organised and makes no claim about performance, accessibility or maintainability.

## Build and install

`ui` declares `@brand-ui/atomic` (`^1.1.0`) as a peer dependency. In this workspace the root `package.json` installs it from the committed archive `package-artifacts/brand-ui-atomic-1.1.0.tgz` as a file dependency, so `npm ci` provides it without a prior build and without a registry.

`npm run build` from the repository root builds `atomic`, then `ui`, then `gallery`. The package is built on its own and packed with `npm pack`; how the archive is built, packed and verified is described in the [root README](../../README.md#the-atomic-package-build-pack-and-install). Test and usage instructions are there too.

## Status

It is a study artefact. Neither `ui` nor `@brand-ui/atomic` is published, and there is no registry release process. The workspace is versioned 1.1.0 as an additive extension of the accepted 1.0.0 reference; that number is not a delivery.
